---
Document Name: Technology Decision Gates
Document ID: ED-DTR-GATES-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Technology Decision Gates

## 1. Purpose

This document formalizes the decision-gate process any technology or data source must pass through before becoming Confirmed, elaborating [resolution-strategy.md](resolution-strategy.md) Section 6. **A technology cannot become Confirmed merely because it is popular or familiar.**

## 2. The Eight-Stage Gate Process

```mermaid
flowchart LR
    G1[1. Candidate Identification] --> G2[2. Requirement Fit]
    G2 --> G3[3. Evidence Collection]
    G3 --> G4[4. Compatibility Assessment]
    G4 --> G5[5. Proof of Concept]
    G5 --> G6[6. Validation]
    G6 --> G7[7. Decision Review]
    G7 --> G8[8. Baseline Update]
```

## 3. Stage 1 — Candidate Identification

| Aspect | Detail |
|---|---|
| Entry criteria | A technology or data source is named as a possibility, either already in prior documentation (Candidate/Proposed/To Be Evaluated) or newly proposed |
| Activity | The candidate is recorded against the relevant evaluation document (Files 7–13 of this milestone, or [data-source-evaluation-framework.md](data-source-evaluation-framework.md) for data) |
| Exit criteria | The candidate has a named entry in the relevant register, with its current status explicit |

## 4. Stage 2 — Requirement Fit

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 1 complete |
| Activity | The candidate is checked against the architectural requirements it must satisfy (e.g., modular monolith preservation, AI≠direct-DB-access, GIS server-side authority) — a candidate that structurally cannot satisfy a non-negotiable requirement is eliminated here, before further investment |
| Exit criteria | The candidate is confirmed to be at least structurally compatible with DistrictMind's non-negotiable architectural boundaries |

## 5. Stage 3 — Evidence Collection

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 2 complete |
| Activity | Evidence is gathered against the specific evaluation dimensions in the relevant per-domain document (Files 2–13) — documentation review, community/ecosystem assessment, licensing review |
| Exit criteria | A completed evaluation matrix (of the kind left as "To Be Evaluated" in this milestone's own documents) with actual findings, not placeholders |

## 6. Stage 4 — Compatibility Assessment

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 3 complete |
| Activity | The candidate is assessed for compatibility with other already-Selected/Confirmed technologies (e.g., a vector database candidate assessed against whichever primary database has progressed further) |
| Exit criteria | No unresolved incompatibility with any other technology already past Stage 6 for a dependent decision |

## 7. Stage 5 — Proof of Concept

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 4 complete |
| Activity | A scoped, explicitly throwaway implementation exercises the candidate against a real DistrictMind scenario — ideally one of the three canonical examples (10 km coverage, bridge closure, or the rainfall cross-domain chain) — restated consistent with [engineering-readiness-baseline.md](../16_Engineering_Readiness_and_Baseline/engineering-readiness-baseline.md) Section 10's allowance for "prototype/spike work explicitly scoped as throwaway evaluation" |
| Exit criteria | A working (or clearly failing) demonstration exists, with its results recorded regardless of outcome |

## 8. Stage 6 — Validation

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 5 complete |
| Activity | Independent review of the PoC's results against the evaluation criteria from the relevant per-domain document — not by the same person/process that built the PoC, where practical |
| Exit criteria | A recorded pass / fail / conditional verdict |

## 9. Stage 7 — Decision Review

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 6 complete with a pass or conditional-pass verdict |
| Activity | A formal decision is drafted, following the existing decision-ID discipline: search for an existing AD-* covering this topic first ([decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md)); if none exists, assign a collision-free ID |
| Exit criteria | A recorded Architecture Decision, marked **Selected** (per [resolution-strategy.md](resolution-strategy.md) Section 8's proposed intermediate label) or **Proposed**, with rationale, consequences, and affected documents — **never marked Confirmed at this stage** |

## 10. Stage 8 — Baseline Update

| Aspect | Detail |
|---|---|
| Entry criteria | Stage 7 complete |
| Activity | [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) are updated to reflect the new decision; [milestone-readiness-matrix.md](../16_Engineering_Readiness_and_Baseline/milestone-readiness-matrix.md) ratings are re-evaluated for any milestone the resolution unblocks |
| Exit criteria | The baseline documents accurately reflect the new state — a resolved item is never left recorded as unresolved, and an unresolved item is never silently marked resolved without passing through Stages 1–7 |

## 11. "Technically Possible" vs. "Validated for DistrictMind" vs. "Confirmed Decision" — The Central Distinction

| State | Meaning | Gate Stage |
|---|---|---|
| Technically possible | The technology could, in principle, satisfy DistrictMind's requirements — a claim based on documentation/general knowledge alone | Stage 1–2 |
| Validated for DistrictMind | The technology has been evaluated, prototyped, and independently reviewed against DistrictMind's actual, specific requirements | Stage 6 (passed) |
| Confirmed decision | A formal, recorded Architecture Decision exists, with rationale and consequences documented, and the technology is actually adopted as the working baseline | Stage 7–8, formally ratified |

**"Technically possible" is never treated as sufficient grounds for a Confirmed status.** A technology can be technically capable of doing something DistrictMind needs and still fail Stage 5 or 6 because it does not fit DistrictMind's specific architectural, operational, or governance constraints.

## 12. Evidence Requirements Summary

| Decision Type | Minimum Evidence Required Before Confirmed |
|---|---|
| Frontend/Backend/Database/GIS technology | A passing Stage 6 validation of a PoC exercising at least one canonical example end-to-end |
| AI provider/framework | A passing Stage 6 validation plus explicit resolution of the data-sensitivity governance question ([ai-technology-evaluation.md](ai-technology-evaluation.md) Section 4) |
| Data source | A passing evaluation per [data-source-evaluation-framework.md](data-source-evaluation-framework.md) Section 3, with the source's records actually admitted to Curated |
| Boundary dataset | The requirements in [district-boundary-dataset-requirements.md](district-boundary-dataset-requirements.md) all satisfied and verified |
| Infrastructure technology | A passing Stage 6 validation plus a documented deployment exercise consistent with [deployment-strategy.md](../15_Deployment_Infrastructure_Operations/deployment-strategy.md) |

## 13. Popularity/Familiarity Is Not Sufficient

**A technology's market popularity, team familiarity, or general industry adoption is a legitimate input to Stage 3 (Evidence Collection) but never a substitute for Stages 4–8.** Restated as this document's own governing principle: every existing candidate in `00_Engineering_Overview/technology-stack.md` already lists a stated rationale that often includes "team familiarity" — this remains a valid factor, but it does not itself constitute the evaluation.

## 14. Security

Every gate stage explicitly considers security fit (restated from each per-domain evaluation document's own Security section) — a candidate cannot pass Stage 6 while carrying an unresolved security-boundary violation (e.g., a database technology requiring an all-powerful credential with no least-privilege option).

## 15. Observability

Every gate transition is recorded — restated consistent with the audit discipline established throughout this program; a decision that skips a stage is itself a process anomaly worth surfacing, not silently accepted.

## 16. Milestone Traceability

This gate process applies to every unresolved technology and data-source item in [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md), across all milestones each item affects.

## 17. Open Decisions

None introduced — this document defines process, not outcome. No candidate has been advanced through any stage by this milestone.
