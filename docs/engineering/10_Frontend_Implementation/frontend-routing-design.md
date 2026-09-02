---
Document Name: Frontend Routing Design
Document ID: ED-FEIMPL-ROUTE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend Routing Design

## 1. Purpose

This document defines frontend routing behavior. **It contains one identified, unresolved contradiction against prior documentation, reported explicitly per this milestone's instruction rather than silently corrected — see Section 3.**

## 2. The Phase-1 Flow

```mermaid
flowchart LR
    Login[Login] --> Overview[Telangana Overview]
    Overview --> Selection[District Selection]
    Selection --> Dashboard[District Dashboard]
```

This flow is asserted by this milestone's brief. It is **consistent in spirit** with [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 3's route table (a root map/navigation view, then a district detail view), but introduces naming and flow detail (an explicit "Telangana Overview" as a distinct step, a distinct "Login" gate before it) not previously spelled out in that document. This is treated as an elaboration, not a contradiction, since it does not conflict with anything [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) actually states — that document's route table already implies authentication gates the whole application (FR-004) and a root view precedes district detail.

## 3. Contradiction — District Route Path Convention

**This is a genuine, reported contradiction, not silently resolved.**

| Source | Convention | Basis |
|---|---|---|
| [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 3 (ED-M2 Part 1) | `/districts/:id` | Plural resource collection, identifier-based — consistent with [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4's identifier strategy ("a stable, assigned identifier... never a mutable natural key") and [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8 (plural resource collections) |
| This milestone's brief (ED-M3 Part 3) | `/district/:districtName` | Singular, name-based — explicitly requested by this milestone's instructions |

These two conventions conflict on **two dimensions**: singular vs. plural path segment, and identifier vs. name as the route parameter. The identifier-vs-name conflict is architecturally significant, not merely cosmetic: [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4 established that a District's identifier strategy uses a stable, assigned identifier specifically so the same district resolves consistently even across a boundary correction — a district *name* is a natural key that could theoretically collide (unlikely for Telangana's district set, but not architecturally guaranteed) or change, which is exactly the failure mode the stable-identifier decision was designed to avoid.

**This document does not silently pick a winner.** Per this milestone's explicit instruction, both conventions are recorded, and the conflict is escalated as **AD-FE-005** (Section 4) with a status of "Conflict Identified, Not Resolved," and again in [ED-M3-P3-VALIDATION.md](ED-M3-P3-VALIDATION.md) Section 14.

## 4. Architectural Decision — Conflict Recorded, Not Resolved

**AD-FE-005 — District Detail Route Path Convention: Conflict Between `/districts/:id` and `/district/:districtName`**
- **Context:** [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) established `/districts/:id`; this milestone's brief requests `/district/:districtName`.
- **Decision:** **No decision is made here.** This entry exists to record that a conflict was identified and deliberately left unresolved, per this milestone's explicit "do not silently correct previous documentation" instruction.
- **Alternatives considered:** Not applicable — no resolution was attempted.
- **Reasoning:** Resolving this would require a stakeholder or architecture-review judgment call (whether human-readable URLs are a genuine product requirement worth accepting the natural-key risk, or whether the stable-identifier discipline should hold even in the URL) that is outside this documentation-only milestone's authority to make unilaterally.
- **Trade-offs:** Leaving this open means [frontend-routing-design.md](frontend-routing-design.md) (this document) cannot yet specify a single, final route path for district detail — every subsequent section of this document uses the milestone-brief-requested `/district/:districtName` form as the **Proposed (per this milestone)** working convention, while flagging that it is not yet reconciled with ED-M2's `/districts/:id`.
- **Consequences:** A future documentation milestone (or an explicit stakeholder decision) must reconcile these two conventions before implementation begins on district routing — recorded as an open question in [ED-M3-P3-VALIDATION.md](ED-M3-P3-VALIDATION.md) Section 20.
- **Status:** Conflict Identified, Not Resolved.

## 5. Route Hierarchy (Using This Milestone's Requested Convention, Flagged Per Section 3–4)

| Route (Proposed, per this milestone) | Purpose | Public/Private |
|---|---|---|
| `/login` | Authentication | Public |
| `/` (Telangana Overview) | Statewide map, all districts | Private (requires authentication, per FR-004) |
| `/district/:districtName` | District Dashboard | Private |
| `/district/:districtName/healthcare` (illustrative) | Domain drill-down | Private |
| `/district/:districtName/assistant` | AI Assistant (M3 — Future) | Private |
| `/district/:districtName/predictions` | Predictions (M4 — Future) | Private |
| `/district/:districtName/scenarios` | Scenarios (M5 — Future) | Private |
| `/district/:districtName/recommendations` | Recommendations (M6 — Future) | Private |
| `/admin/*` | Administration | Private, Administrator role |

## 6. Public/Private Routes and Authentication Guards

Every route except `/login` requires authentication (FR-004) — restated unchanged from [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 15's Authentication UI feature module. A route guard redirects an unauthenticated user to `/login`; this guard is a **UX convenience, not a security boundary** ([frontend-implementation-architecture.md](frontend-implementation-architecture.md) Section 17) — the actual data access remains gated server-side regardless of what the guard does.

## 7. District Route Handling

Selecting a district on the Telangana Overview map (Section 2) navigates to its District Dashboard route. The navigation itself is a client-side route transition (no full page reload, per the SPA architecture, AD-FE-001); the underlying data for that district is then fetched via the API ([frontend-api-integration.md](frontend-api-integration.md)), not embedded in the route transition itself.

## 8. Invalid District Behavior

If the route parameter (whichever convention is eventually confirmed, per Section 4) does not resolve to a known district, the frontend renders a "not found" state ([frontend-loading-error-empty-states.md](frontend-loading-error-empty-states.md)) — never a blank page or a silent redirect that could confuse the user about what happened.

## 9. Deep Linking

Every route in Section 5 is directly linkable and bookmarkable — a user pasting a District Dashboard URL directly into a new browser tab reaches that same view (after authentication, if not already logged in), consistent with standard SPA deep-linking behavior.

## 10. Browser Refresh Behavior

A full browser refresh on any route re-initializes the SPA shell and re-resolves the current route from the URL — client-side state not persisted to storage (Section 8 of [frontend-implementation-architecture.md](frontend-implementation-architecture.md)) is lost on refresh, which is expected SPA behavior; server/API state is simply re-fetched.

## 11. Navigation State

The currently selected district (Section 8's "Domain display state" concept, [frontend-implementation-architecture.md](frontend-implementation-architecture.md)) is derived from the current route, not stored redundantly in a separate state store — this avoids the two ever disagreeing.

## 12. Route Transitions

Smooth, non-blocking transitions between routes — full animation detail in [frontend-animation-and-interaction.md](frontend-animation-and-interaction.md); this document establishes only that a transition never blocks the underlying async data-fetch it triggers (per [coding-standards.md](../08_Implementation_Foundation/coding-standards.md) Section 14.3's "animations must never block" rule).

## 13. Permission-Aware Navigation

Navigation options are shown/hidden based on the authenticated user's role (e.g., an Admin-only route is not shown in navigation to a non-Administrator) — a UX convenience per Section 6, never the actual enforcement mechanism.

## 14. Fallback Routes / Not-Found Behavior

An unmatched route renders a generic "page not found" view, distinct from the "invalid district" state (Section 8), which is district-specific — restated per [frontend-loading-error-empty-states.md](frontend-loading-error-empty-states.md)'s state taxonomy.

## 15. Milestone Traceability

| Routing Capability | First Needed |
|---|---|
| `/login`, Telangana Overview, District Dashboard | M1 |
| Domain drill-down routes | M2 |
| AI Assistant route | M3 |
| Predictions route | M4 |
| Scenarios route | M5 |
| Recommendations route | M6 |

## 16. Open Decisions

- **AD-FE-005's unresolved routing convention conflict (Section 3–4) — the single most important open item in this document.**
- Final frontend routing library — Under Evaluation, tied to the unresolved frontend framework choice.
