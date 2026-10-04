---
Document Name: Technology Risks and Contingencies
Document ID: DM-TB-13
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Technology Risks and Contingencies

Written for: the reviewer and the engineers who will hit these risks first.

## 1. Required Risks (From the Brief)

| ID | Risk | Current state | Contingency |
|---|---|---|---|
| R-01 | PostGIS PoC previously blocked | BLOCKED: nothing installed | Run the database PoC first (Gate 4). If it fails, record it and evaluate the fallback below |
| R-02 | No frontend framework PoC | POC REQUIRED | Build a minimal boot-and-render PoC before the slice (Gate 1) |
| R-03 | No backend framework PoC | POC REQUIRED | Minimal FastAPI boot and DB-connect PoC (Gate 2) |
| R-04 | Database environment absent | Not installed; Docker absent | Install Docker or native PostgreSQL + PostGIS |
| R-05 | AI provider unresolved | UNRESOLVED at production level | Ollama for development only; reassess at production |
| R-06 | RAG untested | Proxy test only | RAG evaluation (see [06](06-ai-and-rag-stack.md) §8) before any quality claim |
| R-07 | Boundary licensing unresolved | Aggregator reports no detectable license | Options A, B, or C in [07](07-data-engineering-stack.md) §4 |
| R-08 | Large geospatial datasets may need specialized processing | Per-district 624–6,076 points; total roughly 20,600–200,500 | Simplify geometry server-side; restrict layers; reassess if measured slow |
| R-09 | Leaflet may need optimization for large geometry | Untested | Simplified geometry tiers (AD-GIS-001); fallback Mapbox GL JS (Candidate) if measured insufficient |
| R-10 | ChromaDB is a development choice only | Not a production decision | Replace with pgvector if deployment or scale requires it |
| R-11 | Ollama is a development choice only | Not a production provider | Replace with another provider if quality, performance, deployment, or governance requires |

## 2. Additional Risks Found in This Baseline

| ID | Risk | Detail | Contingency |
|---|---|---|---|
| R-12 | Docker absent | Compose-based local DB cannot start (D-13) | Native PostgreSQL + PostGIS install |
| R-13 | Browser absent | Playwright and frame-timing checks cannot run (BLOCKED) | Install a browser on the development machine |
| R-14 | Framer Motion conflicts with AD-FE-006 | D-3 | CSS transitions if the human rejects the selection |
| R-15 | Six frontend libraries were never previously evaluated | D-7 | Each gets a PoC before reliance; any that fail are replaced |
| R-16 | Python 3.14 wheel availability unverified | Some packages may lack wheels | Use an earlier CPython minor version, verified at setup |
| R-17 | Ollama model quality | One 3B model; multi-step PARTIAL | Larger model if the hardware allows; reformulate tool planning |
| R-18 | Embedding-candidate contradiction | D-4 | Preserved; sentence-transformers is experimental only |
| R-19 | Development login is not authentication | D-8 | Labeled development-only; replaced before any non-development use |
| R-20 | Data-quality defects in NIC healthcare | 54% duplication, stale labels | Remediation before any count or capacity claim |
| R-21 | Count reconciliation (D-12) | Brief's 7 recommended / 14 unresolved do not reproduce from the 20-thread table (which gives 6 / 9) | Human confirms the counting basis; historical file left unchanged |
| R-22 | Formatter overlap (D-11) | Ruff and Black both format | Choose one |
| R-23 | Repository layout conflicts | Brief layout vs AD-STRUCT-001/003 (D-1, D-2) | Human confirms the merged layout before scaffolding |
| R-24 | Development start vs NOT UNLOCKED determination | D-10 | Recorded as a human-directed start; no gate or blocker changes |
| R-25 | Untracked engineering folders | Not in Git history (D-14) | Human decides the commit strategy |
| R-26 | Scope creep into production | Development-only selections could be mistaken for production | The SELECTED FOR DEVELOPMENT ≠ PRODUCTION CONFIRMED rule, enforced in every review |

## 3. Fallback Strategy (Brief Section 24, Expanded)

Alternatives are listed only as contingencies. None is adopted now.

| Current choice | Fallback | Trigger |
|---|---|---|
| Leaflet | Mapbox GL JS (Candidate); reduced geometry or tiling | Measured rendering failure at 33 districts |
| FastAPI | Django (Candidate) | A demonstrated blocker in the API PoC |
| PostGIS | Remains preferred; reassess only if the PoC exposes a blocking issue | Failed database PoC |
| ChromaDB | pgvector on PostgreSQL | Scale, deployment, or operational need |
| Ollama | Another local or hosted provider | Quality, performance, deployment, or governance need |
| Framer Motion | CSS transitions | Human rejection of D-3, or performance failure |
| Vite | Another React build tool | Demonstrated blocker |
| sentence-transformers | Another embedding model | Quality or licensing finding |

## 4. Failure Handling Procedure (Brief Section 26)

1. Record the failure, with date, command, and observed output.
2. Document the reason.
3. Evaluate the fallback above.
4. Update the technology baseline, with the old status preserved.
5. Do not silently continue with a known blocking technology.

## 5. Open Risks Requiring Human Action

R-07 (licensing choice), R-16 (Python version), R-21 (counts), R-23 (layout), R-14 (Framer Motion), R-25 (commits).
