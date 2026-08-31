---
Document Name: Naming Conventions
Document ID: ED-STRUCT-NAME-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Naming Conventions

## 1. Purpose

This document defines naming conventions for DistrictMind, spanning code-level conventions (files, folders, components, functions, variables, classes, interfaces, API endpoints, database identifiers, environment variables) and documentation-level identifier conventions (requirement IDs, architecture IDs, milestone IDs). Consistency here prevents the kind of drift that undermines Documentation as a Source of Truth and Maintainability.

Code-level conventions below are **Proposed** defaults consistent with common practice for the currently Candidate technology stack; they are not binding until a specific framework/language is confirmed, at which point framework-idiomatic conventions take precedence where they conflict.

## 2. Files and Folders

| Element | Convention | Example |
|---|---|---|
| Frontend feature/component folders | `kebab-case` | `ai-assistant/`, `district-map-panel/` |
| Backend module folders | `snake_case` (if Python/FastAPI) or `kebab-case` (if Node.js) — final choice depends on backend language decision | `district/`, `ai_assistant/` |
| Documentation files | `kebab-case.md` | `system-architecture.md` |
| Configuration files | `kebab-case` with standard extension | `app-config.yaml` |

## 3. Components (Frontend)

- React-style components (if React is confirmed, per [technology-stack.md](../00_Engineering_Overview/technology-stack.md)): `PascalCase`, named for what they render, not how — e.g., `DistrictMapPanel`, `IndicatorTrendChart`, `AssistantMessageThread` (matching the examples in [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 5).
- Primitive/generic components (per [frontend-structure.md](frontend-structure.md) `components/`) use generic names without domain terms — e.g., `Button`, `Modal`, `Card` — never `DistrictButton` for a component with no district-specific behavior.

## 4. Functions

- `camelCase` for frontend (JavaScript/TypeScript) and Node.js backend code; `snake_case` for Python backend code if FastAPI/Django is confirmed — determined by the eventual language choice, not fixed here.
- Function names are verb-first and describe the action, not the implementation — e.g., `fetchDistrictBoundary`, `validateIngestedRecord`, `computeRiskScore`.
- Boolean-returning functions/variables are prefixed `is`/`has`/`can` — e.g., `isGrounded`, `hasSufficientData`, `canReviewRecommendation` — directly supporting readability around the Fail-Safe/Human-in-the-Loop logic described in [ai-architecture.md](../02_System_Architecture/ai-architecture.md).

## 5. Variables

- Same casing rule as functions per language (Section 4).
- No abbreviations that obscure domain meaning — e.g., `district`, not `dst`; `indicatorValue`, not `iVal`. This directly supports the Engineering Glossary's terms ([engineering-glossary.md](../00_Engineering_Overview/engineering-glossary.md)) being recognizable in code, not re-abbreviated ad hoc.

## 6. Classes

- `PascalCase` across both frontend and backend, regardless of language, since this is close to universal convention.
- Domain entity classes use the exact glossary term where one exists — e.g., `District`, `Mandal`, `Indicator`, `Scenario`, `Recommendation`, `RiskScore` — so code terminology never drifts from documentation terminology (Documentation as a Source of Truth).

## 7. Interfaces / Types

- `PascalCase`, no `I`-prefix convention (e.g., `District`, not `IDistrict`) unless the eventual language/framework's own idiom dictates otherwise (e.g., some TypeScript style guides do prefix interfaces — a **To Be Finalized During Architecture Design** implementation-time style choice).
- Shared API-contract types (per [shared-structure.md](shared-structure.md)) use the same name on both frontend and backend consumption sides — e.g., a `DistrictSummary` API response type is named identically wherever it is imported, never renamed per-consumer.

## 8. API Endpoints

- REST resource-oriented paths, plural nouns for collections: `/api/v1/districts`, `/api/v1/districts/{districtId}/mandals`, `/api/v1/districts/{districtId}/indicators` (M2 — Future), `/api/v1/assistant/query` (M3 — Future, action-oriented since it is not a CRUD resource).
- API versioning is embedded in the path (`/api/v1/...`) per [backend-architecture.md](../02_System_Architecture/backend-architecture.md) AD-BE-002 and technical-requirements.md's requirement for versioned endpoints.
- Path segments are `kebab-case` where multi-word (e.g., `/api/v1/data-sources`, M2 — Future admin endpoint), consistent with common REST convention.

## 9. Database Tables

- `snake_case`, plural nouns for entity tables: `districts`, `mandals`, `indicators`, `indicator_values`, `forecasts`, `scenarios`, `simulation_results`, `recommendations`, `audit_log_entries` — matching the conceptual entities in [database-architecture.md](../02_System_Architecture/database-architecture.md) Section 10.
- Join/relationship tables (if needed beyond foreign keys) are named by combining both entities: e.g., `recommendation_evidence` (linking recommendations to forecasts/simulation results, per FR-031's evidence requirement).

## 10. Database Columns

- `snake_case`, singular, unprefixed by table name (e.g., `name`, not `district_name`, within the `districts` table).
- Foreign key columns are named `<referenced_entity>_id` — e.g., `district_id` on the `mandals` table.
- Provenance columns (per FR-014, NFR-030) use a consistent pair across every ingested table: `source` and `ingested_at`.
- Audit columns use a consistent pair across every table needing them: `created_at`, `updated_at`.

## 11. Environment Variables

- `UPPER_SNAKE_CASE`, prefixed by concern area to avoid collisions: `DB_CONNECTION_STRING`, `AI_PROVIDER_API_KEY`, `AUTH_TOKEN_SECRET` — per Configuration Over Hardcoding and technical-requirements.md Configuration Requirements ("externalized from code via configuration/environment variables").
- Secrets-bearing variable names include no actual secret values in the codebase — only the variable name/reference is committed, per technical-requirements.md Security Requirements.

## 12. Requirement IDs

Established in ED-M1 and carried forward unchanged — this document does not redefine them, only restates the pattern for completeness:

| Prefix | Meaning | Source |
|---|---|---|
| `FR-XXX` | Functional Requirement | [functional-requirements.md](../01_Requirements/functional-requirements.md) |
| `NFR-XXX` | Non-Functional Requirement | [non-functional-requirements.md](../01_Requirements/non-functional-requirements.md) |
| `AS-XXX` | Assumption | [assumptions.md](../01_Requirements/assumptions.md) |

These IDs are never reused or renumbered; a superseded requirement is marked as such in place, not deleted and its number recycled.

## 13. Architecture IDs

Introduced in this milestone (ED-M2 Part 1):

| Prefix | Meaning | Source |
|---|---|---|
| `AD-XXX` | System-level Architecture Decision (cross-cutting) | [system-architecture.md](../02_System_Architecture/system-architecture.md) Section 23 register |
| `AD-FE-XXX` | Frontend-specific Architecture Decision | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) |
| `AD-BE-XXX` | Backend-specific Architecture Decision | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) |
| `AD-DB-XXX` | Database-specific Architecture Decision | [database-architecture.md](../02_System_Architecture/database-architecture.md) |
| `AD-STRUCT-XXX` | Project-structure Architecture Decision | This folder ([03_Project_Structure/](.)) |

