---
Document Name: Technology Rationale
Document ID: DM-TB-12
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Technology Rationale

Written for: reviewers who ask "why this?" about any selected technology.

Each entry gives the reason for selection and the limit of that reason. "Limit" states what the reason does **not** prove.

## 1. Frontend

| Technology | Why selected | Limit of that reason |
|---|---|---|
| React | Component architecture for dashboards and map panels; the documented candidate | Says nothing about performance with the Telangana geometry |
| TypeScript | Type safety for API contracts and map state | Adds build steps |
| Vite | Fast development feedback with React and TypeScript | Not evaluated against DistrictMind's build needs |
| Tailwind CSS | Consistent styling for the dark command-center direction | Introduces a utility-class convention to the team |
| shadcn/ui | Accessible primitives instead of building them from scratch | Copied source, not a versioned package; updates are manual |
| Framer Motion | Controlled, interruptible motion as requested (D-3) | Conflicts with AD-FE-006's no-library choice; not performance-tested |
| React Router | Implements the canonical `/districts/:id` route | Routing shape is fixed by AD-RES-001; the library only implements it |
| Leaflet | Already a documented Candidate; lightweight; suitable for an initial map | Large-geometry performance is untested |
| Recharts | Charts for the district dashboard | Not previously named; not evaluated |

## 2. Backend

| Technology | Why selected | Limit of that reason |
|---|---|---|
| Python | One language across backend, data, and AI (Blueprint preference) | Version compatibility with all packages is unverified |
| FastAPI | REST with generated OpenAPI (AD-BE-002); async support; typed | Framework never PoC-tested here |
| Pydantic | Required by FastAPI; validation at the boundary (AD-BE-006) | Validation rules are still to be written |
| SQLAlchemy | Repository pattern (AD-BE-003) without leaking SQL into domain logic | Requires discipline to keep it in the repository layer |
| Alembic | Versioned schema changes (database-architecture.md §14) | Development migrations only |

## 3. Database and GIS

| Technology | Why selected | Limit of that reason |
|---|---|---|
| PostgreSQL | Leading candidate (AD-DE-001); ACID (AD-BE-005) | Status divergence D-5 unresolved; not installed |
| PostGIS | Authoritative spatial storage and computation (AD-FE-004) | Pure-Python results are not PostGIS evidence |

## 4. AI and RAG

| Technology | Why selected | Limit of that reason |
|---|---|---|
| Ollama | Local, no data egress; already exercised (EV-M6-P3-004) | Quality limited to a 3B model in four single runs |
| LangGraph | Explicit graph control over typed-tool calls | Not needed for the first slice; framework PoC not run |
| LangChain | Only where a specific integration is justified | Abstraction overhead; restricted use |
| sentence-transformers | Standard local embedding experiments | Heavy dependency chain; D-4 |
| ChromaDB | Embedded store with no server for development | Not a production decision |

## 5. Testing and Quality

| Technology | Why selected | Limit of that reason |
|---|---|---|
| pytest, pytest-asyncio | Standard Python test runner; async where needed | Coverage target not set |
| Vitest | Fits Vite; component tests | Not run yet |
| Playwright | Real-browser tests needed for render and login gates | BLOCKED: no browser installed |
| ESLint, Prettier | Standard frontend quality pair | Referenced in coding-standards.md; not separately evaluated |
| Ruff, Black, MyPy | Lint, format, and type checks for Python | Formatter overlap (D-11) |

## 6. Containers and Version Control

| Technology | Why selected | Limit of that reason |
|---|---|---|
| Docker, Docker Compose | Reproducible local services | Not installed here (D-13) |
| Git | Formally Confirmed | Confirmed status applies to Git only |
| GitHub | Existing remote | No governance decisions made |

## 7. Rejected or Deferred — Reason Recorded

| Excluded | Reason |
|---|---|
| Kubernetes, microservices, service mesh | Modular monolith (AD-BE-001); no scale requirement yet |
| Kafka, Celery, Redis | No demonstrated need; background-job technology unresolved (RG-TECH-010) |
| Distributed databases, cloud managed services | No hosting decision (RG-TECH-012) |
| Production vector DB, production model serving | No production decision; RAG and serving unresolved |
| Airflow, dbt | Not needed at development scale |
| Django, GraphQL, Node.js back end | FastAPI selected; Django and Node.js remain Candidate in the record |
| Redux | AD-FE-003; no demonstrated state-management problem |

## 8. Honest Summary

Almost every selection rests on design-level fit and on documentation, not on a development PoC. The rationale for each row is a reason to try the technology, not proof that it works. Each row's PoC status is in [02](02-technology-selection-matrix.md).
