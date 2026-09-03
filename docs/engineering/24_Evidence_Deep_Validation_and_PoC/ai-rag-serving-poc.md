---
Document Name: AI RAG Serving PoC
Document ID: ED-DVP-AIRAG-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI RAG Serving PoC

## 1. Purpose

This document attempts PoC-level validation of the AI/RAG/model-serving layer against DistrictMind's documented architecture: the AI access boundary (Frontend→API→AI Agent→Typed Tool→Authorization→Application Service→Evidence/Data→AI Response, with the AI never directly touching the database or GIS database), and the RAG concept (Document→Chunk→Embedding→Retrieval→Evidence→Grounded response). **No DistrictMind AI agent, typed-tool router, or RAG pipeline is built. This is real evidence about local-LLM operability on this hardware class, and a conceptual/architectural review — not an application implementation.**

## 2. Environment Capability Check

### VAL-M6-P3-026 — Local LLM Runtime Availability

| Field | Detail |
|---|---|
| Question | Is any LLM runtime actually available and operable in this environment? |
| Method | `which ollama`, `ollama --version`, `ollama list` in Bash |
| Environment | Bash tool, this machine |
| Observation | **Ollama is genuinely installed** (`/c/Users/aksha/AppData/Local/Programs/Ollama/ollama`, version 0.33.2), with one model already pulled: `llama3.2:3b` (2.0 GB, pulled approximately two months prior to this session) |
| Result | **PASS** — a real, local, operable LLM runtime exists in this environment, distinct from anything installed or configured by this milestone |
| Decision impact | This is a genuine, positive environmental fact directly relevant to the Blueprint's local-first Llama 3/Ollama proposal named in the still-unresolved AI-provider divergence ([technology-stack.md](../00_Engineering_Overview/technology-stack.md) vs. the original Blueprint). It does **not** resolve that divergence — see Section 7 |

## 3. Typed-Tool Selection — Real Local Model Test

### VAL-M6-P3-027 — Single Tool Selection

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P3-004 |
| Question | Can a real local model, given DistrictMind's actual named Typed Tools, select the correct one and extract a correct argument for a simple single-domain question? |
| Candidate | `llama3.2:3b` via Ollama's local HTTP API (`http://localhost:11434/api/generate`), `format: "json"` constrained-output mode |
| Method | Prompted with a tool-selection instruction listing four tool names (`get_weather`, `get_healthcare`, `get_district`, `coverage_analysis`) matching DistrictMind's Typed Tool naming pattern, and the question "What is the rainfall in Warangal district?" |
| Environment | Bash `curl` → local Ollama HTTP API |
| Observation | Response: `{"tool_name": "get_weather", "arguments": {"district_id": "Warangal"}}` — well-formed JSON, correct tool selected, correct district argument extracted. Real duration 4.18s, 21 tokens generated (single run, not a benchmark — see Section 8) |
| Expected | Correct tool name and correct argument extraction |
| Result | **TEST EXECUTED — PASS** |
| Evidence | Raw API response reproduced verbatim above |
| Limitation | Single question, single run, no adversarial or ambiguous phrasing tested; `format: "json"` constrained decoding was used, which materially assists structural correctness and would need to be re-verified with any specific framework DistrictMind eventually adopts (e.g., a different constrained-decoding or function-calling mechanism) |
| Decision impact | Evidence that small (3B-parameter) local models are *capable in principle* of DistrictMind's typed-tool-selection pattern on this hardware — not a selection of any model, provider, or framework |

