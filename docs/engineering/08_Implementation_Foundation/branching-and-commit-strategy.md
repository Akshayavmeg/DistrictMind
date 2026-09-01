---
Document Name: Branching and Commit Strategy
Document ID: ED-IMP-BRANCH-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Branching and Commit Strategy

## 1. Purpose

This document defines a practical branching and commit strategy sized for a student/hackathon project (per [assumptions.md](../01_Requirements/assumptions.md) AS-006) that may later evolve into a more serious engineering system. No enterprise-scale branching complexity (e.g., GitFlow's full release/hotfix branch taxonomy) is introduced without justification.

## 2. Branch Model

| Branch | Purpose |
|---|---|
| `main` | The always-working, always-deployable-in-principle branch — every commit on `main` should represent a validated state (a passing documentation milestone or a validated implementation checkpoint, [engineering-quality-gates.md](engineering-quality-gates.md)) |
| Feature branches | One per vertical slice or discrete unit of work (e.g., `feature/district-map-rendering`), merged back into `main` once reviewed and validated |
| Documentation branches (if useful) | Optional — for a documentation milestone large enough to span multiple work sessions, a branch may isolate it until complete; this program's own prior milestones were, in practice, completed and committed directly, suggesting documentation branches are not strictly necessary at this project's current scale, but remain available if a future contributor finds them useful |
| Milestone branches (if useful) | Optional — a branch per product milestone (e.g., `milestone/m4-prediction`) is a reasonable option once multiple contributors work in parallel on different M-milestones, but is not required while a single contributor progresses milestones sequentially |

**This is deliberately a light branch model** — `main` plus short-lived feature branches — not a prescription for branch types the project does not yet need.

## 3. Commit Naming

| Style | Example | Meaning |
|---|---|---|
| `docs(engineering): ...` | `docs(engineering): complete ED-M3 part 1 implementation foundation` | A documentation milestone commit — matching this program's own established pattern, visible in `git log` for every prior milestone |
| `feat(frontend): ...` | `feat(frontend): render district boundary on map` | A new frontend capability |
| `feat(backend): ...` | `feat(backend): implement get_district read path` | A new backend capability |
| `feat(gis): ...` | `feat(gis): add containment query for facility-to-village resolution` | A new GIS capability |
| `feat(ai): ...` | `feat(ai): add get_healthcare typed tool` | A new AI/tool capability |
| `test(...): ...` | `test(backend): add coverage-gap computation unit tests` | Test-only changes |
| `fix(...): ...` | `fix(gis): correct CRS reprojection for boundary import` | A bug fix |

These are **examples only**, per the milestone brief's explicit instruction — not a rigid, enforced taxonomy. The scope label in parentheses (`frontend`, `backend`, `gis`, `ai`, `docs(engineering)`) matches the domain/layer the change belongs to, consistent with [repository-implementation-map.md](repository-implementation-map.md) Section 2.

## 4. Checkpoint Commits

Every completed vertical slice ([implementation-strategy.md](implementation-strategy.md) Section 4) or documentation milestone is its own commit — never bundled with unrelated work, and never left uncommitted for an extended period (an uncommitted, unreviewed pile of changes is itself a rollback risk, per Section 5).

## 5. Rollback

Because every checkpoint (Section 4) is a distinct, reviewed commit, rolling back a problematic change means returning to the last known-good checkpoint commit — a straightforward `git revert`/`git reset` to a specific prior commit, not a complex multi-step recovery. This is the direct consequence of [implementation-strategy.md](implementation-strategy.md) Section 3's Rollback Philosophy principle.

## 6. Merge Discipline

- A feature branch is reviewed (self-review at minimum, peer review if/when a team exists — per [constraints.md](../01_Requirements/constraints.md) Development-Team Constraints, unconfirmed) before merging into `main`.
- `main` is never force-pushed to, and history is never rewritten on a shared branch — consistent with the Git Safety Protocol this session itself operates under.
- A merge into `main` corresponds to a validated checkpoint (Section 4), not a work-in-progress state.

## 7. Why Not More Complex

A full GitFlow model (develop/release/hotfix branches) introduces coordination overhead appropriate for larger teams with staged release trains — not yet justified for DistrictMind's current, unconfirmed team size ([constraints.md](../01_Requirements/constraints.md)). This is the same "do not overengineer" discipline applied throughout every prior architecture decision in this documentation set (e.g., AD-BE-001's modular-monolith-over-microservices reasoning), now applied to branching strategy specifically.

**AD-IMP-004 — Light Branching Model (Trunk + Short-Lived Feature Branches) Over GitFlow**
- **Context:** A branching strategy needed to be chosen for implementation, and the two natural options at project-inception scale are a full GitFlow taxonomy (develop/release/hotfix/feature) or a lighter trunk-based model.
- **Decision:** DistrictMind uses `main` plus short-lived feature branches (Section 2) as its standing branching model; documentation and milestone branches remain optional, adopted only if a future contributor finds them useful, not mandated now.
- **Alternatives considered:** Full GitFlow (rejected — its release/hotfix branch types solve coordination problems for staged, versioned releases to multiple environments, which DistrictMind does not yet have, per [environment-management.md](environment-management.md)'s still-undecided Staging/Production rollout); no branching discipline at all, committing directly to `main` (rejected — loses the review-before-merge safety net in Section 6).
- **Reasoning:** Directly required by this milestone's explicit "do not introduce unnecessary enterprise complexity" instruction; consistent with the "do not overengineer" thread running through every prior architecture decision in this program.
- **Trade-offs:** A light model provides less structural support if/when the team grows or staged releases become necessary — accepted, since the model can be revisited explicitly (a future documented decision) rather than pre-committing to complexity the project does not yet need.
- **Consequences:** [git-development-workflow.md](git-development-workflow.md) Section 4's checkpoint types (documentation vs. implementation) map cleanly onto this light model without requiring GitFlow's additional branch types.
- **Status:** Proposed.

## 8. Milestone Traceability

| Branching Capability | First Needed |
|---|---|
| `main` branch, commit-naming convention | Already in effect (visible in this repository's existing history) |
| Feature branches | From the start of M1 implementation |
| Milestone branches (if adopted) | Optional, whenever parallel M-milestone work begins |

## 9. Open Decisions

- Whether documentation/milestone branches (Section 2) are ever formally adopted — left as an available option, not a requirement.
- Formal code-review process/tooling — an organizational decision pending team formation, not resolved here.
