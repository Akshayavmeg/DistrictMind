---
Document Name: Agent Planning and Reasoning
Document ID: ED-AI-PLAN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Agent Planning and Reasoning

## 1. Purpose

This document explains how the Coordinator Agent decomposes a complex, cross-domain question into a bounded sequence of tool calls, elaborating the Planning stage of [agent-execution-architecture.md](agent-execution-architecture.md) Section 2. No agent/planner implementation exists here.

## 2. Worked Example — Full Decomposition

**"Which villages are at higher flood risk and lack nearby healthcare access?"**

| Step | Action | Tool ([ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md)) |
|---|---|---|
| 1 | Identify district/geographic scope | Resolved from query context or explicit user selection — `get_district` if not already scoped |
| 2 | Retrieve rainfall/environment observations | `get_weather` |
| 3 | Retrieve disaster/risk information | `get_disaster_risk` |
| 4 | Identify affected geography | `spatial_query` (intersection, per [spatial-query-services.md](../06_API_and_Integration/spatial-query-services.md) Section 4) |
| 5 | Retrieve healthcare facilities | `get_healthcare` |
| 6 | Perform distance/coverage analysis | `coverage_analysis` |
| 7 | Join risk + healthcare accessibility | Agent-internal composition (no new tool call — this is Reasoning, not Retrieval) |
| 8 | Collect evidence | Aggregation of every tool result's provenance metadata into the response's citation set |
| 9 | Generate explanation | Response Generation stage ([agent-execution-architecture.md](agent-execution-architecture.md)) |
| 10 | Present limitations and uncertainty | Per [ai-uncertainty-and-confidence.md](ai-uncertainty-and-confidence.md) — disclosed, not omitted |

This is the identical example used in [ai-agent-integration.md](../06_API_and_Integration/ai-agent-integration.md) Section 4; this document adds the explicit intent/entity/constraint decomposition (Section 3) that a planner must extract before step 1 can even begin.

## 3. Decomposition Dimensions

