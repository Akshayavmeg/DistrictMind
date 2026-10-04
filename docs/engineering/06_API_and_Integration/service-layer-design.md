---
Document Name: Service Layer Design
Document ID: ED-API-SVC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Service Layer Design

## 1. Purpose

This document defines the modular service layer behind the API boundary ([api-architecture.md](api-architecture.md)), elaborating [backend-architecture.md](../02_System_Architecture/backend-architecture.md) and [backend-structure.md](../03_Project_Structure/backend-structure.md) with the finer per-domain granularity established by AD-API-001.

## 2. Logical Service Boundary vs. Deployment Boundary

**This distinction is explicit and load-bearing throughout this document.**

| Concept | Definition | DistrictMind's Choice |
|---|---|---|
| Logical service boundary | A named module with a clear responsibility, interface, and data ownership — a code-organization and reasoning boundary | Applied at full per-domain granularity (Section 3) — 12 domain services plus AI orchestration, evidence/provenance, and audit |
| Deployment boundary | Where a network/process boundary actually exists — what is independently deployed, scaled, and versioned | Remains the single modular monolith established by AD-002 ([system-architecture.md](../02_System_Architecture/system-architecture.md)) and AD-BE-001 ([backend-architecture.md](../02_System_Architecture/backend-architecture.md)) — **not** one deployment per logical service |

Every service described below is a logical module within the same backend deployable; none is implied to be an independent microservice. This is the direct, restated answer to the milestone brief's explicit instruction not to turn every service into a microservice.

## 3. Service Catalog

| Service | Responsibility | Inputs | Outputs | Dependencies | Data Access | Spatial | Temporal | AI Interaction | Failure Handling |
|---|---|---|---|---|---|---|---|---|---|
| Geography | District/mandal/village CRUD-for-reference-data, hierarchy queries | Geographic reference data, ingestion updates | District/Mandal/Village records, boundary geometry | GIS Service | Direct (Geography domain tables) | Yes | Low | Called by `get_district` tool | Not-found returns explicit empty result, not error, for valid-but-empty queries |
| Demographics | Population observation queries, trend retrieval | Query parameters (district, date range) | Population Observation records | Geography (for entity resolution) | Direct | No | Yes | Called by `get_demographics` tool | Data-unavailable is explicit, not a 500 |
| Healthcare | Facility queries, coverage-gap computation (via GIS Service) | Query parameters, coverage radius | Health Facility records, coverage indicators | Geography, GIS Service, Analytics (for precomputed indicators) | Direct + computed spatial joins | Yes | Low | Called by `get_healthcare`, `coverage_analysis` tools | Coverage computation failure falls back to returning raw facility data with a computation-failed flag, not a hard error |
| Infrastructure | School/office/water-body queries | Query parameters | Infrastructure entity records | Geography, GIS Service | Direct + computed | Yes | Low | Called by `get_infrastructure` tool | Same pattern as Healthcare |
| Transportation | Road/road-segment queries, routing graph access | Query parameters, origin/destination | Road geometry, route results | Geography, GIS Service | Direct + derived graph | Yes | Low | Called by `get_transportation`, `accessibility_analysis` tools | Routing failure (disconnected graph) is explicit, not silently defaulted to a straight-line estimate |
| Agriculture | Agricultural observation queries | Query parameters | Agricultural Observation records | Geography, Weather (for cross-domain joins) | Direct | No | Yes | Called by `get_agriculture` tool | Same pattern as Demographics |
| Weather | Weather observation queries, station lookup | Query parameters | Weather Observation records | Geography (nearest-station lookup via GIS Service) | Direct | Yes (station location) | Yes | Called by `get_weather` tool | Same pattern as Demographics |
| Disaster | Disaster event/impact queries | Query parameters | Disaster Event, Impact Observation records | Geography, GIS Service, Weather (for risk input) | Direct + computed | Yes | Yes | Called by `get_disaster_risk` tool | Explicit data-unavailable given unconfirmed source status ([data-sources.md](../04_Data_Engineering/data-sources.md)) |
| Analytics | Indicator computation and retrieval | Domain data from any service | Analytical Result records | All domain services (read-only) | Direct (Analytical Result tables) + reads from other domains | Indirect | Yes | Called by `get_indicator` tool | Stale-data disclosure rather than hard failure if recomputation is overdue |
| Prediction | Model inference orchestration | Historical data, model reference | Prediction records | Analytics, Weather, Demographics, etc. (feature sources) | Direct (Prediction tables) + reads | Indirect | Yes | Called by `request_prediction` tool | Explicit insufficient-data result (NFR-031), never a fabricated forecast |
| Simulation | Sandboxed scenario execution | Scenario definition, baseline reference | Scenario Output records | Prediction, Analytics, GIS Service, Transportation | Sandboxed clone-and-discard (AD-DE-004) | Indirect | Yes | Called by `create_scenario`/`run_scenario` tools | Simulation failure never partially commits a result; either a complete Scenario Output or an explicit failure |
| Recommendation | Evidence-linked recommendation generation and review-state management | Analytics, Prediction, Simulation outputs | Recommendation, Recommendation Evidence records | Analytics, Prediction, Simulation | Direct + evidence references | Indirect | Yes | Called by `get_recommendation` tool | A recommendation is never presented as generated if its evidence assembly was incomplete — an incomplete generation is a failure, not a partial recommendation |

