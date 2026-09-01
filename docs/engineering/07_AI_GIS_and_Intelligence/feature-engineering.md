---
Document Name: Feature Engineering
Document ID: ED-AI-FEAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Feature Engineering

## 1. Purpose

This document defines how raw and derived district data can conceptually be transformed into model-ready features for the Prediction models in [prediction-architecture.md](prediction-architecture.md). It elaborates [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 2's "feature engineering" operation with domain-specific detail. No dataset is invented — every feature category below is grounded in an entity already established in [entity-catalog.md](../05_Database_Design/entity-catalog.md) or explicitly marked **Proposed (engineering inference)**.

## 2. Feature Categories

| Category | Source Entities | Example Features (Conceptual) |
|---|---|---|
| Geographic | District, Mandal, Village (E-GEO-002–004) | Area, boundary shape metrics, centroid location |
| Demographic | Population Observation (E-DEM-001) | Population count, population density (derived from area), historical growth rate |
| Healthcare | Health Facility (E-HLT-001) | Facility count per area, facility capacity per capita, distance to nearest facility |
| Transportation | Road, Road Segment (E-TRN-001–002) | Road density, connectivity/centrality within the network graph |
| Infrastructure | School, Government Office, Water Body (E-INF-001–003) | Facility density, proximity to water bodies |
| Agriculture | Agricultural Observation (E-AGR-001) | Cultivated area, crop type distribution, seasonal pattern indicators |
| Weather | Weather Observation (E-WTH-002) | Rainfall totals/trends, temperature trends, historical extremes |
| Disaster | Disaster Event, Impact Observation (E-DIS-001–002) | Historical event frequency, historical impact severity — **Proposed (inferred)**, consistent with [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 9's status |
| Temporal | Any time-series entity | Trend direction, seasonality indicator, recency/gap indicators |
| Spatial | Any geometry-bearing entity | Proximity/distance features, containment/adjacency features, density-within-radius |
| Cross-domain | Any combination above | E.g., rainfall × terrain proximity-to-water-body (flood risk), population × facility coverage (healthcare demand context) |

## 3. Worked Example — Healthcare Accessibility Features

| Feature (Conceptual) | Derivation |
|---|---|
| Distance to nearest facility | `spatial_query` nearest-feature operation ([spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 6), from a Village to Health Facility |
| Facility capacity | Health Facility's capacity attribute ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-HLT-001), where available (nullable, per that entity's optional-attribute note) |
| Population served | The Population Observation of villages within a facility's computed coverage area ([spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 7) |
| Road accessibility | Travel-time from `accessibility_analysis` ([spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 8), distinct from straight-line distance |

## 4. Worked Example — Flood-Risk Context Features

| Feature (Conceptual) | Derivation |
|---|---|
| Rainfall | Weather Observation, aggregated over a relevant period ([temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 3) |
| Historical event indicators | Disaster Event frequency/severity for the target area — **Proposed (inferred)**, per Section 2 |
| Elevation (where available) | Not currently established by any source document as an ingested dataset — marked **Candidate**, since the Blueprint's Flood Prediction model (§12.1) lists "terrain elevation" among its dataset inputs without confirming a specific elevation data source ([data-sources.md](../04_Data_Engineering/data-sources.md) does not list one) |
| Drainage/infrastructure indicators | Not currently established by any source document — marked **Candidate**, engineering inference only |
| Transport accessibility | Same as Section 3's Healthcare example, reused as a cross-domain feature — flood risk affecting evacuation/access is a genuine cross-domain concern per [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 13 |

## 5. Source Feature vs. Derived Feature vs. Model Feature

| Type | Definition | Example |
|---|---|---|
| **Source feature** | A value read directly from an Observed/Curated record, unmodified | Rainfall value from a single Weather Observation |
| **Derived feature** | A value computed from one or more Source features via a defined, reproducible transformation, independent of any specific model | Monthly rainfall total (an Analytical Result, [analytical-data-model.md](../05_Database_Design/analytical-data-model.md)); distance to nearest facility |
| **Model feature** | A Derived feature specifically shaped/encoded for a particular model's input contract (e.g., normalized, one-hot encoded, windowed) | A rainfall trend encoded as a fixed-length lookback window for a specific Prophet/XGBoost model instance |

This three-way distinction matches [logical-data-model.md](../05_Database_Design/logical-data-model.md) Section 11's "ML Features" category and [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 4's category table — restated here specifically for feature construction, not redefined.

## 6. Feature Lineage

Every Model Feature traces back through Derived features to Source features, per the same lineage chain already established in [data-lineage.md](../04_Data_Engineering/data-lineage.md) Section 2 and [evidence-provenance-flow.md](../06_API_and_Integration/evidence-provenance-flow.md). A feature's lineage record carries: which Source/Derived entities it was built from, the transformation logic version, and the computation timestamp — this is what lets a Prediction's Model Execution Metadata ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-PRD-001) be genuinely reproducible (Reproducibility principle), not just versioned by name.

## 7. Cross-Domain Feature Construction

Cross-domain features (Section 2's last row) require the same spatial/temporal alignment discipline as any cross-domain query ([data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 13): a rainfall feature and a terrain-proximity feature must be aligned to the same geographic unit and comparable time window before being combined — misaligned features (e.g., combining a village-level rainfall reading with a mandal-level population figure without an explicit aggregation step) are treated as a feature-engineering defect, not an acceptable shortcut.

## 8. Milestone Traceability

| Feature Engineering Capability | Milestone |
|---|---|
| Source feature availability across domains | M2 — Future |
| Derived feature computation (coverage, density, accessibility) | M2 — Future |
| Model feature construction for specific Prediction models | M4 — Future |
| Cross-domain feature construction | M4 — Future (Predictive), extended M5–M6 as Simulation/Recommendation consume the same features |

## 9. Open Decisions

- Whether elevation/drainage data (Section 4) is ever sourced — currently Candidate, no identified provider.
- Exact model-feature encoding conventions (normalization, windowing) — deferred to implementation, model-specific, not decided in this documentation-only milestone.
