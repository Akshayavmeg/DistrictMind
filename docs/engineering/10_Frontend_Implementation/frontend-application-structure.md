---
Document Name: Frontend Application Structure
Document ID: ED-FEIMPL-STRUCT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend Application Structure

## 1. Purpose

This document defines the implementation-level conceptual structure of the frontend, elaborating [frontend-structure.md](../03_Project_Structure/frontend-structure.md) with the additional layers this milestone requires. It respects, and does not replace, the existing repository structure. No source file is created.

## 2. Structural Layers

| Layer | Responsibility | Maps to [frontend-structure.md](../03_Project_Structure/frontend-structure.md) |
|---|---|---|
| Application shell | Root layout, providers, entry point | `app/` |
| Route layer | Route definitions, guards | `app/` (routing config) + [frontend-routing-design.md](frontend-routing-design.md) |
| Pages/screens | Route-level views composing feature modules | `pages/` |
| Feature modules | Domain-scoped pages, components, hooks, services | `features/*` |
| Shared components | Generic, domain-agnostic UI | `components/` |
| Layout components | Structural chrome (header, shell regions) — a subset of shared components with a specific structural role | `components/` (a conceptual sub-category, not a new top-level folder) |
| Domain components | Feature-specific, composed from shared components | Within each `features/*` directory |
| GIS components | Map rendering, layer controls | `features/gis/` |
| AI components | Chat interface, evidence display | `features/ai-assistant/` |
| Charts/visualization components | Shared charting primitives | `charts/` |
| Utility modules | Generic helpers (formatting, debounce) | `utils/` |
| API client boundary | All HTTP communication | `services/` |
| State layer | Cross-cutting state (auth, GIS, AI conversation, notifications) | `state/` |
| Validation layer | Client-side input validation mirroring backend contracts | Within each feature's `services/` layer, per [frontend-api-integration.md](frontend-api-integration.md) Section 6 |
| Error handling | Error boundaries, error-state components | `components/` (shared error-state primitives) + per-feature error boundaries |
| Accessibility utilities | Focus management, ARIA helpers | `utils/` (a conceptual sub-category) — no new top-level folder invented |
| Testing organization | Test files/utilities | `tests/` (shared) + co-located per-feature tests, per [frontend-structure.md](../03_Project_Structure/frontend-structure.md) Section 3 |

**No arbitrary folder is invented without an architectural responsibility named above** — every entry in the "Maps to" column traces to an already-established directory in [frontend-structure.md](../03_Project_Structure/frontend-structure.md), or is explicitly noted as a conceptual sub-category rather than a new top-level folder.

## 3. Domain Module ≠ Database Table ≠ API Resource — Reinforced at the Frontend

Restated explicitly, extending [logical-data-model.md](../05_Database_Design/logical-data-model.md) Section 2 and [backend-module-design.md](../09_Backend_Implementation/backend-module-design.md) Section 2 to the frontend layer:

| Concept | Definition | Example |
|---|---|---|
| Frontend Feature Module | A code-organization unit owning one domain's UI | `features/healthcare/` |
| Database Table | A backend physical storage unit | Not visible to, or assumed by, the frontend at all |
| API Resource | The client-facing contract shape the feature module consumes | `/healthcare` (per [api-route-implementation.md](../09_Backend_Implementation/api-route-implementation.md)) |

A frontend feature module never assumes a 1:1 relationship with a database table (which it cannot see) or even with a single API resource — e.g., the `dashboard` feature module composes data from multiple API resources (`/analytics`, `/healthcare`, `/predictions`) into one view, per [frontend-dashboard-design.md](frontend-dashboard-design.md).

## 4. Directory Structure (Restated, Extended)

```text
frontend/
├── app/                       # Shell, routing, providers, entry point
├── pages/                     # Route-level views
├── features/
│   ├── district/               # M1 — district navigation, selection
│   ├── gis/                    # M1 — map rendering, spatial layers
│   ├── dashboard/               # M2 — Future — indicators, KPIs
│   ├── ai-assistant/            # M3 — Future — chat UI
│   ├── prediction/              # M4 — Future — forecasts
│   ├── simulation/              # M5 — Future — scenario UI
│   ├── recommendations/         # M6 — Future — recommendation review
│   └── admin/                    # M1 (users/roles) + M2 — Future (data source config)
├── components/                    # Primitive/shared UI, layout chrome, error/loading states
├── hooks/                          # Cross-cutting reusable hooks
├── services/                        # API client layer
├── state/                            # Cross-cutting state (auth, GIS, AI conversation, notifications)
├── types/                              # Frontend-only TypeScript types
├── utils/                                # Generic utilities, accessibility helpers
├── charts/                                # Shared charting primitives
├── assets/                                # Static assets
└── tests/                                  # Shared test utilities/setup
```

This is unchanged from [frontend-structure.md](../03_Project_Structure/frontend-structure.md) Section 3 — restated here for completeness, not re-decided.

## 5. Milestone Traceability

| Structural Layer | First Needed |
|---|---|
| Application shell, route layer, `district`/`gis` feature modules | M1 |
| `dashboard` feature module | M2 |
| `ai-assistant` feature module | M3 |
| `prediction` feature module | M4 |
| `simulation` feature module | M5 |
| `recommendations` feature module | M6 |

## 6. Open Decisions

None specific to this document beyond the still-open frontend framework choice, unchanged.
