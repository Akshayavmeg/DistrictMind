---
Document Name: Domain Layer Design
Document ID: ED-BEIMPL-DOM-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Domain Layer Design

## 1. Purpose

This document defines the Domain Logic layer established by AD-BE-003 — business rules, invariants, state transitions, and validation rules that must remain independent of transport (HTTP) and persistence (database) details. No code exists here.

## 2. What Belongs in Domain Logic

| Category | Definition | Example |
|---|---|---|
| Domain rules | A business-meaningful constraint on behavior | "A coverage gap exists only if zero qualifying facilities are within threshold" |
| Calculations | Deterministic derivations | Coverage-gap percentage, distance-based accessibility scoring |
| Invariants | A condition that must always hold | "A Prediction always references a Model Execution Metadata entry" |
| State transitions | A defined change from one valid state to another | Scenario: defined → running → completed/failed; Recommendation: draft → accepted/rejected |
| Validation rules | Domain-meaningful (not merely structural) checks | "A Scenario's baseline reference must point to a Dataset Version that existed before the Scenario's own creation time" ([temporal-database-design.md](../05_Database_Design/temporal-database-design.md) Section 5) |
| Business concepts | Named domain entities and their meaning | District, Health Facility, Recommendation, Evidence |

## 3. What Does Not Belong in Domain Logic

HTTP status codes, request/response serialization, SQL/ORM calls, caching decisions — all of these belong to the API Boundary, Repository, or cross-cutting Caching layer respectively, never to Domain Logic (Section 15 of [application-layer-design.md](application-layer-design.md) restates the same boundary from the Application Layer's side).

## 4. The Non-Negotiable State-Category Rules

Restated verbatim from [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) and this milestone's own instruction, because these are, above all else, **Domain rules** — they belong here, not merely in documentation prose:

| Rule | Enforcement Point |
|---|---|
| **A prediction is not an observation.** | Prediction module's Domain Logic refuses to write a Prediction record into any Observed-state table; the two are structurally distinct entity families (AD-DB-005) |
| **A simulation cannot modify source-of-truth data.** | Simulation module's Domain Logic enforces the sandboxing invariant (AD-DE-004) — every write from a Simulation run targets only Scenario/Scenario Output tables |
| **An AI response cannot become authoritative source data.** | AI/Agent module's Domain Logic never writes an AI Response into any Curated/Observed table; enforced structurally, per [data-governance.md](../04_Data_Engineering/data-governance.md) Section 6 |
| **A recommendation must retain its rationale/evidence.** | Recommendation module's Domain Logic refuses to persist a Recommendation record without at least one resolved Recommendation Evidence reference |
| **A scenario must be isolated from the baseline.** | Simulation module's Domain Logic clones only the relevant baseline subset into an ephemeral sandbox before any computation begins (AD-DE-004) |

Each rule above is a **hard invariant**, not a style guideline — a violation is treated as a critical defect (per [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Gates 6–9's rollback conditions), not a minor one.

## 5. Domain Rules by Module

| Module | Key Domain Rules |
|---|---|
| Geography | A Village's boundary must fall within (or be spatially consistent with) its parent Mandal's boundary ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 4) |
| Healthcare | Coverage-gap determination (Section 2); a facility's containing village is always computed, never a stored FK ([relationship-model.md](../05_Database_Design/relationship-model.md) Section 4) |
| Transportation | A route with no connected path returns an explicit "no route" invariant, never a fabricated distance estimate |
| Disaster | A Risk Indicator must be labeled Derived or Predicted, never left ambiguous ([digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md)) |
| Prediction | Insufficient historical data yields an explicit insufficient-data result, never a low-confidence guess presented as normal (NFR-031) |
| Simulation | See Section 4 |
| Recommendation | A Recommendation cannot transition to "accepted" without a recorded human action (FR-032); see Section 4 |
| AI/Agent | Grounding Validation — no claim reaches a response without a resolvable Evidence reference ([ai-safety-and-grounding.md](../07_AI_GIS_and_Intelligence/ai-safety-and-grounding.md) Section 2) |

## 6. Cross-Domain Rules — Weather → Disaster → Transportation → Healthcare

This is the Blueprint's flagship chain, and it is deliberately **not** owned by any single module's Domain Logic — no module "owns" the whole chain, because doing so would concentrate unrelated business rules (weather risk modeling, road-network topology, healthcare coverage) into one bloated component. Instead:

| Step | Owning Module's Domain Rule |
|---|---|
| Weather → Risk | Disaster module: "a risk assessment must cite the specific Weather Observations or Prediction it was computed from" |
| Risk → Affected Area | Disaster module (in composition with GIS): "an affected-area geometry must carry an explicit Observed/Predicted/Scenario label" |
| Affected Area → Transportation Impact | Transportation module: "network impact recomputation never mutates the real Road/Road Segment tables when triggered by a hypothetical affected area" |
| Transportation Impact → Healthcare Accessibility | Healthcare module: "accessibility results computed under an affected-area condition must be labeled consistently with that condition's own state category" |

## 7. Avoiding a Tangled Web of Cross-Domain Dependencies

The discipline that keeps this chain from becoming an unmanageable tangle:

| Principle | Application |
|---|---|
| Each module owns only its own domain's rules | Section 6's table — no module reaches into another's Domain Logic to implement a cross-domain rule; it consumes the other module's *output* (a typed result), never its internal logic |
| Composition happens at the Application Layer, not the Domain Layer | The full chain (Section 8, [application-layer-design.md](application-layer-design.md)) is orchestrated by the Application Layer calling each module in sequence — no module's Domain Logic directly imports another module's Domain Logic |
| The GIS module is the only cross-cutting spatial dependency | Every module needing spatial computation calls the GIS module (Section 3, [backend-implementation-architecture.md](backend-implementation-architecture.md)) rather than re-implementing geometry logic, preventing N-to-N spatial-logic duplication |
| State-category labeling is a shared, not per-module-invented, convention | Every module applies the identical Observed/Derived/Predicted/Scenario/Recommendation/AI-Response vocabulary from [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md) — no module invents its own competing state taxonomy |

This is what prevents the exact failure mode the milestone brief warns against: "domain logic... becoming a tangled collection of cross-domain dependencies."

## 8. Milestone Traceability

| Domain Logic Capability | First Needed |
|---|---|
| Geography rules | M1 |
| Healthcare, Transportation, Disaster, Weather rules | M2 |
| AI/Agent grounding rules | M3 |
| Prediction rules | M4 |
| Simulation rules | M5 |
| Recommendation rules | M6 |

## 9. Open Decisions

None specific to this document — Domain Logic implementation detail (exact function/class organization) is deferred to actual coding, out of scope for this documentation-only milestone.
