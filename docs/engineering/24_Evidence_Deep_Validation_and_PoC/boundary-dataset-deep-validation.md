---
Document Name: Boundary Dataset Deep Validation
Document ID: ED-DVP-BOUNDARY-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Boundary Dataset Deep Validation

## 1. Purpose

This is DistrictMind's most important validation. It deeply, actually inspects the boundary-dataset candidates identified in [telangana-boundary-dataset-evidence.md](../23_Evidence_Acquisition_and_Validation/telangana-boundary-dataset-evidence.md), by genuinely downloading and parsing real files — not inferring from webpage descriptions. **This is the strongest, most significant finding of this entire milestone.**

## 2. Candidate A — `gggodhwani/telangana_boundaries` (EV-M6-P2-003) — Actually Opened

### VAL-M6-P3-001

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-003 |
| Question | Does this repository's `districts.json` actually contain Telangana's current 33 districts? |
| Candidate | `gggodhwani/telangana_boundaries`, file `districts.json` |
| Method | Downloaded the raw file directly (`curl` to `raw.githubusercontent.com`, confirmed HTTP 200, Content-Length 3,952,559 bytes matching the downloaded file size exactly), parsed with Python's standard `json` module |
| Environment | Bash tool with confirmed live internet access; Python 3.14 stdlib only |
| Observation | **The file contains exactly 10 features, not 33.** Every feature is a `Polygon` with a `D_N` (district name) and `D_C` (district code, values `'01'`–`'10'`) property. The 10 names are: **ADILABAD, KARIMNAGAR, NIZAMABAD, KHAMMAM, WARANGAL, MEDAK, NALGONDA, RANGAREDDY, HYDERABAD, MAHABUBNAGAR** — this is precisely the set of Telangana's **original 10 districts**, as they existed before the October 2016 reorganization. A `crs` field is present and correctly declares `urn:ogc:def:crs:OGC:1.3:CRS84` (WGS84 lon/lat). Every ring in every feature is closed (first coordinate equals last coordinate) — checked for all 10 features. Total coordinate points across the file: 90,213. The computed bounding box (lon 77.2369–81.3161, lat 15.8373–19.9170) is plausible for Telangana's real extent |
| Expected | Either confirmation or disconfirmation of the 10-vs-33 district count inferred in Part 2 from the commit date alone |
| Result | **FAIL** — for DistrictMind's requirement of the current 33-district structure. This directly, conclusively confirms (not merely infers) the suspicion raised in [telangana-boundary-dataset-evidence.md](../23_Evidence_Acquisition_and_Validation/telangana-boundary-dataset-evidence.md) EV-M6-P2-003: this dataset reflects the pre-2016-reorganization structure |
| Evidence | The actual downloaded and parsed file content — feature count, names, and codes were directly counted and read, not estimated |
| Limitation | Basic geometry validity (ring closure, bbox plausibility, CRS declaration) is genuinely good for what it is — this is a real limitation of *scope* (wrong district count for the current structure), not of data quality for the era it represents |
| Decision impact | **Does not support closure of the boundary-dataset blocker.** Formally disqualified as DistrictMind's primary boundary dataset candidate given the hard 33-district requirement, though it could theoretically serve a historical/comparative use case if one ever arose |

## 3. Candidate B — India Geodata `admin/districts` Release (EV-M6-P2-004) — Actually Opened

