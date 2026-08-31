---
Document Name: Frontend Structure
Document ID: ED-STRUCT-FE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend Structure

## 1. Purpose

This document defines the intended folder structure of the `frontend/` directory (per [repository-structure.md](repository-structure.md)), realizing the architecture in [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md). No implementation files are created by this document — it is a structural plan only.

## 2. Structural Approach

**AD-STRUCT-002 — Feature-Oriented Frontend Structure**
- **Decision:** Organize the frontend primarily by feature module (District, Dashboard, AI Assistant, Prediction, Simulation, Recommendations, Admin), not by technical layer (e.g., a single global `components/` folder for everything).
- **Context:** [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 4 already establishes feature modules aligned to backend Domain services as the organizing unit.
- **Alternatives considered:** Purely technical grouping (all components in one folder, all hooks in another, regardless of feature).
- **Evaluation criteria:** Maintainability as the number of features grows across M1–M6, discoverability, alignment with backend module boundaries.
- **Trade-offs:** Feature-oriented structure scales better as milestones add unrelated features (a change to Prediction should not require navigating a single giant `components/` folder shared with District/GIS code), at the cost of some structure needed for genuinely cross-feature primitives (Section 4 below).
- **Consequences:** Each feature module is self-contained; shared/generic code is deliberately isolated in its own top-level area rather than mixed into feature folders.
- **Status:** Proposed.

## 3. Directory Structure

```text
frontend/
├── app/                    # Application shell: routing, layout, providers, entry point
├── pages/                  # Route-level page components (compose feature modules into views)
├── features/                # Feature modules, one directory per domain
│   ├── district/            # M1 — district/mandal navigation, selection
│   ├── gis/                 # M1 — map rendering, spatial layers
│   ├── dashboard/           # M2 — Future — indicators, KPIs, comparisons, trends
│   ├── ai-assistant/        # M3 — Future — chat UI, grounded responses
│   ├── prediction/          # M4 — Future — forecasts, risk visualization
│   ├── simulation/          # M5 — Future — scenario input, projected-state comparison
│   ├── recommendations/     # M6 — Future — recommendation review UI
│   └── admin/                # M1 (users/roles) + M2 — Future (data source config)
├── components/               # Primitive/generic UI components (buttons, cards, modals, form controls)
├── hooks/                    # Cross-cutting reusable hooks (not feature-specific)
├── services/                  # API client layer (per feature, or a shared base client + per-feature extensions)
├── state/                     # Cross-cutting client state (auth, selected-district context, notifications)
├── types/                     # Shared frontend-only TypeScript types (feature-specific types live within their feature)
├── utils/                     # Generic utility functions (formatting, debounce/throttle helpers, etc.)
├── charts/                    # Shared charting primitives reused across dashboard/prediction/simulation features
├── assets/                    # Static assets (icons, images, fonts)
└── tests/                     # Frontend-scoped test utilities/setup (per-feature unit tests live inside each feature)
```

## 4. Boundary Rules

- **`features/*`** own their pages, feature-specific components, hooks, and API service calls. A feature module may depend on `components/`, `hooks/`, `state/`, `utils/`, `charts/`, and `types/`, but other feature modules must not import directly from one another's internals — cross-feature interaction (e.g., AI Assistant referencing the selected district) goes through shared `state/`, not direct imports between feature folders. This mirrors the backend's rule that modules interact only through declared interfaces ([backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 5).
- **`components/`** holds only primitive, domain-agnostic UI (per [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 5's component tiering) — no feature/business logic.
- **`charts/`** is factored out of `components/` specifically because charting is reused across three future feature modules (dashboard, prediction, simulation) and has enough domain-adjacent complexity (data formatting, accessibility per NFR-019) to warrant its own area, per [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 12.
- **`gis/`** is a feature module in its own right (not folded into `district/`) because it is consumed by `district/` (M1) but will also be consumed by `dashboard/` (indicator overlays, M2), `prediction/` (risk layer, M4), and `simulation/` (comparison layer, M5) — per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 5's layer independence requirement.
- **`services/`** centralizes all HTTP/API communication (per [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 7 — "no component calls fetch/HTTP directly").
- **`state/`** holds only cross-cutting state (Section 6 of frontend-architecture.md); feature-local state stays within its feature module.

## 5. Milestone Growth Pattern

New milestones add new directories under `features/` (already reflected above) rather than restructuring existing ones — `district/` and `gis/` (M1) are not expected to change shape when `dashboard/` (M2) or `ai-assistant/` (M3) are added, consistent with the Extensibility strategy.

## 6. Open Decisions

- Exact framework-specific conventions (e.g., a specific meta-framework's required `app/` or `pages/` naming/behavior) depend on the final frontend framework choice (Candidate: React, Next.js — [technology-stack.md](../00_Engineering_Overview/technology-stack.md)) and may require this structure to be adapted to that framework's routing conventions without changing its underlying feature-oriented reasoning.
- Whether `types/` should instead live entirely in `shared/` (repository-level, see [shared-structure.md](shared-structure.md)) for types that mirror backend API contracts, versus frontend-only UI types remaining here — addressed in [shared-structure.md](shared-structure.md) Section 3.
