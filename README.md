# DistrictMind

**AI-Powered District Intelligence / Digital Twin Framework** — Telangana District Intelligence.

## Current phase

**Development — Step 2: district reference and administrative foundation.**

Step 1 (scaffold and bootstrap) is complete. Step 2 adds a 33-district administrative reference catalog, served by the backend at `GET /api/v1/districts` and `GET /api/v1/districts/{district_id}`, and an API-backed district list and detail in the frontend. See [docs/implementation/step-2-administrative-foundation.md](docs/implementation/step-2-administrative-foundation.md).

This is a development scaffold. It is **not** a production system and does not claim production readiness.

## Current limitations (read first)

- **District boundary data is not yet integrated.** No district geometry or district record exists in this repository. Nothing shown on `/districts` or `/districts/:id` is real district data.
- **Production authentication is not yet integrated.** The login is a development-only stub (`DEVELOPMENT LOGIN — NOT REAL AUTHENTICATION`). It checks no password and issues no token.
- **Production AI provider is not yet selected.** No AI is implemented.
- **PostgreSQL/PostGIS integration is not yet validated.** The database is not connected by this scaffold. Docker is not installed on the development machine.

## Development stack

Selected for development (not production-confirmed; see [docs/technology/](docs/technology/)):

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui foundations (`cn` helper), React Router, Framer Motion (meaningful transitions), Vitest, ESLint, Prettier |
| Backend | Python, FastAPI, Pydantic, pydantic-settings, pytest, Ruff |
| Browser tests | Playwright (drives an installed Microsoft Edge) |
| Prepared, not used yet | SQLAlchemy, Alembic, PostgreSQL/PostGIS, Leaflet, Recharts, Ollama, ChromaDB, sentence-transformers, LangGraph |

Redis is deferred and not used. Black is not configured; Ruff is the only Python formatter.

## Repository layout

```
frontend/   React + TypeScript app
backend/    FastAPI modular monolith (app/api, app/core, app/modules/<domain>)
shared/     Contract types and constants shared by frontend and backend
database/   Migrations, seeds, and scripts (structure only; no production migrations)
config/     Environment configuration notes per environment (no secrets)
data/       Source definitions and labeled development data (no real data yet)
docs/       Engineering documentation and the technology baseline
poc/        PoC scripts, kept outside the product test suite
scripts/    Developer tooling
docker/     Docker Compose for local services (PREPARED — NOT EXECUTED)
tests/      Cross-cutting browser end-to-end tests (Playwright)
```

## Environment setup

1. Install Node.js 24.x, Python 3.14.x, and Git.
2. Copy `.env.example` to `.env` at the repository root. Keep `.env` local; it is git-ignored.
3. For the frontend, copy `VITE_API_BASE_URL` into `frontend/.env.local` (optional; the default is already `http://127.0.0.1:8000`).

Never put real credentials in documentation or in files that are committed.

## How to run the backend

From the repository root (Windows PowerShell or Git Bash):

```
cd backend
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements-dev.txt
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Health check: `http://127.0.0.1:8000/api/v1/health`

## How to run the frontend

In a second terminal:

```
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. The API must allow this origin (`CORS_ORIGINS`, default includes it).

## How to run the tests

Backend (unit and API tests):

```
cd backend
.venv\Scripts\python -m pytest
.venv\Scripts\python -m ruff check .
.venv\Scripts\python -m ruff format --check .
```

Frontend (unit tests, types, lint, format, build):

```
cd frontend
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Browser end-to-end tests (requires the backend and frontend running; uses installed Microsoft Edge by default):

```
cd tests
npm install
npm run test:e2e
```

Set `PW_CHANNEL` to another installed browser channel if needed.

## Development login (stub)

`/login` → **Enter development session** → `/districts`. The session is a flag in browser `sessionStorage`. It is not authorization: any client can set it, and the backend does not enforce it. It exists to exercise the navigation flow and is replaced when a real authentication provider is selected.

## Governance

- `docs/engineering/` is the historical engineering record. It was not modified by this scaffold.
- `docs/technology/` records the development technology baseline. "Selected for development" is **not** "production confirmed".
- Git operations are performed by the human reviewer.
