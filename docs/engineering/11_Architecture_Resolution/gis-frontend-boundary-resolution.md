---
Document Name: GIS/Frontend Boundary Resolution
Document ID: ED-ARES-GIS-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# GIS/Frontend Boundary Resolution

## 1. Purpose

This document formalizes the GIS boundary between frontend rendering and backend authoritative computation, consolidating AD-FE-004 ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md)) and [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) Section 16. No contradiction was found in this boundary.

## 2. The Formalized Split

| Frontend | Backend |
|---|---|
| Renders maps | Authoritative spatial computation |
| Renders layers | Spatial joins |
| Handles presentation filters (layer visibility toggling) | Coverage analysis |
| Handles interaction (pan/zoom/hover/click) | Accessibility calculations |
| Highlights results | Bridge closure impact (via sandboxed Simulation) |
| Visualizes returned spatial analysis | Rainfall/disaster spatial analysis |

## 3. Worked Example Traces

### 3.1 10 km Healthcare Coverage

| Stage | Responsibility |
|---|---|
| Request | Frontend ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 8) |
| Response | Backend GIS Service's `coverage` operation ([gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md) Section 2.8) |

### 3.2 Bridge Closure

| Stage | Responsibility |
|---|---|
| Request | Frontend creates/runs a Scenario ([frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 9) |
| Response | Backend Simulation Service, sandboxed (AD-DE-004) |

### 3.3 Rainfall → Disaster → Transportation → Healthcare

| Stage | Responsibility |
|---|---|
| Request | Frontend (dashboard or AI query, [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) Section 10) |
| Response | Backend's full cross-domain chain ([backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md) Section 14) |

## 4. Request/Response Responsibility — Consolidated

```mermaid
flowchart LR
    FE[Frontend: Request] --> API[API]
    API --> GISSvc[Backend GIS Service: Compute]
    GISSvc --> Resp[Response: Result + Provenance]
    Resp --> FEV[Frontend: Visualize]
```

Every one of the three worked examples follows this identical shape — the frontend never varies from "request → visualize," and the backend never varies from "compute → respond with provenance."

## 5. No Contradiction Found

This boundary was found consistent across [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md), [backend-implementation-architecture.md](../09_Backend_Implementation/backend-implementation-architecture.md), [gis-service-design.md](../06_API_and_Integration/gis-service-design.md), and [gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md) — no divergence was found requiring resolution. This document formalizes the consistency, per this milestone's explicit requirement to do so.

## 6. Milestone Traceability

| Boundary Capability | First Needed |
|---|---|
| Basic rendering vs. containment computation | M1 |
| Coverage/accessibility split | M2 |
| Bridge closure (Simulation) split | M5 |
| Rainfall/disaster full-chain split | M2 (data), M4 (prediction) |

## 7. Open Decisions

None specific to this document — inherited from [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) and [gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md).
