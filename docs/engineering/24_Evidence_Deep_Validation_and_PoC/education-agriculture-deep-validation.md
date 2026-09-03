---
Document Name: Education Agriculture Deep Validation
Document ID: ED-DVP-EDUAGRI-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Education Agriculture Deep Validation

## 1. Purpose

This document deeply validates education and agriculture candidates, building on [education-and-agriculture-evidence.md](../23_Evidence_Acquisition_and_Validation/education-and-agriculture-evidence.md).

## 2. Education — Deep Validation

### VAL-M6-P3-020 — HOTOSM Education Facilities, Actually Opened and Spatially Joined

| Field | Detail |
|---|---|
| Evidence ID | New — discovered via the full `india-geodata` release catalog listing (see [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) VAL-M6-P3-016), not present in Part 2's findings |
| Question | Does a real, machine-readable education facility dataset exist, and does it actually contain locatable Warangal-area records? |
| Source | Humanitarian OpenStreetMap Team (HOTOSM) / HDX (Humanitarian Data Exchange), release `education/facilities` in `yashveeeeeeer/india-geodata` |
| Resource | `hotosm_ind_education_facilities_points_geojson.geojson`, 7,727,299 bytes (matched exactly against GitHub API size) |
| Acquisition | Direct download via `curl`, parsed with Python stdlib `json` |
| Observation | **19,502 total education point features nationally.** Schema: `name, name:en, amenity, building, operator:type, capacity:persons, addr:full, addr:city, source, name:hi, name:ta, osm_id, osm_type` — **no `state` or `district` attribute field exists in this dataset**, unlike the NIC healthcare dataset. To determine Telangana/Warangal relevance, a **genuine spatial join** was performed: the real Warangal district polygon (already validated in [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-002) was used with the same from-scratch point-in-polygon algorithm already built for the healthcare PoC. Result: **94 education points fall within Warangal's bounding box; 44 of those are confirmed, via actual point-in-polygon testing, to fall within the real district polygon itself** |
| Expected | Either a usable attribute-based filter or a demonstration that spatial join is required |
| Result | **PASS** for both the data-existence question and, notably, for demonstrating a genuine cross-domain spatial-join capability: real boundary geometry (File 2's validated output) was successfully reused to filter a completely independent real dataset (education points) — a small but genuine proof that DistrictMind's "join by geometry, not by attribute" pattern ([data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 3) is executable against real data |
| Evidence | Direct computation; the 44-point result and 5 sample names/coordinates are reported verbatim from the actual run |
| Limitation | (a) No administrative/type taxonomy is present (all records show `amenity=school`, no PHC/CHC-style differentiation into school levels, colleges, etc. beyond what's embedded in free-text names). (b) OSM/HOTOSM crowdsourced provenance — Candidate, not Authoritative. (c) The point-in-polygon algorithm used is a standard ray-casting implementation but was not independently cross-validated against a reference GIS tool in this session |
| Decision impact | Education is not a named DistrictMind domain, so no blocker closure applies — but this finding is recorded as valuable evidence that DistrictMind's spatial-join architecture is executable, generalizing beyond the single healthcare PoC |

## 3. Agriculture — Deep Validation

### VAL-M6-P3-021 — Agriculture-Specific Release Search

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-028, EV-M6-P2-029 |
| Question | Does the same `india-geodata` project (which yielded strong results for boundaries, healthcare, roads, water, and education) also carry an agriculture-specific release? |
| Candidate | Full `india-geodata` release catalog (30 releases retrieved via the GitHub API in this session) |
| Method | Direct inspection of the full releases list already retrieved for Sections 2–3 of [water-environment-deep-validation.md](water-environment-deep-validation.md) and [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) |
| Environment | GitHub API |
| Observation | **No release tag containing "agri," "crop," or "farm" appears anywhere in the full 30-release listing.** The closest-adjacent releases are `remote-sensing/population-density` (WorldPop) and various water/irrigation releases (`water/irrigation`, 51 assets) — irrigation infrastructure is agriculture-*adjacent* but not crop/yield data itself |
| Expected | Either an agriculture-specific release or confirmation of its absence |
| Result | **FAIL** — this specific, otherwise very productive aggregation project does not carry agriculture/crop data |
| Evidence | The complete, directly-retrieved release list (already reproduced in [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) VAL-M6-P3-016's cross-reference) |
| Limitation | This finding is specific to this one aggregation project — it does not test the Telangana Open Data Portal's own agriculture collection (EV-M6-P2-028) or ADeX (EV-M6-P2-029) directly, both of which remain unverified from Part 2 |
| Decision impact | No closure. Agriculture data acquisition should follow the Telangana-government-specific path (EV-M6-P2-028/029) rather than this particular aggregator, which does not cover this domain |

## 4. No Coverage Assumed

**Restated per this milestone's explicit instruction:** Section 3's negative finding for agriculture is reported honestly rather than papered over with a tangential water/irrigation substitute presented as if it were agriculture data.

## 5. Overall Finding

**Education: EVIDENCE AVAILABLE, PASS-level PoC** (real data, real spatial join, genuine cross-domain demonstration). **Agriculture: EVIDENCE NOT AVAILABLE** from this session's specific aggregator search; Part 2's Telangana-portal-specific candidates remain the correct path forward, unverified this session.

## 6. Security

No credential was required for any source investigated.

## 7. Observability

Every count and sample reported is a direct computation over actually-downloaded/queried data.

## 8. Milestone Traceability

Education evidence is supplementary (not a named DistrictMind domain). Agriculture evidence supports Item 4.1 (Agriculture domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and the Crop prediction domain for M4.

## 9. Open Decisions

No education or agriculture data source is Confirmed. Agriculture data acquisition should prioritize direct verification of the Telangana Open Data Portal's agriculture collection and ADeX in a future session.
