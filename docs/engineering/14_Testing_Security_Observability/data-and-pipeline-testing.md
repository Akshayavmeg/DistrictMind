---
Document Name: Data and Pipeline Testing
Document ID: ED-TSO-DATA-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Data and Pipeline Testing

## 1. Purpose

This document defines testing across DistrictMind's data pipeline, elaborating [data-implementation-architecture.md](../12_Data_GIS_Implementation/data-implementation-architecture.md). No data-quality percentage is invented.

## 2. Pipeline Stages Under Test

```mermaid
flowchart LR
    Source[Source] --> Raw[Raw]
    Raw --> Validation[Validation]
    Validation --> Curated[Curated]
    Curated --> Analytical[Analytical]
    Analytical --> AIML[AI/ML-ready]
    AIML --> Serving[Serving]
```

Each arrow above is a stage transition with its own test focus (Section 3).

## 3. Schema Validation

Tests verify that a record entering the Validation stage is checked against its domain schema ([data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md)) and that a schema violation is rejected/flagged, never silently coerced into a valid-looking record.

## 4. Completeness

Tests verify required fields are present before a record advances to Curated; a record missing a required field is quarantined (Section 12), not defaulted with an unstated assumption.

## 5. Uniqueness

Tests verify duplicate-detection logic correctly identifies two records referring to the same real-world entity (e.g., the same Health Facility ingested twice from overlapping source extracts) — restated unchanged from [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md).

## 6. Consistency

Tests verify cross-field and cross-source consistency checks (e.g., a Village's reported Mandal matches its geometric containment) correctly flag mismatches — restated unchanged from [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md) Section 4.

## 7. Freshness

Tests verify freshness/age computation is correct relative to an injected reference time, restated consistent with [unit-testing.md](unit-testing.md) Section 9.

## 8. Provenance

Tests verify every record entering Curated carries its source identifier, version, and ingestion timestamp intact — restated unchanged from [data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md).

## 9. Lineage

Tests verify a Derived record's lineage correctly traces back to its contributing Source/Curated records — restated unchanged from [data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md) Section 4.

## 10. Transformation Correctness

Tests verify a transformation (e.g., a rolling rainfall average) produces the documented, correct output for known input fixtures — restated consistent with [data-transformation-implementation.md](../12_Data_GIS_Implementation/data-transformation-implementation.md).

## 11. Duplicate Detection

Restated unchanged from Section 5, tested at the pipeline-integration level rather than as an isolated unit-tested function.

## 12. Conflicting Sources

Tests verify the conflict-detection mechanism (Section 7.1, [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md)) correctly flags disagreeing values, and that both disagreeing values plus the resolution outcome are retained rather than one being silently discarded.

## 13. Invalid Records and Quarantine

Tests verify a record failing validation is routed to a quarantine state rather than either being silently dropped or silently admitted — restated unchanged from [data-quality-implementation.md](../12_Data_GIS_Implementation/data-quality-implementation.md).

## 14. Retry

Tests verify a transient ingestion failure (e.g., a temporarily unavailable source) is retried per the bounded retry discipline restated from [data-ingestion-implementation.md](../12_Data_GIS_Implementation/data-ingestion-implementation.md), without producing duplicate records on eventual success.

## 15. Ingestion Failures

Tests verify a total ingestion failure is logged and surfaced (Section on Observability, [observability-and-monitoring.md](observability-and-monitoring.md)) rather than silently skipped, leaving stale data presented as current without disclosure.

## 16. Stale Data

Restated unchanged from Section 7 — tests verify that data exceeding its expected refresh interval is flagged as stale and that this flag propagates to any downstream Derived/Prediction/Evidence consumer.

## 17. Temporal Consistency

Tests verify the temporal concepts (event/effective/ingestion/observation time, restated from [temporal-data-implementation.md](../12_Data_GIS_Implementation/temporal-data-implementation.md)) are consistently applied — e.g., a record's effective time is never later than its ingestion time in a way that would indicate a logical error.

## 18. Spatial Consistency

Tests verify a record's spatial reference (e.g., which Village it belongs to) remains consistent with its geometry-derived containment — restated unchanged from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 3.

## 19. Testing the Fragmentation-Resolution Strategy

Restated in full from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 7, tested end-to-end through the pipeline:

| Stage | Test |
|---|---|
| Canonical schema | Two differently-shaped source records both correctly normalize into the same canonical schema |
| Identifier | Both records correctly resolve to the same stable entity identifier |
| Provenance | Both records' provenance is retained after normalization |
| Conflict detection | A field-level disagreement between the two is correctly flagged |
| Precedence | Where a precedence rule exists, the higher-precedence value is correctly selected as current |
| Freshness | Where no precedence rule applies, the more recent value is correctly preferred, with age disclosed |
| Quality indicator | The presence of a conflict correctly raises a data-quality flag |
| Human review | An unresolvable conflict is correctly queued for Data Steward review rather than resolved by a silent guess |
| Uncertainty | Where a conflict remains unresolved, downstream consumers correctly receive a "contested" disclosure rather than a settled-looking value |

## 20. Security

Test data used for pipeline testing follows the same production-data-separation and no-sensitive-data-leakage rules restated from [test-architecture.md](test-architecture.md) Section 5.

## 21. Observability

Every pipeline test failure should be traceable to the specific stage, source, and record — restated consistent with [data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md).

## 22. Milestone Traceability

| Pipeline Testing Scope | First Needed |
|---|---|
| Schema/completeness/uniqueness/consistency | M2 |
| Fragmentation-resolution strategy | M2 |
| Freshness/temporal/spatial consistency for prediction-feeding data | M4 |

## 23. Open Decisions

- Data-quality percentage/threshold — intentionally not defined, per this milestone's instruction.
- Test data source — blocked pending resolution of the no-confirmed-data-source gap ([data-source-implementation.md](../12_Data_GIS_Implementation/data-source-implementation.md)).
