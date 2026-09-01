---
Document Name: Logical Data Model
Document ID: ED-DB-LDM-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Logical Data Model

## 1. Purpose

This document defines DistrictMind's major logical entities, organized by domain, and explains — for each one — whether it is expected to become a physical table, a view, a computed relationship, or an embedded attribute. It elaborates [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) to the level of named logical entities, without specifying columns, types, or SQL (that is [entity-catalog.md](entity-catalog.md) and future physical design).

## 2. Logical Entity vs. Physical Implementation

A **logical entity** is a distinct concept the business/domain model needs to reason about. A **physical implementation** is however that concept is actually realized in the eventual database. These are not always one-to-one:

| Logical Entity Type | Typical Physical Realization |
|---|---|
| A concept with independent identity and lifecycle (e.g., District, Health Facility) | A table |
| A concept that is really just an attribute of another entity (e.g., "Facility Capacity") | A column on the owning entity's table, not a separate table |
| A concept that is a computed relationship, not a stored fact (e.g., "which village a hospital is in") | A view or query-time spatial join, not a foreign key ([spatial-database-design.md](spatial-database-design.md)) |
| A concept that only exists as an aggregation over other data (e.g., "Healthcare Indicator") | A materialized or on-demand view ([analytical-data-model.md](analytical-data-model.md)) |
| A concept that is a snapshot/version of another entity over time (e.g., "Population Observation") | A table with a temporal key, not a new observation overwriting the last one ([temporal-database-design.md](temporal-database-design.md)) |

This distinction is applied consistently below and is the basis of **AD-DB-002** ([database-design.md](database-design.md) is the anchor; the decision itself is recorded in Section 20 of this document).

## 3. Geography

| Entity | Logical Role | Physical Realization |
|---|---|---|
| State | Top-level administrative unit (currently only Telangana in scope — [constraints.md](../01_Requirements/constraints.md)) | Table (small, reference-like) |
| District | Primary DistrictMind scope unit | Table |
| Mandal | Sub-district administrative unit | Table |
| Village / Local Administrative Unit | Smallest administrative unit in current scope | Table |
| Geographic Boundary | The polygon/multipolygon geometry for a District/Mandal/Village | **Attribute** of the owning entity (a geometry-typed column), not a separate entity — a boundary has no independent identity apart from the region it bounds |
| Coordinate / Location | A point location (used by facilities, weather stations, etc.) | **Attribute** of the owning entity (a geometry-typed column) — not modeled as a standalone entity |

