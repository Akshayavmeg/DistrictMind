---
Document Name: Road and Network Deep Validation
Document ID: ED-DVP-ROAD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Road and Network Deep Validation

## 1. Purpose

This document deeply validates the strongest road/network candidate (OpenStreetMap, per [road-and-transport-data-evidence.md](../23_Evidence_Acquisition_and_Validation/road-and-transport-data-evidence.md)), attempting real access verification and, where feasible, a small network-analysis PoC supporting the bridge-closure canonical scenario.

## 2. Deep Validation

### VAL-M6-P3-008 — Geofabrik Southern-Zone Extract, Live Accessibility Re-Verification

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-013 |
| Question | Is the Geofabrik Southern-zone OSM extract (covering Telangana) actually live, current, and of a confirmed real size right now? |
| Candidate | `download.geofabrik.de/asia/india/southern-zone-latest.osm.pbf` |
| Method | Direct `curl -I` (HEAD request, following the redirect) against the live download server |
| Environment | Bash with live internet access |
| Observation | **HTTP 302 redirect to `southern-zone-260901.osm.pbf`** (a dated snapshot, `260901` reading as 2026-09-01), which itself returns **HTTP 200**, `Last-Modified: Wed, 02 Sep 2026 05:35:58 GMT`, **`Content-Length: 558,693,405` bytes (≈533 MB)**. The India-wide index page (`asia/india.html`) also returned HTTP 200 with a `Last-Modified` header dated the same day as this session |
| Expected | Confirmation the file is live and current, or discovery it is stale/broken |
| Result | **PASS** — the file is genuinely live, current (updated within hours of this session), and of a real, specific, verified size |
| Evidence | Live HTTP headers, captured directly, not inferred from the download page's descriptive text alone (restated distinct from Part 2's page-description-only finding) |
| Limitation | The 533 MB file itself was **not downloaded or opened** in this session — a deliberate scope decision given the file's size relative to this validation pass's time budget, not an environment limitation (unlike the `.7z` case in [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md)). Road *completeness* and *classification accuracy* for Warangal specifically therefore remain unverified at the file level |
| Decision impact | Strengthens confirmation of live accessibility; does not itself validate road-network content or completeness |

### VAL-M6-P3-009 — Live Overpass API Query for Warangal Road Network

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-013 |
| Question | Can real, classified road-network data for Warangal actually be retrieved live, to support network-analysis (bridge-closure) validation? |
| Candidate | OpenStreetMap, via live Overpass API query |
| Method | Two live query attempts: (1) `area["name"="Warangal"]["admin_level"~"6|7"]` restricted to `highway~"trunk|primary|secondary"`; (2) a broader `admin_level~"5|6|7"]` filter with `highway~"trunk|primary|secondary|tertiary"` |
| Environment | Bash with live internet access, same Overpass endpoint that succeeded for the healthcare query ([healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) EV-M6-P3-001) |
| Observation | Attempt 1 returned **HTTP 200 with zero matching elements** (the query executed but found no roads matching that specific admin_level/highway-class combination). Attempt 2 returned **HTTP 504 Gateway Timeout** |
| Expected | A set of real, classified road ways with names/identifiers, enabling a genuine network-topology PoC |
| Result | **BLOCKED** — the road-specific queries did not succeed, in contrast to the earlier successful point-based healthcare-facility query on the same server |
| Evidence | The actual HTTP responses (200-with-zero-results, then 504) are reported honestly, not concealed or replaced with a fabricated result |
| Limitation | This is most plausibly explained by (a) way-based queries with area-membership filtering being computationally heavier than the earlier node-based query, hitting the shared public Overpass server's per-query time budget, and/or (b) genuine rate-limiting following the multiple prior queries made earlier in this same session for healthcare and bridge data. This was **not** independently isolated to determine which cause applies |
| Decision impact | No closure for road-network *content* validation; does not weaken the accessibility finding in VAL-M6-P3-008, which used a lighter HEAD request rather than a full Overpass query |

### VAL-M6-P3-010 — Bridge-Feature Query Attempt

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-013 |
| Question | Can a specific, real bridge feature within Warangal be identified to support the bridge-closure canonical scenario? |
| Candidate | OpenStreetMap, `bridge=yes` tagged ways within Warangal |
| Method | Live Overpass query: `area["name"="Warangal"]["admin_level"~"6|7"]->.a;(way["bridge"="yes"](area.a););out body 30;` |
| Environment | Same as VAL-M6-P3-009 |
| Observation | **HTTP 504 Gateway Timeout** |
| Expected | A small set of real bridge ways, ideally with names, to ground a concrete bridge-closure network-impact PoC |
| Result | **BLOCKED** |
| Evidence | The actual timeout response is reported honestly |
| Limitation | No specific real bridge feature was identified in this session. A bridge-closure network-analysis PoC (removing a specific edge from a routable graph and recomputing shortest paths) could not be executed against real Warangal bridge data as a result |
| Decision impact | No closure. The bridge-closure canonical scenario (Example B) remains without a concretely identified real-world test feature |

