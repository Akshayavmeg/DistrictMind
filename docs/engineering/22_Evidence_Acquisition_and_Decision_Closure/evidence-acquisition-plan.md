---
Document Name: Evidence Acquisition Plan
Document ID: ED-EADC-PLAN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Evidence Acquisition Plan

## 1. Purpose

This is the master evidence acquisition plan for ED-M6 Part 1, covering all 18 critical unresolved areas named in this milestone's brief. **No evidence is acquired by this document. No PoC is executed. No technology or dataset is confirmed.**

## 2. A Note on Directory Numbering

This milestone's brief specifies `docs/engineering/22_Evidence_Acquisition_and_Decision_Closure/` explicitly, while the prior milestone (ED-M5 Part 4) concluded at `20_Implementation_Unlock_and_Governance/` — no `21_` folder exists. This numbering gap is followed literally per the brief's explicit instruction, and is recorded here rather than silently renumbered, consistent with this program's discipline of never silently altering an explicit instruction.

## 3. The Governing Chain — Restated

```mermaid
flowchart LR
    Q[Question] --> ER[Evidence Request]
    ER --> EA[Evidence Acquisition]
    EA --> EV[Evidence Validation]
    EV --> PoC[PoC]
    PoC --> Obs[Observation]
    Obs --> Res[Result]
    Res --> Dec[Decision]
    Dec --> Base[Baseline]
    Base --> RU[Readiness Update]
```

**Never: Assumption → Decision.** Every one of the 18 items below is addressed strictly through this chain, restated unchanged from [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) Section 2 and [decision-to-baseline-governance.md](../20_Implementation_Unlock_and_Governance/decision-to-baseline-governance.md) Section 2, with "Question" and "Evidence Request" made explicit as the first two stages this milestone specifically addresses.

## 4. The 18 Critical Unresolved Areas

### 4.1 Real Data Source

| Field | Detail |
|---|---|
| Question | For each of the 8+ domains, what real, accessible, authoritative source exists? |
| Why it matters | Blocks M1 entirely — restated CRITICAL from [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Row 2 |
| Evidence required | Authority, Provenance, Licensing, Accessibility per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md) |
| Evidence source | External — government/departmental data portals, official statistical agencies (specific sources not yet identified in this repository) |
| Acquisition method | Elaborated in [data-source-evidence-plan.md](data-source-evidence-plan.md) |
| Validation method | [data-source-validation-plan.md](../18_Evidence_and_PoC_Resolution/data-source-validation-plan.md) |
| Decision dependency | None (independently resolvable per domain) |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1 (Geographic), M2 (all others) |
| Expected output | A Data Source Decision Record reaching ACCEPT or CONDITIONAL ACCEPTANCE for at least one source per domain |
| **Current status** | **EVIDENCE NOT AVAILABLE** — no real source has been identified in any repository document to date |

### 4.2 33-District Boundary Dataset

