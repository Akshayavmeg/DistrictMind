---
Document Name: Dependency Management
Document ID: ED-IMP-DEP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Dependency Management

## 1. Purpose

This document defines dependency categories and the review discipline for adopting a new dependency. No exact package version is asserted — every candidate library named below carries its existing status from [technology-stack.md](../00_Engineering_Overview/technology-stack.md), unchanged.

## 2. Dependency Categories

| Category | Purpose | Ownership | Candidate Examples (Status Unchanged from technology-stack.md) |
|---|---|---|---|
| Frontend dependencies | UI framework, styling, mapping, charting | Frontend engineering | React (Proposed), TypeScript (Proposed), Leaflet/Mapbox GL (Candidate), Recharts-equivalent (not yet named in any prior document) |
| Backend dependencies | API framework, validation, data access | Backend engineering | FastAPI/Node.js/Django (Candidate) |
| Database dependencies | ORM/driver, migration tooling | Backend engineering | Driver choice tied to final database product (Proposed: PostgreSQL) |
| GIS dependencies | Spatial computation, routing | GIS/backend engineering | GeoPandas, Shapely, OSMnx (Candidate) |
| AI/ML dependencies | LLM SDK, orchestration, embeddings, ML libraries | AI/ML engineering | LangGraph/LangChain (Candidate), Prophet/XGBoost/scikit-learn (Candidate), Sentence Transformers/FAISS/ChromaDB (Candidate) |
| Development dependencies | Formatters, linters, local tooling | All engineering | Under Evaluation (per [coding-standards.md](coding-standards.md)) |
| Testing dependencies | Test runners, assertion libraries | All engineering | Pytest, Jest/Vitest, Playwright/Cypress (Candidate, [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.11) |

## 3. Per-Category Detail

| Category | Versioning | Update Policy | Security Review | Compatibility Review |
|---|---|---|---|---|
| Frontend | Semantic versioning, pinned in a lockfile once a package manager is confirmed | Deliberate, reviewed updates — not automatic major-version bumps | Required before adoption (Section 4) | Checked against the confirmed frontend framework version |
| Backend | Same pattern | Same | Required | Checked against the confirmed backend framework/runtime version |
| Database | Driver version tied to the confirmed database product's supported range | Updated alongside database version upgrades, not independently | Required | Checked against the database server version |
| GIS | Pinned, since spatial libraries are sensitive to subtle behavioral differences across versions (CRS handling, geometry algorithms) | Conservative — a GIS library update is validated against [spatial-database-design.md](../05_Database_Design/spatial-database-design.md)'s worked examples before adoption | Required | Checked against the database's spatial extension version |
| AI/ML | Pinned; a provider SDK update is validated against [ai-safety-and-grounding.md](../07_AI_GIS_and_Intelligence/ai-safety-and-grounding.md)'s safeguards before adoption, since provider behavior changes can affect grounding | Conservative, given the unresolved provider decision itself | Required, with particular attention to data-handling terms ([constraints.md](../01_Requirements/constraints.md) AI/LLM Constraints) | Checked against the confirmed provider's API version |
| Development/Testing | Less conservative — lower production-risk surface | Regular updates acceptable | Standard review | Checked against the language/runtime version |

## 4. New Dependency Adoption Process

```mermaid
flowchart LR
    New[New Dependency Proposed] --> Just[Justification]
    Just --> Sec[Security Check]
    Sec --> Compat[Compatibility Check]
    Compat --> Appr[Approval]
    Appr --> Adopt[Adoption]
```

| Stage | Detail |
|---|---|
| Justification | Why is this dependency needed — what capability does it provide that isn't already covered by an existing, approved dependency? |
| Security Check | Known-vulnerability review of the specific version being adopted (mechanism/tooling not specified — implementation-time decision) |
| Compatibility Check | Verified against the current confirmed/proposed versions of the runtime and adjacent dependencies it will interact with |
| Approval | A recorded decision (who approves is an organizational detail, unconfirmed per [constraints.md](../01_Requirements/constraints.md) Development-Team Constraints) |
| Adoption | Added to the relevant dependency manifest, with its version pinned |

No dependency skips this process, regardless of how small it appears — a transitive, unreviewed dependency introduced casually is exactly the kind of drift this process exists to prevent.

## 5. Relationship to Licensing

Per [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 3's Evaluation Criterion 3 ("open-source availability / licensing — cost and legal suitability for a government/enterprise-facing platform"): every new dependency's license is checked for compatibility with DistrictMind's eventual deployment context, unresolved per [constraints.md](../01_Requirements/constraints.md) Third-Party Dependency Constraints and Budget Constraints — this document does not resolve those open constraints, only restates that the dependency-adoption process (Section 4) is where they are checked.

## 6. Milestone Traceability

| Dependency Category | First Needed |
|---|---|
| Backend, Database, GIS, Development, Testing | M1 |
| Frontend | M1 |
| AI/ML | M3 |

## 7. Open Decisions

- Every "Candidate"-status library named in Section 2 remains unconfirmed — this document elevates none of them.
- Specific security-scanning tooling (Section 4) — implementation-time decision, not made here.
