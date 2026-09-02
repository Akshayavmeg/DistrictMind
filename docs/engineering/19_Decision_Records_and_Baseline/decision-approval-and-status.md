---
Document Name: Decision Approval and Status
Document ID: ED-DRB-APPROVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Decision Approval and Status

## 1. Purpose

This document defines how decision status is managed, elaborating [resolution-strategy.md](../17_Data_and_Technology_Resolution/resolution-strategy.md) Section 8. **The existing status vocabulary is preserved unchanged. No currently unresolved technology is claimed approved.**

## 2. Existing Status Vocabulary — Preserved Unchanged

| Status | Meaning | Source |
|---|---|---|
| Proposed | A recommended, directionally sound choice, requiring confirmation | Restated unchanged from every prior milestone |
| Candidate | A named possibility, not yet evaluated against DistrictMind-specific criteria | Same |
| Under Evaluation | Currently undergoing the Evidence/PoC process | Same |
| Confirmed | Reserved for a technology with an explicit, authoritative decision behind it — **only Git holds this status today** | Same |
| Unresolved / To Be Determined | No direction established at all | Same |

**This document does not redefine any of the above.**

## 3. Additional Operational Statuses — Explicitly Subordinate

Restated and reinforced from [resolution-strategy.md](../17_Data_and_Technology_Resolution/resolution-strategy.md) Section 8, the following additional labels are **explicitly subordinate to, and never a substitute for, the existing vocabulary above**:

| Status | Subordinate Relationship | Meaning |
|---|---|---|
| Selected | A form of Proposed, carrying attached PoC/Validation evidence | The team's intended choice, pending formal ratification — **never equivalent to Confirmed** |
| Rejected | A terminal outcome for a specific candidate, not a downgrade of an existing Proposed/Confirmed status | The candidate failed evidence or PoC review; preserved in the record, per [decision-supersession-and-history.md](decision-supersession-and-history.md) |
| Deferred | A candidate whose evaluation is intentionally paused, pending a dependency | Neither advancing nor rejected — restated distinct from Unresolved, which implies no direction has even been attempted |
| Superseded | A previously Proposed/Selected decision replaced by a newer one | The relationship is recorded explicitly; the original decision is never deleted |

**None of these four labels ever implies or produces a Confirmed status.** A Selected candidate remains exactly as unconfirmed as a Candidate or Proposed one until it passes through formal approval (Section 5).

## 4. No Automatic Promotion — Explicit Statement

**There is no mechanism by which a decision automatically transitions from Proposed (or Selected) to Confirmed.** Every transition to Confirmed requires:

1. Completed Evidence, PoC, and Validation stages ([decision-management-framework.md](decision-management-framework.md) Section 2).
2. Independent Decision Review (Step 9, [decision-review-process.md](decision-review-process.md)).
3. An explicit approval action, recorded as such — never inferred from the mere passage of time, from a PoC's Pass result alone, or from a technology's continued use in draft documentation.

**A PoC Pass result, by itself, never constitutes approval** — restated unchanged from [decision-evidence-record.md](../18_Evidence_and_PoC_Resolution/decision-evidence-record.md) Section 5.

## 5. What Conceptually Authorizes a Decision

| Concept | Detail |
|---|---|
| Decision Approver role | A conceptual role, distinct from the Decision Author and Decision Reviewer (restated from [decision-management-framework.md](decision-management-framework.md) Section 5) — **never a named individual** |
| Approval action | An explicit, recorded act — e.g., updating the decision's Status field with a dated justification referencing the completed review — never implicit |
| Scope of authorization | An approval authorizes only the specific decision as scoped (Section 6, [decision-management-framework.md](decision-management-framework.md)) — it does not implicitly authorize related or dependent decisions |

## 6. What Makes a Decision Provisional

A decision is provisional (i.e., remains at Proposed/Selected rather than advancing) whenever:

- Its Validation Evidence field ([architecture-decision-record-standard.md](architecture-decision-record-standard.md) Section 2) references a Conditional PoC Result rather than a clean Pass.
- A named dependency ([decision-management-framework.md](decision-management-framework.md) Section 7) has not itself reached at least Selected status.
- A known risk (Section 11 of the ADR standard) remains unmitigated.

## 7. What Makes a Decision Baseline-Worthy

A decision is ready for Baseline Update ([decision-management-framework.md](decision-management-framework.md) Section 3) once it has passed Decision Review (Step 9) with no outstanding blocking risk — this makes it part of the recorded engineering baseline ([decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)), **which is distinct from being Confirmed for implementation.** A Proposed decision can be fully baselined (recorded, traceable, authoritative as the team's current direction) while remaining unconfirmed.

## 8. What Causes Reconsideration

| Trigger | Example |
|---|---|
| New evidence contradicts prior evidence | A candidate previously evaluated favorably is found, via a later PoC, to violate a non-negotiable boundary |
| A dependency's status changes materially | The primary database decision changes, invalidating a coupled vector-database decision's Compatibility evidence |
| A real-world constraint changes | The data-sensitivity governance question (AI provider divergence) is resolved in a way that eliminates a previously viable candidate |

Reconsideration re-enters the decision at the Evidence stage ([decision-management-framework.md](decision-management-framework.md) Section 2), never silently overwrites the existing record.

## 9. What Causes Rejection

| Trigger | Example |
|---|---|
| A non-negotiable architectural invariant is violated | A database candidate requiring a single all-powerful credential, precluding AI-exclusion |
| Licensing prohibits DistrictMind's intended use | A data source whose terms forbid redistribution via the frontend |
| A PoC produces a clean Fail with no viable mitigation | Restated unchanged from [proof-of-concept-framework.md](../18_Evidence_and_PoC_Resolution/proof-of-concept-framework.md) Section 13 |

## 10. No Currently Unresolved Technology Is Approved

**This document does not claim, imply, or record approval for any of DistrictMind's currently unresolved technology or data-source decisions.** Every item in [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) remains exactly as unresolved after this document as before it.

## 11. Security

Section 4's no-automatic-promotion rule is itself a security control — restated consistent with [decision-management-framework.md](decision-management-framework.md) Section 12's failure-mode prevention table (accidental Proposed→Confirmed promotion).

## 12. Observability

Every status transition (Section 3's four labels, plus the core vocabulary) is recorded and dated, per [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md).

## 13. Milestone Traceability

This status-management structure applies to every decision across all M1–M6 milestones.

## 14. Open Decisions

None introduced — no technology's status is changed by this document.
