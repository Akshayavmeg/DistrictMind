---
Document Name: Project Tooling
Document ID: DM-TB-11
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Project Tooling

Written for: engineers and the human who performs all Git operations.

## 1. Version Control

| Item | Status | Detail |
|---|---|---|
| Git | EXISTING (formally Confirmed) | Version 2.53.0 observed |
| GitHub remote | EXISTING | `origin` tracks `main` (observed). Governance decisions (review rules, branch protection, CI permissions) **are not made** here |
| Branching | Per AD-IMP-004 (Proposed): trunk with short-lived feature branches | No branch created by this baseline |

**No Git write operation was performed in producing this baseline.** The human performs every commit, branch, and push.

## 2. Repository Hygiene (D-14)

A read-only `git status` at the start of this task showed three untracked directories:

- `docs/engineering/06_API_and_Integration/`
- `docs/engineering/22_Evidence_Acquisition_and_Decision_Closure/`
- `docs/engineering/26_Final_Engineering_Closure/`

These hold API contracts (06), evidence-plan documents (22), and the closure record (26). They are not in Git history. **The human should decide whether and how to commit them.** This baseline does not commit them. `docs/technology/` is also new and untracked.

## 3. Package Management

| Area | Tool | Status |
|---|---|---|
| Frontend | npm (observed 11.11.0) | SELECTED FOR DEVELOPMENT |
| Backend | pip inside a virtual environment | SELECTED FOR DEVELOPMENT. No additional dependency manager is selected |
| Lockfiles | npm lockfile; pinned Python requirements | Created at implementation |

## 4. Containers

| Item | Status | Note |
|---|---|---|
| Docker | SELECTED FOR DEVELOPMENT; **not installed** (D-13) | Install before using Compose |
| Docker Compose | SELECTED FOR DEVELOPMENT | Defines local PostgreSQL/PostGIS and optional services. Not created by this baseline |

## 5. Files Created at Implementation (Not Now)

These are created during the first implementation step, not in this documentation task:

- `.gitignore` covering virtual environments, `node_modules`, local `.env` files, build output, and Chroma data
- `.env.example` with variable names and placeholder values only
- Lockfiles and version pins
- `README.md` for the repository

## 6. Editor

VS Code is Proposed ([development-environment.md](../engineering/08_Implementation_Foundation/development-environment.md) §4). No extension set is mandated.

## 7. Scripts and Automation

Developer scripts go in `scripts/` (per [repository-structure.md](../engineering/03_Project_Structure/repository-structure.md)). CI/CD platform: GitHub Actions is a Candidate and is **not selected** by this baseline (Item 20 unresolved).

## 8. Security

No token, key, or credential is stored in the repository or in these documents. Git operations never include a `.env` file.

## 9. Open Decisions

Commit strategy for untracked engineering folders (D-14); GitHub governance (review, protection, CI); CI/CD platform (Item 20); whether a single formatter is standardized (D-11).
