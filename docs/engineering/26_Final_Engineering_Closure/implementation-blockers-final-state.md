---
Document Name: Implementation Blockers Final State
Document ID: ED-FEC-BLOCKERS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Implementation Blockers Final State

## 1. Purpose

This is the final blocker register, classifying every blocker CRITICAL/HIGH/MEDIUM/LOW per [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md) Section 2's severity method. **A CRITICAL blocker remains open unless the governance chain genuinely cleared it — none has been.**

## 2. CRITICAL Blockers

| ID | Description | Evidence | Decision | Baseline | Current Status | Implementation Impact | Required Closure Action |
|---|---|---|---|---|---|---|---|
| BLK-001 | No domain has a real, accepted data source (Item 1) | Substantial for boundary/healthcare/roads/education; none for population/agriculture/most of water | 7 RECOMMENDED-class | 6 PROPOSED FOR BASELINE / BASELINE CANDIDATE | **OPEN** | Blocks M1 entirely | Formal Decision Review + ACCEPT for at least one domain |
| BLK-002 | No confirmed 33-district boundary dataset (Item 2) | Strongest in program — LGD candidate PASS | RECOMMENDED — PENDING FORMAL APPROVAL | PROPOSED FOR BASELINE | **OPEN** — 5 named gates (licensing, geometry validity/topology, CRS, provenance) | Blocks M1's first renderable map | Close all 5 gates, then Decision Review |
| BLK-003 | No frontend technology confirmed | Node.js availability only | REMAINS UNDER EVALUATION | NOT BASELINED | **OPEN** | Blocks any UI implementation | Execute Evidence+PoC for at least one candidate |
| BLK-004 | No backend technology confirmed | None | REMAINS UNDER EVALUATION | NOT BASELINED | **OPEN** | Blocks any backend implementation | Same |
| BLK-005 | No database technology confirmed; PostgreSQL Candidate/Proposed divergence unresolved | None (env-blocked) | REMAINS UNDER EVALUATION | NOT BASELINED | **OPEN** | Blocks physical schema design | Provision a real PostgreSQL instance; separately reconcile the documentation divergence |
| BLK-006 | No GIS technology confirmed | Algorithm logic PASS only (not PostGIS evidence) | REMAINS UNDER EVALUATION | NOT BASELINED | **OPEN** — improved from BLOCKED to NOT READY in ED-M6 Part 4 | Blocks spatial computation implementation | Execute Evidence+PoC once database is confirmed |
| BLK-007 | Deployment platform unresolved (production) | None | REMAINS UNRESOLVED | NOT BASELINED | **OPEN** | Blocks any production deployment | Provider/hosting decision |

## 3. HIGH Blockers

