---
Document Name: Testing and Quality Stack
Document ID: DM-TB-08
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Testing and Quality Stack

Written for: everyone writing code in the first vertical slice.

## 1. Testing Stack

| Tool | Scope | Status |
|---|---|---|
| pytest | Backend, domain, data tests | SELECTED FOR DEVELOPMENT |
| pytest-asyncio | Async Python tests, where async code exists | SELECTED FOR DEVELOPMENT (conditional) |
| Vitest | Frontend unit and component tests | SELECTED FOR DEVELOPMENT |
| Playwright | Browser end-to-end tests (map, login, navigation) | SELECTED FOR DEVELOPMENT; **BLOCKED** until a browser is installed |

All: PRODUCTION NOT CONFIRMED. None has been run in this program.

## 2. Quality Stack

| Tool | Scope | Status |
|---|---|---|
| ESLint | TypeScript/React linting | SELECTED FOR DEVELOPMENT |
| Prettier | Frontend formatting | SELECTED FOR DEVELOPMENT |
| Ruff | Python linting | SELECTED FOR DEVELOPMENT |
| Black | Python formatting | SELECTED FOR DEVELOPMENT |
| MyPy | Python static typing | SELECTED FOR DEVELOPMENT |

## 3. Overlap (D-11)

Ruff can also format Python. Running both Ruff's formatter and Black is redundant. Both are kept because the brief lists both. **Recommended:** choose one formatter, either Black or Ruff's formatter, and record that choice before the first commit of Python code. This baseline does not make that choice.

## 4. Test Layers

| Layer | Tool | Location |
|---|---|---|
| Domain unit tests | pytest | `backend/tests/` (alongside domain code, per [repository-structure.md](../engineering/03_Project_Structure/repository-structure.md)) |
| API integration tests | pytest with a throwaway PostgreSQL/PostGIS | `backend/tests/` |
| Frontend component tests | Vitest | `frontend/src/` alongside components |
| Browser end-to-end tests | Playwright | `tests/` (cross-cutting, per the repository structure) |
| PoC scripts | Python or Node | `poc/` (not part of the product test suite) |

## 5. Gates

The development gates in [14](14-development-architecture-baseline.md) Section 6 (Gate 10: basic automated tests pass) use these tools.

## 6. Test Data Rules

- Tests never use real or non-development data.
- Test fixtures carry the synthetic label when they represent geography.
- Tests never run against any database holding data other than the throwaway test instance.

## 7. Quality Rules

- Structural and semantic validation are tested at the API boundary (AD-BE-006).
- Accessibility checks are required, though requirement traceability is a named gap (RG-SEC-009).
- No test is marked passed unless it was executed. Failing tests are recorded, not hidden.

## 8. Not Yet Evaluated

Performance and frame-timing tests (no browser); coverage thresholds (no numeric target is invented here); load testing (deferred).

## 9. Open Decisions

Single formatter choice (D-11); coverage target (not set, deliberately); whether to add a load-testing tool (deferred).
