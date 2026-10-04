---
Document Name: Development Architecture Baseline
Document ID: DM-TB-14
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Development Architecture Baseline

Written for: the engineers about to scaffold the repository, and the reviewer approving the scaffold.

**No directory has been created and no code written by this document.** It describes the target structure and the first slice. The first implementation step creates the structure after the open layout decisions below are confirmed.

## 1. Architecture Shape

Modular monolith (AD-BE-001). One backend deployable, one frontend deployable (AD-FE-001), one database. No microservices.

```
Browser (React SPA)
  ↓ HTTP (REST/OpenAPI, typed client)
Backend (FastAPI modular monolith)
  ↓
Application Services → Domain Logic → Repositories
  ↓
PostgreSQL / PostGIS
```

Frontend displays. Backend computes. PostGIS stores and computes authoritatively. The frontend never reaches the database. The AI, when built, reaches data only through typed tools and authorization.

## 2. Repository Layout (Merged — Pending Confirmation, D-1)

The brief's layout is combined with the directories AD-STRUCT-001 already defines. The brief's additions (`poc/`, `docker/`) are kept. Directories from AD-STRUCT-001 that the brief omitted (`shared/`, `database/`, `config/`) are kept, so nothing is dropped silently.

```
DistrictMind/
├── frontend/      React + TypeScript app (Vite, Tailwind, shadcn/ui, Leaflet, Recharts, React Router)
├── backend/       FastAPI modular monolith
├── shared/        API contract types and constants shared by frontend and backend (AD-STRUCT-001)
├── database/      Alembic migrations and seed/reference definitions (not the running database)
├── data/          Source definitions and labeled development/fixture data (not production data)
├── docs/          Documentation, including docs/engineering/ and docs/technology/
├── tests/         Cross-cutting tests (Playwright end-to-end)
├── poc/           PoC scripts, kept outside the product test suite
├── scripts/       Developer tooling
├── docker/        Docker and Compose definitions for local services
├── config/        Environment templates (no secrets)
└── README.md
```

**Divergence D-1:** the brief's layout omitted `shared/`, `database/`, and `config/`, which AD-STRUCT-001 (Proposed) requires. This merge keeps them. The human confirms before scaffolding. [repository-structure.md](../engineering/03_Project_Structure/repository-structure.md) is not modified.

## 3. Frontend Layout (Brief, Compatible with AD-STRUCT-002)

```
frontend/src/
├── components/   Shared presentational components
├── features/     Feature modules (for example districts, overview, dashboard)
├── pages/        Route-level pages
├── layouts/      Shell and page layouts
├── routes/       React Router definitions (canonical /districts/:id)
├── services/     The single typed API client
├── hooks/        Reusable hooks
├── types/        Frontend types
└── utils/        Pure helpers
```

## 4. Backend Layout (D-2 — Recommended Resolution, Pending Confirmation)

The brief's layout is layer-first. AD-STRUCT-003 (Proposed) requires module-per-domain with shared horizontal layers. The recommended merge:

```
backend/
├── app/
│   ├── api/          FastAPI routers (thin: request in, response out)
│   ├── core/         Settings (Pydantic), logging, error handling, security helpers
│   ├── db/           SQLAlchemy engine, session, base classes
│   ├── domains/
│   │   └── districts/    First domain: service, repository, schemas, models
│   ├── gis/          Spatial queries and PostGIS helpers (called by services)
│   ├── data/         Ingestion scripts and source adapters (development)
│   └── ai/           Typed tools, agent, RAG (later phase; calls services only)
└── tests/
```

The brief's `application/`, `domain/`, `repositories/`, `models/`, and `schemas/` are preserved as roles inside each domain module. This is a recommendation, not a decision. **D-2 requires human confirmation.**

## 5. Data Flow

```
Source file (labeled) → Raw → Validation (structure, CRS, ring closure) → Curated (PostGIS) → Serving (API)
```

Only the first slice's Source of Truth categories (boundaries, identifiers) are loaded. Derived, Prediction, Simulation, Recommendation, and AI Response are not built yet.

## 6. The First Vertical Slice

Brief Section 15 sequence:

1. **Login** (development-only stub, D-8)
2. **Telangana overview** — map shell with 33 district entries
3. **33 districts** — list and map polygons (requires a geometry decision, D-9)
4. **District selection** — hover, select, click to `/districts/:id`
5. **District dashboard** — loads district summary from the backend
6. **Basic data summary** — identifiers, source metadata, validation status

**Must be established by the slice:** frontend routing; API communication; database connection; GIS rendering; district selection; district dashboard; basic error handling; loading states; responsive UI.

**AI is not in the slice.**

### Slice Boundaries

| Included | Excluded |
|---|---|
| Development-only login stub | Production authentication |
| Labeled development geometry (after D-9) | Real boundary data before licensing |
| Read-only district pages | Writes, scenarios, simulation |
| One domain module (`districts`) | Other 12 logical domains |
| Map display and selection | Authoritative spatial analysis beyond district lookup |

## 7. Development Gates (Brief Section 25) — Current State

| Gate | Requirement | Current state |
|---|---|---|
| 1 | Frontend boots | NOT YET MET (no code) |
| 2 | Backend boots | NOT YET MET (no code) |
| 3 | Frontend calls backend | NOT YET MET |
| 4 | PostgreSQL/PostGIS connection works | **BLOCKED** (not installed; Docker absent) |
| 5 | Validated development boundary data loads | **BLOCKED** pending D-9 (licensing/Option choice) |
| 6 | 33 districts render | NOT YET MET; depends on Gates 1, 4, 5 |
| 7 | District click works | NOT YET MET; depends on Gate 6 |
| 8 | District dashboard loads | NOT YET MET; depends on Gates 2–4 |
| 9 | No critical frontend performance issue | **BLOCKED** (no browser to measure) |
| 10 | Basic automated tests pass | NOT YET MET (no tests) |

No gate is marked passed. Expansion beyond the slice waits until all ten pass.

## 8. Explicitly Out of Scope for This Baseline

Production deployment; production database and migrations; production AI provider; the complete schema; full M1–M6 features; real boundary geometry before the licensing decision; any Git write operation.

## 9. Traceability to the Existing Record

| This baseline | Existing record |
|---|---|
| Modular monolith | AD-BE-001 (Proposed) |
| Frontend/API separation | AD-FE-001, AD-API-001 |
| Render-only GIS | AD-FE-004 |
| Canonical route | AD-RES-001 |
| Typed AI tools | AD-DE-005, AD-DB-006, AD-API-002 |
| Six categories | AD-DB-005 |
| Layout | AD-STRUCT-001, -002, -003 (D-1, D-2) |
| Local ACID | AD-BE-005 |
| Validation | AD-BE-006 |
| Batch ingestion | AD-DE-003 |
| Feature-oriented frontend | AD-STRUCT-002 |

## 10. Open Decisions

Repository layout merge (D-1); backend domain layout (D-2); boundary geometry option (D-9); development login approach (D-8); server-state library (AD-FE-002); Python and Node version pins.
