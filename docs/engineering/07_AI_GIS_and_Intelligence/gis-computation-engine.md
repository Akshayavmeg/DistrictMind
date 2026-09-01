---
Document Name: GIS Computation Engine
Document ID: ED-AI-GIS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# GIS Computation Engine

## 1. Purpose

This is a critical DistrictMind document. Where [gis-service-design.md](../06_API_and_Integration/gis-service-design.md) defines the GIS Service's API/service-layer contract and [spatial-database-design.md](../05_Database_Design/spatial-database-design.md) defines the underlying data model, this document defines the **computational engine** itself — the internal responsibilities of the component the Blueprint calls the "GIS Engine" (§3.1: "GeoPandas, PostGIS, OSMnx routing"). No GIS code exists here.

## 2. The Twelve Computational Operations

For every operation: Input → Computation → Output → Evidence → Consumer.

### 2.1 Geometry Validation

| Field | Detail |
|---|---|
| Input | Raw or transformed geometry (any type) |
| Computation | Structural well-formedness check (closed polygons, valid coordinate ranges, correct CRS) — per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 4 |
| Output | Valid/invalid determination, with a specific failure reason if invalid |
| Evidence | The validation outcome itself, logged for ingestion audit ([data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 9) |
| Consumer | The ingestion pipeline (primary), any service accepting geometry input (defensive check) |

### 2.2 Spatial Filtering

| Field | Detail |
|---|---|
| Input | A set of geometries and a filter criterion (e.g., "within District X") |
| Computation | Bounding-box pre-filter followed by exact geometric test, using the spatial index ([database-indexing-strategy.md](../05_Database_Design/database-indexing-strategy.md) Section 4) |
| Output | The filtered geometry subset |
| Evidence | Source dataset version of the filtered set |
| Consumer | Every domain service scoping a query to a district/mandal/village |

### 2.3 Distance Computation

| Field | Detail |
|---|---|
| Input | Two geometries |
| Computation | Straight-line distance, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 2 |
| Output | A numeric distance |
| Evidence | Both geometries' dataset versions |
| Consumer | Healthcare/Infrastructure coverage checks, `spatial_query` tool |

### 2.4 Buffer Analysis

| Field | Detail |
|---|---|
| Input | A geometry + radius |
| Computation | Generate a derived polygon region around the input, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 3 |
| Output | A derived polygon (explicitly Derived, never itself persisted as an Observed geometry) |
| Evidence | Source geometry's dataset version |
| Consumer | Coverage analysis (2.8) |

### 2.5 Intersection

| Field | Detail |
|---|---|
| Input | Two geometries |
| Computation | Geometric overlap determination, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 4 |
| Output | Boolean or overlapping geometry |
| Evidence | Both input geometries' dataset versions and, if one is Predicted/Scenario, its explicit state label |
| Consumer | Disaster impact analysis (2.11), Affected-area analysis |

### 2.6 Containment

| Field | Detail |
|---|---|
| Input | A point/geometry and a candidate polygon |
| Computation | Point-in-polygon (or geometry-in-geometry) test, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 5 |
| Output | Boolean, or the containing polygon's identifier |
| Evidence | Both geometries' dataset versions |
| Consumer | Facility-to-village/mandal/district resolution ([relationship-model.md](../05_Database_Design/relationship-model.md) Section 4) — the single most frequently invoked operation |

### 2.7 Nearest-Feature

| Field | Detail |
|---|---|
| Input | A reference geometry, a target entity type |
| Computation | Indexed nearest-neighbor search, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 6 |
| Output | The nearest matching entity + distance |
| Evidence | Same as above |
| Consumer | Weather Station ↔ Village nearest-station lookup, recommendation candidate ranking |

### 2.8 Coverage

| Field | Detail |
|---|---|
| Input | A set of population/village geometries, a set of facility geometries, a distance threshold |
| Computation | Composition of Buffer (2.4) + Containment (2.6) across the full candidate set |
| Output | A coverage-gap set + uncovered-population figure |
| Evidence | Village and facility dataset versions; explicitly a **Derived State** result |
| Consumer | Healthcare/Infrastructure Services, `coverage_analysis` tool, Recommendation Engine |

### 2.9 Accessibility

| Field | Detail |
|---|---|
| Input | An origin, a destination or destination-type, the routable road-network graph |
| Computation | Shortest-path/travel-time computation over the graph derived from Road/Road Segment geometry ([relationship-model.md](../05_Database_Design/relationship-model.md) Section 5) |
| Output | A route + travel-time/distance, or an explicit "no route" if disconnected |
| Evidence | Road network dataset version; if computed within a Scenario sandbox, an explicit Scenario flag |
| Consumer | Transportation Service, Simulation Service (bridge-closure example), `accessibility_analysis` tool |

### 2.10 Network Impact

| Field | Detail |
|---|---|
| Input | A modified graph (an edge/node removed or added within a sandbox) |
| Computation | Recompute shortest paths for all dependent origin-destination pairs, diff against baseline paths — per the Blueprint's own structured-delta output (§13.3) |
| Output | Per-pair before/after deltas |
| Evidence | Baseline snapshot reference, explicit Scenario State flag |
| Consumer | Simulation Service, `run_scenario` tool |

### 2.11 Affected-Area Analysis

| Field | Detail |
|---|---|
| Input | An event's (or hypothetical scenario's) affected-area geometry, candidate asset geometries |
| Computation | Intersection (2.5) composed with domain-specific asset retrieval |
| Output | The set of intersecting/affected assets |
| Evidence | Full chain per [evidence-provenance-flow.md](../06_API_and_Integration/evidence-provenance-flow.md); explicit Observed/Predicted/Scenario label on the affected-area geometry itself |
| Consumer | Disaster Service, Simulation Service (rainfall/flood scenarios) |

