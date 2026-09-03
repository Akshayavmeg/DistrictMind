---
Document Name: Boundary Dataset Decision
Document ID: ED-DCB-BOUNDARY-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Boundary Dataset Decision

## 1. Purpose

This is DistrictMind's single most consequential data decision (restated from [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md) Section 1), addressing [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 2 and readiness gates [RG-DATA-002](../20_Implementation_Unlock_and_Governance/data-readiness-gates.md) / [RG-GIS-001](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md), using the real evidence gathered in [boundary-dataset-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/boundary-dataset-deep-validation.md).

## 2. Candidates Compared

| Candidate | Evidence ID | Validation ID | Coverage Found | Result |
|---|---|---|---|---|
| A — `gggodhwani/telangana_boundaries` (`districts.json`) | EV-M6-P2-* (Part 2), re-verified Part 3 | VAL-M6-P3-001 | **10 districts** (pre-2016 structure) | **FAIL** |
| B — `LGD_Districts.parquet` (`yashveeeeeeer/india-geodata`, LGD-sourced) | EV-M6-P3 boundary download | VAL-M6-P3-002 | **33 districts**, unique `dist_lgd` identifiers | **PASS** |
| C — `SOI_Districts.parquet` (same aggregator, SOI-sourced) | Same | VAL-M6-P3-003 | 33 districts, name-derived identifiers, naming divergence from B | **PARTIAL** |
| Older community GeoJSON referenced in Part 1/2 planning | EV-M6-P2-* | Not independently re-opened in Part 3 beyond Candidate A | Not directly re-verified this session | Not separately assessed — Candidate A is the closest re-verified analog |

## 3. Why Candidate B Is Materially Stronger

| Dimension | Candidate A | Candidate B (LGD) | Candidate C (SOI) |
|---|---|---|---|
| District count | 10 (fails current-structure requirement outright) | 33 (matches current structure) | 33 (matches current structure) |
| Identifier type | `D_N`/`D_C` (name/code, pre-reorganization) | `dist_lgd` — numeric, government-registry-issued, unique, non-null for all 33 | `District_C` — appears name-derived, weaker |
| Naming currency | Pre-2016 (10-district era) | Includes post-2021 names (e.g., Hanumakonda) | Uses combined "Warangal (Rural/Urban)" form, an older naming convention than B |
| Geometry | 90,213 points, all rings closed | 624–6,076 points/district, all rings closed, WKB-parsed and validated structurally | Not independently point-parsed in the same depth |
| Cross-validation | — | Bounding box near-identical to Candidate C's independently computed bbox (lon/lat within ~0.01–0.02°) | Cross-validates B's bbox |

**Candidate B is the stronger candidate specifically because its identifier scheme (`dist_lgd`) is numeric, government-registry-issued, and stable — the exact property [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md) Section 5 requires for `/districts/:id` compatibility — while Candidate C's name-derived identifier is materially weaker for that specific purpose**, even though both candidates pass the coarser 33-district coverage test.

## 4. Gate-by-Gate Assessment Against [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md)

