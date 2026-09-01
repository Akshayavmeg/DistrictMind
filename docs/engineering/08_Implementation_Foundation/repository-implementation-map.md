---
Document Name: Repository Implementation Map
Document ID: ED-IMP-REPOMAP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Repository Implementation Map

## 1. Purpose

This document extends [repository-structure.md](../03_Project_Structure/repository-structure.md) and [backend-structure.md](../03_Project_Structure/backend-structure.md)/[frontend-structure.md](../03_Project_Structure/frontend-structure.md) into an implementation-oriented map: ownership, allowed/forbidden dependencies, and boundary rules per top-level directory. **No directory is physically created by this document.**

## 2. Directory Responsibility Map

| Directory | Responsibility | Status |
|---|---|---|
| `docs/` | All engineering, product, and research documentation | Confirmed (already exists and is populated) |
| `frontend/` | Presentation layer — UI, GIS rendering, dashboards, AI chat | Proposed, per [repository-structure.md](../03_Project_Structure/repository-structure.md) Section 3 |
| `backend/` | API layer, Domain Services, AI/ML orchestration, Data Access Layer — the modular monolith | Proposed |
| `shared/` | API contracts, shared types/constants (per [shared-structure.md](../03_Project_Structure/shared-structure.md)) | Proposed |
| `database/` | Schema migrations, seed/reference data definitions | Proposed |
| `tests/` | Cross-cutting/integration tests | Proposed |
| `scripts/` | Developer tooling, operational scripts | Proposed |
| `data/` | Ingestion configuration, source definitions, sample/fixture data (not production data) | Proposed |
| `config/` | Environment configuration templates (no secrets) | Proposed |
| `infrastructure/` | Deployment/hosting configuration | **Not yet confirmed as a repository directory** — [repository-structure.md](../03_Project_Structure/repository-structure.md) Section 5 explicitly noted no `infrastructure/`/`deploy/` directory was finalized, pending hosting decisions ([constraints.md](../01_Requirements/constraints.md) Infrastructure Constraints); this document preserves that open status rather than inventing one |

Every directory above is Proposed, matching [repository-structure.md](../03_Project_Structure/repository-structure.md)'s own status — this document elevates none of them to Confirmed.

## 3. Ownership

| Directory | Conceptual Owner |
|---|---|
| `docs/` | DistrictMind Engineering (all contributors, editorially) |
| `frontend/` | Frontend/UI engineering |
| `backend/` | Backend engineering, subdivided by Domain Service ownership per [service-layer-design.md](../06_API_and_Integration/service-layer-design.md) |
| `shared/` | Jointly owned by frontend and backend engineering — changes require agreement from both, since [shared-structure.md](../03_Project_Structure/shared-structure.md) Section 2 exists specifically to prevent drift |
| `database/` | Database/backend engineering |
| `data/` | Data engineering |
| No specific team is named for any directory — [constraints.md](../01_Requirements/constraints.md) Development-Team Constraints remains unconfirmed |

## 4. Allowed and Forbidden Dependencies

Restated and made explicit from every prior architecture decision — this document introduces no new boundary, only consolidates them into one reference table.

| Dependency | Allowed? | Source Decision |
|---|---|---|
| Frontend → API | **Allowed** (the only path) | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 7 |
| Frontend → Database (direct) | **Forbidden** | Same |
| Frontend → Business logic (embedding domain rules client-side) | **Forbidden** | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 5's component tiering — UI components hold no domain logic |
| Backend Domain Service → its own Data Access Layer | **Allowed** | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 7 |
| Backend Domain Service → another Domain Service's Data Access Layer (direct) | **Forbidden** | [backend-structure.md](../03_Project_Structure/backend-structure.md) Section 5 |
| Backend Domain Service → another Domain Service's declared service interface | **Allowed** | Same |
| AI Agent → Typed AI Tool | **Allowed** (the only path) | AD-API-002, AD-DE-005, AD-DB-006 |
| AI Agent → direct database access | **Forbidden**, absolutely | Same — restated as the single most load-bearing boundary in this entire documentation set |
| GIS Service → spatial data services (Domain Services' geometry-bearing data) | **Allowed** | [gis-service-design.md](../06_API_and_Integration/gis-service-design.md) Section 9 |
| Any Domain Service → GIS Service, for spatial computation | **Allowed** | Same |
| UI component → business logic | **Forbidden** | Restated from Frontend row above |
| `shared/` → framework-specific code (frontend or backend internals) | **Forbidden** | [shared-structure.md](../03_Project_Structure/shared-structure.md) Section 4 — shared content is API-contract-level only |

## 5. Boundary Enforcement Mechanism

These boundaries are enforced by code organization and review discipline (per [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 2's modular-monolith rationale), not by a network/process boundary — restated unchanged from AD-002/AD-BE-001. This document does not introduce a new enforcement mechanism (e.g., a linter rule or CI check); doing so is an implementation-time tooling decision outside this milestone's documentation-only scope.

## 6. What Is Deliberately Not Mapped

Per [repository-structure.md](../03_Project_Structure/repository-structure.md) Section 5, no `ai/` top-level directory exists separately from `backend/` (the AI/ML layer is a module within the backend monolith, per AD-BE-001's future-extraction option) — this document does not introduce one, preserving consistency.

## 7. Milestone Traceability

| Directory Activation | First Needed |
|---|---|
| `docs/`, `backend/` (Geography module), `database/`, `frontend/` (shell + map) | M1 |
| `data/`, remaining `backend/` domain modules | M2 |
| `backend/` (AI module), `shared/` (AI contracts) | M3 |
| `backend/` (Prediction module) | M4 |
| `backend/` (Simulation module) | M5 |
| `backend/` (Recommendation module) | M6 |
| `infrastructure/` (if ever confirmed) | Pending hosting decision |

## 8. Open Decisions

- Whether `infrastructure/` is ever formally added as a repository directory — pending the hosting decision noted in Section 2.
- Exact CI/lint enforcement of Section 4's boundaries — implementation-time tooling, not decided here.