Geography is the root of the hierarchy every other domain attaches to (State → District → Mandal → Village), per [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 3.

## 4. Demographics

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Population Observation | A population count for a Village/Mandal/District at a specific effective date | Table (temporal — see [temporal-database-design.md](temporal-database-design.md)) |
| Demographic Indicator | A derived value (e.g., population density) | View/materialized view — **Derived**, not source |

## 5. Healthcare

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Health Facility | A hospital or PHC | Table |
| Facility Type | Enumeration (PHC, general hospital, specialty) | Reference/lookup table |
| Facility Capacity | Bed count or equivalent | **Attribute** of Health Facility, not a separate entity |
| Healthcare Indicator | Coverage/accessibility metric | View — **Derived** |

## 6. Infrastructure

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Infrastructure Asset | Generic supertype for non-healthcare public facilities | Conceptual grouping only — realized as the specific entities below, not a physical supertype table (avoids premature generalization) |
| School | A school facility | Table |
| Government Office | A government office location | Table |
| Water Body | A water feature | Table |
| Infrastructure Indicator | Coverage/accessibility metric for schools/offices | View — **Derived** |

## 7. Transportation

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Road | A road, stored as line geometry | Table |
| Road Segment | A subdivision of a Road, used for graph/routing purposes | Table (or derived at transformation time from Road geometry, per [data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 6 — an open decision, Section 21) |
| Transport Connection | A graph edge (node-to-node connectivity) used for routing | **Derived** structure, computed from Road/Road Segment geometry, not separately ingested — per [spatial-data.md](../04_Data_Engineering/spatial-data.md) Section 11 |
| Accessibility Indicator | Travel-time/distance-based coverage metric | View — **Derived** |

## 8. Agriculture

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Agricultural Area | A village-linked agricultural record (crop, area, season) | Table |
| Crop / Land Indicator | Derived land-use/yield metric | View — **Derived** |
| Agriculture Observation | A season-specific observation (may be the same as Agricultural Area, or a temporal refinement of it) | Table — treated as the temporal instance of Agricultural Area (Section 12 of [temporal-database-design.md](temporal-database-design.md)) |

## 9. Weather

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Weather Station | A point location where observations are recorded | Table |
| Weather Observation | A time-stamped reading (rainfall, temperature, or other) | Table (temporal) |
| Rainfall Observation | A specific type of Weather Observation | **Attribute/type discriminator** on Weather Observation, not a separate table — avoids splitting a single time-series concept across multiple tables |
| Temperature Observation | Same pattern as Rainfall Observation | Same — discriminator, not separate table |
| Environmental Indicator | Derived aggregate (e.g., monthly rainfall total) | View — **Derived** |

## 10. Disaster

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Disaster Event | A hazard occurrence (flood, cyclone) | Table — **Proposed (inferred)**, per [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 9 |
| Risk Indicator | A derived/predicted risk score for an area | View or table depending on whether it is Derived (computed now) or Predicted (model output) — see [digital-twin-state-model.md](digital-twin-state-model.md) |
| Vulnerable Area | A derived geographic zone flagged as at-risk | View — **Derived** from Disaster Event + Geography + Risk Indicator |
| Impact Observation | A recorded effect of a Disaster Event (e.g., a flooded road segment) | Table, linked to the originating Disaster Event |

## 11. Analytics / Prediction

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Indicator | A generic named, defined metric (the parent concept for all domain-specific "Indicator" entities above) | Reference table (indicator definitions) + a generic Analytical Result table storing computed values, avoiding one physical table per domain indicator |
| Metric | Synonym/refinement of Indicator at a specific granularity | Same physical pattern as Indicator |
| Aggregation | A computed summary (e.g., mandal-level rollup of village data) | View/materialized view |
| Analytical Result | A stored, versioned computation of an Indicator for a given entity and time | Table — the actual physical home for most "Indicator" values |
| Prediction | A model-generated estimate | Table — **Predicted State** ([digital-twin-state-model.md](digital-twin-state-model.md)) |
| Forecast | A time-horizon-specific Prediction | Same table as Prediction, distinguished by a forecast-horizon attribute, not a separate entity |
| Model Execution Metadata | Model name/version, training data reference, execution timestamp | Table, referenced by every Prediction record (Reproducibility principle) |

## 12. Simulation

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Scenario | A user-defined hypothetical (e.g., "+30% rainfall") | Table |
| Scenario Parameter | A specific input value for a Scenario | **Attribute set** of Scenario (e.g., a structured/JSON parameter set), not a fully normalized separate table, since parameters vary by scenario type — see [database-normalization.md](database-normalization.md) Section 5 |
| Scenario Output | The computed result of running a Scenario | Table, referencing the originating Scenario and the baseline snapshot it was computed against — **Scenario State**, never written into Operational data (AD-DE-004) |

## 13. Recommendation

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Recommendation | A ranked, justified suggestion | Table |
| Recommendation Evidence | A link from a Recommendation to the specific Analytical/Prediction/Scenario records that justify it | Association/join table (many-to-many, Recommendation ↔ evidence records of varying types) |
| Recommendation Execution / Review State | The lifecycle status (draft → accepted/rejected) and the human reviewer's identity/timestamp | **Attribute set** of Recommendation, not a separate table, since it is a 1:1 status extension, not an independently-lived entity |

## 14. AI

| Entity | Logical Role | Physical Realization |
|---|---|---|
| User Query | The natural-language question submitted | Table (or transient/session data — an open decision, Section 21) |
| Agent Execution | One agent's contribution within a Coordinator-orchestrated run | Table |
| Evidence | A retrieved, citable fact returned to an agent | Not a new entity — a *view* over Analytical Result/Prediction/Scenario/Recommendation records, annotated with freshness/provenance ([ai-data-access-model.md](ai-data-access-model.md)) |
| Tool Execution | A single typed tool call, its arguments, and its result | Table (audit-relevant — [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 18) |
| AI Response | The composed natural-language output returned to the user | Table |
| Provenance | Source/lineage metadata | **Cross-cutting attribute pattern** applied to every relevant table (not a single standalone "Provenance" table) — see Section 20 |

## 15. Audit

| Entity | Logical Role | Physical Realization |
|---|---|---|
| Audit Event | A logged administrative or AI-review action | Table, append-only (per [database-architecture.md](../02_System_Architecture/database-architecture.md) Section 9) |
| Dataset Version | A specific ingestion-run/version marker for a Curated dataset | Table, referenced by every versioned record ([temporal-database-design.md](temporal-database-design.md)) |
| Data Change Metadata | What changed, when, and by what process | **Attribute set** of Audit Event, not a separate entity |

## 16. Summary Entity Count

| Domain | Table-Realized Entities | View/Derived-Only Entities | Attribute-Only Concepts |
|---|---|---|---|
| Geography | 4 (State, District, Mandal, Village) | 0 | 2 (Boundary, Coordinate) |
| Demographics | 1 | 1 | 0 |
| Healthcare | 2 | 1 | 1 |
| Infrastructure | 3 | 1 | 0 |
| Transportation | 2 | 1 | 1 |
| Agriculture | 2 | 1 | 0 |
| Weather | 2 | 1 | 2 |
| Disaster | 3 | 1 | 0 |
| Analytics/Prediction | 3 | 2 | 0 |
| Simulation | 2 | 0 | 1 |
| Recommendation | 2 | 0 | 1 |
| AI | 3 | 1 | 1 |
| Audit | 2 | 0 | 1 |

This distinction — roughly 29 table-realized entities against ~10 view/derived entities and ~10 attribute-only concepts — is why [entity-catalog.md](entity-catalog.md) does not simply list every noun in this document as an equal-weight table.

## 17. Cross-Domain Relationship Preview

Full relationship detail (cardinality, ER diagrams) is in [relationship-model.md](relationship-model.md). The logical entities above support every cross-domain reasoning chain identified in [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 13, including the Blueprint's flagship example: Weather Observation → (feeds) → Risk Indicator/Disaster Event → (affects) → Road/Road Segment → (impacts) → Accessibility Indicator → (affects) → Health Facility reachability.

## 18. Milestone Traceability

| Entity Group | First Needed |
|---|---|
| Geography | M1 |
| Demographics, Healthcare, Infrastructure, Transportation, Agriculture, Weather, Disaster | M2 — Future |
| AI (User Query, Agent Execution, Evidence, Tool Execution, AI Response) | M3 — Future |
| Analytics/Prediction | M2 — Future (Indicator/Aggregation), M4 — Future (Prediction/Forecast) |
| Simulation | M5 — Future |
| Recommendation | M6 — Future |
| Audit | M1 (administrative actions), M6 — Future (AI recommendation review) |

## 19. Architectural Decision

**AD-DB-002 — Logical Entities Are Not Automatically Physical Tables**
- **Decision:** Every logical entity identified in this document is evaluated individually for its physical realization (table, view, attribute, or computed relationship) rather than defaulting every noun to its own table.
- **Context:** The milestone brief explicitly warns against assuming every logical entity must become a physical table; a naive 1:1 mapping would produce an over-normalized, hard-to-query schema (e.g., a separate "Facility Capacity" table for a single-column fact).
- **Alternatives considered:** A uniform "one table per noun" approach — rejected as producing unnecessary join complexity for simple attributes, and structural confusion for genuinely computed relationships (e.g., facility-to-village containment, which must never be a stored, staleness-prone foreign key per [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 3).
- **Evaluation criteria:** Whether the concept has independent identity/lifecycle, whether it is genuinely computed vs. stored, whether it varies enough in structure to need its own normalized table (Scenario Parameters) or not (Facility Capacity).
- **Trade-offs:** Requires more upfront judgment per entity than a mechanical mapping; produces a smaller, more maintainable physical schema in exchange.
- **Consequences:** [entity-catalog.md](entity-catalog.md) documents only table-realized and clearly-justified view entities in full catalog form; attribute-only concepts are noted as attributes of their owning entity, not separately cataloged.
- **Status:** Proposed.

## 20. Cross-Cutting Provenance Pattern

Rather than a single "Provenance" table joined to everything (which would become a universal bottleneck and obscure which provenance fields actually apply to which entity type), provenance is modeled as a **repeated attribute pattern**: every Curated, Analytical, Predicted, Scenario, and Recommendation entity carries its own `source`, `ingestion/computation timestamp`, and `version` attributes directly, consistent with [data-lineage.md](../04_Data_Engineering/data-lineage.md) Section 3's per-stage metadata table. This is elaborated further in [ai-data-access-model.md](ai-data-access-model.md) Section 6.

## 21. Open Decisions

- Whether Road Segment is separately ingested or derived entirely at transformation time from Road geometry (Section 7).
- Whether User Query is persisted as a table or handled as transient session state (Section 14) — a physical/implementation decision deferred beyond this milestone.
- Final confirmation of which "Indicator" instances are materialized views vs. computed on-demand — deferred to [analytical-data-model.md](analytical-data-model.md) and physical design.
