---
Document Name: Database and GIS Stack
Document ID: DM-TB-05
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Database and GIS Stack

Written for: backend and GIS engineers, and the reviewer approving the database PoC.

## 1. Stack

| Component | Status |
|---|---|
| PostgreSQL | SELECTED FOR DEVELOPMENT; POC REQUIRED; PRODUCTION NOT CONFIRMED |
| PostGIS | SELECTED FOR DEVELOPMENT; POC REQUIRED; PRODUCTION NOT CONFIRMED |
| Leaflet (display only) | SELECTED FOR DEVELOPMENT; see [03](03-frontend-stack.md) |
| Python spatial libraries | Not selected. shapely/GEOS was unavailable in ED-M6 Part 3 (see Section 5) |

## 2. The Database Status Divergence (D-5) — Preserved

| Source | What it says |
|---|---|
| [technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) §4.3 | PostgreSQL: **Candidate** |
| [database-design.md](../engineering/05_Database_Design/database-design.md) §25 and AD-DE-001 ([data-architecture.md](../engineering/04_Data_Engineering/data-architecture.md)) | PostgreSQL/PostGIS: **Proposed**, "leading candidate" |

This baseline selects PostgreSQL and PostGIS **for development**. That does not resolve the divergence. Reconciling it requires a recorded decision, which is not made here. Both sources remain unedited.

## 3. Why PostgreSQL and PostGIS

- They are the primary store and spatial engine in AD-DE-001 and AD-DB-001.
- They provide ACID transactions consistent with AD-BE-005.
- PostGIS provides the server-side spatial computation that AD-FE-004 requires.
- They are the only database candidates with a documented spatial-extension path ([gis-technology-evaluation.md](../engineering/17_Data_and_Technology_Resolution/gis-technology-evaluation.md)).

## 4. Evidence Status

ED-M6 Part 3 (VAL-M6-P3-025): no psql, postgres, pg_config, psycopg2, or psycopg was found. **Database PoC: BLOCKED.** Docker is not installed either (D-13), so the planned Docker Compose route is also blocked until Docker is installed.

## 5. GIS Computation — What Was and Was Not Tested

| Operation | Pure-Python evidence (ED-M6 Part 3) | PostGIS evidence |
|---|---|---|
| Point-in-polygon | TEST EXECUTED — PASS | None |
| Distance (haversine) | TEST EXECUTED — PASS | None |
| Bounding box | TEST EXECUTED — PASS | None |
| WKB polygon parsing | TEST EXECUTED — PASS | None |

**Pure-Python results are not PostGIS evidence.** They show the algorithms are sound. They say nothing about PostGIS correctness, index behavior, or performance.

## 6. Authoritative Computation Operations

The development operations the backend must support, each to be implemented through PostGIS and each to be verified against a PostGIS PoC:

point-in-polygon (district lookup) · distance · buffer · intersection · coverage · nearest feature · spatial filtering

**Build only what the first slice needs.** The first slice needs district lookup and polygon retrieval. The others are added when a feature needs them.

## 7. Minimum Development Schema (First Slice Only)

Not the complete schema. The first slice needs only:

- `district`: stable identifier, display name, and the source identifier (for example, LGD code), per AD-RES-001's stable-identifier rule.
- `district_boundary`: geometry (PostGIS geometry column), CRS declared explicitly, the source and version reference.
- `source_dataset`: source, URL or reference, retrieval date, version, license or provenance status, geographic scope, temporal scope, and validation status (the metadata required by [07](07-data-engineering-stack.md)).

The six information categories remain separate. The first slice writes only Source of Truth data (boundaries, identifiers). Derived, Prediction, Simulation, Recommendation, and AI Response tables are not created yet.

**Logical domains** (Geographic, Administrative, Healthcare, Transportation, Population, Agriculture, Weather, Environment, Disaster, Infrastructure, Education, Analytical, AI/Agent) are named here as the target set. Only Geographic and Administrative are created in the first slice.

## 8. Migrations

Alembic, development migrations only. No production migration is created by this baseline, consistent with the milestone's prohibition on production migrations.

## 9. Test Database

A throwaway local PostgreSQL/PostGIS instance for tests. Tests never run against any database holding real or non-development data.

## 10. Security

Repository-layer access only. The frontend never connects to the database. The AI never connects to the database. Database credentials come from environment variables (see [09](09-security-and-observability-stack.md)).

## 11. Not Yet Evaluated

pgvector (for RAG, if chosen over ChromaDB), indexing strategy, concurrency under load, backup and restore, and PostGIS geometry simplification at scale.

## 12. Open Decisions

PostgreSQL status divergence (D-5); a database PoC is required first; production hosting is unresolved (RG-TECH-012).
