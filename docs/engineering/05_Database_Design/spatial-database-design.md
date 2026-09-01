---
Document Name: Spatial Database Design
Document ID: ED-DB-SPAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Spatial Database Design

## 1. Purpose

This is one of the most important documents in the database design set: DistrictMind's core value proposition is spatial cross-domain reasoning, and every worked example in the original source material is fundamentally a spatial query. This document defines the logical spatial data relationships at the database level, elaborating [spatial-data.md](../04_Data_Engineering/spatial-data.md) (data-engineering level) and [gis-architecture.md](../02_System_Architecture/gis-architecture.md) (system-architecture level) with database-specific detail. No SQL is written.

## 2. Spatial Entities

| Entity | Geometry Type | Source |
|---|---|---|
| District, Mandal, Village | Polygon / MultiPolygon (boundary) | [entity-catalog.md](entity-catalog.md) E-GEO-002/003/004 |
| Health Facility, School, Government Office, Weather Station | Point (location) | E-HLT-001, E-INF-001/002, E-WTH-001 |
| Water Body | Polygon | E-INF-003 |
| Road, Road Segment | LineString | E-TRN-001/002 |
| Disaster Event affected area | Polygon (derived or directly recorded extent) | E-DIS-001 |
| Vulnerable Area | Polygon (derived) | [logical-data-model.md](logical-data-model.md) Section 10 |

## 3. Point Geometry

Used for entities with a single, well-defined location: facilities, weather stations. Point geometry is the simplest spatial type and the basis for proximity queries (Section 9).

## 4. Line Geometry

Used for Road/Road Segment. Line geometry underlies routing (Section 12) and is the basis for the derived Transport Connection graph ([relationship-model.md](relationship-model.md) Section 5).

## 5. Polygon Geometry

Used for boundaries (District/Mandal/Village/Water Body) and derived/affected areas (Disaster Event, Vulnerable Area). Polygon validity (closed, non-self-intersecting) is a hard requirement enforced at ingestion ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 4), not assumed at the database layer.

## 6. Geographic Hierarchy (Spatial Restatement)

District ⊃ Mandal ⊃ Village, both as a *stored* administrative hierarchy ([relationship-model.md](relationship-model.md) Section 2) and, redundantly but usefully, as a *spatial containment* fact (a Village's polygon should fall within its parent Mandal's polygon) — the latter is a validation check ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 4's "boundary consistency" rule), not a separately stored relationship.

## 7. District, Mandal, Village Boundaries

Each carries its own polygon geometry directly as an attribute ([logical-data-model.md](logical-data-model.md) Section 3 — Boundary is an attribute, not a separate entity). Boundary correction produces a new version ([entity-catalog.md](entity-catalog.md) Section 4), never a silent overwrite, per [data-governance.md](../04_Data_Engineering/data-governance.md) Section 7.

## 8. Facility Locations

Point geometry on Health Facility, School, Government Office, Weather Station. A facility's containing village/mandal/district is **never a stored foreign key** — it is a computed spatial-join result, per [relationship-model.md](relationship-model.md) Section 4, because a stored FK would go stale on any boundary correction.

## 9. Road Networks

