---
Document Name: Database and GIS Technology Evidence
Document ID: ED-EAV-DBGISTECH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Database and GIS Technology Evidence

## 1. Purpose

This document records technology evidence for the database and GIS categories, incorporating real, current (2026) web verification alongside the existing candidates from [database-technology-evaluation.md](../17_Data_and_Technology_Resolution/database-technology-evaluation.md) and [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md). **No technology is promoted to Confirmed or Selected.**

## 2. Database Candidates

| Candidate | Status | Source |
|---|---|---|
| PostgreSQL | Candidate (technology-stack.md) / Proposed (AD-DE-001) — divergence preserved, not resolved | [technology-stack.md](../00_Engineering_Overview/technology-stack.md); [data-architecture.md](../04_Data_Engineering/data-architecture.md) |
| MySQL/MariaDB | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) |
| MongoDB | To Be Evaluated | Same |

### EV-M6-P2-034 — PostGIS Current Release Verification

| Field | Detail |
|---|---|
| Question | Is PostGIS (PostgreSQL's spatial extension, AD-DB-001's stated approach) an actively maintained, current technology as of this session's date? |
| Source | PostGIS official documentation/release notes, cross-referenced via multiple 2026-dated technical articles |
| Resource | `https://postgis.net/documentation/getting_started/install_windows/released_versions/` |
| Acquisition | WebSearch |
| Observation | **PostGIS 3.6.2 was released February 6, 2026**, with Windows installer bundles for PostgreSQL 14–18 released March 16, 2026 — confirming PostGIS remains actively maintained with a recent release cadence as of this session |
| Validation | Search-result-level confirmation from technical sources describing the release |
| Result | Confirms PostGIS remains a live, actively-developed, current technology — supporting (but not proving) its continued suitability as a Candidate |
| Limitations | This confirms currency/maintenance activity only — it does not constitute a PoC or DistrictMind-specific compatibility test |
| **Status** | **EVIDENCE AVAILABLE** (for the narrow claim: PostGIS is actively maintained and current) |
| Decision impact | Supporting evidence only — does not itself advance the database/GIS Decision toward Selected |

### EV-M6-P2-035 — pgvector Current Release Verification

| Field | Detail |
|---|---|
| Question | Is pgvector (PostgreSQL's vector-search extension, relevant to RAG) actively maintained and current? |
| Source | AWS RDS release notes and technical articles, cross-referenced |
| Resource | Various 2026 technical sources |
| Acquisition | WebSearch |
| Observation | **pgvector 0.8.2** is confirmed supported by Amazon RDS for PostgreSQL as of its most recent (June 2026) release notes, with described integration capabilities (e.g., "pg_ai" automatic embedding regeneration) |
| Validation | Search-result-level confirmation |
| Result | Confirms pgvector remains actively maintained and current, reinforcing its continued Candidate viability for the vector-storage decision ([rag-and-retrieval-evaluation.md](../17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md)) |
| Limitations | Currency confirmation only, not a DistrictMind-specific PoC |
| **Status** | **EVIDENCE AVAILABLE** (for the narrow currency claim) |
| Decision impact | Supporting evidence only |

## 3. The PostgreSQL Status Divergence — Explicitly Not Resolved

**Restated unchanged, per this milestone's explicit instruction:** [technology-stack.md](../00_Engineering_Overview/technology-stack.md) records PostgreSQL as Candidate; AD-DE-001 in [data-architecture.md](../04_Data_Engineering/data-architecture.md) records it as Proposed ("leading candidate"). **This session's confirmation that PostGIS/pgvector remain current and well-maintained (Sections 2's EV-034/EV-035) does not resolve this status divergence** — it only confirms the underlying technology remains a live, non-abandoned option. The divergence itself is a documentation-consistency question, not a technology-currency question, and is explicitly left as-is.

## 4. GIS Candidates

| Track | Candidate | Status |
|---|---|---|
| Server-side | PostGIS | Candidate |
| Server-side | GeoServer | To Be Evaluated |
| Rendering | Leaflet | Candidate |
| Rendering | Mapbox GL JS | Candidate |

No new evidence was acquired in this session for GeoServer, Leaflet, or Mapbox GL JS specifically — this session's GIS-technology research effort was directed at PostGIS/pgvector currency (Section 2) and, more substantially, at actual geographic *data* sources ([telangana-boundary-dataset-evidence.md](telangana-boundary-dataset-evidence.md)), consistent with this milestone's data-first research priority.

## 5. Strengths and Weaknesses

| Candidate | Strengths | Weaknesses/Unresolved |
|---|---|---|
| PostgreSQL/PostGIS | Confirmed current (Section 2); AD-DB-001's extension-not-separate-system pattern already supported | No PoC executed; status divergence unreconciled |
| pgvector | Confirmed current (Section 2); native PostgreSQL integration reduces cross-system complexity if PostgreSQL is eventually Selected | Coupled to a PostgreSQL decision that has not been made |
| MySQL/MariaDB, MongoDB | No new evidence this session | Same as prior milestones |
| GeoServer, Leaflet, Mapbox GL JS | No new evidence this session | Same as prior milestones |

## 6. Architectural Compatibility

Restated unchanged: PostgreSQL/PostGIS's extension-based spatial model remains the best-documented fit for AD-DB-001/AD-DE-001's stated preference; no candidate in either category has been found to violate the six-category state model (AD-DB-005) or AI-exclusion (AD-DB-006) at the documentation level — none has been PoC-verified either.

## 7. Evidence Status

**EVIDENCE PARTIALLY AVAILABLE** — real, current-as-of-2026 confirmation that PostGIS and pgvector remain actively maintained technologies; this is narrow supporting evidence, not a PoC result, and does not itself change either candidate's Candidate/Proposed status.

## 8. Security

No new security finding.

## 9. Observability

No new observability finding.

## 10. Milestone Traceability

| Item | First Needed |
|---|---|
| Database technology resolution | M1 |
| GIS technology resolution | M1–M2 |

## 11. Open Decisions

No database or GIS technology is selected or confirmed. The PostgreSQL status divergence (technology-stack.md Candidate vs. AD-DE-001 Proposed) remains explicitly preserved and unreconciled. Both remain CRITICAL blockers per [implementation-unlock-matrix.md](../20_Implementation_Unlock_and_Governance/implementation-unlock-matrix.md) Rows 6–7.
