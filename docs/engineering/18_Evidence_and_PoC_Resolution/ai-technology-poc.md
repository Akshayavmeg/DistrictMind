---
Document Name: AI Technology PoC
Document ID: ED-EPR-AIPOC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# AI Technology PoC

## 1. Purpose

This document defines conceptual AI PoCs, applying [proof-of-concept-framework.md](proof-of-concept-framework.md) to the dimensions established in [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md). **No LLM provider, model, or agent framework is selected. No PoC has been executed.** The AI provider divergence remains fully preserved and unresolved.

## 2. PoC Objective

Does the candidate AI provider/framework combination support natural-language understanding, correct tool selection, strict authorization enforcement, grounded response generation, and multi-step reasoning — all without ever requiring direct database or GIS-database access?

## 3. Scenarios to Validate

| Scenario | What It Tests |
|---|---|
| Natural-language understanding | The candidate correctly interprets a representative sample of the three canonical example questions |
| Intent classification | The candidate correctly distinguishes a single-domain lookup from a spatial/coverage question from a multi-domain cross-chain question |
| Tool selection | The candidate selects the correct Typed Tool(s) from the existing 16-tool contract ([ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md)) — no new tool is invented for this PoC |
| Typed-tool invocation | The candidate constructs valid, schema-conformant tool arguments |
| Authorization enforcement | A tool call attempting to exceed a simulated caller's authorized scope is rejected server-side, regardless of what the candidate's own reasoning "believed" it was permitted to do |
| Evidence retrieval | Tool results are correctly assembled into Evidence items with intact provenance |
| Grounded response generation | The candidate's final response contains only claims traceable to assembled Evidence |
| Uncertainty communication | Where a stubbed Prediction result carries disclosed uncertainty, the candidate's response communicates it rather than presenting false certainty (AD-AI-003) |
| Failure handling | A stubbed tool failure produces a disclosed gap in the response, not a fabricated substitute |
| Auditability | Every plan, tool call, and response is traceable via a correlation ID / AI Run ID |
| Multi-step reasoning | The candidate correctly sequences a multi-step plan where a later step depends on an earlier step's Evidence |

## 4. Primary Validation Scenario — Weather → Disaster → Transportation → Healthcare

**This is the primary multi-domain validation scenario for this PoC**, restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 20:

| Step | PoC Verification |
|---|---|
| 1. Weather evidence | Candidate correctly calls a stubbed `get_weather`-equivalent tool |
| 2. Disaster risk assessment | Candidate correctly uses the Weather Evidence as context for a stubbed `get_disaster_risk`-equivalent tool call, rather than independently estimating a risk value itself |
| 3. Transportation impact | Candidate correctly composes a stubbed `spatial_query`/`accessibility_analysis`-equivalent tool call using the disaster-risk result |
| 4. Healthcare accessibility | Candidate correctly re-evaluates accessibility given the transportation-impact result |
| 5. Aggregation | Candidate's final response correctly aggregates all four Evidence items with independent provenance intact, and communicates any inherited uncertainty from Step 2 |

A candidate that fails to correctly sequence these five steps, or that fabricates any intermediate value rather than deriving it from a tool call, receives a **Fail** on this scenario regardless of its performance on simpler single-step scenarios.

## 5. AI Must Not Directly Access Databases — Preserved as a PoC Gate

**This PoC explicitly attempts to verify the candidate has no reachable path to a direct database or GIS-database connection, unrestricted filesystem, arbitrary shell, or unrestricted external API** — restated unchanged from AD-DE-005/AD-DB-006/AD-API-002 and [ai-implementation-architecture.md](../13_AI_Intelligence_Implementation/ai-implementation-architecture.md) Section 3. Any candidate integration pattern that would require exposing such a path (e.g., a framework whose idiomatic "tool" abstraction encourages direct SQL execution) fails this PoC outright, regardless of raw model capability.

## 6. Preconditions

- A stubbed Typed Tool dispatcher implementing the existing 16-tool contract with fixture responses.
- A stubbed Evidence/grounding validation stage per [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 9.
- No real production data or live external AI provider call using production credentials (per [environment-architecture.md](../15_Deployment_Infrastructure_Operations/environment-architecture.md) Section 3's low-privilege development scoping).

## 7. Evidence Categories Addressed

| Category | How This PoC Addresses It |
|---|---|
| Functional | Intent classification, tool selection, invocation scenarios |
| Technical | Multi-step sequencing (Section 4) |
| Security | Authorization enforcement, database-access exclusion (Section 5) |
| Provenance | Evidence assembly correctness |
| Reliability | Failure-handling scenario |
| Operational | Auditability/correlation-ID tracing |

## 8. Expected Behavior

Every scenario in Sections 3–4 succeeds with no unsupported claim in any generated response, and Section 5's access-boundary check finds zero reachable bypass path.

## 9. Result Categories

Restated unchanged from [proof-of-concept-framework.md](proof-of-concept-framework.md) Section 13. **A discovered database-access bypass (Section 5) is an automatic Fail, never a Conditional result**, consistent with [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Gate 6's rollback-condition severity.

## 10. No Provider, Model, or Framework Selected

**This document does not select Claude/Anthropic, any open-weight/self-hosted model, LangGraph, or any other AI technology.** The AI provider/framework divergence ([ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 3) remains fully preserved — this PoC design applies identically to whichever side of that divergence is eventually pursued, or a third option.

## 11. Security

Section 5 is this PoC's central, non-negotiable gate — restated throughout every prior milestone's identical rule.

## 12. Observability

This PoC's outcome, once actually run, is recorded via [decision-evidence-record.md](decision-evidence-record.md).

## 13. Milestone Traceability

| PoC Scenario | First Needed |
|---|---|
| Single-tool scenarios | M3 |
| Multi-step Example C scenario (Section 4) | M3 (data-domain tools), M6 (full cross-domain with prediction/simulation/recommendation) |

## 14. Open Decisions

No AI provider, model, or framework is selected. The AI provider/framework divergence remains fully unresolved, restated unchanged from [ai-technology-evaluation.md](../17_Data_and_Technology_Resolution/ai-technology-evaluation.md) Section 3.
