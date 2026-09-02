---
Document Name: Education and Agriculture Evidence
Document ID: ED-EAV-EDUAGRI-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Education and Agriculture Evidence

## 1. Purpose

This document investigates real education and agriculture data sources for Telangana, evaluating whether they can support district-level intelligence. Real web research was performed (access date 2026-09-02). **Note: education is investigated here for completeness of general district-intelligence data-source research, though it is not one of DistrictMind's ten named information domains in the project brief — its evidence is recorded honestly regardless.**

## 2. Education — Evidence Records

### EV-M6-P2-026 — UDISE+ (Unified District Information System for Education Plus)

| Field | Detail |
|---|---|
| Question | Does India's national school-education data system provide district-level, machine-readable education data for Telangana? |
| Source | Ministry of Education, Department of School Education and Literacy, catalogued on the Open Government Data (OGD) Platform India under the National Data Sharing and Accessibility Policy (NDSAP) |
| Resource | `https://www.data.gov.in/catalog/unified-district-information-system-education-plus-udise-plus`, cross-referenced with `https://udiseplus.gov.in/` |
| Acquisition | WebSearch only; catalog page not directly fetched (consistent with this session's repeated 403 pattern for data.gov.in resource pages) |
| Observation | The OGD catalog is described as offering "a Catalog API and Zip Download option," with fields including "academic year, state code, state name, district code, district name, block code, location name, school category, school management, caste information" |
| Validation | Search-result-level only |
| Result | Confirms a real, structured, district-scoped national education dataset exists with a stated API and bulk-download mechanism |
| Limitations | Not directly fetched to confirm live accessibility; given the session's pattern of 403 responses on data.gov.in resource pages, live accessibility is not assumed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — education is not a named DistrictMind domain, so this has no direct decision impact on any current blocker |

### EV-M6-P2-027 — data.opencity.in (Telangana UDISE+ Mirror, incl. Hyderabad)

| Field | Detail |
|---|---|
| Question | Does a third-party civic-data platform mirror Telangana-specific UDISE+ data in an accessible form? |
| Source | OpenCity (a civic open-data initiative), hosting government-sourced data via CKAN |
| Resource | `https://data.opencity.in/dataset?organization=government-of-telangana`, specifically `https://data.opencity.in/dataset/hyderabad-udise-2021-22` |
| Acquisition | WebSearch only |
| Observation | Confirms Telangana-specific (Hyderabad district-named) education datasets exist on this platform, spanning "profile data, school facilities, school enrolment data, and teacher data" |
| Validation | Search-result-level only |
| Result | A real, Telangana-specific, district-named dataset confirmed to exist by name |
| Limitations | Only Hyderabad district was specifically named in search results; whether all 33 districts have equivalent coverage is unconfirmed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial; education remains a non-priority domain for DistrictMind's core scope |

## 3. Agriculture — Evidence Records

### EV-M6-P2-028 — Telangana Open Data Portal, Agriculture Collection

| Field | Detail |
|---|---|
| Question | Does the Telangana Open Data Portal host district/season/crop-level agricultural statistics? |
| Source | Government of Telangana, Department of Agriculture and Co-operation |
| Resource | `https://data.telangana.gov.in/collection/agriculture` and `https://agri.telangana.gov.in/open_record_view.php?ID=1255` |
| Acquisition | WebSearch only; not directly fetched |
| Observation | Search results confirm "Department of Agriculture publishes season and crop coverage reports," with "District, Season and Crop wise Area, Production and Yield" data also separately catalogued via a third-party aggregator (`dataful.in`) |
| Validation | Search-result-level only |
| Result | Confirms real, government-published, district-level crop/season/area/yield data exists in some accessible form |
| Limitations | Not directly fetched to confirm actual downloadable format or completeness; given this session's finding that a specific Telangana portal page (EV-M6-P2-001) returned 404 despite being referenced elsewhere, this candidate's live accessibility is not assumed without direct verification |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — supports the Crop prediction domain ([prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 13) |

### EV-M6-P2-029 — Agricultural Data Exchange (ADeX), Telangana

| Field | Detail |
|---|---|
| Question | Does Telangana's newer, purpose-built agricultural data infrastructure provide a more current/structured data-access mechanism? |
| Source | Government of Telangana, in collaboration with the World Economic Forum and the Indian Institute of Science |
| Resource | Referenced by name only ("Telangana launches India's first Agricultural Data Exchange and Agriculture Data Management Framework") — no specific access URL confirmed |
| Acquisition | WebSearch only |
| Observation | ADeX is described as "digital public infrastructure for the agriculture sector," a notably more recent and purpose-built initiative than a generic open-data portal listing |
| Validation | Search-result-level only; described via news coverage, not a direct dataset/API page |
| Result | Identifies a promising, more recent initiative, but not yet a directly usable dataset or endpoint |
| Limitations | No specific access mechanism, license, or format confirmed |
| **Status** | **EVIDENCE NOT AVAILABLE** (identified by name only) |
| Decision impact | None yet — flagged for future investigation as ADeX matures |

## 4. Suitability for District-Level Intelligence — Explicit Assessment

| Domain | Suitability Finding |
|---|---|
| Education | Real, structured, district-scoped data exists (UDISE+) with both an official national channel and Telangana-specific mirrors — but education is not a named DistrictMind information domain, so this evidence is recorded for completeness rather than as a priority blocker |
| Agriculture | Real, government-published, district/season/crop-level data is confirmed to exist in principle, directly relevant to the Crop prediction domain — but no specific page was directly fetched and confirmed accessible in this session, and this session's repeated pattern of broken/inaccessible Telangana-portal links (EV-M6-P2-001, and by extension this candidate) means live accessibility should not be assumed without direct follow-up |

## 5. No Portal Page Assumed to Be a Usable Dataset

**Restated per this milestone's explicit instruction:** neither the UDISE+ catalog listing nor the Telangana agriculture collection page is treated as a confirmed usable dataset merely because a catalog entry or department page exists — both are recorded as EVIDENCE PARTIALLY AVAILABLE precisely because live accessibility was not directly fetched and confirmed in this session.

## 6. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE for both domains.** Real, credible, government-sourced data is confirmed to exist by name and description for both education and agriculture, but no specific resource in either domain was directly fetched and confirmed live/downloadable in this session.

## 7. Security

No credential was required for any source investigated.

## 8. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 9. Milestone Traceability

Agriculture evidence supports Item 4.1 (Agriculture domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M2, and the Crop prediction domain for M4. Education evidence is supplementary and not tied to a named DistrictMind blocker.

## 10. Open Decisions

No education or agriculture data source is confirmed or selected. All candidates require direct-fetch follow-up verification in a future session.
