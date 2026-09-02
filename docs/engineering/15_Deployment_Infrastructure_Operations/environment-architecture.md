---
Document Name: Environment Architecture
Document ID: ED-DIO-ENV-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Environment Architecture

## 1. Purpose

This document elaborates [environment-management.md](../08_Implementation_Foundation/environment-management.md)'s four environments at the deployment-operations level. **No environment URL, infrastructure size, or cloud service is invented.**

## 2. The Five Environments

Restated from [environment-management.md](../08_Implementation_Foundation/environment-management.md) Section 2, with Local Development treated as a distinct fifth entry for deployment-operations purposes (a developer's own machine is not the same operational concern as a shared Development environment):

```mermaid
flowchart LR
    Local[Local Development] --> Dev[Development]
    Dev --> Test[Testing]
    Test --> Stage[Staging]
    Stage --> Prod[Production]
```

## 3. Local Development

| Aspect | Detail |
|---|---|
| Purpose | Individual developer iteration on a personal machine, restated unchanged from [environment-management.md](../08_Implementation_Foundation/environment-management.md) Section 3 |
| Data policy | Sample/fixture data only — never real Curated production data |
| Configuration policy | Local, developer-specific, never containing a production value ([configuration-and-secrets-operations.md](configuration-and-secrets-operations.md)) |
| AI/model policy | Development-scoped, low-privilege AI credentials if a real provider call is made; otherwise mocked, restated from [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 8 |
| External integrations | Local/mocked where possible |
| Access restrictions | Not internet-exposed |
| Observability | Verbose, developer-facing logging only |
| Deployment expectations | Not a deployment target in the operational sense — no artifact from Local Development is ever promoted directly to another environment |

## 4. Development

| Aspect | Detail |
|---|---|
| Purpose | Shared integration point for in-progress work, restated from [environment-management.md](../08_Implementation_Foundation/environment-management.md) Section 3 |
| Data policy | Synthetic/fixture data, never real Curated production data (AD-IMP-003) |
| Configuration policy | Environment-scoped configuration, distinct source from Local ([configuration-and-secrets-operations.md](configuration-and-secrets-operations.md)) |
| AI/model policy | Development-scoped AI credentials where a real provider is used; low request volume expected |
| External integrations | Mocked/stubbed by default |
| Access restrictions | Restricted to the development team; not a public-facing environment |
| Observability | Standard logging; used for early defect detection |
| Deployment expectations | Continuously or frequently updated from the latest integration branch (branch/commit strategy restated from [branching-and-commit-strategy.md](../08_Implementation_Foundation/branching-and-commit-strategy.md), not re-specified here) |

## 5. Testing

| Aspect | Detail |
|---|---|
| Purpose | Automated test execution (Unit/Integration/API/GIS/AI/E2E per `14_Testing_Security_Observability/`) |
| Data policy | Synthetic/fixture data, deterministic and reproducible, restated from [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 5 |
| Configuration policy | CI-managed, ephemeral configuration |
| AI/model policy | Mocked/stubbed AI provider calls by default, restated from [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 8; real calls only for deliberate integration validation using test-scoped credentials |
| External integrations | Mocked/stubbed by default |
| Access restrictions | No external access; ephemeral, provisioned per test run |
| Observability | Captured per test run for failure diagnosis |
| Deployment expectations | Provisioned and torn down automatically as part of test execution — not a persistent environment |

## 6. Staging

| Aspect | Detail |
|---|---|
| Purpose | Pre-production validation in a production-like environment |
| Data policy | Representative but non-sensitive data — synthetic at production scale, or a sanitized/anonymized subset only with explicit governance sign-off ([data-governance.md](../04_Data_Engineering/data-governance.md) Section 11) — **never unredacted real production data by default**, restated unchanged from AD-IMP-003 |
| Configuration policy | Mirrors production configuration shape, with staging-scoped values ([configuration-and-secrets-operations.md](configuration-and-secrets-operations.md)) |
| AI/model policy | Real AI provider integration using staging-scoped credentials where the provider supports environment separation |
| External integrations | Real integrations, staging-scoped credentials |
| Access restrictions | Restricted to the engineering/QA team; not public |
| Observability | Production-equivalent logging discipline for realistic pre-production validation |
| Deployment expectations | Receives release candidates per [deployment-strategy.md](deployment-strategy.md) before production promotion |

## 7. Production

| Aspect | Detail |
|---|---|
| Purpose | Real DistrictMind operation, serving actual district stakeholders |
| Data policy | Real Curated data, subject to the full [data-governance.md](../04_Data_Engineering/data-governance.md) framework |
| Configuration policy | Production secrets and endpoints, most restricted access of any environment ([configuration-and-secrets-operations.md](configuration-and-secrets-operations.md)) |
| AI/model policy | Real AI provider, production credentials, full audit logging (restated from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 12) |
| External integrations | Real providers, production credentials, full rate-limit/cost implications |
| Access restrictions | Highest — no direct debugging access to production data without an audited, authorized process, restated unchanged from [environment-management.md](../08_Implementation_Foundation/environment-management.md) Section 6 |
| Observability | Structured, retained per a currently undefined retention policy ([storage-and-persistence-operations.md](storage-and-persistence-operations.md) Section 8) |
| Deployment expectations | Receives only validated release candidates that have passed Staging, per [deployment-strategy.md](deployment-strategy.md) and [release-and-rollback.md](release-and-rollback.md) |

## 8. Development Data vs. Production Data — Restated as an Absolute Rule

**No non-production environment ever holds a copy of real production data by default** — restated unchanged from AD-IMP-003. This document does not weaken, qualify, or reinterpret that rule; it applies identically at the deployment-operations level as it does at the environment-management level.

## 9. Environment Promotion

An artifact and its configuration move Development → Testing → Staging → Production in that order (restated and elaborated in [deployment-strategy.md](deployment-strategy.md) Section 3) — no environment is ever skipped for a production-bound release.

## 10. AI/Model Policy Consistency Across Environments

| Environment | AI Behavior |
|---|---|
| Local/Development | Mocked or low-privilege real calls |
| Testing | Mocked/stubbed by default |
| Staging | Real provider, staging credentials |
| Production | Real provider, production credentials, full safety/audit controls active |

The AI provider itself remains Unresolved in every environment — this table describes credential/policy separation, not a technology selection.

## 11. Security

Access restrictions tighten monotonically from Local Development through Production (Sections 3–7) — restated unchanged from [security-testing.md](../14_Testing_Security_Observability/security-testing.md).

## 12. Observability

Every environment emits logs/traces per [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md), with retention and access scope tightening toward Production.

## 13. Milestone Traceability

| Environment | First Needed |
|---|---|
| Local Development, Development | M1 |
| Testing | M1 (as automated tests are introduced) |
| Staging | Before any production deployment — not tied to a specific product milestone |
| Production | Deployment decision, currently Unresolved ([constraints.md](../01_Requirements/constraints.md)) |

## 14. Open Decisions

- Hosting/infrastructure provider for Staging/Production — Unresolved, restated from [environment-management.md](../08_Implementation_Foundation/environment-management.md) Section 10.
- Whether Staging ever uses sanitized real data or remains fully synthetic — a future governance decision, not made here.
- No environment URL, infrastructure size, or specific cloud service is defined anywhere in this document.
