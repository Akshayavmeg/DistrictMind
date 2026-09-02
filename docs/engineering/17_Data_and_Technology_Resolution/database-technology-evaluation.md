---
Document Name: Database Technology Evaluation
Document ID: ED-DTR-DBEVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Database Technology Evaluation

## 1. Purpose

This document defines evaluation requirements for DistrictMind's database technology. **No final database is selected unless source evidence explicitly confirms it — none does.** Candidates discussed are only those already present in [technology-stack.md](../00_Engineering_Overview/technology-stack.md): PostgreSQL (Candidate), MySQL/MariaDB (Candidate), MongoDB (To Be Evaluated).

## 2. Existing Candidates — Status Restated Unchanged

| Technology | Status | Source | Stated Rationale |
|---|---|---|---|
| PostgreSQL | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.3 | ACID compliance, extension ecosystem (incl. spatial) |
| MySQL/MariaDB | Candidate | Same | Team familiarity, hosting availability |
| MongoDB | To Be Evaluated | Same | Fit for irregular multi-domain district data |

No status above is changed by this document. Note: [data-architecture.md](../04_Data_Engineering/data-architecture.md) (AD-DE-001) independently names "PostgreSQL + PostGIS as the leading candidate" — restated as **Proposed** in that document's own decision, which is a slightly stronger status than [technology-stack.md](../00_Engineering_Overview/technology-stack.md)'s "Candidate" for the same technology. **This divergence is not reconciled here** — both statuses are preserved as recorded in their respective source documents, consistent with this program's non-reconciliation discipline.

## 3. Evaluation Dimensions

| Dimension | Requirement Source |
|---|---|
| Relational modeling | [logical-data-model.md](../05_Database_Design/logical-data-model.md) (AD-DB-002, AD-DB-004) |
| Transactions | [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md) (AD-BE-005 — local ACID only, no distributed transactions) |
| Constraints | [database-normalization.md](../05_Database_Design/database-normalization.md) |
| Indexing | [database-indexing-strategy.md](../05_Database_Design/database-indexing-strategy.md) |
| Spatial support | [spatial-database-design.md](../05_Database_Design/spatial-database-design.md) (AD-DB-001 — spatial as an extension of the primary store) |
| Temporal data | [temporal-database-design.md](../05_Database_Design/temporal-database-design.md) |
| Analytical workloads | [analytical-data-model.md](../05_Database_Design/analytical-data-model.md) |
| Provenance | [data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md) |
| Concurrent access | [database-performance.md](../05_Database_Design/database-performance.md) |
| Backup/recovery | [backup-and-recovery.md](../15_Deployment_Infrastructure_Operations/backup-and-recovery.md) |
| Scalability | [scalability-and-capacity.md](../15_Deployment_Infrastructure_Operations/scalability-and-capacity.md) Section 9 |
| Migration support | Not yet documented — physical schema/DDL explicitly deferred past ED-M2 Part 2B-1 ([architecture-to-implementation-traceability.md](../16_Engineering_Readiness_and_Baseline/architecture-to-implementation-traceability.md) Section 4) |
| ORM/application integration | Depends on backend technology (Item, [backend-technology-evaluation.md](backend-technology-evaluation.md)) |
| Security | [networking-and-access.md](../15_Deployment_Infrastructure_Operations/networking-and-access.md) Section 4 |

## 4. Evaluation Matrix — Structure, Not Verdict

| Dimension | PostgreSQL | MySQL/MariaDB | MongoDB |
|---|---|---|---|
| ACID/transaction fit (AD-BE-005) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Spatial extension maturity (AD-DB-001) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Six-category state model fit (AD-DB-005) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Vector search extension availability (relevant to RAG, [rag-and-retrieval-evaluation.md](rag-and-retrieval-evaluation.md)) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Irregular/semi-structured data fit (Scenario parameters, AD-DB-003) | To Be Evaluated | To Be Evaluated | To Be Evaluated |

**Every cell reads "To Be Evaluated."**

## 5. Spatial Capability as an Extension, Not a Separate System — Restated

**AD-DB-001 and AD-DE-001 both establish that spatial capability should be an extension of the primary relational store, not a separate spatial database system.** This is a structural preference any database evaluation must weigh: a candidate lacking a mature spatial extension (e.g., MongoDB's geospatial support is document-native rather than an extension of a relational engine) represents a more significant architectural departure than one already offering this pattern (e.g., PostgreSQL/PostGIS).

## 6. Six-Category State Model Fit

Restated unchanged from AD-DB-005: the database technology must support the structural, schema-level separation of Source of Truth, Derived, Prediction, Simulation, Recommendation, and AI Response — a candidate whose native data model makes this separation awkward (e.g., forcing all six categories into a single loosely-typed collection) is a poor fit regardless of other merits.

## 7. Vector Search Consideration

Given the unresolved RAG/vector database stack (Item 7, [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md)), whether the primary database's ecosystem offers a mature vector-search extension (e.g., pgvector — itself Candidate, [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section on RAG/Vector Retrieval) is a relevant, coupled evaluation dimension — a database chosen without regard to this coupling risks requiring a second, separate vector store later.

## 8. AI Has No Direct Database Access — Restated as a Database-Level Requirement

**Regardless of which database technology is eventually confirmed, the AI Agent never holds a database credential of any kind.** Restated unchanged from AD-DE-005/AD-DB-006/AD-API-002 — this is not a database-technology-specific concern, but every candidate must support scoped, least-privilege service credentials (Repository-layer-only access) cleanly, since a database technology that only supports a single, all-powerful credential would complicate enforcing this boundary.

## 9. AI → Typed Tools/Services → Application/Repository → Database — Restated

The full access chain, restated unchanged: AI Agent → Typed Tool → Authorization → Application Service → Repository → Database. No database technology evaluation may weaken this chain for convenience (e.g., a candidate's ORM offering a "quick AI integration" shortcut that bypasses the Repository layer would be rejected regardless of its appeal).

## 10. Migration Support — Documented Gap

Physical schema design (DDL, migrations) remains explicitly deferred past ED-M2 Part 2B-1 — this document notes migration-tooling maturity as an evaluation dimension (Section 3) but cannot evaluate it against a not-yet-designed schema.

## 11. Security

Restated from Section 8–9 — database-level access control (roles, least-privilege service accounts) is a mandatory evaluation dimension for any candidate.

## 12. Observability

Database technology evaluation includes whether the candidate's ecosystem provides mature query-performance and connection-health observability consistent with [operational-monitoring.md](../15_Deployment_Infrastructure_Operations/operational-monitoring.md) Section 8.

## 13. Milestone Traceability

| Database Decision | First Needed |
|---|---|
| Database technology selection | M1 (blocks the earliest vertical slice, Gate 2 per [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md)) |

## 14. Open Decisions

**No database technology is selected by this document.** PostgreSQL, MySQL/MariaDB, and MongoDB remain exactly as Candidate/To Be Evaluated as established in [technology-stack.md](../00_Engineering_Overview/technology-stack.md); the AD-DE-001/technology-stack.md status divergence (Section 2) is preserved, not reconciled.
