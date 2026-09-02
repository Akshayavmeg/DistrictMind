---
Document Name: Unresolved Items Baseline
Document ID: ED-ERB-UNRESOLVED-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Unresolved Items Baseline

## 1. Purpose

This is the master unresolved-items register for DistrictMind, consolidating every open item named across ED-M1 through ED-M4 Part 4. **No item below is answered by this document.**

## 2. The Register

### Item 1 — Real Data Sources

| Field | Detail |
|---|---|
| Issue | No domain (Geography, Healthcare, Transportation, Weather, Disaster, Agriculture, Infrastructure) has a confirmed, accessible real data source |
| Why unresolved | Requires external negotiation/access with government or third-party data holders — outside this program's scope |
| Affected area | Data, GIS, all of M1–M6 |
| Dependency | Blocks Item 2 in part; blocks any real ingestion |
| Consequence | Every pipeline, feature, and downstream layer remains untestable against real data |
| Resolution needed | Identification and access confirmation for at least one domain, ideally the Warangal pilot's core domains |
| Milestone impact | Blocks M1 vertical slice entirely |

### Item 2 — 33-District Boundary Dataset

| Field | Detail |
|---|---|
| Issue | No confirmed Telangana district/mandal boundary geometry source |
| Why unresolved | Same as Item 1, specifically for spatial reference data |
| Affected area | GIS, M1 specifically |
| Dependency | Blocks the very first renderable map |
| Consequence | No GIS test fixture beyond synthetic/illustrative geometry can be created ([gis-and-spatial-testing.md](../14_Testing_Security_Observability/gis-and-spatial-testing.md) Section 22) |
| Resolution needed | A confirmed, licensable boundary dataset |
| Milestone impact | Blocks M1 |

### Item 3 — AI Provider

| Field | Detail |
|---|---|
| Issue | ED-M1's Candidate list (including Claude/Anthropic) vs. the Blueprint's specific local Llama 3/Ollama proposal — an active, unreconciled divergence |
| Why unresolved | Tied to an unresolved data-sensitivity constraint ([constraints.md](../01_Requirements/constraints.md)) — a hosted vs. local-first choice has real governance implications |
| Affected area | AI, M3–M6 |
| Dependency | Blocks Item 4–7 in effect (framework/model/embedding/vector choices often depend on provider) |
| Consequence | No AI implementation can meaningfully begin |
| Resolution needed | A data-sensitivity/governance decision, then a provider selection |
| Milestone impact | Blocks M3 |

### Item 4 — AI Framework

| Field | Detail |
|---|---|
| Issue | Agent orchestration framework (e.g., LangGraph) remains Candidate |
| Why unresolved | Depends in part on Item 3's outcome |
| Affected area | AI runtime, agent implementation |
| Dependency | Item 3 |
| Consequence | No concrete agent implementation possible |
| Resolution needed | Framework evaluation once provider direction is clearer |
| Milestone impact | M3 |

### Item 5 — LLM Model

| Field | Detail |
|---|---|
| Issue | No specific model version selected within whichever provider is eventually chosen |
| Why unresolved | Downstream of Item 3 |
| Affected area | AI runtime, evaluation |
| Dependency | Item 3 |
| Consequence | No AI evaluation baseline can be established |
| Resolution needed | Provider decision first, then model selection |
| Milestone impact | M3 |

### Item 6 — Embedding Model

| Field | Detail |
|---|---|
| Issue | No embedding model confirmed for RAG | 
| Why unresolved | Downstream of Item 3; also independently evaluable | 
| Affected area | RAG, retrieval | 
| Dependency | Item 3 (partial) | 
| Consequence | No corpus can be indexed | 
| Resolution needed | Embedding model evaluation | 
| Milestone impact | M3 |

### Item 7 — Vector Database

| Field | Detail |
|---|---|
| Issue | pgvector/Chroma/Qdrant/Weaviate all remain Candidate |
| Why unresolved | No evaluation against real corpus scale has occurred |
| Affected area | RAG, retrieval |
| Dependency | Item 6 |
| Consequence | No retrieval implementation possible |
| Resolution needed | Technology evaluation |
| Milestone impact | M3 |

### Item 8 — RAG Framework

| Field | Detail |
|---|---|
| Issue | No RAG orchestration framework confirmed |
| Why unresolved | Downstream of Items 3, 6, 7 |
| Affected area | RAG |
| Dependency | Items 3, 6, 7 |
| Consequence | No contextual retrieval implementation possible |
| Resolution needed | Framework evaluation |
| Milestone impact | M3 |

### Item 9 — Agent Framework