| ID | Description | Evidence | Decision | Baseline | Current Status | Implementation Impact | Required Closure Action |
|---|---|---|---|---|---|---|---|
| BLK-008 | AI provider divergence unreconciled (Item 3) | Real local-LLM feasibility evidence (4 tests) | REMAINS UNRESOLVED — divergence itself, a governance question | NOT BASELINED | **OPEN** | Blocks M3 | Data-sensitivity governance decision first |
| BLK-009 | RAG/retrieval unresolved | Proxy-only grounded-generation test | REMAINS UNRESOLVED | NOT BASELINED | **OPEN** | Blocks M3, downstream of BLK-008 | Embedding model acquisition + real retrieval PoC |
| BLK-010 | Embeddings/vector storage unresolved | None | REMAINS UNRESOLVED | NOT BASELINED | **OPEN** | Blocks M3 | Technology evaluation |
| BLK-011 | Security — auth provider/secrets tooling unresolved | Design complete only | REMAINS UNRESOLVED | NOT BASELINED | **OPEN** | Blocks M1 real authentication | Evidence+PoC for provider/tooling |
| BLK-012 | RPO/RTO undefined | None — explicitly not invented | REMAINS UNRESOLVED | NOT BASELINED | **OPEN** | Blocks pre-production sign-off | Architecture-design-phase decision |
| BLK-013 | Healthcare Demand forecasting contradiction (Item 26) | None gathered addressing the scope question itself | REMAINS UNRESOLVED, unchanged | NOT BASELINED | **OPEN** | Blocks that domain's M4 scope only | Scope-clarification decision (AD-RES-001-pattern) |
| BLK-014 | Recommendation Engine weighted-scoring gap (Item 27) | None gathered | REMAINS UNRESOLVED, unchanged | NOT BASELINED | **OPEN** | Blocks M6 | Technique decision + real-data weight calibration |
| BLK-015 | Healthcare data quality (NIC 54% duplication, stale labels) | Real, quantified, disclosed | RECOMMENDED, WITH MANDATORY REMEDIATION | PROPOSED FOR BASELINE | **OPEN** — remediation named, not performed | Blocks authoritative healthcare count/capacity claims | Deduplicate; spatially re-derive current-district assignment |
| BLK-016 | Rainfall API access (IMD, data.gov.in) | Real, live APIs; no key | RECOMMENDED — ACCESS VALIDATION REQUIRED | DEFERRED | **OPEN** | Blocks rainfall-dependent Prediction/Simulation | API-key registration (non-engineering action) |
| BLK-017 | Local road network/bridge data (Canonical Example B) | None | REMAINS UNDER EVALUATION / UNRESOLVED | NOT BASELINED | **OPEN** | Blocks bridge-closure accessibility analysis | Retry Overpass with longer cooldown, or download Geofabrik extract |

## 4. MEDIUM Blockers

| ID | Description | Current Status | Required Closure Action |
|---|---|---|---|
| BLK-018 | Observability platform unresolved | **OPEN** | Evidence+PoC for OpenTelemetry/Grafana+Prometheus or alternative |
| BLK-019 | Background jobs technology unresolved | **OPEN** | Technology evaluation once backend is chosen |
| BLK-020 | ML framework/model-serving technology unresolved | **OPEN** | Framework/architecture evaluation once real training data exists |
| BLK-021 | Source-precedence calibration (Item 25) | **OPEN** — real evidence now exists, no rule finalized | Finalize a precedence rule per [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 5's evidence bar |

## 5. LOW Blockers

| ID | Description | Current Status | Required Closure Action |
|---|---|---|---|
| BLK-022 | Dataset-deprecation process (Item 24) | **OPEN** — framework designed, never exercised | Exercise the framework once a real source requires deprecation |
| BLK-023 | Requirements traceability gaps (RG-REQ-001, 4 named items) | **OPEN** | Close the 4 named traceability gaps |
| BLK-024 | Accessibility source-requirement traceability gap | **OPEN** | Trace accessibility design to a specific FR/NFR ID |

## 6. No Blocker Cleared

**Zero blockers across all four severity tiers are marked CLEARED in this document.** BLK-002 and BLK-006 (boundary, GIS) show real, disclosed evidentiary improvement — narrower gaps than before — but neither reaches CLEARED, since the governance chain (Decision Review, formal approval, Baseline Entry) has not genuinely completed for either.

## 7. Security

BLK-005 (database), BLK-008 (AI provider), and BLK-011 (auth/secrets) carry this register's most direct security implications — all remain OPEN.

## 8. Observability

Every blocker traces to [implementation-blockers-final-state.md]'s underlying sources: [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) and every ED-M6 Part 4/5 decision file — no new evaluation performed here beyond consolidation.

## 9. Milestone Traceability

CRITICAL blockers (Section 2) gate M1 entirely; HIGH blockers (Section 3) gate M3–M6 and pre-production; MEDIUM/LOW blockers (Sections 4–5) constrain scope/quality without preventing implementation from beginning.

## 10. Open Decisions

**Every blocker in this register remains open.** This document classifies and consolidates; it resolves nothing.
