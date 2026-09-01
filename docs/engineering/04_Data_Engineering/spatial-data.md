---
Document Name: Spatial Data
Document ID: ED-DE-SPAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Spatial Data

## 1. Purpose

This document defines DistrictMind's spatial data model at the data-engineering level, complementing the architectural treatment already established in [gis-architecture.md](../02_System_Architecture/gis-architecture.md). Where that document defines the GIS *architecture* (layers, rendering, CRS), this document defines the *data* concerns: geometry types, spatial operations, indexing, and — per the milestone brief's explicit requirement — real DistrictMind use cases drawn from the original source material, described conceptually only. No query is implemented here.

## 2. Geographic Hierarchy

District → Mandal → Village, as established in [data-domain-model.md](data-domain-model.md) Section 3, each level carrying its own boundary geometry. This hierarchy is the spatial backbone every other domain attaches to.

## 3. Coordinate Systems and CRS

Per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 6, WGS84/EPSG:4326 is the **Proposed** canonical CRS for storage and exchange. Source data may arrive in a different CRS and is reprojected during ingestion ([data-ingestion.md](data-ingestion.md) Section 5, GIS ingestion mode). CRS consistency is itself a validation rule ([data-validation.md](data-validation.md) Section 4).

## 4. Geometry Types

| Type | Used For | Source |
|---|---|---|
| Point | Hospitals, schools, government offices, weather stations | Blueprint §10.3 Core Tables |
| LineString | Roads | Blueprint §10.3 |
| Polygon / MultiPolygon | Districts, mandals, villages, water bodies | Blueprint §10.3 |
| Raster (Future) | Satellite/drone imagery | Blueprint §16 Future Scope — not current scope |

## 5. Spatial Database

Consistent with [database-architecture.md](../02_System_Architecture/database-architecture.md) AD-DB-001 and [data-architecture.md](data-architecture.md) AD-DE-001: spatial capability as a native extension of the primary relational store, with PostgreSQL + PostGIS as the **Proposed** (not Confirmed) leading candidate, based on the original Blueprint's specific justification (§10.2).

## 6. Spatial Indexing

Indexed spatial operations are what make district-scale queries fast rather than a brute-force scan across every pair of records. The Blueprint is explicit about why this matters (§10.2): a plain-SQL, non-indexed approach to "find all villages within 10 km of any hospital" would require an O(n²) comparison across every village–hospital pair; a spatial index (the Blueprint names GiST specifically, a PostGIS/PostgreSQL indexing structure) turns this into a fast, indexed lookup. This document adopts spatial indexing as a **required** data-engineering property of the eventual implementation, without committing to GiST specifically as more than the Proposed candidate's native mechanism.

## 7. Spatial Joins

