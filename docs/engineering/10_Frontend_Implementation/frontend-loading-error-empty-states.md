---
Document Name: Frontend Loading, Error, and Empty States
Document ID: ED-FEIMPL-STATES-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend Loading, Error, and Empty States

## 1. Purpose

This document defines a comprehensive state taxonomy for every loading/error/empty scenario DistrictMind's maps, APIs, analytics, AI, and long-running computations can produce. **A misleading "no data" message is never shown when the actual problem is a failed request** — this is the central discipline governing every state below.

## 2. The Core Distinction

| Category | Meaning | Never Confused With |
|---|---|---|
| Loading | A request is in flight | Empty (no data exists) or Error (the request failed) |
| Empty / No Data | The request succeeded, and the answer is genuinely "there is nothing here" | Error (a failed request that merely *looks* like nothing came back) |
| Error | The request failed, for a classified reason ([error-handling-design.md](../09_Backend_Implementation/error-handling-design.md)) | Empty — an error is never silently rendered as if it were a confirmed empty result |

Every state below is classified against this three-way distinction, never collapsed into a single generic "nothing to show" treatment.

## 3. State Inventory

| State | Category | Detail | Recovery Action |
|---|---|---|---|
| Initial application loading | Loading | App shell + session check, before anything else renders ([frontend-authentication-ui.md](frontend-authentication-ui.md) Section 9) | None needed (resolves automatically) |
| Authentication loading | Loading | Login submission in flight | None needed |
| Dashboard loading | Loading | Skeleton cards matching the eventual KPI/chart shapes ([frontend-dashboard-design.md](frontend-dashboard-design.md)) | None needed |
| Map loading | Loading | Skeleton/placeholder map region while boundary geometry loads | None needed |
| GIS layer loading | Loading | Per-layer loading indicator, independent of the base map ([frontend-gis-implementation.md](frontend-gis-implementation.md) Section 11) | None needed |
| API request loading | Loading | Standard skeleton/spinner per the request's shape | None needed |
| AI response loading | Loading | "Thinking" state ([frontend-ai-assistant-ui.md](frontend-ai-assistant-ui.md) Section 6) | User may cancel (Section 17 of that document) |
| Prediction loading | Loading | Job-status-driven progress ([background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md)) | User may cancel where supported |
| Simulation loading | Loading | Same pattern | Same |
| Notification loading | Loading | Brief, low-visibility loading for the notification list | None needed |
| Background job status | Loading (with sub-states) | Queued/Running/Progress, per [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) Section 4 | User may cancel |
| Partial failure | Error (partial) | Some data loaded, some did not — the successfully-loaded portion is shown, the failed portion shows its own inline error, per Section 10 of [agent-execution-architecture.md](../07_AI_GIS_and_Intelligence/agent-execution-architecture.md)'s partial-results discipline, generalized to non-AI requests | Retry the failed portion specifically |
| Complete failure | Error | Nothing could be loaded | Retry the whole request |
| Timeout | Error | Classified per [error-handling-design.md](../09_Backend_Implementation/error-handling-design.md) (504) | Retry, or continue waiting if the operation is known-async |
| Offline/unreachable backend | Error | Detected via network failure, distinct from a classified HTTP error | Retry when connectivity returns; the UI may detect reconnection and offer an automatic retry |
| Unauthorized | Error | 401, per [frontend-authentication-ui.md](frontend-authentication-ui.md) Section 7 | Log in |
| Forbidden | Error | 403, per [frontend-authentication-ui.md](frontend-authentication-ui.md) Section 8 | None (by design) — contact an administrator if access is believed incorrect |
| Validation failure | Error | 400/422, per [frontend-api-integration.md](frontend-api-integration.md) Section 7 | Correct the input and resubmit |
| Not found | Error | 404 — the requested entity does not exist | Navigate elsewhere; distinct from "no data" (Section 4) |
| No data | Empty | The request succeeded; the entity exists but has no data for this query (e.g., no weather observations in a selected date range) | Adjust the query (e.g., a different date range) — the UI explicitly states this is not a failure |
| Insufficient data | Empty (domain-specific) | A Prediction/Analytics request that cannot produce a result due to inadequate historical depth (NFR-031) | None available yet — informational, not actionable by the user |
| Stale data | Success (with disclosure) | Data loaded successfully but is older than freshness expectations ([evidence-provenance-flow.md](../06_API_and_Integration/evidence-provenance-flow.md)) | The data is still shown, with its age disclosed — not an error state at all, a disclosure overlay on a success state |
| Computation unavailable | Error (domain-specific) | A GIS/Prediction/Simulation computation could not complete (distinct from a request simply failing to reach the server) | Retry later; if persistent, this is reported as a system issue, not a user-correctable one |

## 4. Avoiding the Misleading "No Data" Trap

**This is the section's central discipline, restated explicitly.** A failed request (network error, 500, timeout) must never be rendered using the same "no data" empty-state component as a genuinely empty, successful result — doing so would tell the user "there is nothing here" when the truth is "we don't know, because the request failed." Every "no data" UI treatment in this document is reachable **only** from a confirmed-successful response with zero results; every failure path renders one of the Error-category states in Section 3 instead.

## 5. Recovery Actions — Summary

| Recovery Pattern | Applies To |
|---|---|
| Automatic (resolves without user action) | Initial loading, authentication loading |
| Retry (user-triggered) | Complete failure, timeout, offline, partial failure (scoped to the failed portion) |
| Correct and resubmit | Validation failure |
| Navigate elsewhere | Not found |
| Adjust query parameters | No data |
| Log in | Unauthorized |
| No action available | Forbidden, insufficient data |
| Cancel | AI response loading, Prediction/Simulation loading |

## 6. Milestone Traceability

| State Capability | First Needed |
|---|---|
| Initial/authentication/dashboard/map loading, complete failure, timeout, offline, unauthorized, forbidden, validation, not-found, no-data | M1 |
| GIS layer loading, partial failure | M2 |
| AI response loading, AI-specific error states | M3 |
| Prediction loading, insufficient data | M4 |
| Simulation loading, background job status | M5 |
| Notification loading (full cross-milestone use) | M1 (present from the start), extended as new job types are added |

## 7. Open Decisions

- Exact visual treatment per state (Section 3) — a future UX/visual-design task, not fabricated here per this milestone's instruction against inventing exact visual specifics.
- Automatic-retry-on-reconnect behavior for the offline state (Section 3) — Under Evaluation.
