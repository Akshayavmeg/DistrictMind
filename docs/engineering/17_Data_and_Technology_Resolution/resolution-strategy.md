---
Document Name: Resolution Strategy
Document ID: ED-DTR-STRAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Resolution Strategy

## 1. Purpose

This document is the master resolution strategy for ED-M5 Part 1, defining *how* DistrictMind will responsibly resolve the implementation blockers established in [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md) and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md). **This document does not resolve any blocker itself.** It establishes evaluation criteria, decision gates, and evidence requirements — the process by which a future decision could responsibly be made.

## 2. Why Resolution Is Necessary

[milestone-readiness-matrix.md](../16_Engineering_Readiness_and_Baseline/milestone-readiness-matrix.md) established that no M1–M6 milestone is implementation-ready. Documentation alone cannot close this gap — real evidence (data access, technology validation, proof-of-concept results) is required. This milestone exists to define what "real evidence" means for each open decision, so that when such evidence eventually arrives, it can be evaluated against a pre-agreed, non-arbitrary standard rather than an improvised one.

## 3. Current Engineering State — Restated

| Dimension | Status |
|---|---|
| Documentation readiness | **COMPLETE** (restated from [engineering-readiness-baseline.md](../16_Engineering_Readiness_and_Baseline/engineering-readiness-baseline.md)) |
| Architecture documentation | **COMPLETE** |
| Requirements documentation | **COMPLETE** |
| Implementation readiness | **NOT READY / BLOCKED** |

This milestone does not change any of these four ratings. It is itself documentation, and documentation readiness was already complete before it began.

## 4. Blockers Inherited From ED-M4

Restated unchanged from [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md):

| Severity | Blocker |
|---|---|
| CRITICAL | No confirmed real data source |
| CRITICAL | No confirmed 33-district boundary dataset |
| CRITICAL | Unresolved frontend/backend/database technology |
| HIGH | Unresolved AI provider |
| HIGH | Healthcare Demand forecasting contradiction |
| HIGH | Recommendation Engine weighted-scoring gap |
| HIGH | Unresolved RPO/RTO |
| MEDIUM | Unresolved GIS technology, RAG/embedding/vector stack, model-serving/background-job technology, authentication/authorization provider, observability/deployment technology |
| LOW | Dataset-deprecation process gap, source-precedence calibration |

None of these ratings changes as a result of this milestone.

## 5. Decision Categories

| Category | Examples | Covered In |
|---|---|---|
| Data sources | Real domain data, 33-district boundary dataset | [data-source-requirements.md](data-source-requirements.md), [district-boundary-dataset-requirements.md](district-boundary-dataset-requirements.md) |
| Frontend/Backend/Database/GIS technology | Framework, database product, spatial extension | [frontend-technology-evaluation.md](frontend-technology-evaluation.md), [backend-technology-evaluation.md](backend-technology-evaluation.md), [database-technology-evaluation.md](database-technology-evaluation.md), [gis-technology-evaluation.md](gis-technology-evaluation.md) |
| AI technology | Provider, model, agent framework, RAG/embedding/vector stack | [ai-technology-evaluation.md](ai-technology-evaluation.md), [rag-and-retrieval-evaluation.md](rag-and-retrieval-evaluation.md) |
| Infrastructure | Hosting, storage, secrets, observability, CI/CD | [infrastructure-technology-evaluation.md](infrastructure-technology-evaluation.md) |

## 6. Evidence-Driven Resolution Process

```mermaid
flowchart LR
    Eval[Evaluation] --> PoC[Proof of Concept]
    PoC --> Validate[Validation]
    Validate --> Decision[Decision]
    Decision --> Baseline[Baseline Update]
```

| Stage | Purpose | Output |
|---|---|---|
| Evaluation | Apply the criteria defined in this milestone's per-domain evaluation documents to real candidates | A comparison table with evidence, not opinion |
| Proof of Concept | A scoped, throwaway implementation exercising the candidate against a DistrictMind-specific scenario (one of the three canonical examples where applicable) | A working (or failing) demonstration, not a claim |
| Validation | Independent review of the PoC's results against the evaluation criteria | A pass/fail/conditional verdict |
| Decision | A formal Architecture Decision recording the outcome | An AD-* entry, Proposed or Selected (Section 8), never silently assumed Confirmed |
| Baseline Update | [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) are updated to reflect the resolved item | An updated register — this milestone does not perform this step for any item, since no evaluation has yet occurred |

