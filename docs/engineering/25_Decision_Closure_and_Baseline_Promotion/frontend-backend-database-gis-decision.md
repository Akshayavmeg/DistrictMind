---
Document Name: Frontend Backend Database GIS Decision
Document ID: ED-DCB-TECH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Frontend Backend Database GIS Decision

## 1. Purpose

This document assesses frontend, backend, database, and GIS technology evidence from [frontend-technology-poc.md](../24_Evidence_Deep_Validation_and_PoC/frontend-technology-poc.md) and [backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md). **No React/Vite/etc. is confirmed. No FastAPI/etc. is confirmed. No PostgreSQL/PostGIS is confirmed. Pure-Python GIS logic is explicitly not treated as PostGIS evidence.**

## 2. Frontend — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | React (Proposed), TypeScript (Proposed), Leaflet (Candidate) — the only three actually-documented DistrictMind candidates per [frontend-technology-poc.md](../24_Evidence_Deep_Validation_and_PoC/frontend-technology-poc.md) Section 3 |
| PoC evidence | Node.js v24.14.1/npm 11.11.0 confirmed genuinely available (VAL-M6-P3-024) — a real, positive environmental fact; every browser/rendering/animation PoC BLOCKED (no browser tool) |
| Result | No PoC executed against React/TypeScript/Leaflet themselves — only the underlying JS runtime's presence was confirmed |
| Recommendation | Node.js availability enables a future non-visual JS PoC (e.g., a JS point-in-polygon re-implementation for cross-language consistency); actual frontend PoC requires a browser-capable environment not available this session |
| Status | **REMAINS UNDER EVALUATION** |
| Decision ID | None — [RG-TECH-001](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md) remains Fail |

## 3. Backend — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | FastAPI, Node.js (Express/NestJS), Django — all Candidate, unchanged |
| PoC evidence | None executed against any specific framework — Python was used extensively for data validation this program, but this does not constitute a backend-framework PoC, since no framework was installed/configured/exercised as a service |
| Result | Not evaluated |
| Recommendation | Execute Evidence + PoC stage for at least one candidate, per [RG-TECH-002](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md) |
| Status | **REMAINS UNDER EVALUATION** |
| Decision ID | None |

## 4. Database — PostgreSQL/PostGIS

### 4.1 The Status Divergence — Documented, Not Resolved

Per this milestone's explicit instruction, the following divergence is restated exactly as it exists, without silent reconciliation:

