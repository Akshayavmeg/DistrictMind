---
Document Name: Road and Transport Data Evidence
Document ID: ED-EAV-ROAD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Road and Transport Data Evidence

## 1. Purpose

This document investigates real road/transportation data sources for Telangana, evaluating suitability for road visualization, routing/network analysis, bridge-closure scenarios, and accessibility analysis (Canonical Example B). Real web research was performed (access date 2026-09-02).

## 2. Evidence Records

### EV-M6-P2-013 — OpenStreetMap via Geofabrik (India / Southern Zone Extract)

| Field | Detail |
|---|---|
| Question | Is a current, downloadable, machine-readable road network available for Telangana? |
| Source | OpenStreetMap (crowdsourced global mapping project), redistributed via Geofabrik GmbH's public download server |
| Resource | `https://download.geofabrik.de/asia/india.html` |
| Acquisition | WebFetch of the India regional download page |
| Observation | The page confirms **six India sub-regional extracts** (Central, Eastern, North-Eastern, Northern, Southern, Western zones) — Telangana falls within the Southern zone. The primary format is **`.osm.pbf`**, with `.gpkg.zip` also available for sub-regions; a note explicitly states `india-latest-free.shp.zip is not available for this region; try one of the sub-regions` (i.e., Shapefile export requires using the sub-regional, not whole-India, extract). The main India file was **"last modified 6 hours ago"** at the time of the fetch, with the most recent snapshot dated `india-260901.osm.pbf` — **containing all OSM data up to 2026-09-01**, 1.6 GB in size |
| Validation | Direct fetch of the live download page, confirming real, current, actively-updated file listings |
| Result | This is the strongest, most directly verifiable evidence found in this entire milestone: a real, functioning, frequently-updated (daily-or-better) public download server with confirmed regional coverage including Telangana (Southern zone), in standard GIS formats |
| Limitations | OSM is a **crowdsourced** dataset — road completeness, attribute accuracy (road class, connectivity), and currency vary by how actively a given area has been mapped by volunteers. This was not independently spot-checked for Warangal-district completeness in this session. OSM is explicitly **not a government-authoritative source** — restated per this milestone's own instruction not to claim OSM is authoritative for government decision-making merely because it is detailed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** — real, current, accessible, standard-format data confirmed to exist and be downloadable; completeness/accuracy for the specific Warangal pilot area is unverified, and authoritativeness is explicitly limited |
| Decision impact | Partial — a strong candidate for the render/visualization and general network-topology use case; **not** a substitute for an authoritative government source if DistrictMind's accessibility-analysis outputs need to carry official standing |

### EV-M6-P2-014 — Telangana Department of Roads and Buildings (Open Data Portal)

| Field | Detail |
|---|---|
| Question | Does the Telangana government publish its own authoritative road-network data? |
| Source | Government of Telangana, Department of Roads and Buildings |
| Resource | `https://data.telangana.gov.in/department/department-roads-and-buildings` |
| Acquisition | WebSearch only; page not directly fetched in this pass |
| Observation | Search results confirm this department page exists within the Telangana Open Data Portal and is described as providing "district-level infrastructure and transportation data" |
| Validation | Search-result-level only — not directly fetched, so actual file availability, format, and whether it includes network/routable geometry (versus e.g., budget/project tables) is unconfirmed |
| Result | A plausible authoritative candidate exists in principle, consistent with the portal's real, confirmed existence (per [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) EV-M6-P2-001's confirmation that the portal root loads) |
| Limitations | Given EV-M6-P2-001's finding that a specifically-cited page on this same portal returned 404, this candidate's actual working-link status is not assumed and requires direct verification in a future pass |
| **Status** | **EVIDENCE NOT AVAILABLE** (not yet directly verified — page not fetched) |
| Decision impact | None yet — flagged for follow-up |

### EV-M6-P2-015 — GTFS Transit Data (South Central Railway / MMTS via Telangana Open Data Portal)

| Field | Detail |
|---|---|
| Question | Is any transit-network data (as opposed to road-network data) available for the Telangana region? |
| Source | South Central Railway, via the Telangana Open Data Portal |
| Resource | GTFS (General Transit Feed Specification) data "of South Central Railway with stops, stop times, and trips information of MMTS," per the portal's own department listing (found during EV-M6-P2 infrastructure research, [infrastructure-and-disaster-evidence.md](infrastructure-and-disaster-evidence.md)) |
| Acquisition | WebSearch only |
| Observation | GTFS is a genuine, standard, machine-readable transit-data format; its presence indicates the Telangana portal does publish some real structured transportation data | 
| Validation | Search-result-level only |
| Result | Confirms the portal is not merely aspirational — at least one real structured transportation dataset (MMTS commuter rail) exists there |
| Limitations | GTFS covers rail transit, not the road network needed for Examples A–C's road-based accessibility analysis |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** (real but not applicable to the road-network requirement) |
| Decision impact | None for road network specifically |

## 3. Evaluation Against DistrictMind's Requirements

| Requirement | Finding |
|---|---|
| Road visualization | OSM/Geofabrik (EV-M6-P2-013) provides real, current, standard-format road geometry suitable for rendering, pending a completeness spot-check |
| Routing/network analysis | OSM data generically supports this use case (it is widely used for routing engines globally), but Warangal-specific connectivity/topology quality is unverified |
| Bridge closure scenarios | Depends on the road network containing a specific, identifiable bridge/segment feature — not verified for any specific Warangal bridge in this session |
| Accessibility analysis | Depends on network connectivity quality, unverified for the pilot area |

## 4. Authoritative vs. Candidate — Explicit Classification

**Restated per this milestone's own explicit instruction:** OpenStreetMap (EV-M6-P2-013) is classified here as a **Candidate** source — real, detailed, and actively maintained, but crowdsourced and not government-authoritative. It is not claimed authoritative for government decision-making purposes merely because it is detailed. The Telangana Roads and Buildings department listing (EV-M6-P2-014) would be the **Authoritative** candidate if verified, but its actual accessibility was not confirmed in this session.

## 5. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE.** A real, current, technically strong Candidate source (OSM via Geofabrik) is confirmed accessible for the road-network requirement, with the caveat that it is not government-authoritative and its Warangal-specific completeness is unverified. The authoritative government alternative (Telangana Roads and Buildings) was identified but not yet directly verified.

## 6. Security

No credential was required for any source investigated.

## 7. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 8. Milestone Traceability

This evidence supports Item 4.1 (Transportation domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and directly informs Canonical Example B.

## 9. Open Decisions

No road/transportation data source is confirmed or selected. EV-M6-P2-014 (Telangana Roads and Buildings) requires direct follow-up verification.