## 4. AI Orchestration Service (Cross-Cutting, Not a Domain)

| Aspect | Detail |
|---|---|
| Responsibility | Receives natural-language queries, performs intent understanding and planning, selects and invokes Typed AI Tools ([ai-tool-contracts.md](ai-tool-contracts.md)), composes the final response |
| Inputs | User Query |
| Outputs | AI Response, Agent Execution/Tool Execution audit records |
| Dependencies | Every Domain Service above, exclusively via Typed AI Tools (never direct) |
| Data Access | None directly — all access mediated through tools (AD-API-002) |
| Failure Handling | Explicit "cannot answer" per FR-022, never a fabricated response |

## 5. Evidence / Provenance Service (Cross-Cutting, Not a Domain)

| Aspect | Detail |
|---|---|
| Responsibility | Assembles and serves provenance metadata alongside any factual claim; backs [api-contracts.md](api-contracts.md) Operation 17 |
| Inputs | A reference to a fact/claim (an Analytical Result, Prediction, Scenario Output, or AI Response citation) |
| Outputs | Provenance chain detail ([evidence-provenance-flow.md](evidence-provenance-flow.md)) |
| Dependencies | Every Domain Service, read-only |
| Data Access | Read-only, metadata-focused |
| Failure Handling | A missing provenance link is itself surfaced as a data-quality issue, not hidden |

## 6. Audit Service (Cross-Cutting, Not a Domain)

| Aspect | Detail |
|---|---|
| Responsibility | Receives and persists Audit Event and Tool Execution records from every other service |
| Inputs | Logged events from any service |
| Outputs | Append-only Audit Event/Tool Execution records |
| Dependencies | None (a terminal/sink service) |
| Data Access | Write-only from other services' perspective; read access is Administrator-scoped ([authentication-authorization.md](authentication-authorization.md)) |
| Failure Handling | An audit-write failure is treated as a serious fault (per Fail-Safe Behavior) — the triggering operation itself may still complete, but the failure to audit-log is separately alerted, never silently dropped |

## 7. Service Interaction Rules

- A Domain Service calls another Domain Service's declared interface only (never reaches into another service's data access layer directly) — restated from [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 5.
- The GIS Service (Section 8 of [api-architecture.md](api-architecture.md); full detail [gis-service-design.md](gis-service-design.md)) is called by every domain service needing spatial computation — it is not duplicated per-domain.
- The Analytics Service reads from every domain but is never read *from* by them for raw domain data (Analytics consumes; it is not a source domains depend on).

## 8. Milestone Traceability

| Service | First Active |
|---|---|
| Geography | M1 |
| Demographics, Healthcare, Infrastructure, Transportation, Agriculture, Weather, Disaster, Analytics | M2 — Future |
| AI Orchestration, Evidence/Provenance (AI-facing) | M3 — Future |
| Prediction | M4 — Future |
| Simulation | M5 — Future |
| Recommendation | M6 — Future |
| Audit | M1 (administrative), extended M6 — Future (AI review) |

## 9. Open Decisions

- Whether any service is ever extracted from the modular monolith into an independent deployment (the same open option flagged in [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 2, unchanged by this document — most likely candidates remain AI Orchestration and, later, Simulation given their distinct compute profile).
- Exact inter-service call mechanism (in-process function call, per AD-003 [system-architecture.md](../02_System_Architecture/system-architecture.md)) — unchanged, not re-decided here.