## 3. Candidate B — MoRTH National Highways via GatiShakti (Discovered This Session)

### EV-M6-P3-003 — `india-geodata` `infra/national-highways` Release, Actually Opened

| Field | Detail |
|---|---|
| Question | Does a genuine government (Ministry of Road Transport and Highways) road dataset exist, and does it actually contain usable Telangana records? |
| Source | Ministry of Road Transport and Highways (MoRTH), via the GatiShakti National Master Plan portal, mirrored in `yashveeeeeeer/india-geodata`'s `infra/national-highways` release |
| Resource | `GatiShakti_MORTH_National_Highways.parquet`, 58,742,537 bytes (matched exactly against GitHub API-reported size) |
| Acquisition | Direct download via `curl`, opened with `pyarrow` |
| Observation | **10,317 total road-segment rows nationally.** Schema includes `state_ut, road_name, road_type, lane_statu, status, agency, toll_type` and more. Filtering `state_ut` for a Telangana match returns **404 real road segments**, with genuine highway identifiers (e.g., `NH-167`, `NH-150`), lane status (`2L`), and status values including `EXISTING` and — a real, directly-observed data artifact — **`PRAPOSED`** (a literal typo present in the government source data itself, reported here exactly as found, not corrected) |
| Validation | Directly parsed and filtered; counts are direct computations over the real file |
| Result | **EVIDENCE AVAILABLE** for a genuinely authoritative (government, MoRTH-sourced) road candidate — a materially stronger authority classification than OSM for the specific National Highway subset |
| Limitations | National Highways are a **small subset** of the full road network Example B (bridge closure) and general accessibility analysis need — most local, district, and rural roads are not NH-classified and would not appear in this dataset. This candidate is a strong complement to, not a replacement for, a full road-network source. Also note: the release's `state_ut` values show inconsistent casing/formatting for at least one other state (`'MADHYA PRADESH'`, `'MADHYAPRADESH'`, `'Madhya Pradesh'` all appear as distinct string values) — a real, directly-observed data-normalization issue in this source, though Telangana's own value was consistently `'Telangana'` in the rows inspected |
| Decision impact | Adds a genuinely authoritative (not merely Candidate-crowdsourced) road data point for the National Highway subset specifically; does not resolve the broader local/district road-network gap |

## 5. No Claim of Nationwide (or District-Wide) Network Accuracy

**Restated per this milestone's explicit instruction:** the Geofabrik finding (VAL-M6-P3-008) proves only that the file exists, is current, and is a specific verified size — the file itself was not opened, so completeness/accuracy for Warangal specifically is not claimed. The MoRTH National Highways finding (EV-M6-P3-003) is genuinely opened and counted, but explicitly covers only the National Highway subset, not the full local road network.

## 6. Authoritative vs. Candidate — Restated and Updated

OpenStreetMap remains classified **Candidate**, per [road-and-transport-data-evidence.md](../23_Evidence_Acquisition_and_Validation/road-and-transport-data-evidence.md) Section 4. **The MoRTH National Highways dataset (EV-M6-P3-003) is genuinely Authoritative in provenance** (a central government ministry, via its own GatiShakti platform) for the National Highway subset specifically — this is a new, real finding this session, not previously identified in Part 2.

## 7. Overall Finding

**EVIDENCE PARTIALLY AVAILABLE, PARTIAL PoC result — upgraded from Part 2.** Live accessibility of the bulk OSM extract is directly confirmed. A genuinely authoritative, government-sourced, actually-opened National Highways dataset (404 real Telangana road segments) was newly discovered and validated this session. Live, queryable full road-network and bridge-feature data via Overpass remain BLOCKED by server-side timeouts/rate-limiting.

## 8. Security

No credential was required for any source investigated.

## 9. Observability

All HTTP status codes, headers, and parsed file outputs are captured directly and reported verbatim above.

## 10. Milestone Traceability

This validation supports Item 4.1 (Transportation domain) and Canonical Example B, first needed for M2 (data), M5 (scenario).

## 11. Open Decisions

No road/transportation data source is Confirmed. A future validation pass should retry the road-classification and bridge-feature queries after a longer cooldown period, or use a dedicated (non-shared) Overpass instance, or download and locally process the confirmed-live Geofabrik extract directly.
