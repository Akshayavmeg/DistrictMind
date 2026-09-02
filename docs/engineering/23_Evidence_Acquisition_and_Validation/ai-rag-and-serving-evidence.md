---
Document Name: AI, RAG, and Serving Evidence
Document ID: ED-EAV-AITECH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI, RAG, and Serving Evidence

## 1. Purpose

This document records technology evidence for AI provider/model/framework, RAG/retrieval, embeddings, vector storage, model serving, background jobs, and observability, incorporating real, current (2026) web verification alongside existing candidates from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) and [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md). **No provider, model, or framework is selected or confirmed. The AI-provider divergence is preserved.**

## 2. AI Provider/Model/Framework

| Candidate | Status | Source |
|---|---|---|
| Claude (Anthropic) | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) |
| Open-weight LLMs (self-hosted) | To Be Evaluated | Same |
| Other hosted LLM providers | To Be Evaluated | Same |
| LangGraph | Candidate | [ai-ml-architecture.md](../07_AI_GIS_and_Intelligence/ai-ml-architecture.md) |

### EV-M6-P2-036 — Claude Agent SDK and LangGraph Ecosystem Currency (2026)

| Field | Detail |
|---|---|
| Question | Do Claude/Anthropic and LangGraph remain active, current, viable agent-orchestration options as of this session? |
| Source | Multiple 2026-dated technical comparison articles (industry blogs, not primary vendor documentation) |
| Resource | Various — e.g., "Claude vs LangGraph: Which Agent Wins in 2026," "AI Agent Frameworks (2026 Update)" |
| Acquisition | WebSearch |
| Observation | Confirms both remain active in 2026, and identifies a now-current architectural pattern not previously documented in DistrictMind's own records: **"Claude Agent SDK"** — described as Anthropic's own tool-use-first agent framework (JSON-schema tool definitions, an explicit agent loop, native MCP protocol support, hierarchical sub-agents). Industry sources describe a common 2026 hybrid pattern of using **LangGraph as the top-level state orchestrator** with **Claude Agent SDK sub-agents embedded in individual graph nodes** for specialized reasoning |
| Validation | Search-result-level only; these are third-party comparison articles, not primary Anthropic/LangGraph documentation, and are not DistrictMind-specific |
| Result | This is **new information not previously present in any DistrictMind document**: "Claude Agent SDK" as a distinct, more current framework than the general Claude API was not named in [technology-stack.md](../00_Engineering_Overview/technology-stack.md) or [ai-ml-architecture.md](../07_AI_GIS_and_Intelligence/ai-ml-architecture.md), both of which reference LangGraph and Claude/Anthropic generically. This is recorded here as a new candidate data point, **not** retroactively inserted into prior milestone documents |
| Limitations | This is industry commentary, not a DistrictMind PoC; whether Claude Agent SDK's MCP-native architecture is compatible with DistrictMind's own fixed 16-tool Typed Tool contract (as opposed to MCP's own protocol) is entirely unverified |
| **Status** | **EVIDENCE PARTIALLY AVAILABLE** (currency confirmed; DistrictMind-specific compatibility unverified) |
| Decision impact | No closure. This finding should be carried into a future AI-provider evidence-acquisition pass as an additional data point — it does not itself resolve the AI-provider divergence, and this document explicitly does not add "Claude Agent SDK" as a new formal candidate in [technology-stack.md](../00_Engineering_Overview/technology-stack.md) or any decision register, since doing so would require the full decision-record process ([ai-decision-record-standard.md](../19_Decision_Records_and_Baseline/ai-decision-record-standard.md)), not a passing mention in an evidence file |

## 3. The AI Provider Divergence — Preserved, Not Resolved

**Restated unchanged from every prior milestone:** ED-M1's Candidate list (Claude/Anthropic-centered) versus the Blueprint's local-first Llama 3/Ollama proposal remains fully unreconciled. Section 2's finding (Claude Agent SDK's 2026 currency) is evidence about the *hosted* side of this divergence only — it says nothing about the *local-first* side's current viability, since no research was directed at open-weight/self-hosted model currency in this session. **This divergence is not resolved, and the underlying data-sensitivity governance question ([ai-provider-decision-evidence-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/ai-provider-decision-evidence-plan.md) Section 5) remains EXTERNAL EVIDENCE REQUIRED.**