| Dimension | Extracted From the Example | Purpose |
|---|---|---|
| **Intent** | "Identify at-risk, underserved villages" — a compound coverage-gap + risk-assessment intent | Determines which domain services/tools are relevant at all |
| **Entities** | "villages," implicitly scoped to a district or the full state | Determines the query's target entity type and scope |
| **Constraints** | "higher flood risk," "lack nearby" (an implicit distance threshold) | Determines tool parameters (e.g., `coverage_analysis`'s distance threshold) |
| **Temporal scope** | Implicitly "current" risk and "current" facility state — no explicit historical or future framing in this example | Determines whether Observed/Derived data suffices or a Prediction tool is needed (in this example, risk retrieval via `get_disaster_risk` may itself return Derived or Predicted risk, per [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) — the planner does not need to know which in advance; the tool's response discloses it) |
| **Spatial scope** | Village-level granularity, within a district | Determines the resolution at which `spatial_query`/`coverage_analysis` operate |
| **Domain scope** | Weather, Disaster, Geography, Healthcare — four domains | Determines which domain services are invoked; Agriculture/Transportation/Infrastructure are correctly *not* invoked, since they are irrelevant to this specific question |

## 4. Tool Planning

The Coordinator selects the **minimum sufficient set** of tools for the decomposed intent — this is a deliberate constraint, not an incidental one (Section 6). For the worked example, five tool calls (Steps 2–6) are necessary and sufficient; a sixth call to, say, `get_transportation` would not serve the stated question and is correctly not planned.

## 5. Result Synthesis

Step 7 (join risk + accessibility) and Step 9 (generate explanation) are **Reasoning**, not **Retrieval** — the Coordinator combines already-collected Evidence (Step 8) according to the query's original intent (Section 3), without issuing any further tool call. This distinction matters because Reasoning is where Grounding Validation ([ai-safety-and-grounding.md](ai-safety-and-grounding.md)) applies: every synthesized claim in the final response must trace back to a specific piece of Evidence collected in Steps 2–6, not to the Reasoning stage's own unmediated inference.

## 6. Avoiding Unnecessary Tool Calls

| Principle | Application |
|---|---|
| Plan from intent, not from tool availability | The Coordinator does not call every tool "just in case" — it plans against the decomposed intent (Section 3), then selects only the tools that intent requires |
| Reuse already-collected Evidence within a single interaction | If a prior step in the same plan already retrieved a district's boundary (e.g., via an implicit `get_district` resolution in Step 1), a later step needing the same district's identity does not re-call the tool |
| Prefer composed tools over multiple primitive calls where one exists | `coverage_analysis` (a single call) is preferred over separately calling `get_healthcare` and manually computing coverage via repeated `spatial_query` calls — per [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md) Section 13's existence specifically to avoid this |
| Respect result limits | Per [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) Section 9, a plan does not attempt to work around a bounded result by issuing many small calls to reassemble an unbounded one |

This restrained-tool-use principle also directly serves performance and cost: every additional tool call adds latency ([database-performance.md](../05_Database_Design/database-performance.md)) and, if the LLM provider is usage-metered, cost — minimizing unnecessary calls is therefore both a grounding-quality and an efficiency concern.

**AD-AI-004 — Minimum-Sufficient Tool-Call Planning**
- **Context:** An agent capable of calling many typed tools could, without a governing principle, call every plausibly-relevant tool for a query "just to be safe," inflating latency, cost, and the amount of Evidence the Reasoning stage must reconcile (increasing the surface area for an inconsistency to slip through).
- **Decision:** The Coordinator plans from the decomposed intent (Section 3) and selects only the minimum tool set sufficient to answer it (Section 6) — never a maximal or exploratory call pattern.
- **Alternatives considered:** An "always call every relevant-seeming tool" strategy for thoroughness (rejected — directly conflicts with the milestone brief's explicit instruction to avoid unnecessary tool calls, and increases both cost and the risk of the Reasoning stage needing to reconcile irrelevant or noisy Evidence).
- **Reasoning:** Directly required by this milestone's brief; consistent with [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md)'s composed-tool design (e.g., `coverage_analysis` existing specifically to avoid a multi-call workaround).
- **Trade-offs:** A minimum-sufficient plan may occasionally miss a tangentially relevant piece of context a maximal plan would have surfaced — accepted, since Section 7's ambiguity-handling and the option to ask a clarifying question cover genuinely under-specified cases without requiring speculative over-fetching for every query.
- **Consequences:** [agent-execution-architecture.md](agent-execution-architecture.md) Section 6's "why synchronous" table assumes bounded, minimal tool-call counts per interaction — a maximal-fetch strategy would undermine that latency assumption.
- **Status:** Proposed.

## 7. Planning Under Ambiguity

If Section 3's decomposition cannot resolve a required dimension (e.g., the district scope is genuinely ambiguous from context), the Coordinator asks a clarifying question or explicitly states its assumed scope in the final response — it does not silently guess a scope and answer as if the guess were the user's actual intent.

## 8. Milestone Traceability

| Planning Capability | Milestone |
|---|---|
| Single-domain intent decomposition | M3 — Future |
| Multi-domain, multi-step decomposition (the full worked example) | M3 — Future (weather/disaster/healthcare parts), M4 — Future (once risk assessment is Predicted rather than only Derived) |
| Planning that incorporates Prediction/Simulation/Recommendation tools | M4–M6 — Future, as those tools become available |

## 9. Open Decisions

- Exact planning mechanism (rule-based intent classification vs. LLM-driven planning) — restated as unresolved from [ai-agent-integration.md](../06_API_and_Integration/ai-agent-integration.md) Section 9, an implementation detail out of scope for this documentation-only milestone.
- How the Coordinator communicates an assumed scope (Section 7) to the user — implementation/UX detail, not decided here.
