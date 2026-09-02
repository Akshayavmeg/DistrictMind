---
Document Name: End-to-End Testing
Document ID: ED-TSO-E2E-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# End-to-End Testing

## 1. Purpose

This document defines end-to-end testing across the full DistrictMind system, elaborating [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Gate 10. No exact UI selector or test code is created here — journeys are conceptual.

## 2. Scope

End-to-end tests exercise the complete path: authentication → district selection → map interaction → dashboard loading → API calls → GIS computation → AI assistant → evidence → prediction → simulation → recommendation → error/loading states → provenance display, restated unchanged from the full architectural chain established across `02_System_Architecture/` through `13_AI_Intelligence_Implementation/`.

## 3. Journey 1 — Login → Telangana Overview → District Selection → District Dashboard

| Step | Verifies |
|---|---|
| Login | Authentication succeeds; session established |
| Telangana overview | The statewide map renders with correct district boundaries (pending real boundary data, Section 15) |
| District selection | Selecting a district (e.g., the Warangal pilot case study) correctly navigates via the resolved routing convention (AD-RES-001, `/districts/:id`) |
| District dashboard | Dashboard loads with correct indicator data (FR-016), correct loading state during fetch, and correct error state if data is unavailable |

## 4. Journey 2 — 10 km Healthcare Coverage Query

| Step | Verifies |
|---|---|
| User submits the coverage question (via UI control or natural-language query) | Request correctly routed |
| GIS computation | `coverage_analysis` executes server-side |
| Result rendering | Uncovered villages highlighted on the map; evidence panel displays source/freshness — restated unchanged from [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 2 |
| Provenance display | The frontend correctly surfaces the Evidence/provenance fields already attached by the API, without independently deriving them |

## 5. Journey 3 — Bridge Closure Scenario

| Step | Verifies |
|---|---|
| Scenario creation UI | User can specify the target Road Segment (FR-029) |
| Scenario execution | `run_scenario` executes in the sandbox; loading state reflects the (potentially async) execution |
| Before/after comparison | The frontend correctly renders the comparison with explicit hypothetical framing |
| Production data unaffected | A subsequent, unrelated request confirms the production Road Segment table is unchanged (AD-DE-004) |

## 6. Journey 4 — Heavy Rainfall Cross-Domain Analysis

| Step | Verifies |
|---|---|
| Query submission | The rainfall cross-domain question is accepted |
| Multi-step agentic execution | The full Weather → Disaster → Transportation → Healthcare chain executes (restated from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 20) |
| Layered visualization | The frontend renders the layered map (rainfall/risk overlay, affected roads, healthcare impact) restated from [frontend-dashboard-design.md](../10_Frontend_Implementation/frontend-dashboard-design.md) Section 12 |
| Composed evidence panel | All four domains' Evidence is correctly displayed together with intact individual provenance |

## 7. Journey 5 — Prediction Workflow

| Step | Verifies |
|---|---|
| Request a forecast (FR-027) | Request correctly routes to `request_prediction` |
| Loading/async state | If the prediction runs asynchronously, the UI shows a non-blocking loading indication ([performance-and-responsiveness-testing.md](performance-and-responsiveness-testing.md)) |
| Result display | Forecast value, horizon, and (where produced by the model) uncertainty indicator are correctly displayed with provenance |
| Healthcare Demand case | If a Healthcare Demand forecast is ever requested, the journey correctly surfaces its UNRESOLVED status ([prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 14) rather than silently returning a fabricated result |

## 8. Journey 6 — Simulation/Recommendation Workflow

| Step | Verifies |
|---|---|
| Scenario + Recommendation chaining | A Scenario Result correctly feeds a subsequent Recommendation request (FR-031) |
| Scoring breakdown display | The Recommendation's scoring rationale is displayed in an inspectable form (AD-AI-005) |
| Human review gate | The UI enforces that a Recommendation cannot transition to "accepted" without an explicit human action (FR-032) |
| Audit | The review action is correctly audit-logged (FR-037) |

## 9. Error States

Every journey above is also tested under induced failure (API error, GIS failure, AI provider unavailable) to verify the frontend displays the correct, honest error state rather than a misleading default — restated unchanged from [frontend-loading-error-empty-states.md](../10_Frontend_Implementation/frontend-loading-error-empty-states.md) and [incident-and-failure-management.md](incident-and-failure-management.md).

## 10. Loading States

Every journey verifies loading states are shown for any operation exceeding an instantaneous response, consistent with the UI Responsiveness Contract ([frontend-performance-and-responsiveness.md](../10_Frontend_Implementation/frontend-performance-and-responsiveness.md)) — no numeric loading-state trigger threshold is invented.

## 11. Provenance

Every journey that surfaces AI, Prediction, Simulation, or Recommendation output verifies the displayed provenance/evidence/confidence information matches exactly what the backend attached — the frontend never independently invents or omits this information, restated unchanged from [ai-frontend-boundary-resolution.md](../11_Architecture_Resolution/ai-frontend-boundary-resolution.md).

## 12. Security

Every journey implicitly verifies the district-scope/role-authorization boundary holds at the UI level as well as the API level (a user should never see a UI affordance for data outside their scope) — restated unchanged from [security-testing.md](security-testing.md).

## 13. Observability

E2E test runs should be traceable via the same correlation-ID mechanism used in production, allowing a failed journey to be diagnosed against the exact backend trace it produced.

## 14. Milestone Traceability

| Journey | First Fully Testable |
|---|---|
| Journey 1 | M1 |
| Journey 2 | M2 |
| Journey 3 | M5 |
| Journey 4 | M2 (data), M4 (prediction), M5 (scenario), M6 (full) |
| Journey 5 | M4 |
| Journey 6 | M6 |

## 15. Open Decisions

- E2E testing framework/tooling — not selected, pending frontend framework confirmation.
- Journey 1's district boundary rendering depends on the same unresolved boundary-dataset blocker restated from [gis-and-spatial-testing.md](gis-and-spatial-testing.md) Section 22.
