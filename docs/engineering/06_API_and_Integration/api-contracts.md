---
Document Name: API Contracts
Document ID: ED-API-CONTRACT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# API Contracts

## 1. Purpose

This document defines conceptual contracts for DistrictMind's core API operations. Every operation is described structurally (name, purpose, input, output, validation, authorization, errors, provenance, sync/async) — no implementation code, no OpenAPI syntax, no request/response body schemas in code form.

## 2. Contract Format

Each operation below follows the same table structure for consistency, per [api-design-principles.md](api-design-principles.md) Section 5.

## 3. Operation 1 — Get District

| Field | Value |
|---|---|
| Purpose | Retrieve a single district's core attributes |
| Input | District identifier |
| Output | District name, code, boundary reference, parent state, provenance metadata |
| Validation | Identifier must be well-formed; existence checked by the service, not the API boundary |
| Authorization | Any authenticated role (Public Viewer candidate) |
| Errors | Not found; authentication/authorization failure ([api-design-principles.md](api-design-principles.md) Section 12) |
| Provenance | Source + ingestion timestamp + current version marker |
| Sync/Async | Synchronous |

## 4. Operation 2 — Get District Map Data

| Field | Value |
|---|---|
| Purpose | Retrieve boundary geometry for a district and its constituent mandals/villages, for GIS rendering |
| Input | District identifier; optional zoom/detail-level hint (per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15's level-of-detail strategy) |
| Output | Geometry (simplified or full-detail per hint), facility/road layer references |
| Validation | Identifier well-formed; detail-level hint within a supported range |
| Authorization | Any authenticated role |
| Errors | Not found; unsupported detail level |
| Provenance | Boundary version marker ([temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 3) |
| Sync/Async | Synchronous |

## 5. Operation 3 — Get District Demographics

| Field | Value |
|---|---|
| Purpose | Retrieve population observations for a district (current + historical, per FR-026) |
| Input | District identifier; optional date range |
| Output | Population Observation records, paginated |
| Validation | Date range well-formed, not in the future beyond a Predicted-state boundary (per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 5) |
| Authorization | Any authenticated role |
| Errors | Not found; invalid date range; data unavailable (distinct from not-found — [api-design-principles.md](api-design-principles.md) Section 12) |
| Provenance | Source census cycle/portal + effective year per record |
| Sync/Async | Synchronous |

## 6. Operation 4 — Get Healthcare Facilities

| Field | Value |
|---|---|
| Purpose | Retrieve health facilities within a district, optionally filtered by type and coverage criteria |
| Input | District identifier; optional facility type filter, optional coverage-radius parameter |
| Output | Health Facility records with location, capacity (if available), and (if coverage-radius supplied) a coverage-gap flag per village — this is where Operation 4 composes with a spatial query ([spatial-query-services.md](spatial-query-services.md)) rather than being purely a flat entity list |
| Validation | Facility type against the known enumeration ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 3); coverage radius within a sane bound |
| Authorization | Any authenticated role |
| Errors | Not found; invalid filter value |
| Provenance | Source department + ingestion timestamp per facility |
| Sync/Async | Synchronous for a district-scoped query; the underlying coverage-gap computation may be served from a precomputed Analytical Result ([database-normalization.md](../05_Database_Design/database-normalization.md) Section 6) to keep this synchronous |

## 7. Operation 5 — Get Infrastructure

| Field | Value |
|---|---|
| Purpose | Retrieve schools, government offices, and water bodies within a district |
| Input | District identifier; optional type filter |
| Output | Infrastructure entity records with location |
| Validation | Type filter against known enumeration |
| Authorization | Any authenticated role |
| Errors | Not found; invalid filter |
| Provenance | Source + ingestion timestamp |
| Sync/Async | Synchronous |

## 8. Operation 6 — Get Transportation Network

| Field | Value |
|---|---|
| Purpose | Retrieve road/road segment geometry for a district, for rendering and routing input |
| Input | District identifier; optional detail-level hint |
| Output | Road/Road Segment geometry, road class |
| Validation | Same as Operation 2 |
| Authorization | Any authenticated role |
| Errors | Not found; unsupported detail level |
| Provenance | Source (OSM) + ingestion timestamp |
| Sync/Async | Synchronous |

## 9. Operation 7 — Get Weather

| Field | Value |
|---|---|
| Purpose | Retrieve weather observations (rainfall, temperature) for a district's stations |
| Input | District identifier; observation type filter; optional date range |
| Output | Weather Observation records, paginated |
| Validation | Observation type against known enumeration; date range well-formed |
| Authorization | Any authenticated role |
| Errors | Not found; invalid filter; data unavailable (per known gaps in source cadence — [temporal-data.md](../04_Data_Engineering/temporal-data.md) Section 5) |
| Provenance | Source (IMD-or-equivalent) + station + observation date |
| Sync/Async | Synchronous |

## 10. Operation 8 — Get Disaster / Risk Data

| Field | Value |
|---|---|
| Purpose | Retrieve disaster events and, where available, risk indicators for a district |
| Input | District identifier; optional event-type/time-range filter |
| Output | Disaster Event and Impact Observation records; Risk Indicator values where computed (clearly labeled Derived or Predicted, per [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md)) |
| Validation | Filter values against known enumerations |
| Authorization | Any authenticated role (elevated role possibly required for sensitive events — Under Evaluation, [authentication-authorization.md](authentication-authorization.md)) |
| Errors | Not found; data unavailable (given the Disaster domain's unconfirmed source status — [data-sources.md](../04_Data_Engineering/data-sources.md)) |
| Provenance | Source (Proposed/inferred) or Model Execution Metadata reference, explicitly distinguished per record |
| Sync/Async | Synchronous |

## 11. Operation 9 — Run Spatial Query

| Field | Value |
|---|---|
| Purpose | Execute a bounded spatial operation (containment, proximity, buffer, intersection, nearest-feature — [spatial-query-services.md](spatial-query-services.md)) |
| Input | Operation type (from a fixed allow-list); target geometry/entity reference(s); operation-specific parameters (e.g., a distance threshold) |
| Output | Matching entity references, with the computed spatial relationship value (distance, overlap area, etc.) |
| Validation | Operation type against the fixed allow-list — no free-form spatial expression accepted; geometry inputs validated per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 4 |
| Authorization | Any authenticated role for read-only spatial queries; the AI Agent Layer accesses this exclusively via `spatial_query` in [ai-tool-contracts.md](ai-tool-contracts.md) |
| Errors | Invalid operation type; malformed geometry; query too broad (a result-size guard, per [database-performance.md](../05_Database_Design/database-performance.md) Section 10) |
| Provenance | Computation timestamp; the specific dataset version(s) the geometries were read from |
| Sync/Async | Synchronous for bounded queries; escalates to asynchronous if the requested scope (e.g., statewide) exceeds a synchronous-safe bound |

## 12. Operation 10 — Get Analytical Indicator

| Field | Value |
|---|---|
| Purpose | Retrieve a specific Analytical Result (indicator value) for a target entity |
| Input | Indicator code; target entity reference; optional time range for trend retrieval (FR-026) |
| Output | Analytical Result record(s), including computation version and timestamp |
| Validation | Indicator code against Indicator Definition ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-ANA-001); target entity existence |
| Authorization | Any authenticated role |
| Errors | Unknown indicator; not found; data unavailable |
| Provenance | Computation logic version ([data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 5) |
| Sync/Async | Synchronous (reads a precomputed value, per [analytical-data-model.md](../05_Database_Design/analytical-data-model.md) Section 7) |

## 13. Operation 11 — Request Prediction

| Field | Value |
|---|---|
| Purpose | Trigger a new model inference for a target entity/indicator (a COMMAND, distinct from retrieving an existing forecast) |
| Input | Model/indicator identifier; target entity reference; forecast horizon |
| Output | A job/request reference (for async polling), eventually resolving to a Prediction record |
| Validation | Sufficient historical data exists for the target entity (checked by the Prediction Service, not the API boundary — [ai-architecture.md](../02_System_Architecture/ai-architecture.md) Section 15) |
| Authorization | Analyst role or above ([authentication-authorization.md](authentication-authorization.md)) |
| Errors | Insufficient data (explicit, not a generic failure — NFR-031); model unavailable |
| Provenance | Resulting Prediction references Model Execution Metadata (E-PRD-001) and its input Dataset Version |
| Sync/Async | Asynchronous |

## 14. Operation 12 — Create Scenario

| Field | Value |
|---|---|
| Purpose | Define a new hypothetical scenario (a COMMAND — defining, not yet executing) |
| Input | Scenario type (from a fixed allow-list, e.g. "rainfall change," "road closure" — Blueprint §13.2); structured parameters ([database-normalization.md](../05_Database_Design/database-normalization.md) Section 2); baseline reference (defaults to current state if unspecified) |
| Output | A Scenario record with a stable identifier, status = defined |
| Validation | Scenario type against the allow-list; parameters validated against that type's expected shape (Domain-layer validation, [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 8) |
| Authorization | Analyst/District Officer or above |
| Errors | Invalid scenario type; invalid parameters |
| Provenance | Requesting user, submission timestamp |
| Sync/Async | Synchronous (definition only — no computation yet) |

## 15. Operation 13 — Run Scenario

| Field | Value |
|---|---|
| Purpose | Execute a previously defined Scenario in the sandboxed Simulation Engine (a COMMAND) |
| Input | Scenario identifier |
| Output | A job/request reference resolving to Scenario Output record(s) |
| Validation | Scenario exists and is in a runnable status |
| Authorization | Same as Operation 12 |
| Errors | Scenario not found; scenario already running/completed (idempotency handling, [api-design-principles.md](api-design-principles.md) Section 16); simulation failure |
| Provenance | Scenario Output references the originating Scenario and the baseline snapshot (AD-DE-004 — sandboxed, never written to production data) |
| Sync/Async | Asynchronous |

## 16. Operation 14 — Retrieve Scenario Result

| Field | Value |
|---|---|
| Purpose | Retrieve the Scenario Output for a completed (or in-progress) Scenario run |
| Input | Scenario identifier |
| Output | Scenario Output record(s): baseline value, scenario value, delta, per affected entity |
| Validation | Scenario identifier well-formed |
| Authorization | Same as Operation 12 |
| Errors | Not found; still running (a distinct status, not an error) |
| Provenance | As per Operation 13's output |
| Sync/Async | Synchronous (reading an already-produced or in-progress result) |

## 17. Operation 15 — Retrieve Recommendation

| Field | Value |
|---|---|
| Purpose | Retrieve a Recommendation with its full evidence chain |
| Input | Recommendation identifier (or a list query scoped to a district/type) |
| Output | Recommendation record: type, target, score, justification text, status, and Recommendation Evidence references resolving to the specific Analytical Result/Prediction/Scenario Output records cited (FR-031) |
| Validation | Identifier well-formed |
| Authorization | Any authenticated role for read; District Officer/Administrator for the separate review command ([api-resource-model.md](api-resource-model.md) Section 5) |
| Errors | Not found |
| Provenance | Full evidence chain, per [evidence-provenance-flow.md](evidence-provenance-flow.md) |
| Sync/Async | Synchronous |

## 18. Operation 16 — Submit Natural-Language Query

| Field | Value |
|---|---|
| Purpose | Submit a user's natural-language question to the AI Agent Layer (FR-020) |
| Input | Query text; conversation/session context |
| Output | An AI Response: grounded answer with evidence citations, or an explicit "cannot answer" result (FR-021/FR-022) |
| Validation | Query text non-empty, within a maximum length; treated as untrusted input throughout ([security-architecture.md](../02_System_Architecture/security-architecture.md) Section 6) |
| Authorization | Any authenticated role; the response is scoped to what that role could otherwise see through the dashboard ([ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) Section 6) |
| Errors | AI provider unavailable; no relevant data found (returns the explicit cannot-answer response, not an error) |
| Provenance | AI Response references every Tool Execution/Evidence item it cites |
| Sync/Async | Sync-initiated, potentially streamed or async-completed depending on response latency (Section 14, [ai-architecture.md](../02_System_Architecture/ai-architecture.md)) |

## 19. Operation 17 — Retrieve AI Evidence

| Field | Value |
|---|---|
| Purpose | Retrieve the specific Evidence (retrieved data + provenance) underlying a given AI Response, for user inspection or audit |
| Input | AI Response identifier |
| Output | The list of cited Evidence items, each resolving to its underlying Analytical Result/Prediction/Scenario Output/Observed record and provenance metadata |
| Validation | Identifier well-formed |
| Authorization | Any authenticated role that could view the original AI Response |
| Errors | Not found |
| Provenance | This operation *is* a provenance-retrieval operation — its output is [evidence-provenance-flow.md](evidence-provenance-flow.md)'s chain made queryable |
| Sync/Async | Synchronous |

## 20. Operation 18 — Retrieve AI Execution / Audit Information

| Field | Value |
|---|---|
| Purpose | Retrieve the Agent Execution and Tool Execution trail for a given AI interaction, for administrative/audit review |
| Input | User Query or Agent Execution identifier |
| Output | The full sequence of Agent Executions and Tool Executions ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-AI-002/003), including arguments and result summaries |
| Validation | Identifier well-formed |
| Authorization | Administrator role (audit-scoped, not a general-purpose read) |
| Errors | Not found; unauthorized |
| Provenance | This operation exposes provenance/audit data directly — no further chain needed |
| Sync/Async | Synchronous |

## 21. Contract Coverage Summary

All 18 operations named in the milestone brief are covered above (Operations 1–18, Sections 3–20).

## 22. Milestone Traceability

| Operations | First Available |
|---|---|
| 1, 2 (District, Map Data) | M1 |
| 3–8 (Demographics through Disaster), 9–10 (Spatial Query, Analytics) | M2 — Future |
| 16–18 (AI Query, Evidence, Audit) | M3 — Future |
| 11 (Request Prediction) | M4 — Future |
| 12–14 (Scenario Create/Run/Retrieve) | M5 — Future |
| 15 (Recommendation) | M6 — Future |

## 23. Open Decisions

- Exact request/response field names and types (deferred to implementation-time OpenAPI authoring, explicitly out of scope here).
- Streaming vs. polling for Operation 16's response delivery — Under Evaluation.