| Gate (Section in that document) | Requirement | Candidate B Status |
|---|---|---|
| §3 Coverage | All 33 districts | **MET** — VAL-M6-P3-002 |
| §4 Valid polygon geometry | No self-intersection/degenerate geometry; adjacent districts share edges without gaps/overlaps | **PARTIALLY MET** — rings confirmed closed via a from-scratch WKB parser (structural check only); full OGC self-intersection/degeneracy validity checking was **not performed** (no `shapely`/GEOS available this session, per [backend-database-gis-poc.md](../24_Evidence_Deep_Validation_and_PoC/backend-database-gis-poc.md)); topology/adjacency (shared-edge) checking was **not performed at all** |
| §5 District identifiers | Stable, unique identifier distinct from display name | **MET** — `dist_lgd`, unique and non-null across all 33 rows, distinct from the `dtname` display field |
| §6 CRS disclosure | Dataset states its own CRS unambiguously | **PARTIALLY MET** — the file's GeoParquet `geo` metadata does not declare an explicit CRS field; per the GeoParquet 2.0 spec this defaults to OGC:CRS84, which is an inference from the format's own default, not an explicit in-file declaration |
| §7 Topology | Containment/adjacency queries produce correct results | **NOT TESTED** — only point-in-polygon containment was exercised (healthcare/education PoCs); adjacency was never tested |
| §8 Geometry validity | Passes structural validity before Curated admission | **PARTIALLY MET** — see §4 row above |
| §9 Provenance | Source, publishing authority, and limitations documented | **PARTIALLY MET** — the file is attributed to LGD (Ministry of Panchayati Raj) *by* the `yashveeeeeeer/india-geodata` aggregator's release notes, but this session did **not** independently verify the aggregator's own claim against the LGD's own primary publication — restated per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md) Section 3's explicit warning that "available online" from an aggregator is not, by itself, "authoritative" |
| §11 Licensing/Access | License permits ingestion, server-side computation, and re-serving derived geometry to the frontend | **NOT VERIFIED** — no license terms for this specific release were reviewed in Part 2 or Part 3 |
| §10 Versioning | Boundary changes are detectable/traceable | **SUGGESTIVE ONLY** — the `year_stat` field (values including `'2019'`/`'2016_c'`) hints at a versioning concept but was not confirmed as a formal, documented versioning mechanism |
| §13 Server-side GIS computation compatibility | Geometry usable for containment/buffer/network-impact operations | **MET IN PRINCIPLE** — real point-in-polygon and distance computations were successfully executed against this exact geometry (VAL-M6-P3-007, VAL-M6-P3-020) |
| §14 Frontend rendering/LOD compatibility | Geometry simplifiable to the architected LOD tiers | **NOT TESTED** — no browser/rendering environment was available this session ([frontend-technology-poc.md](../24_Evidence_Deep_Validation_and_PoC/frontend-technology-poc.md)); only the raw point-count figures (624–6,076/district) are now known |
| §15 `/districts/:id` compatibility | Stable identifier is what the canonical route resolves against | **MET IN PRINCIPLE** — `dist_lgd` is exactly the kind of stable identifier AD-RES-001's route requires; no actual route/API exists to test against |

## 5. Decision Evidence Record — Candidate B (`LGD_Districts.parquet`)

