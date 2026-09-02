---
Document Name: Unit Testing
Document ID: ED-TSO-UNIT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Unit Testing

## 1. Purpose

This document defines the unit-testing strategy for DistrictMind's deterministic, I/O-free logic, elaborating [test-architecture.md](test-architecture.md) Section 3. No test code is written here.

## 2. Scope

| In Scope | Detail Document Reference |
|---|---|
| Domain logic | [domain-layer-design.md](../09_Backend_Implementation/domain-layer-design.md) |
| Application services (logic portion only, I/O mocked) | [service-layer-implementation.md](../09_Backend_Implementation/service-layer-implementation.md) |
| Validation | [request-response-validation.md](../09_Backend_Implementation/request-response-validation.md), [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md) |
| Transformations | [data-transformation-implementation.md](../12_Data_GIS_Implementation/data-transformation-implementation.md) |
| Scoring | [recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md) Section 6 |
| Deterministic computations | Spatial-adjacent pure functions (e.g., a distance formula's arithmetic, isolated from the actual spatial engine call) |
| State transitions | Scenario lifecycle states ([scenario-engine.md](../07_AI_GIS_and_Intelligence/scenario-engine.md) Section 6), Recommendation review states (FR-032) |
| Authorization logic (where appropriate) | The pure decision function (does role X have permission Y), isolated from the actual request pipeline |
| Error mapping | [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) |
| Utility logic | Shared helpers with no I/O dependency |

## 3. Test Isolation

Restated unchanged from [test-architecture.md](test-architecture.md) Section 3: a unit test has zero I/O — no database, no network call, no filesystem access, no live AI provider call. Any dependency is either a pure value or a mock/stub (Section 7, [test-architecture.md](test-architecture.md)).

## 4. Deterministic Tests

A unit test's result depends only on its inputs — restated consistent with the reproducibility discipline established across `13_AI_Intelligence_Implementation/`. A test that can produce different results on different runs given identical inputs is treated as a defect in the test itself, not an acceptable flake.

## 5. Boundary Cases

| Example | DistrictMind Context |
|---|---|
| Zero-value input | A coverage radius of exactly the smallest valid value |
| Maximum bound | A rainfall parameter at the upper edge of its sane bound ([request-response-validation.md](../09_Backend_Implementation/request-response-validation.md) Section 8) |
| Empty collection | A district with zero registered Health Facilities feeding a coverage-gap computation's input assembly |
| Single-element collection | Exactly one candidate action in a Recommendation scoring pass |

## 6. Invalid Inputs

Restated consistent with [request-response-validation.md](../09_Backend_Implementation/request-response-validation.md): a validation function correctly rejects a malformed identifier, an out-of-range parameter, or an incorrectly typed field, with the correct structured error shape ([error-handling-design.md](../09_Backend_Implementation/error-handling-design.md)).

## 7. Null/Missing Data

A transformation or scoring function correctly handles a missing optional field (e.g., a Health Facility record with no recorded capacity) per the missing-data discipline in [feature-engineering-implementation.md](../13_AI_Intelligence_Implementation/feature-engineering-implementation.md) Section 7 — disclosing the gap rather than silently substituting an unstated default.

## 8. Conflicting Data

A unit test verifies that the conflict-detection logic (not resolution — restated from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 7.1) correctly flags two disagreeing values for the same matched entity, in isolation from the full ingestion pipeline.

## 9. Stale Data

A unit test verifies that a freshness-calculation function correctly computes age-relative-to-now and correctly triggers a staleness disclosure per [data-quality-implementation.md](../12_Data_GIS_Implementation/data-quality-implementation.md), independent of any live clock dependency (a fixed/injected "now" is used for determinism, per Section 4).

## 10. State Transitions

| Example | Valid/Invalid Transition |
|---|---|
| Scenario | Created → Running → Completed is valid; Completed → Running directly is invalid ([scenario-engine.md](../07_AI_GIS_and_Intelligence/scenario-engine.md) Section 6) |
| Recommendation review | Generated → Reviewed → Accepted is valid; Generated → Accepted without a recorded human action is invalid (FR-032) |

## 11. DistrictMind-Specific Unit Test Examples

| Function Under Test | Verifies |
|---|---|
| Weighted-scoring computation (Section 6, [recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md)) | Given fixed candidate metrics and fixed weights, the documented formula structure produces the expected relative ordering — this tests the formula's arithmetic, not the (unresolved) weight calibration itself |
| Freshness calculation | A record timestamped N units before an injected "now" is correctly classified as stale per the applicable rule |
| Cross-source conflict detection | Two records for the same matched Village population figure with differing values are correctly flagged as conflicting |
| Scenario state-machine transition guard | An attempt to run an already-Completed Scenario is rejected |
| Grounding claim-to-Evidence binding check | A drafted response claim with no matching Evidence item is correctly rejected by the validation stage ([ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 9), tested here as a pure function independent of the live Agent |
| Authorization decision function | Given a role and a requested district scope, the pure permission check returns the correct allow/deny result |

## 12. Security

Unit tests for authorization logic (Section 2) verify the pure decision function only — they do not substitute for the full authorization-enforcement path tested at Integration/API level ([security-testing.md](security-testing.md)).

## 13. Observability

Unit test failures should be attributable to a specific function and input case — no observability infrastructure is implemented by this document.

## 14. Milestone Traceability

Unit testing applies from M1 onward for every layer as it is implemented; Recommendation-scoring unit tests first apply at M6.

## 15. Open Decisions

- Unit-testing framework — not selected, pending backend/frontend language and framework confirmation.
