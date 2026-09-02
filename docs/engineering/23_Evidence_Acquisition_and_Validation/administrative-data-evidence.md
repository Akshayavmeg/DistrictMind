---
Document Name: Administrative Data Evidence
Document ID: ED-EAV-ADMIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Administrative Data Evidence

## 1. Purpose

This document investigates administrative identifier sources (districts, mandals, villages) for Telangana, distinguishing identifier data from geometry data. **No identifier scheme, LGD code, or hierarchy is fabricated.**

## 2. The Identifier ≠ Geometry Distinction — Applied Throughout

Restated as this document's governing rule: a dataset that provides stable administrative identifiers and hierarchy is not thereby proven to also provide geometry, and vice versa — restated unchanged from [boundary-dataset-evidence-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/boundary-dataset-evidence-plan.md) Section 2. This document evaluates identifier/hierarchy sources; [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) evaluates geometry sources. **The two are never assumed to come from the same file.**

## 3. Evidence Records

### EV-M6-P2-006 — Local Government Directory (LGD), Ministry of Panchayati Raj

| Field | Detail |
|---|---|
| Question | Does India's official administrative-hierarchy registry provide stable, authoritative identifiers for Telangana's districts, mandals, and villages? |
| Source | Ministry of Panchayati Raj, Government of India — the national authority for local-government administrative units |
| Resource | `https://lgdirectory.gov.in/` |
| Acquisition | WebSearch confirming the portal's role and function; the portal itself was not directly fetched in this pass |
| Observation | LGD is described (via search results) as "an online platform developed to maintain an up-to-date list of administrative units including districts, sub-districts, villages, blocks, and local governance bodies," developed under the e-Panchayat Mission Mode project. Every administrative sub-division in Telangana (called a Mandal) is assigned a unique Sub-district LGD code |
| Validation | Search-result-level confirmation of the portal's existence and stated function; the portal itself was not directly fetched to confirm live query/export functionality in this pass |
| Result | LGD is confirmed as the **correct authoritative source category** for administrative identifiers — this matches DistrictMind's own prior documentation ([data-source-requirements.md](../17_Data_and_Technology_Resolution/data-source-requirements.md)) identifying LGD-style identifiers as the target |
| Limitations | Direct portal fetch (to confirm actual query/export UI, API availability, and rate limits) was not performed in this research pass; whether LGD's public interface supports bulk programmatic export was not verified |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** — authoritative source identified and its role confirmed; direct access mechanism not yet verified |
| Decision impact | Partial — establishes LGD as the correct target source; does not itself close the administrative-identifier evidence gap |

### EV-M6-P2-007 — `planemad/india-local-government-directory` (GitHub mirror of LGD data)

| Field | Detail |
|---|---|
| Question | Does a community-maintained mirror of LGD data provide an actually accessible, bulk-downloadable copy of the district/mandal/village hierarchy? |
| Source | Individual GitHub contributor (planemad), explicitly described as "Data from https://lgdirectory.gov.in" |
| Resource | `https://github.com/planemad/india-local-government-directory` |
| Acquisition | Identified via WebSearch; not directly fetched in this pass |
| Observation | Search results describe "complete dumps of the lgdirectory.gov.in data... available in CSV format with administrative hierarchies including states, districts, sub-districts (mandals), villages, and blocks" |
| Validation | Search-result-level only; the repository itself was not fetched to confirm file freshness, exact Telangana row count, or CSV schema |
| Result | A plausible, real candidate for bulk identifier access, since LGD's own portal is oriented toward interactive lookup rather than bulk export |
| Limitations | Freshness (how recently synced against the live LGD registry) is unconfirmed; exact schema (which columns exist, whether Telangana's 33-district structure is reflected) is unconfirmed |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** |
| Decision impact | Partial — a candidate worth a future direct-fetch/download PoC |

### EV-M6-P2-008 — LGD-Style Sub-District Code Lookup Tool (`panchayatsetu.in`)

| Field | Detail |
|---|---|
| Question | Do third-party lookup tools re-publish LGD sub-district (mandal) codes in an accessible form? |
| Source | Third-party tool, described as sourcing "directly from the Local Government Directory maintained by the Ministry of Panchayati Raj" |
| Resource | `https://www.panchayatsetu.in/sub-district-lgd-code-list` |
| Acquisition | Identified via WebSearch; not directly fetched |
| Observation | Positioned as "a free, fast lookup for the complete sub-district LGD code list district-wise and state-wise" |
| Validation | Search-result-level only |
| Result | A secondary, non-authoritative convenience layer over LGD data — useful for spot-checking, not for bulk/programmatic ingestion |
| Limitations | Not a bulk-export source; not independently verified as accurate versus the LGD source it claims to mirror |
| **Status** | **EVIDENCE NOT AVAILABLE** for DistrictMind's ingestion purposes (not bulk/programmatic; secondary source) |
| Decision impact | None |

## 4. Distinguishing Administrative Identifiers, Geometry, Names, and Hierarchy

| Element | Evidence Found | Source |
|---|---|---|
| Administrative identifiers (LGD codes) | Confirmed to exist as a concept and be sourced from an authoritative registry (LGD) | EV-M6-P2-006 |
| Geometry | Separately investigated in [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md) — **no confirmed link established between LGD identifiers and any specific geometry file's identifier field** |
| Names | Confirmed present alongside identifiers in LGD-derived sources (district/mandal/village names) per EV-M6-P2-006/007 |
| Hierarchy | Confirmed present — LGD explicitly models State→District→Sub-district(Mandal)→Village per EV-M6-P2-006, matching DistrictMind's own Geography hierarchy ([data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 3) |

**No assumption is made that any identifier dataset found here also contains geometry.** Should the India Geodata project's `admin/districts` release (EV-M6-P2-004, [telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md)) actually source from LGD as its metadata claims, a future PoC could test whether its geometry file's identifiers align with LGD codes — this alignment is not yet verified.

## 5. Overall Finding

**EVIDENCE STATUS = EVIDENCE PARTIALLY AVAILABLE.** LGD is confirmed as the correct authoritative source category for administrative identifiers and hierarchy, consistent with DistrictMind's own prior documentation. Direct bulk-access mechanisms (community mirrors) were identified but not independently verified for freshness or completeness. No identifier scheme is confirmed compatible with `/districts/:id` without further verification.

## 6. Security

No credential was required for any source investigated.

## 7. Observability

Every finding is attributed and dated per [evidence-record-management.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-record-management.md).

## 8. Milestone Traceability

This evidence supports Item 4.1 (Geographic domain) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M1.

## 9. Open Decisions

No administrative-data source is confirmed. LGD is identified as the correct target; a future PoC is needed to verify actual bulk access and freshness.
