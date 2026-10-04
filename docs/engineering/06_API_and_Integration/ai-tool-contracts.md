---
Document Name: AI Tool Contracts
Document ID: ED-API-TOOL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# AI Tool Contracts

## 1. Purpose

This document defines conceptual Typed AI Tools — the exclusive mechanism by which any AI agent accesses DistrictMind data (AD-API-002, [api-architecture.md](api-architecture.md)). Tool names are **conceptual identifiers only**; no tool is implemented here.

## 2. The Non-Negotiable Rules

Restated from the milestone brief and every prior AD-DE-005/AD-DB-006/AD-API-002 decision, because this document is where they matter most concretely:
- **The AI must never receive a raw database connection.**
- **The AI must never execute unrestricted SQL.**
- **The AI must never modify Source of Truth data directly.**

Every tool contract below is designed so that even a maximally permissive interpretation of its inputs cannot violate these three rules.

## 3. Tool Contract Format

Each tool is documented with: name, purpose, input, output, authorization, validation, data source, freshness, evidence, error behavior, audit.

## 4. `get_district`

| Field | Detail |
|---|---|
| Purpose | Retrieve core district attributes |
| Input | District identifier or name (resolved via search, not arbitrary text matching against internal storage) |
| Output | District record + provenance metadata |
| Authorization | Inherits caller's role ([authentication-authorization.md](authentication-authorization.md) Section 8) |
| Validation | Identifier/name resolves to exactly one known district, or an explicit ambiguous/not-found result |
| Data Source | Geography Service ([service-layer-design.md](service-layer-design.md)) |
| Freshness | Boundary version timestamp |
| Evidence | The District record itself, with source/ingestion metadata |
| Error Behavior | Explicit not-found; no fallback to model guessing |
| Audit | Tool Execution logged with input/output summary |

## 5. `get_demographics`

| Field | Detail |
|---|---|
| Purpose | Retrieve population observations for a district/village |
| Input | District or village identifier; optional date range |
| Output | Population Observation records, bounded (Section 9 of [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md)) |
| Authorization | Inherits caller's role |
| Validation | Identifier resolves; date range well-formed |
| Data Source | Demographics Service |
| Freshness | Effective year + ingestion timestamp per record |
| Evidence | Each returned observation, individually citable |
| Error Behavior | Explicit "no data for this period," not a zero-filled fabrication |
| Audit | Logged |

## 6. `get_healthcare`

| Field | Detail |
|---|---|
| Purpose | Retrieve health facilities and, optionally, coverage status |
| Input | District/village identifier; optional facility type filter; optional coverage radius |
| Output | Health Facility records, optionally annotated with coverage-gap flags |
| Authorization | Inherits caller's role |
| Validation | Filter/radius within allowed bounds |
| Data Source | Healthcare Service, composing GIS Service for coverage |
| Freshness | Ingestion timestamp per facility; computation timestamp for coverage |
| Evidence | Facility records + (if requested) the coverage computation's inputs |
| Error Behavior | Explicit data-unavailable if no facilities are ingested for the area yet |
| Audit | Logged |

## 7. `get_infrastructure`

| Field | Detail |
|---|---|
| Purpose | Retrieve schools, government offices, water bodies |
| Input | District/village identifier; optional type filter |
| Output | Infrastructure entity records |
| Authorization | Inherits caller's role |
| Validation | Type filter against known enumeration |
| Data Source | Infrastructure Service |
| Freshness | Ingestion timestamp |
| Evidence | Records returned |
| Error Behavior | Explicit not-found/data-unavailable |
| Audit | Logged |

## 8. `get_transportation`

| Field | Detail |
|---|---|
| Purpose | Retrieve road network data or routing results |
| Input | District identifier, or origin/destination pair for routing |
| Output | Road geometry, or a route with travel time/distance |
| Authorization | Inherits caller's role |
| Validation | Origin/destination resolve to known, connected graph nodes |
| Data Source | Transportation Service, GIS Service |
| Freshness | Road data ingestion timestamp |
| Evidence | Road/route data, with source (OSM) attribution |
| Error Behavior | Explicit "no route" if the graph is disconnected between the requested points |
| Audit | Logged |

## 9. `get_agriculture`

