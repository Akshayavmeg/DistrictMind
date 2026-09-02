---
Document Name: Healthcare Dataset Evidence
Document ID: ED-EAV-HEALTH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Healthcare Dataset Evidence

## 1. Purpose

This document investigates actual healthcare facility datasets for Warangal/Telangana, directly targeting the canonical DistrictMind example: **"Which areas are outside the 10 km healthcare coverage?"** Real web research was performed (access date 2026-09-02). **No facility name, location, or field is fabricated.**

## 2. Evidence Records

### EV-M6-P2-009 — Hospital Directory (National Health Portal), via data.gov.in

| Field | Detail |
|---|---|
| Question | Does India's central Open Government Data platform provide a downloadable, geolocated hospital directory covering Telangana? |
| Source | National Health Portal / Ministry of Health and Family Welfare, catalogued on the Open Government Data (OGD) Platform India |
| Resource | `https://www.data.gov.in/catalog/hospital-directory-national-health-portal` |
| Acquisition | WebFetch of the catalog page |
| Observation | **The fetch returned HTTP 403 Forbidden.** The page could not be accessed to confirm fields, coverage, or format |
| Validation | Direct fetch attempt, blocked |
| Result | Existence of the catalog listing is confirmed via search-engine indexing, but its actual content, fields, and download mechanism could not be verified in this session |
| Limitations | A 403 may reflect a bot-blocking measure rather than the dataset's absence — a human using a browser, or an authenticated/registered API client, might succeed where this automated fetch did not |
| **Status** | **EVIDENCE NOT AVAILABLE** (inaccessible in this session) |
| Decision impact | No closure |

### EV-M6-P2-010 — National Health Resource Repository (NHRR) / Health Facility Registry (HFR)

| Field | Detail |
|---|---|
| Question | Does India's national healthcare-establishment census provide facility-level data (name, type, location, coordinates) usable for coverage analysis? |
| Source | National Health Authority (Ayushman Bharat Digital Mission) and Central Bureau of Health Intelligence, Ministry of Health and Family Welfare |
| Resource | `https://facility.abdm.gov.in/nhrr`, cross-referenced with a Bhuvan-NHRR geo-visualization portal |
| Acquisition | WebSearch only; pages not directly fetched in this pass |
| Observation | NHRR is described as "the first-ever nationwide healthcare establishment census," intending to capture over 20 lakh (2 million) healthcare establishments across "over 1400 variables," including location. A "BHUVAN–NHRR" geo-web portal is described as providing "data visualization and analysis" of the census data, built by ISRO |
| Validation | Search-result-level only |
| Result | NHRR is confirmed to be the correct authoritative *category* of source (a genuine facility census with a geospatial visualization layer), but whether its underlying facility-level records are available as a bulk, machine-readable, publicly downloadable dataset (versus only a restricted registry feeding the Ayushman Bharat digital health ecosystem) was **not confirmed** |
| Limitations | NHRR/HFR is fundamentally a registry feeding India's digital health infrastructure (ABDM) — public bulk-download availability, as opposed to individual facility lookup or restricted institutional access, is unconfirmed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** — a real, authoritative, comprehensive source category exists; public bulk accessibility is unconfirmed |
| Decision impact | Partial — worth a future, dedicated investigation into NHRR's actual public data-access terms |

### EV-M6-P2-011 — data.gov.in Public Health Facility Performance Datasets (Telangana-specific)

| Field | Detail |
|---|---|
| Question | Does data.gov.in host any Telangana-specific, already-catalogued healthcare facility datasets? |
| Source | Ministry of Health and Family Welfare, via the OGD Platform India |
| Resource | e.g., `data.gov.in/resource/monthly-maximum-and-minimum-performing-public-health-facilities-hyderabad-telangana-31` (and similarly named resources for other Telangana districts, e.g., Medak) |
| Acquisition | WebSearch only; resource pages not directly fetched |
| Observation | These specifically named catalog entries track **facility performance** (a monthly maximum/minimum-performing facility metric across sub-districts, by facility type: CHC, SC, PHC, SDH, DH), **not** a full facility location/coordinate directory |
| Validation | Search-result-level only |
| Result | Confirms data.gov.in does host *some* granular, district-scoped Telangana health datasets, demonstrating the platform's real applicability to this domain — but this specific dataset family is about performance metrics, not facility geolocation, and is therefore **not directly usable** for the 10 km coverage workflow |
| Limitations | Facility type codes are present (useful for a future facility-type taxonomy), but no coordinates or precise location field was confirmed present |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** (real and Telangana-specific, but not fit for the specific coverage-computation purpose) |
| Decision impact | No closure for the coverage workflow specifically; may inform facility-type taxonomy |

