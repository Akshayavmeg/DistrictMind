---
Document Name: Entity Catalog
Document ID: ED-DB-CAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Entity Catalog

## 1. Purpose

This document catalogs every table-realized logical entity from [logical-data-model.md](logical-data-model.md), and provides a deeper design profile for key entities. Attribute lists are deliberately minimal — every field is justified by a specific requirement, a source document, or is explicitly marked **Proposed (engineering inference)**. No field is invented for completeness's sake.

## 2. Entity ID Convention

Entity IDs use the pattern `E-<DOMAIN>-<NNN>` (e.g., `E-GEO-001`), distinct from Architecture Decision IDs (`AD-DB-XXX`) and requirement IDs (`FR-XXX`/`NFR-XXX`), per [naming-conventions.md](../03_Project_Structure/naming-conventions.md) Section 13's extensible ID-scheme pattern.

## 3. Master Entity Catalog

| Entity | Purpose | Key Attributes | Relationships | Spatial? | Temporal? | Source | Status |
|---|---|---|---|---|---|---|---|
| E-GEO-001 State | Top-level administrative scope | name, code | Parent of District | No | No | [constraints.md](../01_Requirements/constraints.md) (Telangana scope) | Proposed |
| E-GEO-002 District | Primary DistrictMind scope unit | name, code, boundary | Child of State; parent of Mandal | Yes | Low (versioned on correction) | Blueprint §10.3 (implied by `mandals.district_id`) | Proposed |
| E-GEO-003 Mandal | Sub-district unit | name, code, boundary | Child of District; parent of Village | Yes | Low | Blueprint §10.3 | Proposed |
| E-GEO-004 Village | Smallest administrative unit in scope | name, code, boundary, population (denormalized summary — see [database-normalization.md](database-normalization.md)) | Child of Mandal; referenced by nearly every domain | Yes | Low | Blueprint §10.3 | Proposed |
| E-DEM-001 Population Observation | Population count at a point in time | village reference, year, count, age_band | References Village | No | Yes | Blueprint §10.3 `population` table | Proposed |
| E-HLT-001 Health Facility | A hospital/PHC | name, type, capacity, location | Spatially joined to Village/Mandal | Yes | Low | Blueprint §10.3 `hospitals` table | Proposed |
| E-HLT-002 Facility Type | Enumeration (PHC, general, specialty) | code, label | Referenced by Health Facility | No | No | Blueprint §14.2 (facility-type differentiation implied) | Proposed |
| E-INF-001 School | A school facility | name, level, capacity, location | Spatially joined to Village/Mandal | Yes | Low | Blueprint §10.3 `schools` table | Proposed |
| E-INF-002 Government Office | A government office | name, department, location | Spatially joined to Village/Mandal | Yes | Low | Blueprint §10.3 `government_offices` table | Proposed |
| E-INF-003 Water Body | A water feature | name, type, boundary | Spatially referenced by Disaster/Agriculture | Yes | Low | Blueprint §10.3 `water_bodies` table | Proposed |
| E-TRN-001 Road | A road (line geometry) | name, road_class, geometry | Contained within District/Mandal (spatial) | Yes | Low | Blueprint §10.3 `roads` table | Proposed |
| E-TRN-002 Road Segment | A subdivision of Road for routing | parent road reference, geometry | Child of Road; node/edge basis for Transport Connection | Yes | Low | Proposed (inferred) — see [logical-data-model.md](logical-data-model.md) Section 7 |
| E-AGR-001 Agricultural Area / Observation | Crop/land record for a village and season | village reference, crop, area_hectares, season | References Village | No | Yes | Blueprint §10.3 `agriculture` table | Proposed |
| E-WTH-001 Weather Station | A weather observation point | name, location | Spatially near, not FK to, Village | Yes | Low | Blueprint §10.3 `weather` table (station reference) | Proposed |
| E-WTH-002 Weather Observation | A time-stamped reading | station reference, date, rainfall_mm, temp_c, type discriminator | References Weather Station | No | Yes | Blueprint §10.3 `weather` table | Proposed |
| E-DIS-001 Disaster Event | A hazard occurrence | type, start_time, end_time, affected geometry | References affected Villages/Roads/Facilities (Section 8, [relationship-model.md](relationship-model.md)) | Yes | Yes | Proposed (inferred) — [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 9 |
| E-DIS-002 Impact Observation | A recorded effect of a Disaster Event | disaster event reference, affected entity reference, description | References Disaster Event + affected entity | Yes | Yes | Proposed (inferred) |
| E-ANA-001 Indicator Definition | A named, defined metric | code, name, domain, unit | Referenced by Analytical Result | No | No | Proposed (engineering inference, generalizing domain "Indicator" mentions) |
| E-ANA-002 Analytical Result | A computed value of an Indicator for an entity/time | indicator reference, entity reference, value, computed_at | References Indicator Definition + source entity | Indirect | Yes | Proposed (inference) |
| E-PRD-001 Model Execution Metadata | Model name/version/training reference | model_name, version, trained_at, input_snapshot_reference | Referenced by Prediction | No | Yes | [database-architecture.md](../02_System_Architecture/database-architecture.md) Section 8 |
| E-PRD-002 Prediction / Forecast | A model-generated estimate | model execution reference, target entity, horizon, value, confidence | References Model Execution Metadata + target entity | Indirect | Yes | Blueprint §12 (per-model tables), NFR-032 |
| E-SIM-001 Scenario | A hypothetical scenario definition | name, type, parameters (structured) | References baseline snapshot | Indirect | Yes | Blueprint §13.2 |
| E-SIM-002 Scenario Output | The computed result of a Scenario | scenario reference, affected entity, baseline_value, scenario_value, delta | References Scenario + affected entity | Indirect | Yes | Blueprint §13.3 |
| E-REC-001 Recommendation | A ranked, justified suggestion | type, target entity, score, justification_text, status | References Recommendation Evidence | Indirect | Yes | Blueprint §14 |
| E-REC-002 Recommendation Evidence | Link from Recommendation to justifying records | recommendation reference, evidence_type, evidence reference | Many-to-many, Recommendation ↔ Analytical Result/Prediction/Scenario Output | No | No | FR-031 |
| E-AI-001 User Query | A submitted natural-language question | text, submitted_at, user reference | Referenced by Agent Execution | No | Yes | Blueprint §2.1, FR-020 |
| E-AI-002 Agent Execution | One agent's contribution within a run | agent_name, query reference, status | References User Query; parent of Tool Execution | No | Yes | Blueprint §7 |
| E-AI-003 Tool Execution | A single typed tool call | agent execution reference, tool_name, arguments, result_summary, logged_at | References Agent Execution | Indirect | Yes | Blueprint §8.1 ("every tool call... logged") |
| E-AI-004 AI Response | The composed answer returned to the user | query reference, response_text, grounded (boolean), cited evidence references | References User Query + Evidence | No | Yes | FR-021, FR-022 |
| E-AUD-001 Audit Event | A logged administrative/review action | actor, action_type, target_entity_reference, timestamp | References the acted-upon entity | No | Yes | FR-036, FR-037 |
| E-AUD-002 Dataset Version | An ingestion-run/version marker | dataset_name, version, ingested_at | Referenced by every versioned Curated record | No | Yes | [data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 7 |

## 4. Key Entity Deep Dives

For each key entity: Entity ID, business meaning, identifier strategy, required/optional attributes, provenance, versioning, lifecycle.

### E-GEO-002 — District

- **Business meaning:** The primary unit of DistrictMind's operational scope — every dashboard view, GIS navigation action, and AI query is ultimately scoped to a district ([functional-requirements.md](../01_Requirements/functional-requirements.md) FR-007–FR-009).
- **Identifier strategy:** A stable, assigned identifier (not the geometry itself) — the same district must resolve to the same identifier across boundary corrections (Section 12, [database-normalization.md](database-normalization.md)).
- **Required attributes:** name, code, boundary geometry, parent State reference.
- **Optional attributes:** area (derivable from geometry — candidate for a computed, not stored, attribute).
- **Provenance:** source, ingestion timestamp (per Section 20 of [logical-data-model.md](logical-data-model.md)'s cross-cutting pattern).
- **Versioning:** boundary corrections produce a new version, per [data-governance.md](../04_Data_Engineering/data-governance.md) Section 7; the current version is what "current state" queries resolve to ([temporal-database-design.md](temporal-database-design.md)).
- **Lifecycle:** created at initial GIS ingestion (M1); rarely updated thereafter except for boundary corrections; never deleted (districts are not expected to be decommissioned within current scope).

### E-GEO-004 — Village

- **Business meaning:** The finest-grained administrative unit DistrictMind reasons about; the unit most domain data (population, agriculture, facility coverage) is ultimately attributed to.
- **Identifier strategy:** Stable assigned identifier, same pattern as District.
- **Required attributes:** name, code, boundary geometry, parent Mandal reference.
- **Optional attributes:** a denormalized current population figure for fast dashboard access (Section 5, [database-normalization.md](database-normalization.md)) — explicitly a cache of the latest Population Observation, not a separate source of truth.
- **Provenance/Versioning/Lifecycle:** same pattern as District.

### E-HLT-001 — Health Facility

- **Business meaning:** The entity underlying DistrictMind's single most repeated worked example — coverage-gap analysis (Blueprint §2.1, §11.4).
- **Identifier strategy:** Stable assigned identifier; the same physical hospital must not be represented as two records after entity matching ([data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 6).
- **Required attributes:** name, type (references Facility Type), location (point geometry).
- **Optional attributes:** capacity (may be unavailable for some sources — must be nullable, not defaulted to zero, per [data-validation.md](../04_Data_Engineering/data-validation.md) Section 6's "invalid negative values" and completeness handling).
- **Provenance:** source department, ingestion timestamp.
- **Versioning:** a corrected capacity or relocated facility produces a new version.
- **Lifecycle:** created on ingestion (M2 — Future); updated on re-ingestion; a facility closure is a status change, not a deletion (preserves historical coverage analysis validity, per [temporal-database-design.md](temporal-database-design.md)).

### E-TRN-001 — Road

- **Business meaning:** The geometry basis for the derived Transport Connection graph used in routing/accessibility analysis (Blueprint §11.6).
- **Identifier strategy:** Stable assigned identifier, referenced by simulation scenarios (e.g., "close road R42," Blueprint §13.3).
- **Required attributes:** name (if available — may be null for minor roads), road_class, line geometry.
- **Provenance/Versioning/Lifecycle:** source = OpenStreetMap (per [data-sources.md](../04_Data_Engineering/data-sources.md)), re-ingested on the OSM refresh cadence ([data-ingestion.md](../04_Data_Engineering/data-ingestion.md) AD-DE-003); a road closure in the *real world* is a new version; a road closure in a *simulation* never touches this entity at all (AD-DE-004).

### E-DEM-001 — Population Observation

- **Business meaning:** The time-series input required for Population Growth prediction (Blueprint §12.3) and demographic-based coverage-gap scoring.
- **Identifier strategy:** Compound — (village reference, effective year) uniquely identifies an observation; no single-column surrogate key is required at the logical level.
- **Required attributes:** village reference, effective year, count.
- **Optional attributes:** age_band breakdown (implied by Blueprint's `age_band` column, not further specified — [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 4).
- **Provenance:** source census cycle/portal ([data-sources.md](../04_Data_Engineering/data-sources.md)), ingestion timestamp.
- **Versioning:** a correction to a published census figure produces a new version of that year's observation, not an overwrite (Reproducibility).
- **Lifecycle:** append-only in practice — new years are added, not replacing old ones (this *is* the historical time series, per [temporal-database-design.md](temporal-database-design.md)).

### E-WTH-002 — Weather Observation

- **Business meaning:** The direct input to Rainfall Prediction (Blueprint §12.2) and, downstream, Flood Prediction (Blueprint §12.1).
- **Identifier strategy:** Compound — (station reference, date, observation type) uniquely identifies a reading.
- **Required attributes:** station reference, date, observation type discriminator (rainfall/temperature), value.
- **Provenance:** source (IMD-or-equivalent, per [data-sources.md](../04_Data_Engineering/data-sources.md)), ingestion timestamp.
- **Versioning:** a corrected historical reading produces a new version; missing periods are represented by absence, not a zero-filled row ([data-validation.md](../04_Data_Engineering/data-validation.md) Section 5).
- **Lifecycle:** append-only time series, same pattern as Population Observation.

### E-DIS-001 — Disaster Event

- **Business meaning:** The anchor entity for cross-domain disaster reasoning (Weather → Disaster → Transportation → Healthcare, per [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) Section 13).
- **Identifier strategy:** Stable assigned identifier per event occurrence.
- **Required attributes:** type, start_time, affected geometry (a derived or directly recorded extent).
- **Optional attributes:** end_time (an ongoing event may not have one yet).
- **Provenance:** source (**Proposed — inferred**, no confirmed disaster data source exists per [data-sources.md](../04_Data_Engineering/data-sources.md) Section 3), or, if model-derived (a predicted flood extent rather than a reported event), a Model Execution Metadata reference instead — this distinction must be preserved (Section 11 of [digital-twin-state-model.md](digital-twin-state-model.md)).
- **Versioning:** an event's affected geometry may be refined as more data arrives (event evolution, per [temporal-database-design.md](temporal-database-design.md) Section 8) — each refinement is a new version, not an overwrite.
- **Lifecycle:** created at event detection/ingestion; updated as the event evolves; never deleted (historical disaster records inform future risk modeling, per Blueprint §12.1's training-data dependency).

### E-ANA-002 — Analytical Result

- **Business meaning:** The physical home for the vast majority of "Indicator" values across every domain (coverage percentages, density, accessibility scores) — a generic pattern rather than one table per domain indicator.
- **Identifier strategy:** Compound — (indicator reference, target entity reference, computed_at) — allows the same indicator to be recomputed over time without losing history.
- **Required attributes:** indicator reference (E-ANA-001), target entity reference (polymorphic — a District, Mandal, or Village), value, computed_at.
- **Provenance:** computation logic version ([data-transformation.md](../04_Data_Engineering/data-transformation.md) Section 5).
- **Versioning:** every recomputation is a new row, not an overwrite — enabling trend charts (FR-026) without a separate history mechanism.
- **Lifecycle:** created on each scheduled/on-demand recomputation; retained per the (currently undefined) retention policy ([data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 30).

### E-PRD-002 — Prediction / Forecast

- **Business meaning:** The core Predicted State entity ([digital-twin-state-model.md](digital-twin-state-model.md)) — a forecast value with its confidence.
- **Identifier strategy:** Compound — (model execution reference, target entity, horizon).
- **Required attributes:** model execution reference (E-PRD-001), target entity reference, horizon (the future period the prediction concerns), value, confidence indicator (NFR-032).
- **Provenance:** the Model Execution Metadata reference *is* the provenance mechanism (which model/version/training snapshot produced this).
- **Versioning:** never overwritten — a re-run with updated data creates a new Prediction record, referencing a new Model Execution Metadata entry (Reproducibility).
- **Lifecycle:** created on model inference (M4 — Future); retained indefinitely for audit/reproducibility, even after superseded by a newer forecast.

### E-SIM-001 — Scenario

- **Business meaning:** A user-defined hypothetical, the trigger for the sandboxed Simulation Engine (AD-DE-004).
- **Identifier strategy:** Stable assigned identifier per scenario run request.
- **Required attributes:** name/type (e.g., "road closure," "rainfall change" — Blueprint §13.2), parameters (a structured/semi-structured attribute set, since parameter shape varies by scenario type — Section 5, [database-normalization.md](database-normalization.md)), baseline snapshot reference.
- **Provenance:** requesting user, submission timestamp.
- **Versioning:** not versioned in the usual sense — each Scenario is a distinct, immutable request; re-running "the same" scenario creates a new Scenario record.
- **Lifecycle:** created on submission; its Scenario Output (E-SIM-002) is computed and retained for comparison, but the underlying sandboxed computation itself is ephemeral (AD-DE-004) — only the *result*, not intermediate sandbox state, persists.

### E-REC-001 — Recommendation

- **Business meaning:** The Recommended State entity, requiring human review before any acceptance (FR-032).
- **Identifier strategy:** Stable assigned identifier.
- **Required attributes:** type (facility-siting, etc. — Blueprint §14.2), target entity/location, score, justification_text, status (draft/accepted/rejected).
- **Provenance:** generating Agent Execution reference (E-AI-002).
- **Versioning:** status transitions are logged as Audit Events (E-AUD-001), not silent field updates (FR-032 acceptance criteria).
- **Lifecycle:** created in draft status by the Recommendation Engine (M6 — Future); transitions to accepted/rejected only via a recorded human action; never auto-transitions.

### E-AI-003 — Tool Execution

- **Business meaning:** The audit-critical record of every AI agent's data access — the mechanism that keeps AI data access controlled and debuggable (Blueprint §8.1).
- **Identifier strategy:** Stable assigned identifier per call.
- **Required attributes:** agent execution reference, tool_name, arguments (structured), result_summary, logged_at.
- **Provenance:** N/A — this entity *is* provenance/audit data for the AI layer.
- **Versioning:** immutable once logged — a tool call record is never edited.
- **Lifecycle:** created at every tool invocation (M3 — Future onward); retained per audit-retention policy (undefined, [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 30).

### E-AUD-001 — Audit Event

- **Business meaning:** The general-purpose administrative/review audit trail (FR-036, FR-037).
- **Identifier strategy:** Stable assigned identifier per event.
- **Required attributes:** actor, action_type, target_entity_reference, timestamp.
- **Provenance:** N/A — this entity is itself the provenance record for administrative actions.
- **Versioning:** immutable/append-only, per [database-architecture.md](../02_System_Architecture/database-architecture.md) Section 9.
- **Lifecycle:** created on every administrative action (M1) and AI recommendation review (M6 — Future); never modified or deleted.

## 5. What Was Deliberately Not Cataloged

Per [logical-data-model.md](logical-data-model.md) Section 16, attribute-only concepts (Facility Capacity, Boundary, Coordinate, Scenario Parameter's individual fields, Recommendation Review State's individual fields) are not separately cataloged here — they are documented as attributes of their owning entity above, consistent with AD-DB-002.

## 6. Milestone Traceability

See [logical-data-model.md](logical-data-model.md) Section 18 — unchanged, restated per-entity in Section 3's table above via each row's implicit domain-to-milestone mapping.

## 7. Open Decisions

- Whether Facility Type, Indicator Definition, and similar reference/lookup entities are separate tables or database-level enumerations — a physical-design decision deferred beyond this milestone.
- Exact structured/semi-structured representation for Scenario Parameters (Section 4) — **To Be Evaluated** at physical design time.