| Field | Detail |
|---|---|
| Purpose | Retrieve agricultural observations |
| Input | District/village identifier; optional crop/season filter |
| Output | Agricultural Observation records |
| Authorization | Inherits caller's role |
| Validation | Filter against known enumeration |
| Data Source | Agriculture Service |
| Freshness | Season/ingestion timestamp |
| Evidence | Records returned |
| Error Behavior | Explicit not-found/data-unavailable |
| Audit | Logged |

## 10. `get_weather`

| Field | Detail |
|---|---|
| Purpose | Retrieve weather observations |
| Input | District/station identifier; observation type; optional date range |
| Output | Weather Observation records |
| Authorization | Inherits caller's role |
| Validation | Observation type against known enumeration; date range well-formed |
| Data Source | Weather Service |
| Freshness | Observation date + ingestion timestamp |
| Evidence | Records returned, with explicit gap disclosure for missing periods ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 5) |
| Error Behavior | Explicit data-unavailable |
| Audit | Logged |

## 11. `get_disaster_risk`

| Field | Detail |
|---|---|
| Purpose | Retrieve disaster events and, where computed, risk indicators |
| Input | District/village identifier; optional event-type/time-range filter |
| Output | Disaster Event, Impact Observation, and (if available) Risk Indicator records, each explicitly labeled Observed, Derived, or Predicted ([digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md)) |
| Authorization | Inherits caller's role; possibly elevated per [authentication-authorization.md](authentication-authorization.md) Section 6 |
| Validation | Filter against known enumeration |
| Data Source | Disaster Service |
| Freshness | Event timestamp/version + ingestion or computation timestamp |
| Evidence | Records returned, with state-category label always present |
| Error Behavior | Explicit data-unavailable given the domain's currently unconfirmed source status |
| Audit | Logged |

## 12. `spatial_query`

| Field | Detail |
|---|---|
| Purpose | Execute a bounded spatial operation from the fixed set in [spatial-query-services.md](spatial-query-services.md) |
| Input | Operation type (allow-listed: distance, buffer, intersection, containment, nearest-feature); target geometry/entity references; operation parameters |
| Output | The operation's result (Section 2–6 of [spatial-query-services.md](spatial-query-services.md)) |
| Authorization | Inherits caller's role |
| Validation | Operation type against the fixed allow-list; geometry validity |
| Data Source | GIS Service |
| Freshness | Source dataset version(s) of the geometries involved |
| Evidence | The computed spatial relationship, with its inputs' provenance |
| Error Behavior | Explicit failure for invalid geometry or an unsupported operation — never a best-effort guess |
| Audit | Logged |

## 13. `coverage_analysis`

| Field | Detail |
|---|---|
| Purpose | Compute population/village coverage against a facility type and distance threshold |
| Input | District/village scope; facility type; distance threshold |
| Output | Coverage-gap set + uncovered-population figure |
| Authorization | Inherits caller's role |
| Validation | Threshold within a sane bound |
| Data Source | GIS Service (composed, per [spatial-query-services.md](spatial-query-services.md) Section 7) |
| Freshness | Underlying village/facility dataset versions |
| Evidence | The full coverage computation's inputs, per [spatial-query-services.md](spatial-query-services.md) Section 7's provenance note |
| Error Behavior | Explicit failure if underlying data is unavailable, not a partial/misleading result |
| Audit | Logged |

## 14. `accessibility_analysis`

| Field | Detail |
|---|---|
| Purpose | Compute travel-time/distance-based accessibility between an origin and a destination type |
| Input | Origin identifier; destination type or specific destination; optional hypothetical modification reference (for Scenario use) |
| Output | Route + travel-time/distance, or a Scenario-flagged equivalent if run within a sandbox |
| Authorization | Inherits caller's role; Scenario-mode requires Analyst/District Officer role ([authentication-authorization.md](authentication-authorization.md)) |
| Validation | Same as `get_transportation` |
| Data Source | GIS Service, Transportation Service, (for Scenario mode) Simulation Service |
| Freshness | Same as `get_transportation`; Scenario mode additionally carries its baseline snapshot reference |
| Evidence | Route data + explicit Observed/Scenario flag |
| Error Behavior | Explicit "no route" |
| Audit | Logged |

