---
Document Name: GIS Decision Record Standard
Document ID: ED-DRB-GISSTD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# GIS Decision Record Standard

## 1. Purpose

This document defines the decision record standard for GIS technology and geographic datasets, specializing [architecture-decision-record-standard.md](architecture-decision-record-standard.md) for the domain covered by [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md) and [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md). **No GIS technology or dataset is selected. No benchmark is inserted.**

## 2. Two Record Sub-Types

Restated unchanged from [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md) Section 6 and [gis-technology-poc.md](../18_Evidence_and_PoC_Resolution/gis-technology-poc.md) Section 2 — a GIS decision record is either:

| Sub-Type | Covers |
|---|---|
| GIS technology record | Server-side spatial engine (PostGIS, GeoServer) or frontend rendering library (Leaflet, Mapbox GL JS) |
| Geographic dataset record | Uses [data-source-decision-record-standard.md](data-source-decision-record-standard.md) as its base, extended with the GIS-specific fields below |

## 3. The Standard Structure

| Field | Detail |
|---|---|
| GIS requirement | Which specific requirement this record addresses (rendering, containment, buffer, network analysis, coverage) |
| Dataset (if applicable) | The specific geographic dataset under decision, per [data-source-decision-record-standard.md](data-source-decision-record-standard.md) |
| Geometry | Structural validity findings (self-intersection, degenerate shapes) |
| CRS | The disclosed coordinate reference system and transformation compatibility |
| Topology | Adjacency/containment consistency findings |
| Spatial operations | Which operations (buffer, containment, network-impact, accessibility) were validated, and against what fixture |
| Performance evidence | Qualitative findings only — no invented latency number, per [performance-and-reliability-validation.md](../18_Evidence_and_PoC_Resolution/performance-and-reliability-validation.md) |
| Rendering | Findings specific to the frontend rendering track, if this record covers a rendering candidate |
| Server-side computation | Findings specific to the authoritative computation track, if this record covers a computation candidate — **never conflated with the Rendering field** |
| Interoperability | Findings on standard-format (GeoJSON, NFR-027) compatibility |
| Versioning | How updates to this technology/dataset would be detected and incorporated |
| Limitations | What this record's evidence does not cover |
| Decision | The proposed outcome, per [technology-decision-record-standard.md](technology-decision-record-standard.md) Section 2's Status vocabulary |

## 4. Frontend Rendering ≠ Authoritative GIS Computation — Preserved as a Record-Level Separation

**A single decision record never covers both a rendering candidate and a computation candidate as if they were one decision.** Restated unchanged from AD-FE-004: Leaflet/Mapbox GL JS records address only Rendering (Section 3); PostGIS/GeoServer records address only Server-side computation (Section 3). This separation is enforced at the record-template level, not merely as evaluation guidance, precisely because conflating the two would risk the architectural error this program has consistently guarded against.

## 5. Boundary Dataset Records — Special Requirements

A boundary dataset decision record additionally requires evidence against every one of the 14 checks in [boundary-dataset-validation-plan.md](../18_Evidence_and_PoC_Resolution/boundary-dataset-validation-plan.md) Section 2, and cannot reach ACCEPT (as a Decision outcome, using [data-source-decision-record-standard.md](data-source-decision-record-standard.md)'s vocabulary) without the six evidence types listed in that document's Section 3 — restated unchanged given this dataset's CRITICAL blocker status.

## 6. AD-GIS-001 — Preserved as a Record-Level Constraint

Every GIS technology record's Spatial operations field must explicitly confirm the candidate supports extent/detail-level-scoped requests (AD-GIS-001) — a candidate lacking this support does not reach a favorable Decision regardless of other strengths, restated unchanged from [gis-technology-evaluation.md](../17_Data_and_Technology_Resolution/gis-technology-evaluation.md) Section 7.

## 7. No Technology or Dataset Selected

**This document selects no GIS library, server, database extension, or geographic dataset.** It defines the record structure a future, actually-executed GIS decision process would populate.

## 8. Security

The Spatial operations field (Section 3) explicitly requires confirming no unrestricted geometry-expression interface is exposed, restated unchanged from [typed-tool-implementation.md](../13_AI_Intelligence_Implementation/typed-tool-implementation.md) Section 8.2.

## 9. Observability

Every completed record feeds [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and, for datasets, [data-baseline-management.md](data-baseline-management.md).

## 10. Milestone Traceability

| Record Type | First Needed |
|---|---|
| Boundary dataset | M1 (CRITICAL) |
| Server-side GIS technology | M1–M2 |
| Frontend rendering technology | M1 |

## 11. Open Decisions

None introduced — this document defines a record template; no GIS technology or dataset has an actual completed record as a result of this milestone.