| Field | Detail |
|---|---|
| Issue | Duplicate framing of Item 4 — restated here per this milestone's explicit enumeration |
| Why unresolved | Same as Item 4 |
| Affected area | AI/Agent |
| Dependency | Item 3 |
| Consequence | Same as Item 4 |
| Resolution needed | Same as Item 4 |
| Milestone impact | M3 |

### Item 10 — ML Framework

| Field | Detail |
|---|---|
| Issue | No ML framework confirmed for Prediction model training |
| Why unresolved | No model architecture has been selected for any domain ([prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 18) |
| Affected area | Prediction, Model Lifecycle |
| Dependency | Item 1 (need real training data first) |
| Consequence | No model can be trained |
| Resolution needed | Framework and architecture evaluation once data exists |
| Milestone impact | M4 |

### Item 11 — Model Serving

| Field | Detail |
|---|---|
| Issue | No model-serving technology confirmed |
| Why unresolved | Downstream of Item 10 |
| Affected area | Prediction |
| Dependency | Item 10 |
| Consequence | No prediction deployment possible |
| Resolution needed | Serving technology evaluation |
| Milestone impact | M4 |

### Item 12 — Background Jobs

| Field | Detail |
|---|---|
| Issue | Job queue technology remains To Be Evaluated |
| Why unresolved | No infrastructure/backend technology confirmed yet to evaluate against |
| Affected area | Prediction, Simulation, ingestion |
| Dependency | Items 14–15 (backend/infra) |
| Consequence | No async workload execution possible |
| Resolution needed | Technology evaluation once backend stack is chosen |
| Milestone impact | M4 |

### Item 13 — Frontend Technology

| Field | Detail |
|---|---|
| Issue | No frontend framework confirmed |
| Why unresolved | No evaluation against real requirements has been finalized |
| Affected area | Frontend, all UI work |
| Dependency | None (independently resolvable) |
| Consequence | Blocks any UI implementation |
| Resolution needed | Framework selection |
| Milestone impact | Blocks M1 |

### Item 14 — Backend Technology

| Field | Detail |
|---|---|
| Issue | No backend framework confirmed |
| Why unresolved | Same reasoning |
| Affected area | Backend, API |
| Dependency | None (independently resolvable) |
| Consequence | Blocks any backend implementation |
| Resolution needed | Framework selection |
| Milestone impact | Blocks M1 |

### Item 15 — Database Technology

| Field | Detail |
|---|---|
| Issue | PostgreSQL/PostGIS remain Candidate, not Confirmed |
| Why unresolved | No formal confirmation decision has been made ([data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 33) |
| Affected area | Database, GIS |
| Dependency | None (independently resolvable) |
| Consequence | Blocks physical schema design |
| Resolution needed | Formal confirmation |
| Milestone impact | Blocks M1 |

### Item 16 — GIS Technology

| Field | Detail |
|---|---|
| Issue | GIS library/spatial extension remains Candidate |
| Why unresolved | Downstream of Item 15 |
| Affected area | GIS |
| Dependency | Item 15 |
| Consequence | Blocks spatial computation implementation |
| Resolution needed | Selection once database is confirmed |
| Milestone impact | Blocks M1–M2 |

### Item 17 — Authentication Provider

| Field | Detail |
|---|---|
| Issue | No authentication provider confirmed |
| Why unresolved | No evaluation finalized |
| Affected area | Security, all user-facing functionality |
| Dependency | None (independently resolvable) |
| Consequence | Blocks login/session capability |
| Resolution needed | Provider selection |
| Milestone impact | Blocks M1 |

### Item 18 — Authorization Provider

| Field | Detail |
|---|---|
| Issue | No authorization/RBAC provider or mechanism confirmed |
| Why unresolved | Same reasoning |
| Affected area | Security |
| Dependency | Item 17 (often coupled) |
| Consequence | Blocks role-scoped functionality |
| Resolution needed | Provider/mechanism selection |
| Milestone impact | Blocks M1 |

### Item 19 — Observability Platform

| Field | Detail |
|---|---|
| Issue | No logging/metrics/tracing platform confirmed |
| Why unresolved | No evaluation finalized |
| Affected area | Operations, all layers |
| Dependency | None (independently resolvable) |
| Consequence | No instrumentation possible |
| Resolution needed | Platform selection |
| Milestone impact | M1 (needed early, not fully blocking) |

### Item 20 — CI/CD

| Field | Detail |
|---|---|
| Issue | No CI/CD platform confirmed |
| Why unresolved | No evaluation finalized |
| Affected area | Deployment, quality gates |
| Dependency | Items 13–14 (frontend/backend stack) |
| Consequence | No automated build/test/deploy pipeline |
| Resolution needed | Platform selection |
| Milestone impact | M1 |

### Item 21 — Deployment Platform

| Field | Detail |
|---|---|
| Issue | No cloud/hosting provider confirmed |
| Why unresolved | [constraints.md](../01_Requirements/constraints.md) — "Constraint requires confirmation" |
| Affected area | All deployment/infrastructure |
| Dependency | None directly, but shapes Items 12, 20 |
| Consequence | No deployment of any kind possible |
| Resolution needed | Provider/hosting decision |
| Milestone impact | Blocks any production deployment |

### Item 22 — RPO

| Field | Detail |
|---|---|
| Issue | Recovery Point Objective undefined |
| Why unresolved | NFR-038 — explicitly "To Be Finalized During Architecture Design" |
| Affected area | Backup/recovery, disaster recovery |
| Dependency | Item 21 (infrastructure shapes feasible RPO) |
| Consequence | No backup strategy can be finalized |
| Resolution needed | Architecture-design-phase decision |
| Milestone impact | Pre-production requirement |

### Item 23 — RTO

| Field | Detail |
|---|---|
| Issue | Recovery Time Objective undefined |
| Why unresolved | Same as Item 22 |
| Affected area | Disaster recovery |
| Dependency | Item 21 |
| Consequence | No recovery SLA can be committed |
| Resolution needed | Same as Item 22 |
| Milestone impact | Pre-production requirement |

### Item 24 — Dataset-Deprecation Process

| Field | Detail |
|---|---|
| Issue | No documented process exists for retiring a deprecated dataset |
| Why unresolved | First identified as a gap during [data-governance-implementation.md](../12_Data_GIS_Implementation/data-governance-implementation.md) Section 10 review; never subsequently addressed |
| Affected area | Data governance |
| Dependency | None |
| Consequence | Minor — a documentation-completeness gap, not a functional blocker |
| Resolution needed | A future governance-process document |
| Milestone impact | Non-blocking |

### Item 25 — Source-Precedence Calibration

| Field | Detail |
|---|---|
| Issue | The fragmentation-resolution precedence rule (AD-DATA-001) is architecturally designed but not calibrated against real conflicting sources |
| Why unresolved | No real conflicting source data exists yet (Item 1) |
| Affected area | Data quality, fragmentation resolution |
| Dependency | Item 1 |
| Consequence | Precedence rules remain theoretical until exercised |
| Resolution needed | Real data with genuine conflicts to calibrate against |
| Milestone impact | M2 |

### Item 26 — Healthcare Demand Forecasting Contradiction

| Field | Detail |
|---|---|
| Issue | The Abstract references Healthcare Demand as a forecast target; the Blueprint's explicit five-model list (Flood, Rainfall, Population Growth, Traffic, Crop) does not clearly include it |
| Why unresolved | A genuine source contradiction, never adjudicated — restated unresolved through every milestone since [prediction-architecture.md](../07_AI_GIS_and_Intelligence/prediction-architecture.md) Section 4.6 |
| Affected area | Prediction scope |
| Dependency | None technical — requires a scope decision |
| Consequence | Healthcare Demand has no pipeline, feature set, or model design |
| Resolution needed | A scope-clarification decision, analogous to AD-RES-001's routing resolution |
| Milestone impact | M4 scope definition |

### Item 27 — Recommendation Engine Weighted-Scoring Gap

| Field | Detail |
|---|---|
| Issue | AD-AI-005 makes the weighted-sum formula documented/inspectable, but no technology-stack entry exists for the scoring/weighting *technique* itself (fixed weighted sum vs. configurable rules engine vs. learned ranking model), and weights (w1–w4) are uncalibrated |
| Why unresolved | Never resolved since first identified in this milestone's originating brief (ED-M4 Part 2) |
| Affected area | Recommendation Engine |
| Dependency | Item 1 (weight calibration needs real outcome data) |
| Consequence | No Recommendation implementation can proceed |
| Resolution needed | A technique decision plus real-data-driven weight calibration |
| Milestone impact | M6 |

## 3. Security

None of these unresolved items is treated as a justification to weaken any documented security boundary — restated unchanged from [security-and-trust-boundary-matrix.md](security-and-trust-boundary-matrix.md).

## 4. Observability

Every item's resolution, once it occurs, should be recorded as a new or updated Architecture Decision per [decision-register-baseline.md](decision-register-baseline.md)'s discipline, not silently folded into code.

## 5. Milestone Traceability

Restated per-item in Section 2's "Milestone impact" field.

## 6. Open Decisions

**All 27 items above remain open.** This document answers none of them — it is a register, not a resolution.
