---
Document Name: Administrative Data Decision
Document ID: ED-DCB-ADMIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Administrative Data Decision

## 1. Purpose

This document carries [administrative-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/administrative-data-deep-validation.md)'s results through decision recommendation, distinguishing **district-level administrative identifiers** (this file) from **boundary geometry** ([boundary-dataset-decision.md](boundary-dataset-decision.md)), per this program's established discipline of not conflating identifier data with geometry data.

## 2. District-Level Identifiers

| Field | Detail |
|---|---|
| Candidate | `dist_lgd` / `dtname` / `state_lgd` fields, `LGD_Districts.parquet` (same file as [boundary-dataset-decision.md](boundary-dataset-decision.md) Candidate B) |
| Evidence ID | Same source download as VAL-M6-P3-002 |
| Validation ID | VAL-M6-P3-004 |
| PoC evidence | 33 unique non-null `dist_lgd` values (range 501–721); 33 unique non-null `dtname` values; `state_lgd` constant at 36 across all rows |
| Result | **PASS** |
| Recommendation | Same recommendation as [boundary-dataset-decision.md](boundary-dataset-decision.md) Section 5 — proceed to Decision Review, since this identifier data is drawn from the identical file and shares its unmet gates (licensing, direct-primary-source provenance verification) |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL** (matching the boundary decision; these two are not independently decidable given they originate from the same file and the same unresolved licensing/provenance gates) |
| Decision ID | None — no new `AD-*` drafted |
| Affected milestones | M1–M2 |

## 3. Mandal/Village-Level Identifiers

| Field | Detail |
|---|---|
| Candidate | None evaluated — mandal/village-level LGD data was never opened this session |
| Evidence ID | None |
| Validation ID | VAL-M6-P3-005 — explicitly recorded NOT TESTED (a scope gap, not a capability limitation) |
| Result | **NOT TESTED** |
| Recommendation | Acquire and open the mandal/village-level LGD file in a future evidence-acquisition pass before any decision can be made |
| Status | **REMAINS UNRESOLVED** |
| Decision ID | None |
| Affected milestones | M2 |

## 4. Real Cross-Source Naming Divergence — Not Resolved Here

Restated from [data-provenance-and-fragmentation-validation.md](../24_Evidence_Deep_Validation_and_PoC/data-provenance-and-fragmentation-validation.md) VAL-M6-P3-022: the LGD variant's `'Warangal'`/`'Hanumakonda'` split diverges from the SOI variant's `'WARANGAL (RURAL)'`/`'WARANGAL (URBAN)'` naming. **This document does not adjudicate which naming convention is correct** — per [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 5, a precedence rule requires a documented rationale and Data Steward sign-off neither of which has occurred. This divergence is one of two real instances feeding [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 25 (Source-Precedence Calibration) — see Section 18 of [decision-review-record.md](decision-review-record.md).

## 5. Relationship to `/districts/:id`

The `dist_lgd` identifier is the strongest available candidate for the stable identifier AD-RES-001's canonical route resolves against (restated from [boundary-dataset-decision.md](boundary-dataset-decision.md) Section 4, §15). **This document does not modify AD-RES-001** — it only notes that, should Candidate B eventually reach Baseline, `dist_lgd` is the identifier a future routing implementation should use.

## 6. Security

No credential was required. Licensing status is identical to, and inherited from, [boundary-dataset-decision.md](boundary-dataset-decision.md) Section 6 — unverified.

## 7. Observability

Every finding traces to [administrative-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/administrative-data-deep-validation.md) VAL-M6-P3-004/005 — no new computation performed here.

## 8. Milestone Traceability

District-level identifiers: M1–M2. Mandal/village-level identifiers: M2.

## 9. Open Decisions

**No administrative identifier source is Confirmed or Selected.** District-level identifiers are RECOMMENDED — PENDING FORMAL APPROVAL, sharing the boundary dataset's unmet licensing/provenance gates. Mandal/village-level identifiers REMAIN UNRESOLVED, with acquisition of the actual data as the concrete next step.