| Field | Detail |
|---|---|
| Candidate | `LGD_Districts.parquet`, `yashveeeeeeer/india-geodata`, release `admin/districts` |
| Category | Boundary dataset (Geographic domain) |
| Requirements | [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md) Sections 3–15; AD-RES-001 |
| Source evidence | GitHub Releases API metadata (asset name, exact byte size, publish date), release notes attributing origin to LGD |
| PoC evidence | Real download (22,178,335 bytes, byte-exact match), real `pyarrow` parse, real from-scratch WKB geometry parse, real point-in-polygon and haversine PoCs in two independent downstream files |
| Observations | 33 unique Telangana rows; unique non-null `dist_lgd`; consistent `state_lgd`=36; ring-closed polygons; bbox cross-validated against an independent source variant |
| Limitations | Full OGC geometry validity, topology/adjacency, explicit CRS declaration, licensing, and direct-primary-source provenance verification all remain unperformed (Section 4 above) |
| Risks | An aggregator-sourced file could silently diverge from LGD's own primary publication; this has not been ruled out |
| Dependencies | None blocking within this domain; GIS technology decision (RG-TECH-004) will determine how this geometry is eventually stored/served |
| Result | **PASS** (VAL-M6-P3-002), the strongest boundary-dataset PoC result obtained anywhere in this program to date |
| Recommendation | **Proceed to formal Decision Review**, with the five unmet gates in Section 4 (geometry validity/topology, CRS, provenance, licensing) named as explicit pre-Baseline conditions, not waived |
| Status | **RECOMMENDED — PENDING FORMAL APPROVAL** (not Selected outright; not Confirmed) |
| Decision ID | None — no new `AD-*` drafted this milestone; a future decision, if drafted, would be a `AD-DTR-*` or `AD-GIS-*`-class boundary-dataset decision, not yet created |
| Affected milestones | M1 (interim Warangal-pilot use), M2 (full 33-district scope) |
| Affected documents | [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md), [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 2, [RG-DATA-002](../20_Implementation_Unlock_and_Governance/data-readiness-gates.md), [RG-GIS-001](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md) |
| Reviewer concept | GIS Data Steward (per [readiness-gate-framework.md](../20_Implementation_Unlock_and_Governance/readiness-gate-framework.md)) |
| Date/version concept | Evaluated 2026-09-02 (ED-M6 Part 3), recommendation drafted 2026-09-03 (ED-M6 Part 4) |

## 6. Why Not "Selected" Outright

Per [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md) Section 6, a decision remains provisional whenever a named dependency or unmitigated risk remains. **Licensing is entirely unverified** — a real, potentially blocking gate per [data-source-decision-record-standard.md](../19_Decision_Records_and_Baseline/data-source-decision-record-standard.md) Section 5 and [RG-DATA-006](../20_Implementation_Unlock_and_Governance/data-readiness-gates.md)'s CRITICAL severity. Full OGC geometry validity and topology checking are also unperformed, and [RG-GIS-002](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md)/[RG-GIS-003](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md) explicitly require these before their own Pass condition is met. **This document therefore does not mark Candidate B Selected or Confirmed** — it marks it RECOMMENDED — PENDING FORMAL APPROVAL, the strongest status this milestone's evidence genuinely supports.

## 7. Effect on the Unresolved Items Register

[unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) Item 2's issue statement — "No confirmed Telangana district/mandal boundary geometry source" — remains technically accurate (nothing is confirmed), but its *evidentiary state* has changed materially: from "no candidate has even been identified" (the state Item 2, [RG-DATA-002](../20_Implementation_Unlock_and_Governance/data-readiness-gates.md), and [RG-GIS-001](../20_Implementation_Unlock_and_Governance/ai-and-gis-readiness-gates.md) all previously recorded) to "a specific, strong candidate has been identified, downloaded, and structurally validated, with five named gates remaining before formal approval." This distinction is carried forward explicitly in [implementation-readiness-reassessment.md](implementation-readiness-reassessment.md) — it is not treated as resolving Item 2.

## 8. Mandal/Village-Level Geometry — Explicitly Out of Scope Here

This decision addresses **district-level** boundaries only. Mandal- and village-level geometry (referenced in [district-boundary-dataset-requirements.md](../17_Data_and_Technology_Resolution/district-boundary-dataset-requirements.md) Section 4's nesting requirement) was not opened or evaluated in Part 3 ([administrative-data-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/administrative-data-deep-validation.md) VAL-M6-P3-005) and remains fully unresolved — restated in [administrative-data-decision.md](administrative-data-decision.md).

## 9. Security

No credential was required for any candidate investigated. Licensing verification (Section 6) is itself a security/compliance-adjacent gate, not merely a data-quality one.

## 10. Observability

Every claim in this document traces to [boundary-dataset-deep-validation.md](../24_Evidence_Deep_Validation_and_PoC/boundary-dataset-deep-validation.md)'s VAL-M6-P3-001/002/003 records — no new computation was performed in this file.

## 11. Milestone Traceability

This decision is the single highest-priority item for M1's GIS readiness dimension ([milestone-readiness-matrix.md](../16_Engineering_Readiness_and_Baseline/milestone-readiness-matrix.md) Section 3).

## 12. Open Decisions

**No boundary dataset is Confirmed, Selected, or formally Baselined by this document.** Candidate B is RECOMMENDED — PENDING FORMAL APPROVAL, with five explicit, unmet gates (full geometry validity/topology, explicit CRS, direct-primary-source provenance, licensing) named as the concrete next steps for a future Decision Review.
