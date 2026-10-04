# backend

FastAPI modular monolith (AD-BE-001). Development Step 1: health endpoint and the development login stub only.

```
app/
├── main.py        App factory: CORS (explicit origins), error handling, /api/v1 router
├── api/           Routers only (thin). health.py, auth.py (development stub), router.py
├── core/          Settings (pydantic-settings), sanitized error handling
├── shared/        Cross-module utilities (empty)
└── modules/       One package per domain. Placeholders only; no domain logic yet
    ├── geographic/   ├── administrative/   ├── healthcare/   ├── transportation/
    ├── population/   ├── agriculture/      ├── weather/      ├── environment/
    ├── disaster/     ├── infrastructure/   ├── education/    ├── analytics/
    └── ai/           (not implemented; typed-tool boundary applies here later)
tests/             pytest: health, development-login behavior, settings validation
```

Layering rule (AD-BE-001/003): routers call services; services call repositories; nothing calls the database from the API layer. No repository or database code exists yet.

Run and test commands are in the root [README.md](../README.md).

Dependencies: `requirements.txt` (runtime, pinned), `requirements-dev.txt` (test and lint, pinned). Pinned versions were resolved on 2026-10-04.
