---
Document Name: Rainfall Weather Deep Validation
Document ID: ED-DVP-RAIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Rainfall Weather Deep Validation

## 1. Purpose

This document deeply validates the IMD district-rainfall API (Part 2's strongest overall finding), attempting an actual live call rather than relying on documentation review alone, plus a secondary check of the data.gov.in rainfall catalog's real API pattern.

## 2. Deep Validation

### VAL-M6-P3-011 — Live Call to IMD District Rainfall API

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-019 |
| Question | Does the IMD district-rainfall API actually return live data when called, and does it genuinely require no authentication as Part 2's documentation review suggested might be the case? |
| Candidate | `https://api.imd.gov.in/api/v1/districtrainfall` |
| Method | Direct live HTTP GET via `curl`, both with no parameters and with `?id=164` (a specific district ID) |
| Environment | Bash with live internet access |
| Observation | **Both calls returned HTTP 401 with the JSON body `{"error":"API key missing"}`.** This is a real, structured, informative error response — the API is genuinely live and reachable, and clearly signals that an API key **is** required, contrary to what Part 2's documentation-page-only review could conclude ("no explicit authentication requirement... was found documented") |
| Expected | Either live data (if genuinely unauthenticated) or a clear rejection reason |
| Result | **PARTIAL** — the API's live existence and correct JSON error-handling behavior is confirmed (a positive signal about API quality/maturity); the specific claim that it might be usable without authentication is **directly disconfirmed** |
| Evidence | The actual HTTP 401 response body, captured directly |
| Limitation | An actual API key was not obtained or used in this session (registration/key-issuance is outside this session's scope) — so the API's *data content* (full 33-district coverage, temporal resolution, historical depth) remains unverified beyond the single sample response already noted in Part 2's documentation review (the Adilabad example shown on the reference page itself) |
| Decision impact | Corrects and sharpens Part 2's evidence — the API is real and well-built, but the evidence-acquisition path forward requires obtaining an API key (a registration step, not a further technical validation step) before further data-content validation can occur |

### VAL-M6-P3-012 — data.gov.in Rainfall Catalog, Live API Pattern Discovery

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-020 |
| Question | Is the data.gov.in "Rainfall in India" catalog entry backed by a real, live, discoverable API endpoint? |
| Candidate | `data.gov.in/catalog/rainfall-india`, resource UUID `fb5e2a33-3e34-4087-83a1-f0e46f2748d0` |
| Method | Fetched the catalog page directly (unlike Part 2's search-result-level-only review), confirmed HTTP 200 (in contrast to the 403 Part 2 encountered for the *Hospital Directory* catalog page specifically — the two pages behave differently). Extracted a real resource UUID embedded in the page's JavaScript-rendered content via direct text search. Called the standard data.gov.in resource-API pattern (`api.data.gov.in/resource/<uuid>`) directly with that real UUID |
| Environment | Bash with live internet access |
| Observation | The catalog page itself loaded successfully (HTTP 200, confirmed title "Rainfall in India \| Open Government Data (OGD) Platform India", ~1 MB page). The resource API call returned **HTTP 400 with the JSON body `{"error":"Authorization field missing"}`** — again a real, live, structured API requiring a key |
| Expected | Confirmation the catalog page is genuinely live and backed by a real API |
| Result | **PARTIAL** — live accessibility of both the catalog page and its backing API endpoint is confirmed; actual data content remains gated behind the same registration requirement as the IMD API |
| Evidence | Direct HTTP responses, captured verbatim |
| Limitation | No data.gov.in API key was obtained in this session |
| Decision impact | Confirms this is a genuine, real, structured government API family (not a broken/abandoned resource, unlike some Part 2 findings for other datasets) — the path forward is a registration step, not further exploratory research |

## 3. A Pattern Worth Recording — Government APIs Require Registration, Not Further Search

**Both this session's live API tests (IMD, data.gov.in) converged on the same finding: the technical infrastructure is real and well-built, but requires an API key obtained through a registration process this session's tools cannot perform.** This is recorded as a distinct, actionable finding for a future milestone or human developer: the next concrete step for these two candidates is account/API-key registration, not additional technical validation.

## 4. No Rainfall Value Invented

**No actual rainfall figure, station reading, or historical value is reported anywhere in this document** — every observation above is about API *accessibility and authentication behavior*, not weather data content, since no data content could be retrieved without a key.

## 5. Only One Example, Not Proof of Complete Coverage

Restated per this milestone's explicit instruction: the single Adilabad sample response noted in the IMD API's own reference documentation (Part 2 finding, re-confirmed as still the only data point available) is not treated as proof of complete 33-district coverage. This remains an open question pending actual authenticated access.

## 6. Overall Finding

**EVIDENCE PARTIALLY AVAILABLE — upgraded confidence in API genuineness, downgraded confidence in unauthenticated accessibility.** Both government rainfall API candidates (IMD, data.gov.in) are confirmed live, real, and well-structured, but both require an API key not obtained in this session.

## 7. Security

No API key was fabricated, guessed, or bypassed. The authentication requirement discovered is reported honestly as a blocker to further validation, not worked around.

## 8. Observability

Both live HTTP exchanges are captured verbatim above.

## 9. Milestone Traceability

This validation supports Item 4.1 (Weather/Environment domain) and Canonical Example C's Weather stage, first needed for M2 (data), M4 (prediction).

## 10. Open Decisions

No rainfall/weather data source is Confirmed. Obtaining an API key for either IMD or data.gov.in is the concrete recommended next step, to be performed by a human developer or a future session with account-registration capability.