## 4. RAG/Retrieval, Embeddings, Vector Storage

| Category | Candidate | Status | New Evidence This Session |
|---|---|---|---|
| Vector storage | pgvector | Candidate | Confirmed current (EV-M6-P2-035, [database-and-gis-technology-evidence.md](database-and-gis-technology-evidence.md)) |
| Vector storage | Chroma | Candidate | None |
| Vector storage | Qdrant/Weaviate | To Be Evaluated | None |
| Embedding model | — | No candidate named | **Still no candidate identified** — this session's research did not locate a specific embedding-model candidate, consistent with the gap already recorded in [rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) Section 6 |
| RAG framework | — | No dedicated candidate | No new evidence |

## 5. Model Serving

**No new evidence was acquired for model-serving technology in this session.** Restated unchanged from [model-serving-evidence-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/model-serving-evidence-plan.md): no candidate is named, and real training data (the CRITICAL data-source blocker) would be required before model-serving evaluation could meaningfully proceed regardless.

## 6. Background Jobs

**No new evidence was acquired for background-job technology in this session.** No candidate is named in any prior documentation.

## 7. Observability

**No new evidence was acquired for observability technology in this session.** OpenTelemetry (Candidate) and Grafana+Prometheus (To Be Evaluated) remain unchanged from [technology-stack.md](../00_Engineering_Overview/technology-stack.md).

## 8. Strengths, Weaknesses, Architectural Compatibility

| Category | Strengths | Weaknesses/Unresolved |
|---|---|---|
| AI provider/framework | Ecosystem currency confirmed for the hosted-Claude/LangGraph side | Divergence unreconciled; governance question unresolved; no PoC executed; AI-exclusion gate (AD-DE-005) unverified for any candidate |
| Vector storage | pgvector's currency and PostgreSQL-native integration confirmed | Coupled to an unresolved database decision |
| Embeddings | None — no candidate exists | Deepest gap in this category |
| Model serving, background jobs, observability | None new this session | Unchanged from prior milestones |

Every candidate remains architecturally compatible with AD-DE-005/AD-DB-006/AD-API-002 (AI-exclusion) and AD-AI-003/004 (no fabricated confidence, minimum-sufficient planning) at the documentation level — none has been PoC-verified.

## 9. Evidence Status

**EVIDENCE PARTIALLY AVAILABLE** for AI provider/framework and vector storage (currency confirmed, DistrictMind-specific compatibility unverified); **EVIDENCE NOT AVAILABLE** for embeddings, RAG framework, model serving, background jobs, and observability (no new evidence acquired).

## 10. Only Technologies Actually Validated Through the Evidence Process Progress

**Restated per this milestone's explicit instruction:** the Section 2 finding about Claude Agent SDK's 2026 currency is evidence, not validation — it has not passed through PoC, Decision Review, or Decision (per [decision-closure-workflow.md](../22_Evidence_Acquisition_and_Decision_Closure/decision-closure-workflow.md)), and therefore does not progress toward decision closure on its own.

## 11. Security

The AI-exclusion non-negotiable gate remains the central unresolved security concern for every AI-category candidate — restated unchanged.

## 12. Observability

No new observability-technology finding, ironically, in the Observability category itself.

## 13. Milestone Traceability

| Item | First Needed |
|---|---|
| AI provider/framework, RAG, embeddings, vector storage | M3 |
| Model serving | M4 |
| Background jobs | M4–M5 |
| Observability | M1 (staged) |

## 14. Open Decisions

No AI provider, model, framework, RAG technology, embedding model, vector storage, model-serving technology, background-job technology, or observability platform is selected or confirmed. The AI-provider divergence remains fully unresolved. All remain HIGH/MEDIUM-severity blockers per [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Rows 8–10.
