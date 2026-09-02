---
Document Name: Frontend GIS Implementation
Document ID: ED-FEIMPL-GIS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend GIS Implementation

## 1. Purpose

This is a critical DistrictMind document. It defines how the frontend renders GIS information **without** taking ownership of authoritative GIS computation, elaborating [gis-architecture.md](../02_System_Architecture/gis-architecture.md) and [gis-service-design.md](../06_API_and_Integration/gis-service-design.md) with frontend-specific detail. No GIS or map code exists here.

## 2. Frontend GIS Rendering vs. Backend Authoritative GIS Computation

| The Frontend MAY | The Frontend Must NOT |
|---|---|
| Render already-served geometry | Become the source of truth for 10 km healthcare coverage calculations |
| Filter what is displayed (client-side layer visibility toggling) | Compute bridge closure impact itself |
| Highlight/select entities visually | Compute rainfall/disaster spatial calculations |
| Animate transitions between states | Perform authoritative spatial joins |
| Display layers the backend has provided | Compute accessibility calculations |
| Display returned spatial results (coverage sets, routes, affected areas) | Perform final analytical computations of any kind |

This is the direct restatement of [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) Section 16 (GIS Boundary), formalized here as **AD-FE-004**.

## 3. Architectural Decision

**AD-FE-004 — Frontend GIS Layer Is Render-Only; No Client-Side Authoritative Spatial Computation**
- **Context:** A client-side mapping library (whichever is eventually confirmed, per [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.4) is technically capable of performing simple spatial operations (e.g., point-in-polygon) in the browser — this capability must not be used for anything DistrictMind treats as authoritative.
- **Decision:** Every spatial computation a user sees (coverage gaps, accessibility, affected areas, routes) is computed server-side ([gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md)) and only rendered client-side. The frontend's own use of any mapping library's spatial capability is limited to non-authoritative, purely presentational purposes (e.g., determining which map tile is in view for rendering optimization).
- **Alternatives considered:** Allowing the frontend to compute simple cases (e.g., basic containment) client-side "for responsiveness" (rejected — per [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) Section 16's Consistency/Security/Reproducibility/Auditability reasoning, which applies identically regardless of how simple a specific computation seems).
- **Reasoning:** Directly required by this milestone's explicit boundary; consistent with every prior GIS-boundary decision across `02_System_Architecture/`, `06_API_and_Integration/`, `07_AI_GIS_and_Intelligence/`, and `09_Backend_Implementation/`.
- **Trade-offs:** Every spatial question requires a round-trip to the backend, even a conceptually "simple" one — accepted, since the alternative reintroduces exactly the consistency/security/reproducibility/auditability risks already rejected.
- **Consequences:** [frontend-component-design.md](frontend-component-design.md) Section 6's District Map/Map Container responsibility boundary is the direct component-level realization of this decision.
- **Status:** Proposed.

## 4. Telangana Overview Map

The overview map renders district boundaries statewide. **This milestone's brief asserts an exact requirement of 33 district boundaries.** Telangana's real-world administrative structure does, as a matter of public record, comprise 33 districts following its post-2016 reorganization — this is consistent with that fact, but it is noted here that **no prior ED-M1/ED-M2 document specified an exact district count** ([constraints.md](../01_Requirements/constraints.md) Geographic Constraints scopes M1 to "districts within the Indian state of Telangana" without a number, and [data-sources.md](../04_Data_Engineering/data-sources.md) still lists the authoritative boundary source as unidentified). This document therefore treats "33 districts" as a **Proposed (per this milestone's brief) real-world fact awaiting confirmation against whatever boundary source is eventually sourced**, not as a previously-established engineering decision — flagged accordingly in [ED-M3-P3-VALIDATION.md](ED-M3-P3-VALIDATION.md) Section 13.

## 5. District Interaction

| Interaction | Frontend Responsibility |
|---|---|
| District hover | Visual highlight only (Section 12, [frontend-animation-and-interaction.md](frontend-animation-and-interaction.md)) — no data fetch triggered by hover alone |
| District click | Triggers navigation to the District Dashboard route ([frontend-routing-design.md](frontend-routing-design.md)) |
| District selection (post-navigation) | Visually distinguishes the selected district from others on any statewide view still visible |
| District navigation | A route transition (Section 7, [frontend-routing-design.md](frontend-routing-design.md)), with a fly-in/zoom animation to the selected district (Section 17, [frontend-animation-and-interaction.md](frontend-animation-and-interaction.md)) |

## 6. District-Level Map

Once navigated into a district, the map renders that district's boundary at full detail plus its constituent mandal/village layer, per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 3 (drill-down layer).

## 7. Layer Inventory

| Layer | Data Source (Backend) | Frontend Role |
|---|---|---|
| Roads | Transportation Service ([backend-module-design.md](../09_Backend_Implementation/backend-module-design.md)) | Render line geometry, toggle visibility |
| Villages | Geography Service | Render polygon geometry at drill-down detail |
| Mandals | Geography Service | Render polygon geometry, intermediate detail level |
| Lakes/water bodies | Infrastructure Service | Render polygon geometry |
| Hospitals | Healthcare Service | Render point markers, optionally with coverage-gap styling already computed server-side |
| Schools | Infrastructure Service | Render point markers |
| Public offices | Infrastructure Service | Render point markers |
| Bus/transport routes | Transportation Service | Render line geometry, if this specific sub-domain is ever sourced (not currently a confirmed dataset, per [data-sources.md](../04_Data_Engineering/data-sources.md)) |
| Infrastructure layers (general) | Infrastructure Service | Composite of the above |
| Environmental layers | Weather Service | Render station points, optionally a rainfall choropleth if the backend provides one as a spatial-aggregation result ([gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md) Section 2.12) |
| Disaster layers | Disaster Service | Render affected-area geometry, explicitly labeled with its state category (Observed/Derived/Predicted/Scenario, per Section 23 of this milestone, [frontend-dashboard-design.md](frontend-dashboard-design.md) Section 11) |
| Healthcare accessibility layers | Healthcare Service, via GIS Service's `coverage`/`accessibility` operations | Render the already-computed coverage-gap or accessibility result, never recompute it |

Every layer's data originates server-side; the frontend's only responsibility is fetching, rendering, and toggling visibility.

## 8. Worked Example A — 10 km Healthcare Coverage

```mermaid
flowchart LR
    UA[User Action: request coverage view] --> FR[Frontend Request]
    FR --> BC[Backend Computation]
    BC --> Resp[Response]
    Resp --> MV[Map Visualization]
    MV --> EC[Evidence/Context Display]
```

| Stage | Detail |
|---|---|
| User action | Selects "Healthcare Coverage" layer/view for a district |
| Frontend request | Calls the Healthcare resource with a coverage-radius parameter ([frontend-api-integration.md](frontend-api-integration.md) Section 18) |
| Backend computation | GIS Service's `coverage` operation ([gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md) Section 2.8) — entirely server-side |
| Response | The coverage-gap village set, with provenance |
| Map visualization | Uncovered villages rendered with a distinct highlight style |
| Evidence/context display | A side panel or tooltip showing the underlying data's source/freshness ([frontend-dashboard-design.md](frontend-dashboard-design.md) Section 11) |

## 9. Worked Example B — Bridge Closure Impact

| Stage | Detail |
|---|---|
| User action | Selects a road segment and requests a "what if this closes" analysis |
| Frontend request | Creates a Scenario (`create_scenario`) then requests execution (`run_scenario`), per [frontend-api-integration.md](frontend-api-integration.md) Section 16 |
| Backend computation | Simulation Service, sandboxed Network Impact + Accessibility recomputation (AD-DE-004) |
| Response | Before/after accessibility deltas, explicitly labeled Scenario State |
| Map visualization | A before/after comparison view — e.g., a toggle or side-by-side rendering of baseline vs. scenario accessibility |
| Evidence/context display | The Scenario's parameters and baseline reference, visibly distinguishing this as a hypothetical, not a real event |

## 10. Worked Example C — Rainfall → Disaster → Transportation → Healthcare

| Stage | Detail |
|---|---|
| User action | Views the Disaster/Risk dashboard for a district, or asks the AI assistant the equivalent question |
| Frontend request | Calls the Disaster resource, and/or composes with Transportation/Healthcare resources per the cross-domain dashboard layout ([frontend-dashboard-design.md](frontend-dashboard-design.md)) |
| Backend computation | The full Weather → Disaster → Transportation → Healthcare chain ([backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) Section 14) |
| Response | Cross-domain impact result, fully evidenced, with each stage's state category explicit |
| Map visualization | Layered rendering: rainfall/risk overlay, affected roads highlighted, healthcare accessibility impact shown |
| Evidence/context display | A composed evidence panel citing every contributing domain's data |

## 11. Map Performance

| Concern | Frontend Strategy |
|---|---|
| Layer visibility | Only active/toggled-on layers are fetched and rendered; inactive layers are not requested |
| Lazy loading | Mandal/village-level detail is fetched only once a district is navigated into, per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15's level-of-detail strategy |
| Viewport-based loading | At statewide zoom, only district-level simplified geometry is requested; full-detail geometry is requested only for the current viewport/selected district |
| Rendering large datasets | Geometry simplification is performed server-side ([gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15) — the frontend never receives, and does not need to simplify, full-precision statewide geometry at low zoom |
| Interaction responsiveness | Pan/zoom event handling is debounced/throttled ([frontend-animation-and-interaction.md](frontend-animation-and-interaction.md)) so map interaction never blocks on a network request mid-gesture |
| Fallback when GIS data fails | An explicit layer-specific error state ([frontend-loading-error-empty-states.md](frontend-loading-error-empty-states.md)) — a failed layer does not blank the entire map, only the affected layer |

## 12. Milestone Traceability

| GIS Capability | First Needed |
|---|---|
| Telangana Overview, district boundaries, selection/hover/click/navigation | M1 |
| Roads, villages, mandals, water bodies, facility layers | M2 |
| AI-linked map answers (Worked Examples via the assistant) | M3 |
| Disaster/risk layer with Predicted state | M4 |
| Bridge closure / scenario comparison rendering | M5 |
| Recommendation-linked map markers | M6 |

## 13. Open Decisions

- Final mapping library (Leaflet/Mapbox GL remain Candidate, unchanged).
- Whether bus/transport route data is ever sourced (Section 7) — unchanged open item from [data-sources.md](../04_Data_Engineering/data-sources.md).
- Confirmation of the exact Telangana district count against an actual sourced boundary dataset (Section 4).
