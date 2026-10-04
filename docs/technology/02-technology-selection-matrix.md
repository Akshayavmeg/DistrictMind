---
Document Name: Technology Selection Matrix
Document ID: DM-TB-02
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Technology Selection Matrix

Written for: engineers choosing or reviewing a dependency, and the human reviewer.

## 1. Columns

Technology · Category · Purpose · Why selected · Existing evidence · PoC status · Development status · Production status · Risk · Fallback. Every "PRODUCTION NOT CONFIRMED" below applies to every selected technology.

"Prior status" refers to the status recorded before this baseline, cited from the existing documentation. A prior status of "not documented" means no earlier document named the technology.

## 2. Frontend

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| React | Frontend framework | Component UI | Team standard in the documented candidate set; widest ecosystem for the required components | Documented only | POC REQUIRED | SELECTED FOR DEVELOPMENT | Proposed ([technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) §4.1) | Low | None needed at development stage |
| TypeScript | Language | Type safety | Maintainability for a multi-domain UI | Documented only | POC REQUIRED | SELECTED FOR DEVELOPMENT | Proposed (§4.1) | Low | JavaScript (not recommended) |
| Vite | Build/dev tooling | Dev server, build | Fast local feedback; standard with React+TypeScript | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** (D-7) | Low; newly introduced | Another React build tool, only on a demonstrated blocker |
| Tailwind CSS | Styling | Consistent utility styling | Rapid, consistent styling for the dark command-center direction | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** (D-7) | Newly introduced; version to be pinned at setup | Plain CSS modules |
| shadcn/ui | Accessible UI primitives | Reusable components | Accessible primitives on top of Tailwind | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** (D-7) | Components are copied into the repository, so updates are manual; governance must be recorded | Hand-built components on Radix primitives |
| Framer Motion | Animation | Controlled UI motion | Requested for controlled, interruptible UI animation | AD-FE-006 deliberately names no library | POC REQUIRED (no browser available) | SELECTED FOR DEVELOPMENT, **conditional on D-3** | **Not documented; AD-FE-006 deliberately avoids naming one** | Motion must meet the performance rules in [03-frontend-stack.md](03-frontend-stack.md) | CSS transitions only |
| React Router | Routing | Canonical `/districts/:id` routing | Needed for AD-RES-001 routes | Routing implied by AD-RES-001, not a named library | POC REQUIRED | SELECTED FOR DEVELOPMENT | Not named (implied) | Low | Another client router |
| Leaflet | GIS rendering | Telangana map and district polygons | Lightweight, established; already a documented Candidate | Candidate ([technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) §4.4) | POC REQUIRED (large-geometry rendering untested) | SELECTED FOR DEVELOPMENT | Candidate | Large geometry performance; see [13](13-technology-risks-and-contingencies.md) | Mapbox GL JS (Candidate) if rendering scale requires it |
| Recharts | Charts | Dashboard charts | Chart library for the district dashboard | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** (D-7); dependency-management.md says "not yet named" | Low | Another chart library |
| Node.js 24.x | Frontend tooling runtime | Runs Vite, npm, Vitest, Playwright | Required by the frontend toolchain; observed v24.14.1, npm 11.11.0 | Observed in this environment (a runtime fact, not a framework PoC) | Runtime present; no framework PoC | SELECTED FOR DEVELOPMENT | Candidate ([development-environment.md](../engineering/08_Implementation_Foundation/development-environment.md) §7) | Version to be pinned at setup | An earlier Node LTS line |

## 3. Backend

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| Python 3.14.x | Language | Backend, data, AI | Single language across backend, data, and AI, per the Blueprint's preference; observed 3.14.3 | Observed; no version confirmed by any document | Runtime present | SELECTED FOR DEVELOPMENT | Candidate (development-environment.md §6) | Some packages may lack 3.14 wheels; **not verified** | An earlier CPython minor version, verified at setup |
| FastAPI | API framework | API/application boundary; OpenAPI | Matches AD-BE-002 (REST + OpenAPI); async support | Documented only | POC REQUIRED | SELECTED FOR DEVELOPMENT | Candidate (§4.2) | Framework PoC never run | Django (Candidate) only on a demonstrated blocker |
| Pydantic | Validation | Request, response, config schemas | Required by FastAPI; supports AD-BE-006 structural and semantic validation | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** | Low | Manual validation (not recommended) |
| SQLAlchemy | Data access | Repository layer | Matches AD-BE-003 repository separation | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** | Must not leak into domain logic | Raw SQL behind repositories |
| Alembic | Migrations | Versioned schema changes | Matches database-architecture.md §14's versioned-migration rule | None | POC REQUIRED | SELECTED FOR DEVELOPMENT (development migrations only) | **Not documented** | Development migrations are not production migrations | Hand-written SQL migrations |

## 4. Database and GIS

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| PostgreSQL | Relational database | Primary store | Leading candidate per AD-DE-001; ACID per AD-BE-005 | ED-M6 Part 3: not installed; pgvector currency via docs (EV-M6-P2-035) | **BLOCKED** (not installed; Docker absent) | SELECTED FOR DEVELOPMENT | **Divergence D-5**: Candidate (technology-stack.md) vs Proposed (AD-DE-001) | Unverified in this environment | None at development stage; reassess only if PoC blocks |
| PostGIS | Spatial extension | Authoritative spatial storage and computation | AD-FE-004 and the authoritative-server rule need a spatial engine | Documentation only; pure-Python GIS logic PASS is **not** PostGIS evidence | **BLOCKED** | SELECTED FOR DEVELOPMENT | Candidate (technology-stack.md §4.4); Proposed (database-design.md §25) | Unverified | Reassess only if PoC exposes a blocking issue |

