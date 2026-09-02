---
Document Name: Rainfall and Weather Evidence
Document ID: ED-EAV-RAIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Rainfall and Weather Evidence

## 1. Purpose

This document investigates real rainfall/weather sources for Telangana, evaluating suitability for rainfall analysis, temporal trends, flood/disaster-risk workflows, and the cross-domain Weather→Disaster→Transportation→Healthcare reasoning chain (Canonical Example C). Real web research was performed (access date 2026-09-02). **This is the strongest evidence finding of this entire milestone.**

## 2. Evidence Records

### EV-M6-P2-019 — India Meteorological Department (IMD) Public API — District Rainfall

| Field | Detail |
|---|---|
| Question | Does India's national meteorological authority provide a genuinely public, programmatically accessible, district-level rainfall API? |
| Source | India Meteorological Department (IMD), Ministry of Earth Sciences — the singular authoritative national meteorological agency |
| Resource | `https://api.imd.gov.in/public/api_reference.html`, specifically the endpoint `https://api.imd.gov.in/api/v1/districtrainfall` (and `?id=<district_id>` for a specific district) |
| Acquisition | WebFetch of the API reference page |
| Observation | **This is a real, live, documented, JSON-returning REST API.** The reference page shows a genuine sample response for district **ADILABAD** — an actual Telangana district: `"District": "ADILABAD", "Daily Actual": "0.00", "Daily Normal": "1.70", "Daily Departure Per": "-100%", "Daily Category": "NR"`. This confirms both the API's real existence and its Telangana coverage. No explicit authentication requirement, API key, or rate limit was found documented on this reference page |
| Validation | Direct fetch of the live API reference/documentation page, with an actual sample response for a real Telangana district observed |
| Result | **This is the single strongest, most directly verified piece of evidence in this entire milestone.** A genuinely authoritative government agency (IMD) publishes a working, documented, JSON REST API with confirmed district-level granularity, including at least one confirmed Telangana district (Adilabad) in its own example |
| Limitations | (a) Only the *documentation* page was fetched — the live endpoint itself was not called to confirm it actually returns data at request time, so operational availability/uptime is unconfirmed. (b) Whether authentication is truly not required, or the reference page simply omits documenting it, is not certain — "not explicitly mentioned" is not the same as "confirmed unauthenticated." (c) Whether all 33 Telangana districts (not just Adilabad) are covered, and the exact temporal resolution (daily only, or also historical/hourly), was not exhaustively confirmed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** — real, live, documented API with a confirmed Telangana example; full operational verification (live call, full district coverage, auth confirmation) not performed in this session |
| Decision impact | **Strongest candidate for a future PoC** — this is the one source in this entire milestone recommended for prioritized, actual-endpoint-call verification in a subsequent session |

### EV-M6-P2-020 — data.gov.in "Rainfall in India" Catalog

| Field | Detail |
|---|---|
| Question | Does the central Open Government Data platform separately catalog rainfall data usable alongside or instead of the IMD API? |
| Source | India Meteorological Department, via the Open Government Data (OGD) Platform India |
| Resource | `https://www.data.gov.in/catalog/rainfall-india` |
| Acquisition | WebSearch only; not directly fetched |
| Observation | Described as providing "month-wise all India rainfall data, with sub-division wise rainfall and departure from normal for each month and season" |
| Validation | Search-result-level only |
| Result | Confirms a second, independent government channel for rainfall data exists, at a coarser (monthly, sub-division) granularity than the IMD API's daily/district granularity |
| Limitations | "Sub-division" in IMD terminology is a meteorological grouping, not identical to an administrative district — the exact mapping to DistrictMind's district-level requirement is unconfirmed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — a secondary/cross-check source, not the primary candidate |

### EV-M6-P2-021 — IMDLIB / imdR (Gridded IMD Data Access Libraries)

| Field | Detail |
|---|---|
| Question | Do open-source libraries exist for programmatically retrieving IMD's gridded historical rainfall data (as distinct from the district API)? |
| Source | Independent open-source developers, building on IMD's own gridded data releases |
| Resource | `imdR` (R package, "0.25 degree, 1901-present" gridded daily rainfall) and `IMDLIB` (Python library) |
| Acquisition | WebSearch only |
| Observation | Both libraries are described as interfacing with IMD's own published gridded binary data files, providing long historical time series (1901–present for rainfall) |
| Validation | Search-result-level only |
| Result | Confirms a mature, long-history data-access ecosystem exists around IMD's own gridded products, independent of the district-level REST API — useful for historical trend analysis feeding Prediction domains (Rainfall, Flood) |
| Limitations | Gridded (0.25°) data requires spatial aggregation to district boundaries — this aggregation step is not itself provided by these libraries and would need to be performed by DistrictMind's own pipeline once a boundary dataset (per [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md)) is validated |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — relevant for long-horizon Prediction model training, contingent on the boundary-dataset blocker resolving first |

## 3. Suitability Assessment Against DistrictMind's Requirements

| Requirement | Finding |
|---|---|
| Rainfall analysis | Strongly supported — IMD API (EV-019) provides real-time district rainfall directly |
| Temporal trends | Supported via gridded historical libraries (EV-021), 1901–present |
| Flood/disaster risk workflows | Partially supported — rainfall input exists; flood-risk modeling itself remains a separate, unaddressed data need (see [infrastructure-and-disaster-evidence.md](infrastructure-and-disaster-evidence.md)) |
| Weather→Disaster→Transportation→Healthcare chain (Example C) | The Weather stage of this chain has the strongest evidentiary support found anywhere in this milestone; the Disaster, Transportation, and Healthcare stages remain comparatively weaker (per their own evidence files) |

## 4. No Temporal Resolution or Station Coverage Invented

**Restated per this milestone's explicit instruction:** this document does not invent a specific temporal resolution (e.g., claiming "hourly data" when only daily was confirmed) or a specific station count. Only what was directly observed in the fetched IMD API reference page (daily district-level figures, as shown in the Adilabad example) is reported as confirmed; everything else (full 33-district coverage, historical depth, authentication requirements) is explicitly marked unconfirmed.

## 5. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE, with the strongest confidence of any domain investigated in this milestone.** IMD's public API is real, documented, and demonstrably returns Telangana district-level data in its own official example. This is the single best candidate across all data domains investigated for progressing toward a future PoC and Decision closure.

## 6. Security

No credential was required to view IMD's API documentation; whether the live endpoint itself requires authentication remains unconfirmed and is explicitly flagged as a limitation, not assumed either way.

## 7. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 8. Milestone Traceability

This evidence supports Item 4.1 (Weather/Environment domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2 (data), M4 (prediction), and directly informs Canonical Example C's Weather stage.

## 9. Open Decisions

No rainfall/weather data source is formally confirmed or selected — Evidence Acquired is distinct from Decision, restated unchanged from [decision-closure-workflow.md](../22_Evidence_Acquisition_and_Decision_Closure/decision-closure-workflow.md). EV-M6-P2-019 (IMD API) is strongly recommended as the priority candidate for the next stage of actual PoC verification.
