---
Document Name: Frontend State Management
Document ID: ED-FEIMPL-STATE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend State Management

## 1. Purpose

This document defines a technology-neutral state architecture for all 11 state categories named in this milestone's brief, elaborating [frontend-implementation-architecture.md](frontend-implementation-architecture.md) Section 8 and AD-FE-002. **No state-management library is assumed** — React's own state-management ecosystem (Context, external libraries) remains entirely Under Evaluation, tied to the unresolved frontend framework.

## 2. The 11 State Categories

| # | Category | Owner | Source | Lifetime | Persistence | Update Mechanism | Invalidation | Synchronization | Error Handling |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Authentication/session state | App-root store | Login API response | Session duration | Session/local storage (mechanism Under Evaluation, per [authentication-implementation.md](../09_Backend_Implementation/authentication-implementation.md) Section 5) | On login/logout | On logout, on token expiry | N/A (single source per browser tab) | Failed refresh → forced logout, per Section 6 of [frontend-authentication-ui.md](frontend-authentication-ui.md) |
| 2 | Server/API state | Data-fetching/caching layer | API responses | Until invalidated or session ends | In-memory (not persisted across reloads by default) | Refetch on trigger (navigation, mutation, manual) | On related mutation, or TTL expiry | De-duplicated per identical in-flight request | Exposed as a distinct error state per query, per [frontend-loading-error-empty-states.md](frontend-loading-error-empty-states.md) |
| 3 | UI state | Component-local | User interaction | Component lifetime | None | Direct local update | N/A | N/A | N/A (no failure mode — it's pure presentation) |
| 4 | GIS/map state | Dedicated map-state store | User interaction (pan/zoom/select), route params | Session, or until navigation away from a map view | Optionally session storage for viewport recall (a per-viewer convenience, not authoritative) | Map library events | On district navigation change | Synchronized with the current route (Section 11, [frontend-routing-design.md](frontend-routing-design.md)) | A failed layer fetch shows a layer-specific error, not a whole-map failure |
| 5 | Filter state | Feature-local store (per dashboard/list view) | User interaction | Until view is left, or persisted per-viewer preference (Under Evaluation) | Optional, per-viewer only | Direct local update | On explicit reset | N/A | N/A |
| 6 | District selection state | Derived from the current route (Section 11, [frontend-routing-design.md](frontend-routing-design.md)) | Route parameter | Tied to route | None (derived, not stored) | Route navigation | Automatic (route change) | Always consistent with the URL by construction | N/A |
| 7 | AI conversation state | Dedicated AI-session store | User query + AI Response API calls | Session, or until explicitly cleared | Optionally session storage for conversation recall (Under Evaluation) | Append on new query/response | On explicit "new conversation" action | N/A (single conversation thread per session, unless multi-thread is later introduced) | A failed query shows an explicit error/cannot-answer message within the conversation thread, per [frontend-ai-assistant-ui.md](frontend-ai-assistant-ui.md) |
| 8 | Notification state | Cross-cutting store | Background job completion, system messages | Until dismissed or session ends | None by default | Push on event | On dismissal | N/A | A failed notification delivery is itself not user-visible (fails silently at the transport level, logged only) |
| 9 | Simulation/scenario state | Feature-local store (`simulation` feature module) | Scenario creation/run API calls | Until the Scenario's job completes or is navigated away from | None (re-fetchable via Scenario ID) | Job-status polling ([frontend-api-integration.md](frontend-api-integration.md) Section 16) | On job completion or explicit cancellation | Polling reconciles with backend job state | A failed Scenario run surfaces an explicit failure state, per [background-job-architecture.md](../09_Backend_Implementation/background-job-architecture.md) Section 4 |
| 10 | Prediction visualization state | Feature-local store (`prediction` feature module) | Prediction request/retrieval API calls | Until job completes or navigated away from | None | Job-status polling, same pattern as #9 | Same as #9 | Same as #9 | Explicit insufficient-data or failure state, per NFR-031 |
| 11 | Transient interaction state | Component-local | User interaction (hover, drag, focus) | Milliseconds to seconds | None | Direct local update | Automatic (interaction ends) | N/A | N/A |

## 3. Architectural Decision

**AD-FE-003 — Eleven State Categories, Each With a Single Named Owner, No Shared Generic Store**
- **Context:** Without an explicit per-category ownership model, frontend state tends to accumulate in one large, undifferentiated store (or, conversely, be duplicated across several ad hoc ones), both of which cause the "conflating server data with UI state" anti-pattern already rejected by AD-FE-002.
- **Decision:** Each of the 11 state categories in Section 2 has exactly one named owner (a specific store or "component-local"), with its own lifetime, persistence, and invalidation rules — no category's data is duplicated into another category's store.
- **Alternatives considered:** A single global store for all client state (rejected — this is precisely what AD-FE-002 already rejected, generalized here to all 11 categories, not just the original two); a store per feature with no cross-cutting categories at all (rejected — Authentication, Notification, and GIS/AI conversation state are genuinely cross-cutting and would be duplicated per-feature if not centralized).
- **Reasoning:** Directly required by this milestone's explicit request for owner/source/lifetime/persistence/update/invalidation/synchronization/error-handling per category; extends AD-FE-002's reasoning (Separation of Concerns, avoiding stale-data bugs) to the full state surface.
- **Trade-offs:** More distinct stores to reason about than one large store — accepted, since each store's scope is narrow and independently testable, consistent with the Testability principle.
- **Consequences:** [frontend-implementation-architecture.md](frontend-implementation-architecture.md) Section 8's eight-category summary is the architectural-level restatement of this document's full 11-category detail; any future new feature (e.g., a new domain module) must classify its state against one of these 11 categories or explicitly propose a 12th, not invent an ad hoc pattern.
- **Status:** Proposed.

## 4. No State-Management Library Assumed

Consistent with [technology-stack.md](../00_Engineering_Overview/technology-stack.md) and every prior milestone's discipline: this document describes a *pattern* (11 categories, each singly owned), not a specific library (e.g., a specific Context/external-store combination). Whichever frontend framework is eventually confirmed, its own idiomatic state-management approach is expected to realize this pattern, not replace it.

## 5. Milestone Traceability

| State Category | First Needed |
|---|---|
| Authentication/session, UI, GIS/map, District selection | M1 |
| Server/API, Filter, Notification | M2 |
| AI conversation | M3 |
| Prediction visualization | M4 |
| Simulation/scenario | M5 |
| (Recommendation state reuses the Server/API pattern, no new category needed) | M6 |
| Transient interaction | M1 (present from the start, applies everywhere) |

## 6. Open Decisions

- Final state-management library/pattern per category — Under Evaluation, tied to the unresolved frontend framework.
- Whether viewport recall (category 4) and conversation recall (category 7) are ever implemented as persisted, per-viewer conveniences — noted as Under Evaluation, not committed.
