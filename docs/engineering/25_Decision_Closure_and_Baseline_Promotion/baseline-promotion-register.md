---
Document Name: Baseline Promotion Register
Document ID: ED-DCB-BASELINE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Baseline Promotion Register

## 1. Purpose

This register records the baseline status of every candidate assessed in Files 2–11 and reviewed in [decision-review-record.md](decision-review-record.md), per [decision-to-baseline-governance.md](../20_Implementation_Unlock_and_Governance/decision-to-baseline-governance.md)'s seven-step path. **Nothing below is marked BASELINED unless the governance process genuinely permits it — nothing does, this milestone.**

## 2. Status Vocabulary Used

| Status | Meaning |
|---|---|
| NOT BASELINED | No baseline entry exists or is proposed |
| PROPOSED FOR BASELINE | A candidate whose recommendation was upheld at Decision Review, with named preconditions still outstanding |
| BASELINE CANDIDATE | A near-synonym for PROPOSED FOR BASELINE, used where the preconditions are narrower/closer to closure |
| DEFERRED | Intentionally paused pending a dependency |
| REJECTED | Failed evidence/PoC/review with no viable mitigation identified |

**BASELINED (an actual, completed entry in the engineering baseline) does not appear as a value anywhere in this register — no candidate reached it this milestone.**

## 3. The Register

| Candidate | Evidence IDs | Validation IDs | Decision Recommendation | Approval Requirement | Baseline Status | Implementation Status |
|---|---|---|---|---|---|---|
| Boundary — `LGD_Districts.parquet` | EV-M6-P3 boundary download | VAL-M6-P3-001/002/003 | RECOMMENDED — PENDING FORMAL APPROVAL | Licensing verification, full OGC validity/topology check, direct-primary-source provenance confirmation | **PROPOSED FOR BASELINE** | Not unlocked |
| Boundary — `districts.json` (Candidate A) | Part 2/3 | VAL-M6-P3-001 | Rejected (10-district structure, fails currency) | N/A | **REJECTED** | N/A |
| Boundary — `SOI_Districts.parquet` (Candidate C) | Part 3 | VAL-M6-P3-003 | Cross-validation support only, not itself recommended as primary | N/A | **NOT BASELINED** | Not unlocked |
| Administrative identifiers — district-level (`dist_lgd`) | Same source as boundary | VAL-M6-P3-004 | RECOMMENDED — PENDING FORMAL APPROVAL | Same as boundary (shared file) | **PROPOSED FOR BASELINE** | Not unlocked |
| Administrative identifiers — mandal/village-level | None | VAL-M6-P3-005 (NOT TESTED) | REMAINS UNRESOLVED | Data must first be acquired and opened | **NOT BASELINED** | Not unlocked |
| Healthcare — OSM/Overpass | EV-M6-P3-001 | VAL-M6-P3-006/007 | RECOMMENDED — PENDING FORMAL APPROVAL (coverage-use only) | Scope-limitation confirmed at Decision Review | **BASELINE CANDIDATE** (narrow scope) | Not unlocked |
| Healthcare — NIC | EV-M6-P3-002 | VAL-M6-P3-016 | RECOMMENDED — PENDING FORMAL APPROVAL, WITH MANDATORY REMEDIATION | Deduplication + current-district re-derivation actually performed and re-validated | **PROPOSED FOR BASELINE** (remediation outstanding) | Not unlocked |
| Roads — MoRTH National Highways | EV-M6-P3-003 | VAL-M6-P3 (roads file) | RECOMMENDED — PENDING FORMAL APPROVAL (National Highway subset only) | Scope statement carried forward verbatim | **BASELINE CANDIDATE** (narrow scope) | Not unlocked |
| Roads — OSM local network/bridges | Part 2/3 | VAL-M6-P3-008/009/010 | REMAINS UNDER EVALUATION | Successful retrieval attempt required | **NOT BASELINED** | Not unlocked |
| Rainfall — IMD | Part 3 | VAL-M6-P3-011 | RECOMMENDED — ACCESS VALIDATION REQUIRED | API key registration (non-engineering action) | **DEFERRED** | Not unlocked |
| Rainfall — data.gov.in | Part 3 | VAL-M6-P3-012 | RECOMMENDED — ACCESS VALIDATION REQUIRED | Same | **DEFERRED** | Not unlocked |
| Population — Census/data.gov.in | Part 3 | VAL-M6-P3-013/014 | REMAINS UNRESOLVED | Actual resource must be located and opened | **NOT BASELINED** | Not unlocked |
| Water — `SOI_Lakes.parquet` | Part 3 | VAL-M6-P3-017 | Rejected (Telangana use) | N/A | **REJECTED** (this file only) | N/A |
| Water — rivers/streams | Part 3 | VAL-M6-P3-018 | REMAINS UNDER EVALUATION | Download budget in a future session | **DEFERRED** | Not unlocked |
| Water — six other release families | Part 3 | None | REMAINS UNRESOLVED | Files must be opened | **NOT BASELINED** | Not unlocked |
| Education — HOTOSM facilities | Part 3 | VAL-M6-P3-020 | RECOMMENDED — PENDING FORMAL APPROVAL | Decision Review | **BASELINE CANDIDATE** | Not unlocked (not a named domain) |
| Agriculture — none found | None | VAL-M6-P3-021 | REMAINS UNRESOLVED | Telangana portal/ADeX verification required | **NOT BASELINED** | Not unlocked |
| Frontend — React/TypeScript/Leaflet | None | VAL-M6-P3-024 (Node.js only) | REMAINS UNDER EVALUATION | Full Evidence+PoC+Validation chain | **NOT BASELINED** | Not unlocked |
| Backend — FastAPI/Node.js/Django | None | None | REMAINS UNDER EVALUATION | Same | **NOT BASELINED** | Not unlocked |
| Database — PostgreSQL/PostGIS | None (environment-blocked) | VAL-M6-P3-025 | REMAINS UNDER EVALUATION; Candidate/Proposed divergence unresolved | Full PoC chain + documentation reconciliation | **NOT BASELINED** | Not unlocked |
| GIS — PostGIS/Leaflet/Mapbox/GeoServer | None | [backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md) §4 (algorithm-level only) | REMAINS UNDER EVALUATION | Full PoC chain | **NOT BASELINED** | Not unlocked |
| AI provider (hosted vs. local) | EV-M6-P3-004 | VAL-M6-P3-026 through 030 | Local-LLM recommended for further PoC only; divergence unresolved | Data-sensitivity governance decision | **NOT BASELINED** | Not unlocked |
| RAG/embeddings | None | None | REMAINS UNRESOLVED | Embedding model acquisition | **NOT BASELINED** | Not unlocked |
| Model serving | None | None | REMAINS UNRESOLVED | Technology evaluation | **NOT BASELINED** | Not unlocked |

