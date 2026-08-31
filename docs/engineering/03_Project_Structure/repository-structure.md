---
Document Name: Repository Structure
Document ID: ED-STRUCT-REPO-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Repository Structure

## 1. Purpose

This document defines the intended top-level structure of the future DistrictMind repository, reasoned from the architecture in `docs/engineering/02_System_Architecture/`, not assumed from convention. No repository has been created and no code exists as of this document's creation — this is a structural plan for implementation, which begins in a later milestone.

## 2. Structural Reasoning

**AD-STRUCT-001 — Single Repository (Monorepo) for Frontend + Backend**
- **Decision:** House the frontend, backend, and shared contracts in a single repository rather than separate repositories per component.
- **Context:** The backend is architected as a modular monolith (AD-BE-001) and the frontend as a single SPA (AD-FE-001) — there are exactly two deployable units at present, not many independent services that would justify separate repositories with independent release cadences.
- **Alternatives considered:** Polyrepo (separate repository per frontend/backend/AI); a repository-per-milestone approach.
- **Evaluation criteria:** Developer experience for a small team (AS-005), ease of keeping API contracts (Section on shared-structure.md) in sync between frontend and backend, "do not overengineer" guidance.
- **Trade-offs:** A monorepo simplifies cross-cutting changes (e.g., an API contract change touching both backend and frontend in one commit/PR) and avoids version-skew coordination overhead between repositories, at the cost of a larger single repository as the project grows. Given the modular-monolith backend decision, a polyrepo split would not even map cleanly to independent deployables today.
- **Consequences:** If the AI/ML module or Agent Orchestrator is later extracted into a separately deployed service (per AD-BE-001's flagged future option), that extraction can still happen *within* this monorepo (a distinct top-level directory with its own deployment pipeline) without requiring a repository split, unless operational needs (e.g., separate access control per repository) force one later.
- **Status:** Proposed.

## 3. Top-Level Directory Structure

```text
districtmind/
├── frontend/       # Web application (Presentation Layer)
├── backend/        # Modular monolith API/application (API, Domain, AI/ML, Data Access layers)
├── shared/         # Cross-cutting contracts: API types, constants, shared config schemas
├── database/       # Migrations, seed/reference data definitions (not the running database itself)
├── data/           # Data ingestion configuration, source definitions, sample/fixture datasets (not production data)
├── scripts/        # Developer tooling, one-off operational scripts
├── tests/          # Cross-cutting/integration tests spanning frontend+backend (unit tests live alongside their code)
├── docs/           # All project documentation, including this engineering documentation set
└── config/         # Environment-level configuration templates (no secrets committed)
```

## 4. Rationale Per Directory

| Directory | Why It Exists | Architecture Basis |
|---|---|---|
| `frontend/` | Isolates the Presentation Layer as its own deployable build artifact, distinct from the backend. | [system-architecture.md](../02_System_Architecture/system-architecture.md) AD-002; [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) |
| `backend/` | Houses the modular monolith: API layer, Domain/Intelligence Services, AI/ML layer, Data Access layer, all as internal modules within one deployable. | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) AD-BE-001 |
| `shared/` | Prevents API contract/type duplication and drift between frontend and backend (see [shared-structure.md](shared-structure.md)). | [engineering-principles.md](../00_Engineering_Overview/engineering-principles.md) API-First Design |
| `database/` | Separates schema evolution (migrations) from application code, consistent with the Migration Strategy in [database-architecture.md](../02_System_Architecture/database-architecture.md) Section 14 — migrations are versioned artifacts, not ad hoc scripts mixed into backend code. | [database-architecture.md](../02_System_Architecture/database-architecture.md) |
| `data/` | Data ingestion (M2 — Future) requires source configuration and, during development, fixture/sample data distinct from both application code and the database's own migration history. | [data-flow.md](../02_System_Architecture/data-flow.md) Flow A |
| `scripts/` | Developer/operational tooling (e.g., local environment setup) is kept out of both `frontend/` and `backend/` so it is not mistaken for application code. | [system-requirements.md](../01_Requirements/system-requirements.md) Development Requirements (documented local setup) |
| `tests/` | Cross-cutting and end-to-end tests that span both frontend and backend do not belong inside either component's own directory; component-scoped unit tests live within `frontend/` and `backend/` respectively (see [frontend-structure.md](frontend-structure.md), [backend-structure.md](backend-structure.md)). | [technical-requirements.md](../01_Requirements/technical-requirements.md) Testing Requirements |
| `docs/` | Documentation as a Source of Truth principle — this directory already exists and houses ED-M1 and ED-M2 outputs. | [engineering-principles.md](../00_Engineering_Overview/engineering-principles.md) |
| `config/` | Externalizes environment-specific configuration templates from code (Configuration Over Hardcoding), without committing actual secrets. | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 16 |

## 5. What This Structure Deliberately Excludes

- No `microservices/` or per-service directories — consistent with the modular monolith decision (AD-BE-001); internal module boundaries live *within* `backend/`, not as top-level directories.
- No separate `ai/` top-level directory — the AI/ML layer is architected as a module within `backend/` (per AD-002/AD-BE-001), not a standalone deployable at this stage. If it is later extracted (a flagged future option, not a commitment), this structure would be revisited at that time, not preemptively split now.
- No `infrastructure/` or `deploy/` directory is finalized here, since hosting/deployment provider is an open decision ([constraints.md](../01_Requirements/constraints.md) Infrastructure Constraints); a minimal `config/` directory suffices for now and deployment tooling can be added once a target is confirmed.

## 6. Milestone Growth

This top-level structure is not expected to change shape across M1–M6 — new capability is added as new modules/directories *within* `backend/`, `frontend/`, and `database/`, not as new top-level directories, consistent with the Extensibility strategy in [system-architecture.md](../02_System_Architecture/system-architecture.md) Section 18.

## 7. Open Decisions

- Whether the AI/ML module is ever extracted from `backend/` into its own top-level directory/deployable (contingent on [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 2's future extraction option).
- Final naming/tooling for `config/` and `scripts/`, dependent on framework and hosting decisions still open in [system-architecture.md](../02_System_Architecture/system-architecture.md) Section 22.
