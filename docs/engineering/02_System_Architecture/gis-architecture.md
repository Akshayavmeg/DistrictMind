---
Document Name: GIS Architecture
Document ID: ED-ARCH-GIS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# GIS Architecture

## 1. Purpose

This document defines the architecture of DistrictMind's geographic information system (GIS) capability — the Digital Twin foundation of M1. It covers how Telangana's geography is represented, stored, queried, and rendered, and establishes accuracy and performance requirements. Vendor/library selection remains Candidate per [technology-stack.md](../00_Engineering_Overview/technology-stack.md); this document defines the architectural shape those candidates must fit.

## 2. Telangana Geography

DistrictMind's M1 scope covers all districts within the Indian state of Telangana, with drill-down to their constituent mandals (per [constraints.md](../01_Requirements/constraints.md) Geographic Constraints and FR-007–FR-009). The exact administrative district/mandal count and boundary source are not yet confirmed (AS-001, unvalidated) and are a data-sourcing concern, not an architectural one — this document assumes boundary data, once sourced, is importable in a standard geospatial format (Section 6).

## 3. District Boundaries

Each district is represented as one or more polygon geometries (a district may be a single polygon or a multipolygon if it includes disconnected areas) with associated metadata (name, code, area) per FR-012. Boundary geometry is treated as reference data: versioned and auditable on change (system-requirements.md Data Requirements), not silently overwritten.

## 4. Mandal Boundaries

Mandals are represented identically to districts (polygon/multipolygon + metadata) with an explicit parent-district relationship, supporting the drill-down navigation in FR-009. The data model must support mandal boundaries nesting within (or at minimum being spatially consistent with) their parent district boundary.

## 5. Spatial Layers

The GIS architecture is organized as a set of independently toggleable layers rather than a single fused map image:

| Layer | Content | Milestone |
|---|---|---|
| Base layer | District boundaries | M1 |
| Drill-down layer | Mandal boundaries (shown within a selected district) | M1 |
| Indicator overlay layer(s) | Choropleth/heatmap representation of a selected indicator by district/mandal | M2 — Future |
| Risk layer | Risk-score visualization by district | M4 — Future |
| Scenario comparison layer | Baseline vs. projected state visualization | M5 — Future |

Layer independence is an architectural requirement so new overlay layers (M2+) can be added without altering the base/drill-down rendering logic — directly supporting Extensibility.

## 6. Coordinate Reference Systems (CRS)

Boundary source data may arrive in various coordinate reference systems depending on its origin (e.g., a projected CRS commonly used for Indian administrative data, or geographic WGS84). The architecture requires:
- A single canonical CRS (WGS84 / EPSG:4326, the de facto web-mapping standard) for storage and API exchange, so all consumers (frontend map rendering, spatial queries) work against one consistent system.
- Any boundary data imported in a different source CRS is reprojected to the canonical CRS during ingestion, not at render time, so reprojection cost is paid once, not per request.
- The specific target CRS (WGS84/EPSG:4326) is a **Proposed** default consistent with standard web-mapping practice, not yet formally confirmed via an architecture decision requiring stakeholder input on any government-mandated CRS.

## 7. GeoJSON / Vector Data

GeoJSON is the **Proposed** exchange format between backend and frontend for boundary geometry (consistent with [technology-stack.md](../00_Engineering_Overview/technology-stack.md) candidates and NFR-027's interoperability guidance). Source boundary files may arrive as shapefiles or other formats and are converted to GeoJSON (or the eventual database's native geometry type, serialized to GeoJSON at the API boundary) during ingestion.

## 8. Spatial Database

Per [database-architecture.md](database-architecture.md) AD-DB-001, spatial data is stored as an extension of the primary relational database rather than a separate spatial system. The spatial database (or extension) must support, at minimum: polygon/multipolygon storage, containment queries ("which mandal contains this point"), and intersection queries, per system-requirements.md GIS Requirements.

## 9. Map Rendering

Map rendering is a frontend responsibility ([frontend-architecture.md](frontend-architecture.md) Section 11), consuming boundary geometry served by the District GIS Engine backend component. The rendering library (Leaflet vs. Mapbox GL JS — both Candidate) is not selected here; this document requires that whichever is chosen support: vector layer rendering, smooth pan/zoom, and layer toggling (Section 5).

## 10. Spatial Queries

| Query Type | Purpose | Milestone |
|---|---|---|
| Containment | "Which mandal contains this coordinate?" (e.g., map click) | M1 |
| Boundary lookup by ID | Retrieve a specific district/mandal's geometry | M1 |
| Intersection | Support future overlay analysis (e.g., which districts intersect a hazard zone) | Future (milestone TBD, likely M4+) |
| Nearest/proximity | Not currently required by any documented FR/NFR | Not scoped |

