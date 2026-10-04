---
Document Name: Security and Observability Stack
Document ID: DM-TB-09
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Security and Observability Stack

Written for: everyone writing code, and the security reviewer.

## 1. Security Baseline

| Control | Development baseline |
|---|---|
| Secrets | Environment variables only. Never committed. Never in the frontend bundle |
| Authentication boundary | Required. Provider UNDER EVALUATION (see D-8) |
| Authorization boundary | Required on every operation, including AI-originated calls |
| Input validation | Pydantic at the backend boundary; typed contracts |
| CORS | Restricted to configured origins (`CORS_ORIGINS`) |
| API error sanitization | Errors return a generic message plus a correlation ID. Internals, stack traces, and SQL are never returned |
| Rate limiting | Design only in this baseline. Implementation and mechanism UNDER EVALUATION |
| Audit logging | Design only. Records authorization decisions and AI tool calls |
| AI tool authorization | Every typed-tool call is authorized (AD-DE-005) |
| AI-to-database access | **Prohibited** (AD-DB-006) |

## 2. Authentication Decision (D-8) — Stated Plainly

The brief's first slice includes **LOGIN**. However, the authentication provider is unresolved (Item 17, RG-SEC-001 Conditional, provider Fail). The candidates (OAuth 2.0/OIDC Proposed; Auth0/Keycloak and custom JWT Candidate) have not been selected.

**Development-only approach:** a sign-in stub that accepts credentials from environment variables, is disabled by configuration in any non-development environment, and is labeled `DEVELOPMENT ONLY — NOT PRODUCTION AUTHENTICATION` in code and docs. It is not a provider selection. It must not be deployed. Replacing it is a required step before any non-development use.

The human reviewer must confirm this approach before the login page is built.

## 3. Secrets and Configuration

| Group | Variables (names only) |
|---|---|
| Frontend | `VITE_API_BASE_URL` |
| Backend | `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS` |
| AI | `OLLAMA_BASE_URL`, `MODEL_NAME` |
| RAG | `CHROMA_PATH` |

Values are never written in documentation. `.env.example` (variable names with placeholder values) is created at implementation. Real `.env` files are excluded from Git. Real credentials are never placed in documentation.

## 4. Observability

| Item | Status |
|---|---|
| Structured application logging | Proposed (technology-stack.md §4.13), approach not vendor |
| Metrics, traces | OpenTelemetry is a Candidate; not selected for development |
| Observability platform | UNDER EVALUATION (Item 19, RG-TECH-011 Fail) |
| Correlation IDs | Required on API errors (Section 1) |

Development minimum: structured logs with a request correlation ID. No platform is adopted by this baseline.

## 5. Dependencies and Supply Chain

Dependencies are pinned at setup. Shadcn/ui components are copied into the repository, so they require manual review on update. Each new dependency is recorded with its purpose and status. Where the existing record requires it, a dependency decision is recorded before adoption.

## 6. Not Selected

Secrets managers, vault products, WAFs, and external identity providers are not selected. Security tooling remains UNDER EVALUATION (RG-SEC-003).

## 7. Known Gaps

RPO/RTO are unresolved and not invented here. Accessibility requirement traceability is a named gap. No penetration or security test has been run.

## 8. Open Decisions

Authentication provider (D-8); secrets tooling; rate-limiting mechanism; observability platform; audit log storage.
