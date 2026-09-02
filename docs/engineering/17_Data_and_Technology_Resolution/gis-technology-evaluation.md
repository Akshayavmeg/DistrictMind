---
Document Name: GIS Technology Evaluation
Document ID: ED-DTR-GISEVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# GIS Technology Evaluation

## 1. Purpose

This document defines GIS technology selection criteria. **No GIS library, server, or database extension is selected.** Candidates discussed are only those already present in [technology-stack.md](../00_Engineering_Overview/technology-stack.md): PostGIS (Candidate), Leaflet (Candidate), Mapbox GL JS (Candidate), GeoServer (To Be Evaluated).

## 2. Existing Candidates — Status Restated Unchanged

| Technology | Layer | Status | Source | Stated Rationale |
|---|---|---|---|---|
| PostGIS | Spatial database extension | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.4 | Native spatial query support, integration with chosen DB |
| Leaflet | Frontend rendering library | Candidate | Same | Lightweight rendering, plugin ecosystem |
| Mapbox GL JS | Frontend rendering library | Candidate | Same | Rendering performance, styling flexibility, licensing cost |
| GeoServer | Spatial data serving layer | To Be Evaluated | Same | Standards compliance (WMS/WFS), operational complexity |

No status above is changed by this document. Note the same AD-DE-001/[technology-stack.md](../00_Engineering_Overview/technology-stack.md) status divergence for PostGIS as documented for PostgreSQL in [database-technology-evaluation.md](database-technology-evaluation.md) Section 2 — preserved, not reconciled.

## 3. Evaluation Dimensions Mapped to DistrictMind Scenarios

| Evaluation Dimension | Canonical Scenario |
|---|---|
| District polygon handling | Boundary rendering, containment |
| Roads | Network topology for accessibility |
| Healthcare coverage / 10 km spatial queries | Example A |
| Route/network analysis | Example B (bridge closure) |
| Bridge closure scenarios | Example B |
| Rainfall spatial impact | Example C |
| Spatial joins | Cross-domain data integration ([data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md)) |
| Geometry validation | [gis-and-spatial-testing.md](../14_Testing_Security_Observability/gis-and-spatial-testing.md) Section 14 |
| Level-of-detail handling | AD-GIS-001 |
| Coordinate transformations | [district-boundary-dataset-requirements.md](district-boundary-dataset-requirements.md) Section 6 |
| Server-side authoritative computation | AD-FE-004 |
| Frontend rendering integration | [frontend-gis-implementation.md](../10_Frontend_Implementation/frontend-gis-implementation.md) |
| Performance | [performance-and-responsiveness-testing.md](../14_Testing_Security_Observability/performance-and-responsiveness-testing.md) |
| Interoperability | GeoJSON/standard formats (NFR-027) |

## 4. Evaluation Matrix — Server-Side Computation Layer

| Dimension | PostGIS | GeoServer |
|---|---|---|
| 10 km coverage (buffer + containment, Example A) | To Be Evaluated | To Be Evaluated |
| Network analysis (Example B) | To Be Evaluated | To Be Evaluated |
| Spatial aggregation (Example C — rainfall) | To Be Evaluated | To Be Evaluated |
| Integration with chosen database | To Be Evaluated (depends on [database-technology-evaluation.md](database-technology-evaluation.md) outcome) | To Be Evaluated |
| Level-of-detail/simplification support (AD-GIS-001) | To Be Evaluated | To Be Evaluated |
| Operational complexity | To Be Evaluated | To Be Evaluated (explicitly flagged as a concern in its own [technology-stack.md](../00_Engineering_Overview/technology-stack.md) rationale) |

## 5. Evaluation Matrix — Frontend Rendering Layer

| Dimension | Leaflet | Mapbox GL JS |
|---|---|---|
| Rendering performance for large geometry (Section 16, [district-boundary-dataset-requirements.md](district-boundary-dataset-requirements.md)) | To Be Evaluated | To Be Evaluated |
| Styling flexibility (supports the Proposed visual direction, AD-RES-002) | To Be Evaluated | To Be Evaluated |
| Animation compatibility (AD-FE-006) | To Be Evaluated | To Be Evaluated |
| Licensing cost | To Be Evaluated (explicitly flagged as a Mapbox consideration in its own rationale) | To Be Evaluated |
| Plugin ecosystem | To Be Evaluated (explicitly flagged as a Leaflet strength in its own rationale) | To Be Evaluated |

**Every cell in both matrices reads "To Be Evaluated."**

## 6. Server-Side Authoritative Computation — Restated as the Governing Constraint

**Regardless of which GIS technology is eventually confirmed, authoritative spatial computation remains server-side.** Restated unchanged from AD-FE-004: a candidate frontend rendering library (Leaflet, Mapbox GL JS) is evaluated purely on rendering quality — it is never evaluated on, nor permitted to perform, coverage/accessibility/network-impact computation. A candidate server-side technology (PostGIS, GeoServer) is evaluated on correctness and performance of exactly those computations.

## 7. AD-GIS-001 Preserved

**Geometry payloads use level-of-detail scoping rather than generic pagination, restated unchanged from AD-GIS-001.** Any GIS technology evaluation weighs a candidate's support for extent/zoom-scoped requests as a first-class criterion, not an afterthought — a technology that only supports generic row-based pagination for geometry would require significant additional engineering to satisfy this decision.

## 8. Interoperability

Restated unchanged from NFR-027: GeoJSON or another standard, machine-readable format is the expected interchange format between the server-side computation layer and the frontend rendering layer, regardless of which specific technologies are eventually confirmed on either side.

## 9. Performance

Every GIS technology candidate is evaluated against the UI-must-not-freeze requirement ([performance-and-responsiveness-testing.md](../14_Testing_Security_Observability/performance-and-responsiveness-testing.md) Section 12) — a rendering library that blocks the main thread during large geometry load, or a server-side technology whose computation time for Example C's multi-stage spatial chain would force a synchronous, blocking API response, is evaluated as a poor fit pending further mitigation design (e.g., async execution, per [runtime-topology.md](../15_Deployment_Infrastructure_Operations/runtime-topology.md)).

## 10. Security

GIS technology evaluation includes whether the candidate supports the bounded operation set already contracted in [typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md) Section 8.2 (buffer, containment, accessibility, network impact) without exposing an unrestricted geometry-expression interface.

## 11. Observability

GIS technology evaluation includes whether the candidate's ecosystem provides mature computation-time and query-plan observability, consistent with [operational-monitoring.md](../15_Deployment_Infrastructure_Operations/operational-monitoring.md) Section 9.

## 12. Milestone Traceability

| GIS Decision | First Needed |
|---|---|
| Server-side spatial extension/engine | M1 (Gate 4 per [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md)) |
| Frontend rendering library | M1 (Gate 5) |

## 13. Open Decisions

**No GIS library, server, or database technology is selected by this document.** PostGIS, Leaflet, Mapbox GL JS, and GeoServer remain exactly as Candidate/To Be Evaluated as established in [technology-stack.md](../00_Engineering_Overview/technology-stack.md); AD-GIS-001 and every existing GIS boundary decision are preserved unchanged.
