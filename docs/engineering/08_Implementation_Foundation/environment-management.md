---
Document Name: Environment Management
Document ID: ED-IMP-ENV-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Environment Management

## 1. Purpose

This document defines DistrictMind's four environments and the rules that keep them isolated, elaborating [system-requirements.md](../01_Requirements/system-requirements.md) Infrastructure Requirements ("environment separation... to avoid testing against live/production data").

## 2. The Four Environments

```mermaid
flowchart LR
    Dev[Development] --> Test[Testing]
    Test --> Stage[Staging]
    Stage --> Prod[Production]
```

## 3. Development

| Aspect | Detail |
|---|---|
| Purpose | Individual developer iteration |
| Data policy | Sample/fixture data only — never real Curated production data (Section 5's non-negotiable rule) |
| Configuration | Local, developer-specific ([configuration-management.md](configuration-management.md)) |
| External services | Local/mocked where possible; if a real external service must be called (e.g., a genuinely limited-use AI provider call), it is called with development-scoped, low-privilege credentials, never production credentials (Section 6) |
| Logging | Verbose, developer-facing |
| Debugging | Full debugging tooling enabled |
| Security expectations | Lowest — a development environment is not internet-exposed and does not hold real user/district data |

## 4. Testing

| Aspect | Detail |
|---|---|
| Purpose | Automated test execution (unit, integration, API — per the future ED-M3 Part 2 testing foundation) |
| Data policy | Synthetic/fixture data, deterministic and reproducible across runs — never production data |
| Configuration | CI-managed, ephemeral | 
| External services | Mocked/stubbed by default; real external calls only where a test explicitly and deliberately validates integration behavior, using test-scoped credentials |
| Logging | Captured per test run for failure diagnosis |
| Debugging | Test-runner-specific tooling |
| Security expectations | Low, same rationale as Development |

## 5. Staging

| Aspect | Detail |
|---|---|
| Purpose | Pre-production validation in a production-like environment |
| Data policy | Representative but non-sensitive data — either fully synthetic at production scale, or a sanitized/anonymized subset if real data is ever used (requiring explicit governance sign-off, [data-governance.md](../04_Data_Engineering/data-governance.md) Section 11) — **never unredacted real production data by default** |
| Configuration | Mirrors production configuration shape, with staging-scoped values |
| External services | Real integrations, using staging-scoped (not production) credentials where the provider supports environment separation |
| Logging | Production-equivalent logging discipline, for realistic pre-production observability testing |
| Debugging | Limited — closer to production restrictions than Development |
| Security expectations | High — closer to production than Development/Testing |

## 6. Production

| Aspect | Detail |
|---|---|
| Purpose | Real DistrictMind operation |
| Data policy | Real Curated data, subject to the full [data-governance.md](../04_Data_Engineering/data-governance.md) framework |
| Configuration | Production secrets and endpoints (Section 6, [configuration-management.md](configuration-management.md)) |
| External services | Real providers, production credentials, full rate-limit/cost implications |
| Logging | Structured, retained per the (currently undefined) retention policy ([data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 30) |
| Debugging | Restricted — no direct debugging access to production data without an audited, authorized process |
| Security expectations | Highest — the full [security-architecture.md](../02_System_Architecture/security-architecture.md) boundary model applies without exception |

## 7. The Non-Negotiable Rule: Development Data ≠ Production Data

Restated as an absolute, not a preference: **no development or testing environment ever holds a copy of real production data by default.** This directly extends the Privacy by Design and Data Integrity principles specifically into the environment-management layer — a developer debugging locally must never be able to inspect a real district resident's data merely because it was convenient to copy the production database for testing.

**AD-IMP-003 — No Default Production-Data Copies in Non-Production Environments**
- **Context:** The fastest way to get "realistic" test data is often to copy a production database snapshot — a practice that is convenient but directly conflicts with Privacy by Design once DistrictMind holds any data with real-world sensitivity (population, health-facility-adjacent data — [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3).
- **Decision:** Development and Testing environments use synthetic/fixture data by default (Sections 3–4); Staging uses synthetic data at production scale or, only with explicit governance sign-off, a sanitized/anonymized subset (Section 5) — a raw production copy is never the default path for any non-production environment.
- **Alternatives considered:** Allowing production-data copies for "realistic" testing, gated only by informal developer discretion (rejected — no informal gate reliably prevents accidental over-sharing, and it conflicts with the Privacy by Design principle DistrictMind is committed to given its government/administrative context).
- **Reasoning:** Directly required by the milestone brief; consistent with [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3's classification scheme, which already anticipates Potentially Sensitive data categories.
- **Trade-offs:** Synthetic data may not surface every real-world data-quality edge case a genuine production copy would — mitigated by Staging's option (with explicit sign-off) to use a sanitized subset when a genuine pre-production validation need arises.
- **Consequences:** [development-environment.md](development-environment.md) Section 14 and [engineering-quality-gates.md](engineering-quality-gates.md) both assume no gate's validation depends on real production data being present locally.
- **Status:** Proposed.

## 8. Preventing Accidental Production Credential Use Locally

| Mechanism | How It Helps |
|---|---|
| Distinct configuration sources per environment (Section 4, [configuration-management.md](configuration-management.md)) | A developer's local `.env`-equivalent file never contains production values, because production secrets are never distributed to individual developer machines in the first place (Section 6 of configuration-management.md) |
| Environment-scoped credentials at the provider level | Where a provider (database, AI, authentication) supports distinct credentials per environment, Development/Testing/Staging never share a credential with Production |
| Startup validation (Section 5, [configuration-management.md](configuration-management.md)) | If a developer accidentally points local configuration at a production endpoint without production credentials, the service fails to start rather than silently connecting with degraded/wrong permissions |
| No production data seeding scripts that pull real data | Development/Testing fixture data is authored/synthetic, never a live pull from production (Section 3–4) |

This document does not specify a technical enforcement mechanism (e.g., a network firewall rule) — that is implementation-time infrastructure work, outside this documentation-only milestone's scope; it establishes the *policy* every future implementation must satisfy.

## 9. Milestone Traceability

| Environment Capability | First Needed |
|---|---|
| Development environment separation | M1 |
| Testing environment | M1 (as automated tests are introduced, per [engineering-quality-gates.md](engineering-quality-gates.md)) |
| Staging environment | Before any production deployment — timing not fixed to a specific product milestone |
| Production environment | Deployment decision, currently unconfirmed ([constraints.md](../01_Requirements/constraints.md) Infrastructure/Deployment Constraints) |

## 10. Open Decisions

- Specific hosting/infrastructure provider for Staging/Production (unchanged open item across every prior milestone).
- Whether Staging ever uses sanitized real data or remains fully synthetic (Section 5) — a future governance decision, not made here.
