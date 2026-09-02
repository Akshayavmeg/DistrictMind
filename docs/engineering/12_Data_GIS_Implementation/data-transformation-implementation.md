---
Document Name: Data Transformation Implementation
Document ID: ED-DGI-XFM-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Data Transformation Implementation

## 1. Purpose

This document defines implementation-level transformation operations, elaborating [data-transformation.md](../04_Data_Engineering/data-transformation.md) with the granularity this milestone requires, and re-emphasizes the category boundary this program has enforced since ED-M2 Part 2A.

## 2. Transformation Operations

| Operation | Detail |
|---|---|
| Normalization | Structural conformance to the canonical schema |
| Standardization | Consistent formatting/casing (e.g., facility-type enumeration values) |
| Unit normalization | All values of a given field converted to one canonical unit (e.g., area to hectares) |
| Identifier mapping | A source's own identifier (or name, where no identifier exists) is mapped to DistrictMind's stable, assigned identifier ([entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) |
| Temporal normalization | Source-specific date/time formats and time zones normalized to the canonical temporal model ([temporal-data-implementation.md](temporal-data-implementation.md)) |
| Spatial normalization | CRS reprojection to the canonical CRS ([spatial-data-implementation.md](spatial-data-implementation.md) Section 3) |
| Categorical normalization | Source-specific category labels mapped to the canonical enumeration ([data-validation-implementation.md](data-validation-implementation.md) Section 2's domain consistency rule) |
| Deduplication | Matched duplicate records collapsed into one Curated entity, retaining provenance for all contributing source records ([data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 6) |
| Aggregation | Rollup across a geographic or temporal grouping (village → mandal → district; daily → monthly) |
| Derived dataset generation | Computing an Analytical Result from Curated data (e.g., a coverage-gap indicator) |

## 3. Category Boundary — Restated and Enforced

**Transformation, Analytical Computation, Prediction, Simulation, and Recommendation are never collapsed into one another.** Restated unchanged from [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 4 and [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md):

| Category | What It Is | What It Is Not |
|---|---|---|
| Transformation | A deterministic, reproducible mapping from Raw/Validated data to Curated data (Section 2 operations) | Not itself a new fact — it is the same fact, reshaped |
| Analytical computation | A deterministic derivation from Curated data into a new, named indicator ([analytical-data-model.md](../05_Database_Design/analytical-data-model.md)) | Not a transformation (it produces new information, not a reshaped copy of existing information); not a Prediction (no model, no future estimate) |
| Prediction | A model's estimate of a future/unobserved value ([prediction-architecture.md](../07_AI_GIS_and_Intelligence/prediction-architecture.md)) | Not a transformation or analytical computation — it involves a trained model and carries irreducible uncertainty |
| Simulation | A sandboxed recomputation under a hypothetical condition ([simulation-architecture.md](../07_AI_GIS_and_Intelligence/simulation-architecture.md)) | Not a Prediction (no historical ground truth to evaluate against); never written to Curated/Analytical storage |
| Recommendation | A multi-criteria composition of Analytical + Prediction + Simulation evidence ([recommendation-engine.md](../07_AI_GIS_and_Intelligence/recommendation-engine.md)) | Not itself a computation of any of the above — it cites them |

## 4. Transformation Lineage

Every transformed record retains a reference to its Raw source and the specific transformation-logic version applied, per [data-lineage-and-provenance-implementation.md](data-lineage-and-provenance-implementation.md) Section 3 — this is what makes Section 3's boundary auditable, not merely asserted.

## 5. Milestone Traceability

| Transformation Capability | First Needed |
|---|---|
| Spatial normalization (Geography) | M1 |
| Full normalization/standardization/deduplication/aggregation across all domains | M2 |
| Feature-specific transformation (windowing, lagging) | M4 |

## 6. Open Decisions

- Entity-matching confidence thresholds (identifier mapping, Section 2) — unchanged open item from [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 9, dependent on real source data.
