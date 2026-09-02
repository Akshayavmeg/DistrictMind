---
Document Name: API Testing
Document ID: ED-TSO-API-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# API Testing

## 1. Purpose

This document defines API-level testing against the existing 18 operations in [api-contracts.md](../06_API_and_Integration/api-contracts.md). **No new endpoint is invented here**, and no JSON schema is created beyond what is already documented.

## 2. Endpoint Correctness

Every operation in [api-contracts.md](../06_API_and_Integration/api-contracts.md) (Operations 1–18, including Operation 16 Submit Natural-Language Query, Operation 17 Retrieve AI Evidence, Operation 18 Retrieve AI Execution/Audit) is tested against its documented request/response shape, restated unchanged from [api-route-implementation.md](../09_Backend_Implementation/api-route-implementation.md).

## 3. Request Validation

Restated unchanged from [request-response-validation.md](../09_Backend_Implementation/request-response-validation.md): malformed, missing, or out-of-range request fields are rejected with a structured, field-level error — tested for every operation's documented input constraints.

## 4. Response Validation

Every response conforms to its documented shape, including — for AI-related operations — the required Evidence/provenance/confidence fields restated from [ai-frontend-boundary-resolution.md](../11_Architecture_Resolution/ai-frontend-boundary-resolution.md).

## 5. Authentication

Restated unchanged from [authentication-implementation.md](../09_Backend_Implementation/authentication-implementation.md): an unauthenticated request to any protected operation is rejected; a valid session's identity is correctly resolved.

## 6. Authorization

Restated unchanged from [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md): a request scoped outside the caller's authorized district/role is rejected, tested per-operation, including the AI-specific operations (16–18) and the elevated-role requirement for scenario operations ([gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 3).

## 7. Status/Error Behavior

Restated unchanged from [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) Section 6's error category table — every documented error category (validation, authentication, authorization, not-found, conflict, dependency failure, timeout, insufficient evidence) is tested for its correct, structured response shape.

## 8. Resource Ownership/Scope

Every district-scoped operation is tested to confirm a caller cannot retrieve or act on a resource outside their authorized district scope — restated unchanged from Section 6.

## 9. Pagination Where Applicable

Restated unchanged from [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 6: standard list operations (e.g., a facility listing) are tested against pagination parameters; geometry-bearing responses are tested against level-of-detail scoping instead (AD-GIS-001), never generic pagination.

## 10. Filtering

Documented filter parameters (e.g., domain filtering on the dashboard indicator operation, FR-017) are tested for correct narrowing of results.

## 11. Idempotency

Restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 15: read operations are tested for safe repeatability; `create_scenario`/`run_scenario`-equivalent write operations are tested to confirm a retried call does not produce a duplicate record.

## 12. Concurrency

Concurrent requests against the same resource (e.g., two simultaneous Recommendation review actions) are tested for correct conflict handling ([error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) Conflict category), restated consistent with [repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md)'s Transaction Design.

## 13. Rate Limiting Concept

A rate-limiting mechanism is a conceptual protection against abusive request volume — restated as a concept only; no specific limit value or technology is invented, consistent with this milestone's "do not invent numerical thresholds" instruction.

## 14. AI Endpoint Safety

Operations 16–18 are tested specifically for: authorization enforcement identical to any other operation (Section 6), correct rejection of a request attempting to exceed the caller's scope, and correct disclosure behavior when Evidence is insufficient (FR-022) — restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md).

## 15. Provenance/Evidence Propagation

Operation 17 (Retrieve AI Evidence) is tested to confirm the returned Evidence set matches exactly what backed the corresponding AI Response — restated unchanged from [evidence-provenance-flow.md](../06_API_and_Integration/evidence-provenance-flow.md).

## 16. Mapping to API Architecture Decisions

| Decision | Testing Implication |
|---|---|
| AD-API-001 (domain-aligned service boundaries) | API tests are organized per domain boundary, mirroring the service structure |
| AD-API-002 (AI has no unrestricted API data-access path) | Explicitly tested via Section 14 — an AI-originated request can never reach a data path a non-AI request could not also reach through the same authorization |
| AD-GIS-001 (level-of-detail scoping) | Tested per Section 9 — geometry responses are verified against extent/detail-level parameters, not page/pageSize |

## 17. Security

Restated unchanged from Sections 5–6, 14; full treatment in [security-testing.md](security-testing.md).

## 18. Observability

Every API test verifies that a correlation ID is present and propagated in the response/logs, restated unchanged from [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 13.

## 19. Milestone Traceability

| API Testing Scope | First Needed |
|---|---|
| Operations 1–15 (data/GIS domain) | M1–M2 |
| Operations 16–18 (AI) | M3 |

## 20. Open Decisions

- API testing tool/framework — not selected, pending backend framework confirmation.
- Rate-limiting technology, if adopted — Candidate, unresolved.
