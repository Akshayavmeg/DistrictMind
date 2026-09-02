---
Document Name: AI Evaluation Implementation
Document ID: ED-AII-EVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# AI Evaluation Implementation

## 1. Purpose

This document defines the conceptual evaluation approach for DistrictMind's AI layer. **No numerical performance target or benchmark value is invented anywhere in this document** — evaluation categories, methods, and case structures are defined; specific pass/fail thresholds remain a future calibration decision.

## 2. Model Evaluation vs. System Evaluation

| Level | Scope | Example |
|---|---|---|
| Model evaluation | A single model's own predictive/generative quality in isolation | A Prediction model's accuracy on held-out data ([model-lifecycle-implementation.md](model-lifecycle-implementation.md) Section 5) |
| System evaluation | The end-to-end AI-mediated request, including tool selection, grounding, and response composition | Whether a full response to Example C is correctly grounded, safe, and complete |

Both levels are necessary and distinct — a well-performing model does not guarantee a well-behaved system, and vice versa.

## 3. Evaluation Categories

| Category | What It Assesses |
|---|---|
| Factual correctness | Whether response claims match the underlying Evidence |
| Grounding | Whether every claim traces to Evidence ([grounding-and-evidence-implementation.md](grounding-and-evidence-implementation.md)) |
| Evidence attribution | Whether citations/provenance are accurate and complete |
| Tool selection | Whether the Agent chose the correct typed tool(s) for a given request |
| Tool argument correctness | Whether tool calls were constructed with valid, appropriate arguments |
| Multi-step / cross-domain reasoning | Whether a chained plan (Example C class) correctly sequences dependent steps |
| Hallucination | Whether any unsupported claim appears |
| Safety | Whether [ai-safety-implementation.md](ai-safety-implementation.md) controls hold under adversarial input |
| Authorization | Whether scope boundaries are respected under every test case |
| Robustness | Behavior under malformed, ambiguous, or edge-case input |
| Retrieval quality | Whether RAG retrieval surfaces relevant, correctly-scoped chunks ([embedding-and-retrieval-implementation.md](embedding-and-retrieval-implementation.md)) |
| Prediction quality | Whether Prediction outputs are reasonable relative to held-out data ([prediction-implementation.md](prediction-implementation.md)) |
| Simulation consistency | Whether Simulation results are internally consistent with their stated baseline and parameters |
| Recommendation quality | Whether Recommendation candidates and rationale are coherent with their Evidence inputs |
| Latency | Qualitative responsiveness assessment — no numeric target invented |
| Failure recovery | Whether disclosed-gap behavior (Section 14, [ai-safety-implementation.md](ai-safety-implementation.md)) triggers correctly under induced failures |
| Reproducibility | Whether an identical request against identical underlying state produces a consistent plan and grounded result |

## 4. Conceptual Test Datasets

| Dataset Type | Purpose |
|---|---|
| Golden cases | A curated set of request/expected-grounded-answer pairs covering the three canonical examples and representative single-domain queries |
| Scenario tests | Cases exercising `create_scenario`/`run_scenario` tool paths |
| Adversarial tests | Cases attempting prompt injection, malicious retrieved content, authorization-scope probing ([ai-safety-implementation.md](ai-safety-implementation.md) Sections 4–8) |
| Regression tests | Re-run golden and adversarial cases after any Agent, tool, or model change to detect behavioral drift |

No specific dataset size or composition is mandated here — this remains an implementation detail for whoever builds the evaluation harness.

## 5. Evaluation Methods

| Method | Application |
|---|---|
| Human evaluation | Judging response quality, explanation coherence, and recommendation soundness where automated grading is insufficient |
| Automated evaluation | Grounding checks (claim-to-Evidence trace verification), schema/argument validation, authorization-boundary tests |
| Trace-based evaluation | Inspecting the full request trace ([ai-runtime-architecture.md](ai-runtime-architecture.md) Section 18) to verify correct tool sequencing, not just the final answer |
| Tool-level evaluation | Testing each typed tool's contract independently of the Agent (input validation, authorization, output structure) |
| End-to-end evaluation | Full request-to-response evaluation against golden cases |

## 6. Retrieval Evaluation

Restated from [rag-implementation.md](rag-implementation.md) Section 20: relevance and correctness of retrieved chunks against golden queries, plus verification that district-scoping (Section 18, [rag-implementation.md](rag-implementation.md)) is never violated.

## 7. Evaluation Cases for the Three Canonical Examples

| Example | Evaluation Focus |
|---|---|
| A — 10 km Healthcare Coverage | Tool selection (`coverage_analysis`), correctness of the returned gap set against known Village/Health Facility fixtures, grounding of the resulting claim |
| B — Bridge Closure Impact | Correct `create_scenario`/`run_scenario` sequencing, sandbox isolation (the production Road Segment must remain unmutated), correct hypothetical framing in the response |
| C — Rainfall → Disaster → Transportation → Healthcare | Correct multi-step tool sequencing and dependency handling, Evidence aggregation across all four domains, correct uncertainty propagation from a Predicted disaster-risk stage through to the final response |

## 8. Distinguishing Model Evaluation from System Evaluation in Practice

A Prediction model may score well in isolation (model evaluation, [model-lifecycle-implementation.md](model-lifecycle-implementation.md) Section 5) yet the system may still fail system evaluation if, e.g., the Agent selects the wrong tool, mishandles the model's uncertainty output, or fails to disclose a stale feature — both evaluation levels are required, neither substitutes for the other.

## 9. Security-Focused Evaluation

Adversarial tests specifically targeting [ai-safety-implementation.md](ai-safety-implementation.md) controls (prompt injection, cross-district leakage attempts, tool-abuse attempts) are a mandatory evaluation category, not an optional add-on.

## 10. Observability

Evaluation runs themselves are traceable and reproducible against a known system/model/data version snapshot — restated consistent with [model-lifecycle-implementation.md](model-lifecycle-implementation.md) Section 8's reproducibility discipline.

## 11. Milestone Traceability

| Evaluation Capability | First Needed |
|---|---|
| Tool-level and single-step evaluation | M3 |
| Multi-step/cross-domain and safety evaluation | M3 (data-domain), M6 (full cross-domain) |
| Prediction/Simulation/Recommendation evaluation | M4, M5, M6 respectively |

## 12. Open Decisions

- Evaluation harness/framework — Candidate, unresolved.
- Specific pass/fail numeric thresholds for any category — intentionally unresolved; not invented here.
