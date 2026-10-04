# database

Schema evolution and reference data — **not** the running database.

- `migrations/` — Alembic migrations (not created yet; the PostgreSQL/PostGIS PoC has not passed).
- `seeds/` — reference data definitions. No fabricated production data is stored here.
- `scripts/` — database helper scripts.

Status: PostgreSQL and PostGIS are SELECTED FOR DEVELOPMENT; POC NOT YET PASSED; PRODUCTION NOT CONFIRMED. This scaffold does not connect to any database.
