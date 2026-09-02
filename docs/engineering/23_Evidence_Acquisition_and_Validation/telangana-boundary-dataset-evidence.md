---
Document Name: Telangana Boundary Dataset Evidence
Document ID: ED-EAV-BOUNDARY-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Telangana Boundary Dataset Evidence

## 1. Purpose

This is DistrictMind's first hard gate: does a real, machine-readable, authoritative dataset exist that can support a Telangana overview with all 33 districts, selectable polygons, and `/districts/:id` routing? Real web research was performed (access date **2026-09-02**). **No GeoJSON, shapefile, or dataset content is fabricated anywhere in this document.**

## 2. Candidates Investigated

### EV-M6-P2-001 — Telangana Open Data Portal ("District and Mandal Shape Files")

| Field | Detail |
|---|---|
| Question | Does the official Telangana government open-data portal host a downloadable district/mandal boundary shapefile? |
| Source | Government of Telangana, IT/Electronics & Communications Department (Open Data Telangana initiative) |
| Resource | `data.telangana.gov.in` — a story/page titled "Telangana District, Mandal and Revenue Shape Files," referenced by a Telangana government Facebook post ("New 33 District and Mandal Shapefiles... can be accessed from here") |
| Acquisition | WebFetch of `https://data.telangana.gov.in/story/telangana-district-mandal-and-revenue-shape-files` |
| Observation | **The page returned HTTP 404 Not Found.** The portal's root (`https://data.telangana.gov.in`) does load and title-confirms as "Telangana Open Data Portal," but the specific story/page referenced by search results and social media posts about the 33-district shapefile is broken or has been moved/removed. |
| Validation | Direct fetch attempt; confirmed 404 |
| Result | The specific claimed shapefile page is currently inaccessible at the URL found via search |
| Limitations | This does not prove no shapefile exists on the portal — only that this specific, most-cited URL is broken as of the access date. A different navigation path within `data.telangana.gov.in` (e.g., via department/category browsing) was not exhaustively explored |
| **Status** | **EVIDENCE NOT AVAILABLE** (at the specific URL found; portal itself exists but the referenced resource does not resolve) |
| Decision impact | No closure — a broken official link is not usable evidence of an accessible dataset |

### EV-M6-P2-002 — AIKosh (India AI Knowledge Sharing Hub) Telangana Geospatial Shapefiles Listing

| Field | Detail |
|---|---|
| Question | Does India's national AI/data-sharing hub host a working copy of the Telangana district/mandal shapefile? |
| Source | AIKosh (indiaai.gov.in), described in search results as hosting the dataset "under the Open Government Data License" |
| Resource | `https://aikosh.indiaai.gov.in/home/datasets/details/telangana_district_and_mandal_geospatial_shapefiles.html` |
| Acquisition | WebFetch of the above URL |
| Observation | **The page displayed "Oops... The requested resource is unavailable."** — an error state, not dataset content |
| Validation | Direct fetch attempt |
| Result | The listing exists in search-engine indexing but the live page does not currently serve the dataset or its metadata |
| Limitations | Cannot confirm district count, format, or license from a broken page |
| **Status** | **EVIDENCE NOT AVAILABLE** |
| Decision impact | No closure |

### EV-M6-P2-003 — GitHub `gggodhwani/telangana_boundaries`

