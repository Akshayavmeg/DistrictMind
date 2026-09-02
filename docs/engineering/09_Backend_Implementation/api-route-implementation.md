---
Document Name: API Route Implementation
Document ID: ED-BEIMPL-ROUTE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# API Route Implementation

## 1. Purpose

This document translates [api-contracts.md](../06_API_and_Integration/api-contracts.md) and [api-resource-model.md](../06_API_and_Integration/api-resource-model.md) — the existing source of truth — into an implementation blueprint at the route-group level. **No new contract is invented here**; every route group below traces to an already-documented resource or operation. No OpenAPI file or route source code exists in this document.

## 2. Route Groups

Only route groups already supported by existing API documentation are included.

| Route Group | Traces To |
|---|---|
| `/districts` | [api-resource-model.md](../06_API_and_Integration/api-resource-model.md) Section 2, District resources |
| `/geography` (mandal/village drill-down) | Same document, Section 3's drill-down note |
| `/healthcare` | Section 2, Healthcare resource |
| `/transportation` | Section 2, Transportation resource |
| `/agriculture` | Section 2, Agriculture resource |
| `/weather` | Section 2, Weather resource |
| `/disasters` | Section 2, Disaster resource |
| `/infrastructure` | Section 2, Infrastructure resource |
| `/analytics` | Section 2, Analytics resource |
| `/predictions` | Section 2, Prediction resource + Section 5 command resources |
| `/scenarios` | Section 2, Scenario resource + Section 5 command resources |
| `/simulations` (scenario execution/results) | Section 4 of [api-contracts.md](../06_API_and_Integration/api-contracts.md), Operations 13–14 |
| `/recommendations` | Section 2, Recommendation resource + Section 5 command resources |
| `/ai` | Operations 16–18 of [api-contracts.md](../06_API_and_Integration/api-contracts.md) |
| `/evidence` | Operation 17 |

## 3. Per-Route Blueprint

Each entry below is drawn from an already-documented contract in [api-contracts.md](../06_API_and_Integration/api-contracts.md); the "Contract Source" column is the authoritative reference — no field is invented independently here.

| Route | Method | Contract Source | Auth | AuthZ | Sync/Async | Evidence/Provenance |
|---|---|---|---|---|---|---|
| `/districts` | GET | Operation 1 | Required | Any role | Sync | Source + ingestion timestamp |
| `/districts/{id}` | GET | Operation 1 | Required | Any role | Sync | Same |
| `/districts/{id}/map-data` | GET | Operation 2 | Required | Any role | Sync | Boundary version marker |
| `/districts/{id}/population` | GET | Operation 3 | Required | Any role | Sync | Source census cycle + effective year |
| `/healthcare` | GET | Operation 4 | Required | Any role | Sync | Source department + ingestion timestamp |
| `/infrastructure` | GET | Operation 5 | Required | Any role | Sync | Same pattern |
| `/transportation` | GET | Operation 6 | Required | Any role | Sync | Source (OSM) + ingestion timestamp |
| `/weather` | GET | Operation 7 | Required | Any role | Sync | Source + station + observation date |
| `/disasters` | GET | Operation 8 | Required | Any role (possibly elevated) | Sync | Source (Proposed/inferred) or Model Execution Metadata |
| `/gis/spatial-query` | POST | Operation 9 | Required | Any role; AI via `spatial_query` tool | Sync (escalates to async if scope is broad) | Dataset version(s) of input geometries |
| `/analytics/{indicator}` | GET | Operation 10 | Required | Any role | Sync | Computation logic version |
| `/predictions:request` | POST | Operation 11 | Required | Analyst+ | Async | Model Execution Metadata reference |
| `/predictions/{id}` | GET | (reads the Operation 11 result) | Required | Any role | Sync | Same |
| `/scenarios` | POST | Operation 12 | Required | Analyst/District Officer+ | Sync (definition only) | Requesting user, submission timestamp |
| `/scenarios/{id}:run` | POST | Operation 13 | Required | Same | Async | Baseline snapshot reference |
| `/scenarios/{id}/result` | GET | Operation 14 | Required | Same | Sync | Scenario Output provenance |
| `/recommendations/{id}` | GET | Operation 15 | Required | Any role | Sync | Full evidence chain |
| `/recommendations/{id}:review` | POST | ([api-resource-model.md](../06_API_and_Integration/api-resource-model.md) Section 5) | Required | District Officer/Administrator | Sync | Audit-logged human action |
| `/ai/query` | POST | Operation 16 | Required | Any role, scoped | Sync-initiated, potentially streamed | AI Response citations |
| `/ai/responses/{id}/evidence` | GET | Operation 17 | Required | Any role that could view the original response | Sync | The provenance chain itself |
| `/ai/executions/{id}` | GET | Operation 18 | Required | Administrator | Sync | Tool/Agent Execution audit trail |

## 4. Route-Level Implementation Notes

- Every route enforces Authentication → Authorization → Structural Validation before reaching its Application Layer use case, per [backend-implementation-architecture.md](backend-implementation-architecture.md) Section 2.
- Every route's response shape follows the predictable-response principle ([api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 5) — list responses share one pagination envelope, entity responses share one provenance-metadata shape.
- No route in this document introduces a new operation beyond the 18 already defined in [api-contracts.md](../06_API_and_Integration/api-contracts.md) — the `/recommendations/{id}:review` command is the one addition, and it is itself already documented in [api-resource-model.md](../06_API_and_Integration/api-resource-model.md) Section 5, not invented here.

## 5. Milestone Traceability

| Route Group | First Available |
|---|---|
| `/districts`, `/geography` | M1 |
| `/healthcare` through `/analytics`, `/gis/spatial-query` | M2 |
| `/ai` | M3 |
| `/predictions` | M4 |
| `/scenarios`, `/simulations` | M5 |
| `/recommendations`, `/evidence` (full recommendation chain) | M6 |

## 6. Open Decisions

- Exact URL path finalization (kebab-case conventions, versioning prefix) — deferred to implementation per [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8 and [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 18.
