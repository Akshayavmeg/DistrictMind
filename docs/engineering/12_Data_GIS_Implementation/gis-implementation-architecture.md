---
Document Name: GIS Implementation Architecture
Document ID: ED-DGI-GISARCH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# GIS Implementation Architecture

## 1. Purpose

This document defines the GIS subsystem's implementation architecture, elaborating [gis-service-design.md](../06_API_and_Integration/gis-service-design.md), [gis-frontend-boundary-resolution.md](../11_Architecture_Resolution/gis-frontend-boundary-resolution.md), and [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) with implementation-blueprint detail. No GIS library or map engine is forced.

## 2. The Chain

```mermaid
flowchart LR
    FEMap[Frontend Map] --> API[API]
    API --> GISSvc[GIS Service]
    GISSvc --> SpatialComp[Spatial Computation]
    SpatialComp --> Repo[Repository/Data]
    Repo --> Result[Result]
    Result --> FEMap
```

## 3. Map Rendering

A frontend responsibility exclusively ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md)) — the GIS Service never produces a rendered image; it serves geometry and attribute data in a data interchange format (GeoJSON, Proposed per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 7).

## 4. Layer Retrieval

Each layer named in [spatial-data-implementation.md](spatial-data-implementation.md) Section 2 is retrieved independently — the frontend requests only the layers it currently has toggled visible ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 11), never a single monolithic "all layers" payload.

## 5. Feature Retrieval

A single feature (e.g., one hospital) is retrievable by its stable identifier, independent of its layer's bulk retrieval — supporting detail views (FR-012) without requiring the full layer to be re-fetched.

## 6. Spatial Query Services

Restated unchanged from [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) — every operation (distance, buffer, intersection, containment, nearest-feature, coverage, accessibility, impact) is a bounded, server-side capability, never an open-ended geometry-expression interface.

## 7. Server-Side Computation

Every spatial computation is authoritative and server-side — restated unchanged from AD-FE-004 and [gis-frontend-boundary-resolution.md](../11_Architecture_Resolution/gis-frontend-boundary-resolution.md).

## 8. Result Simplification

Geometry is simplified server-side, at the Serving layer, based on the requested detail level (statewide overview vs. district drill-down) — restated unchanged from [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15. The frontend never performs its own simplification of full-precision geometry; it requests the appropriate level of detail and receives already-simplified geometry.

## 9. Geometry Payload Handling

Every geometry-bearing API response is bounded (Section 25 of [api-architecture.md](../06_API_and_Integration/api-architecture.md); [database-performance.md](../05_Database_Design/database-performance.md) Section 10) — a request for an unbounded scope (e.g., full-detail statewide geometry) is either rejected, paginated/tiled (Section 12), or automatically served at a coarser simplification level.

## 10. Map Viewport Behavior

The frontend's current viewport determines which geometry is requested at full detail; geometry outside the viewport is deferred or served at a coarser level — restated unchanged from [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 11.

## 11. Layer Visibility

A purely frontend presentation concern (toggling which already-available layers are rendered) — restated unchanged from [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 7; the backend is not "aware" of layer visibility, only of which layers are requested.

## 12. Spatial Filtering

Presentation-level filtering (e.g., "show only hospitals of type X") may be applied client-side against an already-fetched layer's attribute data, or server-side via a filter parameter on the retrieval request — both are legitimate, chosen based on payload size (a small, already-fetched layer can filter client-side; a large layer should filter server-side to avoid over-fetching).

## 13. Pagination/Tiling Concepts

**Architectural Decision:**

**AD-GIS-001 — Geometry Payloads Use Level-of-Detail Scoping Rather Than Generic Pagination**
- **Context:** Standard list pagination (page/pageSize) does not map cleanly onto geometry data, where the meaningful unit of "how much to send" is spatial extent and detail level, not row count.
- **Decision:** Geometry-bearing responses are scoped by spatial extent (viewport/district boundary) and detail level (simplification tier), per Sections 8–10, rather than by a generic page/pageSize parameter. Non-geometry list responses (e.g., a paginated facility table) continue to use standard pagination ([api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 6) unchanged.
- **Alternatives considered:** Applying generic pagination to geometry collections (rejected — an arbitrary "page 3 of districts" has no natural meaning for a spatial dataset; a viewport- or detail-level-scoped request is the natural unit); a full tile-server architecture with a fixed tiling scheme (Candidate for future consideration if statewide-scale rendering performance requires it, not committed now, consistent with "do not overengineer") |
- **Reasoning:** Matches how map rendering libraries actually consume geometry (by extent and zoom level, not by row count); consistent with the level-of-detail strategy already established in [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15.
- **Trade-offs:** Requires the API to expose spatial-extent and detail-level parameters distinct from its standard pagination parameters — a small increase in API surface, accepted since it matches the actual access pattern.
- **Consequences:** A future tile-server approach remains an available, non-committed option if scale ever requires it ([caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) Section 7).
- **Status:** Proposed.

## 14. Large-Geometry Handling

Restated unchanged from [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15 and [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) Section 7: server-side simplification, level-of-detail scoping (Section 13), and caching of infrequently-changing boundary geometry are the primary levers — no client-side post-processing of oversized geometry is assumed.

## 15. Milestone Traceability

| GIS Implementation Capability | First Needed |
|---|---|
| Map rendering, layer/feature retrieval, containment queries, geometry simplification | M1 |
| Full spatial query service set (buffer, intersection, coverage, accessibility) | M2 |
| Affected-area/impact queries | M2 (data), M4 (predicted risk) |

## 16. Open Decisions

- Final mapping library and spatial database/extension — Candidate, unchanged.
- Whether a full tile-server approach is ever adopted (Section 13) — not committed.
