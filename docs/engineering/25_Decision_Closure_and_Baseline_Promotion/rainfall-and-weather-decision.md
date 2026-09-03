---
Document Name: Rainfall and Weather Decision
Document ID: ED-DCB-RAIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Rainfall and Weather Decision

## 1. Purpose

This document assesses IMD and data.gov.in rainfall evidence from [rainfall-weather-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/rainfall-weather-deep-validation.md), where **both sources were confirmed real and live but returned an explicit "API key missing"/"Authorization field missing" response, not real rainfall data.**

## 2. What Evidence Actually Exists

| Candidate | Evidence | Result |
|---|---|---|
| IMD (`api.imd.gov.in/api/v1/districtrainfall`) | VAL-M6-P3-011 — direct `curl` call, both with and without a district ID parameter, returned **HTTP 401 `{"error":"API key missing"}`** | **PARTIAL** — API is real, live, and well-structured (it returned a specific, coherent error, not a generic failure); no rainfall data was obtained |
| data.gov.in (`api.data.gov.in/resource/fb5e2a33-...`) | VAL-M6-P3-012 — real resource UUID extracted from the live catalog page, then called directly, returning **HTTP 400 `{"error":"Authorization field missing"}`** | **PARTIAL** — same pattern: real, live, structured, key-gated |

## 3. Why "Confirmed Solely Because the API Exists" Is Explicitly Rejected Here

**This document does not mark either rainfall source Confirmed, Selected, or even RECOMMENDED — PENDING FORMAL APPROVAL**, because no actual rainfall value, coverage extent, temporal range, or schema was ever observed — only an authentication-gate error response. Per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md) Section 3, confirming an API's mere existence and reachability is not equivalent to confirming its Authority, Coverage, Freshness, or Schema — all of which remain completely unknown for both candidates.

## 4. Decision Evidence Record — IMD

| Field | Detail |
|---|---|
| Candidate | IMD district rainfall API |
| PoC evidence | Two real HTTP calls, both returning a structured, real key-missing error |
| Result | Access blocked, not data quality — a distinct category from every other FAIL in this milestone |
| Recommendation | Obtain an API key via IMD's registration process (a human/governance action, not a further technical exploration) |
| Status | **RECOMMENDED — ACCESS VALIDATION REQUIRED** |
| Decision ID | None |

## 5. Decision Evidence Record — data.gov.in

| Field | Detail |
|---|---|
| Candidate | data.gov.in Open Government Data API, rainfall resource |
| PoC evidence | Real resource UUID located via live catalog page text search; real HTTP call returning a structured, real authorization-missing error |
| Result | Access blocked, not data quality |
| Recommendation | Register for a data.gov.in API key |
| Status | **RECOMMENDED — ACCESS VALIDATION REQUIRED** |
| Decision ID | None |

## 6. A Pattern Worth Restating for Governance

Restated from [rainfall-weather-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/rainfall-weather-deep-validation.md) Section 3: both government APIs require registration, not further search — the concrete next action for either candidate is a credential-acquisition step (outside this program's engineering scope), not another PoC attempt against the same unauthenticated endpoint.

## 7. Security

**Neither candidate's key was fabricated, guessed, or brute-forced.** The absence of a key was reported honestly as the actual blocking condition, consistent with this program's "no invented credentials" discipline restated throughout `24_Evidence_Deep_Validation_and_PoC/`.

## 8. Observability

Every HTTP status/error body in this document traces to [rainfall-weather-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/rainfall-weather-deep-validation.md) VAL-M6-P3-011/012 — no new computation performed here.

## 9. Milestone Traceability

Rainfall/weather data first needed M2, and is the entry point of Canonical Example C (Weather→Disaster→Transportation→Healthcare).

## 10. Open Decisions

**No rainfall/weather data source is Confirmed or Selected.** Both IMD and data.gov.in are RECOMMENDED — ACCESS VALIDATION REQUIRED, pending API-key registration outside this program's engineering scope.
