---
Document Name: Data Source Requirements
Document ID: ED-DTR-DATAREQ-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Data Source Requirements

## 1. Purpose

This document defines what DistrictMind actually requires from a data source, per domain, elaborating [data-source-implementation.md](../12_Data_GIS_Implementation/data-source-implementation.md). **No actual source provider is named or invented.** Every domain's source status is restated as **SOURCE UNRESOLVED**, consistent with prior milestones.

## 2. Requirement Dimensions — Applied Per Domain

| Dimension | What It Establishes |
|---|---|
| Required information | The specific fields/attributes DistrictMind needs from this domain |
| Minimum semantic requirements | What a value must actually mean (e.g., "population" must specify what is counted and when) |
| Spatial requirements | Geometry type, resolution, reference frame needed |
| Temporal requirements | How current, how frequently updated, what historical depth |
| Provenance requirements | Traceable origin, version, and responsible party |
| Freshness requirements | Acceptable staleness before a value is flagged (restated conceptually — no numeric value invented) |
| Quality requirements | Completeness, accuracy, and consistency expectations |
| Licensing/access considerations | Whether the data can legally be ingested, stored, and served by DistrictMind |
| Integration requirements | How the source's shape maps onto DistrictMind's canonical schema ([data-fragmentation-resolution.md](data-fragmentation-resolution.md)) |

## 3. Geographic Data (District/Mandal/Village Boundaries)

