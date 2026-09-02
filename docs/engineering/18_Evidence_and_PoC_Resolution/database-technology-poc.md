---
Document Name: Database Technology PoC
Document ID: ED-EPR-DBPOC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Database Technology PoC

## 1. Purpose

This document defines a conceptual database PoC, applying [proof-of-concept-framework.md](proof-of-concept-framework.md) to the dimensions established in [database-technology-evaluation.md](../17_Data_and_Technology_Resolution/database-technology-evaluation.md). **No database is selected. No PoC has been executed. No schema or SQL is created by this document.**

## 2. PoC Objective

Does the candidate database technology support the six-category state model, spatial and temporal data, local ACID transactions, and least-privilege AI-excluded access control without requiring architectural compromise?

## 3. Scenarios to Validate

| Scenario | What It Tests |
|---|---|
| Relational modeling | A representative subset of the logical data model (e.g., the Geography domain, [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) is expressible in the candidate's schema system |
| Constraints | Referential integrity and value constraints (AD-DB-004's 3NF-default discipline) are enforceable |
| Transactions | A multi-step write (e.g., a Recommendation review plus its audit entry) commits or rolls back atomically, consistent with AD-BE-005's local-ACID-only rule |
| Spatial support | The candidate's spatial extension (if any) correctly stores and queries a representative geometry set, consistent with AD-DB-001's extension-not-separate-system preference |
| Temporal support | Effective/event/ingestion timestamps ([temporal-database-design.md](../05_Database_Design/temporal-database-design.md)) are correctly modeled and queryable |
| Indexes | A spatial index and a standard index both demonstrably improve query performance over an unindexed baseline on representative fixture data |
| Provenance | Source/version/timestamp metadata can be modeled and queried alongside the data it describes |
| Analytical queries | A representative aggregation query (e.g., district-level rainfall average) executes correctly against fixture data |
| Concurrent access | Two simulated concurrent writers to the same entity produce the correct conflict/serialization behavior, not silent data loss |
| Backup/recovery compatibility | The candidate supports a backup/restore cycle that preserves the six-category state separation intact |
| Application integration | The candidate integrates with whichever backend technology is under parallel evaluation ([backend-technology-poc.md](backend-technology-poc.md)) without requiring a bespoke, fragile ORM workaround |

## 4. Six-Category State Model — Preserved as a PoC Gate

**A candidate whose native data model makes it awkward to structurally separate Source of Truth, Derived, Prediction, Simulation, Recommendation, and AI Response fails this PoC**, restated unchanged from AD-DB-005. This is tested by attempting to model a representative record from each category and verifying they remain schema-distinguishable, not merely tagged within a single undifferentiated collection.

## 5. AI Has No Direct Database Access — Preserved as a PoC Gate

**This PoC explicitly attempts to verify that the candidate supports issuing a scoped, least-privilege service credential for the Repository layer, with no broader credential ever reachable by the AI Agent** — restated unchanged from AD-DE-005/AD-DB-006. A candidate that only supports a single, all-powerful database credential (no role/grant model) fails this PoC regardless of other strengths.

## 6. Preconditions

- A representative fixture subset of the logical data model (Geography domain at minimum).
- No real production or Curated data, consistent with [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 5.

## 7. Evidence Categories Addressed

| Category | How This PoC Addresses It |
|---|---|
| Functional | Relational modeling, constraint, transaction scenarios |
| Technical | Application integration |
| Spatial | Spatial support scenario |
| Temporal | Temporal support scenario |
| Security | Least-privilege credential scoping (Section 5) |
| Reliability | Concurrent access, backup/recovery compatibility |
| Operational | Index performance behavior |

## 8. Expected Behavior

Every constraint and transaction scenario behaves per its documented ACID/referential-integrity expectation with no silent data corruption; the six-category separation (Section 4) and least-privilege credentialing (Section 5) both succeed without workaround.

## 9. No Schema or SQL Created

**This document defines what a future PoC would test — it does not itself contain schema DDL, SQL, or any executable database artifact.**

## 10. Result Categories

Restated unchanged from [proof-of-concept-framework.md](proof-of-concept-framework.md) Section 13.

## 11. No Database Selected

**This document does not select PostgreSQL, MySQL/MariaDB, MongoDB, or any other database technology.** It defines what a future PoC against any candidate would need to test. The AD-DE-001/[technology-stack.md](../00_Engineering_Overview/technology-stack.md) status divergence for PostgreSQL/PostGIS (restated in [database-technology-evaluation.md](../17_Data_and_Technology_Resolution/database-technology-evaluation.md) Section 2) remains unreconciled by this document.

## 12. Security

Sections 5 and 8 make least-privilege AI-exclusion a mandatory gate, not an optional strength — restated unchanged from every prior milestone's identical rule.

## 13. Observability

This PoC's outcome, once actually run, is recorded via [decision-evidence-record.md](decision-evidence-record.md).

## 14. Milestone Traceability

| PoC Scenario | First Needed |
|---|---|
| Relational modeling, constraints, transactions, indexing | M1 |
| Spatial support | M1–M2 |
| Analytical queries | M2 |
| Provenance modeling | M2 |

## 15. Open Decisions

No database technology is selected. The candidate list remains exactly as established in [database-technology-evaluation.md](../17_Data_and_Technology_Resolution/database-technology-evaluation.md) Section 2.
