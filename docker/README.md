# docker

**PREPARED — NOT EXECUTED.** Docker is **not installed** on the development machine as of 2026-10-04. Nothing in this folder has been run, and no success is claimed.

Frontend and backend startup do **not** depend on Docker.

- `development/docker-compose.yml` — a local PostgreSQL/PostGIS service for the future database PoC.

To use it once Docker is installed (from the repository root):

```
docker compose --env-file .env -f docker/development/docker-compose.yml up -d
```

The image tag is not verified against a registry in this environment.
