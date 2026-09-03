---
Document Name: Healthcare Data Decision
Document ID: ED-DCB-HEALTH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Healthcare Data Decision

## 1. Purpose

This document assesses EV-M6-P3-001 (Overpass/OSM) and EV-M6-P3-002 (NIC) against DistrictMind's healthcare data requirements, using [healthcare-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/healthcare-data-deep-validation.md)'s real findings, **without hiding the NIC dataset's disclosed quality problems.**

## 2. Candidates Compared

| Candidate | Evidence ID | Validation ID | Records (Warangal-area) | Provenance | Result |
|---|---|---|---|---|---|
| OSM/Overpass (live query) | EV-M6-P3-001 | VAL-M6-P3-006, VAL-M6-P3-007 | 110 | Crowdsourced (Candidate-tier, per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md)) | **PASS** for field availability and a real 10km coverage PoC |
| NIC national health facilities | EV-M6-P3-002 | VAL-M6-P3-016 (cross-reference) | 658 | Government (NIC HealthGIS, Authoritative-tier if verified) | **PASS with disclosed issues**: 54% exact-duplicate rate (358 of 658 records), stale district labels (old 10-district structure) |

## 3. The Duplication Issue — What It Does and Does Not Affect

**This is a distinction this document makes explicitly, since the brief requires assessing whether the 10km coverage question can still be answered:**

| Query Type | Affected by 54% Duplication? | Why |
|---|---|---|
| "Which areas are outside 10km healthcare coverage?" (nearest-facility-within-radius) | **Not materially affected** | A duplicate record at the same coordinates as an existing record does not change which points on the map fall within or beyond 10km of *some* facility — the coverage geometry is a function of the *set of distinct locations*, not the *count* of records at each location |
| "How many healthcare facilities does Warangal have?" (facility-count/capacity analysis) | **Materially affected** | A naive `COUNT(*)` over the raw NIC records would overstate the true facility count by roughly a factor of two, since 358 of 658 records are exact duplicates |

**This means the NIC dataset's coordinates could, in principle, support real coverage computation once deduplicated or once duplicates are correctly collapsed to unique locations — but any capacity, count, or facility-density claim drawn from the raw dataset without deduplication would be actively misleading.** This document does not claim deduplication has been performed — it has not.

## 4. The Stale-District-Label Issue

Restated from [data-provenance-and-fragmentation-validation.md](../24_Evidence_Deep_Validation_and_PoC/data-provenance-and-fragmentation-validation.md) VAL-M6-P3-023: the NIC dataset's `district` attribute uses the old 10-district structure. **This affects only the district *label* field, not the underlying facility coordinates.** The coordinates themselves can, in principle, be correctly re-assigned to a current (33-district) district via the spatial-join technique already demonstrated with real data in [education-agriculture-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/education-agriculture-deep-validation.md) VAL-M6-P3-020 — but **this re-derivation was not actually performed for the NIC healthcare records in Part 3**, and is not performed in this decision file either.

## 5. Decision Evidence Record — OSM/Overpass

| Field | Detail |
|---|---|
| Candidate | Overpass live query, `amenity=hospital\|clinic`, Warangal |
| PoC evidence | 110 real records; a genuine 10km coverage PoC executed against a real (validated) polygon and a synthetic test grid, labeled as such |
| Result | PASS (coverage PoC, small scale) |
| Limitations | Crowdsourced provenance (Candidate, not Authoritative); shared public API subject to rate limiting, as directly observed for other queries this session |
| Recommendation | Usable now as a working, small-scale candidate for coverage-style computation demonstrations; not recommended as the sole authoritative healthcare source |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL**, specifically for coverage-style (geometry-only) use cases; not for facility-identity or capacity claims |
| Decision ID | None |

## 6. Decision Evidence Record — NIC National Health Facilities

| Field | Detail |
|---|---|
| Candidate | NIC HealthGIS-sourced national dataset, via `yashveeeeeeer/india-geodata` |
| PoC evidence | 658 real Warangal-area records; 0 null geometry, 0 null `village_id`; 54% duplication and stale district labels both directly observed and quantified |
| Result | PASS with disclosed issues |
| Limitations | Duplication affects count/capacity use; stale labels affect district attribution (not coordinates); direct-primary-source provenance (NIC itself, vs. the aggregator's claim) not independently verified; licensing not verified |
| Recommendation | **Selected as a working candidate, conditional on two remediation steps being completed before any Curated promotion**: (1) deduplication of exact-duplicate records (a mechanical, low-risk step, since `source_id` values are already unique per record despite content duplication — meaning the duplication is a data-content issue, not an identifier-collision issue), and (2) spatial re-derivation of current-district assignment via the already-demonstrated point-in-polygon technique |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL, WITH MANDATORY REMEDIATION AS A NAMED PRECONDITION** — not a clean Selected, since data quality prevents the dataset from being treated as authoritative for facility count/capacity today |
| Decision ID | None |

## 7. Can the 10km Coverage Question Be Answered Today?

**Partially, and only with OSM, which has already been PoC-tested end-to-end (VAL-M6-P3-007).** The NIC dataset's raw coordinates could extend this to a larger, more government-authoritative set of facilities, but **not until deduplication is actually performed** — this document does not claim the NIC dataset is ready for authoritative coverage-gap decision-making today, consistent with the brief's explicit instruction: "If data quality prevents authoritative decision-making, say so." **It does say so, for the NIC dataset specifically, while noting that the coverage geometry question (as opposed to the facility-count question) is the less-affected of the two.**

## 8. Security

No credential was required for either source. No patient-level or individually-identifying data was involved — both sources are facility-location datasets.

## 9. Observability

Every count in this document traces to [healthcare-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/healthcare-data-deep-validation.md) and [data-provenance-and-fragmentation-validation.md](../24_Evidence_Deep_Validation_and_PoC/data-provenance-and-fragmentation-validation.md) — no new computation was performed in this file.

## 10. Milestone Traceability

Healthcare data first needed M2; the 10km coverage canonical example spans M2 (Diagnostic) through M6 (Agentic).

## 11. Open Decisions

**No healthcare data source is Confirmed or Selected.** OSM is RECOMMENDED — PENDING FORMAL APPROVAL for coverage-style use. NIC is RECOMMENDED — PENDING FORMAL APPROVAL, WITH MANDATORY REMEDIATION (deduplication, current-district re-derivation) as a named precondition, not yet performed.
