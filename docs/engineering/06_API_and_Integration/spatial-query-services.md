---
Document Name: Spatial Query Services
Document ID: ED-API-SPAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Spatial Query Services

## 1. Purpose

This document defines the conceptual spatial operations exposed by the GIS Service ([gis-service-design.md](gis-service-design.md)), each described by purpose, input, output, consumers, performance considerations, validation, and provenance. No query implementation exists here — this elaborates [spatial-database-design.md](../05_Database_Design/spatial-database-design.md) Sections 16–20 at the service-contract level.

## 2. Distance (A → B)

| Field | Detail |
|---|---|
| Purpose | Compute straight-line distance between two geometries |
| Input Geometry | Any two geometry-bearing entities (e.g., a Village centroid and a Health Facility point) |
| Output | A numeric distance value, with unit |
| Expected Consumers | Healthcare/Infrastructure Services (coverage checks), AI `spatial_query` tool |
| Performance | Fast, indexed via spatial index ([database-indexing-strategy.md](../05_Database_Design/database-indexing-strategy.md) Section 4) when comparing against many candidates |
| Validation | Both geometries must be valid and in the canonical CRS ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 4) |
| Provenance | Source dataset version of both input geometries |

## 3. Buffer (Feature → Radius → Region)

| Field | Detail |
|---|---|
| Purpose | Generate a zone of a given radius around a geometry |
| Input Geometry | A point or polygon, plus a radius parameter |
| Output | A derived polygon region |
| Expected Consumers | Coverage analysis (Section 7), Healthcare Service |
| Performance | Computationally cheap per-feature; expensive if applied to a large feature set without limiting scope (Section 10, [database-performance.md](../05_Database_Design/database-performance.md)) |
| Validation | Radius within a sane bound (a guard against an unreasonably large buffer request) |
| Provenance | Source geometry's dataset version; the buffer itself is a Derived, not source, geometry — never persisted as if it were observed |

## 4. Intersection (A ∩ B)

| Field | Detail |
|---|---|
| Purpose | Determine whether/where two geometries overlap |
| Input Geometry | Two geometries (e.g., a Disaster Event's affected area and a set of Road Segments) |
| Output | A boolean (does intersect) or the overlapping geometry itself, depending on the calling context |
| Expected Consumers | Disaster Service (impact analysis), GIS Service's affected-area analysis ([gis-service-design.md](gis-service-design.md) Example 3) |
| Performance | Indexed via spatial index on both sides of the comparison |
| Validation | Both geometries valid, canonical CRS |
| Provenance | Both input geometries' dataset versions; if one side is a Predicted/Scenario geometry, this must be explicitly flagged in the result ([digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) Section 4) |

## 5. Containment (Point ∈ Polygon)

| Field | Detail |
|---|---|
| Purpose | Determine whether a point (or geometry) falls within a polygon |
| Input Geometry | A point/geometry and a candidate containing polygon |
| Output | A boolean, or (for a "which polygon contains this point" query) the containing polygon's identifier |
| Expected Consumers | Every domain service needing facility-to-village/mandal/district resolution ([relationship-model.md](../05_Database_Design/relationship-model.md) Section 4) |
| Performance | Indexed; this is the single most frequently invoked spatial operation across the system, given how many computed relationships depend on it |
| Validation | Same as above |
| Provenance | Same as above |

## 6. Nearest Feature (Feature → Closest Target)

| Field | Detail |
|---|---|
| Purpose | Find the closest matching feature of a target type to a reference geometry |
| Input Geometry | A reference geometry (e.g., a Village) and a target entity type (e.g., Health Facility) |
| Output | The nearest matching entity and its distance |
| Expected Consumers | Weather Station ↔ Village nearest-station lookup ([relationship-model.md](../05_Database_Design/relationship-model.md) Section 3), facility-recommendation candidate ranking |
| Performance | Indexed nearest-neighbor query, avoiding a full distance computation against every candidate |
| Validation | Target entity type must be a known, spatially-indexed entity type |
| Provenance | Same pattern as above |

## 7. Coverage (Population/Village → Facility → Distance Threshold)

| Field | Detail |
|---|---|
| Purpose | Determine which population/village units are or are not served by a facility type within a threshold distance |
| Input Geometry | A set of Village geometries, a set of facility-type geometries, and a distance threshold |
| Output | A coverage-gap set (villages with zero qualifying facilities within threshold) and, where population data is joined, an uncovered-population figure |
| Expected Consumers | Healthcare/Infrastructure Services, Recommendation Service (facility-siting evidence), `coverage_analysis` AI tool |
| Performance | Composed from Buffer (Section 3) + Containment (Section 5); precomputed as an Analytical Result where the threshold is standard, computed on-demand for arbitrary thresholds |
| Validation | Threshold within a sane bound |
| Provenance | This is a **Derived State** result ([digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md)) — carries the source dataset versions of both the village and facility inputs |

## 8. Accessibility (Origin → Transport Network → Destination)

| Field | Detail |
|---|---|
| Purpose | Compute travel-time/distance-based reachability between an origin and a destination (or nearest qualifying destination) via the road network |
| Input Geometry | An origin (e.g., a Village), a destination or destination-type (e.g., "nearest Health Facility"), and the routable road-network graph |
| Output | A route and its travel-time/distance |
| Expected Consumers | Transportation Service, `accessibility_analysis` AI tool, Simulation Service (Example 2, [gis-service-design.md](gis-service-design.md)) |
| Performance | Depends on the derived graph's size/connectivity; a genuinely expensive statewide recomputation is a candidate for async execution ([api-architecture.md](api-architecture.md) Section 18) |
| Validation | Origin/destination must resolve to connected graph nodes; a disconnected graph returns an explicit "no route" result, not a silently wrong distance estimate |
| Provenance | Source road network dataset version; if computed within a Scenario sandbox, explicitly flagged as Scenario State |

## 9. Impact (Event → Affected Geometry → Affected Assets)

| Field | Detail |
|---|---|
| Purpose | Determine which assets (facilities, roads, population) are affected by an event's geometry |
| Input Geometry | An event's affected-area geometry (Disaster Event, or a hypothetical Scenario-derived affected area) and candidate asset geometries |
| Output | The set of intersecting/affected assets, per Section 4 (Intersection) composed with domain-specific asset retrieval |
| Expected Consumers | Disaster Service, Simulation Service (rainfall/flood scenarios), Recommendation Service (risk-aware siting) |
| Performance | Same composition pattern as Coverage (Section 7) |
| Validation | Affected-area geometry must be valid; its state category (Observed/Predicted/Scenario) must be explicit before the result is composed |
| Provenance | Full chain per [evidence-provenance-flow.md](evidence-provenance-flow.md) |

## 10. Milestone Traceability

| Operation | First Available |
|---|---|
| Containment, Distance (basic) | M1 |
| Buffer, Intersection, Nearest Feature, Coverage | M2 — Future |
| Accessibility | M2 — Future (data), M5 — Future (scenario use) |
| Impact | M2 — Future (data), M4 — Future (predicted risk) |

## 11. Open Decisions

- Exact result-size/complexity guard thresholds per operation (Section 3's "reasonable radius," Section 8's async escalation point) — implementation-time tuning.
- Whether Coverage/Accessibility are ever exposed as standalone public operations vs. only composed within domain-service calls — **Under Evaluation**.