Each Architecture Decision follows the fixed structure required by the milestone brief: Decision, Context, Alternatives, Evaluation Criteria, Trade-offs, Consequences, Status (Confirmed / Proposed / Under Evaluation / Future). IDs are never reused; a superseded decision is marked Superseded in place and a new ID is issued for its replacement.

Document IDs (distinct from Architecture Decision IDs) follow the pattern established in ED-M1 and extended in ED-M2: `ED-<AREA>-<NNN>` — e.g., `ED-ARCH-SYS-001`, `ED-STRUCT-REPO-001`.

## 14. Milestone IDs

Unchanged from [engineering-overview.md](../00_Engineering_Overview/engineering-overview.md) Section 8: `M1` through `M6` exclusively, always referring to the product development roadmap (Digital Twin Foundation → District Intelligence → Grounded AI Assistant → Predictive Intelligence → Scenario Simulation → Autonomous District Intelligence). Milestone IDs are never used for documentation milestones (which instead use `ED-M<N>[-P<N>]`, e.g., `ED-M1`, `ED-M2-P1`) — the two numbering schemes are deliberately distinct so a reader is never uncertain whether "M2" refers to the District Intelligence product milestone or a documentation milestone.

## 15. Consistency Enforcement

All naming conventions in this document apply uniformly across `frontend/`, `backend/`, `database/`, and `shared/` (per [repository-structure.md](repository-structure.md)) once implementation begins. Where a specific framework's own idiomatic convention conflicts with a default proposed here (Sections 2–7), the framework convention takes precedence, and this document should be updated to reflect that resolution rather than silently diverging from actual code.
