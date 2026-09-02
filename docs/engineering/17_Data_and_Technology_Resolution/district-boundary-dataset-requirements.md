---
Document Name: District Boundary Dataset Requirements
Document ID: ED-DTR-BOUNDARY-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# District Boundary Dataset Requirements

## 1. Purpose

This document defines exactly what the 33-district Telangana boundary dataset must provide — **DistrictMind's single most consequential unresolved data blocker** (restated from [implementation-blockers.md](../16_Engineering_Readiness_and_Baseline/implementation-blockers.md) Section 3). **No specific boundary dataset or provider is named.**

## 2. Why This Is Critical

Every M1 vertical slice depends on a renderable district map ([implementation-strategy.md](../08_Implementation_Foundation/implementation-strategy.md) Section 4's pilot-district approach). Without this dataset, no GIS feature, no dashboard, and no AI spatial query can be exercised against real data — restated unchanged from [spatial-data-implementation.md](../12_Data_GIS_Implementation/spatial-data-implementation.md) Section 13 and [milestone-readiness-matrix.md](../16_Engineering_Readiness_and_Baseline/milestone-readiness-matrix.md) Section 3.

## 3. Coverage Requirement

The dataset must provide geometry for **all 33 districts** of Telangana — a partial set (e.g., only the Warangal pilot district) is acceptable as an interim M1 vertical-slice input per the risk-first strategy (AD-IMP-001), but the full 33-district set remains required before M2's multi-district scope can proceed.

## 4. Valid Polygon Geometry

| Requirement | Detail |
|---|---|
| Geometry type | Polygon or MultiPolygon per district |
| Validity | No self-intersection, no degenerate geometry (restated from [gis-and-spatial-testing.md](../14_Testing_Security_Observability/gis-and-spatial-testing.md) Section 14) |
| Topology | Adjacent districts share boundary edges without gaps or overlaps |
| Nesting | Mandal geometry (if sourced separately) must nest cleanly within its District's geometry, and Village within Mandal — restated from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 3 |

## 5. District Identifiers

| Requirement | Detail |
|---|---|
| Stable identifier | Every district must carry a unique, stable identifier independent of its display name — this is the identifier `/districts/:id` resolves against (Section 11) |
| District names | Both the identifier and a human-readable name must be present; the name is a display attribute, never the canonical reference |
| Consistency | The identifier scheme must remain stable across dataset updates (Section 10) — a re-issued or renumbered identifier between versions is treated as a breaking change |

## 6. Coordinate Reference Information

The dataset must explicitly disclose its coordinate reference system — restated unchanged from [spatial-data-implementation.md](../12_Data_GIS_Implementation/spatial-data-implementation.md) and the CRS-discipline requirement in [engineering-quality-gates.md](../08_Implementation_Foundation/engineering-quality-gates.md) Gate 2. **No specific CRS/EPSG code is mandated here** — the requirement is that the dataset states its own CRS unambiguously, so DistrictMind's ingestion pipeline can apply consistent, disclosed handling rather than guessing.

## 7. Topology Expectations

Restated from Section 4 — the dataset should support (or be processable into) a topologically consistent representation where containment queries (a point/village falling within a district) and adjacency queries (which districts border which) produce correct, unambiguous results.

## 8. Geometry Validity

Restated from Section 4 — every polygon must pass structural validity checks before being admitted to Curated storage, consistent with [data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md).

## 9. Provenance

The dataset's own source, publishing authority, and any known limitations must be documented and carried into DistrictMind's provenance chain ([data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md)) — an undocumented or unattributed boundary file does not meet this requirement regardless of how visually plausible its geometry appears.

## 10. Versioning

Administrative boundaries occasionally change (district reorganization, boundary adjustment). The dataset must support versioning such that a boundary change is detectable and traceable — restated consistent with [model-lifecycle-implementation.md](../13_AI_Intelligence_Implementation/model-lifecycle-implementation.md) Section 3's versioning discipline, applied here to spatial reference data.

## 11. Licensing/Access

The dataset's license must permit: ingestion into DistrictMind's own storage, server-side computation against it, and re-serving simplified/derived geometry to the frontend for rendering — a license restricting redistribution would be incompatible with DistrictMind's render-oriented frontend delivery model (Section 14).

## 12. Update/Change Handling

Where the boundary source itself is updated (a corrected geometry, a reorganized district), the change must be ingestible through the same fragmentation-resolution and validation pipeline as any other data update ([data-fragmentation-resolution.md](data-fragmentation-resolution.md)) — a boundary dataset that cannot be re-ingested without a full manual rebuild does not meet this requirement.

## 13. Compatibility With Server-Side GIS Computation

The geometry must be usable by whichever GIS technology is eventually confirmed ([gis-technology-evaluation.md](gis-technology-evaluation.md)) for containment, buffer, and network-impact operations — restated unchanged from AD-FE-004's authoritative server-side computation requirement. This means the geometry must be precise enough to support meaningful spatial analysis, not merely visually adequate for display.

## 14. Compatibility With Frontend Rendering

The geometry must be simplifiable to the level-of-detail tiers already architected in [gis-implementation-architecture.md](../12_Data_GIS_Implementation/gis-implementation-architecture.md) Section 8 (AD-GIS-001) — a dataset whose geometry cannot be simplified without losing administrative accuracy at the district level would compromise the frontend's render-only responsiveness requirement.

## 15. The Canonical Routing Decision — Preserved Unchanged

**`/districts/:id` remains the canonical route, restated unchanged from AD-RES-001.** This document does not revert to `/district/:districtName`. The boundary dataset's stable identifier (Section 5) is precisely what this route resolves against — **the stable identifier is the canonical concept**, and any human-readable name remains, at most, a non-canonical alias per AD-RES-001's own terms.

## 16. Security

Boundary data, once sourced, is subject to the same authorization-scoped access as any other Curated data — restated unchanged from [networking-and-access.md](../15_Deployment_Infrastructure_Operations/networking-and-access.md) Section 4; no special exemption applies merely because it is geometry.

## 17. Observability

Once a boundary dataset is identified and evaluated, its onboarding is recorded as a Baseline Update per [technology-decision-gates.md](technology-decision-gates.md) Section 8, and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 2 is updated accordingly — not silently assumed resolved by this document.

## 18. Milestone Traceability

| Requirement | First Needed |
|---|---|
| Warangal pilot district geometry (interim, per AD-IMP-001) | M1 vertical slice |
| Full 33-district set | M2 |

## 19. Open Decisions — Explicitly Not Resolved

**No specific boundary dataset is named, evaluated, or selected by this document.** This remains **SOURCE UNRESOLVED**, restated unchanged from [spatial-data-implementation.md](../12_Data_GIS_Implementation/spatial-data-implementation.md) and [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 2. [geographic-data-evaluation.md](geographic-data-evaluation.md) defines how a candidate would be evaluated once identified.
