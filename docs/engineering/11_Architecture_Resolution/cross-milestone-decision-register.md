---
Document Name: Cross-Milestone Decision Register
Document ID: ED-ARES-DECREG-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Cross-Milestone Decision Register

## 1. Purpose

This document consolidates every architectural decision recorded across ED-M1 through ED-M3 Part 4 into a single register. It was compiled by searching every prior document for existing decision headers before this milestone's own IDs (`AD-RES-001`, `AD-RES-002`) were assigned, per this milestone's explicit instruction. **No decision ID is duplicated anywhere in this program** — verified via the automated scan whose complete output is reproduced in [ED-M3-P4-VALIDATION.md](ED-M3-P4-VALIDATION.md) Section 10.

## 2. Status Legend

| Status | Meaning |
|---|---|
| Confirmed | Formally decided with approved evidence — **only Git holds this status in the entire program** |
| Proposed | A documented, justified recommendation, not yet formally approved |
| Candidate | One of several options, no preference established |
| Under Evaluation | Not yet meaningfully assessed |
| To Be Evaluated | Same as Under Evaluation, terminology as used in the originating document |
| Unresolved | A conflict or open question with no adopted position |
| Conflict Identified, Not Resolved | A specific ED-M3 Part 3 status, now superseded in effect by AD-RES-001 for routing (Section 4) |

**Git remains the only Confirmed technology decision in this entire program** — no architectural pattern decision (AD-XXX) carries Confirmed status either; every one below is Proposed.

## 3. System Architecture Decisions (`02_System_Architecture/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-001 | Layered Logical Architecture | [system-architecture.md](../02_System_Architecture/system-architecture.md) | Proposed | M1–M6 | Whole system | Establishes the seven-layer structure every later document builds on | Yes |
| AD-002 | Modular Monolith Backend, Separate Web Client | Same | Proposed | M1–M6 | Backend, Frontend | Single backend deployable; AI/Simulation flagged as future extraction candidates | Yes |
| AD-003 | Synchronous-First Communication | Same | Proposed | M1–M6 | Backend, AI | Async limited to background jobs, refined by AD-BE-004 | Yes |
| AD-BE-001 | Modular Monolith Backend Architecture | [backend-architecture.md](../02_System_Architecture/backend-architecture.md) | Proposed | M1–M6 | Backend | Elaborates AD-002 | Yes |
| AD-BE-002 | REST + OpenAPI as the API Style | Same | Proposed | M1–M6 | API | Adopted as the working style for all contracts | Yes |
| AD-DB-001 | Spatial Capability as Extension of Primary Store | [database-architecture.md](../02_System_Architecture/database-architecture.md) | Proposed | M1–M6 | Database, GIS | No separate spatial system | Yes |
| AD-FE-001 | Single-Page Application Shell | [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) | Proposed | M1–M6 | Frontend | SPA over MPA | Yes |
| AD-FE-002 | Separate Server-Cache State from Client UI State | Same | Proposed | M1–M6 | Frontend | Basis for AD-FE-003's 11-category extension | Yes |

## 4. Project Structure Decisions (`03_Project_Structure/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-STRUCT-001 | Single Repository (Monorepo) | [repository-structure.md](../03_Project_Structure/repository-structure.md) | Proposed | M1–M6 | Repository | One repo for frontend+backend | Yes |
| AD-STRUCT-002 | Feature-Oriented Frontend Structure | [frontend-structure.md](../03_Project_Structure/frontend-structure.md) | Proposed | M1–M6 | Frontend | Basis for `10_Frontend_Implementation/`'s feature modules | Yes |
| AD-STRUCT-003 | Module-per-Domain Backend Structure | [backend-structure.md](../03_Project_Structure/backend-structure.md) | Proposed | M1–M6 | Backend | Basis for `09_Backend_Implementation/`'s module inventory | Yes |

