---
Document Name: AI Technology Evaluation
Document ID: ED-DTR-AIEVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI Technology Evaluation

## 1. Purpose

This document defines the evaluation framework for AI provider, model, agent orchestration, and related technologies. **No provider or model is selected.** The AI provider divergence (ED-M1's Candidate list vs. the Blueprint's local Llama 3/Ollama proposal) is preserved unresolved, restated unchanged from every prior milestone.

## 2. Existing Candidates — Status Restated Unchanged

| Technology | Category | Status | Source |
|---|---|---|---|
| Claude (Anthropic) | Hosted LLM provider | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.5 |
| Open-weight LLMs (self-hosted) | Alternative for data-sensitive deployment | To Be Evaluated | Same |
| Other hosted LLM providers | Alternative grounded assistant backend | To Be Evaluated | Same |
| LangGraph | Agent orchestration framework | Candidate | [ai-ml-architecture.md](../07_AI_GIS_and_Intelligence/ai-ml-architecture.md) Section 10 |

No status above is changed by this document. **This document does not name, select, or newly discuss OpenAI, Gemini, Ollama, or Llama beyond what the Blueprint itself already establishes as a proposal (restated below, Section 3) — these are not introduced as new candidates here.**

## 3. The AI Provider Divergence — Preserved Unresolved

| Source | Position |
|---|---|
| ED-M1 ([technology-stack.md](../00_Engineering_Overview/technology-stack.md)) | Candidate list centered on hosted providers, primarily Claude (Anthropic), with open-weight/self-hosted and other hosted providers marked To Be Evaluated |
| Original Blueprint | Proposes a specific local-first approach (Llama 3 via Ollama) for data-sensitivity reasons |

