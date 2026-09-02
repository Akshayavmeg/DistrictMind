---
Document Name: Data Validation Implementation
Document ID: ED-DGI-VAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Data Validation Implementation

## 1. Purpose

This document defines implementation-level validation stages, elaborating [data-validation.md](../04_Data_Engineering/data-validation.md) with the additional stages this milestone requires (uniqueness, cross-source consistency) and explicit invalid-data handling states.

## 2. Validation Stage Inventory

| Stage | Checks | Source |
|---|---|---|
| Structural validation | Field presence, type, name | [data-validation.md](../04_Data_Engineering/data-validation.md) Section 2 |
| Schema validation | Record conforms to the canonical entity shape ([entity-catalog.md](../05_Database_Design/entity-catalog.md)) | Same, restated |
| Type validation | Value types match expectation | Same |
| Range validation | Numeric values within plausible domain-specific bounds | Same, Section 6 |
| Null validation | Required fields non-null; optional-field nullability respected | Same, Section 2 |
| Uniqueness | No unintended duplicate entity within a batch (distinct from cross-batch deduplication, [data-ingestion-implementation.md](data-ingestion-implementation.md) Section 8) | New at this milestone's granularity — a same-batch uniqueness check prior to entity-matching |
| Referential integrity | Foreign-key-style references resolve to an existing entity | [data-validation.md](../04_Data_Engineering/data-validation.md) Section 7 |
| Temporal consistency | No future-dated Observed records, no impossible sequences | Same, Section 5 |
| Spatial validity | Geometry validity, CRS consistency, boundary consistency | Same, Section 4 |
| Domain consistency | Enumerated values against the known domain vocabulary | Same, Section 3 |
| Cross-source consistency | Where two sources describe the same entity, their values are compared for agreement before either is trusted | New at this milestone's granularity — elaborated in Section 4 below |

## 3. Invalid-Data Handling States

| State | Definition | Promotion Path |
|---|---|---|
| Valid | Passes every applicable rule | Promoted to Curated |
| Invalid | Fails a hard rule (structural, type, referential) | Quarantined, never promoted without correction |
| Quarantined | Held for review, per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 8 | Reprocessed after correction, or permanently rejected |
| Partially accepted | A batch where some records pass and others fail — the passing subset is promoted, the failing subset is quarantined independently | This is the default batch behavior, not an exception — restated from [data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 6's "no partial commit" rule applied at the *record*, not *batch*, level: the batch's successful records are not held hostage by its failing ones, but no failing record is ever silently included |

## 4. Cross-Source Consistency — Detail

When two sources (or two records within the same source) describe what appears to be the same real-world entity with disagreeing values (e.g., two departmental exports reporting different capacity for the same hospital), this is not resolved by Structural/Schema validation alone — it is flagged for the reconciliation process in [data-gis-integration.md](data-gis-integration.md) Section 6, which applies source-precedence and freshness rules rather than validation rejecting either record outright. Validation's role here is limited to *detecting* the disagreement and recording it, not resolving it.

## 5. How Validation Failures Are Recorded

Every validation failure records: which rule was violated, the specific field/value that failed, the record's source and ingestion-run reference, and a timestamp — per [data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 9's ingestion metadata and [data-validation.md](../04_Data_Engineering/data-validation.md) Section 8's audit requirement. This record is what a Data Steward ([data-governance-implementation.md](data-governance-implementation.md)) reviews to correct and reprocess a quarantined record.

## 6. Milestone Traceability

| Validation Capability | First Needed |
|---|---|
| Structural, schema, type, null, spatial validation (Geography) | M1 |
| Range, uniqueness, referential, temporal, domain, cross-source validation (full domain set) | M2 |

## 7. Open Decisions

- Specific plausible-range thresholds per numerical field — not invented, deferred to actual source data distributions once sourced, unchanged from [data-validation.md](../04_Data_Engineering/data-validation.md) Section 11.
- Cross-source precedence rules' exact calibration (Section 4) — cannot be calibrated until real conflicting sources exist.