| Source | What It Says |
|---|---|
| [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.3 | PostgreSQL: **Candidate** ("One of several options being considered; no preference established yet") |
| [data-architecture.md](../04_Data_Engineering/data-architecture.md) AD-DE-001 | "Spatially-capable relational store as the primary data platform (**PostgreSQL + PostGIS leading candidate**)" — Status: **Proposed** |
| [database-design.md](../05_Database_Design/database-design.md) Section 25 | PostgreSQL: **Proposed** — explicitly citing AD-DE-001, and explicitly stating this table "does not upgrade any of these to Confirmed... every subsequent document in this folder must cite these same statuses, not invent new ones" |
| [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Row 6 | Explicitly flags: "note AD-DE-001/technology-stack.md status divergence remains unreconciled" |
| [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 15 | "PostgreSQL/PostGIS remain Candidate, not Confirmed... No formal confirmation decision has been made" |

**What this divergence actually is:** `technology-stack.md` (the original, broadest technology catalog) labels PostgreSQL "Candidate" — "no preference established yet." `AD-DE-001` and every downstream document built on it (`data-architecture.md`, `database-design.md`) label it "Proposed" and explicitly call it the "leading candidate" — a stronger, directional statement. Both labels remain live in the documentation set simultaneously; neither document has been edited to match the other.

### 4.2 What Evidence Exists

This milestone's own PoC work ([backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md) VAL-M6-P3-025) found **no PostgreSQL server, client, or Python driver available in this environment at all** — `psql`, `postgres`, `pg_config` all absent; neither `psycopg2` nor `psycopg` installed. **This evidence does not favor either side of the divergence** — it establishes that no PostgreSQL PoC was possible this session, which is orthogonal to whether the correct *documentation* status is "Candidate" or "Proposed."

### 4.3 What Remains Unresolved

1. Whether "Candidate" (technology-stack.md) or "Proposed" (AD-DE-001 lineage) is the correct current status — this is a documentation-consistency question, not a technology-fitness question.
2. Whether PostgreSQL/PostGIS should advance beyond either label toward Selected — this requires an actual PoC (server provisioning, connection, six-category schema fit, AI-exclusion credentialing per [RG-TECH-003](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md)), none of which has occurred in any milestone to date.

### 4.4 What Decision Process Is Required

Per [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) Section 12's "Silent architectural changes" failure mode and [change-impact-assessment.md](../19_Decision_Records_and_Baseline/change-impact-assessment.md): reconciling "Candidate" vs. "Proposed" is not this document's decision to make unilaterally — it requires a Decision Review (Step 9, [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md)) that either (a) updates `technology-stack.md` to match AD-DE-001's "Proposed/leading candidate" framing, explicitly recording the change and its rationale, or (b) reconsiders AD-DE-001 itself if "Candidate" is judged the more accurate current state. **This document does neither** — it documents the divergence precisely so a future review can act on it, consistent with "do not silently modify previous architecture decisions."

### 4.5 Decision Evidence Record — PostgreSQL/PostGIS

| Field | Detail |
|---|---|
| Candidate | PostgreSQL + PostGIS |
| PoC evidence | None — no server/client/driver available this session (VAL-M6-P3-025) |
| Result | Not evaluated (environment-blocked) |
| Recommendation | Provision a real PostgreSQL/PostGIS instance in a future session to close [RG-TECH-003](../20_Implementation_Unlock_and_Governance/technology-readiness-gates.md); separately, resolve the Candidate/Proposed documentation divergence via Decision Review |
| Status | **REMAINS UNDER EVALUATION** — the divergence itself REMAINS UNRESOLVED |
| Decision ID | AD-DE-001 (existing, unmodified) |

## 5. GIS — Decision Evidence Record

| Field | Detail |
|---|---|
| Candidates | PostGIS, Leaflet, Mapbox GL JS (Candidate); GeoServer (To Be Evaluated) |
| PoC evidence | **Pure-Python geometry logic (WKB parsing, point-in-polygon, haversine distance, bounding box) was executed and passed** across multiple real datasets this program — restated from [backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md) Section 4 |
| Result | TEST EXECUTED — PASS, for the underlying algorithms only |
| **Explicit non-equivalence statement** | **This PASS result is NOT evidence for PostGIS.** No PostGIS extension, spatial index, `ST_*` function, or spatial database engine of any kind was installed or exercised. The successful geometry operations demonstrate that the *algorithms* DistrictMind's GIS Service layer needs are sound in principle and implementable — they say nothing about PostGIS's own performance, correctness, or fitness |
| Recommendation | Treat the algorithm-level PASS as encouraging but non-substitutive evidence; PostGIS itself still requires its own PoC once a database instance is available |
| Status | **REMAINS UNDER EVALUATION** |
| Decision ID | None |

## 6. Summary — No Technology Confirmed Anywhere in This File

| Category | Status |
|---|---|
| Frontend (React/TypeScript/Leaflet) | Remains under evaluation |
| Backend (FastAPI/Node.js/Django) | Remains under evaluation |
| Database (PostgreSQL/PostGIS) | Remains under evaluation; Candidate/Proposed divergence remains unresolved |
| GIS (PostGIS/Leaflet/Mapbox/GeoServer) | Remains under evaluation; pure-Python algorithm PASS is not PostGIS evidence |

## 7. Security

No credential was fabricated for the absent database. GIS algorithm evidence involved no live spatial database, so no database-layer security control was exercised or claimed.

## 8. Observability

Every finding traces to [frontend-technology-poc.md](../24_Evidence_Deep_Validation_and_PoC/frontend-technology-poc.md) and [backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md) — no new computation performed here.

## 9. Milestone Traceability

All four categories first needed M1; GIS specifically also gates M1–M2.

## 10. Open Decisions

**No frontend, backend, database, or GIS technology is Confirmed or Selected.** The PostgreSQL Candidate/Proposed divergence between `technology-stack.md` and the `AD-DE-001` lineage REMAINS UNRESOLVED and is restated, not silently reconciled, by this document.
