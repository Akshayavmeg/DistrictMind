---
Document Name: Decision Register Baseline
Document ID: ED-ERB-DECISIONS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Decision Register Baseline

## 1. Purpose

This is the authoritative baseline of all Architecture Decisions across the entire DistrictMind engineering program, verified via `grep -rhoE '^\*\*AD-[A-Z]+-[0-9]+'` and a targeted table-format search across every folder before writing. **42 decisions exist as of this baseline. No duplicate ID exists. Every decision remains at its originating status — none is converted from Proposed to Confirmed by this document.**

## 2. Register Legend

| Field | Meaning |
|---|---|
| Status | Proposed (the only status any non-Git decision holds), Confirmed (Git only), or a specific documented conflict/resolution state |
| Source | The document that first defines the decision |
| Milestone(s) | Product milestone(s) (M1–M6) the decision first affects |

## 3. Data Engineering Decisions (AD-DE)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-DE-001 | Spatially-capable relational store as the primary data platform (PostgreSQL + PostGIS leading candidate) | Proposed | [data-architecture.md](../04_Data_Engineering/data-architecture.md) | M1 |
| AD-DE-002 | ELT over ETL for curated-layer construction | Proposed | Same | M2 |
| AD-DE-003 | Batch/scheduled ingestion as default; no streaming committed for M1–M2 | Proposed | Same | M1–M2 |
| AD-DE-004 | Sandboxed, discard-after-use simulation execution; production data never mutated by a what-if query | Proposed | Same | M5 |
| AD-DE-005 | Typed, tool-mediated AI data access; no direct/free-form database access for any AI agent | Proposed | Same | M3 |

**Scope/Rationale:** Establishes the data platform's spatial-native shape, the ELT ingestion pattern, batch-first cadence, simulation sandboxing, and the foundational AI data-access restriction that every later AI decision (AD-DB-006, AD-API-002) builds on. **Affected architecture:** Data engineering, database, AI, simulation.

## 4. Database Design Decisions (AD-DB)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-DB-001 | Spatial capability as an extension of the primary store, not a separate system | Proposed | [database-architecture.md](../02_System_Architecture/database-architecture.md) | M1 |
| AD-DB-002 | Logical entities are not automatically physical tables | Proposed | [logical-data-model.md](../05_Database_Design/logical-data-model.md) | M1 |
| AD-DB-003 | Structured attribute sets for variable-shape data (Scenario parameters) | Proposed | [database-normalization.md](../05_Database_Design/database-normalization.md) | M5 |
| AD-DB-004 | 3NF as the default target for operational entities, with named exceptions only | Proposed | Same | M1 |
| AD-DB-005 | Structural (schema-level) separation of the six digital twin state categories | Proposed | [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) | M1–M6 |
| AD-DB-006 | No AI component holds unrestricted database access | Proposed | [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) | M3 |

**Scope/Rationale:** Establishes physical schema design principles and, most critically, AD-DB-005's structural enforcement of the six information categories and AD-DB-006's database-layer reinforcement of the AI access restriction first stated in AD-DE-005. **Affected architecture:** Database, digital twin state model, AI data access.

## 5. API and Integration Decisions (AD-API)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-API-001 | Domain-aligned service boundaries at the API layer, within the existing modular monolith | Proposed | [api-architecture.md](../06_API_and_Integration/api-architecture.md) | M1 |
| AD-API-002 | AI Agent layer has no API path to unrestricted data access | Proposed | Same | M3 |

**Scope/Rationale:** Confirms the modular monolith is preserved at the API layer (no microservice-per-domain split) and closes the API-level path for any AI bypass of Typed Tools. **Affected architecture:** API, AI boundary.

## 6. AI/GIS/Intelligence Decisions (AD-AI)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-AI-001 | Adopt the Descriptive/Diagnostic/Predictive/Prescriptive/Agentic taxonomy as the organizing framework for intelligence documentation | Proposed | [intelligence-architecture.md](../07_AI_GIS_and_Intelligence/intelligence-architecture.md) | M1–M6 |
| AD-AI-002 | Simulation reuses trained Prediction models rather than training independent simulation models | Proposed | [simulation-architecture.md](../07_AI_GIS_and_Intelligence/simulation-architecture.md) | M5 |
| AD-AI-003 | No fabricated numeric confidence; numeric confidence only from a validated model method | Proposed | [ai-uncertainty-and-confidence.md](../07_AI_GIS_and_Intelligence/ai-uncertainty-and-confidence.md) | M4 |
| AD-AI-004 | Minimum-sufficient tool-call planning | Proposed | [agent-planning-and-reasoning.md](../07_AI_GIS_and_Intelligence/agent-planning-and-reasoning.md) | M3 |
| AD-AI-005 | Recommendation scoring uses a documented, inspectable weighted formula, not an opaque model | Proposed | [recommendation-engine.md](../07_AI_GIS_and_Intelligence/recommendation-engine.md) | M6 |

