---
Document Name: Database Indexing Strategy
Document ID: ED-DB-IDX-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Database Indexing Strategy

## 1. Purpose

This document defines conceptual indexing strategy: which query patterns require which kind of index, and why, following the pattern "Query pattern → required index → expected benefit → trade-off." No SQL index definitions or index names are specified, per the milestone's restriction.

## 2. Primary Identifiers

| Query Pattern | Required Index | Expected Benefit | Trade-off |
|---|---|---|---|
| Single-entity lookup by ID (e.g., "get District X") | Primary-key index (implicit on every table-realized entity in [entity-catalog.md](entity-catalog.md)) | O(log n) lookup instead of table scan | Minimal — standard for any relational entity |

## 3. Foreign-Key Relationships

| Query Pattern | Required Index | Expected Benefit | Trade-off |
|---|---|---|---|
| "All Mandals in District X" / "All Villages in Mandal Y" (hierarchy traversal, [relationship-model.md](relationship-model.md) Section 2) | Index on the child entity's parent-reference column (Mandal.district_id, Village.mandal_id) | Fast hierarchy traversal without scanning the full child table | Additional write cost on insert/update of the child table — negligible given the low write frequency of geographic reference data |
| "All Population Observations for Village X" | Index on Population Observation's village reference | Fast time-series retrieval per village | Same as above |
| "All Tool Executions for Agent Execution X" | Index on Tool Execution's agent-execution reference | Fast audit-trail retrieval for a given AI interaction | Write cost on every logged tool call — acceptable given audit logging's already-mandatory overhead |

## 4. Geographic (Spatial) Indexes

| Query Pattern | Required Index | Expected Benefit | Trade-off |
|---|---|---|---|
| "Which mandal contains this point?" (containment) | Spatial index on boundary geometry columns (District/Mandal/Village) | Turns an O(n) or worse geometry scan into an indexed lookup — this is the specific benefit the Blueprint itself calls out (§10.2): without it, "villages within 10 km of any hospital" becomes an O(n²) comparison | Spatial indexes have real storage and maintenance cost, and are only beneficial once geometry complexity/row count justifies them — acceptable given GIS features are core to M1 |
| "Villages within 10 km of any hospital" (proximity, [spatial-database-design.md](spatial-database-design.md) Section 21.1) | Spatial index on both Village boundary/centroid and Health Facility location | Enables the flagship coverage-gap query to execute as an indexed spatial join rather than a brute-force pairwise comparison | Same as above |
| "Which road segments intersect this disaster-affected polygon?" | Spatial index on Road Segment geometry and Disaster Event affected-area geometry | Fast intersection queries for impact analysis ([relationship-model.md](relationship-model.md) Section 6.1) | Same as above |
| Nearest-station lookup (Weather Station → Village) | Spatial index on Weather Station location | Fast nearest-neighbor queries instead of computing distance to every station | Same as above |

Spatial indexing is treated as a **required**, not optional, property of every geometry-bearing column, given that DistrictMind's core value proposition depends on these queries being fast enough for interactive use (NFR-035). The specific index structure (e.g., a GiST-family index, the mechanism the Blueprint's Proposed PostGIS candidate uses natively — §10.2) remains an implementation detail tied to the still-open database product decision ([database-design.md](database-design.md) Section 25).

## 5. Temporal Indexes

| Query Pattern | Required Index | Expected Benefit | Trade-off |
|---|---|---|---|
| "Population trend for Village X over time" (FR-026) | Composite index on (village reference, effective_year) — the same compound key defined in [temporal-database-design.md](temporal-database-design.md) Section 3 | Fast ordered range retrieval for trend charts | Minimal, given this is also the entity's natural key |
| "Weather Observations for Station Y in date range" | Composite index on (station reference, date) | Fast range queries for forecasting model input preparation (Blueprint §12.2) | Minimal |
| "Latest version of District X's boundary" | Index on (entity reference, version) with a "latest" access pattern | Avoids scanning full version history for the common "current state" case | Slight added complexity if a partial/filtered index approach is used — deferred to physical design |
| "State as of date Y" (historical reconstruction, [temporal-database-design.md](temporal-database-design.md) Section 4) | Composite index on (entity reference, effective_from) | Enables efficient point-in-time queries without a full table scan | Rare access pattern (mostly for reproducibility/audit) — index justified by its necessity for Reproducibility, not by frequency |

## 6. Composite Indexes

| Query Pattern | Required Index | Expected Benefit | Trade-off |
|---|---|---|---|
| "Analytical Result for Indicator Z, target entity W, most recent" ([entity-catalog.md](entity-catalog.md) E-ANA-002) | Composite index on (indicator reference, target entity reference, computed_at) | Serves the exact compound key the entity is designed around ([temporal-database-design.md](temporal-database-design.md) Section 3) | Minimal — matches the entity's natural access pattern |
| "Prediction for Model X, target entity Y, horizon Z" | Composite index on (model_execution reference, target entity, horizon) | Same rationale as above, applied to Prediction | Minimal |
| "Recommendation Evidence for Recommendation X" | Composite index on (recommendation reference, evidence_type) | Fast retrieval of all evidence for a given recommendation, filterable by evidence type | Minimal |

## 7. Query-Driven Indexing Principle

No index in this document is proposed "just in case" — every entry in Sections 2–6 is justified by a specific, named query pattern already established elsewhere in this documentation set (a functional requirement, an architecture document's worked example, or an entity's own natural key). This is a deliberate discipline: **an index without an identified query pattern is not proposed here**, consistent with the "do not overengineer" guidance repeated throughout ED-M1/ED-M2.

## 8. Index Maintenance Trade-offs (General)

| Concern | Note |
|---|---|
| Write amplification | Every index adds write cost on insert/update; DistrictMind's write-heavy paths (ingestion batches, Section 4 of [data-ingestion.md](../04_Data_Engineering/data-ingestion.md)) are batch/scheduled, not high-frequency transactional writes, so this cost is judged acceptable across the board |
| Storage cost | Spatial indexes in particular carry non-trivial storage overhead relative to plain B-tree-style indexes — acceptable given GIS is core, not incidental, to DistrictMind |
| Index bloat over time | Versioned/append-only tables ([temporal-database-design.md](temporal-database-design.md)) grow indexes monotonically; retention policy (an open decision, [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 30) will eventually need to address this, not resolved in this document |

## 9. Milestone Traceability

| Indexing Capability | Milestone |
|---|---|
| Primary/foreign-key indexes on Geography, spatial indexes on boundaries | M1 |
| Full indexing across all domain entities, temporal composite indexes | M2 — Future |
| Analytical Result composite indexing | M2 — Future |
| Prediction composite indexing | M4 — Future |
| Recommendation Evidence indexing | M6 — Future |

## 10. Open Decisions

- Specific index type/structure per the eventual database product (still Proposed, not Confirmed — [database-design.md](database-design.md) Section 25).
- Whether a "latest version" partial/filtered index is used for versioned reference data (Section 5) — physical-design decision, **To Be Evaluated**.
