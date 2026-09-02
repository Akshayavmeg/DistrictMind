---
Document Name: Backend Module Design
Document ID: ED-BEIMPL-MOD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Backend Module Design

## 1. Purpose

This document translates the domain architecture (`04_Data_Engineering/`, `05_Database_Design/`, `06_API_and_Integration/`) into a concrete conceptual backend module map, elaborating [service-layer-design.md](../06_API_and_Integration/service-layer-design.md) with implementation-blueprint detail. No source file is created.

## 2. Domain Module ≠ Database Table ≠ API Resource

| Concept | Definition | Example |
|---|---|---|
| Domain Module | A backend code-organization unit owning one domain's business logic | The Healthcare module |
| Database Table | A physical storage unit | The `health_facilities` table (illustrative) — one module may own several tables |
| API Resource | A client-facing contract shape | `/districts/{id}/healthcare` — one resource may be served by data from more than one module (e.g., combining Healthcare + Analytics) |

This restates [logical-data-model.md](../05_Database_Design/logical-data-model.md) Section 2's logical-vs-physical distinction and AD-DB-002, extended to the module level: **a module is not automatically created per table, and a table is not automatically exposed as its own API resource.**

## 3. Module Inventory

| Module | Responsibility | Owned Domain Concepts | Inputs | Outputs | Dependencies | APIs Consumed (Internal) | Data Accessed | GIS Dependency | AI Dependency | M1–M6 Relevance |
|---|---|---|---|---|---|---|---|---|---|---|
| District (Geography) | Geographic hierarchy, boundary retrieval | District, Mandal, Village | Identifiers, spatial queries | Entity records, geometry | GIS module | — | Geography tables | Yes (containment, boundary) | Wrapped by `get_district` | M1 |
| Demographics | Population observation queries | Population Observation | District/village + date range | Observation records | Geography module | — | Demographics tables | No | Wrapped by `get_demographics` | M2 |
| Healthcare | Facility queries, coverage | Health Facility, Facility Type | District/village, filters | Facility records, coverage flags | Geography, GIS, Analytics modules | — | Healthcare tables | Yes (coverage) | Wrapped by `get_healthcare`, `coverage_analysis` | M2 |
| Transportation | Road/routing queries | Road, Road Segment | District, origin/destination | Geometry, routes | Geography, GIS modules | — | Transportation tables | Yes (routing) | Wrapped by `get_transportation`, `accessibility_analysis` | M2 |
| Agriculture | Agricultural observation queries | Agricultural Observation | District/village, filters | Observation records | Geography, Weather modules | — | Agriculture tables | No | Wrapped by `get_agriculture` | M2 |
| Weather / Environment | Weather observation queries | Weather Observation, Weather Station | District/station, date range | Observation records | Geography module | — | Weather tables | Yes (nearest-station) | Wrapped by `get_weather` | M2 |
| Disaster / Risk | Disaster event/impact queries | Disaster Event, Impact Observation | District/village, filters | Event records, impact records | Geography, Weather, GIS modules | — | Disaster tables | Yes (affected-area) | Wrapped by `get_disaster_risk` | M2 (data), M4 (risk) |
| Infrastructure | School/office/water-body queries | School, Government Office, Water Body | District/village, filters | Entity records | Geography, GIS modules | — | Infrastructure tables | Yes (coverage) | Wrapped by `get_infrastructure` | M2 |
| Analytics | Indicator computation/retrieval | Indicator Definition, Analytical Result | Domain data from any module | Computed indicator values | All domain modules (read-only) | — | Analytical Result tables + reads | Indirect | Wrapped by `get_indicator` | M2 |
| GIS | Spatial computation (Section 2 of [gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md)) | Geometry operations | Geometry, entity references | Computed spatial results | Geography and other domain modules' geometry | — | Geometry columns across modules | N/A (is the GIS capability) | Wrapped by `spatial_query`, `coverage_analysis`, `accessibility_analysis` | M1 |
| Prediction | Model inference orchestration | Prediction, Model Execution Metadata | Feature data, target/horizon | Prediction records | Analytics, domain modules (feature sources) | — | Prediction tables + reads | Indirect | Wrapped by `request_prediction` | M4 |
| Simulation | Sandboxed scenario execution | Scenario, Scenario Output | Scenario definition, baseline reference | Scenario Output records | Prediction, Analytics, GIS, Transportation modules | — | Simulation tables (sandboxed) | Yes (network recomputation) | Wrapped by `create_scenario`, `run_scenario` | M5 |
| Recommendation | Evidence-linked recommendation generation | Recommendation, Recommendation Evidence | Analytics + Prediction + Simulation outputs, constraints | Recommendation records | Analytics, Prediction, Simulation modules | — | Recommendation tables + evidence references | Indirect | Wrapped by `get_recommendation` | M6 |
| AI / Agent (Orchestration) | Intent understanding, planning, tool invocation, response composition | User Query, Agent Execution, AI Response | Natural-language query | AI Response | Every module above, exclusively via Typed AI Tools | — | None directly (mediated) | Indirect (drives all GIS-using tools) | Is the AI capability | M3 (basic), M6 (full orchestration) |
| Evidence / Provenance | Provenance metadata assembly and retrieval | Evidence (a view, not a stored entity — [logical-data-model.md](../05_Database_Design/logical-data-model.md) Section 14) | A reference to a fact/claim | Provenance chain detail | Every module, read-only | — | Metadata across every module | No | Backs Operation 17 ([api-contracts.md](../06_API_and_Integration/api-contracts.md)) | M1 (basic provenance), M3 (AI-facing) |
| Auth | Authentication, session/token issuance | User, Role | Credentials | Session/token | None | — | User/Role tables | No | No | M1 |
| Admin | User/role management, data-source configuration | User, Role, Ingestion configuration | Admin actions | Updated records | Auth, Audit modules | — | Admin tables | No | No | M1 |
| Audit | Append-only event logging | Audit Event, Tool Execution, Agent Execution | Events from any module | Log records | None (a terminal sink) | — | Audit tables (write from others, read Admin-scoped) | No | Logs every AI tool call | M1 (admin), M6 (AI review) |

## 4. Not One Service Per Table

Restated explicitly per this milestone's instruction: the 20-module inventory above does **not** map 1:1 to the ~29 table-realized entities in [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 3 — e.g., the Healthcare module owns both `Health Facility` and `Facility Type` tables; the GIS module owns no table of its own (it operates on geometry columns owned by other modules' tables); the Evidence/Provenance module owns no table at all (it is a read-only composition view, per Section 3's "Evidence" row).

## 5. Module Boundary Rules

Unchanged from [backend-structure.md](../03_Project_Structure/backend-structure.md) Section 5 and [repository-implementation-map.md](../08_Implementation_Foundation/repository-implementation-map.md) Section 4 — restated as the binding rule for every module above: a module calls another module's declared service interface only, never its repository/data-access layer directly.

## 6. Milestone Traceability

See Section 3's rightmost column — consolidated in [ED-M3-P2-VALIDATION.md](ED-M3-P2-VALIDATION.md) Section 12.

## 7. Open Decisions

- Whether the Evidence/Provenance module is ever promoted to own its own dedicated caching table for performance (currently a pure read-composition, per Section 3) — deferred to [caching-and-performance.md](caching-and-performance.md).