**Scope/Rationale:** Establishes the intelligence taxonomy, the Simulation-reuses-Prediction efficiency principle, the anti-fabrication confidence rule, tool-call discipline, and Recommendation scoring's inspectability requirement — the last of which is explicitly not a technology selection (see [unresolved-items-baseline.md](unresolved-items-baseline.md) Item 27). **Affected architecture:** AI/ML, Simulation, Recommendation.

## 7. Project Structure Decisions (AD-STRUCT)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-STRUCT-001 | Single repository (monorepo) for frontend + backend | Proposed | [repository-structure.md](../03_Project_Structure/repository-structure.md) | M1 |
| AD-STRUCT-002 | Feature-oriented frontend structure | Proposed | [frontend-structure.md](../03_Project_Structure/frontend-structure.md) | M1 |
| AD-STRUCT-003 | Module-per-domain backend structure with shared horizontal layers | Proposed | [backend-structure.md](../03_Project_Structure/backend-structure.md) | M1 |

**Scope/Rationale:** Establishes repository organization consistent with the modular monolith. **Affected architecture:** Repository structure, frontend/backend organization.

## 8. Frontend Decisions (AD-FE)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-FE-001 | Single-page application shell | Proposed | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) | M1 |
| AD-FE-002 | Separate server-cache state from client UI state | Proposed | Same | M1 |
| AD-FE-003 | Eleven state categories, each with a single named owner, no shared generic store | Proposed | [frontend-state-management.md](../10_Frontend_Implementation/frontend-state-management.md) | M1 |
| AD-FE-004 | Frontend GIS layer is render-only; no client-side authoritative spatial computation | Proposed | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) | M1–M2 |
| AD-FE-005 | District detail route path convention: conflict between `/districts/:id` and `/district/:districtName` | **Conflict Identified, Not Resolved** (in its original document — see Section 12, superseded in effect by AD-RES-001) | [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) | M1 |
| AD-FE-006 | Animation principles, not a named animation library, govern the motion system | Proposed | [frontend-animation-and-interaction.md](../10_Frontend_Implementation/frontend-animation-and-interaction.md) | M1 |

**Scope/Rationale:** Establishes SPA shell, state-management discipline, and — most critically — AD-FE-004's render-only GIS boundary. AD-FE-005 records an unresolved routing conflict (see Section 12 for its resolution history). **Affected architecture:** Frontend, GIS boundary, routing.

## 9. Backend Decisions (AD-BE)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-BE-001 | Modular monolith backend architecture | Proposed | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) | M1 |
| AD-BE-002 | REST + OpenAPI as the API style | Proposed | Same | M1 |
| AD-BE-003 | Explicit application layer, distinct from domain logic | Proposed | [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) | M1 |
| AD-BE-004 | Four-criterion test determines sync vs. async, not a per-operation guess | Proposed | [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) | M4 |
| AD-BE-005 | Local ACID transactions only; no distributed transactions or sagas | Proposed | [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md) | M1 |
| AD-BE-006 | Structural (400) and semantic (422) validation failures use distinct status codes | Proposed | [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) | M1 |

**Scope/Rationale:** AD-BE-001 is the single most load-bearing decision in this group — the modular monolith is restated unchanged through every subsequent milestone including this baseline. AD-BE-003–006 elaborate implementation-level structure without contradicting it. **Affected architecture:** Backend, API, error handling, background jobs.

## 10. Implementation Foundation Decisions (AD-IMP)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-IMP-001 | Vertical-slice, risk-first implementation over full-layer-first (waterfall) implementation | Proposed | [implementation-strategy.md](../08_Implementation_Foundation/implementation-strategy.md) | M1–M6 |
| AD-IMP-002 | Strict five-way separation of configuration, secrets, source code, user data, and model artifacts | Proposed | [configuration-management.md](../08_Implementation_Foundation/configuration-management.md) | M1 |
| AD-IMP-003 | No default production-data copies in non-production environments | Proposed | [environment-management.md](../08_Implementation_Foundation/environment-management.md) | M1 |
| AD-IMP-004 | Light branching model (trunk + short-lived feature branches) over GitFlow | Proposed | [branching-and-commit-strategy.md](../08_Implementation_Foundation/branching-and-commit-strategy.md) | M1 |
| AD-IMP-005 | Ten qualitative gates aligned to M1–M6, no invented numerical thresholds | Proposed | [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) | M1–M6 |

