---
Document Name: GIS Technology PoC
Document ID: ED-EPR-GISPOC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# GIS Technology PoC

## 1. Purpose

This document defines conceptual GIS PoCs, applying [proof-of-concept-framework.md](proof-of-concept-framework.md) to the dimensions established in [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md). **No GIS technology is selected. No PoC has been executed.**

## 2. Rendering Validation vs. Authoritative Spatial Computation Validation — Explicitly Separated

**These are two distinct PoC tracks, never merged into a single evidence set**, restated unchanged from AD-FE-004 and [gis-and-spatial-testing.md](../14_Testing_Security_Observability/gis-and-spatial-testing.md) Section 2.

| Track | Candidates Under Test | What Passes |
|---|---|---|
| Rendering validation | Leaflet, Mapbox GL JS (Candidate) | Correct, performant visual display of geometry the server already computed |
| Authoritative spatial computation validation | PostGIS, GeoServer (Candidate/To Be Evaluated) | Correct, server-side computation of buffer/containment/network/accessibility results |

## 3. Rendering Validation Scenarios

| Scenario | What It Tests |
|---|---|
| Polygon rendering | District/village boundaries render correctly at each level-of-detail tier (AD-GIS-001) |
| Level-of-detail behavior | A wide-extent (statewide) request renders coarser geometry; a district drill-down renders finer geometry, matching the architected tiers |
| Performance | Rendering remains responsive (NFR-035's Initial Target) during pan/zoom with the pilot district's full detail loaded |

## 4. Authoritative Spatial Computation Scenarios

| Scenario | What It Tests |
|---|---|
| Spatial joins | A Population Observation correctly resolves to its Village's geometry via stable identifier (restated from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 3) |
| 10 km coverage | Restated from [geographic-data-poc.md](geographic-data-poc.md) PoC 3 — buffer + containment correctness |
| Nearest/coverage analysis | `accessibility_analysis`-equivalent computation returns the correct nearest-facility result for fixture data |
| Road/network behavior | The routable graph correctly resolves shortest paths and correctly reflects topology (no false reachability across a disconnected segment) |
| Bridge closure | Restated from [geographic-data-poc.md](geographic-data-poc.md) PoC 4 — sandboxed network-impact recomputation |
| Rainfall impact | Restated from [geographic-data-poc.md](geographic-data-poc.md) PoC 5 — spatial aggregation and affected-area intersection |
| Geometry validation | Structural validity checks correctly reject a deliberately malformed test polygon |
| Coordinate transformation | A geometry ingested under one disclosed CRS is correctly transformed to DistrictMind's working CRS (itself unresolved pending database/GIS confirmation) with no distortion beyond documented tolerance |
| Level-of-detail behavior (computation side) | The server correctly serves pre-simplified geometry at the requested detail tier, rather than simplifying on every request |
| Performance | Computation completes without forcing a synchronous, blocking API response for the multi-stage Example C chain |

## 5. Server-Side Authoritative Computation — Preserved as a PoC Gate

**No rendering-track candidate is ever tested for, or credited with, spatial computation capability.** A rendering library's built-in geometric utility functions (if any) are explicitly out of scope for this PoC's evidence — restated unchanged from AD-FE-004: only the authoritative computation track's candidates are evaluated on Section 4's scenarios.

## 6. AD-GIS-001 — Preserved as a PoC Gate

**A candidate lacking support for extent/detail-level-scoped geometry requests fails the level-of-detail scenarios in Sections 3–4**, restated unchanged from AD-GIS-001 — generic row-based pagination is not an acceptable substitute for this evaluation.

## 7. Preconditions

- Fixture Village/Health Facility/Road/Weather data (synthetic, per [test-architecture.md](../14_Testing_Security_Observability/test-architecture.md) Section 5).
- A known, independently-computed expected result for each spatial computation scenario, so PoC output can be verified rather than merely observed.

## 8. Evidence Categories Addressed

| Category | How This PoC Addresses It |
|---|---|
| Functional | Every scenario in Sections 3–4 |
| Spatial | Geometry validity, coordinate transformation, buffer/containment/network accuracy |
| Technical | Integration between rendering and computation tracks via standard interchange format (GeoJSON, NFR-027) |
| Performance | Rendering responsiveness, computation non-blocking behavior |

## 9. Expected Behavior

Every computation scenario's output exactly matches its independently verified expected result for the fixture data; every rendering scenario remains responsive per NFR-035's Initial Target.

## 10. Result Categories

Restated unchanged from [proof-of-concept-framework.md](proof-of-concept-framework.md) Section 13.

## 11. No GIS Technology Selected

**This document does not select PostGIS, Leaflet, Mapbox GL JS, GeoServer, or any other GIS technology.** It defines what a future PoC against any candidate would need to test, on whichever track (rendering or computation) it belongs to.

## 12. Security

The authoritative computation track's PoC explicitly verifies no unrestricted geometry-expression interface is exposed — restated unchanged from [typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md) Section 8.2's bounded operation set.

## 13. Observability

This PoC's outcome, once actually run, is recorded via [decision-evidence-record.md](decision-evidence-record.md).

## 14. Milestone Traceability

| PoC Scenario | First Needed |
|---|---|
| Polygon rendering, spatial joins, coverage | M1–M2 |
| Network/bridge closure | M5 |
| Rainfall impact | M2 (data), M4–M5 (prediction/scenario) |

## 15. Open Decisions

No GIS technology is selected. The candidate lists remain exactly as established in [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md) Section 2.