| Field | Detail |
|---|---|
| Question | What dataset provides valid, complete, provenance-attributable geometry for all 33 Telangana districts? |
| Why it matters | Blocks the first renderable map — CRITICAL per [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Row 3 |
| Evidence required | The six evidence types in [boundary-dataset-validation-plan.md](../18_Evidence_and_PoC_Resolution/boundary-dataset-validation-plan.md) Section 3 |
| Evidence source | External — elaborated in [boundary-dataset-evidence-plan.md](boundary-dataset-evidence-plan.md) |
| Acquisition method | Same |
| Validation method | [boundary-dataset-validation-plan.md](../18_Evidence_and_PoC_Resolution/boundary-dataset-validation-plan.md) |
| Decision dependency | 4.1 (Geographic domain) |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1 |
| Expected output | A GIS Decision Record reaching ACCEPT or CONDITIONAL ACCEPTANCE (pilot district) |
| **Current status** | **EVIDENCE NOT AVAILABLE** — no candidate dataset has been identified anywhere in this repository |

### 4.3 Frontend Technology

| Field | Detail |
|---|---|
| Question | Which of React, Next.js, Vue.js best satisfies DistrictMind's GIS/animation/AI-UI requirements? |
| Why it matters | Blocks all frontend implementation — CRITICAL per [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Row 4 |
| Evidence required | Per [frontend-decision-evidence-plan.md](frontend-decision-evidence-plan.md) |
| Evidence source | Candidate official documentation, existing PoC design ([frontend-technology-poc.md](../18_Evidence_and_PoC_Resolution/frontend-technology-poc.md)) |
| Acquisition method | Executing that PoC design against real fixture data |
| Validation method | Independent Decision Review per [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md) |
| Decision dependency | None |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1 |
| Expected output | A Technology Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE** — no PoC has been executed |

### 4.4 Backend Technology

| Field | Detail |
|---|---|
| Question | Which of FastAPI, Node.js (Express/NestJS), Django best satisfies modular-monolith and AI-boundary requirements? |
| Why it matters | Blocks all backend implementation — CRITICAL |
| Evidence required | Per [backend-decision-evidence-plan.md](backend-decision-evidence-plan.md) |
| Evidence source | Candidate documentation, [backend-technology-poc.md](../18_Evidence_and_PoC_Resolution/backend-technology-poc.md) |
| Acquisition method | Executing that PoC design |
| Validation method | Independent Decision Review |
| Decision dependency | None |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1 |
| Expected output | A Technology Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.5 Database Technology

| Field | Detail |
|---|---|
| Question | Which of PostgreSQL, MySQL/MariaDB, MongoDB best satisfies the six-category state model and AI-exclusion credentialing? |
| Why it matters | Blocks schema design and every data-dependent gate — CRITICAL |
| Evidence required | Per [database-decision-evidence-plan.md](database-decision-evidence-plan.md) |
| Evidence source | Candidate documentation, [database-technology-poc.md](../18_Evidence_and_PoC_Resolution/database-technology-poc.md) |
| Acquisition method | Executing that PoC design |
| Validation method | Independent Decision Review |
| Decision dependency | None |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1 |
| Expected output | A Technology Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE.** The AD-DE-001/technology-stack.md PostgreSQL status divergence is also unreconciled, restated unchanged |

### 4.6 GIS Technology

| Field | Detail |
|---|---|
| Question | Which server-side (PostGIS/GeoServer) and rendering (Leaflet/Mapbox GL JS) candidates satisfy the two-track requirement? |
| Why it matters | Blocks all spatial computation and map rendering — CRITICAL |
| Evidence required | Per [gis-decision-evidence-plan.md](gis-decision-evidence-plan.md) |
| Evidence source | Candidate documentation, [gis-technology-poc.md](../18_Evidence_and_PoC_Resolution/gis-technology-poc.md) |
| Acquisition method | Executing that PoC design on both tracks |
| Validation method | Independent Decision Review |
| Decision dependency | 4.2, 4.5 |
| Blocker severity | **CRITICAL** |
| Affected milestone | M1–M2 |
| Expected output | A GIS Decision Record reaching Selected on both tracks |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.7 AI Provider/Framework

| Field | Detail |
|---|---|
| Question | Which provider/model/framework resolves the ED-M1-vs-Blueprint divergence, and how is the data-sensitivity governance question answered? |
| Why it matters | Blocks all AI implementation — HIGH |
| Evidence required | Per [ai-provider-decision-evidence-plan.md](ai-provider-decision-evidence-plan.md) |
| Evidence source | Candidate documentation, [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) |
| Acquisition method | A data-sensitivity governance decision first, then executing the PoC design |
| Validation method | Independent Decision Review |
| Decision dependency | None directly, governance-gated |
| Blocker severity | **HIGH** |
| Affected milestone | M3 |
| Expected output | An AI Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE.** The AI provider divergence remains fully unreconciled |

### 4.8 RAG/Retrieval

| Field | Detail |
|---|---|
| Question | Which RAG framework satisfies the Claim→Evidence→Source→Timestamp→Transformation→Confidence chain? |
| Why it matters | Blocks contextual AI grounding — HIGH |
| Evidence required | Per [rag-and-retrieval-evidence-plan.md](rag-and-retrieval-evidence-plan.md) |
| Evidence source | [rag-retrieval-poc.md](../18_Evidence_and_PoC_Resolution/rag-retrieval-poc.md) |
| Acquisition method | Executing that PoC design |
| Validation method | Independent Decision Review |
| Decision dependency | 4.7 |
| Blocker severity | HIGH |
| Affected milestone | M3 |
| Expected output | An AI Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.9 Embeddings

| Field | Detail |
|---|---|
| Question | Which embedding model is used, and is it coupled to the AI provider decision? |
| Why it matters | Blocks RAG indexing — HIGH |
| Evidence required | Per [rag-and-retrieval-evidence-plan.md](rag-and-retrieval-evidence-plan.md) |
| Evidence source | No candidate exists in any repository document — restated unchanged from [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) Section 6 |
| Acquisition method | Candidate identification must occur before any PoC is possible |
| Validation method | Independent Decision Review |
| Decision dependency | 4.7 |
| Blocker severity | HIGH |
| Affected milestone | M3 |
| Expected output | A named candidate, then a Decision Record |
| **Current status** | **EVIDENCE NOT AVAILABLE — no candidate named anywhere** |

### 4.10 Vector Storage

| Field | Detail |
|---|---|
| Question | Which of pgvector, Chroma, Qdrant, Weaviate satisfies retrieval and access-control requirements? |
| Why it matters | Blocks RAG indexing — HIGH |
| Evidence required | Per [rag-and-retrieval-evidence-plan.md](rag-and-retrieval-evidence-plan.md) |
| Evidence source | [rag-retrieval-poc.md](../18_Evidence_and_PoC_Resolution/rag-retrieval-poc.md) |
| Acquisition method | Executing that PoC design |
| Validation method | Independent Decision Review |
| Decision dependency | 4.5 (pgvector coupling), 4.7 |
| Blocker severity | HIGH |
| Affected milestone | M3 |
| Expected output | A Technology Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.11 Model Serving

| Field | Detail |
|---|---|
| Question | What model-serving architecture supports the five confirmed Prediction domains? |
| Why it matters | Blocks Prediction deployment — MEDIUM |
| Evidence required | Per [model-serving-evidence-plan.md](model-serving-evidence-plan.md) |
| Evidence source | No candidate exists in any repository document |
| Acquisition method | Requires real training data (4.1) before meaningful evaluation |
| Validation method | Independent Decision Review |
| Decision dependency | 4.1, 4.4 |
| Blocker severity | MEDIUM |
| Affected milestone | M4 |
| Expected output | A named candidate, then a Decision Record |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.12 Background Jobs

| Field | Detail |
|---|---|
| Question | What background-job technology executes async Prediction/Simulation workloads? |
| Why it matters | Blocks async execution per AD-BE-004 — MEDIUM |
| Evidence required | Per [technology-decision-record-standard.md](../19_Decision_Records_and_Baseline/technology-decision-record-standard.md) |
| Evidence source | No candidate exists in any repository document |
| Acquisition method | Candidate identification, coupled to 4.4 |
| Validation method | Independent Decision Review |
| Decision dependency | 4.4 |
| Blocker severity | MEDIUM |
| Affected milestone | M4–M5 |
| Expected output | A named candidate, then a Decision Record |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.13 Observability

| Field | Detail |
|---|---|
| Question | Which of OpenTelemetry, Grafana+Prometheus, or an alternative satisfies the required trace/log/metric taxonomy? |
| Why it matters | Blocks real instrumentation — MEDIUM |
| Evidence required | Per [technology-decision-record-standard.md](../19_Decision_Records_and_Baseline/technology-decision-record-standard.md) |
| Evidence source | Candidate documentation |
| Acquisition method | A PoC exercising the correlation-ID/AI-Run-ID tracing model |
| Validation method | Independent Decision Review |
| Decision dependency | None |
| Blocker severity | MEDIUM |
| Affected milestone | M1 (staged) |
| Expected output | A Technology Decision Record reaching Selected |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.14 RPO/RTO

| Field | Detail |
|---|---|
| Question | What Recovery Point/Time Objectives are appropriate for DistrictMind's operational context? |
| Why it matters | Blocks pre-production sign-off — HIGH |
| Evidence required | Real operational requirements analysis — not derivable from documentation alone |
| Evidence source | **EXTERNAL EVIDENCE REQUIRED** — a stakeholder/governance decision on acceptable data-loss and downtime windows |
| Acquisition method | Not a technical PoC — a business/governance requirement-gathering exercise |
| Validation method | Independent Decision Review |
| Decision dependency | 4.5, infrastructure/deployment technology |
| Blocker severity | HIGH (pre-production) |
| Affected milestone | Pre-production |
| Expected output | A defined RPO/RTO value with documented rationale, per NFR-038's own "To Be Finalized During Architecture Design" framing |
| **Current status** | **EXTERNAL EVIDENCE REQUIRED — no repository evidence can resolve this; it requires a stakeholder decision outside this documentation program's scope** |

### 4.15 Healthcare Demand Forecasting Gap

| Field | Detail |
|---|---|
| Question | Is Healthcare Demand forecasting in scope for the Prediction domain, resolving the Abstract-vs-Blueprint contradiction? |
| Why it matters | Blocks that domain's M4 scope definition — HIGH (narrow scope) |
| Evidence required | A scope-clarification decision, analogous to AD-RES-001's routing resolution |
| Evidence source | The two source PDFs themselves (already fully read); no new evidence exists beyond re-examining their exact wording |
| Acquisition method | A documentation-resolution exercise (like ED-M3 Part 4), not a technical PoC |
| Validation method | Independent Decision Review |
| Decision dependency | None |
| Blocker severity | HIGH (M4-scoped only) |
| Affected milestone | M4 |
| Expected output | A Decision Record analogous to AD-RES-001, explicitly resolving or explicitly re-affirming the contradiction's unresolved status |
| **Current status** | **EVIDENCE NOT AVAILABLE — this milestone does not attempt this resolution; it remains explicitly preserved as unresolved** |

### 4.16 Recommendation Engine Scoring Gap

| Field | Detail |
|---|---|
| Question | What weighted-scoring technique implementation approach is used, and what are its calibrated weights? |
| Why it matters | Blocks M6 Recommendation implementation — HIGH |
| Evidence required | A technique decision, plus real outcome data for weight calibration |
| Evidence source | Technique decision — documentation-resolution exercise; weight calibration — requires real data (4.1) |
| Acquisition method | Technique decision first; calibration only after real data exists |
| Validation method | Independent Decision Review |
| Decision dependency | 4.1 (for calibration) |
| Blocker severity | HIGH (M6-scoped) |
| Affected milestone | M6 |
| Expected output | A Decision Record for the technique; a separate future calibration record |
| **Current status** | **EVIDENCE NOT AVAILABLE** |

### 4.17 Dataset Deprecation

| Field | Detail |
|---|---|
| Question | Does the designed deprecation framework ([data-baseline-management.md](../19_Decision_Records_and_Baseline/data-baseline-management.md) Section 5) function correctly when exercised? |
| Why it matters | Non-blocking today — LOW |
| Evidence required | A real deprecation event to exercise the framework against |
| Evidence source | Not available until a real, accepted data source (4.1) is later deprecated |
| Acquisition method | Not applicable until 4.1 resolves and a subsequent deprecation event occurs |
| Validation method | Independent review once exercised |
| Decision dependency | 4.1 |
| Blocker severity | LOW |
| Affected milestone | Not milestone-specific |
| Expected output | An exercised-and-validated framework, once applicable |
| **Current status** | **EVIDENCE NOT AVAILABLE — not yet applicable** |

### 4.18 Source Precedence Calibration

| Field | Detail |
|---|---|
| Question | What precedence rule applies when two accepted sources for the same domain disagree? |
| Why it matters | Non-blocking until real conflicting sources exist — MEDIUM |
| Evidence required | At least two qualified sources with an observed history of disagreement, per [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 5 |
| Evidence source | Requires 4.1 to first resolve for at least one domain with multiple candidate sources |
| Acquisition method | Not applicable until 4.1 resolves with multiple sources per domain |
| Validation method | Data Steward review per [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 8 |
| Decision dependency | 4.1 |
| Blocker severity | MEDIUM |
| Affected milestone | M2 |
| Expected output | A calibrated precedence rule, once evidence exists |
| **Current status** | **EVIDENCE NOT AVAILABLE — not yet applicable** |

## 5. Summary Table

| # | Item | Status | Severity |
|---|---|---|---|
| 4.1 | Real data source | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.2 | Boundary dataset | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.3 | Frontend technology | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.4 | Backend technology | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.5 | Database technology | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.6 | GIS technology | EVIDENCE NOT AVAILABLE | CRITICAL |
| 4.7 | AI provider/framework | EVIDENCE NOT AVAILABLE | HIGH |
| 4.8 | RAG/retrieval | EVIDENCE NOT AVAILABLE | HIGH |
| 4.9 | Embeddings | EVIDENCE NOT AVAILABLE | HIGH |
| 4.10 | Vector storage | EVIDENCE NOT AVAILABLE | HIGH |
| 4.11 | Model serving | EVIDENCE NOT AVAILABLE | MEDIUM |
| 4.12 | Background jobs | EVIDENCE NOT AVAILABLE | MEDIUM |
| 4.13 | Observability | EVIDENCE NOT AVAILABLE | MEDIUM |
| 4.14 | RPO/RTO | EXTERNAL EVIDENCE REQUIRED | HIGH |
| 4.15 | Healthcare Demand gap | EVIDENCE NOT AVAILABLE | HIGH (scoped) |
| 4.16 | Recommendation scoring gap | EVIDENCE NOT AVAILABLE | HIGH (scoped) |
| 4.17 | Dataset deprecation | EVIDENCE NOT AVAILABLE (not yet applicable) | LOW |
| 4.18 | Source precedence | EVIDENCE NOT AVAILABLE (not yet applicable) | MEDIUM |

**Not one of the 18 items has actual, acquired, validated evidence as of this milestone.**

## 6. Security

Every item's Evidence Required field explicitly traces to a security dimension where applicable (AI-exclusion, GIS server-side authority, least-privilege credentialing), restated unchanged from [decision-evidence-requirements.md](../19_Decision_Records_and_Baseline/decision-evidence-requirements.md) Section 4.

## 7. Observability

Every item's status, once genuinely updated, is recorded per [evidence-record-management.md](evidence-record-management.md).

## 8. Milestone Traceability

Restated per-item above.

## 9. Open Decisions

All 18 items remain open. No evidence is acquired, no PoC is executed, and no decision is closed by this document.