**Scope/Rationale:** Establishes the implementation methodology (risk-first vertical slices), the configuration/secrets discipline every later deployment document builds on, environment data-safety, Git workflow, and the quality-gate framework this entire baseline's readiness assessment is measured against. **Affected architecture:** Implementation process, environments, quality gates.

## 11. GIS and Data Implementation Decisions (AD-GIS, AD-DATA)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-GIS-001 | Geometry payloads use level-of-detail scoping rather than generic pagination | Proposed | [gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md) | M1–M2 |
| AD-DATA-001 | Source fragmentation is addressed at ingestion time via canonical schema + identifier + provenance, not by assuming sources will naturally agree | Proposed | [data-source-implementation.md](../12_Data_GIS_Implementation/data-source-implementation.md) | M2 |

**Scope/Rationale:** Both are ED-M4 Part 1 implementation-level decisions extending the ED-M2 architecture with no contradiction. **Affected architecture:** GIS payload delivery, data fragmentation handling.

## 12. Architecture Resolution Decisions (AD-RES)

| ID | Title | Status | Source | Milestone(s) |
|---|---|---|---|---|
| AD-RES-001 | District detail route uses identifier-based addressing (`/districts/:id`); human-readable name may be supported as a non-canonical alias | Proposed (the convention is evidence-resolved; "Proposed" reflects no implementation yet exists) | [routing-resolution.md](../11_Architecture_Resolution/routing-resolution.md) | M1 |
| AD-RES-002 | Visual/UI direction items adopted as Proposed Design Direction, not Confirmed, not claimed source-derived | Proposed | [ui-visual-direction-resolution.md](../11_Architecture_Resolution/ui-visual-direction-resolution.md) | M1 |

**Scope/Rationale:** AD-RES-001 formally resolves the AD-FE-005 conflict — restated per Section 8, [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) itself was never modified (per the "do not modify prior documentation" discipline), so **AD-FE-005 still reads "Conflict Identified, Not Resolved" in its own document; AD-RES-001 is the superseding resolution, and both are preserved rather than one being silently deleted.** AD-RES-002 classifies the visual/UI theme instructions as intentional-but-unsourced direction, not a fabricated source citation. **Affected architecture:** Frontend routing, visual/UI direction.

## 13. Superseded/Related Decision Relationships

| Original Decision | Relationship | Superseding/Related Decision |
|---|---|---|
| AD-FE-005 (Conflict Identified, Not Resolved) | Resolved in effect by | AD-RES-001 (Proposed canonical convention) |
| AD-DE-005 (typed, tool-mediated AI access) | Reinforced at the database layer by | AD-DB-006 |
| AD-DE-005 / AD-DB-006 | Reinforced at the API layer by | AD-API-002 |
| AD-AI-002 (Simulation reuses Prediction models) | Operationalized at the data layer by | AD-DE-004 (sandboxing) |

**No decision is deleted or silently overwritten** — every relationship in this table preserves both decisions' full history.

## 14. Confirmed Technology

**Git is the only Confirmed technology in the entire program.** No decision in Sections 3–12 elevates any other technology beyond Proposed/Candidate — verified via a repository-wide scan for the word "Confirmed" applied to any technology name, consistent with every prior milestone's audit.

## 15. Decision-ID Collision Verification

Verified via `grep -rhoE '^\*\*AD-[A-Z]+-[0-9]+'` (bold-header pattern) plus a targeted table-format search for `AD-DE-` (which uses table rather than bold-header notation in [data-architecture.md](../04_Data_Engineering/data-architecture.md)) across the entire repository: **42 unique decision IDs, zero collisions, zero duplicates.**

## 16. Security

This register itself has no security implication beyond what each cited decision already establishes — it introduces no new decision.

## 17. Observability

Not applicable — this is a static register, not a runtime system.

## 18. Milestone Traceability

Restated per-group in Sections 3–12 above.

## 19. Open Decisions

**This document introduces zero new Architecture Decisions.** Every topic this ED-M4 Part 5 milestone touches was found already covered by an existing decision from Sections 3–12, consistent with "do not create unnecessary decisions."