### VAL-M6-P3-028 — Multi-Step Tool Sequencing (Canonical Example C)

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P3-004 |
| Question | Can the same model correctly sequence multiple typed-tool calls for a cross-domain question resembling Canonical Example C (heavy rainfall → disaster risk → transportation → healthcare)? |
| Candidate | Same model/API, prompted with three tools (`get_weather`, `get_disaster_risk`, `accessibility_analysis`) and instructed to respond with a JSON **array** of ordered tool calls |
| Method | Prompt explicitly requested `[{"tool_name": ..., "arguments": {...}}, ...]` for the question "How could heavy rainfall affect disaster risk, transportation and healthcare access in Warangal?" |
| Environment | Same |
| Observation | The model returned a **single JSON object** (`{"tool_name": "get_weather", "arguments": {"district_id": "Warangal"}}`), not an array — it selected only the first, most obviously relevant tool and did not sequence the full multi-step chain the prompt asked for. Duration 6.45s, 29 tokens |
| Expected | An ordered array reflecting the Weather→Disaster→Transportation→Healthcare chain |
| Result | **TEST EXECUTED — PARTIAL** (correctly identified the entry-point tool; did not perform the requested multi-step sequencing) |
| Evidence | Raw API response reproduced verbatim above |
| Limitation | This is a genuine, honestly-reported limitation of this specific 3B model with this specific prompt and no retry/reformulation attempted. It does not test whether a larger model, a different prompting strategy (e.g., explicit chain-of-thought, one-tool-call-at-a-time agentic loop rather than one-shot array generation), or an actual orchestration framework (LangChain/LangGraph/etc., none installed this session) would perform better |
| Decision impact | Directly relevant, honest counter-evidence to any assumption that a small local model can handle DistrictMind's multi-step cross-domain reasoning (Canonical Example C) in a single shot. Suggests that if a local-first model is ever selected, DistrictMind's own Agent orchestration layer — not the model alone — would need to drive step-by-step tool sequencing, consistent with the existing architecture's explicit separation of Agent from Typed Tool |

## 4. Grounded-Response / Anti-Fabrication Behavior — Real Test

### VAL-M6-P3-029 — Grounded Answer When Evidence Is Present

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P3-004 |
| Question | Given evidence text and an instruction to answer only from it, does the model produce a correct, grounded answer when the answer is actually present? |
| Candidate | Same model/API, plain-text prompt (no JSON constraint) |
| Method | Provided two facts explicitly labeled `SYNTHETIC VALIDATION DATA — NOT REAL DISTRICTMIND EVIDENCE` ("Warangal district has 3 government hospitals listed in this test evidence set"; a test rainfall value), instructed to answer only from this evidence or say "Not available in provided evidence," then asked a question whose answer IS in the evidence |
| Environment | Same |
| Observation | Response: "There are 3 government hospitals in Warangal district, as stated in the evidence." — correct, grounded, no invented detail added. Duration 10.41s, 19 tokens |
| Expected | Correct answer drawn only from the provided evidence |
| Result | **TEST EXECUTED — PASS** |
| Evidence | Raw response reproduced verbatim above |
| Limitation | Single run; synthetic evidence; no real DistrictMind evidence retrieval involved (see Section 5) |
| Decision impact | Supports the general feasibility of "answer only from provided Evidence" prompting, one necessary ingredient of DistrictMind's AI Response category — not a full validation of it |

### VAL-M6-P3-030 — Honest Decline When Evidence Is Absent (Anti-Fabrication)

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P3-004 |
| Question | Given the same evidence and instruction, does the model correctly refuse to answer a question whose answer is NOT in the evidence, rather than inventing a plausible-sounding number? |
| Candidate | Same model/API, same evidence text, different question: "What is the population of Warangal district according to the evidence?" (population was never provided) |
| Method | Same prompting pattern as VAL-M6-P3-029 |
| Environment | Same |
| Observation | Response: "Not available in provided evidence." — the model did **not** invent a population figure. Duration 1.31s, 7 tokens |
| Expected | An honest decline rather than a fabricated number |
| Result | **TEST EXECUTED — PASS** |
| Evidence | Raw response reproduced verbatim above |
| Limitation | Single run, single question, synthetic evidence, small/simple context (two facts) — a real DistrictMind context would be larger and more complex, and this result should not be read as a guarantee of hallucination-free behavior at scale or under adversarial phrasing |
| Decision impact | **This is the single most directly relevant finding in this document to DistrictMind's own "no fabrication" principle** (the same principle this entire milestone operates under). It is real, positive, but narrow evidence that grounded/evidence-constrained prompting is a viable technique in principle for enforcing DistrictMind's AI Response category's grounding requirement — not proof that any specific provider or model will behave this way in production, at scale, or under adversarial input |

## 5. RAG Concept Validation — Partial, Explicitly Scoped

| RAG Stage | Tested This Session? | Finding |
|---|---|---|
| Document | Not tested | No real DistrictMind document corpus exists yet to chunk |
| Chunk | Not tested | No chunking logic was implemented or exercised |
| Embedding | **Not tested** | No embedding-capable model is installed in this environment (only `llama3.2:3b`, a chat/instruct model, not an embedding model); Ollama supports embedding models, but none was pulled or tested this session |
| Retrieval | **Not tested** | No vector index, similarity search, or retrieval mechanism was built or exercised |
| Evidence → Grounded response | **Partially tested** (Section 4) | The "answer only from provided evidence, or decline" half of the pattern was tested directly, with the evidence handed to the model as plain text rather than retrieved via embedding/similarity search |