### VAL-M6-P3-002 — LGD-Sourced Variant

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-004 |
| Question | Does the LGD-sourced file in this release actually contain all 33 current Telangana districts with valid geometry and usable identifiers? |
| Candidate | `yashveeeeeeer/india-geodata`, release `admin/districts`, asset `LGD_Districts.parquet` |
| Method | Retrieved the release's actual asset list via the GitHub REST API (`api.github.com/repos/.../releases/tags/admin%2Fdistricts`) — confirming 9 real assets with real filenames and byte sizes, not inferred from the webpage. Downloaded `LGD_Districts.parquet` (22,178,335 bytes, verified to match the GitHub API's reported size exactly). Verified the file's magic bytes (`PAR1`) confirm it is a genuine Apache Parquet file. Installed `pyarrow` (a standard, read-only Parquet-reading library) in this session to actually open the file. Parsed its schema, row count, and content. Implemented a manual WKB (Well-Known Binary) geometry parser in Python (no `shapely` available) to inspect the `geometry` column, which is stored as WKB binary per the file's own embedded GeoParquet `geo` metadata |
| Environment | Bash tool with live internet access; Python 3.14 + `pyarrow` (installed this session, inspection-only, not an application dependency) |
| Observation | **Schema:** `OBJECTID, dtname, stname, stcode11, dtcode11, year_stat, dist_lgd, state_lgd, remarks, Dist, InPoly_FID, SimPgnFlag, MaxSimpTol, MinSimpTol, SHAPE_Length, SHAPE_Area, geometry` — 785 total rows (all-India). **Filtering `stname == 'TELANGANA'` returns exactly 33 rows.** All 33 `dtname` values are unique (no duplicates); all 33 `dist_lgd` values are unique and non-null (values observed range from 501–721); `state_lgd` is consistently `36` for every Telangana row. The 33 names include the newer, post-reorganization districts by name (e.g., Hanumakonda, Jayashankar Bhupalapally, Jogulamba Gadwal, Kumuram Bheem Asifabad, Mahabubabad, Medchal Malkajgiri, Mulugu, Nagarkurnool, Narayanpet, Peddapalli, Rajanna Sircilla, Sangareddy, Siddipet, Suryapet, Vikarabad, Wanaparthy, Yadadri Bhuvanagiri, Jangoan, Bhadradri Kothagudem, Jagitial, Kamareddy, Mancherial, Nirmal), confirming this is the **current** 33-district structure, not the old 10. `year_stat` shows two values (`'2019'`, `'2016_c'`), consistent with the real reorganization timeline. **Every one of the 33 geometries parsed as a WKB `Polygon` (type code 3) with a single ring, every ring closed (first point equals last point), with point counts ranging from 624 (Hyderabad, the smallest/most urban district) to 6,076 (Sangareddy).** The GeoParquet `geo` metadata declares geometry types `["Polygon", "MultiPolygon"]` and a plausible all-India bbox `[68.18, 6.75, 97.41, 37.09]`; no explicit CRS is declared in the metadata, which per the GeoParquet 2.0 specification defaults to OGC:CRS84 (WGS84) when unspecified. The Telangana-specific bounding box computed directly from the actual geometry (lon 77.2358–81.3226, lat 15.8360–19.9168) is nearly identical to Candidate A's independently-computed bbox — a strong cross-consistency signal between two unrelated sources |
| Expected | Either confirmation of 33 districts with usable identifiers/geometry, or disconfirmation |
| Result | **PASS** — for the specific, narrow claim: this file contains 33 uniquely-named, uniquely-LGD-coded, single-Polygon, ring-closed Telangana district records with a plausible real-world bounding box |
| Evidence | Directly parsed file content: row counts, unique-value checks, and a from-scratch WKB parse were all executed and their outputs recorded verbatim in this session |
| Limitation | (a) Full OGC geometric validity (self-intersection, ring winding order) was **not** checked — this would require `shapely`/GEOS, not installed this session (per [deep-validation-strategy.md](deep-validation-strategy.md) Section 4). (b) CRS is inferred from the GeoParquet 2.0 default, not an explicit declared value in this specific file's metadata — a reasonable but not airtight inference. (c) The `.geojsonl.7z` and `.pmtiles` sibling assets in the same release were **not** opened (no `.7z` extraction tool available) — only the `.parquet` variant was validated. (d) Licensing terms for this specific release were not re-verified beyond the project-wide "CC0-1.0 / CC-BY-4.0" claim already noted in Part 2 |
| Decision impact | **Strongly supports progression toward decision closure** — this is the strongest boundary-dataset evidence found across this entire program. It does **not** itself close the blocker (per Section 10 below), since full OGC validity and licensing terms remain unverified, and no independent Decision Review has occurred |

