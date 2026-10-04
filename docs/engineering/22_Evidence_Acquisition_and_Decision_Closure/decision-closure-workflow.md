---
Document Name: Decision Closure Workflow
Document ID: ED-EADC-CLOSURE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Decision Closure Workflow

## 1. Purpose

This document defines how an unresolved item becomes closed, formalizing [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) and [decision-to-baseline-governance.md](../20_Implementation_Unlock_and_Governance/decision-to-baseline-governance.md) into the specific 11-stage chain this milestone requires. **No item is closed by this document.**

## 2. The Eleven-Stage Closure Chain

```mermaid
flowchart LR
    U[UNRESOLVED] --> ER[Evidence Required]
    ER --> EA[Evidence Acquired]
    EA --> EV[Evidence Validated]
    EV --> PoC[PoC]
    PoC --> Res[Result]
    Res --> Rec[Recommendation]
    Rec --> DR[Decision Review]
    DR --> Dec[Decision]
    Dec --> Base[Baseline]
    Base --> RR[Readiness Reassessment]
```

| Stage | Detail |
|---|---|
| UNRESOLVED | The item's starting state — restated from [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) |
| Evidence Required | The specific evidence categories are identified, per [decision-evidence-requirements.md](../19_Decision_Records_and_Baseline/decision-evidence-requirements.md) |
| Evidence Acquired | Evidence is actually gathered — a distinct stage from Required, since identifying what's needed does not itself produce it |
| Evidence Validated | The acquired evidence is checked for attribution, currency, and sufficiency per [decision-evidence-requirements.md](../19_Decision_Records_and_Baseline/decision-evidence-requirements.md) Section 3's Required/Supporting/Insufficient tiers |
| PoC | A scoped proof-of-concept is executed per [proof-of-concept-framework.md](../18_Evidence_and_PoC_Resolution/proof-of-concept-framework.md) |
| Result | Pass / Fail / Conditional, per that document Section 13 |
| Recommendation | A proposed next action, distinct from the Result itself |
| Decision Review | Independent review, distinct role from whoever prepared the Recommendation, per [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md) Step 9 |
| Decision | A formal AD-* or Decision Record, status Proposed/Selected — never Confirmed at this stage alone |
| Baseline | [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) updated |
| Readiness Reassessment | The relevant Readiness Gate ([readiness-gate-framework.md](../20_Implementation_Unlock_and_Governance/readiness-gate-framework.md)) is re-evaluated, per [implementation-unlock-reassessment.md](implementation-unlock-reassessment.md) |

## 3. An Item Is Never Silently Closed

**Every one of the 11 stages requires an explicit, recorded, attributable action.** There is no path from UNRESOLVED directly to Baseline that skips Evidence Validation, PoC, or Decision Review — restated unchanged from [decision-to-baseline-governance.md](../20_Implementation_Unlock_and_Governance/decision-to-baseline-governance.md) Section 3–4, extended here to the full 11-stage chain including the two new explicit stages (Evidence Required, Evidence Acquired) this milestone introduces to separate "we know what we need" from "we have it."

## 4. What Happens When Evidence Is Insufficient

| Condition | Handling |
|---|---|
| Evidence Acquired but fails Validation | The item returns to Evidence Required — the specific gap is named (e.g., "provenance undocumented"), and acquisition resumes targeting that gap specifically, not a wholesale restart |
| No evidence source exists at all | The item is marked **EVIDENCE NOT AVAILABLE**, and if the gap cannot be closed through further repository/documentation work, **EXTERNAL EVIDENCE REQUIRED** — restated unchanged from [evidence-acquisition-plan.md](evidence-acquisition-plan.md) Section 4's per-item findings |

## 5. What Happens When Candidates Tie

| Condition | Handling |
|---|---|
| Two candidates both pass PoC/Validation with comparably strong evidence | Both remain recorded; the Recommendation stage explicitly states the trade-off rather than arbitrarily favoring one — restated unchanged from [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md) Section 5's "two candidates in the same category" handling. The Decision Review stage makes the final call, with its reasoning explicitly documented (never "both were fine, we picked one") |

## 6. What Happens When a PoC Fails

| Condition | Handling |
|---|---|
| A candidate's PoC produces a clean Fail | Restated unchanged from [proof-of-concept-framework.md](../18_Evidence_and_PoC_Resolution/proof-of-concept-framework.md) Section 13 — the candidate is marked Rejected (per [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md) Section 3), the Rejection reasoning is preserved, and the item returns to Candidate Identification for a remaining or new candidate — it does not remain silently stuck at PoC |
| Every candidate for an item fails PoC | The item remains UNRESOLVED with all attempts documented, and is escalated per [governance-and-ownership-framework.md](../20_Implementation_Unlock_and_Governance/governance-and-ownership-framework.md) Section 5 |

## 7. What Happens When Requirements Conflict

| Condition | Handling |
|---|---|
| Two requirements a candidate must satisfy are found to be mutually exclusive | Escalated to the Requirements Owner (per [requirements-readiness-gates.md](../20_Implementation_Unlock_and_Governance/requirements-readiness-gates.md) RG-REQ-007) — this is treated as a requirements-documentation defect, not a technology-decision problem, and is resolved at that layer before the technology decision resumes |

## 8. What Happens When Evidence Conflicts

| Condition | Handling |
|---|---|
| Two evidence items about the same candidate disagree (e.g., one PoC run shows a Pass, a later one shows a Fail) | Both are preserved; the disagreement itself is treated as new evidence requiring investigation (e.g., a version change, an environmental difference) — restated consistent with [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 10's conflict-detection discipline, applied here to technology evidence rather than data records |

## 9. What Happens When a Decision Becomes Obsolete

| Condition | Handling |
|---|---|
| A previously Selected/baselined decision is invalidated by new evidence, a changed dependency, or a superseding requirement | The decision is marked Superseded or Deprecated, never silently deleted — restated unchanged from [decision-supersession-and-history.md](../19_Decision_Records_and_Baseline/decision-supersession-and-history.md) Sections 3–4. A replacement candidate re-enters the full 11-stage chain from UNRESOLVED (or from whichever stage the new evidence actually starts from), never inheriting the old decision's status |

## 10. Never Silently Close an Unresolved Item — Restated as the Governing Rule

**This is this document's central discipline.** An item is closed only when it has genuinely passed through all 11 stages with recorded, attributable evidence at each — restated unchanged from [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) Section 4's "why decisions need evidence." As of this milestone, **zero of the 18 items in [evidence-acquisition-plan.md](evidence-acquisition-plan.md) has advanced past Stage 1 (UNRESOLVED) or Stage 2 (Evidence Required, which this milestone itself defines) — none has reached Evidence Acquired.**

## 11. Security

Every stage's evidence explicitly includes security dimensions where applicable — an item cannot reach Decision while carrying an unresolved security-boundary risk, restated unchanged from [decision-evidence-requirements.md](../19_Decision_Records_and_Baseline/decision-evidence-requirements.md) Section 4.

## 12. Observability

Every stage transition, once it genuinely occurs, is recorded per [evidence-record-management.md](evidence-record-management.md).

## 13. Milestone Traceability

This closure workflow applies to every unresolved item across all M1–M6 milestones.

## 14. Open Decisions

All 18 items from [evidence-acquisition-plan.md](evidence-acquisition-plan.md) remain at Stage 1 (UNRESOLVED) or Stage 2 (Evidence Required). None has closed.