**This document does not validate a RAG pipeline.** It validates only the final step of one (grounded generation given evidence), using evidence supplied directly rather than retrieved. The embedding and retrieval stages — arguably the harder and more DistrictMind-specific part of RAG, since DistrictMind's "evidence" is structured facility/geometry/weather data rather than free-text documents — remain genuinely untested. This is recorded as an honest gap, not glossed over.

## 6. Conceptual Flow Validation — Architecture-Level Only

| Flow Stage (per [ai-access-boundary.md](../08_AI_Layer_Design/ai-access-boundary.md) / equivalent) | Validated How |
|---|---|
| Frontend → API | Not exercised — no API exists this session |
| API → AI Agent | Not exercised |
| AI Agent → Typed Tool (selection) | **Real evidence** — Section 3 (VAL-M6-P3-027/028), using bare tool names as a stand-in for actual Typed Tool interfaces, not real DistrictMind tool code |
| Typed Tool → Authorization | Not exercised — no authorization layer exists to test |
| Authorization → Application Service | Not exercised |
| Application Service → Repository → Database | Not exercised — restated from [backend-database-gis-poc.md](backend-database-gis-poc.md), no database exists in this environment |
| Database/Service → Evidence | Simulated only, via directly-supplied synthetic text (Section 4) — not a real Evidence object retrieved from a real Application Service |
| Evidence → Agent → AI Response | **Real evidence** — Section 4 (VAL-M6-P3-029/030) for the "grounded generation from evidence" step specifically |

**The central architectural claim — that the AI never directly accesses the database or GIS database — is confirmed here only as a design review, not as an executed test**, since no database or AI agent code exists in this environment to attempt (and be blocked from) a direct-access violation against. This is unchanged from every other architecture-level (non-executable) finding in this milestone's other files.

## 7. AI-Provider Divergence — Explicitly Preserved, Not Resolved

**This document does not select an AI provider.** The real, positive Ollama/`llama3.2:3b` results in Sections 3–4 are evidence about **local-LLM tool-calling and grounded-response operability on this specific hardware class**, not a recommendation, preference, or selection of Ollama, Llama 3.2, or any local-first approach over hosted Claude/Anthropic. Per this milestone's explicit instruction: *do not select an AI provider merely because an API is easy to call.* The AI-provider divergence between ED-M1's hosted-Claude-centered Candidate list and the original Blueprint's local-first Llama 3/Ollama proposal remains exactly as unresolved as it was entering this milestone. What has changed is that the local-first side of that divergence now has real, executed, non-hypothetical evidence behind it for the first time — where previously it was a documented proposal with no PoC-level backing in this program.

## 8. No Benchmark Claimed

Every duration and token count reported in Sections 3–4 (4.18s/21 tokens; 6.45s/29 tokens; 10.41s/19 tokens; 1.31s/7 tokens) is a single, real, unrepeated measurement on this specific machine, model, and prompt. **These are not performance benchmarks.** No throughput, latency percentile, accuracy score, or hallucination rate is claimed or computable from n=1 runs. Any future benchmark claim would require repeated trials, varied prompts, and a defined evaluation methodology — none of which was in scope or attempted here.

## 9. Security

No credential, API key, or external AI service was used — all tests ran against a fully local model with no network egress for inference. No real DistrictMind data was sent to any AI model; all evidence text used in Section 4 was synthetic and explicitly labeled as such.

## 10. Observability

Every response reproduced in this document is the verbatim, unedited `response` field from Ollama's local API, captured via `curl` piped through Python for display formatting only — no response text was rewritten or summarized before being recorded here.

## 11. Milestone Traceability

This validation supports the AI/Agent Typed Tool boundary and AI Response grounding requirements first needed for M4 (per [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md)), and directly informs the AI-provider divergence tracked since ED-M1.

## 12. Open Decisions

No AI provider, model, or framework is Confirmed or Selected. The AI-provider divergence remains open. A genuine RAG pipeline (embedding + retrieval) remains untested and is recommended as a concrete next step, along with repeated/varied-prompt testing before any performance or reliability claim is made, and evaluation of at least one hosted-provider (Claude/Anthropic) API call under the same test conditions for direct comparison — not attempted this session since no hosted-API credential was available or sought.