### VAL-M6-P3-003 — SOI-Sourced Variant (Cross-Validation)

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-004 |
| Question | Does a second, independently-sourced file in the same release (Survey of India-derived, rather than LGD-derived) corroborate the 33-district finding? |
| Candidate | Same release, asset `SOI_Districts.parquet` |
| Method | Downloaded (28,691,382 bytes, matches GitHub API-reported size), opened with `pyarrow`, filtered on the `STATE_C` column |
| Environment | Same as VAL-M6-P3-002 |
| Observation | **`STATE_C == 'TELANGANA'` also returns exactly 33 rows** — independent corroboration from a differently-sourced file within the same project. However, this variant's district names show a **genuine, materially different naming convention**: it lists `'WARANGAL (RURAL)'` and `'WARANGAL (URBAN)'` as two separate districts, where the LGD variant (VAL-M6-P3-002) lists `'Warangal'` and `'Hanumakonda'` — these are **not the same pairing**, reflecting the real-world 2021 renaming of Warangal Urban to Hanumakonda. This SOI variant's `District_C` field, on inspection, contains what appear to be normalized *name-derived* strings (e.g., `'NARAYANPET'`, `'WANAPARTHY'`) rather than an independent numeric identifier — a materially weaker identifier candidate than the LGD variant's numeric `dist_lgd` field |
| Expected | Corroboration or contradiction of the 33-district count |
| Result | **PARTIAL** — the district *count* (33) is corroborated, but this variant's naming and identifier scheme diverges from the LGD variant in a specific, real, documented way |
| Evidence | Directly parsed file content |
| Limitation | Geometry validity for this specific variant was not separately re-parsed via WKB (time-scoped to the LGD variant, the stronger identifier candidate) |
| Decision impact | Does not itself change the recommendation (LGD variant remains the stronger candidate per identifier quality), but is recorded as a **genuine, real-world example of the exact cross-source fragmentation** DistrictMind's own architecture ([data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md)) is designed to handle — see Section 4 below |

## 4. A Real-World Fragmentation Example — Directly Observed, Not Hypothetical

**This is a significant, unplanned finding.** DistrictMind's fragmentation-resolution architecture ([data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md)) has, until this session, only ever been described in the abstract — "DistrictMind cannot guarantee that all external data is complete or perfectly accurate" (Section 11 of that document). **This session directly observed a genuine instance of exactly this problem**: two source variants within the *same* aggregation project disagree on whether "Warangal Urban" and "Hanumakonda" are the same district under different names or two genuinely distinct entities, and disagree on identifier scheme (numeric LGD code vs. name-derived string). This is recorded here as real corroborating evidence that the fragmentation-resolution architecture addresses a genuine, not merely theoretical, problem — restated and elaborated further in [data-provenance-and-fragmentation-validation.md](data-provenance-and-fragmentation-validation.md).

## 5. Answering the 15 Required Questions — With Directly-Verified Answers