## 5. Data Engineering Decisions (`04_Data_Engineering/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-DE-001 | Spatially-Capable Relational Store as Primary Platform | [data-architecture.md](../04_Data_Engineering/data-architecture.md) | Proposed | M1–M6 | Database | Elevates PostgreSQL+PostGIS to Proposed (not Confirmed) leading candidate | Yes |
| AD-DE-002 | ELT Over ETL for Curated-Layer Construction | Same | Proposed | M2 | Data pipeline | Raw layer retained for reprocessing | Yes |
| AD-DE-003 | Batch/Scheduled Ingestion as Default | Same | Proposed | M2 | Data pipeline | No streaming ingestion committed | Yes |
| AD-DE-004 | Sandboxed, Discard-After-Use Simulation Execution | Same | Proposed | M5 | Simulation | Production data never mutated by simulation | Yes |
| AD-DE-005 | Typed, Tool-Mediated AI Data Access | Same | Proposed | M3–M6 | AI | No AI component holds unrestricted database access | Yes |

## 6. Database Design Decisions (`05_Database_Design/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-DB-002 | Logical Entities Are Not Automatically Physical Tables | [logical-data-model.md](../05_Database_Design/logical-data-model.md) | Proposed | M1–M6 | Database | ~29 table-realized entities, not 1:1 with every noun | Yes |
| AD-DB-003 | Structured Attribute Sets for Variable-Shape Data | [database-normalization.md](../05_Database_Design/database-normalization.md) | Proposed | M5 | Simulation | Scenario Parameters not fully normalized | Yes |
| AD-DB-004 | 3NF Default With Named Exceptions | Same | Proposed | M1–M6 | Database | Denormalization only where explicitly justified | Yes |
| AD-DB-005 | Structural Separation of Six Digital Twin State Categories | [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) | Proposed | M1–M6 | Database, AI | Never a shared table with a type flag | Yes |
| AD-DB-006 | No AI Component Holds Unrestricted Database Access | [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) | Proposed | M3–M6 | AI, Database | Restates AD-DE-005 at the database layer | Yes |

## 7. API and Integration Decisions (`06_API_and_Integration/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-API-001 | Domain-Aligned Service Boundaries, Within Modular Monolith | [api-architecture.md](../06_API_and_Integration/api-architecture.md) | Proposed | M1–M6 | API, Backend | 12 domain service surfaces, logical only | Yes |
| AD-API-002 | AI Agent Layer Has No API Path to Unrestricted Data Access | Same | Proposed | M3–M6 | AI, API | Restates AD-DE-005/AD-DB-006 at the API layer | Yes |

## 8. AI/GIS/Intelligence Decisions (`07_AI_GIS_and_Intelligence/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-AI-001 | Descriptive/Diagnostic/Predictive/Prescriptive/Agentic Taxonomy | [intelligence-architecture.md](../07_AI_GIS_and_Intelligence/intelligence-architecture.md) | Proposed | M1–M6 | AI (documentation framing) | Organizing lens only, not a redefinition | Yes |
| AD-AI-002 | Simulation Reuses Trained Prediction Models | [simulation-architecture.md](../07_AI_GIS_and_Intelligence/simulation-architecture.md) | Proposed | M5 | Simulation, Prediction | Analytical scenarios bounded by existing Prediction model coverage | Yes |
| AD-AI-003 | No Fabricated Numeric Confidence | [ai-uncertainty-and-confidence.md](../07_AI_GIS_and_Intelligence/ai-uncertainty-and-confidence.md) | Proposed | M4–M6 | AI | Numeric confidence only from a validated model method | Yes |
| AD-AI-004 | Minimum-Sufficient Tool-Call Planning | [agent-planning-and-reasoning.md](../07_AI_GIS_and_Intelligence/agent-planning-and-reasoning.md) | Proposed | M3–M6 | AI | Avoids unnecessary tool calls | Yes |
| AD-AI-005 | Documented, Inspectable Weighted Formula for Recommendation Scoring | [recommendation-engine.md](../07_AI_GIS_and_Intelligence/recommendation-engine.md) | Proposed | M6 | Recommendation | No opaque ranking model | Yes |

