---
Document Name: Data/GIS Integration
Document ID: ED-DGI-INTEG-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Data/GIS Integration

## 1. Purpose

This document defines how non-spatial and spatial data interact, elaborates the fragmentation-resolution strategy (Section 19 of this milestone's brief) beyond what [data-source-implementation.md](data-source-implementation.md) Section 4 already established, and carries this milestone's required Performance (Section 20) and Security (Section 21) treatment, since no dedicated file exists for either among the 14 required files.

## 2. Domain Examples of Attribute + Geometry Integration

| Domain | Attributes | Geometry | Integration Mechanism |
|---|---|---|---|
| Healthcare | Facility name, type, capacity | Facility point | Attributes and geometry are two columns of the same Curated entity ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-HLT-001) — not separately joined, since they describe the identical real-world object |
| Transportation | Road name, class | Road line geometry | Same pattern — one entity, attribute + geometry columns |
| Demographics | Population count, year | Administrative (Village) geometry | **A genuine spatial join** — Population Observation has no geometry of its own; it references a Village by stable identifier, and the Village's geometry is what any spatial query against population data actually uses |
| Weather | Rainfall, temperature | Station point + spatial extent (for aggregation) | Observation attributes attach to a Station point; spatial extent (e.g., "average rainfall in District X") is computed via nearest-station or spatial-aggregation join at query time, never pre-joined and stored |
| Disaster | Risk classification, severity | Affected-area extent | Attributes attach to a Disaster Event; the affected-area geometry may itself be Observed, Derived, or Predicted, and this state label travels with the geometry, not just the attributes |

## 3. Spatial Joins

