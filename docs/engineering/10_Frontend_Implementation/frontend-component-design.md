---
Document Name: Frontend Component Design
Document ID: ED-FEIMPL-COMP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Frontend Component Design

## 1. Purpose

This document defines component responsibilities and composition principles, elaborating [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 5's component tiering with implementation-blueprint detail. No component code exists here.

## 2. Component Inventory

| Component (Conceptual) | Tier | Responsibility |
|---|---|---|
| Application Shell | Layout | Root layout, persistent chrome |
| Navigation | Layout | Primary navigation, permission-aware (Section 13, [frontend-routing-design.md](frontend-routing-design.md)) |
| Header | Layout | Branding, user identity, notification entry point |
| Sidebar (where applicable) | Layout | Secondary navigation/filters, if the eventual layout calls for one — not assumed mandatory |
| Map Container | Domain (GIS) | Hosts the map rendering surface, manages viewport state |
| District Map | Domain (GIS) | Telangana Overview rendering ([frontend-gis-implementation.md](frontend-gis-implementation.md)) |
| District Selection | Domain (GIS) | Click/hover interaction on the map, triggers navigation |
| KPI Cards | Domain (Dashboard) | Single-indicator display, per [frontend-dashboard-design.md](frontend-dashboard-design.md) |
| Charts | Shared (Charts) | Trend/comparison visualization |
| Tables | Shared | Paginated, sortable, filterable list display |
| Filters | Shared | Domain/date/type filter controls |
| Notification UI | Shared | Cross-cutting notification display ([frontend-implementation-architecture.md](frontend-implementation-architecture.md) Section 8) |
| AI Assistant | Domain (AI) | Chat interface ([frontend-ai-assistant-ui.md](frontend-ai-assistant-ui.md)) |
| Modal/Dialog | Primitive | Focused, blocking interaction pattern |
| Drawer | Primitive | Side-panel, non-blocking interaction pattern |
| Tooltip | Primitive | Contextual hint |
| Loading Skeleton | Primitive | Content-shaped loading placeholder ([frontend-loading-error-empty-states.md](frontend-loading-error-empty-states.md)) |
| Error State | Primitive | Consistent error display |
| Empty State | Primitive | Consistent "no data" display, distinguished from error state |
| Buttons/Forms/Inputs | Primitive | Generic, reusable, no domain knowledge |
| Accessibility Primitives | Primitive | Focus rings, skip links, live-region announcers ([frontend-accessibility-and-testing.md](frontend-accessibility-and-testing.md)) |

## 3. Component Tiering — Restated and Extended

| Tier | Definition | Example |
|---|---|---|
| Primitive | Generic, domain-agnostic, reusable everywhere | Button, Modal, Tooltip |
| Domain | Feature-specific, composed from primitives | District Map, KPI Card, AI Assistant |
| Layout | Structural chrome, composed from primitives and, occasionally, domain components (e.g., Header may embed a domain-aware user-role badge) | Application Shell, Navigation |
| Page | Composes domain components into a routed view | The District Dashboard page |

This is unchanged from [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 5, with Layout added as an explicit fourth tier for this milestone's blueprint-level clarity.

## 4. Composition Principles

| Principle | Application |
|---|---|
| Primitives compose into domain components, never the reverse | A KPI Card is built from a Card primitive + a Chart primitive; a Card primitive never imports a KPI Card |
| Pages compose domain components, never contain domain logic themselves | A page component's own code is limited to layout arrangement and passing already-fetched data to its children |
| One component, one responsibility | A District Map component renders geometry; it does not also compute coverage gaps (that is a backend responsibility, consumed as already-computed data) |
| Composition over configuration explosion | A component with many conditional variants is split into smaller composed pieces rather than accumulating an ever-growing prop list |

## 5. Preventing Named Anti-Patterns

| Anti-Pattern | Prevention |
|---|---|
| Giant monolithic components | Enforced by Section 4's "one component, one responsibility"; a page component that grows beyond composing 5–10 domain components is a signal to extract a new domain component |
| Excessive prop drilling | Cross-cutting state (auth, GIS, AI conversation, notifications — [frontend-implementation-architecture.md](frontend-implementation-architecture.md) Section 8) is read from its dedicated store, not threaded through every intermediate component's props |
| Business logic embedded in visual components | Business logic lives in the Domain Layer ([domain-layer-design.md](../09_Backend_Implementation/domain-layer-design.md)), which is backend-only — a frontend component never re-implements a rule like "what counts as a coverage gap"; it only renders whatever the API already computed |
| Direct API calls from arbitrary UI components | All API calls go through the API client boundary ([frontend-api-integration.md](frontend-api-integration.md) Section 2) — a component never calls `fetch`/HTTP directly, restated unchanged from [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 7 |
| Direct database assumptions in components | No component ever assumes a specific database schema shape — it consumes only the API's documented response shape ([api-contracts.md](../06_API_and_Integration/api-contracts.md)), which is explicitly decoupled from physical schema (per [database-design.md](../05_Database_Design/database-design.md) Section 4's Domain-layer independence, extended to the frontend) |

## 6. Component Responsibility Boundaries — GIS-Specific

The District Map and Map Container components render geometry and highlight/select entities; they never compute containment, coverage, or accessibility themselves — restated from [frontend-gis-implementation.md](frontend-gis-implementation.md) Section 2, cross-referenced here because it directly shapes what these components' responsibilities can and cannot include.

## 7. Component Responsibility Boundaries — AI-Specific

The AI Assistant component renders conversation history and evidence; it never decides whether a claim is grounded (that is the backend's Grounding Validation stage, [ai-safety-and-grounding.md](../07_AI_GIS_and_Intelligence/ai-safety-and-grounding.md)) — it only displays whatever grounded/ungrounded status the API response already carries.

## 8. Milestone Traceability

| Component Group | First Needed |
|---|---|
| Application Shell, Navigation, Header, Map Container, District Map, District Selection | M1 |
| KPI Cards, Charts, Tables, Filters | M2 |
| AI Assistant | M3 |
| Prediction-specific chart variants | M4 |
| Scenario controls | M5 |
| Recommendation panels | M6 |

## 9. Open Decisions

- Final component library (if any is adopted for primitives) — Under Evaluation, tied to the unresolved frontend framework.