## 5. AI and RAG (development only)

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| Ollama | Local LLM runtime | Initial development provider | Runs locally with no data egress; ED-M6 Part 3 executed real tests (observed 0.34.4 now, 0.33.2 earlier) | EV-M6-P3-004: 4 real runs, single-step PASS, multi-step PARTIAL, grounded PASS | PARTIAL (see [06](06-ai-and-rag-stack.md)) | SELECTED FOR DEVELOPMENT (dev only) | Blueprint's local-first proposal; AI provider UNRESOLVED | Quality limited to a 3B model | Another local or hosted provider, per [13](13-technology-risks-and-contingencies.md) |
| LangGraph | Agent orchestration | Agent workflow | Explicit graph control over typed-tool calls | None | POC REQUIRED | SELECTED FOR DEVELOPMENT (not needed for the first slice) | Candidate (RG-AI-003 Fail) | Framework PoC never run | Plain typed-tool dispatch |
| LangChain | Integration abstractions | Only where justified | Not selected by default | None | NOT TESTED | CANDIDATE (use only where a specific need is shown) | Candidate ([dependency-management.md](../engineering/08_Implementation_Foundation/dependency-management.md)) | Abstraction overhead | Direct client calls |
| sentence-transformers | Embeddings | Embedding experiments | Standard local option for experimentation | Documented as a Candidate in dependency-management.md | POC REQUIRED | SELECTED FOR DEVELOPMENT (experiments only) | **Divergence D-4**: RG-TECH-007 says no embedding candidate exists | Heavy dependency chain (PyTorch) | Another embedding model |
| ChromaDB | Vector store | Initial RAG development store | Embedded local storage, no server needed for development | Candidate (technology-stack.md §4.6; dependency-management.md) | POC REQUIRED | SELECTED FOR DEVELOPMENT (development only) | Candidate | Not a production decision (see D-4 and [13](13-technology-risks-and-contingencies.md)) | pgvector on PostgreSQL |

## 6. Testing and Quality

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| pytest | Backend/data tests | Unit and integration | Standard Python test runner | Candidate (§4.11) | POC REQUIRED | SELECTED FOR DEVELOPMENT | Candidate | Low | unittest |
| pytest-asyncio | Async Python tests | Async service tests | Needed only where async code exists | None | POC REQUIRED | SELECTED FOR DEVELOPMENT (where required) | **Not documented** | Low | Sync tests |
| Vitest | Frontend unit/component tests | Component tests | Fits Vite | Candidate (Jest/Vitest, §4.11) | POC REQUIRED | SELECTED FOR DEVELOPMENT | Candidate | Low | Jest |
| Playwright | Browser E2E | Map and flow tests | Real browser tests are required for the render gates | To Be Evaluated (§4.11) | **BLOCKED** (no browser installed) | SELECTED FOR DEVELOPMENT | To Be Evaluated | Browser binaries must be installed | Cypress |
| ESLint | Linting (frontend) | Code quality | Standard for TypeScript | Referenced by coding-standards.md | NOT TESTED | SELECTED FOR DEVELOPMENT | Referenced, not evaluated | Low | None needed |
| Prettier | Formatting (frontend) | Consistent formatting | Standard companion to ESLint | Referenced by coding-standards.md | NOT TESTED | SELECTED FOR DEVELOPMENT | Referenced, not evaluated | Low | ESLint-only formatting |
| Ruff | Linting (Python) | Fast lint | Fast, consolidated Python linter | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** | Overlap with Black (D-11) | Flake8 |
| Black | Formatting (Python) | Formatting | Brief requirement | Referenced by coding-standards.md | NOT TESTED | SELECTED FOR DEVELOPMENT (overlap noted, D-11) | **Not documented** | Redundant with Ruff's formatter | Ruff format alone, pending a decision |
| MyPy | Static type checking (Python) | Backend type safety | Fits Pydantic and typed-tool contracts | None | POC REQUIRED | SELECTED FOR DEVELOPMENT | **Not documented** | Strictness may slow early work | Pyright |

## 7. Containers and Version Control

| Technology | Category | Purpose | Why selected | Existing evidence | PoC status | Development status | Prior status | Risk | Fallback |
|---|---|---|---|---|---|---|---|---|---|
| Docker | Containers | Local environment parity | Standard for reproducing local PostgreSQL/PostGIS | Proposed (§4.12) | **BLOCKED** (not installed) | SELECTED FOR DEVELOPMENT | Proposed | Not installed on this machine (D-13) | Native PostgreSQL install |
| Docker Compose | Local orchestration | Local PostgreSQL/PostGIS and services | Single command for local services | None | **BLOCKED** | SELECTED FOR DEVELOPMENT | **Not documented** | Depends on Docker | Manual local services |
| Git | Version control | Source control | Formally Confirmed | Confirmed ([technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) §4.14); observed 2.53.0 | Not applicable | EXISTING | Confirmed | None | None |
| GitHub | Hosting, PR review | Remote repository | An `origin` remote on `main` is observed | Remote observed; governance decisions not made | Not applicable | EXISTING | Proposed (§4.14) | No governance decisions fabricated here | Another Git host |

## 8. Deferred or Excluded

See [01-technology-stack-baseline.md](01-technology-stack-baseline.md) Section 6. Each is DEFERRED with the same rationale: not required at development scale.

## 9. Security and Observability

Covered in [09-security-and-observability-stack.md](09-security-and-observability-stack.md). Authentication provider and observability platform are UNDER EVALUATION.

## 10. Milestone Traceability

Each row's first needed phase is noted in its rationale file ([12](12-technology-rationale.md)).

## 11. Open Decisions

None of the rows above is PRODUCTION CONFIRMED. Every PoC REQUIRED row needs a development PoC before dependence. Every "Not documented" row is newly introduced by this baseline.