### EV-M6-P2-012 — Indiastat District Health Statistics (PHC counts by district)

| Field | Detail |
|---|---|
| Question | Are aggregate Primary Health Centre (PHC) counts per Telangana district available? |
| Source | IndiaStat (a commercial statistical aggregator), citing government health statistics |
| Resource | `https://www.indiastatdistricts.com/telangana/all-districts/health/primaryhealthcentresphcs/data-year/2023` |
| Acquisition | WebSearch only |
| Observation | Search results confirm district-level PHC **counts** exist "as of March 31, 2023," distinguishing rural and urban PHCs. Telangana overall is reported to have "14 District Hospitals (DHs) and 18 Government General Hospitals (GGHs)," with all districts covered by Community Health Centres (CHCs) |
| Validation | Search-result-level only |
| Result | Confirms aggregate facility counts exist per district — useful context, but this is **summary statistics, not a facility-level dataset with individual locations**, and is not directly usable for point-level coverage computation |
| Limitations | No individual facility records, no coordinates; likely paywalled/limited for bulk use since IndiaStat is a commercial aggregator |
| **Status** | **EVIDENCE NOT AVAILABLE** for the coverage workflow (wrong granularity) |
| Decision impact | None for Example A directly |

## 3. Facility Field Availability — Explicit, Field-by-Field Assessment

| Required Field | Evidence Found | Confirmed? |
|---|---|---|
| Facility names | Implied by NHRR's census scope; not directly observed in any fetched page | Not confirmed |
| Facility type | Confirmed present in EV-M6-P2-011 (CHC/SC/PHC/SDH/DH codes) | **Confirmed present in at least one real dataset** |
| Location (address) | Not directly observed | Not confirmed |
| Coordinates | Not directly observed in any fetched page in this session | **Not confirmed anywhere** |
| Administrative association | Confirmed present in EV-M6-P2-011 (sub-district/district scoping) | Confirmed present |
| Identifiers | Not directly observed | Not confirmed |
| Update information | NHRR is described as an active national census effort (implying ongoing updates), but no specific update cadence was confirmed for any specific facility-level file | Not confirmed |

**No field above is asserted present unless the specific source cited actually stated it, per the search results and fetch attempts performed in this session.**

## 4. Sufficiency for the 10 km Coverage Workflow — Explicit Answer

**Not established as sufficient.** No facility dataset investigated in this session was confirmed to include the one field most essential to Example A — facility **coordinates**. EV-M6-P2-009 (the most likely candidate for a genuine geolocated directory) was inaccessible (403); EV-M6-P2-010 (NHRR) is plausible in scope but its public bulk-access terms are unconfirmed; EV-M6-P2-011 and EV-M6-P2-012 are real but wrong-granularity (performance metrics and aggregate counts, not individual geolocated facilities).

## 5. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE.** Real, Telangana-specific healthcare datasets exist on legitimate government platforms, confirming the domain is not a dead end — but no dataset investigated in this session was confirmed to provide the geolocated facility records the 10 km coverage workflow actually requires.

## 6. Security

No credential was required for any source investigated; the 403 encountered (EV-M6-P2-009) is recorded honestly as inconclusive rather than treated as proof of unavailability.

## 7. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 8. Milestone Traceability

This evidence supports Item 4.1 (Healthcare domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and directly informs Canonical Example A.

## 9. Open Decisions

No healthcare data source is confirmed. EV-M6-P2-009 (data.gov.in Hospital Directory) and EV-M6-P2-010 (NHRR) both warrant a future, authenticated or human-browser-based follow-up investigation.