Road/Road Segment line geometry, with the routable graph (Transport Connection) derived at transformation time ([data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 6) rather than separately ingested — per [relationship-model.md](relationship-model.md) Section 5.

## 10. Affected Areas and Risk Zones

Disaster Event and Vulnerable Area polygons are either directly recorded (an official flood-extent report, if such a source is ever identified) or derived/predicted (a model's estimated flood extent under a given rainfall condition) — this distinction must be preserved via the Digital Twin State Model ([digital-twin-state-model.md](digital-twin-state-model.md)): an *Observed* affected area and a *Predicted* or *Scenario* affected area are never stored in the same table without a state-category discriminator.

## 11. CRS Strategy

Unchanged from [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 6: WGS84/EPSG:4326 is the **Proposed** canonical CRS for storage. All spatial entities in Section 2 store geometry in this canonical CRS; source-CRS reprojection happens once, at ingestion, not per query ([spatial-data.md](../04_Data_Engineering/spatial-data.md) Section 3).

## 12. Geometry Validation

Enforced at ingestion, per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 4 (geometry validity, coordinate validity, CRS consistency, polygon validity, duplicate geometry, boundary consistency) — the database is expected to reject or flag invalid geometry, not silently accept it, whether through native database constraints (if the eventual spatial extension supports them) or the ingestion validation stage.

## 13. Spatial Reference Consistency

Every spatial entity is expected to carry geometry in the single canonical CRS (Section 11) — no per-table or per-record CRS variation is permitted in the Curated layer, eliminating a whole class of "compared geometries in different projections" bugs at the query layer.

## 14. Spatial Indexes

A spatial index (e.g., the R-tree-family index structure the Blueprint's Proposed candidate PostGIS uses natively, called GiST — Blueprint §10.2) is required on every geometry-bearing column that participates in Section 9's queries. Without it, "villages within 10 km of any hospital" degrades to an O(n²) comparison; with it, the same query becomes an indexed lookup. Full detail in [database-indexing-strategy.md](database-indexing-strategy.md) Section 4.

## 15. Spatial Joins

A spatial join answers "which A relates to which B by geometry" (containment, intersection, proximity) without a stored FK — the mechanism underlying every computed relationship in [relationship-model.md](relationship-model.md) Section 4. Spatial joins are recomputed on demand or cached in a materialized view (per [database-normalization.md](database-normalization.md) Section 6) depending on the specific query's freshness requirement.

## 16. Distance Queries

"How far is A from B" — straight-line distance, the operation underlying coverage-gap analysis (Section 17.1). Distinguished from routing/travel-time distance (Section 12 below and [spatial-data.md](../04_Data_Engineering/spatial-data.md) Section 8), which uses the road-network graph instead of straight-line geometry.

## 17. Buffer Queries

Generates a zone of a given radius around a geometry (e.g., a 10 km buffer around every hospital), then intersects that buffer with village geometry to determine coverage — the buffer operation itself does not need to be persisted; it is computed at query time or within a materialized coverage-gap view.

## 18. Intersection Queries

"Does geometry A overlap geometry B" — used for Disaster Event ↔ Road Segment/Village impact analysis (Section 10; [relationship-model.md](relationship-model.md) Section 6.1).

## 19. Containment Queries

"Is point/geometry A entirely within geometry B" — used for the Geographic Hierarchy's facility-to-village/mandal/district assignment (Section 8) and for boundary-consistency validation (Section 6).

## 20. Nearest-Feature Queries

"What is the closest B to A" — used for the Weather Station ↔ Village nearest-station lookup ([relationship-model.md](relationship-model.md) Section 3) and for facility-recommendation candidate ranking ([entity-catalog.md](entity-catalog.md) E-REC-001).

## 21. DistrictMind-Specific Spatial Use Cases (Conceptual)

### 21.1 "Which villages don't have a hospital within 10 km?"

```
Village
  +
Hospital
  +
distance (Section 16)
  +
threshold (10 km)
  =
coverage gap
```

Realized via: a proximity/buffer query (Sections 16–17) between the Village and Health Facility point/polygon geometries, filtered to villages with zero qualifying facilities within the threshold. This produces a **Derived State** Analytical Result ([entity-catalog.md](entity-catalog.md) E-ANA-002), not a new source fact.

### 21.2 Bridge Closure → Accessibility Impact

```
Bridge closure
  +
road network (Section 9)
  +
health facility locations (Section 8)
  =
affected villages (accessibility impact)
```

Realized via: removing the affected Road Segment(s) from the routable graph within a **sandboxed Scenario computation** (AD-DE-004), recomputing shortest-path/travel-time from each affected village to its nearest Health Facility, and comparing against the baseline — the result is a **Scenario State** Scenario Output ([entity-catalog.md](entity-catalog.md) E-SIM-002), never a write to the real Road Segment or Health Facility tables.

### 21.3 Rainfall → Risk Layer → Potential Affected Area

```
Rainfall
  +
geographic region (Section 6)
  +
risk layer (flood-risk model, [ai-architecture.md](../02_System_Architecture/ai-architecture.md) / Blueprint §12.1)
  =
potential affected area
```

Realized via: a Weather Observation (or a hypothetical rainfall value, if run as a Scenario) feeding a Prediction (flood-risk model), whose output is a **Predicted** (or **Scenario**, if hypothetical) affected-area polygon — never written into the Observed Disaster Event table, consistent with [digital-twin-state-model.md](digital-twin-state-model.md)'s hard separation.

## 22. Milestone Traceability

| Spatial Database Capability | Milestone |
|---|---|
| Geographic hierarchy storage, containment queries | M1 |
| Facility/road point-and-line layers, computed coverage relationships | M2 — Future |
| Disaster affected-area intersection, risk-layer storage | M2 — Future (data), M4 — Future (predicted risk) |
| Sandboxed routing recomputation for scenarios | M5 — Future |

## 23. Open Decisions

- Final spatial extension confirmation (PostGIS remains Proposed, not Confirmed — [database-design.md](database-design.md) Section 25).
- Whether a coverage-gap materialized view is refreshed on a schedule or on underlying-data change events — deferred to physical design and [database-performance.md](database-performance.md).
- Exact geometry simplification/level-of-detail strategy for statewide vs. district-level queries — implementation-time tuning, per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 19.
