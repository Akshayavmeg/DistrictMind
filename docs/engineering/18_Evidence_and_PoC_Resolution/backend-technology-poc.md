---
Document Name: Backend Technology PoC
Document ID: ED-EPR-BEPOC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Backend Technology PoC

## 1. Purpose

This document defines a conceptual PoC for validating a backend candidate, applying [proof-of-concept-framework.md](proof-of-concept-framework.md) to the dimensions established in [backend-technology-evaluation.md](../17_Data_and_Technology_Resolution/backend-technology-evaluation.md). **No backend technology is selected. No PoC has been executed.**

## 2. PoC Objective

Does the candidate backend technology support the modular monolith, typed request/response validation, the AI/Typed-Tool boundary, and GIS integration without requiring an architectural compromise?

## 3. Scenarios to Validate

| Scenario | What It Tests |
|---|---|
| API routing | A domain-aligned route (AD-API-001) resolves correctly, following the REST + OpenAPI style (AD-BE-002) |
| Validation | A malformed request is rejected with the correct structural (400) vs. semantic (422) distinction (AD-BE-006) |
| Authentication boundary | An unauthenticated request to a protected route is correctly rejected |
| Authorization boundary | A request outside the caller's district/role scope is correctly rejected — tested identically for an ordinary request and a simulated AI-originated Typed Tool call |
| Application services | Business logic executes correctly, separate from Domain Logic (AD-BE-003) |
| Domain logic | Pure business rules execute correctly, isolated from I/O |
| Repository integration | A read/write correctly passes through the Repository layer with local ACID transaction behavior (AD-BE-005) — no distributed transaction is attempted |
| GIS integration | The candidate correctly invokes a stubbed GIS Service and returns its result without performing computation itself |
| AI integration | The candidate correctly dispatches a stubbed Typed Tool call, enforcing authorization identically to Scenario 4 |
| Background jobs | A simulated long-running task (e.g., a stubbed Prediction call) executes asynchronously per the four-criterion sync/async test (AD-BE-004), without blocking the calling request |
| Error handling | Every error category from [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) Section 6 produces its correctly shaped response |
| Observability | Every request emits a correlation ID that propagates through a simulated multi-step AI plan |
| Testing support | The candidate's ecosystem supports unit, integration, and API-level testing per [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) without requiring unusual workarounds |

## 4. Modular Monolith — Preserved as a PoC Gate

**A candidate that cannot cleanly express Application Services, Domain Logic, and Repository as internal module boundaries within a single deployable unit fails this PoC outright**, regardless of its performance on other scenarios — restated unchanged from AD-BE-001/AD-002. This is evaluated in Scenario "Application services"/"Domain logic"/"Repository integration" above, but is treated as a non-negotiable gate, not merely one dimension among several.

## 5. AI Boundary — Preserved as a PoC Gate

**A candidate whose ORM/framework idioms make it difficult to route every AI-originated data need through the Typed Tool → Authorization → Application Service → Repository chain fails this PoC**, restated unchanged from AD-DE-005/AD-DB-006/AD-API-002. Scenario "AI integration" specifically tests that no shortcut path exists.

## 6. Preconditions

- A stubbed GIS Service and stubbed AI Typed Tool dispatcher, consistent with [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 8.
- Fixture request/response payloads matching the shapes already defined in [api-contracts.md](../06_API_and_Integration/api-contracts.md) — no new endpoint is invented for this PoC.

## 7. Evidence Categories Addressed

| Category | How This PoC Addresses It |
|---|---|
| Functional | API routing, validation, error handling scenarios |
| Technical | Modular monolith fit, layering discipline |
| Security | Authentication/authorization boundary, AI boundary enforcement |
| Reliability | Error-handling correctness under induced failure |
| Operational | Observability/correlation-ID propagation |
| Maintainability | Layering clarity (qualitative, reviewer-assessed) |

## 8. Expected Behavior

Every boundary-enforcement scenario (authentication, authorization, AI-to-database prohibition) succeeds with no exception path found — a single discovered bypass is treated as an automatic **Fail**, not a minor finding, consistent with [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Gate 6's rollback-condition severity.

## 9. Result Categories

Restated unchanged from [proof-of-concept-framework.md](proof-of-concept-framework.md) Section 13.

## 10. No Framework Selected

**This document does not select FastAPI, Node.js (Express/NestJS), Django, or any other backend technology.** It defines what a future PoC against any candidate would need to test.

## 11. Security

This PoC's entire purpose centers on security-boundary validation (Sections 3–5) — no PoC result is accepted as Pass while a boundary-enforcement scenario remains unresolved.

## 12. Observability

This PoC's outcome, once actually run, is recorded via [decision-evidence-record.md](decision-evidence-record.md).

## 13. Milestone Traceability

| PoC Scenario | First Needed |
|---|---|
| API routing, validation, auth boundaries, repository integration | M1 |
| GIS integration | M1–M2 |
| AI integration | M3 |
| Background jobs | M4 |

## 14. Open Decisions

No backend technology is selected. The candidate list remains exactly as established in [backend-technology-evaluation.md](../17_Data_and_Technology_Resolution/backend-technology-evaluation.md) Section 2.