Restated unchanged from [relationship-model.md](../05_Database_Design/relationship-model.md) Section 4: a computed spatial join (e.g., "which village is this population figure describing," resolved via the Village's stable identifier rather than geometry at all; or "which mandal contains this hospital," resolved via `ST_Contains`-equivalent containment) is never stored as a stale, potentially-incorrect foreign key.

## 4. Shared Identifiers

Every domain's Curated entities reference the Geography hierarchy (District/Mandal/Village) via the identical stable-identifier strategy ([entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) — this is what allows Demographics, Healthcare, Weather, and Disaster data to be joined against a common geographic frame without each domain inventing its own geographic reference scheme.

## 5. Administrative Hierarchy

State → District → Mandal → Village remains the single geographic backbone every domain attaches to, restated unchanged from [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 3.

## 6. Temporal Alignment

A cross-domain query (e.g., correlating rainfall with agricultural yield) must align both domains' data to a comparable time window before combining them — restated unchanged from [feature-engineering.md](../07_AI_GIS_and_Intelligence/feature-engineering.md) Section 7's cross-domain feature construction discipline: misaligned temporal granularity (e.g., a daily rainfall reading combined with an annual yield figure without explicit aggregation) is treated as an integration defect, not an acceptable shortcut.

## 7. Source Precedence and Data Reconciliation — The Fragmentation Problem

**This is a critical DistrictMind issue**, restated and elaborated from [data-source-implementation.md](data-source-implementation.md) Section 4.

```mermaid
flowchart LR
    Sources[Different Sources] --> Adapters[Source Adapters]
    Adapters --> Canonical[Canonical Representation]
    Canonical --> Validation[Validation]
    Validation --> IDRes[Identifier Resolution]
    IDRes --> TempAlign[Temporal Alignment]
    TempAlign --> SpatAlign[Spatial Alignment]
    SpatAlign --> Prov[Provenance]
    Prov --> Curated[Curated Dataset]
    Curated --> Intelligence[Intelligence]
```

### 7.1 When Two Sources Disagree

| Step | Detail |
|---|---|
| Conflict detection | The cross-source consistency check ([data-validation-implementation.md](data-validation-implementation.md) Section 4) flags disagreeing values for the same matched entity — this is a detection mechanism, not a resolution one |
| Source precedence | A documented (but not yet calibrated, since no real conflicting sources exist) rule determines which source's value is treated as more authoritative for a given field — e.g., a government department's own registry might take precedence over a third-party aggregation for facility capacity, while OSM might take precedence for road geometry given its continuous community maintenance |
| Freshness | Where precedence is not clearly established, the more recently updated value may be preferred, with its age disclosed regardless |
| Provenance | Both disagreeing values, and which was ultimately selected (and why), are retained — the "losing" value is never silently discarded from the record |
| Quality indicators | The presence of an unresolved or recently-resolved conflict is itself a data-quality signal, surfaced per [data-quality-implementation.md](data-quality-implementation.md) |
| Human review where needed | A conflict that precedence/freshness rules cannot confidently resolve is queued for Data Steward review ([data-governance-implementation.md](data-governance-implementation.md)), rather than resolved automatically by a guess |
| Uncertainty | Where a conflict remains unresolved, downstream consumers (dashboard, AI) disclose that the value is contested, rather than presenting one side as settled fact |

### 7.2 No Guarantee of Perfect Data

**This document does not claim the system can guarantee perfect data.** The mechanisms above (Section 7.1) are designed to make fragmentation *visible and manageable*, not to eliminate it — restated consistently with [data-quality.md](../04_Data_Engineering/data-quality.md)'s refusal to invent quality guarantees, and with the Blueprint's own acknowledgment (§17) that government datasets are often incomplete or inconsistent.

## 8. Performance

Restated and consolidated from [database-performance.md](../05_Database_Design/database-performance.md), [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md), and [gis-implementation-architecture.md](gis-implementation-architecture.md), applied specifically to the data/GIS integration surface:

| Concern | Strategy |
|---|---|
| Ingestion performance | Batch processing with bounded batch sizes; large datasets processed incrementally where a stable change-detection mechanism exists ([data-ingestion-implementation.md](data-ingestion-implementation.md) Section 3) |
| Large dataset handling | Server-side simplification and level-of-detail scoping for geometry ([gis-implementation-architecture.md](gis-implementation-architecture.md) Section 8); precomputed Analytical Results for non-spatial aggregates |
| Spatial query performance | Mandatory spatial indexing ([database-indexing-strategy.md](../05_Database_Design/database-indexing-strategy.md) Section 4) |
| Geometry simplification | Restated from Section 8, [gis-implementation-architecture.md](gis-implementation-architecture.md) |
| Caching boundary | Source-data and Derived-data caching kept distinct, per [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) Section 2 |
| Asynchronous computation | Ingestion, large spatial aggregations, and any cross-domain chain exceeding the sync/async criteria ([background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) Section 3) run as background jobs |
| Incremental updates | Restated from [data-ingestion-implementation.md](data-ingestion-implementation.md) Section 3 |
| Indexing | Restated from [database-indexing-strategy.md](../05_Database_Design/database-indexing-strategy.md) |
| Batch processing | The default ingestion mode (AD-DE-003) |
| Memory considerations | Large geometry payloads are streamed/paginated by spatial extent (AD-GIS-001), not loaded wholesale into memory at any layer |

**No numeric performance target is invented here** — every reference above points to an already-established Initial Target (NFR-001–NFR-003, NFR-035–NFR-036) or an open measurement criterion, restated unchanged. The UI Responsiveness Contract ([frontend-performance-and-responsiveness.md](../10_Frontend_Implementation/frontend-performance-and-responsiveness.md) Section 3) is preserved without modification.

## 9. Security

Restated and consolidated from [security-architecture.md](../02_System_Architecture/security-architecture.md) and [backend-observability.md](../09_Backend_Implementation/backend-observability.md) Section 5, applied specifically to the data/GIS surface:

| Concern | Detail |
|---|---|
| Source credentials | Never hardcoded, never logged, never placed in any documentation as an actual value — restated unchanged from [configuration-management.md](../08_Implementation_Foundation/configuration-management.md) |
| Secrets | Same, restated |
| Ingestion access | Ingestion adapters use least-privilege, source-specific credentials, distinct from the application's general database role |
| Dataset access | Governed by the classification scheme in [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3 |
| Sensitive data | Population/health-adjacent data classified Potentially Sensitive or higher, access-scoped accordingly |
| Authorization | Every data/GIS read enforces the same server-side authorization as any other API request — restated unchanged from [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md) |
| Audit | Every ingestion run, correction, and conflict-resolution decision (Section 7.1) is audit-logged |
| Provenance integrity | Provenance metadata is never itself editable by a downstream consumer — only by the ingestion/transformation process that produced it |
| Data tampering | A record's provenance chain ([data-lineage-and-provenance-implementation.md](data-lineage-and-provenance-implementation.md)) makes an unauthorized modification detectable (a value with no corresponding ingestion-run/transformation-version trail is anomalous) |
| External source trust | No external source (including OpenStreetMap) is implicitly trusted more than the validation pipeline permits — every source passes through identical validation regardless of category ([external-integration-design.md](../06_API_and_Integration/external-integration-design.md) Section 5) |

**No secret value of any kind appears in this document or any document in this folder.**

## 10. Milestone Traceability

| Integration Capability | First Needed |
|---|---|
| Geography-anchored shared identifiers, spatial joins (Geography only) | M1 |
| Full cross-domain attribute+geometry integration, fragmentation-handling mechanisms | M2 |
| Cross-domain temporal alignment for prediction features | M4 |

## 11. Open Decisions

- Source precedence rule calibration (Section 7.1) — cannot be finalized until real conflicting sources exist.
- Every technology/source status referenced throughout remains exactly as open as established elsewhere in this program.