| Field | Detail |
|---|---|
| Question | Does this community-published GeoJSON repository provide a usable, current Telangana district boundary set? |
| Source | Individual GitHub contributor (gggodhwani), data described as "extracted from Tank Information System hosted by Govt. of Telangana" |
| Resource | `https://github.com/gggodhwani/telangana_boundaries` — contains `districts.json` (GeoJSON, 3.77 MB), `blocks.json`, `village_boundaries.json.xz` (>100 MB uncompressed), MIT license |
| Acquisition | WebFetch of the repository root, the `districts.json` file page, and the commit history |
| Observation | The repository's most recent commit is dated **21 April 2016**. The file is too large for GitHub's inline preview (confirmed: "Sorry about that, but we can't show files that are this big right now"), so its actual feature count and attribute schema could not be inspected |
| Validation | Repository/commit metadata inspection only; file contents not opened (binary-file inspection is beyond this environment's capability, per [evidence-acquisition-execution.md](evidence-acquisition-execution.md) Section 4) |
| Result | **This dataset predates Telangana's district reorganizations.** Telangana was reorganized from 10 to 31 districts in October 2016 and from 31 to 33 districts in 2019/2021. A file last committed in April 2016 — several months *before* the October 2016 reorganization — almost certainly reflects the old, pre-reorganization district structure (10 districts), not the current 33-district structure DistrictMind requires. This is a material, disqualifying finding, not a minor caveat |
| Limitations | This conclusion is inferred from the commit date relative to publicly known reorganization dates, not from having opened the file itself and counted features. The inference is treated as strong (not certain) evidence |
| **Status** | **EVIDENCE NOT AVAILABLE** (source is real and accessible, but the underlying data is very likely stale relative to the current 33-district structure) |
| Decision impact | No closure — actively counter-indicates suitability |

### EV-M6-P2-004 — India Geodata Project (`yashveeeeeeer/india-geodata`)

| Field | Detail |
|---|---|
| Question | Does this actively-maintained open-data aggregation project provide a current, usable district boundary dataset covering Telangana? |
| Source | Independent open-data aggregator (Yashveer Singh), compiling from **LGD** (Local Government Directory, Ministry of Panchayati Raj), **Survey of India**, **Bhuvan** (ISRO), and **DataMeet** |
| Resource | `https://yashveeeeeeer.github.io/india-geodata/` (project site) and `https://github.com/yashveeeeeeer/india-geodata`, specifically the GitHub Release tagged `admin/districts` |
| Acquisition | WebFetch of the project homepage, the About page, the GitHub Releases listing, and the specific `admin/districts` release page |
| Observation | The `admin/districts` release exists, dated (per the release page) **8 March** (year not fully disclosed by the page, but the repository is actively maintained — a separate release, "Flood Inventory," was also found current). The release description states: *"Data files for District boundaries from LGD, SOI, Bhuvan. Download all: `gh release download admin/districts`."* The release page reported **11 attached assets**, but a page-loading error prevented the individual filenames, formats, and sizes from being read. The project homepage separately states formats include **Parquet, PMTiles, GeoJSONL (.7z), and Shapefile**, licensed **CC0-1.0 / CC-BY-4.0** |
| Validation | Page/release metadata inspection only; no file was downloaded or opened; Telangana-specific feature count, identifier scheme, and geometry validity were **not** verified |
| Result | This is the single most credible candidate found: real, named, government-sourced provenance (LGD/SOI/Bhuvan), an active maintenance cadence, an open license, and multiple GIS-standard formats. It is plausible this dataset reflects the current 33-district structure, since LGD is itself the authoritative, continuously-updated administrative registry — but this remains unconfirmed |
| Limitations | Cannot confirm: (a) exact Telangana district count in the actual file, (b) whether "LGD" as a source means the file was regenerated after Telangana's district count reached 33, (c) exact identifier field name/scheme, (d) geometry validity, (e) precise CRS. None of these can be checked without downloading and opening the actual Parquet/GeoJSON/Shapefile asset, which this environment cannot do |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** — a credible, well-sourced, actively-maintained candidate exists and is worth pursuing further, but full validation (Section 2 of [boundary-dataset-validation-plan.md](../18_Evidence_and_PoC_Resolution/boundary-dataset-validation-plan.md)) has not occurred |
| Decision impact | **Partial closure at most** — this candidate should be prioritized for an actual download-and-inspect PoC in a future milestone with file-handling capability; it does not itself close the blocker |

### EV-M6-P2-005 — Bhuvan (ISRO) State Viewer for Telangana

| Field | Detail |
|---|---|
| Question | Does ISRO's official geoportal provide a downloadable Telangana district boundary layer? |
| Source | ISRO National Remote Sensing Centre (NRSC), a genuinely authoritative central-government geospatial agency |
| Resource | `https://bhuvan-app1.nrsc.gov.in/state/TS` |
| Acquisition | WebFetch of the state-viewer page |
| Observation | The page is an **interactive map viewer** (pan/zoom/layer-toggle/measurement/draw tools), not a data-download interface. Telangana is a selectable state, and various thematic layers (crop, land cover, landslides, infrastructure) are referenced, but no explicit "download district boundary" function was found on this specific page. The page carries a "version 1.0 data... ongoing improvements" disclaimer |
| Validation | Page-content inspection only |
| Result | Confirms ISRO/Bhuvan is a genuine, authoritative geospatial data holder for Telangana, but this specific viewer page does not itself constitute a validated downloadable district-boundary dataset |
| Limitations | Bhuvan may offer boundary downloads through a different sub-portal (e.g., a dedicated Bhuvan Download/Data Hub section) not reached in this research pass |
| **Status** | **EVIDENCE NOT AVAILABLE** (at this specific page; the organization is authoritative, but no usable download was located here) |
| Decision impact | No closure; flags Bhuvan's broader data-download portals as worth a future, separate investigation |

## 3. Answering the Required Evaluation Questions

| Question | Answer |
|---|---|
| Does it contain all 33 districts? | **Not confirmed for any candidate.** EV-004 (India Geodata) is plausible but unverified; EV-003 (gggodhwani) is very likely stale (pre-33-district, likely only 10) |
| Are they polygon geometries? | Plausible for EV-004 (GeoJSON/Shapefile formats stated) and confirmed-format for EV-003, but neither was opened to verify geometry type |
| Is it machine-readable? | EV-003 and EV-004 are stated to be in machine-readable formats (GeoJSON, Shapefile, Parquet); EV-001, EV-002, EV-005 do not currently yield an accessible machine-readable file |
| Is it downloadable or accessible programmatically? | EV-004 offers a documented `gh release download` CLI path — the most concretely accessible option found. EV-003 is downloadable from GitHub directly. EV-001, EV-002, EV-005 are not currently accessible |
| Does it have stable identifiers? | Not verified for any candidate — would require opening the file's attribute table |
| Can those identifiers support `/districts/:id`? | Cannot be determined without Section above's identifier verification |
| Is the geometry suitable for web map rendering? | Not verified — would require opening the file and inspecting complexity/simplification |
| Is the coordinate reference system known? | Not verified for any candidate from page-level metadata alone |
| Is the dataset current enough? | **EV-003 is very likely NOT current** (pre-dates reorganization). EV-004's currency is plausible given LGD sourcing but unconfirmed |
| Is the source authoritative or merely a reference map/image? | EV-001, EV-002, EV-005 point to authoritative *organizations* (Telangana Government, ISRO) but the specific pages/resources found are either broken or non-downloadable. EV-003 and EV-004 are *aggregator*-published, sourcing from authoritative upstream registries (LGD, SOI, Bhuvan) but are not themselves government-published artifacts |

## 4. The Explicit Warning From This Milestone's Brief — Applied

**"The existence of an official Telangana 33-district map image is NOT automatically proof of a machine-readable boundary dataset."** This research directly encountered exactly this failure mode twice: the Telangana government's own social-media announcement of "New 33 District and Mandal Shapefiles" (EV-001) leads to a 404 page, and a government-dataset listing on a national AI platform (EV-002) leads to an "unavailable resource" error. **A public announcement or catalog listing is not evidence of a working dataset — this was verified directly, not merely assumed.**

## 5. Overall Finding for This Hard Gate

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE.**

No fully validated, machine-readable, current, 33-district-confirmed dataset was found. The best candidate (EV-M6-P2-004, India Geodata's `admin/districts` release) is real, credibly sourced, and actively maintained, but its actual Telangana-specific content (feature count, identifiers, geometry validity, currency) remains unverified pending a future PoC that can actually download and open the file. **This document does not fabricate a GeoJSON or shapefile, and does not claim the 33-district requirement is satisfied.**

## 6. Security

No credential or authentication was required or used for any resource investigated; all sources accessed were publicly available pages.

## 7. Observability

Every finding above is dated (access date 2026-09-02) and attributed to a specific fetched URL, consistent with [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 8. Milestone Traceability

This evidence directly targets [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md)'s CRITICAL boundary-dataset blocker and Row 3 of [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md), first needed for M1.

## 9. Open Decisions

**The 33-district boundary dataset remains unresolved.** EV-M6-P2-004 is recommended as the priority candidate for a future download-and-inspect PoC. No dataset is selected, confirmed, or fabricated by this document.
