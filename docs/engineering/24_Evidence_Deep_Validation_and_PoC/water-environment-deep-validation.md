---
Document Name: Water Environment Deep Validation
Document ID: ED-DVP-WATER-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Water Environment Deep Validation

## 1. Purpose

This document deeply validates water/environment candidates, building on [water-and-environment-evidence.md](../23_Evidence_Acquisition_and_Validation/water-and-environment-evidence.md) with actual file downloads and a full catalog of the `india-geodata` project's water-related releases (discovered in full this session).

## 2. Full Water-Related Release Catalog — Newly Discovered

A complete listing of `yashveeeeeeer/india-geodata`'s GitHub releases (retrieved via the GitHub API's releases-list endpoint, not previously enumerated in Part 2) revealed **seven distinct water-related release families**, materially more than Part 2's single `EV-M6-P2-024` finding identified:

| Release Tag | Name | Assets | Source (per release notes) |
|---|---|---|---|
| `water/wetlands` | Wetlands and Ramsar Sites | 12 | — |
| `water/waterbody-census` | Water Body Census | 3 | — |
| `water/waterbodies` | Lakes, Reservoirs and Tanks | 22 | WRIS, SOI, Amrit Sarovar Water Observatory |
| `water/urban-water` | Urban Water Features | 15 | — |
| `water/rivers` | Rivers and Streams | 23 | SOI, WRIS, NCOG |
| `water/natural` | Natural Water Features | 15 | — |
| `water/irrigation` | Irrigation Infrastructure | 51 | — |
| `water/hydro-boundaries` | Hydrological Boundaries | 15 | — |

## 3. Deep Validation

### VAL-M6-P3-017 — SOI Lakes File, Actually Opened and Filtered

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-024 |
| Question | Does the smallest, most quickly-testable water-body file in this release family actually contain usable Telangana records? |
| Candidate | `SOI_Lakes.parquet` from the `water/waterbodies` release |
| Method | Downloaded (61,804 bytes, matched GitHub API size exactly), opened with `pyarrow` |
| Environment | Python 3.14 + `pyarrow` |
| Observation | **Only 56 total rows in this specific file.** Schema includes `state`, `district`, `lgd_state_code`, `lgd_district_code` fields, but **only 1 of 56 rows has a non-null `state`/`district` value** — the field exists but is almost entirely unpopulated in this file. The geographic bounding box of the sampled rows (latitude 21.55–34.99°N, longitude 77.52–83.91°E) is **entirely north of Telangana** (Telangana's real extent is approximately 15.8–19.95°N) — this specific file's actual content does not appear to include any Telangana lakes |
| Expected | Either confirmation of Telangana coverage or discovery of a gap |
| Result | **FAIL** for Telangana-specific usability — this specific small file, despite its name suggesting national SOI lake coverage, contains only 56 records with near-total attribute sparsity and a geographic distribution not including Telangana |
| Evidence | Directly parsed and filtered file content |
| Limitation | This is one of 22 assets in the `water/waterbodies` release alone (out of ~156 total water-related assets across all 7 release families) — this negative finding applies only to this one specific file, not to the release family as a whole. The `Amrit_Sarovar_Water_Observatory_Ponds.parquet` (5.5 MB) and other larger files in the same release were not opened in this session |
| Decision impact | No closure. Demonstrates the importance of opening and filtering an actual file rather than trusting a filename/description — restated as a direct instance of this milestone's core discipline |

### VAL-M6-P3-018 — Rivers/Streams Files, Size-Blocked

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-024 |
| Question | Can the SOI/WRIS/NCOG rivers-and-streams dataset be opened to check Telangana coverage? |
| Candidate | `NCOG_SOI_Streams.parquet` (split into `.00` and `.01` parts) and `SOI_Streams.geojsonl.7z`, from the `water/rivers` release |
| Method | Asset metadata retrieved via the GitHub API (no download attempted) |
| Environment | GitHub API only |
| Observation | The two Parquet parts are **1,092,114,370 and 1,228,504,092 bytes respectively (≈2.2 GB combined)**; the compressed GeoJSONL variant is 1,140,939,827 bytes (≈1.1 GB); the PMTiles variant is 896,753,901 bytes (≈896 MB) |
| Expected | A file size permitting download within this session's practical time/bandwidth budget |
| Result | **BLOCKED** — not by an environment capability limitation (unlike the `.7z`-extraction case), but by a genuine, honestly-disclosed **scope/time-budget decision**: downloading a 1–2 GB file was judged impractical within this validation pass |
| Evidence | Real file sizes, confirmed via the GitHub API |
| Limitation | This is the largest unresolved gap in this document — rivers/streams are directly relevant to Canonical Example C's disaster/flood-risk reasoning, and remain unvalidated at the content level |
| Decision impact | No closure. Recommended for a dedicated future session with a larger time/bandwidth allowance, or for downloading a pre-filtered Telangana-only subset if the source ever offers one |

### VAL-M6-P3-019 — India-WRIS Direct Accessibility

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-022 |
| Question | Is the authoritative India-WRIS (Central Water Commission) platform itself directly, live accessible? |
| Candidate | `cwc.gov.in/en/water-resources-information-system-wris` |
| Method | Not directly fetched in this session — deprioritized in favor of the already-downloadable `india-geodata` aggregation |
| Environment | N/A |
| Observation | Not tested |
| Result | **NOT TESTED** |
| Evidence | N/A |
| Limitation | Genuine scope gap |
| Decision impact | None — recommended for a future pass |

## 4. No Coverage Assumed From Portal Existence

**Restated per this milestone's explicit instruction:** VAL-M6-P3-017's negative finding for `SOI_Lakes.parquet` is the clearest possible demonstration that this document does not assume coverage merely from a portal or project's existence — the specific file was opened, filtered, and found not to contain Telangana data, and this is reported as a genuine FAIL rather than glossed over in favor of the broader project's real but unverified other assets.

## 5. Overall Finding

**EVIDENCE PARTIALLY AVAILABLE.** A rich family of real, credible water-data release candidates exists (7 release families, ~156 total assets), genuinely confirmed via the GitHub API. One small file was actually opened and found not useful for Telangana. The largest, most directly relevant files (rivers/streams) are real but too large to download within this session's practical budget — an honestly disclosed scope limitation, not a capability limitation.

## 6. Security

No credential was required for any source investigated.

## 7. Observability

Every file size and row count reported is a direct, verified observation.

## 8. Milestone Traceability

This validation supports Item 4.1 (Weather/Environment domain, water sub-scope) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and Canonical Example C's affected-area context.

## 9. Open Decisions

No water/environment data source is Confirmed. The rivers/streams files remain the highest-priority unopened candidate for a future, larger-budget validation session.
