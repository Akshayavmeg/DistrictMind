---
Document Name: Temporal Data Implementation
Document ID: ED-DGI-TEMP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Temporal Data Implementation

## 1. Purpose

This document defines implementation-level temporal handling, elaborating [temporal-data.md](../04_Data_Engineering/temporal-data.md) and [temporal-database-design.md](../05_Database_Design/temporal-database-design.md) with the full set of time concepts this milestone requires.

## 2. Temporal Concept Inventory

| Concept | Definition | Applies To |
|---|---|---|
| Event time | When a real-world event occurred (e.g., a disaster event's start) | Disaster domain |
| Effective time | The period a fact is considered valid/current | Boundary versions, facility status |
| Ingestion time | When DistrictMind received and validated the record | Every Curated record |
| Observation time | When a measurement was taken (e.g., a weather reading) | Weather, Population, Agriculture |
| Prediction time | The future target period a forecast concerns | Prediction |
| Scenario time | A reference to the baseline snapshot, not a real calendar date | Simulation |
| Validity intervals | The start (and, if superseded, end) of a version's currency | Versioned reference data |
| Historical snapshots | Every prior version, retained and queryable | All temporal entities |
| Latest state | The most recent, non-superseded version | Computed via the versioning key, not separately stored |
| Stale data detection | Comparing "now" against a record's effective/ingestion timestamp against expected freshness | Section 7 below |

## 3. Tying Temporal Concepts to the Six Information Categories

| Category | Primary Temporal Concept |
|---|---|
| Source of Truth (Observed) | Observation time + Effective time + Ingestion time |
| Derived | Ingestion/computation time of its inputs, plus its own computation timestamp |
| Prediction | Prediction time (the forecast horizon) + the model's training/input snapshot time |
| Simulation | Scenario time (baseline snapshot reference) |
| Recommendation | Generation timestamp + the timestamps of every cited evidence item |
| AI Response | Response timestamp + the timestamps of every cited Evidence item |

This restates [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 3's Digital Twin State Model temporal mapping, unchanged.

## 4. Historical Snapshots

Every temporal entity is append-only or explicitly versioned (never destructively overwritten) — restated unchanged from [temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 4, which is the mechanism that makes "state as of date X" queries possible without a separate archive system.

## 5. Latest State

Computed by filtering to the most recent non-superseded version per entity — never separately stored as an independent fact, avoiding the two ever disagreeing (restated from [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) Section 11's "Domain display state" pattern, generalized to the backend).

## 6. How Temporal Inconsistencies Are Detected

| Inconsistency | Detection Mechanism |
|---|---|
| Future-dated Observed record | Rejected at Validation ([data-validation-implementation.md](data-validation-implementation.md) Section 2, temporal consistency) |
| Out-of-order version insertion | Rejected — a new version's effective_from/timestamp must be later than the prior version's, per [temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 5 |
| A Prediction/Scenario referencing a not-yet-existing Dataset Version | Rejected — the referenced snapshot must have existed at or before the Prediction/Scenario's own creation time |
| A gap in an expected time series | Detected by comparing consecutive observation timestamps against the expected sampling interval; represented by absence, never a fabricated fill value |

## 7. Stale Data Detection

A record's freshness is computed as the gap between "now" and the more relevant of its observation/ingestion timestamp, per [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 7 — restated unchanged, and surfaced to every consumer (dashboard, AI) rather than hidden.

## 8. Milestone Traceability

| Temporal Capability | First Needed |
|---|---|
| Ingestion time, effective time, versioning (Geography) | M1 |
| Full observation/historical-snapshot handling across all domains | M2 |
| Prediction time | M4 |
| Scenario time | M5 |

## 9. Open Decisions

- Exact granularity/retention window for historical time-series data per domain — dependent on actual source cadence, unchanged from [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 12.
