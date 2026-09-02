---
Document Name: Water and Environment Evidence
Document ID: ED-EAV-WATER-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Water and Environment Evidence

## 1. Purpose

This document investigates real sources for rivers, lakes, reservoirs, water bodies, and environmental/soil indicators relevant to Telangana. Real web research was performed (access date 2026-09-02).

## 2. Evidence Records

### EV-M6-P2-022 — India-WRIS (Water Resources Information System), Central Water Commission

| Field | Detail |
|---|---|
| Question | Does India's central water-resources authority provide authoritative, structured water-body and river-network data? |
| Source | Central Water Commission, Ministry of Jal Shakti, Government of India |
| Resource | `https://cwc.gov.in/en/water-resources-information-system-wris` |
| Acquisition | WebSearch only; not directly fetched |
| Observation | Search results describe India-WRIS as maintaining layers for "Basin, Sub Basin, Watershed, River, water-body, urban and rural population extents, Dams, Barrage/weir/anicut, canals and command boundaries," with CWC hydrological-observation-station data and CGWB groundwater data available for free download |
| Validation | Search-result-level only |
| Result | Confirms a genuine, authoritative, structured national water-data platform exists with the layer types DistrictMind's Water/Environment domain would need |
| Limitations | Not directly fetched; actual download mechanism, format, and Telangana-specific granularity not verified in this session |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — a strong authoritative candidate warranting direct follow-up verification |

### EV-M6-P2-023 — data.gov.in "Shapefile of Rivers"

| Field | Detail |
|---|---|
| Question | Is a directly downloadable river-network shapefile catalogued on the central open-data platform? |
| Source | Catalogued on the Open Government Data (OGD) Platform India |
| Resource | `https://www.data.gov.in/resource/shapefile-rivers` |
| Acquisition | WebSearch only; not directly fetched (consistent with the 403 pattern observed for other data.gov.in resource pages in this session, e.g., [healthcare-dataset-evidence.md](healthcare-dataset-evidence.md) EV-M6-P2-009) |
| Observation | The catalog listing's existence is confirmed via search-engine indexing |
| Validation | Search-result-level only |
| Result | A named, plausible candidate; direct accessibility unconfirmed |
| Limitations | Given this session's repeated finding that data.gov.in resource-level pages return 403 to automated fetches, this candidate's real accessibility is uncertain without a different access method |
| **Status** | **EVIDENCE NOT AVAILABLE** (not directly verified) |
| Decision impact | None yet |

### EV-M6-P2-024 — India Geodata Project — Water Body Layers

| Field | Detail |
|---|---|
| Question | Does the same aggregation project already identified for administrative boundaries ([telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) EV-M6-P2-004) also provide water-body data? |
| Source | Independent open-data aggregator (Yashveer Singh), same project as EV-M6-P2-004 |
| Resource | `https://github.com/yashveeeeeeer/india-geodata/releases` — GitHub Releases confirmed to include **"Wetlands and Ramsar Sites," "Water Body Census," "Lakes, Reservoirs and Tanks," "Urban Water Features," "Rivers and Streams,"** and **"Natural Water Features"** |
| Acquisition | WebFetch of the project's Releases listing page |
| Observation | These release names were **directly observed** in the fetched Releases page — this is a directly confirmed, not merely search-inferred, finding |
| Validation | Direct page fetch confirming release names exist; individual release contents (file formats, Telangana-specific coverage, feature counts) not opened |
| Result | Confirms this same aggregation project is a plausible one-stop source for multiple DistrictMind Water/Environment sub-domains (rivers, lakes, reservoirs, wetlands), consistent with its LGD/SOI/Bhuvan/DataMeet sourcing already noted for administrative boundaries |
| Limitations | As with EV-M6-P2-004, actual Telangana-specific content, format details, and geometry validity were not verified — no file was downloaded or opened |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — reinforces India Geodata as a broadly useful aggregation candidate across multiple domains, pending the same future download-and-inspect PoC already recommended in [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) |

### EV-M6-P2-025 — Bhuvan Cartosat DEM / Water Body Shapefiles

| Field | Detail |
|---|---|
| Question | Does ISRO's Bhuvan platform separately offer water-body shapefiles derived from satellite elevation data? |
| Source | ISRO National Remote Sensing Centre |
| Resource | Referenced generically via search results ("Bhuvan portal offers Cartosat DEM data that includes water body shapefiles") |
| Acquisition | WebSearch only; not directly fetched |
| Observation | A general capability claim, not a specific verified URL or file |
| Validation | Search-result-level only |
| Result | Consistent with Bhuvan's broader authoritative role already noted in [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) EV-M6-P2-005, but not independently confirmed here |
| Limitations | No specific resource located |
| **Status** | **EVIDENCE NOT AVAILABLE** |
| Decision impact | None |

## 3. Environmental/Soil Data — Not Investigated in This Pass

**No dedicated soil or broader environmental-indicator source (beyond water bodies) was investigated in this research session.** This is recorded honestly as a gap, per this milestone's "document actual evidence only" instruction, rather than filled with an inferred or assumed source.

## 4. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE.** Two credible candidate families exist — the authoritative India-WRIS/CWC platform (unverified beyond its stated existence) and the same India Geodata aggregation project already found for administrative boundaries and rainfall-adjacent data, now directly confirmed (via live page fetch) to also host multiple water-body dataset releases. No file was downloaded or opened for any candidate.

## 5. Security

No credential was required for any source investigated.

## 6. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 7. Milestone Traceability

This evidence supports Item 4.1 (Weather/Environment domain, water-body sub-scope) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and informs Canonical Example C's affected-area/environmental context.

## 8. Open Decisions

No water/environment data source is confirmed or selected. India-WRIS (EV-M6-P2-022) and India Geodata's water-body releases (EV-M6-P2-024) both warrant future direct verification.
