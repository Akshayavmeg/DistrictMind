---
Document Name: Routing Resolution
Document ID: ED-ARES-ROUTE-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Routing Resolution

## 1. Purpose

This document investigates and resolves Contradiction A: `/districts/:id` vs. `/district/:districtName`, per the methodology in [architecture-resolution-overview.md](architecture-resolution-overview.md) Section 5. **This document does not modify any prior document** — it records a resolution as new content in this milestone.

## 2. Evidence Trace

| Source | Milestone | Convention | Independent Rationale Given |
|---|---|---|---|
| [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 3 | ED-M2 Part 1 | `/districts/:id` | District-first navigation model; route table spans M1–M6 |
| [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 8 | ED-M2 Part 1 | Plural resource collections, kebab-case | General REST convention, not district-specific, applied consistently across every resource in the program |
| [entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4 | ED-M2 Part 2B-1 | Identifier-based addressing ("a stable, assigned identifier... never a mutable natural key") | A database-design rationale, independent of URL format specifically: a district's identifier must resolve consistently even across a boundary correction, which a name cannot guarantee |
| [api-resource-model.md](../06_API_and_Integration/api-resource-model.md) Section 2 | ED-M2 Part 2B-2A | `/districts/{id}` | Cross-references [entity-catalog.md](../05_Database_Design/entity-catalog.md)'s identifier strategy directly |
| [api-contracts.md](../06_API_and_Integration/api-contracts.md) Operation 1 | ED-M2 Part 2B-2A | Input: "District identifier" | Consistent with the above |
| [api-route-implementation.md](../09_Backend_Implementation/api-route-implementation.md) Section 3 | ED-M3 Part 2 | `/districts/{id}` | Restated unchanged from [api-contracts.md](../06_API_and_Integration/api-contracts.md), no new rationale needed since it is a direct implementation of an already-settled contract |
| ED-M3 Part 3 milestone brief (this program's own prompt text) | ED-M3 Part 3 | `/district/:districtName` | No supporting rationale given; not cross-referenced against any other document; introduced as a bare instruction |
| Original DistrictMind Abstract | Pre-program | Not specified | The Abstract does not address frontend routing at all |
| Original DistrictMind Architecture Blueprint | Pre-program | Not specified | The Blueprint's frontend section (§5.1, §11) names React/Leaflet/GeoJSON but specifies no route paths |

## 3. Authority Determination

Applying [architecture-resolution-overview.md](architecture-resolution-overview.md) Section 4's hierarchy: the identifier-based, plural convention is corroborated by **five independently-authored documents across three separate documentation milestones** (ED-M2 Part 1, ED-M2 Part 2B-1, ED-M2 Part 2B-2A, ED-M3 Part 2), one of which ([entity-catalog.md](../05_Database_Design/entity-catalog.md)) provides a substantive architectural rationale (avoiding a mutable natural key) that is independent of URL design specifically and would apply regardless of routing conventions in general. The name-based convention is supported by **zero** prior documents, has no independent rationale recorded anywhere, and is absent from both original source documents.

**This is a case where evidence clearly favors one side** — the routing convention is resolved, not left open, per Section 5 of [architecture-resolution-overview.md](architecture-resolution-overview.md)'s "is one side clearly better evidenced?" branch.

## 4. Decision

**AD-RES-001 — District Detail Route Uses Identifier-Based Addressing (`/districts/:id`); Human-Readable Name May Be Supported as a Non-Canonical Alias**
- **Context:** Section 2's evidence trace and Section 3's authority determination.
- **Decision:** The canonical district detail route is `/districts/:id`, matching [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md), [api-resource-model.md](../06_API_and_Integration/api-resource-model.md), [api-contracts.md](../06_API_and_Integration/api-contracts.md), and [api-route-implementation.md](../09_Backend_Implementation/api-route-implementation.md). The human-readable-URL intent behind `/district/:districtName` is not discarded outright: a future implementation **may** additionally accept a district name in the URL and resolve/redirect it server-side to the canonical identifier-based route, as a **Proposed**, non-canonical convenience — this is a synthesis, not a compromise reached by splitting the difference arbitrarily; it satisfies the UX intent behind the brief's request without weakening the stable-identifier architecture the evidence supports.
- **Alternatives considered:** Adopting `/district/:districtName` as canonical (rejected — contradicted by five corroborating documents and the entity-catalog.md identifier-strategy rationale); leaving the conflict unresolved (rejected — Section 3 established the evidence is not actually insufficient here, so leaving it open would understate what the review found).
- **Reasoning:** Directly follows the resolution methodology's "clearly better evidenced" branch; preserves Reproducibility and Data Integrity (a stable identifier does not change if a district's name is later corrected/renamed).
- **Trade-offs:** URLs are less immediately human-readable in their canonical form than a name-based path would be — mitigated by the optional alias mechanism (Proposed) and by every UI surface displaying the district's name prominently regardless of what the URL itself contains.
- **Consequences:** [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md)'s AD-FE-005 status ("Conflict Identified, Not Resolved") should be updated to reference this resolution in a future revision of that document — not performed here, per the instruction against modifying prior documentation; recorded as a recommendation in [implementation-readiness.md](implementation-readiness.md).
- **Status:** Proposed (the canonical convention itself is evidence-resolved; "Proposed" reflects that no implementation yet exists, consistent with this program's status discipline — not that the resolution is in doubt).

## 5. Canonical District Route

| Route | Purpose |
|---|---|
| `/districts` | List/search districts |
| `/districts/:id` | District Dashboard (canonical) |
| `/districts/:id/healthcare` (illustrative sub-resource pattern) | Domain drill-down |
| `/districts/:id/assistant`, `/predictions`, `/scenarios`, `/recommendations` | Per [frontend-architecture.md](../02_System_Architecture/frontend-architecture.md) Section 3, unchanged |

## 6. Route Parameter Semantics

`:id` is the district's stable, assigned identifier ([entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) — never the district's display name, never a value that changes if the district's name is corrected or its boundary is amended.

## 7. District Identity

A district's identity is its stable identifier, unchanged for the district's lifetime regardless of name corrections or boundary version changes ([temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 3) — this is the exact property a name-based route parameter cannot guarantee.

## 8. Deep Linking

`/districts/:id` remains directly linkable and bookmarkable, unchanged in principle from [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) Section 9 — the only change from that document is which parameter form is canonical.

## 9. Invalid District Behavior

Unchanged from [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) Section 8: an unresolvable `:id` renders an explicit "not found" state, never a blank page.

## 10. Navigation

Selecting a district on the Telangana Overview map navigates to `/districts/:id` using that district's already-known identifier (resolved at the point of selection, since the map's own district data already carries each district's identifier) — no separate name-to-identifier lookup is needed for map-driven navigation.

## 11. Frontend/Backend Consistency

This resolution eliminates the divergence between [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) and [api-route-implementation.md](../09_Backend_Implementation/api-route-implementation.md)/[api-contracts.md](../06_API_and_Integration/api-contracts.md) — both now describe the same identifier-based convention, restoring the frontend/backend contract alignment [frontend-backend-contract-resolution.md](frontend-backend-contract-resolution.md) formalizes further.

## 12. Migration Impact on Future Implementation

Since no implementation exists yet (this remains a documentation-only program), there is no code to migrate — this resolution simply removes the ambiguity before any routing code is written. The only "migration" is documentation-level: a future revision of [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md) should adopt this resolution's route table (Section 5) in place of its own Section 5, and update AD-FE-005's status.

## 13. Milestone Traceability

Applies from M1 onward — district routing is the first navigable capability in the product roadmap ([engineering-overview.md](../00_Engineering_Overview/engineering-overview.md) Section 8).

## 14. Open Decisions

- Whether the Proposed name-to-identifier alias/redirect mechanism (Section 4) is ever actually implemented — not committed, offered only as an available future option.
