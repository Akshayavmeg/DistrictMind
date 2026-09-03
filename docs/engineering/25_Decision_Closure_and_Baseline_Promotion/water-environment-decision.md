---
Document Name: Water Environment Decision
Document ID: ED-DCB-WATER-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Water Environment Decision

## 1. Purpose

This document assesses the water/environment evidence from [water-environment-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/water-environment-deep-validation.md), where a rich family of real candidates exists, but only one small file was actually opened — and it failed the Telangana-coverage test.

## 2. Explicit Distinction — Validated Files vs. Files Not Opened

| State | Files | Basis |
|---|---|---|
| Actually opened and validated | `SOI_Lakes.parquet` only | VAL-M6-P3-017 |
| Real, catalog-confirmed but never opened | The other ~155 assets across 7 release families (`water/wetlands`, `water/waterbody-census`, remaining `water/waterbodies` assets, `water/urban-water`, `water/rivers`, `water/natural`, `water/irrigation`, `water/hydro-boundaries`) | GitHub Releases API metadata only |
| Size-blocked, real but unopened (not a capability limitation) | `NCOG_SOI_Streams.00/.01.parquet`, `.geojsonl.7z`, `.pmtiles` (rivers/streams, ~0.9–2.2GB each) | VAL-M6-P3-018 |
| Deprioritized, not attempted | India-WRIS direct platform access | VAL-M6-P3-019 — NOT TESTED |

## 3. Why One File's Result Does Not Generalize

**`SOI_Lakes.parquet`'s FAIL (56 total rows, only 1 with non-null state/district, bounding box entirely north of Telangana) is a finding about that one specific 61,804-byte file — not about the `water/waterbodies` release family (22 assets total), nor about the other 6 water-related release families.** Per this milestone's explicit instruction, this document does not generalize one successful or failed file to the entire source family. The larger `Amrit_Sarovar_Water_Observatory_Ponds.parquet` (5.5MB, same release) and every rivers/streams asset remain completely untested.

## 4. Decision Evidence Record — `SOI_Lakes.parquet`

| Field | Detail |
|---|---|
| Candidate | `SOI_Lakes.parquet`, `water/waterbodies` release |
| PoC evidence | Downloaded and parsed, byte-exact; 56 rows, near-total attribute sparsity, geography entirely outside Telangana |
| Result | **FAIL** for Telangana usability |
| Recommendation | Reject this specific file for Telangana water-body coverage; do not reject the release family or aggregator on this basis alone |
| Status | **Rejected** (this specific file only) |
| Decision ID | None |

## 5. Decision Evidence Record — Rivers/Streams (`water/rivers`)

| Field | Detail |
|---|---|
| Candidate | `NCOG_SOI_Streams` (SOI/WRIS/NCOG-sourced) |
| PoC evidence | Real file sizes confirmed via GitHub API (≈0.9–2.2GB depending on format); no content opened |
| Result | Inconclusive — genuinely BLOCKED by a disclosed time/bandwidth-budget decision, not a capability or quality finding |
| Recommendation | A dedicated future session with a larger download budget, or a pre-filtered Telangana-only subset if the source ever offers one |
| Status | **REMAINS UNDER EVALUATION** |
| Decision ID | None |

## 6. Decision Evidence Record — Remaining Six Release Families

| Field | Detail |
|---|---|
| Candidate | `water/wetlands`, `water/waterbody-census`, `water/urban-water`, `water/natural`, `water/irrigation`, `water/hydro-boundaries` |
| PoC evidence | None — catalog metadata only |
| Result | Not evaluated |
| Recommendation | Prioritize opening at least one representative file per family in a future evidence pass |
| Status | **REMAINS UNRESOLVED** |
| Decision ID | None |

## 7. Overall Water/Environment Domain Status

**EVIDENCE PARTIALLY AVAILABLE, no candidate reaches RECOMMENDED status.** This is a materially weaker evidentiary state than boundary, healthcare, or roads — this document does not inflate it. The domain's real strength (a rich, government/aggregator-sourced candidate pool, genuinely confirmed to exist) is distinct from actual content validation, which remains almost entirely undone.

## 8. Security

No credential was required for any source investigated.

## 9. Observability

Every finding traces to [water-environment-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/water-environment-deep-validation.md) — no new computation performed here.

## 10. Milestone Traceability

Water/environment data first needed M2, and feeds Canonical Example C's affected-area context.

## 11. Open Decisions

**No water/environment data source is Confirmed, Selected, or RECOMMENDED.** `SOI_Lakes.parquet` is specifically Rejected for Telangana use. Rivers/streams REMAINS UNDER EVALUATION (size-blocked). All other release families REMAIN UNRESOLVED (unopened).
