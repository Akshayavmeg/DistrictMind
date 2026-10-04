---
Document Name: Frontend Stack
Document ID: DM-TB-03
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Frontend Stack

Written for: frontend engineers starting the first vertical slice.

## 1. Stack

| Concern | Selection | Status |
|---|---|---|
| Framework | React | SELECTED FOR DEVELOPMENT |
| Language | TypeScript | SELECTED FOR DEVELOPMENT |
| Build/dev | Vite | SELECTED FOR DEVELOPMENT |
| Styling | Tailwind CSS | SELECTED FOR DEVELOPMENT |
| Components | shadcn/ui | SELECTED FOR DEVELOPMENT |
| Animation | Framer Motion | SELECTED FOR DEVELOPMENT, conditional on D-3 |
| Routing | React Router | SELECTED FOR DEVELOPMENT |
| Map | Leaflet | SELECTED FOR DEVELOPMENT |
| Charts | Recharts | SELECTED FOR DEVELOPMENT |
| Server-state caching | Not selected | UNDER EVALUATION (AD-FE-002 requires separation; no library chosen) |
| Unit/component tests | Vitest | SELECTED FOR DEVELOPMENT |
| E2E tests | Playwright | SELECTED FOR DEVELOPMENT (BLOCKED until a browser is installed) |

All: PRODUCTION NOT CONFIRMED.

## 2. Architecture Flow

React → routing → page components → feature components → state management → API client → GIS visualization (Leaflet) → charts (Recharts) → AI assistant UI (later phase)

- **Routing:** React Router, implementing the canonical `/districts/:id` route (AD-RES-001).
- **Pages** compose **feature components** organized by feature (AD-STRUCT-002).
- **API client:** a single typed service module in `src/services/`. It is the only place that calls the backend, and it returns typed results and errors.
- **GIS visualization:** Leaflet renders polygons supplied by the backend. It performs no authoritative spatial calculation (AD-FE-004).

## 3. State Management

Local component state first. The stack does **not** include Redux or any shared global store. This follows AD-FE-003 (no shared generic store) and the baseline rule: introduce a shared store only after a demonstrated problem, through a controlled decision recorded in this folder.

Server-state caching (AD-FE-002) is UNDER EVALUATION. Until it is decided, the first slice fetches through the API client and holds results in component state.

## 4. Routes

| Route | Status |
|---|---|
| `/` | First slice: Telangana overview |
| `/login` | First slice: development-only sign-in stub (see D-8 in [09](09-security-and-observability-stack.md)) |
| `/districts` | First slice: 33-district list |
| `/districts/:id` | First slice: district dashboard (canonical, AD-RES-001) |
| `/district/:districtName` | Optional future alias only; **not** canonical; not implemented in the first slice |

Analytical pages are added only when corresponding backend capability exists.

## 5. Telangana Map Requirements

- Overview of Telangana with 33 district polygons.
- Hover interaction (style change only; no fetch, per [frontend-animation-and-interaction.md](../engineering/10_Frontend_Implementation/frontend-animation-and-interaction.md)).
- Selected-district state held in the route and a local component.
- Click navigation to `/districts/:id`.
- Responsive layout.

**The map does not calculate.** Frontend displays; backend computes; PostGIS stores and computes authoritatively.

**Geometry source:** no district geometry is hardcoded. The first slice uses the strongest candidate only after the licensing check in [07-data-engineering-stack.md](07-data-engineering-stack.md). Until then, data is development data, labeled as such (D-9).

## 6. UI Design Baseline

Dark, futuristic, command-center feel; glassmorphism used selectively; restrained neon/glow; Inter typography; generous whitespace; the Telangana map as the main visual element; smooth district hover and selection; responsive layout.

**Provenance note:** this visual direction is recorded as a Proposed Design Direction under AD-RES-002, not a source-derived requirement. The brief's visual specifics are not in the original source documents ([frontend-animation-and-interaction.md](../engineering/10_Frontend_Implementation/frontend-animation-and-interaction.md) Section 2).

**Readability wins.** Any effect that lowers text contrast is removed (frontend-animation-and-interaction.md Section 6).

## 7. Animation Rules

Performance outranks visual effect. No animation may cause frame drops, input lag, map freezing, long main-thread blocking, or layout thrashing. Animations are:

- GPU-friendly (transform and opacity only on the rendering layer);
- interruptible (the next user action is honored immediately);
- short;
- purposeful;
- disabled under `prefers-reduced-motion`.

**Framer Motion (D-3):** AD-FE-006 (Proposed) deliberately states that animation principles, not a named library, govern the motion system. This baseline selects Framer Motion for development anyway. That is a tension, not a silent override: AD-FE-006 is unchanged, its principles still bind every use, and the selection stands only if the human reviewer accepts it. If it is rejected, CSS transitions are the fallback.

## 8. Performance

Lazy loading and route-level code splitting; avoid unnecessary re-renders; memoize only where profiling justifies it; render only the map layers needed; use appropriate geometry simplification; debounce expensive interactions; asynchronous API calls; skeleton and loading states; error boundaries; graceful degradation.

**Measure before optimizing.** No numeric performance target is invented here. NFR-035 remains the qualitative requirement.

Scale context (observed in ED-M6 Part 3, not a benchmark): each validated district polygon has 624 to 6,076 points. Thirty-three districts therefore total between about 20,600 and 200,500 points, by arithmetic from those per-district figures. Leaflet has not been tested at this size (see [13](13-technology-risks-and-contingencies.md)).

## 9. Accessibility

Keyboard navigation and visible focus are required; focus indicators are never suppressed by animation. Requirement traceability for accessibility remains a named gap (RG-SEC-009).

## 10. Error and Loading States

Every API-driven view has a loading state, an error state, and an empty state. Error boundaries wrap feature areas. Error messages are sanitized (see [09](09-security-and-observability-stack.md)).

## 11. Not Yet Evaluated

Browser rendering, animation smoothness, and Leaflet large-geometry performance are all BLOCKED in this environment (no browser). They are POC REQUIRED before depending on them.

## 12. Open Decisions

Server-state library; Framer Motion acceptance (D-3); whether shadcn/ui's copied-component model is accepted for governance (D-7).