## 9. Implementation Foundation Decisions (`08_Implementation_Foundation/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-IMP-001 | Vertical-Slice, Risk-First Implementation | [implementation-strategy.md](../08_Implementation_Foundation/implementation-strategy.md) | Proposed | M1–M6 | All | Slice-and-validate over full-layer-first | Yes |
| AD-IMP-002 | Five-Way Config/Secrets/Code/Data/Model-Artifact Separation | [configuration-management.md](../08_Implementation_Foundation/configuration-management.md) | Proposed | M1–M6 | All | No colocation of these five categories | Yes |
| AD-IMP-003 | No Default Production-Data Copies in Non-Production | [environment-management.md](../08_Implementation_Foundation/environment-management.md) | Proposed | M1–M6 | All environments | Privacy by Design extended to environment management | Yes |
| AD-IMP-004 | Light Branching Model Over GitFlow | [branching-and-commit-strategy.md](../08_Implementation_Foundation/branching-and-commit-strategy.md) | Proposed | M1–M6 | Development workflow | Trunk + short-lived feature branches | Yes |
| AD-IMP-005 | Ten Qualitative Gates, No Invented Thresholds | [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) | Proposed | M1–M6 | All | Gates aligned to M1–M6, qualitative criteria only | Yes |

## 10. Backend Implementation Decisions (`09_Backend_Implementation/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-BE-003 | Explicit Application Layer, Distinct From Domain Logic | [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) | Proposed | M1–M6 | Backend | New layer within the existing modular monolith | Yes |
| AD-BE-004 | Four-Criterion Sync/Async Test | [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) | Proposed | M1–M6 | Backend | Every new operation classified consistently | Yes |
| AD-BE-005 | Local ACID Transactions Only, No Distributed Transactions | [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md) | Proposed | M1–M6 | Backend, Database | Revisit if AI/Simulation ever extracted | Yes, until/unless extraction occurs |
| AD-BE-006 | Distinct 400/422 Status Codes | [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) | Proposed | M1–M6 | API, Backend | Structural vs. semantic validation distinguished | Yes |

## 11. Frontend Implementation Decisions (`10_Frontend_Implementation/`)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-FE-003 | Eleven State Categories, Each Singly Owned | [frontend-state-management.md](../10_Frontend_Implementation/frontend-state-management.md) | Proposed | M1–M6 | Frontend | No shared generic store | Yes |
| AD-FE-004 | Frontend GIS Layer Is Render-Only | [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) | Proposed | M1–M6 | Frontend, GIS | No client-side authoritative spatial computation | Yes |
| AD-FE-005 | District Route Convention Conflict | [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) | Conflict Identified, Not Resolved → **superseded in effect by AD-RES-001** | M1 | Frontend routing | See Section 12 below | Yes, using AD-RES-001's resolution |
| AD-FE-006 | Animation Principles, Not a Named Library | [frontend-animation-and-interaction.md](../10_Frontend_Implementation/frontend-animation-and-interaction.md) | Proposed | M1–M6 | Frontend | No animation library forced | Yes |

## 12. Architecture Resolution Decisions (`11_Architecture_Resolution/`, This Milestone)

| ID | Title | Source | Status | Affected Milestone | Affected Subsystem | Consequence | Implementation May Proceed? |
|---|---|---|---|---|---|---|---|
| AD-RES-001 | District Route Uses Identifier-Based Addressing | [routing-resolution.md](routing-resolution.md) | Proposed (evidence-resolved) | M1 | Frontend, API | Resolves AD-FE-005; `/districts/:id` canonical, name-alias optional | Yes |
| AD-RES-002 | Visual/UI Direction as Proposed Design Direction | [ui-visual-direction-resolution.md](ui-visual-direction-resolution.md) | Proposed | M1 | Frontend | Dark/glassmorphism/Inter-font/70%-map formally recorded, not Confirmed | Yes |

## 13. Total Decision Count and Status Summary

| Status | Count |
|---|---|
| Proposed | 44 |
| Conflict Identified, Not Resolved (superseded in effect) | 1 (AD-FE-005, resolved by AD-RES-001) |
| Confirmed | 0 architectural decisions (Git alone, a technology status, not an AD) |

**45 total architectural decisions recorded across this entire documentation program, zero ID collisions, zero Confirmed architectural decisions.**

## 14. Milestone Traceability

See each decision's "Affected Milestone" column above — no consolidation table is needed beyond what Sections 3–12 already provide per-decision.

## 15. Open Decisions

Every decision in this register is itself either Proposed or (for AD-FE-005) resolved-in-effect — no decision in this register remains a bare, unaddressed conflict. Non-architectural, still-open **technology** decisions (frontend framework, backend framework, etc.) are tracked separately in [unresolved-architecture-register.md](unresolved-architecture-register.md), since they are not themselves architectural-pattern decisions with recorded IDs.
