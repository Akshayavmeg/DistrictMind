---
Document Name: AI RAG and Serving Decision
Document ID: ED-DCB-AIRAG-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# AI RAG and Serving Decision

## 1. Purpose

This document assesses AI/RAG/model-serving evidence from [ai-rag-serving-poc.md](../24_Evidence_Deep_Validation_and_PoC/ai-rag-serving-poc.md) (EV-M6-P3-004, VAL-M6-P3-026 through 030). **The AI-provider divergence is preserved exactly as it stands. Local-LLM feasibility evidence is not converted into a provider selection.**

## 2. What Evidence Actually Exists

| Test | Validation ID | Result |
|---|---|---|
| Local LLM runtime availability (Ollama/`llama3.2:3b`) | VAL-M6-P3-026 | PASS — genuinely installed |
| Single-step typed-tool selection | VAL-M6-P3-027 | TEST EXECUTED — PASS |
| Multi-step tool sequencing (Canonical Example C pattern) | VAL-M6-P3-028 | TEST EXECUTED — PARTIAL (selected only the entry-point tool, did not sequence the full chain) |
| Grounded answer when evidence is present | VAL-M6-P3-029 | TEST EXECUTED — PASS |
| Honest decline when evidence is absent (anti-fabrication) | VAL-M6-P3-030 | TEST EXECUTED — PASS |

## 3. Can the Local LLM Approach Be Recommended for Further PoC?

**Yes — this document recommends local-LLM (Ollama-class) approaches for further, more rigorous PoC work**, on the strength of four real, executed tests: correct single-tool selection, and — arguably more importantly for DistrictMind's specific "no fabrication" principle — a genuine, real demonstration of a small local model correctly declining to answer a question outside its provided evidence rather than inventing a plausible number. This is real, positive, narrow evidence of *feasibility*, not of production readiness (single runs, no repeated trials, no adversarial testing, no comparison against a hosted provider under the same conditions).

## 4. Does This Select an AI Provider?

**No.** Per this milestone's explicit instruction and [ai-rag-serving-poc.md](../24_Evidence_Deep_Validation_and_PoC/ai-rag-serving-poc.md) Section 7: **an AI provider is not selected merely because an API was easy to call.** The AI-provider divergence — ED-M1's hosted Claude/Anthropic-centered Candidate list vs. the Blueprint's local-first Llama 3/Ollama proposal ([unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 3) — remains fully open. What has changed is that the local-first side now has real, executed, non-hypothetical PoC evidence for the first time in this program, where previously it was a documented proposal with no PoC-level backing at all.

## 5. AI Provider — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | Claude/Anthropic (Candidate), Ollama/local Llama-family (newly PoC-tested this program) |
| PoC evidence | Local: 4 real Ollama runs (Section 2). Hosted: none — no hosted-API call was made or attempted this session (no credential sought) |
| Result | Local-first: real, narrow feasibility PASS. Hosted: no new evidence either way |
| Recommendation | Evaluate at least one hosted-provider (Claude/Anthropic) API call under the same test conditions as Section 2, for a genuine side-by-side comparison, before any provider recommendation is drafted |
| Status | **REMAINS UNRESOLVED** — the divergence itself, per [RG-AI-001](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md), requires a data-sensitivity governance decision first, which this evidence does not supply |
| Decision ID | None |

## 6. RAG (Embedding/Retrieval) — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | pgvector, Chroma (Candidate); Qdrant/Weaviate (To Be Evaluated); no embedding-model candidate named anywhere in prior documentation |
| PoC evidence | **None.** No embedding model was installed or tested; only the "grounded generation from directly-supplied evidence" half of RAG was tested (Section 2), which stands in for retrieval without actually performing it |
| Result | Not evaluated |
| Recommendation | Pull an embedding-capable local model (or otherwise obtain embedding-model access) in a future session to close [RG-TECH-006](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md)/[RG-TECH-007](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md)/[RG-AI-005](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md) |
| Status | **REMAINS UNRESOLVED** |
| Decision ID | None |

## 7. Model Serving — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | None named in any prior documentation ([unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 11) |
| PoC evidence | Ollama itself functioned as a real local model-serving mechanism for the four tests in Section 2 — this is evidence that *a* local serving mechanism can work on this hardware class, not that Ollama (or any specific serving technology) is DistrictMind's serving layer |
| Result | Feasibility-only observation, not a candidate evaluation |
| Recommendation | Model serving remains a genuinely open technology decision, independent of the provider divergence |
| Status | **REMAINS UNRESOLVED** |
| Decision ID | None |

## 8. Multi-Step Tool Sequencing — An Honest Limitation, Not Smoothed Over

VAL-M6-P3-028's PARTIAL result (the model selected only the first tool rather than the full ordered chain the prompt requested) is preserved here exactly as found. It suggests that, should a local-first model ever be selected, DistrictMind's own Agent orchestration layer — not the model in a single shot — would need to drive step-by-step tool sequencing, consistent with this program's existing separation of Agent from Typed Tool (AD-DE-005, AD-API-002).

## 9. No Benchmark Claimed

Restated from [ai-rag-serving-poc.md](../24_Evidence_Deep_Validation_and_PoC/ai-rag-serving-poc.md) Section 8: every duration/token figure behind Section 2's results is a single, unrepeated measurement — not a performance benchmark, and not cited as one anywhere in this decision file.

## 10. Security

No credential was used for any AI test — all inference ran fully local. No real DistrictMind data was sent to any model; all evidence text used in the grounded-response tests was synthetic and explicitly labeled as such in the source PoC file.

## 11. Observability

Every result in this document traces to [ai-rag-serving-poc.md](../24_Evidence_Deep_Validation_and_PoC/ai-rag-serving-poc.md) VAL-M6-P3-026 through 030 — no new computation performed here.

## 12. Milestone Traceability

AI provider/model first needed M3; RAG/embeddings M3; model serving M4.

## 13. Open Decisions

**No AI provider, RAG technology, or model-serving technology is Confirmed or Selected.** The AI-provider divergence REMAINS UNRESOLVED. Local-LLM feasibility is recommended for further PoC, explicitly not as a provider selection. RAG and model serving both REMAIN UNRESOLVED.
