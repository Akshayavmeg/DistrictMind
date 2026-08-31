---
Document Name: Shared Structure
Document ID: ED-STRUCT-SHARED-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Shared Structure

## 1. Purpose

This document defines what belongs in the repository's `shared/` directory (per [repository-structure.md](repository-structure.md)) — content genuinely needed by both `frontend/` and `backend/` (or by multiple backend modules) — and, just as importantly, what should **not** be duplicated there. Unnecessary duplication between frontend and backend is a documented risk to Data Integrity and Maintainability if the two drift out of sync.

## 2. Guiding Rule

Something belongs in `shared/` only if **both** of the following hold:
1. It is used by more than one deployable unit (frontend and backend) or would otherwise need to be manually kept in sync across a repository boundary.
2. Duplicating it instead would create a real risk of drift (e.g., an API response shape defined once in the backend and re-typed by hand in the frontend, which can silently diverge).

Purely frontend-only concerns (UI component types, client-only state shapes) and purely backend-only concerns (internal repository types, database-specific models) do **not** belong in `shared/`, even if superficially similar in shape — per [frontend-structure.md](frontend-structure.md) Section 4 and [backend-structure.md](backend-structure.md) Section 5, each side owns its own internal types.

## 3. What Belongs in `shared/`

| Content | Why It's Shared | Source of Truth |
|---|---|---|
| API contracts (request/response shapes) | The frontend's `services/` layer and the backend's `api/` layer must agree on exact request/response shapes; defining this once and consuming it from both sides prevents drift (API-First Design principle). | Generated or hand-maintained from the backend's OpenAPI specification (technical-requirements.md API Requirements) — mechanism TBD, see Section 6. |
| Core domain type definitions exposed via the API | E.g., a `District`, `Indicator`, or `Recommendation` shape as it appears over the wire — not the backend's internal database model, which may differ. | Backend `domain/` (per [backend-structure.md](backend-structure.md) Section 3), projected into `shared/` at the API boundary. |
| Shared constants | Values meaningful to both sides — e.g., milestone identifiers (M1–M6), role names used in RBAC checks on both frontend (UI gating) and backend (authorization enforcement). | Defined once in `shared/constants`. |
| API documentation | The OpenAPI specification itself, or a reference to where it is published/generated (technical-requirements.md: "All APIs shall be documented using a machine-readable specification"). | `shared/` or `docs/`, cross-referenced. |
| Configuration contract schemas | Where a configuration shape (e.g., an ingestion source definition) is produced by one part of the system and consumed by another, its schema is shared rather than redefined per consumer. | `shared/config-schemas` |

## 4. What Does Not Belong in `shared/`

- Frontend UI component prop types (stay in `frontend/types` or co-located with their component, per [frontend-structure.md](frontend-structure.md)).
- Backend-internal repository/ORM model types (stay in each module's `models.*`, per [backend-structure.md](backend-structure.md) — these represent storage structure, not the API contract, and the two are deliberately allowed to differ per [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 6's Domain-layer independence from storage technology).
- AI/ML internal prompt-construction or retrieval-pipeline types ([ai-architecture.md](../02_System_Architecture/ai-architecture.md)) — these are backend/AI-module-internal and not consumed by the frontend directly; the frontend only consumes the AI Assistant's API response shape (which *is* shared, per Section 3).

## 5. Avoiding Unnecessary Duplication

- Where the backend's OpenAPI specification can mechanically generate the shared API types (a common pattern once a specific frontend/backend framework pairing is chosen), that generation path is **Proposed** as preferable to hand-maintaining `shared/` types twice — this avoids the exact drift risk `shared/` exists to prevent, one level deeper (a hand-written shared type can still drift from the actual API implementation if not generated from it).
- Milestone identifiers (M1–M6) and RBAC role names are small enough to hand-maintain safely in `shared/constants`, but must still be defined exactly once, imported by both `frontend/` and `backend/`, never redefined independently on either side (per [naming-conventions.md](naming-conventions.md) Section on Milestone IDs).

## 6. Open Decisions

- Whether shared API types are hand-maintained or generated from the OpenAPI specification (dependent on final frontend/backend framework choices, [technology-stack.md](../00_Engineering_Overview/technology-stack.md)).
- Whether `shared/` is published as an internal package (requiring a build step) or referenced directly via relative imports within the monorepo — a tooling decision deferred to implementation, not resolved here.
