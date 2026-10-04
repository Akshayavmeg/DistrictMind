---
Document Name: AI Provider Decision Evidence Plan
Document ID: ED-EADC-AIEVID-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI Provider Decision Evidence Plan

## 1. Purpose

This document defines the evidence required to resolve the AI provider/model/framework decision, elaborating [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) and [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) into an acquisition-focused plan. **No provider, model, or framework is selected. The AI-provider divergence is explicitly preserved.**

## 2. The AI Provider Divergence — Preserved Unresolved

| Source | Position |
|---|---|
| ED-M1 ([technology-stack.md](../00_Engineering_Overview/technology-stack.md)) | Claude (Anthropic) — Candidate; open-weight/self-hosted and other hosted providers — To Be Evaluated |
| Original Blueprint | Proposes a specific local-first approach (Llama 3 via Ollama) for data-sensitivity reasons |

**This divergence is not resolved by this document.** Restated unchanged from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 3 and [ai-and-gis-readiness-gates.md](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md) Section 3.1's RG-AI-001 Fail status.

## 3. Candidates — Restated Unchanged

| Technology | Category | Status |
|---|---|---|
| Claude (Anthropic) | Hosted LLM provider | Candidate |
| Open-weight LLMs (self-hosted) | Alternative for data-sensitive deployment | To Be Evaluated |
| Other hosted LLM providers | Alternative | To Be Evaluated |
| LangGraph | Agent orchestration framework | Candidate |

## 4. Evidence Categories and Acquisition Approach

| Category | What Evidence Would Show | Acquisition Approach | Current Status |
|---|---|---|---|
| Grounding | The candidate correctly validates responses against Evidence before finalization | Execute [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) Section 3's grounded-response scenario | **EVIDENCE NOT AVAILABLE** |
| Structured tool calling | The candidate constructs valid, schema-conformant Typed Tool arguments | Execute the PoC's tool-invocation scenario | **EVIDENCE NOT AVAILABLE** |
| Typed tools | The candidate correctly uses only the existing 16-tool contract, inventing no new tool | Execute the PoC's tool-selection scenario | **EVIDENCE NOT AVAILABLE** |
| Context handling | The candidate correctly sequences the Weather→Disaster→Transportation→Healthcare multi-step chain | Execute the PoC's Section 4 primary scenario | **EVIDENCE NOT AVAILABLE** |
| Reliability | The candidate discloses gaps honestly under induced tool failure | Execute the PoC's failure-handling scenario | **EVIDENCE NOT AVAILABLE** |
| Safety | The candidate resists prompt injection and does not fabricate claims | Execute the PoC's safety scenario | **EVIDENCE NOT AVAILABLE** |
| Uncertainty | The candidate communicates only genuinely produced confidence values (AD-AI-003) | Execute the PoC's uncertainty scenario | **EVIDENCE NOT AVAILABLE** |
| Latency | Qualitative responsiveness under single- and multi-step queries | Execute the PoC with timing observation, no threshold invented | **EVIDENCE NOT AVAILABLE** |
| Cost concept | Qualitative licensing/usage cost model fit — no dollar figure invented | Document review of candidate's own pricing/licensing model | **EVIDENCE NOT AVAILABLE — not yet reviewed** |
| Deployment | Hosted vs. local/self-hosted trade-off assessed against the data-sensitivity governance question | Document review + governance decision (external to this technical evidence process) | **EVIDENCE NOT AVAILABLE; governance question unresolved** |
| Privacy | Candidate's data-handling model assessed against DistrictMind's data-sensitivity constraint | Same | **EVIDENCE NOT AVAILABLE** |
| Observability | The candidate supports correlation-ID/AI-Run-ID tracing without bespoke integration | Execute the PoC's Section 12–13 observability scenario | **EVIDENCE NOT AVAILABLE** |
| Failure handling | The candidate degrades safely (map/dashboard remain usable) when the AI is unavailable | Execute [integration-poc.md](../18_Evidence_and_PoC_Resolution/integration-poc.md) Section 12's AI-unavailable scenario | **EVIDENCE NOT AVAILABLE** |

## 5. The Data-Sensitivity Governance Question Must Be Resolved First

**Before any provider-specific technical evidence can be meaningfully weighted, the governance question underlying the divergence (Section 2) must be answered**: does DistrictMind's data sensitivity require a local-first, self-hosted deployment, or is a hosted provider acceptable? Restated unchanged from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 4 and [implementation-readiness.md](../11_Architecture_Resolution/implementation-readiness.md) Section 2's AI row. **This is a governance/policy decision, not a technical PoC outcome — it is recorded here as EXTERNAL EVIDENCE REQUIRED**, since no repository document can resolve it through further technical analysis alone.

## 6. Non-Negotiable Gate — Restated

**A candidate requiring or encouraging any path to direct database, GIS-database, unrestricted filesystem, arbitrary shell, or unrestricted external API access fails this evidence process outright**, restated unchanged from AD-DE-005/AD-DB-006/AD-API-002 and [ai-technology-poc.md](../18_Evidence_and_PoC_Resolution/ai-technology-poc.md) Section 5.

## 7. Evidence Acquisition Sequence

```mermaid
flowchart LR
    Governance[Resolve Data-Sensitivity Governance Question] --> DocReview[Document Review per Candidate]
    DocReview --> PoC[Execute ai-technology-poc.md]
    PoC --> Gate[Verify AI-Exclusion Gate]
    Gate --> Observed[Record Observed Behavior]
    Observed --> Result[Determine Result]
    Result --> Review[Independent Decision Review]
    Review --> Record[AI Decision Record]
```

**None of these steps has occurred, including the governance step.**

## 8. No Provider, Model, or Framework Selected

**This document selects no AI provider, model, or agent framework.** Claude (Anthropic) and LangGraph remain exactly as Candidate; open-weight/self-hosted and other hosted providers remain To Be Evaluated. The divergence between ED-M1's Candidate list and the Blueprint's local-first proposal remains fully preserved.

## 9. Security

Section 6 is this document's central, non-negotiable security gate.

## 10. Observability

Once evidence acquisition genuinely begins, every finding is recorded per [evidence-record-management.md](evidence-record-management.md).

## 11. Milestone Traceability

| Evidence Item | First Needed |
|---|---|
| AI provider/model/framework resolution | M3 |

## 12. Open Decisions

No AI provider, model, or framework is selected. The AI-provider divergence and its underlying governance question remain fully unresolved.
