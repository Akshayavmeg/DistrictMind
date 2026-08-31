---
Document Name: Backend Structure
Document ID: ED-STRUCT-BE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Backend Structure

## 1. Purpose

This document defines the intended folder structure of the `backend/` directory (per [repository-structure.md](repository-structure.md)), realizing the modular monolith architecture in [backend-architecture.md](../02_System_Architecture/backend-architecture.md). No implementation files are created by this document.

## 2. Structural Approach

**AD-STRUCT-003 — Module-per-Domain Backend Structure with Shared Horizontal Layers**
- **Decision:** Organize `backend/` as a set of domain modules (District, Auth, Ingestion, Analytics, AI/ML, Prediction, Simulation, Recommendation, Notification, Admin, Audit), each internally structured by technical role (routes, services, repositories, models), plus shared horizontal concerns (middleware, configuration) at the top level.
- **Context:** Directly implements AD-BE-001 (modular monolith) — module boundaries must be visible in the folder structure itself, not just in code review discipline, to make accidental cross-module coupling harder.
- **Alternatives considered:** Structure by technical layer only (a single `routes/`, single `services/`, single `models/` folder for the entire backend, regardless of domain).
- **Evaluation criteria:** Enforcement of module boundaries (Modularity principle), ease of locating all code related to a given domain, alignment with the future-extraction option for AI/ML (AD-BE-001 Section 2).
- **Trade-offs:** Module-per-domain makes boundaries explicit and makes future extraction (e.g., of `ai/`) a matter of moving one directory rather than untangling logic scattered across shared technical-layer folders; it requires slightly more upfront structure per module than a single flat layer-based structure.
- **Consequences:** Every module follows the same internal sub-structure (Section 4) for consistency and predictability across the backend.
- **Status:** Proposed.

## 3. Directory Structure

```text
backend/
├── api/                      # API layer: route registration, request/response schemas, versioning
├── modules/
│   ├── auth/                 # M1 — authentication, session/token issuance
│   ├── district/             # M1 — district/mandal domain logic, GIS query support
│   ├── admin/                 # M1 — user/role management
│   ├── audit/                 # M1 — audit log writing/reading
│   ├── ingestion/             # M2 — Future — data ingestion pipeline
│   ├── analytics/             # M2 — Future — indicators, KPIs, comparisons, trends
│   ├── ai/                    # M3 — Future — retrieval, grounding, LLM orchestration
│   ├── prediction/            # M4 — Future — forecasting, risk scoring
│   ├── simulation/            # M5 — Future — scenario engine
│   ├── recommendation/        # M6 — Future — recommendation generation, review workflow
│   ├── notification/          # M4 — Future — threshold-based notification delivery
│   └── orchestrator/          # M6 — Future — agent orchestration (depends on ai, prediction, simulation modules)
├── domain/                    # Shared domain entities/types used across modules (District, Indicator, etc.)
├── repositories/               # Cross-module repository base interfaces; module-specific repositories live in modules/*/repositories
├── middleware/                  # Authentication/authorization enforcement, request validation, error handling
├── background/                   # Background job definitions (ingestion runs, model runs — module-specific jobs live under their module)
├── config/                        # Centralized configuration loading (per backend-architecture.md Section 16)
└── tests/                          # Cross-module/integration tests (module-specific unit tests live within each module)
```

## 4. Per-Module Internal Structure

Each directory under `modules/` follows the same internal shape, so any contributor can navigate an unfamiliar module using the same mental model:

```text
modules/<module-name>/
├── routes.*         # HTTP route handlers (thin — delegate to services)
├── service.*         # Business logic (the module's "service layer", per backend-architecture.md Section 5)
├── repository.*       # Data access for this module's entities (implements Data Access Layer, Section 7)
├── schemas.*           # Request/response and validation schemas specific to this module
├── models.*              # Module-owned domain entities (if not already in top-level domain/)
└── tests/                 # Module-scoped unit tests
```

## 5. Boundary Rules

- A module's `service.*` may call another module's declared service interface (e.g., `simulation` calling `prediction`'s service, per the dependency documented in [component-architecture.md](../02_System_Architecture/component-architecture.md)) but must **never** import another module's `repository.*` directly — cross-module data access always goes through the owning module's service layer, preserving each module's control over its own data (Modularity, Separation of Concerns).
- `api/` contains only routing/versioning concerns and delegates immediately into the relevant `modules/*/routes.*` — it does not itself contain business logic.
- `middleware/` (authentication, authorization, structured error handling) applies uniformly across all modules, implementing the layer-boundary rules from [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Sections 9–11 and [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 2 in one place, not duplicated per module.
- `domain/` holds entities genuinely shared across modules (e.g., `District`, used by `district`, `analytics`, `prediction`, `simulation`); an entity used by only one module stays local to that module's `models.*`.
- `orchestrator/` (M6) depends on `ai`, `prediction`, and `simulation` module service interfaces only — it does not reach into their repositories, consistent with [ai-architecture.md](../02_System_Architecture/ai-architecture.md) Section 16's description of the Orchestrator as coordinating existing tools, not a new data-access surface.

## 6. Relationship to Future Service Extraction

Because `ai/` (and, by M6, `orchestrator/`) is structured as a self-contained module with a clean service-interface boundary (Section 5), the future option flagged in [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 2 — extracting AI/ML into an independently deployed service — would primarily involve moving `modules/ai/` (and its dependents) out of this repository structure's single-process boundary, not rewriting its internal logic. This is a structural property of the chosen module boundaries, not a commitment to actually perform that extraction.

## 7. Milestone Growth Pattern

Each milestone (M2–M6) adds one or more new directories under `modules/`, following the same internal shape (Section 4) — the top-level structure (`api/`, `domain/`, `middleware/`, `config/`) does not change shape across milestones.

## 8. Open Decisions

- Exact file extensions/conventions depend on the final backend language/framework (Candidate: FastAPI/Python, Node.js, Django — [technology-stack.md](../00_Engineering_Overview/technology-stack.md)), which may impose its own idiomatic structure this plan would need to adapt to (e.g., Django's app-based structure vs. a FastAPI router-based structure) without changing the underlying module-boundary reasoning.
- Whether `background/` job definitions should instead live entirely within their owning module (e.g., `modules/ingestion/jobs.*`) rather than a shared top-level directory — noted as a reasonable alternative, not resolved here, pending selection of a background-job mechanism ([backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 12).
