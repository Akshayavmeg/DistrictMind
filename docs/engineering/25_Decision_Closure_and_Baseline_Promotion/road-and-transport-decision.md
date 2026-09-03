---
Document Name: Road and Transport Decision
Document ID: ED-DCB-ROAD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Road and Transport Decision

## 1. Purpose

This document assesses EV-M6-P3-003 (MoRTH National Highways) against DistrictMind's road/transportation requirements, using [road-and-network-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/road-and-network-deep-validation.md)'s real findings. **This document does not claim nationwide or complete local road/network coverage.**

## 2. What MoRTH Can Support

| Capability | Supported? | Evidence |
|---|---|---|
| National Highway segment identity, naming, lane status | **Yes** | 404 real Telangana records with `road_name` (e.g., NH-167, NH-150), `lane_statu`, `status` fields, directly parsed from `GatiShakti_MORTH_National_Highways.parquet` |
| Government-authoritative provenance for the National Highway subset specifically | **Yes** | MoRTH/GatiShakti National Master Plan — a genuine Indian government infrastructure-planning source |
| Local/district road network (non-National-Highway roads) | **No** | MoRTH's release is scoped to National Highways only; no local road network file was successfully retrieved this session |
| Bridge-specific features | **No** | Not present in the MoRTH National Highways schema as parsed; Overpass bridge-feature queries were separately attempted and BLOCKED (VAL-M6-P3-010) |
| Network-graph connectivity (for shortest-path/routing computation) | **No** | The parsed schema is a segment-attribute table, not a verified topologically-connected graph; no routing/network-analysis PoC was executed |

## 3. What MoRTH Cannot Support

**MoRTH's validated evidence supports only the National Highway subset of Telangana's road network.** It cannot, on its own, support:
- Local accessibility analysis for areas served only by state/district/village roads (the majority of any district's actual road network by length)
- Bridge-closure impact analysis (Canonical Example B), since no bridge-specific feature data was retrieved
- Any network-graph/routing computation, since connectivity was never verified

## 4. Is MoRTH a Working Authoritative Subset?

**Yes, but explicitly scoped.** For the narrow question "which National Highway segments exist in Telangana, and what is their status/classification," MoRTH is a genuine, government-provenanced, PASS-level candidate. For any broader road-network or accessibility question, it is insufficient alone.

## 5. Does OSM Remain a Candidate?

**Yes.** OSM's road-classification and bridge-feature Overpass queries were rate-limited/timed out this session (VAL-M6-P3-009, VAL-M6-P3-010, both BLOCKED) — this is an execution limitation, not a finding that OSM's road data is unsuitable. The Geofabrik southern-zone extract (558,693,405 bytes) was re-verified as live and current (VAL-M6-P3-008, PASS for accessibility/currency) but not downloaded/opened this session. OSM therefore remains a genuine, unresolved Candidate for the local-network gap MoRTH does not cover.

## 6. Bridge Closure / Network Analysis — Remains Unresolved

**Canonical Example B (bridge-closure impact on healthcare accessibility) cannot be supported by any evidence gathered in this program to date.** No bridge-specific feature data and no verified network-graph connectivity exist. This remains fully unresolved, unchanged by this milestone.

## 7. Decision Evidence Record — MoRTH National Highways

| Field | Detail |
|---|---|
| Candidate | `GatiShakti_MORTH_National_Highways.parquet`, MoRTH/GatiShakti via `yashveeeeeeer/india-geodata` |
| PoC evidence | 404 real Telangana segments, real highway names/lane/status fields, one honestly-reported government-data typo (`PRAPOSED`) preserved verbatim rather than corrected |
| Result | PASS (for the National Highway subset specifically) |
| Limitations | Subset only (Section 3); no bridge data; no verified network connectivity; licensing not verified |
| Recommendation | Selected as a working, government-authoritative candidate for the narrow National Highway subset; local road network and bridge data acquisition remain the concrete next steps |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL** (subset-scoped only) |
| Decision ID | None |

## 8. Decision Evidence Record — OSM Road/Bridge Data

| Field | Detail |
|---|---|
| Candidate | OSM/Overpass road-classification and bridge-feature queries; Geofabrik southern-zone `.osm.pbf` extract |
| PoC evidence | Live-accessibility/currency re-verified (VAL-M6-P3-008); actual classification/bridge queries BLOCKED by rate limiting (VAL-M6-P3-009/010) |
| Result | Inconclusive — neither PASS nor FAIL, genuinely BLOCKED by execution constraints this session |
| Recommendation | Retry with a longer cooldown or a dedicated (non-shared) Overpass instance, or download the confirmed-live Geofabrik extract directly in a future, larger-time-budget session |
| Status | **REMAINS UNDER EVALUATION** |
| Decision ID | None |

## 9. Security

No credential was required for either source.

## 10. Observability

Every figure in this document traces to [road-and-network-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/road-and-network-deep-validation.md) — no new computation performed here.

## 11. Milestone Traceability

Road/transportation data first needed M2; bridge-closure network analysis is Canonical Example B, spanning M2–M6.

## 12. Open Decisions

**No road/transportation data source is Confirmed or Selected.** MoRTH is RECOMMENDED — PENDING FORMAL APPROVAL for the National Highway subset only. OSM REMAINS UNDER EVALUATION for the local-network and bridge gap. Bridge-closure/network analysis REMAINS UNRESOLVED.
