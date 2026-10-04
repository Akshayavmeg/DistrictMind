---
Document Name: API Design Principles
Document ID: ED-API-PRIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# API Design Principles

## 1. Purpose

This document defines the design principles governing every DistrictMind API surface, and — equally important — what must never be exposed through an API regardless of convenience.

## 2. Contract-First Design

The API contract ([api-contracts.md](api-contracts.md)) is designed and agreed before implementation, consistent with the API-First Design principle in [engineering-principles.md](../00_Engineering_Overview/engineering-principles.md) and [technical-requirements.md](../01_Requirements/technical-requirements.md) API Requirements. This documentation-only milestone *is* that contract-first step — no implementation exists yet, by design.

## 3. REST / Resource-Oriented Design

Consistent with AD-BE-002 ([backend-architecture.md](../02_System_Architecture/backend-architecture.md)): REST is the **Proposed** style. Resources are modeled around the domain entities in [api-resource-model.md](api-resource-model.md), with operations that are not naturally resource-shaped (e.g., "run a scenario") modeled as explicit action/command resources (Section 8 of [api-resource-model.md](api-resource-model.md)), not forced into a misleading CRUD shape.

## 4. Consistent Naming

Path segments, query parameters, and response field names follow [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8 (kebab-case multi-word paths, plural resource collections) without exception across all 12 domain service surfaces.

## 5. Predictable Responses

Every response for a given resource type follows the same shape regardless of which domain service produced it — e.g., every list response has the same pagination envelope (Section 6), every entity response carries the same provenance metadata fields (Section 16 of [api-architecture.md](api-architecture.md)). Predictability here directly supports frontend performance (fewer special cases, per [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 18) and AI tool reliability (a typed tool's caller can rely on a consistent result shape).

## 6. Pagination

Every list-shaped response is paginated by default — no endpoint returns an entire table's worth of rows in one response, consistent with [database-performance.md](../05_Database_Design/database-performance.md) Section 9. Pagination parameters and envelope shape are conceptually standardized across all resources; exact mechanics (cursor vs. offset) are **Under Evaluation**.

## 7. Filtering

List endpoints support filtering by the dimensions a domain naturally has (e.g., facilities filtered by type, indicators filtered by domain and date range — mirroring FR-017's dashboard filtering requirement). Filters are validated against the same domain enumerations defined in [data-validation.md](../04_Data_Engineering/data-validation.md) Section 3, not arbitrary free-text.

## 8. Sorting

Where meaningful (e.g., Recommendations sorted by score, Analytical Results sorted by time), sorting is a supported, explicitly allow-listed parameter — never an arbitrary passthrough to a database ORDER BY clause, which would risk exposing internal column names or enabling abuse.

## 9. Validation

Two-stage validation, per [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 8: structural/type validation at the API boundary, business-rule validation within the Service Layer. Every input is validated before touching a Domain Service, including AI tool call parameters ([ai-tool-contracts.md](ai-tool-contracts.md)).

## 10. Authorization

Every endpoint enforces role-based authorization before executing (Section 12, [api-architecture.md](api-architecture.md); full detail in [authentication-authorization.md](authentication-authorization.md)) — there is no "public by default" endpoint except where explicitly and deliberately scoped as such (a **Proposed** Public Viewer role, [authentication-authorization.md](authentication-authorization.md) Section 3).

## 11. Rate Limiting

Applied at the API boundary, with AI-driven and data-ingestion-triggering endpoints flagged as priority targets given their resource cost, consistent with [security-architecture.md](../02_System_Architecture/security-architecture.md) Sections 7 and 14. No specific numeric limit is set here — an implementation-time tuning concern.

## 12. Error Handling

| Category | Example | Client-Facing Behavior |
|---|---|---|
| Authentication failure | Missing/invalid token | 401-equivalent, generic message, no detail on why the credential was rejected |
| Authorization failure | Valid user, insufficient role | 403-equivalent, generic message |
| Invalid input | Malformed request body, out-of-range parameter | 400-equivalent, structured field-level detail (not exposing internal validation logic) |
| Resource not found | Unknown district ID | 404-equivalent |
| Spatial query failure | Malformed geometry input, unsupported operation | 400/500-equivalent depending on cause, never a raw geometry-engine stack trace |
| Data unavailable | No data for the requested entity/domain (distinct from "not found" — the entity exists but has no data yet) | A distinct, explicit "no data" response shape, per [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) Section 12's missing-data handling generalized to all API clients |
| Stale data | Data older than a freshness threshold relevant to the request | Data is still returned, but flagged with its freshness (Section 16, [api-architecture.md](api-architecture.md)) — staleness is disclosed, not hidden |
| External dependency failure | An external data source or AI provider is unreachable | 502/503-equivalent, generic message; the specific provider/source is not named in the client-facing error, only in the internal audit log |
| Prediction failure | Insufficient data for a model to produce a result | An explicit "insufficient data" response, not a 500 or a silent guess (NFR-031, [ai-architecture.md](../02_System_Architecture/ai-architecture.md) Section 15) |
| Simulation failure | Sandboxed computation error | 500-equivalent with a generic message; the underlying cause is audit-logged |
| AI tool failure | A typed tool call fails validation, authorization, or execution | The failure is surfaced to the requesting agent as an explicit failure result, per [ai-data-access-model.md](../05_Database_Design/ai-data-access-model.md) Section 13, not silently retried into a fabricated answer |
| Timeout | A downstream operation exceeds its allotted time | 504-equivalent, with the request's async-eligibility surfaced if applicable (Section 18–19, [api-architecture.md](api-architecture.md)) |
| Internal failure | Any unclassified server-side error | 500-equivalent, fully generic message — internal details never reach the client |

**Pattern applied uniformly:** Error → classification (the table above) → safe, generic client-facing message → audit log entry (Section 13) → recovery/fallback where one exists (e.g., stale-data disclosure instead of hard failure). No internal implementation detail (stack traces, database error text, internal service names) is ever returned to a client, consistent with [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 11.

## 13. Observability

Every request/operation is tagged with: a request/correlation ID, the authenticated user/session (where applicable), the endpoint/operation invoked, execution time, status, the responding service/module, the underlying data source(s) touched, and (for AI-originated requests) the Tool Execution/Agent Execution reference. A correlation ID is generated once per originating request and propagated through every downstream service call and, where an AI agent fans out to multiple tools ([ai-agent-integration.md](ai-agent-integration.md)), through every tool invocation belonging to that same user interaction — this is what lets a single confusing AI answer be traced back to the exact sequence of calls that produced it (Blueprint §2.1's "a wrong answer can always be traced to a specific tool call"). No secret (credentials, API keys, tokens) is ever included in observability data, per [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 8.

## 14. Auditability

Restated from Section 15 of [api-architecture.md](api-architecture.md): every administrative action, AI tool call, and state-changing operation is audit-logged, not merely observability-logged — audit logs are retained under the (currently undefined) retention policy distinct from general observability data, per [data-governance.md](../04_Data_Engineering/data-governance.md) Section 5.

## 15. Provenance

Every response carrying a factual claim includes provenance metadata (Section 16, [api-architecture.md](api-architecture.md); full detail [evidence-provenance-flow.md](evidence-provenance-flow.md)) — this is an API design principle, not an optional enhancement, because it is what keeps DistrictMind's dashboard and AI outputs equally trustworthy.

## 16. Idempotency

Read operations are naturally idempotent. Write/command operations (e.g., submitting a Scenario, reviewing a Recommendation) are designed so that a retried identical request does not create duplicate effect — e.g., a Scenario submission may be keyed by a client-supplied idempotency token, or a Recommendation review action is a state transition that is a no-op if already applied. Exact mechanism is **Under Evaluation**; the principle itself is not.

## 17. Backward Compatibility

New, additive fields may be introduced without a version bump; a breaking change (removed/renamed field, changed semantics) requires a new API version (Section 15). This is unchanged from [technical-requirements.md](../01_Requirements/technical-requirements.md) Versioning Requirements, restated as an API-specific rule.

## 18. API Versioning

Path-embedded versioning (e.g., `/v1/...`) is the **Proposed** direction, consistent with AD-BE-002. This document does not force a final URL format beyond what [backend-architecture.md](../02_System_Architecture/backend-architecture.md) and [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8 already establish. Deprecation of an old version follows a documented sunset period (exact duration **Under Evaluation**); a deprecated version continues to function until its sunset date, never removed without notice.

## 19. Security

Every principle above operates within the security boundaries already defined in [security-architecture.md](../02_System_Architecture/security-architecture.md) — this document does not redefine security architecture, only its API-surface implications (Sections 10–11 above).

## 20. Performance

Full treatment in Section 18 of the milestone brief, realized in [api-architecture.md](api-architecture.md) Section 20 and [database-performance.md](../05_Database_Design/database-performance.md) — this document's contribution is Sections 6–8 (pagination/filtering/sorting) as the client-contract-level performance levers.

## 21. What Must NOT Be Exposed Through APIs

| Category | Why Not |
|---|---|
| Raw database credentials | Never transmitted to any client under any circumstance — a fundamental Security by Design violation if it occurred |
| Unrestricted SQL / query pass-through | Directly contradicts Principle J and every prior AD-DE-005/AD-DB-006/AD-API-002 decision — no endpoint accepts a raw query string to execute against the database |
| Internal service implementation detail | Stack traces, internal function names, internal service topology — never returned in error responses (Section 12) |
| Model internals | A Prediction's model weights, training code, or internal feature representations are never exposed — only its output value, confidence, and version metadata ([entity-catalog.md](../05_Database_Design/entity-catalog.md) E-PRD-001/002) |
| Unrestricted AI tools | No API surface grants an AI agent a broader tool than the Typed AI Tools in [ai-tool-contracts.md](ai-tool-contracts.md) — restated from AD-API-002 |
| Sensitive source data | Data classified as Potentially Sensitive or higher ([data-governance.md](../04_Data_Engineering/data-governance.md) Section 3) is subject to the same authorization scoping as any other protected resource — never exposed via a lower-privilege or public endpoint as a shortcut |

## 22. Milestone Traceability

| Principle | First Enforced |
|---|---|
| Contract-first, REST, naming, validation, authorization, error handling | M1 |
| Pagination/filtering/sorting across full domain set, observability | M2 — Future |
| Provenance-carrying responses for AI | M3 — Future |
| Idempotency for scenario submission | M5 — Future |
| Idempotency for recommendation review | M6 — Future |

## 23. Open Decisions

- Exact pagination mechanism (cursor vs. offset) — Under Evaluation.
- Exact idempotency-key mechanism — Under Evaluation.
- Exact deprecation/sunset period duration — Under Evaluation.
- Specific rate-limit thresholds — deferred to implementation, consistent with [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 15.
