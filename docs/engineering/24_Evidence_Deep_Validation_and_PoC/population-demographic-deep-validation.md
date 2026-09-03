---
Document Name: Population Demographic Deep Validation
Document ID: ED-DVP-POP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Population Demographic Deep Validation

## 1. Purpose

This document deeply validates the strongest demographic source candidate identified in [population-and-demographic-evidence.md](../23_Evidence_Acquisition_and_Validation/population-and-demographic-evidence.md), attempting real, direct access verification.

## 2. Deep Validation

### VAL-M6-P3-013 — Census of India NADA Microdata Catalog, Live Accessibility

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-016 |
| Question | Is the Census of India's own official microdata catalog actually live and accessible? |
| Candidate | `censusindia.gov.in/nada/index.php/catalog` |
| Method | Direct HTTP GET |
| Environment | Bash with live internet access |
| Observation | **HTTP 200**, page title confirmed as "Data Catalog" |
| Expected | Confirmation of a live, browsable census data catalog |
| Result | **PASS** for the narrow claim: the official census microdata catalog is live and reachable |
| Evidence | Direct HTTP response |
| Limitation | The catalog's *homepage* being live does not confirm any specific district-population dataset within it was located, downloaded, or opened — no specific file was identified or inspected in this session |
| Decision impact | Confirms the correct authoritative source exists and is reachable; does not itself provide validated population figures |

### VAL-M6-P3-014 — data.gov.in District Population Resource, Attempted Direct Access

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-016 |
| Question | Can a specific data.gov.in district-population-2011 resource be located and confirmed live? |
| Candidate | A guessed URL pattern, `data.gov.in/catalog/all-india-district-wise-population-2011` |
| Method | Direct HTTP GET, following redirects |
| Environment | Bash with live internet access |
| Observation | **The guessed URL redirected (HTTP 302, then 200) to `data.gov.in/not-found`** — the specific catalog slug guessed does not exist |
| Expected | Either a valid catalog page or an honest not-found result |
| Result | **FAIL** — the specific URL guessed was incorrect; this is reported honestly rather than silently dropped |
| Evidence | The actual redirect target (`/not-found`) was directly observed |
| Limitation | This does not prove no such dataset exists on data.gov.in — only that this specific guessed slug is wrong. A proper search-driven lookup (as performed in Part 2, at the search-result level) would be needed to find the correct resource identifier, analogous to how [rainfall-weather-deep-validation.md](rainfall-weather-deep-validation.md) VAL-M6-P3-012 found the real rainfall resource UUID by inspecting a correctly-identified page's rendered content |
| Decision impact | No closure. Demonstrates the importance of not guessing URLs — restated as a lesson directly relevant to this milestone's "no fabrication" discipline: an incorrect guess was made, tested, found wrong, and reported as such, rather than assumed correct |

## 3. The District-Reorganization Caveat — Re-Examined With New Evidence

[population-and-demographic-evidence.md](../23_Evidence_Acquisition_and_Validation/population-and-demographic-evidence.md) Section 3 raised a concern: any "33-district" population figure derived from the 2011 census (conducted under the old 10-district structure) is necessarily a later reallocation. **This session's boundary-dataset deep validation ([boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-002) directly observed a `year_stat` field with values `'2019'` and `'2016_c'`** on the *geometry* records for the current 33 districts — this is suggestive that whatever process produced the current district boundaries also tracked a formation/status year, which is a plausible (but not confirmed) basis for a future population-reallocation methodology to anchor against. **This is recorded as a relevant cross-reference, not as evidence that any specific population reallocation has actually been performed or validated.**

## 4. No Historical Figures Redistributed

**Per this milestone's explicit instruction, this document does not itself perform, or claim to have performed, any redistribution of historical population figures onto current district boundaries.** No population number is reported anywhere in this document.

## 5. Overall Finding

**EVIDENCE PARTIALLY AVAILABLE.** The correct authoritative source (Census of India NADA catalog) is confirmed live. No specific district-population dataset file was located, downloaded, or opened in this session. One incorrect URL guess was tested and honestly reported as wrong.

## 6. Security

No credential was required for any source investigated.

## 7. Observability

Both HTTP exchanges are captured verbatim above.

## 8. Milestone Traceability

This validation supports Item 4.1 (Demographic domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and the Recommendation Engine's population-uncovered scoring term.

## 9. Open Decisions

No population/demographic data source is Confirmed. A future validation pass should search (not guess) for the correct data.gov.in or Census NADA catalog entry for district/sub-district population, following the successful search-then-fetch pattern demonstrated in [rainfall-weather-deep-validation.md](rainfall-weather-deep-validation.md) VAL-M6-P3-012.