A spatial join answers "which geometry contains/intersects/is-near this other geometry" without a stored foreign key — this is how facility-to-village coverage is computed ([data-domain-model.md](data-domain-model.md) Section 3's "computed, not fixed, relationship"). Spatial joins are recomputed whenever either side's geometry changes (a corrected village boundary, a newly added hospital), not cached indefinitely without invalidation.

## 8. Proximity Queries

"Is B within distance D of A" — the operation underlying DistrictMind's most repeated example question (Section 10). Proximity queries operate on straight-line distance by default; where actual travel distance/time matters more than straight-line proximity, a routing query (Section 12) is used instead — the Blueprint is explicit that both are needed, chosen "per query depending on whether straight-line proximity or actual travel time is the relevant measure" (§11.6).

## 9. Coverage Analysis

Coverage analysis combines a proximity or routing query with a population figure to answer "how much of the population is/is not served by a given facility type" — this is the direct data foundation for the Recommendation Engine's scoring (Section 24, [data-architecture.md](data-architecture.md)).

## 10. Buffer Analysis

A buffer operation generates a zone around a geometry (e.g., a 10 km radius around every hospital) which can then be intersected with village boundaries to determine coverage — this is the geometric operation underlying the coverage-gap query described conceptually in Section 13 below.

## 11. Routing / Accessibility

Routing computes shortest-path travel distance/time over a road network graph, not straight-line distance — required for realistic accessibility analysis (e.g., a village may be geometrically close to a hospital but far by actual road). Per the Blueprint (§5.7, §11.6), the road network itself is a **derived** structure (Section 6 of [data-transformation.md](data-transformation.md)): source road geometry (LineString records) is converted into a navigable graph (nodes and edges) as a transformation step, not stored as a graph natively at ingestion.

## 12. GIS Layer Versioning

Boundary and facility geometry are reference data subject to the same versioning discipline as any other Curated record ([data-governance.md](data-governance.md) Section 7; [temporal-data.md](temporal-data.md) Section 8) — a corrected village boundary produces a new version, not a silent overwrite, since downstream coverage/routing computations that depended on the old boundary need to remain explainable (Reproducibility).

## 13. Illustrative DistrictMind Use Cases (Conceptual Only)

These are drawn directly from the original source material and are described **conceptually** — no query is implemented.

### 13.1 "Which villages don't have a hospital within 10 km?"

The single most repeated example across both source documents (Blueprint §2.1, §10.2, §11.4, §15.1).

```
Village locations
  +
Hospital locations
  +
Distance calculation (proximity query, Section 8)
  +
Threshold (10 km)
  =
Healthcare coverage gap
```

Conceptually: for each village, determine whether any hospital lies within the threshold distance; villages with no qualifying hospital are the coverage gap. This is a Derived Data output ([data-transformation.md](data-transformation.md) Section 4), not itself a new source fact.

### 13.2 "Where should the next PHC be built?"

Builds on 13.1: candidate locations are uncovered village centroids (13.1's output), scored against population-uncovered, distance-to-nearest-facility, and projected population growth (Section 22, [data-architecture.md](data-architecture.md)) — this is the Recommendation Engine's data foundation (Blueprint §8.2, §14.1–14.2), not implemented here.

### 13.3 "If a bridge is closed, how will traffic change, and which hospitals become harder to reach?"

A cross-domain spatial query spanning Transportation and Healthcare (Blueprint §7.3): remove an edge from the road-network graph (Section 11), recompute shortest paths for affected origin-destination pairs, and re-evaluate hospital accessibility using the new travel times. This is the Simulation Engine's spatial data requirement (Section 23, [data-architecture.md](data-architecture.md)), not implemented here.

### 13.4 "If rainfall increases by 30%, which villages lose road access to their nearest hospital?"

The Abstract's and Blueprint's flagship cross-domain example (Blueprint §1.1): combines Weather (rainfall input to a flood-risk model), Disaster (affected-area geometry), Transportation (road segments intersecting the affected area, removed from the routing graph), and Healthcare (re-evaluated accessibility) — requiring every cross-domain relationship in [data-domain-model.md](data-domain-model.md) Section 13 to function together.

## 14. How Spatial Analysis Supports Planning Domains

| Planning Domain | Spatial Analysis Role |
|---|---|
| Healthcare planning | Coverage-gap analysis (13.1), facility-siting recommendation (13.2) |
| Infrastructure planning | Same coverage-gap pattern applied to schools, government offices ([data-domain-model.md](data-domain-model.md) Section 10) |
| Disaster response | Affected-area intersection with population/facility/road geometry (13.4) |
| Transportation planning | Routing/accessibility recomputation under closure scenarios (13.3) |
| Agriculture planning | Spatial join of agricultural land-use records against weather-station coverage ([data-domain-model.md](data-domain-model.md) Section 13, Weather ↔ Agriculture) |
| Facility recommendation | Combines coverage, accessibility, and demographic data (13.2) |

## 15. Milestone Traceability

| Spatial Capability | Milestone |
|---|---|
| District/mandal/village boundary storage, containment queries | M1 |
| Facility point layers, proximity queries, coverage-gap analysis | M2 — Future |
| Road-network graph construction, routing/accessibility queries | M2 — Future (data), M5 — Future (simulation use) |
| Buffer/intersection analysis for disaster impact | M2 — Future (data), M4 — Future (risk scoring) |
| Full cross-domain spatial reasoning (13.4-style queries) | M6 — Future |

## 16. Open Decisions

- Final spatial database/extension confirmation (Section 5) — Proposed, not Confirmed.
- Final routing library/graph-construction approach (OSMnx is the Blueprint's Proposed candidate, §5.7; not re-confirmed here beyond Proposed status).
- Geometry simplification tolerances per zoom level — implementation-time tuning, per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 19, not decided here.
