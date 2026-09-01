---
Document Name: Temporal Database Design
Document ID: ED-DB-TEMP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Temporal Database Design

## 1. Purpose

This document defines temporal modeling at the database level, elaborating [temporal-data.md](../04_Data_Engineering/temporal-data.md) (data-engineering level) with concrete entity-level temporal keys and consistency rules. No temporal query implementation (SQL, application logic) is defined here.

## 2. The Five Temporal Concepts

| Concept | Definition | Where It Applies |
|---|---|---|
| **Observation time** | When the real-world fact occurred/was measured | Population Observation's effective year; Weather Observation's date |
| **Effective time** | The period during which a fact is considered valid/current | A boundary version's validity period; a facility's active/closed status period |
| **Ingestion time** | When DistrictMind's database received and validated the record | Every Curated record, via its Dataset Version reference ([entity-catalog.md](entity-catalog.md) E-AUD-002) |
| **Validity period** | The explicit start/end (if any) over which a record is the "current" version of a fact | Used for versioned reference data (District/Mandal/Village boundaries, Facility status) |
| **Forecast horizon** | The future period a Prediction concerns | Prediction/Forecast entity ([entity-catalog.md](entity-catalog.md) E-PRD-002) |
| **Scenario time** | Not a real calendar time — a reference to the baseline snapshot a Scenario was computed against | Scenario entity ([entity-catalog.md](entity-catalog.md) E-SIM-001) |
| **Version timestamp** | The database-internal marker distinguishing successive versions of the same logical fact | Every versioned entity, per the Blueprint's own mechanism (§9.3) |

These map directly onto [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 6's Observation/Effective distinction and Section 8's versioning mechanism — this document makes them concrete per entity.

## 3. Temporal Keys by Entity

| Entity | Temporal Key Pattern |
|---|---|
| Population Observation | (village, effective_year) — append-only, no overwrite |
| Weather Observation | (station, date, observation_type) — append-only |
| Agricultural Observation | (village, crop, season) — append-only |
| Disaster Event | (event, version) — event evolves over time; each refinement is a new version, with start_time fixed and end_time/extent updated across versions |
| District/Mandal/Village boundary | (entity, version, effective_from) — versioned reference data |
| Health Facility | (facility, version, effective_from) — versioned reference data (capacity changes, status changes) |
| Analytical Result | (indicator, target entity, computed_at) — append-only, recomputed values never overwrite prior computations |
| Prediction | (model_execution, target entity, horizon) — append-only, immutable once created |
| Scenario Output | (scenario, computed_at) — immutable once created |
| Recommendation | (recommendation, status, status_changed_at) — status transitions are new audit-logged events, not silent updates |
| Audit Event | (event, timestamp) — append-only, immutable |

## 4. Historical State Reconstruction — Conceptually

Because every temporal entity above is append-only or explicitly versioned (never destructively overwritten), "what did DistrictMind believe about District X as of date Y" is, conceptually, answerable by filtering every relevant entity to its version/observation that was current as of date Y — without a separate historical-archive system. This is the same mechanism [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 8 describes at the data-engineering level, restated here as a database design commitment: **no temporal entity's physical design may destructively overwrite a prior value.**

### 4.1 Population Example

```
2021 → 2022 → 2023 → 2024 → Current estimate → Future projection
(Observed)  (Observed) (Observed) (Observed)   (Derived/latest)   (Predicted)
```

Each year is its own Population Observation row (Section 3); "current estimate" is simply the latest Observed row (a Derived read, not a new stored fact, unless a specific current-year estimate is itself a distinct interpolated/Derived record — in which case it is explicitly labeled as such, per [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 7); "future projection" is a Prediction record (E-PRD-002), structurally distinct from every Observed row before it.

### 4.2 Weather Example

```
timestamp → observation → aggregation → forecast
(raw)        (Weather Obs. row)  (Analytical Result: e.g. monthly total)  (Prediction row)
```

Each stage is a different entity type (Section 3), never conflated — an "aggregation" (monthly total) is an Analytical Result referencing the underlying Weather Observations it summarizes, not a modification of those observations themselves.

### 4.3 Disaster Example

```
event start → event evolution → impact → recovery
(Disaster Event v1) → (Disaster Event v2, v3...) → (Impact Observation rows) → (Disaster Event status = resolved)
```

Every "evolution" step is a new version of the Disaster Event (Section 3), preserving the full history of how the event's known extent/severity changed over time — important both for post-event review and for training future risk models on realistic event progressions (Blueprint §12.1).

## 5. Temporal Consistency Rules

| Rule | Applies To | Rationale |
|---|---|---|
| No future-dated Observed records | All Observed-state entities | Per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 5 — only Predicted/Scenario state may reference a future date |
| Monotonic version ordering | All versioned entities | A version N+1 always has a later effective_from/timestamp than version N — no out-of-order version insertion |
| Immutability of Prediction/Scenario Output/Audit Event once created | Section 3 rows marked "immutable" | Required for Reproducibility and Audit trail integrity |
| Referential temporal consistency | Prediction → Dataset Version; Scenario → baseline snapshot | A Prediction/Scenario must reference a Dataset Version that actually existed (was already ingested) at or before the Prediction/Scenario's own creation time — never a future or not-yet-existing snapshot |
| Explicit gap representation | Time-series entities (Population, Weather, Agriculture) | A missing period is represented by absence of a row, never a zero-filled or duplicated-prior-value row, per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 5 |

## 6. Relationship to the Digital Twin State Model

Every temporal key pattern in Section 3 maps to exactly one state category from [digital-twin-state-model.md](digital-twin-state-model.md):

| Temporal Pattern | State Category |
|---|---|
| Append-only Observed time series (Population, Weather, Agriculture) | Observed State |
| Analytical Result | Derived State |
| Prediction | Predicted State |
| Scenario Output | Scenario State |
| Recommendation | Recommended State / Action |

This is not a coincidence — it is the design intent: **temporal structure is one of the two mechanisms (alongside logical/schema separation) that enforce the five-way state distinction** at the database level. See [digital-twin-state-model.md](digital-twin-state-model.md) Section 5 for the full enforcement discussion.

## 7. Milestone Traceability

| Temporal Capability | Milestone |
|---|---|
| Boundary versioning (District/Mandal/Village) | M1 |
| Full time-series across all domains, facility versioning | M2 — Future |
| Forecast horizon modeling | M4 — Future |
| Scenario baseline referencing | M5 — Future |
| Recommendation status-transition timestamping | M6 — Future |

## 8. Open Decisions

- Exact granularity/retention window for historical time-series data per domain (dependent on real source cadence, [data-sources.md](../04_Data_Engineering/data-sources.md)).
- Whether boundary/facility versioning uses a full "valid-time" interval (`effective_from`/`effective_to`) or a simpler "latest version wins, prior versions retained" pattern — **To Be Evaluated** at physical design time; both satisfy the non-destructive-overwrite rule in Section 4, differing only in query ergonomics.