## 15. `get_indicator`

| Field | Detail |
|---|---|
| Purpose | Retrieve a computed Analytical Result |
| Input | Indicator code; target entity; optional time range |
| Output | Analytical Result record(s) |
| Authorization | Inherits caller's role |
| Validation | Indicator code against Indicator Definition |
| Data Source | Analytics Service |
| Freshness | Computation timestamp |
| Evidence | The Analytical Result record + its computation-logic version |
| Error Behavior | Explicit unknown-indicator or data-unavailable |
| Audit | Logged |

## 16. `request_prediction`

| Field | Detail |
|---|---|
| Purpose | Trigger or retrieve a model prediction |
| Input | Model/indicator identifier; target entity; horizon |
| Output | A Prediction record (or an async job reference) with confidence indicator (NFR-032) |
| Authorization | Analyst role or above |
| Validation | Sufficient historical data exists (checked by Prediction Service) |
| Data Source | Prediction Service |
| Freshness | Model execution timestamp + input Dataset Version |
| Evidence | Model/version metadata, confidence |
| Error Behavior | Explicit insufficient-data result, never a fabricated forecast |
| Audit | Logged |

## 17. `create_scenario`

| Field | Detail |
|---|---|
| Purpose | Define a hypothetical scenario |
| Input | Scenario type (allow-listed); structured parameters; optional baseline reference |
| Output | A Scenario record (status = defined) |
| Authorization | Analyst/District Officer role or above |
| Validation | Scenario type + parameters against the type's expected shape |
| Data Source | Simulation Service |
| Freshness | N/A (definition only, not yet computed) |
| Evidence | N/A until run |
| Error Behavior | Explicit invalid-type/invalid-parameter rejection |
| Audit | Logged |

## 18. `run_scenario`

| Field | Detail |
|---|---|
| Purpose | Execute a defined Scenario in the sandbox |
| Input | Scenario identifier |
| Output | Scenario Output record(s), or an async job reference |
| Authorization | Same as `create_scenario` |
| Validation | Scenario exists and is runnable |
| Data Source | Simulation Service (sandboxed, AD-DE-004) |
| Freshness | Baseline snapshot reference |
| Evidence | Scenario Output, explicitly labeled Scenario State — never conflated with Observed data |
| Error Behavior | Explicit simulation-failure, never a partial/silently-incomplete result |
| Audit | Logged |

## 19. `get_recommendation`

| Field | Detail |
|---|---|
| Purpose | Retrieve a Recommendation with its evidence chain |
| Input | Recommendation identifier, or a scope (district/type) for listing |
| Output | Recommendation record + Recommendation Evidence resolving to underlying Analytical Result/Prediction/Scenario Output records |
| Authorization | Inherits caller's role for read; review actions require District Officer/Administrator (a separate, non-tool, human-only operation, per FR-032) |
| Validation | Identifier well-formed |
| Data Source | Recommendation Service |
| Freshness | Recommendation generation timestamp |
| Evidence | Full chain, per [evidence-provenance-flow.md](evidence-provenance-flow.md) |
| Error Behavior | Explicit not-found |
| Audit | Logged |

## 20. Why No Tool Can Violate the Non-Negotiable Rules

Every tool above (a) reads from a specific, named Domain Service via its own governed data-access layer — never a database credential; (b) accepts only allow-listed operation types and validated, typed parameters — never a raw query string; and (c) is exclusively read-oriented except `create_scenario`/`run_scenario`, whose only "write" path is into the sandboxed Scenario/Scenario Output tables (AD-DE-004), never into Source of Truth data. This is the tool-by-tool realization of Section 2's rules, not merely an assertion of them.

## 21. Milestone Traceability

See [ai-agent-integration.md](ai-agent-integration.md) Section 8 — each tool's milestone matches its underlying Domain Service's first-availability milestone from [service-layer-design.md](service-layer-design.md) Section 8.

## 22. Open Decisions

- Exact parameter schemas per tool (deferred to implementation).
- Whether `get_indicator` and `coverage_analysis`/`accessibility_analysis` are ever merged into fewer, more general tools, or kept separate — **Under Evaluation**, a design-ergonomics question not resolved here.