This process is elaborated in full, per-stage, in [technology-decision-gates.md](technology-decision-gates.md).

## 7. Status Vocabulary — Existing System Preserved

The existing technology-status vocabulary from [technology-stack.md](../00_Engineering_Overview/technology-stack.md) is **not redefined**: Confirmed, Proposed, Candidate, Under Evaluation, To Be Evaluated, Unresolved. This document does not introduce a competing vocabulary.

## 8. Operational Interpretation of Status Terms — Explicitly Proposed, Not a Redefinition

**The following clarifications are a PROPOSED operational interpretation for this milestone's evaluation process, not a change to the existing status system:**

| Term | Proposed Operational Meaning |
|---|---|
| Candidate | A technology named as a possibility in prior documentation, not yet evaluated against DistrictMind-specific criteria |
| Proposed | A technology or approach recommended by prior documentation as directionally sound, still requiring confirmation |
| Under Evaluation | A Candidate currently undergoing the process in Section 6 (Evaluation and/or PoC stage) |
| Selected | **Proposed here as an intermediate state**: a candidate has passed Evaluation, PoC, and Validation (Section 6) and is recorded as the team's intended choice, pending a final confirming decision — **this is not equivalent to Confirmed** |
| Confirmed | Restated unchanged from every prior milestone: reserved for a technology with an explicit, authoritative decision behind it. **Only Git holds this status today.** A future technology reaches Confirmed only after passing through Selected and receiving a recorded, evidence-backed Decision (Section 6) |
| Rejected | A candidate evaluated and found unsuitable, with the reasoning preserved for audit — never silently removed from the record |
| Deprecated | A previously Confirmed or Selected technology superseded by a later decision — the original decision is preserved per the superseding-relationship discipline already established in [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) Section 13 |

**"Selected" is introduced here as a new intermediate label between "Proposed/Candidate" and "Confirmed."** No prior document uses this term as a formal status; it is proposed to give the evaluation process in Section 6 a way to record a strong, evidence-backed recommendation without prematurely claiming the finality that "Confirmed" implies. If this label is not adopted in a future milestone, all references to it should be read as "Proposed, with supporting evaluation evidence attached."

## 9. What This Milestone Does Not Do

- It does not select a frontend, backend, database, GIS, AI, or infrastructure technology.
- It does not identify or select a real data source or boundary dataset provider.
- It does not resolve the AI provider divergence, the Healthcare Demand contradiction, or the Recommendation scoring gap.
- It does not invent a numeric threshold, benchmark, or scoring weight not already established by prior documentation.

## 10. What This Milestone Does Do

- It defines, per domain, what evidence would need to exist before a Selected or Confirmed decision could responsibly be made.
- It defines the formal gate process a candidate must pass through.
- It restates and organizes the existing unresolved-item register into an actionable evaluation framework.

## 11. Security

Evaluation of any technology explicitly includes its security posture as a criterion (elaborated per-domain in Files 7–13) — restated consistent with [security-and-trust-boundary-matrix.md](../16_Engineering_Readiness_and_Baseline/security-and-trust-boundary-matrix.md); no evaluation framework in this milestone treats security as optional or secondary.

## 12. Observability

Every decision gate (Section 6) produces a recorded, auditable artifact — restated consistent with the audit discipline established throughout this program.

## 13. Milestone Traceability

| Resolution Activity | Blocks Which Milestone Until Resolved |
|---|---|
| Data source resolution | M1 (data), M2 (multi-domain) |
| Boundary dataset resolution | M1 |
| Frontend/Backend/Database/GIS technology resolution | M1 |
| AI technology resolution | M3 |
| RAG/retrieval technology resolution | M3 |
| Infrastructure technology resolution | M1 (staged), all milestones for production deployment |

## 14. Open Decisions

Every blocker in Section 4 remains exactly as open after this milestone as before it. This document creates a process; it does not consume it.
