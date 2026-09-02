---
Document Name: Technology Baseline Management
Document ID: ED-DRB-TECHBASE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Technology Baseline Management

## 1. Purpose

This document defines how DistrictMind's eventual technology baseline will be maintained once decisions are made, elaborating [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and [technology-stack.md](../00_Engineering_Overview/technology-stack.md) with an ongoing change-management structure. **No technology is selected by this document.**

## 2. Category-by-Category Baseline Structure

| Category | Candidate State (Current) | Governing Evaluation Document |
|---|---|---|
| Frontend | React (Proposed), Next.js/Vue.js (Candidate), TypeScript (Proposed) | [frontend-technology-evaluation.md](../17_Data_and_Technology_Resolution/frontend-technology-evaluation.md) |
| Backend | FastAPI, Node.js (Express/NestJS), Django (all Candidate) | [backend-technology-evaluation.md](../17_Data_and_Technology_Resolution/backend-technology-evaluation.md) |
| Database | PostgreSQL, MySQL/MariaDB (Candidate); MongoDB (To Be Evaluated) | [database-technology-evaluation.md](../17_Data_and_Technology_Resolution/database-technology-evaluation.md) |
| GIS | PostGIS, Leaflet, Mapbox GL JS (Candidate); GeoServer (To Be Evaluated) | [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md) |
| AI | Claude/Anthropic, LangGraph (Candidate); open-weight/other hosted (To Be Evaluated) | [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) |
| RAG | Not yet identified as a distinct decision beyond embedding/vector below | [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) |
| Embeddings | No candidate named in any prior documentation | Same, Section 6 |
| Vector storage | pgvector, Chroma (Candidate); Qdrant/Weaviate (To Be Evaluated) | Same, Section 2 |
| ML | scikit-learn, Prophet/statsmodels (Candidate); PyTorch/TensorFlow (To Be Evaluated) | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.7 |
| Model serving | No candidate named in any prior documentation | [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 11 |
| Background jobs | No candidate named in any prior documentation | Same, Item 12 |
| Observability | OpenTelemetry (Candidate); Grafana+Prometheus (To Be Evaluated); structured logging (Proposed) | [infrastructure-technology-evaluation.md](../17_Data_and_Technology_Resolution/infrastructure-technology-evaluation.md) |
| Infrastructure | Docker (Proposed); Kubernetes, cloud provider (To Be Evaluated) | Same |
| Deployment | GitHub Actions (Candidate) | Same |

## 3. Per-Category Lifecycle

```mermaid
flowchart LR
    CandState[Candidate State] --> Eval[Evaluation]
    Eval --> Dec[Decision]
    Dec --> Entry[Baseline Entry]
    Entry --> Change[Change Control]
```

| Stage | Detail |
|---|---|
| Candidate state | The category's current status per Section 2 — restated unchanged, not advanced by this document |
| Evaluation | Applied per the relevant document in Section 2's third column, following [decision-management-framework.md](decision-management-framework.md) |
| Decision | A formal record per [technology-decision-record-standard.md](technology-decision-record-standard.md), [gis-decision-record-standard.md](gis-decision-record-standard.md), or [ai-decision-record-standard.md](ai-decision-record-standard.md) as applicable |
| Baseline entry | Once Proposed/Selected, the decision is added to [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and this category's row in Section 2 is updated to reflect the new state |

## 4. Change Control

Once a category reaches a baselined decision (Selected or beyond), any proposal to change it follows [change-impact-assessment.md](change-impact-assessment.md) before being accepted — a baselined technology choice is not casually revisited without an explicit impact evaluation, since downstream code, tests, and documentation may already depend on it.

## 5. Compatibility Impact

Every category in Section 2 has explicit compatibility couplings to other categories (e.g., Vector storage → Database; RAG framework → AI provider; GIS rendering → Frontend framework) — restated unchanged from [technology-decision-record-standard.md](technology-decision-record-standard.md) Section 7. A change to one baselined category triggers a re-assessment of every coupled category's own baseline entry.

## 6. Rollback/Replacement Considerations

| Consideration | Detail |
|---|---|
| Rollback | If a baselined technology is later found unsuitable (e.g., a PoC conducted post-baseline surfaces a previously undetected issue), the decision is Reconsidered per [decision-supersession-and-history.md](decision-supersession-and-history.md) Section 9 — never silently reverted without a recorded reason |
| Replacement | A baselined technology's replacement follows the full lifecycle in Section 3 for the new candidate, with the old decision marked Superseded (Section 3, [decision-supersession-and-history.md](decision-supersession-and-history.md)), never simply deleted |
| Migration cost | Any replacement of an already-implemented (not merely baselined) technology carries real migration cost — restated consistent with [deployment-strategy.md](../15_Deployment_Infrastructure_Operations/deployment-strategy.md) Sections 6–9's schema/model/RAG-index compatibility discipline |

## 7. No Technology Selected

**This document selects no technology for any of the 14 categories in Section 2.** It defines the ongoing management structure a future, actually-executed decision process would populate and maintain.

## 8. Security

Every category's Decision stage (Section 3) requires Security evidence per [decision-evidence-requirements.md](decision-evidence-requirements.md) Section 4 before reaching Baseline entry.

## 9. Observability

Section 2's table is intended to be kept current as an at-a-glance status view — restated consistent with [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)'s own per-group status tables.

## 10. Milestone Traceability

| Category | First Needed |
|---|---|
| Frontend, Backend, Database, GIS | M1 |
| AI, RAG, Embeddings, Vector storage | M3 |
| ML, Model serving | M4 |
| Background jobs | M4–M5 |
| Observability, Infrastructure, Deployment | M1 (staged) |

## 11. Open Decisions

No technology is selected for any category. Every status in Section 2 remains exactly as recorded in [technology-stack.md](../00_Engineering_Overview/technology-stack.md) and the ED-M5 Part 1 evaluation documents.
