---
Document Name: Technology Stack Baseline
Document ID: DM-TB-01
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Technology Stack Baseline

Written for: the DistrictMind engineering team and the human reviewer who will approve the start of development.

## 1. Purpose

This is the initial development technology baseline for DistrictMind. It selects a practical stack for the first development phase, records why, and keeps the evidence limits visible. It follows the ED-M1 to ED-M6 Part 5 engineering closure, whose determination was **IMPLEMENTATION NOT UNLOCKED** ([implementation-transition-and-unlock-assessment.md](../engineering/26_Final_Engineering_Closure/implementation-transition-and-unlock-assessment.md)).

## 2. The Most Important Distinction in This Document

| Term | Meaning |
|---|---|
| **SELECTED FOR DEVELOPMENT** | We will use this technology for the initial DistrictMind development unless a subsequent PoC reveals a blocking issue. |
| **PRODUCTION CONFIRMED** | A formal, governance-approved decision that the technology is fit for production. **No technology in this baseline has this status.** |

**SELECTED FOR DEVELOPMENT does not mean PRODUCTION CONFIRMED.** Git is the only technology formally Confirmed in the program ([technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) Section 4.14), and this baseline does not change that.

## 3. How Development Start Relates to the Governance Record

The ED-M6 Part 5 determination (IMPLEMENTATION NOT UNLOCKED) is preserved unchanged. This baseline proceeds on the human operator's explicit direction to begin development. That direction is **not** a governance unlock:

- No readiness gate (`RG-*`) changes status because of this document.
- No blocker in [implementation-blockers-final-state.md](../engineering/26_Final_Engineering_Closure/implementation-blockers-final-state.md) is cleared.
- The 42 existing Architecture Decisions remain as recorded, Proposed.
- Boundary data remains RECOMMENDED — PENDING FORMAL APPROVAL. The brief forbids using it before licensing checks, and the aggregator repository's license is undetected (see [07-data-engineering-stack.md](07-data-engineering-stack.md)).

## 4. Status Model

| Status | Use in this baseline |
|---|---|
| EXISTING | Already in use in the repository or environment (Git, the GitHub remote) |
| SELECTED FOR DEVELOPMENT | Chosen for initial development; subject to PoC |
| CANDIDATE | Possible, not selected for the baseline (for example, LangChain used only where justified) |
| UNDER EVALUATION | Needed but not yet chosen (for example, authentication provider, observability platform) |
| POC REQUIRED | Selected, but a development PoC must run before the technology is depended on |
| NOT SELECTED | Considered and excluded for the baseline |
| DEFERRED | Intentionally excluded from the initial stack; can be revisited if requirements justify it |
| PRODUCTION NOT CONFIRMED | Applies to every selected technology. Production status is never implied by development selection |

## 5. The Selected Development Stack — Summary

| Layer | Selected for development |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion (conditional, see D-3), React Router, Leaflet, Recharts, Node.js 24.x |
| Backend | Python 3.14.x, FastAPI, Pydantic, SQLAlchemy, Alembic |
| Database / GIS | PostgreSQL, PostGIS |
| AI (development only) | Ollama (local provider), LangGraph (not needed for the first slice), sentence-transformers (embedding experiments), ChromaDB (initial RAG store). LangChain is a Candidate, used only where justified |
| Testing | pytest, pytest-asyncio (where required), Vitest, Playwright |
| Quality | ESLint, Prettier, Ruff, Black, MyPy |
| Containers | Docker, Docker Compose (**Docker is not installed on this machine; see D-13**) |
| Version control | Git (EXISTING, formally Confirmed), GitHub remote (EXISTING, governance not decided) |

Full statuses, evidence and risks: [02-technology-selection-matrix.md](02-technology-selection-matrix.md).

## 6. Deliberately Excluded (DEFERRED)

Kubernetes, microservices, Kafka, Redis, Celery, distributed databases, cloud-specific managed services, service mesh, production vector-database infrastructure, production model-serving infrastructure. Also Apache Airflow and dbt, which remain To Be Evaluated in [technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) and are not needed at development scale.

Note: [data-architecture.md](../engineering/04_Data_Engineering/data-architecture.md) Section 25 lists Redis as Proposed, while this baseline defers it. This is recorded as divergence D-6, not silently resolved.

## 7. Divergences Recorded (Not Silently Resolved)

| ID | Divergence | Where Recorded |
|---|---|---|
| D-1 | Repository layout differs from AD-STRUCT-001 | [14-development-architecture-baseline.md](14-development-architecture-baseline.md) |
| D-2 | Backend layout is layer-first; AD-STRUCT-003 requires module-per-domain | [04-backend-stack.md](04-backend-stack.md), [14](14-development-architecture-baseline.md) |
| D-3 | Framer Motion selected; AD-FE-006 deliberately names no animation library | [03-frontend-stack.md](03-frontend-stack.md) |
| D-4 | Embedding candidate: RG-TECH-007 says none exists; dependency-management.md names Sentence Transformers as a Candidate | [06-ai-and-rag-stack.md](06-ai-and-rag-stack.md) |
| D-5 | PostgreSQL status: Candidate in technology-stack.md vs Proposed in AD-DE-001 | [05-database-and-gis-stack.md](05-database-and-gis-stack.md) |
| D-6 | Redis: Proposed in data-architecture.md vs DEFERRED here | This file, Section 6 |
| D-7 | Six frontend libraries were never previously documented as candidates | [03-frontend-stack.md](03-frontend-stack.md) |
| D-8 | Authentication provider is unresolved (Item 17), but the first slice includes Login | [09-security-and-observability-stack.md](09-security-and-observability-stack.md) |
| D-9 | District geometry for the first slice is not licensed for use | [07-data-engineering-stack.md](07-data-engineering-stack.md) |
| D-10 | Development start vs ED-M6 Part 5's IMPLEMENTATION NOT UNLOCKED | Section 3 above |
| D-11 | Ruff and Black overlap as formatters | [08-testing-and-quality-stack.md](08-testing-and-quality-stack.md) |
| D-12 | Decision-thread counts in ED-M6 Part 4/5 do not reconcile to 20 threads | [13-technology-risks-and-contingencies.md](13-technology-risks-and-contingencies.md) |
| D-13 | Docker is not installed, but Docker Compose is needed for local PostgreSQL/PostGIS | [10-development-environment.md](10-development-environment.md) |
| D-14 | Parts of the engineering record are untracked in Git | [11-project-tooling.md](11-project-tooling.md) |

## 8. Security

No credential, token, or key appears in this document. Environment variable names are conceptual only (see [09-security-and-observability-stack.md](09-security-and-observability-stack.md)).

## 9. Observability

Every status here traces to a cited document or to an environment observation recorded in [10-development-environment.md](10-development-environment.md).

## 10. Milestone Traceability

The initial development phase covers the first vertical slice defined in [14-development-architecture-baseline.md](14-development-architecture-baseline.md), not the full M1–M6 scope.

## 11. Open Decisions

Authentication provider, observability platform, server-state management library, production hosting, production AI provider, and production database hosting all remain open. See [13-technology-risks-and-contingencies.md](13-technology-risks-and-contingencies.md).
