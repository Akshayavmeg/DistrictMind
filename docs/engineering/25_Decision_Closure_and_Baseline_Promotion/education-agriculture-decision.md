---
Document Name: Education Agriculture Decision
Document ID: ED-DCB-EDUAGRI-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Education Agriculture Decision

## 1. Purpose

This document assesses education and agriculture evidence from [education-agriculture-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/education-agriculture-deep-validation.md). **Education has real, executed spatial-join evidence. Agriculture does not — no dataset is invented to fill that gap.**

## 2. Education — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidate | HOTOSM/HDX education facilities (`hotosm_ind_education_facilities_points_geojson.geojson`), via `yashveeeeeeer/india-geodata` |
| Evidence ID | Discovered via the full release catalog listing, [healthcare-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/healthcare-data-deep-validation.md) VAL-M6-P3-016 |
| Validation ID | VAL-M6-P3-020 |
| PoC evidence | 19,502 real national points; a genuine point-in-polygon spatial join against the already-validated Warangal boundary polygon ([boundary-dataset-decision.md](boundary-dataset-decision.md)) correctly identified 44 real points inside the district — real cross-domain reuse of validated geometry, not a synthetic demonstration |
| Result | **PASS** |
| Limitations | No administrative/type taxonomy beyond `amenity=school`; crowdsourced (Candidate-tier) provenance; the point-in-polygon algorithm itself was not independently cross-validated against a reference GIS tool |
| Recommendation | Selected as a working candidate for education-domain point data, and — more significantly — as concrete proof that DistrictMind's "join by geometry, not by attribute" pattern is executable against real, independent data |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL** |
| Decision ID | None — education is not a named DistrictMind domain in the core requirements, so no `AD-*`/blocker closure applies regardless of this result |

## 3. Agriculture — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidate | None found |
| Evidence ID | EV-M6-P2-028, EV-M6-P2-029 (Telangana Open Data Portal, ADeX) — both remain unverified from Part 2 |
| Validation ID | VAL-M6-P3-021 — a full 30-release catalog search of `yashveeeeeeer/india-geodata` found no release tagged "agri," "crop," or "farm" |
| PoC evidence | None — no dataset exists to test |
| Result | **FAIL** (for this specific aggregator; not a statement about agriculture data's existence generally) |
| Recommendation | Direct verification of the Telangana Open Data Portal's own agriculture collection and ADeX, neither attempted this session |
| Status | **REMAINS UNRESOLVED** |
| Decision ID | None |

## 4. No Agriculture Dataset Invented

**Restated directly per this milestone's explicit instruction: no agriculture dataset is invented to close this gap.** Water/irrigation infrastructure data (real, catalog-confirmed per [water-environment-decision.md](water-environment-decision.md)) is agriculture-*adjacent* but is not treated here as a substitute for actual crop/yield/farm data.

## 5. Education May Progress Farther Than Agriculture — Explicitly Stated

Per this milestone's own instruction: education, with real PASS-level spatial-join evidence, is recommended for further Decision Review. Agriculture, with zero dataset evidence, remains unresolved and is not artificially advanced to match education's status.

## 6. Security

No credential was required for either domain's investigation.

## 7. Observability

Every finding traces to [education-agriculture-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/education-agriculture-deep-validation.md) — no new computation performed here.

## 8. Milestone Traceability

Education is supplementary evidence, not a named domain. Agriculture supports [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md) Item 4.1 (M2) and the Crop prediction domain (M4).

## 9. Open Decisions

**No education or agriculture data source is Confirmed or Selected.** Education is RECOMMENDED — PENDING FORMAL APPROVAL. Agriculture REMAINS UNRESOLVED, with direct verification of the Telangana portal/ADeX as the concrete next step.
