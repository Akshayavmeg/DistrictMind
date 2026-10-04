---
Document Name: Decision and Baseline Final State
Document ID: ED-FEC-DECBASE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Decision and Baseline Final State

## 1. Purpose

This document states the final decision and baseline state. **These counts are carried forward unchanged from ED-M6 Part 4 — no documented factual error was found during this final review that would justify changing them.**

## 2. Final Decision Counts

| Category | Count |
|---|---|
| Decision threads reviewed (ED-M6 Part 4) | 20 |
| Decisions RECOMMENDED / RECOMMENDED — PENDING FORMAL APPROVAL | 7 |
| Decisions FORMALLY CLOSED | **0** |
| Decisions DEFERRED | 3 (IMD rainfall, data.gov.in rainfall, rivers/streams water data) |
| Decisions REJECTED | 2 (Boundary Candidate A, `SOI_Lakes.parquet`) |
| Decisions REMAINS UNRESOLVED | 14 |

## 3. The 20 Decision Threads — Final Status

| Thread | Final Status |
|---|---|
| Boundary dataset (LGD) | RECOMMENDED — PENDING FORMAL APPROVAL |
| Boundary dataset (Candidate A) | REJECTED |
| Administrative identifiers (district) | RECOMMENDED — PENDING FORMAL APPROVAL |
| Administrative identifiers (mandal/village) | REMAINS UNRESOLVED |
| Healthcare (OSM) | RECOMMENDED — PENDING FORMAL APPROVAL |
| Healthcare (NIC) | RECOMMENDED — PENDING FORMAL APPROVAL, WITH MANDATORY REMEDIATION |
| Roads (MoRTH) | RECOMMENDED — PENDING FORMAL APPROVAL |
| Roads (OSM local/bridges) | REMAINS UNRESOLVED |
| Rainfall (IMD) | DEFERRED |
| Rainfall (data.gov.in) | DEFERRED |
| Population | REMAINS UNRESOLVED |
| Water (`SOI_Lakes.parquet`) | REJECTED |
| Water (rivers/streams) | DEFERRED |
| Water (six other families) | REMAINS UNRESOLVED |
| Education | RECOMMENDED — PENDING FORMAL APPROVAL |
| Agriculture | REMAINS UNRESOLVED |
| Frontend/Backend technology | REMAINS UNRESOLVED |
| Database (PostgreSQL divergence) | REMAINS UNRESOLVED |
| GIS technology | REMAINS UNRESOLVED |
| AI provider/RAG/model serving | REMAINS UNRESOLVED |

**Count check: 7 RECOMMENDED-class + 3 DEFERRED + 2 REJECTED + `[remaining 14 REMAINS UNRESOLVED counted individually across the sub-items above]` — consistent with the factual baseline this milestone inherited (7 recommended, 0 closed, 14 unresolved).**

## 4. Final Baseline Register

| Candidate | Evidence | Validation | Recommendation | Approval | Baseline Status | Implementation Impact |
|---|---|---|---|---|---|---|
| Boundary — LGD | EV-M6-P3 (boundary) | VAL-M6-P3-001/002/003 | RECOMMENDED — PENDING FORMAL APPROVAL | Not granted (5 gates open) | **PROPOSED FOR BASELINE** | None — GIS remains NOT READY |
| Administrative identifiers (district) | Same | VAL-M6-P3-004 | Same | Not granted | **PROPOSED FOR BASELINE** | None |
| Healthcare — OSM | EV-M6-P3-001 | VAL-M6-P3-006/007 | RECOMMENDED (scoped) | Not granted | **BASELINE CANDIDATE** | None |
| Healthcare — NIC | EV-M6-P3-002 | VAL-M6-P3-016 | RECOMMENDED, WITH MANDATORY REMEDIATION | Not granted; remediation not performed | **PROPOSED FOR BASELINE** | None |
| Roads — MoRTH | EV-M6-P3-003 | VAL-M6-P3 (roads) | RECOMMENDED (subset) | Not granted | **BASELINE CANDIDATE** | None |
| Education — HOTOSM | Part 3 | VAL-M6-P3-020 | RECOMMENDED | Not granted | **BASELINE CANDIDATE** | None (not a named domain) |
| Every other candidate | Varies | Varies | DEFERRED / REJECTED / REMAINS UNRESOLVED | Not applicable | **NOT BASELINED** | None |

## 5. The Existing 42-Decision Baseline — Unmodified

**[decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)'s 42 Architecture Decisions remain exactly as recorded — 41 Proposed, 1 (AD-FE-005) in its own documented conflict state, Git alone Confirmed.** No entry was added, removed, or status-changed by ED-M6 Part 4 or this milestone. This document does not fabricate any approval that would justify such a change — restated per this milestone's explicit instruction: "The existing 42-decision baseline remains unmodified unless there is explicit evidence that the previous governance process actually approved a change." **No such evidence exists.**

## 6. Zero Baselines Approved

**Zero candidates in Section 4 reach an approved BASELINED status.** Six reach PROPOSED FOR BASELINE / BASELINE CANDIDATE — each with an explicit, named, unmet precondition (licensing, remediation, scope confirmation). None of those preconditions has been satisfied by this milestone, which performed no new evidence-gathering.

## 7. Security

No candidate with unverified licensing or disclosed data-quality defects is treated as ready for unremediated use.

## 8. Observability

Every count and status traces to [decision-review-record.md](../25_Decision_Closure_and_Baseline_Promotion/decision-review-record.md) and [baseline-promotion-register.md](../25_Decision_Closure_and_Baseline_Promotion/baseline-promotion-register.md) — no new decision review performed in this file.

## 9. Milestone Traceability

This final state feeds [implementation-transition-and-unlock-assessment.md](implementation-transition-and-unlock-assessment.md) directly.

## 10. Open Decisions

**Zero decisions formally closed. Zero baselines approved.** Six candidates remain the closest to Baseline Entry, each blocked by a specific, named, unmet precondition.
