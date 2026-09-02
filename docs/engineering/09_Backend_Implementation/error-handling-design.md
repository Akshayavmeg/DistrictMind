---
Document Name: Error Handling Design
Document ID: ED-BEIMPL-ERR-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Error Handling Design

## 1. Purpose

This document defines a consistent error architecture at the HTTP status-code level, elaborating [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 12's classification with the specific codes this milestone requests, checked against existing API documentation rather than forced blindly.

## 2. Status Code Mapping

| Code | Category | Detection | Existing Doc Alignment |
|---|---|---|---|
| 400 | Validation | Structural Validation failure ([request-response-validation.md](request-response-validation.md)) | Matches [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 12's "Invalid input" row |
| 401 | Authentication | Missing/invalid token | Matches Section 12's "Authentication failure" row |
| 403 | Authorization | Valid identity, insufficient role | Matches Section 12's "Authorization failure" row |
| 404 | Not Found | Identifier does not resolve | Matches Section 12's "Resource not found" row |
| 409 | Conflict | Concurrent/idempotency conflict ([concurrency, Section 21 of this document]) | New in this milestone — [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 12 did not enumerate Conflict explicitly; this document adds it consistently with that section's spirit, not contradicting it |
| 422 | Domain/semantic validation | Domain Validation failure (structurally valid input, but semantically invalid — e.g., a Scenario parameter out of a domain-plausible range) | A refinement of the existing "Invalid input" category, distinguishing structural (400) from semantic (422) — noted as a refinement, not a contradiction |
| 429 | Rate limiting | Exceeded a configured rate limit ([security-architecture.md](../02_System_Architecture/security-architecture.md) Section 7) | Matches that document's rate-limiting principle, not previously assigned a specific code |
| 500 | Internal error | Unclassified server-side failure | Matches Section 12's "Internal failure" row |
| 502/503 | External dependency/service failure | An external data source, AI provider, or authentication provider is unreachable | Matches Section 12's "External dependency failure" row |
| 504 | Timeout | An operation exceeds its allotted time | Matches Section 12's "Timeout" row |

This table is a **direct elaboration** of [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 12 — every code maps to a category that document already named; 409 and 422 are refinements made explicit at this implementation-blueprint level of detail, not new categories contradicting the prior document.

**AD-BE-006 — Structural (400) and Semantic (422) Validation Failures Use Distinct Status Codes**
- **Context:** [api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 12 grouped all validation failures under a single "Invalid input" category; at implementation-blueprint granularity, the two-stage validation pattern already established in [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 8 (Structural Validation at the API boundary, Domain Validation within the service) naturally produces two distinguishable failure types.
- **Decision:** A Structural Validation failure (malformed type, missing required field) returns 400; a Domain Validation failure (structurally valid input that violates a business rule, e.g., an out-of-range Scenario parameter) returns 422. Both remain under the single "Validation" umbrella category conceptually — this is a refinement of granularity, not a new category.
- **Alternatives considered:** Returning 400 for both (rejected — collapses a distinction the two-stage validation architecture already makes, and a client cannot tell "you sent malformed JSON" from "you sent well-formed JSON that violates a domain rule" without it, which matters for how the client should react).
- **Reasoning:** Directly required by this milestone's explicit list of status codes to evaluate ("422 Domain/semantic validation where appropriate"); consistent with the existing two-stage validation pattern, not a departure from it.
- **Trade-offs:** One more status code for client implementers to handle — accepted, since it is a standard, widely-understood HTTP convention (422 Unprocessable Entity), not a DistrictMind-invented code.
- **Consequences:** [request-response-validation.md](request-response-validation.md) Section 2's validation-order diagram is the direct basis for this split — Structural Validation failures never reach Domain Validation, so the two codes are never ambiguous about which stage rejected the request.
- **Status:** Proposed.

## 3. Per-Category Detail

| Category | Detection | Classification | Logging | Safe Response | Correlation ID | Recovery |
|---|---|---|---|---|---|---|
| Validation errors (400) | Structural Validation | Client error | Yes, request-scoped | Structured, field-level detail | Included | Client corrects and resubmits |
| Authentication errors (401) | Auth middleware | Security event | Yes, security-scoped | Generic, no detail on rejection reason | Included | Client re-authenticates |
| Authorization errors (403) | Auth middleware | Security event | Yes, security-scoped | Generic | Included | N/A by design |
| Not found (404) | Repository lookup miss | Client error | Yes, request-scoped | Generic | Included | N/A |
| Conflict (409) | Idempotency/state-transition check | Client error | Yes, request-scoped | Explicit conflict description | Included | Client retries with correct state |
| Domain/semantic validation (422) | Domain Validation stage | Client error | Yes, request-scoped | Structured, field-level detail | Included | Client corrects and resubmits |
| Rate limiting (429) | Rate-limit middleware | Client error | Yes, security/operational-scoped | Generic, retry-after hint | Included | Client backs off and retries |
| Database failure (500) | Repository layer | Server error | Yes, operational | Generic | Included | Retry with backoff (transient) or escalate (persistent) |
| GIS failure (500 or 400) | GIS service | Server or client error depending on cause | Yes, operational | Generic (500) or structured (400, invalid geometry) | Included | Client corrects input (400) or server retries (500) |
| AI failure (500 or explicit decline) | AI Orchestration | Server error, or an explicit non-error "cannot answer" | Yes, Tool/Agent Execution audit | Explicit disclosure, never fabricated | Included | Bounded retry, then explicit decline |
| External service failure (502/503) | Integration adapter | Server error | Yes, operational | Generic | Included | Bounded retry ([integration-architecture.md](../02_System_Architecture/integration-architecture.md) Section 13) |
| Timeout (504) | Request/operation deadline | Server error | Yes, operational | Generic, async-eligibility surfaced if applicable | Included | Client may poll/retry |

## 4. Never Exposed

Restated as an absolute: no error response, at any status code, ever includes a stack trace, a secret, a database credential, internal sensitive data (e.g., an internal service hostname), or an AI system prompt. This is the direct, unconditional realization of [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 7 ("API responses do not leak internal implementation detail") and [configuration-management.md](../08_Implementation_Foundation/configuration-management.md) Section 10, applied specifically to error paths — the path most likely to accidentally leak internal detail if this discipline is not explicit.

## 5. Correlation ID

Every error response includes the same correlation ID established at the originating request ([api-design-principles.md](../06_API_and_Integration/api-design-principles.md) Section 13) — this lets a user report "error X with correlation ID Y" and lets an operator find the full internal detail (safely, in logs only, never in the response itself) without needing the client to describe what happened.

## 6. Conflict (409) — Detail

Arises specifically from idempotency and state-transition checks (Section 21 of this milestone, folded into Section 6 of this document's sibling concurrency treatment in [background-job-architecture.md](background-job-architecture.md) Section 7): e.g., attempting to run an already-running Scenario, or reviewing an already-reviewed Recommendation with a conflicting decision.

## 7. Domain/Semantic Validation (422) — Detail

Distinguishes "the request is structurally well-formed but violates a business rule" from "the request is malformed" (400) — e.g., a Scenario's rainfall-change parameter is a valid number (passes 400-level Structural Validation) but exceeds a domain-plausible bound (fails 422-level Domain Validation, per [domain-layer-design.md](domain-layer-design.md)).

## 8. Milestone Traceability

| Error Category | First Needed |
|---|---|
| 400, 401, 403, 404, 500 | M1 |
| 422, 502/503, 504 | M2 (as external integrations and domain rules expand) |
| AI-specific failure disclosure | M3 |
| 409 (Scenario conflicts) | M5 |
| 409 (Recommendation review conflicts) | M6 |
| 429 | Whenever rate limiting is actually implemented — not tied to a specific product milestone |

## 9. Open Decisions

- Exact rate-limit thresholds triggering 429 — implementation-time tuning, per [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 15.
- Whether 422 is a distinct HTTP status the eventual framework naturally supports, or realized as a structured 400 with a semantic-validation flag — an implementation-time framework detail, not decided here.