| # | Question | Answer (Candidate B / LGD variant) |
|---|---|---|
| 1 | Can it actually be accessed? | **Yes** — downloaded directly via HTTPS, byte-size verified against the GitHub API's own metadata |
| 2 | Can the actual file/resource be opened? | **Yes** — opened with `pyarrow`, a standard Parquet reader |
| 3 | Is it machine-readable? | **Yes** — Apache Parquet, a standard columnar binary format |
| 4 | What is the actual format? | Apache Parquet (GeoParquet convention: WKB-encoded geometry column) |
| 5 | How many district features are actually present? | **33**, directly counted after filtering `stname == 'TELANGANA'` |
| 6 | Are all Telangana districts represented? | The 33 names match the known current Telangana district list, including post-2016/2019/2021 districts (Hanumakonda, Mulugu, etc.) — **yes, by name-based inspection** |
| 7 | Are district names actually present? | **Yes** — `dtname` field, directly read |
| 8 | Are stable identifiers present? | **Yes** — `dist_lgd` field, numeric, unique, non-null for all 33 rows |
| 9 | Are geometries actually polygon/multipolygon? | **Yes** — WKB type code 3 (Polygon) confirmed for every one of the 33 rows via manual parsing |
| 10 | Are geometries valid? | **Partially confirmed** — ring closure verified for all 33 (necessary condition); full OGC validity (self-intersection) not checked (no GEOS/shapely available) |
| 11 | Is CRS/projection information available? | **Inferred, not explicit** — the GeoParquet 2.0 spec default (OGC:CRS84) applies since no `crs` key is present in this file's `geo` metadata |
| 12 | Is the geometry appropriate for web rendering? | Not directly tested (would require an actual rendering PoC, out of scope for a data-format validation); point counts (624–6,076 per district) are plausible for direct or lightly-simplified web use, and `SimPgnFlag`/`MaxSimpTol`/`MinSimpTol` fields suggest the source pipeline already considered simplification |
| 13 | Does it contain obsolete district structures? | **No** — confirmed by the presence of post-reorganization district names |
| 14 | Does it reflect the current 33-district structure? | **Yes**, by count and by name |
| 15 | Can it support `/districts/:id`? | **Plausibly yes** — `dist_lgd` is a genuine, unique, numeric, stable-looking identifier per district; whether it should be used directly as the route parameter, or a DistrictMind-internal identifier should be minted and mapped to it, remains a future implementation decision, not resolved here |

## 6. Deep Validation Blocked Items — Explicitly Stated

Per this milestone's explicit instruction: **"Deep validation blocked by resource accessibility/environment limitation"** applies to:
- The `.geojsonl.7z` and `.pmtiles` sibling assets of the `admin/districts` release (no `.7z` extraction capability)
- Full OGC geometric validity (self-intersection, winding order) for any candidate (no GEOS/shapely)
- `bhuvan_districts.parquet` (the third source variant in the same release) — not opened in this session, purely due to time/scope prioritization, not a capability limitation

## 7. No Feature Count Inferred From a Webpage

**Restated per this milestone's explicit, emphatic instruction:** every feature count, name, and identifier reported in this document was read directly from an actually-downloaded, actually-parsed file — never inferred from a webpage's descriptive text. Where a claim (e.g., Candidate A's district count) could only be checked by opening the file, it was opened; the result (10, not 33) directly overturned what a webpage-level description might have implied.

## 8. No GeoJSON or Shapefile Manufactured

No geometry, coordinate, or feature was invented anywhere in this document. Every coordinate figure (bounding boxes, point counts) is a direct computation over actually-downloaded file content.

## 9. `/districts/:id` — Preserved as Canonical

Restated unchanged: this validation does not alter the canonical route decision (AD-RES-001). Section 5, Question 15 assesses *compatibility* only.

## 10. The Boundary Blocker Is NOT Cleared

**Despite the strength of this finding, the 33-district boundary-dataset blocker is explicitly NOT marked cleared by this document.** Per [decision-closure-workflow.md](../22_Evidence_Acquisition_and_Decision_Closure/decision-closure-workflow.md), a PASS-level PoC result is one input to a Decision Recommendation — it still requires: independent Decision Review (by a role distinct from whoever ran this validation), explicit licensing verification, full OGC validity checking (currently blocked by environment limitation), and formal Decision/Baseline/Readiness-Reassessment steps before the blocker in [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Row 3 could honestly be marked cleared. This is recorded explicitly in [implementation-unlock-reassessment.md](implementation-unlock-reassessment.md) of this same milestone.

## 11. Security

No credential was required to download any file in this section; the GitHub API calls made were unauthenticated, public requests.

## 12. Observability

Every download's byte size was cross-checked against the source's own reported metadata (GitHub API `size` field) before being trusted as complete.

## 13. Milestone Traceability

This validation directly targets the CRITICAL boundary-dataset blocker, first needed for M1.

## 14. Open Decisions

**No boundary dataset is Confirmed.** The LGD-sourced `LGD_Districts.parquet` from `yashveeeeeeer/india-geodata` is recommended, with high confidence, as the priority candidate for formal Decision Review — but the Decision itself has not been made.