**This divergence is a genuine, unreconciled contradiction between two source documents — not merely an unmade decision.** Restated unchanged from [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 3 and [milestone-readiness-matrix.md](../16_Engineering_Readiness_and_Baseline/milestone-readiness-matrix.md) Section 5's UNRESOLVED (not merely NOT READY) rating. This document's evaluation framework (Sections 5–13) applies identically regardless of which side of this divergence is eventually chosen, or whether a third option emerges.

## 4. Why This Divergence Is Tied to a Data-Sensitivity Constraint

Restated unchanged from [implementation-readiness.md](../11_Architecture_Resolution/implementation-readiness.md) Section 2 (AI row): the hosted-vs-local-first choice has real governance implications given DistrictMind's district/government-adjacent data context ([constraints.md](../01_Requirements/constraints.md)). **This document does not resolve that governance question.** Any future evaluation of a specific provider must first have this constraint clarified, since it directly gates which candidates are even eligible.

## 5. Evaluation Dimensions

| Dimension | Requirement Source |
|---|---|
| LLM provider | Section 3's divergence; [ai-implementation-architecture.md](../13_AI_Intelligence_Implementation/ai-implementation-architecture.md) |
| LLM model | Downstream of provider selection |
| Agent orchestration | [agent-implementation-architecture.md](../13_AI_Intelligence_Implementation/agent-implementation-architecture.md) |
| Typed tool architecture | [typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md) — fixed, 16-tool contract, restated unchanged |
| Model execution | [prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md), [model-lifecycle-implementation.md](../13_AI_Intelligence_Implementation/model-lifecycle-implementation.md) |
| AI safety | [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) |
| Grounding | [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) |
| Evidence | Same |
| Uncertainty | AD-AI-003 — no fabricated numeric confidence |
| Evaluation | [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) |
| Latency | [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 22 — qualitative only, no numeric target |
| Reliability | [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 14 (fail-safe behavior) |
| Cost | Not yet documented in any prior milestone — a genuine evaluation gap |
| Privacy | The data-sensitivity constraint (Section 4) |
| Deployment | [deployment-architecture.md](../15_Deployment_Infrastructure_Operations/deployment-architecture.md) Section 10 |
| Local vs. hosted execution | Section 3's divergence itself |

## 6. Evaluation Matrix — Provider-Level

| Dimension | Claude (Anthropic) | Open-weight (self-hosted, e.g., Llama-class per Blueprint) | Other hosted providers |
|---|---|---|---|
| Grounding quality | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Tool-use/agentic support (needed for Typed Tool dispatch) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Safety behavior | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Data residency / privacy fit | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Hosting cost/complexity | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Government-deployment suitability | To Be Evaluated | To Be Evaluated | To Be Evaluated |

**Every cell reads "To Be Evaluated."**

## 7. Agent Orchestration Evaluation

| Dimension | LangGraph |
|---|---|
| Fit with minimum-sufficient tool-call planning (AD-AI-004) | To Be Evaluated |
| Fit with multi-step Example C workflow | To Be Evaluated |
| Maximum-step/loop-prevention support ([agent-implementation-architecture.md](../13_AI_Intelligence_Implementation/agent-implementation-architecture.md) Section 17) | To Be Evaluated |
| Provider independence (does the framework lock in a specific LLM provider?) | To Be Evaluated — directly relevant given Section 3's unresolved provider divergence |

## 8. Typed Tool Architecture — Not a Technology Decision

The 16-tool Typed Tool contract ([ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md)) is already fully specified and does not depend on which LLM provider or agent framework is eventually chosen — this is restated here as a **non-blocking** dimension: whatever provider/framework combination is selected must implement this existing contract, not redesign it.

## 9. Local vs. Hosted Execution — Trade-off Dimensions

| Consideration | Hosted (e.g., Claude) | Local/Self-Hosted (e.g., Llama-class) |
|---|---|---|
| Data residency | Data leaves DistrictMind's own infrastructure | Data remains within DistrictMind's own infrastructure |
| Operational complexity | Lower — no model-serving infrastructure to operate | Higher — requires model-serving technology (Item 11, [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md)) |
| Capability ceiling | Generally higher for current-generation hosted models | Depends on the specific open-weight model chosen |
| Cost model | Per-request/token cost | Infrastructure/hosting cost |

**Neither side of this trade-off is favored by this document** — Section 4's governance question must be answered first.

## 10. AI Safety, Grounding, Evidence, Uncertainty — Provider-Independent Requirements

Restated unchanged from `13_AI_Intelligence_Implementation/`: regardless of which provider is eventually selected, it must support: response validation against Evidence before finalization, correct disclosure of ungroundable claims (NFR-031), and no fabrication of numeric confidence not produced by a validated model (AD-AI-003). A provider unable to support disciplined tool-call-then-validate behavior would fail this evaluation regardless of raw capability.

## 11. Cost — Documented Gap

**No prior milestone has established a cost evaluation framework for AI provider selection.** This is recorded as a genuine gap this document does not fill, since doing so would require inventing a budget or cost threshold not established by any source document.

## 12. Security

AI technology evaluation includes whether the candidate provider/framework can be integrated without weakening the AI≠direct-database-access boundary (AD-DE-005/AD-DB-006/AD-API-002) — restated unchanged; this is a non-negotiable filter, not a weighted criterion a provider could "win" on strength elsewhere.

## 13. Observability

AI technology evaluation includes whether the candidate supports the correlation-ID/AI-Run-ID tracing model already architected ([ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 18) without requiring bespoke integration work.

## 14. Milestone Traceability

| AI Decision | First Needed |
|---|---|
| LLM provider/model, agent framework | M3 |

## 15. Open Decisions

**The AI provider/framework divergence remains fully preserved and unresolved.** No provider, model, or framework is selected by this document. Claude (Anthropic) and LangGraph remain exactly as Candidate; open-weight/self-hosted and other hosted providers remain To Be Evaluated, per [technology-stack.md](../00_Engineering_Overview/technology-stack.md) and [ai-ml-architecture.md](../07_AI_GIS_and_Intelligence/ai-ml-architecture.md).
