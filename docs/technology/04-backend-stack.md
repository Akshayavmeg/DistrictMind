---
Document Name: Backend Stack
Document ID: DM-TB-04
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Backend Stack

Written for: backend engineers starting the first vertical slice.

## 1. Stack

| Concern | Selection | Status |
|---|---|---|
| Language/runtime | Python 3.14.x (observed 3.14.3) | SELECTED FOR DEVELOPMENT |
| API framework | FastAPI | SELECTED FOR DEVELOPMENT |
| Schemas and config | Pydantic | SELECTED FOR DEVELOPMENT |
| Data access | SQLAlchemy | SELECTED FOR DEVELOPMENT |
| Migrations | Alembic (development migrations only) | SELECTED FOR DEVELOPMENT |
| Type checking | MyPy | SELECTED FOR DEVELOPMENT |
| Lint and format | Ruff, Black | SELECTED FOR DEVELOPMENT (overlap, D-11) |
| Tests | pytest, pytest-asyncio where required | SELECTED FOR DEVELOPMENT |

All: PRODUCTION NOT CONFIRMED. FastAPI has never been PoC-tested in this program.

## 2. Architecture

Modular monolith (AD-BE-001). One deployable.

```
API (FastAPI routers, request/response schemas)
  ↓
Application Services (use-case orchestration)
  ↓
Domain Logic (rules, no framework imports)
  ↓
Repositories (SQLAlchemy; the only layer touching the database)
  ↓
PostgreSQL / PostGIS
```

Dependency direction is one-way downward (RG-ARCH-008). Domain logic imports nothing from FastAPI or SQLAlchemy.

## 3. AI Path (Later Phase)

```
AI Agent → Typed Tool → Authorization → Application Service → Repository → Database
```

The AI **must not**: query the database directly; generate arbitrary SQL against any production database; bypass authorization; access the filesystem or database without restriction. This is AD-DE-005, AD-DB-006, and AD-API-002, unchanged.

## 4. Layout Divergence (D-2)

The brief's layout is layer-first (`app/api`, `app/application`, `app/domain`, `app/repositories`, …). **AD-STRUCT-003 (Proposed) requires a module-per-domain structure with shared horizontal layers.** These conflict.

Recommended resolution, for the human to confirm before scaffolding:

- Horizontal layers stay at the top of `app/`: `api/`, `core/`, `db/` (session and base).
- Domain modules sit under `app/domains/<domain>/`, each with its own `service`, `repository`, `schemas`, and `models`. The first domain is `districts` (geographic/administrative).
- AI tools, when they exist, live in `app/domains/ai/` and call services only.

This keeps the brief's layers and AD-STRUCT-003's module boundaries. AD-STRUCT-003 is not modified.

## 5. API Surface for the First Slice

The first slice uses a small subset of the 18 documented operations ([api-contracts.md](../engineering/06_API_and_Integration/api-contracts.md)), starting with `GET /districts/{id}` documented in [api-resource-model.md](../engineering/06_API_and_Integration/api-resource-model.md). Exact endpoint list is confirmed against the contract documents at implementation, not here. No new endpoint is invented.

Conventions: REST + OpenAPI (AD-BE-002). Structural validation returns 400, semantic validation 422 (AD-BE-006).

## 6. Transactions and Concurrency

Local ACID transactions only; no distributed transactions or sagas (AD-BE-005). Synchronous responses by default; the four-criterion test in AD-BE-004 decides any async work. No background-job technology is selected (see [13](13-technology-risks-and-contingencies.md)).

## 7. Configuration

Settings come from environment variables through a Pydantic settings module, never from committed files. Variable names are in [09](09-security-and-observability-stack.md) and [10](10-development-environment.md).

## 8. Not Selected

Django, Node.js back end (FastAPI is selected instead), GraphQL, Kafka, Celery, Redis. Node.js and Django remain Candidate in the record and are not part of this baseline.

## 9. Not Yet Evaluated

No framework PoC exists. The modular-monolith fit, dependency direction, and validation behavior of FastAPI with Pydantic and SQLAlchemy are POC REQUIRED.

## 10. Security

Input validation at the boundary (Pydantic); sanitized errors; CORS restricted to configured origins; authorization on every operation including AI-originated calls. Details in [09](09-security-and-observability-stack.md).

## 11. Open Decisions

Module-per-domain layout (D-2); authentication provider (D-8); Python minor version pinning (wheel availability for 3.14 is unverified).