| Dimension | Requirement |
|---|---|
| Required information | Administrative hierarchy (State→District→Mandal→Village), boundary polygons, names, codes |
| Minimum semantic requirements | An unambiguous administrative identifier per unit, distinct from its display name |
| Spatial requirements | Valid, non-self-intersecting polygon geometry; topologically consistent hierarchy (a Village's geometry falls within its Mandal's) |
| Temporal requirements | Current administrative boundaries; historical boundary changes tracked if administrative reorganization occurs |
| Provenance requirements | Traceable to an authoritative administrative source |
| Freshness requirements | Refreshed when administrative boundaries change (infrequent, but must be detectable) |
| Quality requirements | No gaps or overlaps between adjacent units |
| Licensing/access | Must permit redistribution within DistrictMind's own rendered map |
| Integration requirements | Maps directly onto the Geography entity hierarchy ([entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) |
| **Source status** | **SOURCE UNRESOLVED** — elaborated fully in [district-boundary-dataset-requirements.md](district-boundary-dataset-requirements.md) |

## 4. Roads / Transportation

| Dimension | Requirement |
|---|---|
| Required information | Road segment geometry, road class, connectivity (routable network topology) |
| Minimum semantic requirements | A road class taxonomy sufficient to distinguish major routes from minor ones for accessibility computation |
| Spatial requirements | Line geometry, network-topologically valid (no dangling/disconnected segments where connectivity is claimed) |
| Temporal requirements | Reasonably current; road closures/changes should be reflected within an operationally reasonable window |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Sufficient for accessibility computation to remain meaningful |
| Quality requirements | Consistent connectivity — a broken graph produces incorrect accessibility results |
| Licensing/access | Must permit computation (routing) and redistribution |
| Integration requirements | Feeds the routable graph used in Example B (bridge closure) and Example C (rainfall-transportation impact) |
| **Source status** | **SOURCE UNRESOLVED** |

## 5. Healthcare Facilities

| Dimension | Requirement |
|---|---|
| Required information | Facility location (point geometry), type, capacity where available |
| Minimum semantic requirements | A consistent facility-type taxonomy |
| Spatial requirements | Accurate point geometry |
| Temporal requirements | Facility openings/closures reflected reasonably promptly |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Sufficient for coverage/accessibility computation (Example A) to remain meaningful |
| Quality requirements | No duplicate facility records; consistent identifiers |
| Licensing/access | Must permit public-facing display |
| Integration requirements | Feeds `coverage_analysis`/`accessibility_analysis` directly |
| **Source status** | **SOURCE UNRESOLVED** |

## 6. Weather/Environment

| Dimension | Requirement |
|---|---|
| Required information | Station-level observations (rainfall, temperature, humidity) with station location |
| Minimum semantic requirements | Consistent units and measurement methodology across stations |
| Spatial requirements | Station point geometry; spatial aggregation to district/region level requires known station coverage density |
| Temporal requirements | Frequent enough to support the rainfall canonical example (Example C) — no specific interval invented |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Near-current for disaster-risk relevance |
| Quality requirements | Outlier/sensor-error detection |
| Licensing/access | Must permit ingestion and derived computation |
| Integration requirements | Feeds spatial aggregation and the disaster-risk assessment stage of Example C |
| **Source status** | **SOURCE UNRESOLVED** |

## 7. Disaster

| Dimension | Requirement |
|---|---|
| Required information | Disaster event records, affected-area extent, severity classification |
| Minimum semantic requirements | A consistent severity/risk classification scheme |
| Spatial requirements | Affected-area geometry, which may itself be Observed, Derived, or Predicted (state label must travel with the geometry) |
| Temporal requirements | Event timing, duration |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Time-critical for real disaster response relevance |
| Quality requirements | Consistent classification across events |
| Licensing/access | Must permit public-facing disclosure |
| Integration requirements | Feeds Example C's disaster-risk stage and FR-028's risk score |
| **Source status** | **SOURCE UNRESOLVED** |

## 8. Agriculture

| Dimension | Requirement |
|---|---|
| Required information | Crop type, season, yield data, soil-type category |
| Minimum semantic requirements | A consistent crop/season taxonomy |
| Spatial requirements | Field or mandal-level spatial reference, granularity to be determined by source availability |
| Temporal requirements | Seasonal cadence |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Seasonal — sufficient to support the Crop prediction domain |
| Quality requirements | Consistent unit reporting across regions |
| Licensing/access | Must permit ingestion and derived analytics |
| Integration requirements | Feeds the Crop prediction domain ([prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 13) |
| **Source status** | **SOURCE UNRESOLVED** |

## 9. Infrastructure

| Dimension | Requirement |
|---|---|
| Required information | Facility/asset location, type, condition where available |
| Minimum semantic requirements | Consistent asset-type taxonomy |
| Spatial requirements | Point or area geometry depending on asset type |
| Temporal requirements | Reasonably current |
| Provenance requirements | Source and version traceable |
| Freshness requirements | Sufficient for infrastructure-risk assessment |
| Quality requirements | Deduplicated, consistently classified |
| Licensing/access | Must permit public-facing disclosure |
| Integration requirements | Feeds Analytical layer infrastructure indicators |
| **Source status** | **SOURCE UNRESOLVED** |

## 10. Demographic

| Dimension | Requirement |
|---|---|
| Required information | Population counts, growth indicators, at Village/Mandal/District granularity |
| Minimum semantic requirements | A consistent census/estimate methodology, with the methodology itself disclosed |
| Spatial requirements | Anchored to the Geography hierarchy (Section 3), not independently geolocated |
| Temporal requirements | Periodic (e.g., census cadence), with growth trend estimation between periods |
| Provenance requirements | Source and version traceable |
| Freshness requirements | As current as the source's own update cadence permits |
| Quality requirements | Classified per [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3 (Potentially Sensitive) |
| Licensing/access | Must permit derived computation (coverage-gap population weighting) without violating privacy constraints |
| Integration requirements | Feeds population-uncovered term in the Recommendation weighted-scoring formula ([recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md) Section 6) |
| **Source status** | **SOURCE UNRESOLVED** |

## 11. No Source Provider Named — Restated

**Every domain in Sections 3–10 is marked SOURCE UNRESOLVED.** This document defines *what is needed*; it does not identify, evaluate, or invent *who provides it*. Doing so is explicitly out of scope, per this milestone's "No Web Assumption" instruction — no dataset or provider is claimed authoritative for DistrictMind based on general knowledge.

## 12. Security

Every domain's data, once sourced, is subject to the classification scheme in [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3 before ingestion — restated unchanged, applied here as a requirement rather than a retrospective check.

## 13. Observability

Once a real source is identified for any domain, its onboarding should be recorded as a Baseline Update per [technology-decision-gates.md](technology-decision-gates.md) Section 8.

## 14. Milestone Traceability

| Domain | First Needed |
|---|---|
| Geographic (boundaries) | M1 |
| Roads, Healthcare | M2 |
| Weather, Disaster | M2 (data), M4 (prediction) |
| Agriculture, Infrastructure, Demographic | M2 |

## 15. Open Decisions

Every domain's actual source provider remains SOURCE UNRESOLVED — restated unchanged from [data-source-implementation.md](../12_Data_GIS_Implementation/data-source-implementation.md); this document resolves none of them.
