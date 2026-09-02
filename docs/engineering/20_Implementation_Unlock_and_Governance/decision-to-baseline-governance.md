---
Document Name: Decision to Baseline Governance
Document ID: ED-IUG-DECBASE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Decision to Baseline Governance

## 1. Purpose

This document defines the governance path from Decision Evidence to a baselined, traceable engineering state, unifying [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md), [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md), and [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md) into a single enforcement mechanism. **No new decision is created by this document unless genuinely required — none is.**

## 2. The Seven-Step Governance Path

```mermaid
flowchart LR
    Evidence[Decision Evidence] --> Record[Decision Record]
    Record --> Review[Decision Review]
    Review --> Status[Decision Status]
    Status --> Entry[Baseline Entry]
    Entry --> Trace[Traceability Update]
    Trace --> Readiness[Readiness Update]
```

| Step | Detail | Governing Document |
|---|---|---|
| 1. Decision Evidence | Evidence gathered per the twelve categories, tiered Required/Supporting/Insufficient | [decision-evidence-requirements.md](../19_Decision_Records_and_Baseline/decision-evidence-requirements.md) |
| 2. Decision Record | A structured record drafted per the applicable standard (ADR/technology/data-source/GIS/AI) | [architecture-decision-record-standard.md](../19_Decision_Records_and_Baseline/architecture-decision-record-standard.md) and its four specializations |
| 3. Decision Review | Independent review, distinct role from the record's author | [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md) Step 9 |
| 4. Decision Status | Set per the preserved vocabulary — almost always Proposed/Selected, never Confirmed at this stage | [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md) |
| 5. Baseline Entry | [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) is updated | Same, Section 7 |
| 6. Traceability Update | [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) and every cross-referencing document are updated | [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) Section 3 |
| 7. Readiness Update | The relevant Readiness Gate ([readiness-gate-framework.md](../20_Implementation_Unlock_and_Governance/readiness-gate-framework.md) — this milestone's own gates) is re-evaluated | This milestone |

## 3. Why a Decision Cannot Silently Become a Baseline

**Every one of the seven steps in Section 2 requires an explicit, recorded action.** There is no path from Decision Evidence directly to Baseline Entry that skips Decision Record, Decision Review, or Decision Status — restated unchanged from [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md) Section 4's "no automatic promotion" rule, extended here across the full seven-step chain rather than only the Proposed→Confirmed transition. A candidate that has merely accrued favorable Evidence (Step 1) is never mistaken for a baselined decision (Step 5) without Steps 2–4 having genuinely occurred.

## 4. Enforcement Mechanism

| Failure Mode | How This Governance Path Prevents It |
|---|---|
| A candidate is cited as "decided" in a downstream document without a Decision Record | Every downstream document (per this program's own citation discipline, e.g., [technology-baseline-management.md](../19_Decision_Records_and_Baseline/technology-baseline-management.md) Section 2) must cite a specific AD-* ID or explicitly state the item remains unresolved — an uncited claim of "decided" status is itself a documentation defect |
| A Decision Record exists but was never independently reviewed | [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)'s entry format requires a Status field; a record without a completed Step 3 cannot legitimately show a Status beyond Draft/Under Review |
| The baseline is updated but [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) is not | Step 6 is a mandatory, explicit action — restated unchanged from [decision-management-framework.md](../19_Decision_Records_and_Baseline/decision-management-framework.md) Section 3's Baseline stage requiring both registers to update together |
| A Readiness Gate remains marked Fail after its underlying decision reaches Selected | Step 7 requires explicit gate re-evaluation — a stale gate status is a process violation, caught by comparing [readiness-gate-framework.md](readiness-gate-framework.md)'s gate registry against [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) |

## 5. AD-FE-005 / AD-RES-001 — Preserved Supersession History

**This is the only completed supersession relationship in DistrictMind's decision history, restated exactly as documented in [decision-supersession-and-history.md](../19_Decision_Records_and_Baseline/decision-supersession-and-history.md) Section 5, with no new elaboration invented here:**

| Aspect | Detail |
|---|---|
| Original | AD-FE-005, "Conflict Identified, Not Resolved," in [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) — never edited |
| Superseding | AD-RES-001, "Proposed," in [routing-resolution.md](../11_Architecture_Resolution/routing-resolution.md) |
| Governance path applied | Evidence (routing-usage patterns across prior documents) → Record (AD-RES-001 itself) → Review (implicit in the ED-M3 Part 4 resolution milestone's own validation) → Status (Proposed) → Baseline Entry (recorded in [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) Section 13's relationship table) → Traceability Update (every subsequent milestone citing routing references both IDs) → Readiness Update (RG-ARCH-002 in [architecture-readiness-gates.md](architecture-readiness-gates.md) reflects the resolved convention) |

This example demonstrates the seven-step path was, in substance, already followed for this one relationship — this document formalizes that pattern for future use, it does not retroactively alter what already occurred.

## 6. No New Decision Created

**This document creates no new AD-* decision.** Every governance mechanism described references existing decisions and existing process documents from `19_Decision_Records_and_Baseline/`; no genuinely new decision was identified as necessary during this milestone's authoring.

## 7. Security

Step 3 (Decision Review) is this path's central security control — restated unchanged from [decision-review-process.md](../19_Decision_Records_and_Baseline/decision-review-process.md) Section 6's independence requirement.

## 8. Observability

Every step's completion is recorded, making the full Decision→Baseline path auditable end-to-end, consistent with Section 4's enforcement mechanism.

## 9. Milestone Traceability

This governance path applies to every decision across all M1–M6 milestones.

## 10. Open Decisions

None introduced — this document formalizes existing governance mechanics; it advances no candidate through the path it defines.
