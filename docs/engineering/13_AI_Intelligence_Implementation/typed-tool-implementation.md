---
Document Name: Typed Tool Implementation
Document ID: ED-AII-TOOL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Typed Tool Implementation

## 1. Purpose

This document defines the implementation approach for the 16 Typed AI Tools already contracted in [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md). **No new tool is introduced here** — this document elaborates execution mechanics for the existing set only: `get_district`, `get_demographics`, `get_healthcare`, `get_infrastructure`, `get_transportation`, `get_agriculture`, `get_weather`, `get_disaster_risk`, `spatial_query`, `coverage_analysis`, `accessibility_analysis`, `get_indicator`, `request_prediction`, `create_scenario`, `run_scenario`, `get_recommendation`.

## 2. The Chain

```mermaid
flowchart LR
    Agent[AI Agent] --> Registry[Tool Registry]
    Registry --> Schema[Tool Schema]
    Schema --> AuthZ[Authorization]
    AuthZ --> AppSvc[Application Service]
    AppSvc --> Repo[Repository / GIS / Model Service]
    Repo --> Result[Result]
    Result --> Evidence[Evidence]
```

## 3. Tool Registry

Every typed tool the Agent may call is enumerated in a Tool Registry known to the runtime ([ai-runtime-architecture.md](ai-runtime-architecture.md)) — the Agent cannot invoke any capability not present in this registry, closing off the possibility of an ad hoc, unregistered tool call.

## 4. Tool Schema

Each registered tool exposes a schema (input parameters, types, required/optional) matching the contract already defined in [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md) — this schema is what the Agent's planning stage uses to construct a valid call ([agent-implementation-architecture.md](agent-implementation-architecture.md) Section 5).

## 5. Input Validation

Every tool call's arguments are validated against its schema before execution — restated unchanged from [request-response-validation.md](../09_Backend_Implementation/request-response-validation.md), applied identically whether the caller is a human-driven API request or an Agent-driven tool call. An invalid argument is rejected before reaching the Application Service layer.

## 6. Authorization

Every tool call is authorized against the calling user's scope (district, role) exactly as any other API-mediated request — restated unchanged from [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md). **The Agent's own judgment is never a substitute for this check.**

## 7. Execution Boundary

The Application Service layer executes the tool's actual work (repository query, GIS computation, model invocation) — the Agent and the Tool Registry never bypass this layer to reach the Repository/GIS/Model Service directly, restated unchanged from AD-DE-005/AD-DB-006/AD-API-002.

## 8. Per-Tool-Category Implementation

### 8.1 Data Retrieval Tools (`get_district`, `get_demographics`, `get_healthcare`, `get_infrastructure`, `get_transportation`, `get_agriculture`, `get_weather`, `get_disaster_risk`, `get_indicator`)

| Aspect | Detail |
|---|---|
| Purpose | Retrieve Source-of-Truth or Derived domain data, per [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md) |
| Input validation | District/entity identifier and any filter parameters validated per schema |
| Authorization | District-scoped and role-scoped, per Section 6 |
| Execution boundary | Application Service → Repository (restated from [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md)) |
| Output structure concept | A typed result object plus its state-category label (Observed/Derived) |
| Evidence/provenance | Source identifier, version, timestamp attached ([grounding-and-evidence-implementation.md](grounding-and-evidence-implementation.md)) |
| Errors | Not-found, unauthorized, validation failure — each a distinct, disclosed condition |
| Observability | Every call traced under the request correlation ID |
| Performance | Cacheable where the underlying data changes infrequently, per [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) |
| Security | No field beyond what the schema declares is ever returned |

### 8.2 Spatial Tools (`spatial_query`, `coverage_analysis`, `accessibility_analysis`)

