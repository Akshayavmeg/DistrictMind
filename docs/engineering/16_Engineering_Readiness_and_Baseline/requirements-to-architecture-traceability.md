---
Document Name: Requirements to Architecture Traceability
Document ID: ED-ERB-REQ-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Requirements to Architecture Traceability

## 1. Purpose

This document traces Requirements → Architecture → Engineering Design using only existing FR-001–FR-037 and NFR-001–NFR-038 identifiers from [functional-requirements.md](../01_Requirements/functional-requirements.md) and [non-functional-requirements.md](../01_Requirements/non-functional-requirements.md). **No requirement ID is invented.**

## 2. Authentication

| Requirement | Architecture/Design |
|---|---|
| FR-034 (admin manages roles/permissions) | [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md), [authentication-authorization.md](../06_API_and_Integration/authentication-authorization.md) |
| FR-036 (audit log for admin actions) | [backend-observability.md](../09_Backend_Implementation/backend-observability.md), [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) |

## 3. District Selection

| Requirement | Architecture/Design |
|---|---|
| FR-010 (render boundaries) | [gis-architecture.md](../02_System_Architecture/gis-architecture.md), [spatial-data-implementation.md](../12_Data_GIS_Implementation/spatial-data-implementation.md) |
| FR-011 (pan/zoom) | [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) |
| FR-012 (region metadata) | [gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md) Section 5 |
| FR-018 (search district/mandal by name) | [frontend-routing-design.md](../10_Frontend_Implementation/frontend-routing-design.md), [routing-resolution.md](../11_Architecture_Resolution/routing-resolution.md) |

## 4. GIS

