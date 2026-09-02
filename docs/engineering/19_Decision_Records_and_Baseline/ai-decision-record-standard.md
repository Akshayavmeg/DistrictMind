---
Document Name: AI Decision Record Standard
Document ID: ED-DRB-AISTD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI Decision Record Standard

## 1. Purpose

This document defines decision records for LLM provider, model, agent framework, RAG framework, embedding model, vector technology, and AI runtime decisions, specializing [architecture-decision-record-standard.md](architecture-decision-record-standard.md) for the domain covered by [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) and [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md). **No provider or model is selected. The AI provider divergence is fully preserved.**

## 2. The Seven Record Categories

| Category | Governing Evaluation Document |
|---|---|
| LLM provider | [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Sections 3, 6 |
| LLM model | Same, Section 5 |
| Agent framework | Same, Section 7 |
| RAG framework | [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) |
| Embedding model | Same, Section 6 |
| Vector technology | Same, Section 2 |
| AI runtime | [ai-implementation-architecture.md](../13_AI_Intelligence_Implementation/ai-implementation-architecture.md) |

## 3. The Standard Structure

| Field | Detail |
|---|---|
| Category | One of the seven in Section 2 |
| Candidate | The exact provider/model/framework and version under decision |
| Grounding | Findings on whether the candidate supports response validation against Evidence before finalization ([ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 9) |
| Evidence | Per [decision-evidence-requirements.md](decision-evidence-requirements.md) |
| Tool use | Findings on whether the candidate correctly supports the existing 16-tool Typed Tool contract without requiring its redesign |
| Authorization | Findings on whether every candidate-originated tool call is independently enforced server-side, regardless of the candidate's own internal reasoning |
| Safety | Findings against [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md)'s requirements (hallucination prevention, prompt injection resistance) |
| Uncertainty | Findings on whether the candidate communicates only genuinely produced confidence values (AD-AI-003), never fabricated ones |
| Privacy | Findings against the data-sensitivity governance question ([ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 4) |
| Reliability | Findings on fail-safe behavior under induced failure |
| Latency | Qualitative findings only — no invented number, per [performance-and-reliability-validation.md](../18_Evidence_and_PoC_Resolution/performance-and-reliability-validation.md) |
| Cost concept | Qualitative only — no invented dollar figure, restated unchanged from [technology-decision-record-standard.md](technology-decision-record-standard.md) Section 4 |
| Deployment model | Hosted vs. local/self-hosted, restated from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 9's trade-off table |
| Failure behavior | Findings on whether the candidate discloses gaps honestly rather than fabricating substitutes ([ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 14) |
| Decision | The proposed outcome, per [technology-decision-record-standard.md](technology-decision-record-standard.md) Section 2's Status vocabulary |

## 4. AI ≠ Direct Database Access — Preserved as a Non-Negotiable Record Gate

**No AI decision record — for any of the seven categories in Section 2 — may reach a favorable Decision while the candidate requires or encourages any path to direct database, GIS-database, unrestricted filesystem, arbitrary shell, or unrestricted external API access.** Restated unchanged from AD-DE-005/AD-DB-006/AD-API-002 and [ai-implementation-architecture.md](../13_AI_Intelligence_Implementation/ai-implementation-architecture.md) Section 3. This is verified via the Authorization field (Section 3) and treated as an automatic disqualifier, not a weighted criterion, consistent with [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) Section 5's identical PoC gate.

## 5. The AI Provider Divergence — Explicitly Preserved

**This record standard does not resolve, and must never be used to silently resolve, the AI provider divergence** (ED-M1's Candidate list vs. the Blueprint's local Llama 3/Ollama proposal, restated unchanged from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 3). A future LLM provider record must explicitly address which side of this divergence it represents, and the data-sensitivity governance question (Section 3's Privacy field) must be answered *before* any such record can reach a favorable Decision — restated unchanged from that document's Section 4.

## 6. Coupling Between Categories

An Embedding model decision is naturally coupled to the LLM provider decision (some providers bundle embedding models, per [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) Section 6), and a Vector technology decision is naturally coupled to the primary database decision (pgvector specifically). Every record's evidence must note these couplings explicitly, consistent with [technology-decision-record-standard.md](technology-decision-record-standard.md) Section 7.

## 7. No Provider, Model, or Framework Selected

**This document selects no LLM provider, model, agent framework, RAG framework, embedding model, or vector technology.** It defines the record structure a future, actually-executed AI decision process would populate, for whichever candidate is eventually evaluated.

## 8. Security

Section 4 is this record standard's central, non-negotiable gate — restated unchanged from every prior milestone's identical rule regarding the AI/database boundary.

## 9. Observability

Every completed record feeds [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md).

## 10. Milestone Traceability

| Category | First Needed |
|---|---|
| LLM provider, model, agent framework, AI runtime | M3 |
| RAG framework, embedding model, vector technology | M3 |

## 11. Open Decisions

None introduced — this document defines a record template; no AI technology has an actual completed record as a result of this milestone. The AI provider/framework divergence remains fully unresolved.