## 11. Layer Management

Layer visibility, ordering, and styling are managed client-side (frontend), driven by data served from the backend. The backend does not pre-render map images; it serves geometry and attribute data, keeping rendering flexibility with the client — consistent with Separation of Concerns.

## 12. Geographic Filtering

Dashboard and analytics queries (M2 — Future) are geographically scoped by district/mandal identifier, using the same identifiers as the GIS layer, so a user's map selection and dashboard filter state remain consistent (single source of truth for "which district is currently selected").

## 13. District Selection

District/mandal selection (FR-008, FR-009) is a cross-cutting client state concern ([frontend-architecture.md](frontend-architecture.md) Section 6) — selecting a district on the map updates the same selection state consumed by dashboard, AI assistant, and future prediction/simulation views, avoiding duplicated or inconsistent "current district" state across features.

## 14. Map Interactions

Required interactions per FR-011: pan, zoom, select (click/tap a region). All interactions must remain responsive under the performance targets in Section 15; expensive operations triggered by interaction (e.g., re-fetching mandal boundaries on zoom-in) are debounced/throttled per [frontend-architecture.md](frontend-architecture.md) Section 18.

## 15. GIS Performance

- Target: sustain at least 30 FPS during pan/zoom on standard hardware (NFR-035, Initial Target / To Be Validated).
- Target: render the full set of Telangana districts and mandals without perceptible load delay (NFR-036).
- Architectural strategies to meet these targets:
  - **Geometry simplification**: serve simplified boundary geometry at low zoom levels (district overview) and full-detail geometry only when zoomed into a specific district/mandal, reducing the data volume rendered at any one time.
  - **Progressive/level-of-detail loading**: load mandal-level detail only for the currently selected district, not all mandals statewide at once.
  - **Client-side rendering optimization**: per [frontend-architecture.md](frontend-architecture.md) Section 18 (GIS layer optimization, memoization).
  - **Accurate but efficient geometry**: per the milestone brief's explicit instruction not to assume approximate shapes are acceptable, simplification must preserve boundary accuracy at the zoom levels where that boundary is the primary focus (e.g., a selected district's own outline must remain accurate; simplification applies to *other, non-focused* geometry at wide zoom).

## 16. Caching

- Boundary geometry, being reference data that changes infrequently (Section 3), is a strong candidate for aggressive client- and CDN/edge-level caching, keyed by district/mandal identifier and a version/revision marker so cache invalidation happens only on an actual boundary update.
- Indicator overlay data (M2+), which changes more frequently, is cached with shorter validity and is invalidated per [backend-architecture.md](backend-architecture.md) Section 13's general caching-invalidation rule.

## 17. Future 3D / Advanced Digital-Twin Possibilities

The current architecture scope is a 2D geospatial digital twin (boundary navigation, indicator overlays). The milestone brief and [engineering-glossary.md](../00_Engineering_Overview/engineering-glossary.md) explicitly define "Digital Twin" for DistrictMind as GIS-based boundary visualization and navigation, **not** a real-time sensor-fed physical simulation. Advanced possibilities noted for potential future exploration, with no commitment or timeline:
- 3D terrain/elevation rendering.
- Real-time or near-real-time sensor data overlays (e.g., IoT infrastructure data), which would be a significant scope expansion beyond the current Engineering Overview's defined boundaries and would require a documented scope change.
- Satellite/remote-sensing imagery layers.

These are recorded here only to acknowledge the question the brief raises ("future 3D/advanced digital-twin possibilities") — they are **not** planned work and are **not** part of any confirmed milestone.

## 18. Milestone Traceability

| GIS Capability | Milestone |
|---|---|
| District/mandal boundary storage, rendering, navigation, spatial containment queries | M1 |
| Indicator overlay layers | M2 — Future |
| Risk overlay layer | M4 — Future |
| Scenario comparison layer | M5 — Future |
| 3D / advanced digital twin | Not planned / no milestone assigned |

## 19. Open Decisions

- Final spatial database/extension (Candidate: PostGIS).
- Final map rendering library (Candidate: Leaflet, Mapbox GL JS).
- Authoritative source for Telangana district/mandal boundary data (AS-001, unvalidated — a data-sourcing, not architecture, decision).
- Formal confirmation of WGS84/EPSG:4326 as the canonical CRS.
- Geometry simplification tolerance/thresholds per zoom level (implementation-time tuning, not an architecture-level decision).