| Requirement | Architecture/Design |
|---|---|
| FR-010–FR-012 | [gis-computation-engine.md](../07_AI_GIS_and_Intelligence/gis-computation-engine.md), [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) |
| NFR-035 (30 fps pan/zoom, Initial Target) | [frontend-performance-and-responsiveness.md](../10_Frontend_Implementation/frontend-performance-and-responsiveness.md), [performance-and-responsiveness-testing.md](../14_Testing_Security_Observability/performance-and-responsiveness-testing.md) |
| NFR-036 (full Telangana boundary set, no perceptible delay) | [gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md) Section 13 (AD-GIS-001) |
| NFR-027 (GeoJSON/standard formats) | [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 7 |

## 5. Healthcare

| Requirement | Architecture/Design |
|---|---|
| FR-013–FR-015 (multi-domain ingestion, provenance, validation, incl. Healthcare) | [data-domain-model.md](../04_Data_Engineering/data-domain-model.md), [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md) |
| FR-016/FR-017 (dashboard, domain filter) | [frontend-dashboard-design.md](../10_Frontend_Implementation/frontend-dashboard-design.md) |
| Coverage example (Canonical Example A, not a distinct FR) | [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 2, [gis-and-spatial-testing.md](../14_Testing_Security_Observability/gis-and-spatial-testing.md) Section 8 |

## 6. Transportation

| Requirement | Architecture/Design |
|---|---|
| FR-013–FR-015 (applies generically to the Transportation domain) | [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) |
| Bridge closure example (Canonical Example B) | [scenario-engine.md](../07_AI_GIS_and_Intelligence/scenario-engine.md), [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 3, FR-029/FR-030 |

## 7. Weather

| Requirement | Architecture/Design |
|---|---|
| FR-013–FR-015 (applies generically) | [data-domain-model.md](../04_Data_Engineering/data-domain-model.md) |
| Rainfall chain (Canonical Example C) | [gis-computation-implementation.md](../12_Data_GIS_Implementation/gis-computation-implementation.md) Section 4, [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 20 |

## 8. Disaster

| Requirement | Architecture/Design |
|---|---|
| FR-028 (risk score with contributing basis) | [prediction-architecture.md](../07_AI_GIS_and_Intelligence/prediction-architecture.md), [prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) |
| FR-033 (threshold notification) | Not yet traceable to a specific implementation design beyond [backend-observability.md](../09_Backend_Implementation/backend-observability.md)'s general alerting concept — **notification delivery mechanism is not designed in any milestone to date** |

## 9. AI Assistant

| Requirement | Architecture/Design |
|---|---|
| FR-020 (submit NL question) | [ai-agent-integration.md](../06_API_and_Integration/ai-agent-integration.md), [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) |
| FR-021 (grounded response, cited sources) | [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) |
| FR-022 (explicit cannot-answer) | [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 14 |
| NFR-031 (decline rather than fabricate) | [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Sections 2–3 |
| NFR-033 (response references underlying data) | [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) |

## 10. Prediction

| Requirement | Architecture/Design |
|---|---|
| FR-027 (forecast for indicator) | [prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) |
| NFR-032 (confidence/uncertainty where feasible) | [prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 8 |
| Healthcare Demand (Abstract-referenced) | **Cannot be fully traced** — [prediction-implementation.md](../13_AI_Intelligence_Implementation/prediction-implementation.md) Section 14 explicitly documents this as an unresolved scope contradiction against the Blueprint's five-model list |

## 11. Simulation

| Requirement | Architecture/Design |
|---|---|
| FR-029 (define hypothetical scenario) | [scenario-engine.md](../07_AI_GIS_and_Intelligence/scenario-engine.md), [simulation-and-scenario-implementation.md](../13_AI_Intelligence_Implementation/simulation-and-scenario-implementation.md) |
| FR-030 (simulate projected effect) | [simulation-architecture.md](../07_AI_GIS_and_Intelligence/simulation-architecture.md), AD-DE-004 |

## 12. Recommendations

| Requirement | Architecture/Design |
|---|---|
| FR-031 (recommendations from data/predictions/simulations) | [recommendation-engine.md](../07_AI_GIS_and_Intelligence/recommendation-engine.md), [recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md) |
| FR-032 (human review before acceptance) | [recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md) Section 12 |
| FR-037 (audit log for recommendation review) | Same, Section 13 |
| Weighted-scoring technique | **Cannot be fully traced to a technology decision** — [recommendation-and-decision-intelligence-implementation.md](../13_AI_Intelligence_Implementation/recommendation-and-decision-intelligence-implementation.md) Section 6 documents this as an explicit gap |

## 13. Performance

| Requirement | Architecture/Design |
|---|---|
| NFR-001–NFR-003, NFR-035–NFR-036 (Initial Targets) | [caching-and-performance.md](../09_Backend_Implementation/caching-and-performance.md), [frontend-performance-and-responsiveness.md](../10_Frontend_Implementation/frontend-performance-and-responsiveness.md), [performance-and-responsiveness-testing.md](../14_Testing_Security_Observability/performance-and-responsiveness-testing.md) |

## 14. Security

| Requirement | Architecture/Design |
|---|---|
| FR-034 (role/permission management) | [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md) |
| FR-036 (audit for admin actions) | [security-testing.md](../14_Testing_Security_Observability/security-testing.md) |
| NFR series (security, not individually enumerated in [non-functional-requirements.md](../01_Requirements/non-functional-requirements.md) beyond the AI-reliability/explainability items already cited above) | [security-architecture.md](../02_System_Architecture/security-architecture.md), [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Section 5 |

## 15. Observability

| Requirement | Architecture/Design |
|---|---|
| NFR-025 (structured logs) | [backend-observability.md](../09_Backend_Implementation/backend-observability.md) |
| NFR-026 (health-check endpoints) | [operational-monitoring.md](../15_Deployment_Infrastructure_Operations/operational-monitoring.md) Sections 3–5 |

## 16. Accessibility

**No functional or non-functional requirement in [functional-requirements.md](../01_Requirements/functional-requirements.md) or [non-functional-requirements.md](../01_Requirements/non-functional-requirements.md) explicitly enumerates accessibility (e.g., WCAG conformance) as a numbered FR/NFR.** [frontend-accessibility-and-testing.md](../10_Frontend_Implementation/frontend-accessibility-and-testing.md) addresses accessibility as engineering practice, but **this cannot be traced to a specific source requirement ID** — recorded here as a traceability gap, not silently backfilled with an invented ID.

## 17. Data Quality

| Requirement | Architecture/Design |
|---|---|
| FR-015 (validate ingested data) | [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md) |
| NFR-029 (schema/range validation prior to acceptance) | Same |
| NFR-030 (traceable source and ingestion timestamp) | [data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md) |

## 18. Requirements That Cannot Yet Be Fully Traced

| Requirement/Item | Gap |
|---|---|
| FR-033 (threshold notification) | No notification-delivery design exists in any milestone |
| Healthcare Demand forecasting | Abstract-referenced target with no confirmed architectural home (Section 10) |
| Recommendation weighted-scoring technique | No technology-stack entry exists (Section 12) |
| Accessibility (Section 16) | No traceable source requirement ID |

## 19. Milestone Traceability

Requirement-to-architecture traceability applies across every M1–M6 milestone as each requirement's owning capability becomes relevant — restated consistent with each cited document's own Milestone Traceability section.

## 20. Open Decisions

None introduced by this document — every gap identified in Section 18 is a documentation-completeness finding, not a technology decision.
