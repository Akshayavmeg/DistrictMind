---
Document Name: AI and Agent Testing
Document ID: ED-TSO-AITEST-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI and Agent Testing

## 1. Purpose

This document defines comprehensive testing for DistrictMind's AI/Agent layer, elaborating [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) and [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) at the testing-strategy level. No model benchmark or numerical accuracy threshold is invented.

## 2. AI Evaluation vs. Ordinary Software Testing — The Central Distinction

| Ordinary Software Testing | AI Evaluation |
|---|---|
| A given input produces one correct, exactly-matchable output | A given input may produce many acceptable phrasings, but must satisfy grounding/safety criteria regardless of phrasing |
| Pass/fail is deterministic | Pass/fail often requires judgment (human or automated-heuristic) against qualitative criteria — restated unchanged from [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) Section 5 |
| Verifies the code does what it says | Verifies the Agent's *reasoning process* (tool selection, sequencing) and its *output's groundedness*, not merely that an answer was produced |

**Ordinary software testing still fully applies to the Typed Tool layer, the Runtime, and the Evidence/Grounding mechanics** (these are deterministic, testable exactly like any other backend code) — restated from [test-architecture.md](test-architecture.md) Section 8. AI Evaluation applies specifically to the Agent's planning and response-generation behavior.

## 3. LLM Response Evaluation

Restated unchanged from [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) Section 3 — factual correctness, grounding, evidence attribution, hallucination, safety, and robustness are each distinct evaluation categories, tested against golden cases (Section 4 of that document).

## 4. Grounding

Tests verify every claim in a response traces to a real Evidence item — restated unchanged from [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) Section 13; this is testable deterministically (a claim-to-Evidence trace either resolves or it does not), unlike phrasing quality.

## 5. Evidence Attribution

Tests verify that a citation correctly points to the source it claims to (e.g., a citation naming a specific Health Facility dataset version actually resolves to that version).

## 6. Hallucination

Tests deliberately induce conditions where Evidence is insufficient (e.g., a query about a domain with no available data) and verify the Agent discloses this rather than fabricating an answer — restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 2.

## 7. Tool Selection

Tests verify the Agent selects the correct typed tool(s) for a given request category (Section 4, [agent-implementation-architecture.md](../13_AI_Intelligence_Implementation/agent-implementation-architecture.md)) — e.g., a coverage question correctly triggers `coverage_analysis`, not an unrelated tool.

## 8. Tool Argument Correctness

Tests verify tool calls are constructed with valid, correctly-typed, appropriately-scoped arguments — restated unchanged from [typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md) Section 5.

## 9. Authorization

Tests verify the Agent's tool calls are rejected when they would exceed the caller's authorized scope, restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 6 — this is deterministically testable regardless of the underlying LLM's behavior, since enforcement happens server-side at the tool boundary.

## 10. Multi-Step Planning and Tool Sequencing

Tests verify a multi-step plan correctly sequences dependent steps (Example C, Section 13) and does not skip a required step or call tools in an order that would use unavailable evidence.

## 11. Agent State

Tests verify intermediate plan state and accumulated Evidence are correctly maintained across steps and correctly discarded at request completion, restated unchanged from [agent-implementation-architecture.md](../13_AI_Intelligence_Implementation/agent-implementation-architecture.md) Section 6.

## 12. Failure Recovery

Tests induce a mid-plan tool failure and verify the Agent either substitutes an alternative tool where valid, or discloses the gap in its final response — restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 11.

## 13. Loop Prevention

Tests verify the Agent's plan execution halts at its maximum-step bound (concept, no invented value, per [agent-implementation-architecture.md](../13_AI_Intelligence_Implementation/agent-implementation-architecture.md) Section 17) rather than looping indefinitely when it cannot form a satisfying plan.

## 14. Context Handling

Tests verify session/context isolation — one user's conversation context never leaks into another session's Agent invocation, restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 3.

## 15. Prompt Injection

Tests deliberately embed adversarial instructions within a user request or within RAG-retrieved content and verify the Agent's authorization scope and tool access are unaffected — restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 4.

## 16. Malicious Retrieved Content

Tests verify a retrieved RAG chunk containing adversarial or malformed text is treated as citable data, never as an instruction the Agent follows — restated unchanged from [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 21.

## 17. Unsupported Claims

Restated unchanged from Section 6 and [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) Section 13 — a response containing any claim without a matching Evidence item fails this test category.

## 18. Uncertainty Communication

Tests verify that when an underlying Prediction carries disclosed uncertainty (AD-AI-003), the Agent's response communicates that uncertainty rather than presenting a false certainty — restated unchanged from [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) Section 8.

## 19. Response Consistency

Tests verify that repeated identical requests against identical underlying state produce responses that are factually consistent (same grounded claims), even if exact phrasing varies — restated consistent with the reproducibility discipline in [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) Section 3.

## 20. The Three Canonical Examples

### 20.1 Example A — 10 km Healthcare Coverage
Tests: correct tool selection (`coverage_analysis`), grounding of the returned gap set, correct disclosure if the underlying dataset is stale.

### 20.2 Example B — Bridge Closure
Tests: correct `create_scenario`/`run_scenario` sequencing, correct hypothetical framing in the response (never presented as a Source-of-Truth fact), sandbox-isolation verification carried from [gis-and-spatial-testing.md](gis-and-spatial-testing.md) Section 11.

### 20.3 Example C — Rainfall → Disaster → Transportation → Healthcare (Multi-Step Workflow)

**This must be tested as a full multi-step workflow, not as four independent single-tool tests:**

| Test Focus | Verifies |
|---|---|
| Sequencing | Weather retrieval occurs before disaster-risk assessment, which occurs before transportation-impact assessment, which occurs before healthcare-accessibility re-evaluation |
| Dependency correctness | Each later step's tool call correctly uses the prior step's Evidence as context rather than independently re-deriving it |
| Aggregation | The final response correctly aggregates all four Evidence items with independent provenance intact |
| Uncertainty propagation | If the disaster-risk stage is itself a Prediction with disclosed uncertainty, the final response's healthcare-accessibility claim correctly inherits that qualification |
| Partial failure | If the transportation-impact step fails, the response discloses the gap rather than presenting an unqualified healthcare-accessibility claim built on a missing link |

## 21. Security

Sections 9, 15, 16 constitute this document's core security-testing contribution to the AI layer; full consolidated treatment in [security-testing.md](security-testing.md) Section on AI-specific tests.

## 22. Observability

AI/Agent test runs should be traceable to the specific plan, tool calls, and Evidence set produced, restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 18.

## 23. Milestone Traceability

| AI Testing Scope | First Needed |
|---|---|
| Single-tool grounding/safety tests | M3 |
| Multi-step workflow tests (Example C class) | M3 (data-domain), M6 (full cross-domain with prediction/simulation/recommendation) |

## 24. Open Decisions

- AI evaluation harness — Candidate, unresolved, restated from [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) Section 12.
- No model benchmark or numerical accuracy threshold is defined, intentionally.
