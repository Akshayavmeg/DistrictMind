---
Document Name: API Resource Model
Document ID: ED-API-RES-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# API Resource Model

## 1. Purpose

This document maps the logical data/database entities from `05_Database_Design/` to conceptual API resources. Paths shown are **illustrative examples**, not implemented or finalized endpoints — per [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8's conventions.

## 2. Resource Inventory

| Resource (Illustrative) | Purpose | Consumer | Source Domain | Read/Write | Authorization | Spatial | Temporal | Provenance Requirement |
|---|---|---|---|---|---|---|---|---|
| `/districts` | List/search districts | Frontend, AI | Geography (E-GEO-002) | Read | Any authenticated role (Public Viewer candidate — [authentication-authorization.md](authentication-authorization.md)) | Yes (boundary) | Low | Source + ingestion timestamp |
| `/districts/{id}` | District detail | Frontend, AI | Geography | Read | Same as above | Yes | Low | Same |
| `/districts/{id}/map-data` | District boundary + mandal/village layer geometry | Frontend (GIS rendering) | Geography, GIS Service | Read | Same as above | Yes | Low | Same |
| `/districts/{id}/population` | Population observations for a district | Frontend, AI | Demographics (E-DEM-001) | Read | Same as above | No | Yes (time series) | Source (census cycle) + observation year |
| `/districts/{id}/healthcare` | Health facilities and coverage | Frontend, AI | Healthcare (E-HLT-001) | Read | Same as above | Yes | Low | Source department + ingestion timestamp |
| `/districts/{id}/infrastructure` | Schools, government offices, water bodies | Frontend, AI | Infrastructure (E-INF-001–003) | Read | Same as above | Yes | Low | Same |
| `/districts/{id}/transportation` | Road network | Frontend, AI | Transportation (E-TRN-001–002) | Read | Same as above | Yes | Low | Source (OSM) + ingestion timestamp |
| `/districts/{id}/agriculture` | Agricultural observations | Frontend, AI | Agriculture (E-AGR-001) | Read | Same as above | No | Yes | Source + season |
| `/districts/{id}/weather` | Weather observations | Frontend, AI | Weather (E-WTH-001–002) | Read | Same as above | Yes (station location) | Yes | Source (IMD-or-equivalent) + observation date |
| `/districts/{id}/disasters` | Disaster events and impact | Frontend, AI | Disaster (E-DIS-001–002) | Read | Same as above (may require elevated role for sensitive events — Under Evaluation) | Yes | Yes | Source (Proposed/inferred, per [data-sources.md](../04_Data_Engineering/data-sources.md)) |
| `/districts/{id}/analytics` | Analytical Results/indicators | Frontend, AI | Analytics (E-ANA-001–002) | Read | Same as above | Indirect | Yes | Computation version + timestamp |
| `/districts/{id}/predictions` | Forecasts/risk scores | Frontend, AI | Prediction (E-PRD-001–002) | Read (request/submit is a command — Section 4) | Same as above | Indirect | Yes (forecast horizon) | Model/version + confidence (NFR-032) |
| `/districts/{id}/scenarios` | Scenario definitions and results | Frontend, AI | Simulation (E-SIM-001–002) | Read (list/detail); Write via command resource (Section 4) | Analyst/District Officer or above ([authentication-authorization.md](authentication-authorization.md)) | Indirect | Yes | Baseline snapshot reference |
| `/districts/{id}/recommendations` | Recommendations | Frontend, AI | Recommendation (E-REC-001–002) | Read (list/detail); status change via command resource | District Officer/Administrator for review actions | Indirect | Yes | Full evidence chain ([evidence-provenance-flow.md](evidence-provenance-flow.md)) |

## 3. Cross-Cutting Resource Notes

- Every `{id}` above resolves against the stable assigned identifier strategy defined in [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4, never a mutable natural key (e.g., district name).
- Every list resource supports pagination/filtering/sorting per [api-design-principles.md](api-design-principles.md) Sections 6–8.
- Sub-resources (`/districts/{id}/healthcare`, etc.) may themselves support drill-down to mandal/village granularity (e.g., `/districts/{id}/mandals/{mandalId}/healthcare`) — not enumerated exhaustively here, following the same pattern as the district-level resource.

## 4. READ Resources vs. COMMAND/Operation Resources

This distinction is critical and explicitly required by the milestone brief.

| Type | Definition | Examples |
|---|---|---|
| **READ resource** | Retrieves existing state; no side effect; safe to retry/cache | `/districts/{id}` (retrieving a district), `/districts/{id}/healthcare` (retrieving facilities), `/districts/{id}/predictions/{predictionId}` (retrieving an already-computed forecast) |
| **COMMAND/operation resource** | Triggers a computation or state change; not safe to blindly retry without idempotency handling ([api-design-principles.md](api-design-principles.md) Section 16); may be asynchronous | `/districts/{id}/predictions:request` (requesting a *new* prediction run — a command, distinct from reading an existing one), `/scenarios` (creating a scenario — a command), `/scenarios/{id}:run` (running a scenario — a command, asynchronous per Section 18 of [api-architecture.md](api-architecture.md)), `/recommendations/{id}:review` (a human review action — a command, audit-logged per FR-032) |

**Retrieving a district vs. running a scenario** (the milestone brief's own example): `GET /districts/{id}` is a pure READ — no computation, no side effect, cacheable. `POST /districts/{id}/scenarios` (create) followed by a `:run` command is fundamentally different — it triggers sandboxed computation (AD-DE-004), is asynchronous, is not idempotent without an explicit token, and produces new Scenario Output records rather than merely retrieving existing state.

## 5. Command Resources in Detail

| Command Resource (Illustrative) | Purpose | Sync/Async | Idempotent? |
|---|---|---|---|
| `/districts/{id}/predictions:request` | Trigger a new prediction run for an indicator | Async | Only with an explicit idempotency token |
| `/scenarios` (POST — create) | Define a new Scenario | Sync (the definition itself is fast; execution is separate) | No — each call creates a new Scenario |
| `/scenarios/{id}:run` | Execute a defined Scenario in the sandbox | Async | Only with an explicit idempotency token |
| `/recommendations/{id}:review` | Human accept/reject action on a Recommendation | Sync (fast state transition + audit log write) | Yes — reviewing an already-reviewed recommendation with the same decision is a no-op |
| `/ai/query` | Submit a natural-language question | Sync-initiated, potentially async-completed (streaming or polling) | No — each submission is a new User Query |

## 6. What This Model Deliberately Avoids

- No resource exposes raw database table structure directly — every resource shape is the API's own contract, decoupled from physical schema (per [database-design.md](../05_Database_Design/database-design.md) Section 4's Domain-layer independence principle, extended to the API).
- No resource grants write access to Source of Truth data through a generic "update" operation — corrections to Observed data flow through the ingestion pipeline ([data-ingestion.md](../04_Data_Engineering/data-ingestion.md)), not an ad hoc API PUT/PATCH, preserving Data Integrity.

## 7. Milestone Traceability

| Resource Group | First Available |
|---|---|
| `/districts`, `/districts/{id}`, `/districts/{id}/map-data` | M1 |
| Population, Healthcare, Infrastructure, Transportation, Agriculture, Weather, Disaster, Analytics resources | M2 — Future |
| `/ai/query` | M3 — Future |
| Prediction resources (read + request command) | M4 — Future |
| Scenario resources (read + create/run commands) | M5 — Future |
| Recommendation resources (read + review command) | M6 — Future |

## 8. Open Decisions

- Exact URL path conventions beyond the illustrative examples above (finalized at implementation time).
- Whether command resources use a colon-suffix convention (`:run`) or a sub-path convention (`/run`) — both are illustrative here; **Under Evaluation**.
- Mandal/village-level drill-down resource granularity (Section 3) — not exhaustively specified in this milestone.