| Aspect | Detail |
|---|---|
| Purpose | Server-side spatial computation, per [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) |
| Input validation | Geometry/radius/parameter bounds validated ([request-response-validation.md](../09_Backend_Implementation/request-response-validation.md) Section 8) |
| Authorization | Same as Section 6 |
| Execution boundary | Application Service → GIS Service ([gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md)) — the Agent never computes a spatial result itself |
| Output structure concept | Geometry/attribute result plus its state-category label |
| Evidence/provenance | Supporting dataset versions and computation timestamp, per [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 2 |
| Errors | Invalid geometry, out-of-bound parameter, computation failure |
| Observability | Traced, including the specific spatial operation invoked |
| Performance | Subject to level-of-detail scoping (AD-GIS-001) |
| Security | No unrestricted geometry-expression interface is exposed — only the bounded operation set |

### 8.3 Prediction Tool (`request_prediction`)

| Aspect | Detail |
|---|---|
| Purpose | Invoke a trained Prediction model, per [prediction-implementation.md](prediction-implementation.md) |
| Input validation | Prediction target and feature inputs validated against the model's expected schema |
| Authorization | Same as Section 6 |
| Execution boundary | Application Service → Prediction Service/Model Serving boundary ([prediction-implementation.md](prediction-implementation.md) Section 9) |
| Output structure concept | Predicted value, forecast horizon, uncertainty indicator, model/feature version metadata |
| Evidence/provenance | Model version, feature version, timestamp ([model-lifecycle-implementation.md](model-lifecycle-implementation.md)) |
| Errors | Model unavailable, insufficient input features, out-of-distribution input |
| Observability | Traced with model/feature version for reproducibility |
| Performance | Long-running predictions may run asynchronously ([background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md)) |
| Security | No model internals or raw training data are exposed through this tool's output |

### 8.4 Simulation Tools (`create_scenario`, `run_scenario`)

| Aspect | Detail |
|---|---|
| Purpose | Create and execute a sandboxed hypothetical scenario, per [simulation-and-scenario-implementation.md](simulation-and-scenario-implementation.md) |
| Input validation | Scenario parameters validated against the scenario type's schema |
| Authorization | Elevated role requirement restated from [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 3 (Analyst/District Officer+) |
| Execution boundary | Application Service → Simulation Service, operating on a cloned/sandboxed state (AD-DE-004) — never the production database |
| Output structure concept | Before/after comparison, affected entities, spatial impact |
| Evidence/provenance | Originating Scenario identifier, baseline snapshot reference, execution timestamp |
| Errors | Invalid target entity, non-runnable scenario state |
| Observability | Traced, scenario lifecycle auditable |
| Performance | Bounded execution scope; no unbounded recursive scenario chaining |
| Security | Scenario execution never mutates Source-of-Truth data — restated unchanged from AD-DE-004 |

### 8.5 Recommendation Tool (`get_recommendation`)

| Aspect | Detail |
|---|---|
| Purpose | Retrieve Recommendation Engine output, per [recommendation-and-decision-intelligence-implementation.md](recommendation-and-decision-intelligence-implementation.md) |
| Input validation | Decision context parameters validated against schema |
| Authorization | Same as Section 6 |
| Execution boundary | Application Service → Recommendation Service — the Agent never generates a recommendation itself, only explains one already produced |
| Output structure concept | Ranked candidate actions, scoring rationale (per AD-AI-005's inspectability requirement), supporting Evidence references |
| Evidence/provenance | Full chain back to the Evidence/Prediction/Simulation inputs that fed the scoring |
| Errors | Insufficient evidence to score, no viable candidate |
| Observability | Traced, including which candidates were considered |
| Performance | Cacheable within the bounds of underlying data freshness |
| Security | The AI never presents its own explanation as if it were an independently authoritative recommendation — restated from Section 9 |

## 9. Explicitly Prohibited Tool Types

The following are never introduced as typed tools, restated unchanged from [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md) and [ai-implementation-architecture.md](ai-implementation-architecture.md):

- Raw SQL execution tools
- Unrestricted database query tools
- Arbitrary Python/shell execution tools
- Unrestricted HTTP request tools
- Direct filesystem access tools

Any future tool proposal expanding this set is out of scope for this milestone and would require its own architecture decision.

## 10. Observability

Every tool call (registry lookup, schema validation, authorization check, execution, result) is traced end-to-end under the request's correlation ID — restated unchanged from [ai-runtime-architecture.md](ai-runtime-architecture.md) Section 18.

## 11. Performance

Restated per-category in Section 8; consolidated caching/async guidance unchanged from [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) and [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md).

## 12. Security

Restated unchanged from Section 6 and Section 9; full treatment in [ai-safety-implementation.md](ai-safety-implementation.md) Section 4 (tool abuse, authorization bypass).

## 13. Milestone Traceability

| Tool Category | First Needed |
|---|---|
| Data retrieval tools | M3 |
| Spatial tools | M3 (data-domain), M2 (data itself) |
| Prediction tool | M4 |
| Simulation tools | M5 |
| Recommendation tool | M6 |

## 14. Open Decisions

- None specific to tool selection — the 16-tool set is fixed per [ai-tool-contracts.md](../06_API_and_Integration/ai-tool-contracts.md); underlying technology choices for each execution boundary remain exactly as open as documented in their respective implementation folders.
