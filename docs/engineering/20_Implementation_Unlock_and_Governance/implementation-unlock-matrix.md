---
Document Name: Implementation Unlock Matrix
Document ID: ED-IUG-MATRIX-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Implementation Unlock Matrix

## 1. Purpose

This is the master implementation-unlock matrix, consolidating every readiness gate defined in Files 3–10 of this milestone into a single authoritative view. **No unresolved item is marked passed. No technology or dataset is marked Confirmed.**

## 2. The Master Matrix

| # | Row | Current Status | Evidence Required | Decision Required | Baseline Required | Blocking? | Dependency | Affected M1–M6 | Next Validation Action |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Requirements | Documented, Conditional Pass (RG-REQ-001, 4 named gaps) | None further for baseline stability; FR-033 notification design, Healthcare Demand scope, accessibility source-ID | No | No — already baselined | No (LOW) | None | M1–M6 | Close the 4 named traceability gaps |
| 2 | Data sources (8 domains) | **SOURCE UNRESOLVED**, all domains | Authority, Provenance, Licensing per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md) | Yes — none made | Yes | **Yes — CRITICAL** | None (independently resolvable) | M1 (Geographic), M2 (rest) | Identify at least one real, accessible source per domain |
| 3 | District boundaries (33-district) | **No candidate identified** | The 6 evidence types in [boundary-dataset-validation-plan.md](../18_Evidence_and_PoC_Resolution/boundary-dataset-validation-plan.md) Section 3 | Yes — none made | Yes | **Yes — CRITICAL** | Row 2 (Geographic) | M1 | Identify a candidate boundary dataset |
| 4 | Frontend technology | Candidate/Proposed (React, Next.js, Vue.js, TypeScript) | Compatibility, PoC per [frontend-technology-poc.md](../18_Evidence_and_PoC_Resolution/frontend-technology-poc.md) | Yes — none made | Yes | **Yes — CRITICAL** | None | M1 | Execute Evidence + PoC stage for at least one candidate |
| 5 | Backend technology | Candidate (FastAPI, Node.js, Django) | Compatibility (modular monolith fit), PoC per [backend-technology-poc.md](../18_Evidence_and_PoC_Resolution/backend-technology-poc.md) | Yes — none made | Yes | **Yes — CRITICAL** | None | M1 | Execute Evidence + PoC stage |
| 6 | Database technology | Candidate/To Be Evaluated (PostgreSQL, MySQL/MariaDB, MongoDB) | Six-category fit, AI-exclusion credentialing, PoC per [database-technology-poc.md](../18_Evidence_and_PoC_Resolution/database-technology-poc.md) | Yes — none made | Yes | **Yes — CRITICAL** | None | M1 | Execute Evidence + PoC stage; note AD-DE-001/technology-stack.md status divergence remains unreconciled |
| 7 | GIS technology | Candidate/To Be Evaluated (PostGIS, Leaflet, Mapbox GL JS, GeoServer) | Two-track PoC per [gis-technology-poc.md](../18_Evidence_and_PoC_Resolution/gis-technology-poc.md) | Yes — none made | Yes | **Yes — CRITICAL** | Row 3, Row 6 | M1–M2 | Execute Evidence + PoC on both rendering and computation tracks |
| 8 | AI provider/model | **Divergence unreconciled** (Claude/Anthropic Candidate vs. Blueprint's local Llama 3/Ollama proposal) | Data-sensitivity governance decision, then PoC per [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) | Yes — none made | Yes | **Yes — HIGH** | None directly, but governance-gated | M3 | Resolve the data-sensitivity governance question first |
| 9 | RAG/retrieval | No RAG-framework-specific candidate | PoC per [rag-retrieval-poc.md](../18_Evidence_and_PoC_Resolution/rag-retrieval-poc.md) | Yes — none made | Yes | Yes — HIGH | Row 8 | M3 | Execute Evidence + PoC once Row 8 progresses |
| 10 | Embeddings/vector storage | No embedding-model candidate; pgvector/Chroma Candidate, Qdrant/Weaviate To Be Evaluated | PoC per [rag-retrieval-poc.md](../18_Evidence_and_PoC_Resolution/rag-retrieval-poc.md) | Yes — none made | Yes | Yes — HIGH | Row 6, Row 8 | M3 | Identify embedding-model candidates; execute PoC |
| 11 | API contracts | **Complete and stable** (18 operations, 16 Typed Tools) | None further | No | No — already baselined | No | Row 4, Row 5 | M1, M3 | None — maintain via [change-control-governance.md](change-control-governance.md) |
| 12 | Security | Design complete; auth provider/secrets tooling unresolved | Provider/tooling Evidence per [security-and-quality-readiness-gates.md](security-and-quality-readiness-gates.md) | Yes — auth provider, secrets tooling | Yes, for provider/tooling | Yes — MEDIUM | Row 5 | M1 | Execute Evidence + PoC for auth provider and secrets tooling |
| 13 | Testing | Design complete; zero test executed | None further for design | No | No — already baselined (design) | No (LOW, design); blocks on Rows 4–7 for execution | Rows 4–7 | M1–M6 | Begin execution once technology rows unblock |
| 14 | Observability | Design complete; platform unresolved | Platform Evidence | Yes — platform | Yes | Yes — MEDIUM | None | M1 | Execute Evidence + PoC for OpenTelemetry/Grafana+Prometheus or alternative |
| 15 | Deployment | Design complete; hosting/cloud provider unresolved | Provider Evidence | Yes — none made | Yes | **Yes — CRITICAL for production** | Rows 4–7, 12, 14 | M1 (production) | Execute Evidence + PoC for hosting/cloud provider |
| 16 | Backup/recovery | Design complete | None further for design | No | No — already baselined (design) | No (LOW, design); real backup blocked by Row 6, Row 15 | Row 6, Row 15 | M1 | Exercise real backup/restore once Rows 6, 15 unblock |
| 17 | RPO/RTO | **UNRESOLVED**, restated from NFR-037/NFR-038 | Real operational requirements analysis | Yes | Yes | Yes — HIGH (pre-production) | Row 15 | Pre-production | Define RPO/RTO during architecture-design phase per NFR-038's own wording |
| 18 | Healthcare Demand forecasting gap | **Contradiction unresolved** (Abstract vs. Blueprint's 5-model list) | A scope-clarification decision | Yes | Yes | Yes — HIGH (M4 scope only) | None | M4 | Resolve via a routing-resolution-style (AD-RES-001-pattern) scope decision |
| 19 | Recommendation scoring gap | **Gap unresolved** (technique undecided, weights uncalibrated) | Technique decision + real outcome data for calibration | Yes | Yes | Yes — HIGH (M6 only) | Row 2 (for calibration data) | M6 | Resolve technique; await real data for weight calibration |
| 20 | Dataset deprecation | Framework designed, never exercised | A real deprecation event to exercise against | No (framework already exists) | No | No — LOW | Row 2 | Not milestone-specific | Exercise the framework once a real source requires deprecation |

## 3. Reading the Matrix

| Column | Interpretation Guidance |
|---|---|
| Current status | Restated exactly from the governing document cited — never upgraded here |
| Evidence required | What a future Evidence stage ([evidence-strategy.md](../18_Evidence_and_PoC_Resolution/evidence-strategy.md)) would need to gather |
| Decision required | Whether a formal AD-* or Decision Record must still be drafted |
| Baseline required | Whether [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) must still be updated |
| Blocking? | Whether this row's unresolved state prevents implementation from beginning for its affected scope, per [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md) Section 2's severity method |
| Dependency | Which other row(s) this row's resolution depends on |
| Affected M1–M6 | Which milestone(s) this row gates |
| Next validation action | The single most useful next step — never a resolution itself |

## 4. Summary — CRITICAL Blocking Rows

| Row | Why CRITICAL |
|---|---|
| 2. Data sources | Blocks M1 entirely — no domain has a real source |
| 3. District boundaries | Blocks M1 entirely — no candidate exists |
| 4. Frontend technology | Blocks M1 entirely — no code can be written |
| 5. Backend technology | Blocks M1 entirely — same |
| 6. Database technology | Blocks M1 entirely — same |
| 7. GIS technology | Blocks M1–M2 — no spatial computation possible |
| 15. Deployment (production) | Blocks any production deployment |

## 5. Summary — HIGH Blocking Rows

| Row | Why HIGH |
|---|---|
| 8. AI provider/model | Blocks M3 — the divergence itself, not merely an unmade choice, requires governance resolution first |
| 9. RAG/retrieval | Blocks M3, downstream of Row 8 |
| 10. Embeddings/vector storage | Blocks M3, downstream of Rows 6, 8 |
| 12. Security (provider/tooling) | Blocks M1 real authentication |
| 17. RPO/RTO | Blocks pre-production sign-off |
| 18. Healthcare Demand | Blocks that specific domain's M4 scope only |
| 19. Recommendation scoring | Blocks M6 |

## 6. Summary — Non-Blocking Rows

| Row | Why Not Blocking |
|---|---|
| 1. Requirements | Documentation is stable; named gaps are documentation-completeness items |
| 11. API contracts | Complete and stable |
| 13. Testing | Design complete; execution naturally sequenced after technology rows |
| 16. Backup/recovery | Design complete; real exercise naturally sequenced after Rows 6, 15 |
| 20. Dataset deprecation | Framework exists; awaits a real triggering event |

## 7. No Unresolved Item Marked Passed

**Every row above reflects its documented status exactly as recorded in its governing document — no row's Current Status column claims a Pass, Selected, or Confirmed state that the underlying evidence does not support.**

## 8. Security

Rows 12 and 8 carry this matrix's most direct security implications — both remain Blocking.

## 9. Observability

This matrix should be re-generated whenever any row's underlying gate status changes, per [decision-to-baseline-governance.md](decision-to-baseline-governance.md) Step 7.

## 10. Milestone Traceability

Restated per-row in the Affected M1–M6 column above.

## 11. Open Decisions

Every row in this matrix remains open. This document consolidates status; it resolves nothing.
