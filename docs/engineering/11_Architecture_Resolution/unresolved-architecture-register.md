---
Document Name: Unresolved Architecture Register
Document ID: ED-ARES-UNRES-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Unresolved Architecture Register

## 1. Purpose

This document formally registers every unresolved technology or architecture question surfaced across this documentation program, including the items this milestone's brief explicitly directs be inspected. No owner is invented where none is documented.

## 2. Register

| Issue | Why Unresolved | Evidence | Impact | Dependency | Resolution Needed Before Implementation? | Owner/Decision Authority |
|---|---|---|---|---|---|---|
| Frontend framework | Multiple Candidates named, none formally selected | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.1 (React Proposed, Next.js/Vue Candidate) | Blocks nothing in documentation; blocks the first line of frontend code | None | **Yes** — before any frontend implementation begins | Not documented — no owner named in any prior document |
| Backend framework | Same pattern | Same, §4.2 (FastAPI/Node.js/Django, all Candidate) | Blocks the first line of backend code | None | **Yes** | Not documented |
| Database technology | Same pattern | Same, §4.3–4.4; AD-DE-001 elevates PostgreSQL+PostGIS to Proposed, not Confirmed | Blocks schema implementation | None | **Yes** | Not documented |
| GIS library | Same pattern | Same, §4.4 (Leaflet/Mapbox GL Candidate) | Blocks map rendering implementation | Frontend framework | **Yes**, and after frontend framework | Not documented |
| AI provider | Two positions unreconciled: ED-M1's Candidate list (incl. Claude/Anthropic) vs. the Blueprint's specific local Llama 3/Ollama proposal | [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 33 #2, restated unchanged through every subsequent milestone | Blocks AI implementation entirely; also affects local development environment requirements ([development-environment.md](../08_Implementation_Foundation/development-environment.md) Section 12) | The unresolved AI/LLM data-sensitivity constraint ([constraints.md](../01_Requirements/constraints.md)) | **Yes** — this is the single most consequential unresolved item for M3–M6 | Not documented |
| Authentication provider | Multiple Candidates, protocol only Proposed | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.9 | Blocks login implementation | None | **Yes** | Not documented |
| State management (frontend) | Pattern defined (AD-FE-003), no library chosen | [frontend-state-management.md](../10_Frontend_Implementation/frontend-state-management.md) Section 4 | Blocks frontend state-layer implementation | Frontend framework | **Yes**, and after frontend framework | Not documented |
| Job queue | No technology named beyond Candidate mentions | [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) Section 14 | Blocks Prediction/Simulation/Recommendation async execution | Backend framework | **Yes**, by M4 | Not documented |
| Cache technology | Redis remains Proposed, not Confirmed | [database-design.md](../05_Database_Design/database-design.md) Section 25 | Affects performance only, not correctness | None | No — can be deferred past initial implementation without blocking correctness | Not documented |
| Exact district boundary source | No specific dataset/provider identified | [data-sources.md](../04_Data_Engineering/data-sources.md) Section 3 | Blocks any real GIS data loading; also affects the exact 33-district count assertion ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 4) | None | **Yes** — required before M1's GIS foundation can use real data | Not documented |
| Routing convention | **Now resolved** — AD-RES-001 | [routing-resolution.md](routing-resolution.md) | N/A | N/A | No — resolved in this milestone | N/A |
| Visual direction | **Classified, not finally confirmed** — AD-RES-002 records it as Proposed Design Direction; a stakeholder visual-design review remains open | [ui-visual-direction-resolution.md](ui-visual-direction-resolution.md) | Affects frontend visual implementation, not blocking functional correctness | None | Recommended, not strictly blocking — implementation may proceed using the Proposed direction | Not documented |
| Prediction evaluation criteria | No accuracy/evaluation metric specified by any source document for any of the five Blueprint-named Prediction domains | [prediction-architecture.md](../07_AI_GIS_and_Intelligence/prediction-architecture.md) Section 4, every domain's "Evaluation: Under Evaluation" cell | Blocks Gate 7's Approval stage from having an objective basis ([engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md)) | Domain-expert input, not purely an engineering decision | **Yes**, before M4's Prediction models can be approved for use | Not documented |
| Recommendation-engine technology gap | No dedicated `technology-stack.md` entry exists for the multi-criteria scoring approach itself (only its formula is documented, AD-AI-005) | [ai-ml-architecture.md](../07_AI_GIS_and_Intelligence/ai-ml-architecture.md) Section 8, flagged as a documentation-completeness gap | Minor — the approach itself is well-specified even without a technology-stack entry | None | No — a documentation-completeness note, not a blocking technology gap | Not documented |
| Healthcare Demand forecasting gap | The Abstract names it as a forecasting target; the Blueprint's concrete five-model list does not include it | [prediction-architecture.md](../07_AI_GIS_and_Intelligence/prediction-architecture.md) Section 4.6 | Affects whether M4 scope includes this domain at all | Whichever source is treated as authoritative for M4 scope | Recommended before M4 scoping, not before M1–M3 | Not documented |
| Other contradiction: technology-stack.md vs. Blueprint-sourced Proposed statuses | ED-M1's [technology-stack.md](../00_Engineering_Overview/technology-stack.md) lists several technologies as undifferentiated Candidate where the Blueprint gives a specific, justified choice (PostgreSQL+PostGIS, Leaflet, FastAPI, etc.) | [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 33 #1, recommended for future reconciliation in every subsequent validation report through ED-M2 Part 2B-2B | Cosmetic/documentation-consistency only — does not block implementation, since Proposed status already permits implementation planning | None | No — recommended reconciliation, not a blocker | Not documented |

## 3. Summary — Blocking vs. Non-Blocking

| Blocking (must resolve before implementation begins in earnest) | Non-Blocking (may proceed with current status) |
|---|---|
| Frontend framework | Cache technology |
| Backend framework | Visual direction (Proposed is sufficient to start) |
| Database technology | Recommendation-engine technology-stack entry |
| GIS library | technology-stack.md/Blueprint reconciliation |
| AI provider | |
| Authentication provider | |
| Frontend state-management library | |
| Job queue (by M4) | |
| Exact district boundary source | |
| Prediction evaluation criteria (by M4) | |

## 4. No Owner Invented

Per this milestone's explicit instruction: **no decision-authority owner is named for any item above**, since [constraints.md](../01_Requirements/constraints.md) Development-Team Constraints remains unconfirmed and no prior document assigns a specific person, role, or team to any technology decision. This is itself recorded as a gap in [implementation-readiness.md](implementation-readiness.md).

## 5. Milestone Traceability

| Item | Must Resolve Before |
|---|---|
| Frontend/backend framework, database, GIS library, auth provider, boundary source | M1 |
| State management, prediction evaluation criteria, job queue | M4 |
| AI provider | M3 |
| Recommendation-engine technology entry | M6 (non-blocking) |

## 6. Open Decisions

This entire document is itself the open-decisions register — see [implementation-readiness.md](implementation-readiness.md) for how these translate into readiness blockers.