### 2.12 Spatial Aggregation

| Field | Detail |
|---|---|
| Input | A set of point/observation geometries within a region |
| Computation | Combine values across the geographic grouping (village → mandal → district), per [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 2's "spatial aggregation" operation |
| Output | A regional summary value |
| Evidence | Every contributing observation's dataset version |
| Consumer | Analytics Service, Weather/Disaster risk assessment (rainfall aggregated across a region) |

## 3. Worked Example A — 10 km Healthcare Coverage

```
Village geometries (2.2 Spatial Filtering)
  + Hospital geometries (2.2)
  + Distance (2.3) / Buffer (2.4) + Containment (2.6)
  = Coverage (2.8)
```

Realized as a composed call to 2.8 (Coverage), itself built from 2.3/2.4/2.6 — the identical example used throughout this documentation set ([gis-service-design.md](../06_API_and_Integration/gis-service-design.md) Section 3, [spatial-database-design.md](../05_Database_Design/spatial-database-design.md) Section 21.1), now shown at the computational-engine internal-composition level.

## 4. Worked Example B — Bridge Closure

```
Baseline road graph
  + Requested edge removal (Network Impact, 2.10)
  + Recompute Accessibility (2.9) for dependent pairs
  = Affected villages/facilities (2.11)
```

## 5. Worked Example C — Rainfall → Disaster Risk → Transportation → Healthcare

```
Weather Observations (Spatial Aggregation, 2.12)
  → Risk Assessment (Prediction Engine, external to GIS Engine — see prediction-architecture.md)
  → Affected-area geometry (2.11's input)
  → Intersection with Road Segments (2.5, within 2.11)
  → Network Impact (2.10) on dependent routes
  → Accessibility (2.9) to Health Facilities
  → Decision-support result
```

This is the Blueprint's flagship cross-domain example (§1.1), now traced through the specific twelve GIS Computation Engine operations that realize it — no operation outside this document's twelve is required to answer it, which is itself evidence that the twelve-operation set (Section 2) is sufficient for DistrictMind's stated worked examples.

## 6. Milestone Traceability

| Operation | First Available |
|---|---|
| Geometry Validation, Spatial Filtering, Containment, Distance | M1 |
| Buffer, Intersection, Nearest-Feature, Coverage | M2 — Future |
| Accessibility, Network Impact | M2 — Future (data), M5 — Future (scenario use) |
| Affected-Area Analysis | M2 — Future (data), M4 — Future (predicted risk input) |
| Spatial Aggregation | M2 — Future |

## 7. Open Decisions

- Final GIS computation technology (PostGIS/GeoPandas/OSMnx remain Proposed/Candidate, unchanged from every prior milestone).
- Precise composition boundaries (e.g., whether Coverage (2.8) is itself precomputed as a materialized view vs. always composed live from 2.4/2.6) — unchanged open item from [database-performance.md](../05_Database_Design/database-performance.md) Section 18.