## 4. Why "BASELINE CANDIDATE" vs. "PROPOSED FOR BASELINE"

This register distinguishes the two only by how narrow the remaining precondition is: **BASELINE CANDIDATE** is used where the only remaining requirement is a scope-statement or Decision Review confirmation (OSM healthcare, MoRTH highways, education) — the underlying data itself has no disclosed quality defect. **PROPOSED FOR BASELINE** is used where a substantive, named remediation or verification step (licensing, deduplication, provenance confirmation) must actually be *performed*, not merely confirmed, before the candidate is ready (boundary dataset, administrative identifiers, NIC healthcare). Neither label is a synonym for BASELINED.

## 5. No Candidate Reaches Baseline Entry This Milestone

Per [decision-to-baseline-governance.md](../20_Implementation_Unlock_and_Governance/decision-to-baseline-governance.md) Section 2, Baseline Entry (Step 5) requires a completed Decision Record (Step 2), Decision Review (Step 3), and Decision Status set (Step 4) — none of which reached completion for any candidate in this register, since every recommendation review in [decision-review-record.md](decision-review-record.md) explicitly withheld approval pending named gates. **[decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)'s 42-decision baseline is not modified by this milestone.**

## 6. Security

No candidate with an unverified license is marked as if licensing were resolved. No candidate with disclosed data-quality defects (NIC duplication/staleness) is marked ready for unremediated use.

## 7. Observability

Every row traces to a specific decision file (Files 2–11) and the underlying `EV-M6-P3-*`/`VAL-M6-P3-*` evidence — no new computation performed in this register.

## 8. Milestone Traceability

This register directly informs [implementation-readiness-reassessment.md](implementation-readiness-reassessment.md) and [ED-M6-P4-VALIDATION.md](ED-M6-P4-VALIDATION.md)'s baseline/implementation-unlock sections.

## 9. Open Decisions

**Zero candidates are BASELINED.** Six reach PROPOSED FOR BASELINE or BASELINE CANDIDATE status (boundary, administrative identifiers, OSM healthcare, NIC healthcare, MoRTH highways, education), each with an explicit, unmet precondition. Every other candidate remains NOT BASELINED, DEFERRED, or REJECTED, exactly as its own decision file and review record establish.
