---
Document Name: Backend Technology Evaluation
Document ID: ED-DTR-BEEVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Backend Technology Evaluation

## 1. Purpose

This document defines evaluation requirements for DistrictMind's backend technology. **No final framework is selected.** Candidates discussed are only those already present in [technology-stack.md](../00_Engineering_Overview/technology-stack.md): FastAPI/Python (Candidate), Node.js/Express/NestJS (Candidate), Django (Candidate).

## 2. Existing Candidates — Status Restated Unchanged

| Technology | Status | Source | Stated Rationale |
|---|---|---|---|
| FastAPI (Python) | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.2 | AI/ML ecosystem fit, async support |
| Node.js (Express/NestJS) | Candidate | Same | Frontend/backend language unification |
| Django | Candidate | Same | Rapid CRUD development, admin tooling |

No status above is changed by this document.

## 3. Evaluation Dimensions

| Dimension | Requirement Source |
|---|---|
| API support | [api-architecture.md](../06_API_and_Integration/api-architecture.md) (AD-API-001, REST + OpenAPI per AD-BE-002) |
| Typed validation | [request-response-validation.md](../09_Backend_Implementation/request-response-validation.md) |
| Modular architecture | [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) (AD-BE-001, AD-BE-003) |
| Application services support | Same |
| Domain logic separation | [domain-layer-design.md](../09_Backend_Implementation/domain-layer-design.md) |
| Repository integration | [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md) (AD-BE-005) |
| Authentication support | [authentication-implementation.md](../09_Backend_Implementation/authentication-implementation.md) |
| Authorization support | [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md) |
| GIS service integration | [gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md) |
| AI integration | [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) — must support the Agent/Typed Tool dispatch pattern without weakening the AI≠direct-DB-access boundary |
| Background jobs | [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) (AD-BE-004) |
| Observability | [backend-observability.md](../09_Backend_Implementation/backend-observability.md) |
| Testing | [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) |
| Maintainability | [coding-standards.md](../08_Implementation_Foundation/coding-standards.md) |
| Deployment | [application-packaging.md](../15_Deployment_Infrastructure_Operations/application-packaging.md) |
| Performance | [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md) |

## 4. Evaluation Matrix — Structure, Not Verdict

| Dimension | FastAPI (Python) | Node.js (Express/NestJS) | Django |
|---|---|---|---|
| Async support | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| AI/ML ecosystem fit | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Modular monolith fit (AD-BE-001) | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| GIS library ecosystem fit | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Background job ecosystem | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Team familiarity | To Be Evaluated | To Be Evaluated | To Be Evaluated |

**Every cell reads "To Be Evaluated."** As with [frontend-technology-evaluation.md](frontend-technology-evaluation.md), this establishes comparison structure only.

## 5. Modular Monolith Fit — Explicit Requirement

**Any backend candidate must support the modular monolith unchanged (AD-BE-001/AD-002).** A candidate that structurally pushes toward a microservices decomposition (e.g., a framework whose idiomatic patterns assume independently deployed services) is a poor fit regardless of other merits — restated unchanged from [deployment-architecture.md](../15_Deployment_Infrastructure_Operations/deployment-architecture.md) Section 17.

## 6. AI/ML Ecosystem Fit — Relevant, Not Determinative

FastAPI's stated rationale (AI/ML ecosystem fit) is directly relevant given DistrictMind's AI-centric scope, but this does not predetermine the outcome — the AI Agent/Typed Tool architecture ([typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md)) is designed to be backend-language-agnostic, since the AI provider itself is accessed via an external API call regardless of the backend's own language.

## 7. GIS Service Integration

A candidate backend must support integration with whichever GIS technology is eventually confirmed ([gis-technology-evaluation.md](gis-technology-evaluation.md)) while enforcing server-side-only spatial computation (AD-FE-004) — evaluated per-candidate once a GIS technology direction is clearer, since the two decisions are interdependent.

## 8. Authorization Enforcement Fit

A candidate must support enforcing authorization identically for both ordinary API requests and AI-originated Typed Tool calls (restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 6) — a framework that makes this uniform enforcement awkward to implement is a genuine architectural risk, not merely a style preference.

## 9. Background Job Ecosystem

Given the unresolved background-job technology (Item 12, [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md)), a backend candidate's own ecosystem maturity for async task execution is a relevant, coupled evaluation dimension.

## 10. Security

Backend technology evaluation includes whether the candidate supports parameterized queries by default (restated from [coding-standards.md](../08_Implementation_Foundation/coding-standards.md) Section 4's SQL-injection-prevention rule) and structured, two-stage validation ([backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 8) without requiring bespoke tooling.

## 11. Observability

Backend technology evaluation includes whether the candidate's ecosystem provides mature structured-logging and tracing support consistent with [backend-observability.md](../09_Backend_Implementation/backend-observability.md), independent of which observability platform is eventually confirmed.

## 12. Milestone Traceability

| Backend Decision | First Needed |
|---|---|
| Framework selection | M1 (blocks the earliest vertical slice) |

## 13. Open Decisions

**No backend technology is selected by this document.** FastAPI, Node.js (Express/NestJS), and Django remain exactly as Candidate as established in [technology-stack.md](../00_Engineering_Overview/technology-stack.md).
