---
Document Name: Administrative Data Deep Validation
Document ID: ED-DVP-ADMIN-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Administrative Data Deep Validation

## 1. Purpose

This document deeply validates the strongest administrative-data candidate, building directly on the real file inspection already performed in [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md), since the same actually-opened file (`LGD_Districts.parquet`) carries both geometry and administrative identifier data.

## 2. Identifier Data vs. Geometry Data — Explicitly Distinguished

**Restated per this milestone's explicit instruction:** the fact that `LGD_Districts.parquet` was found to carry both a `dist_lgd` identifier field and a `geometry` field in the *same* file (per [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-002) does not mean identifier data and geometry data are the same thing, or that every future administrative-data candidate will co-locate them this conveniently. This document evaluates the *identifier and hierarchy* content specifically; [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) evaluates the *geometry* content — the same file happens to satisfy both, which is recorded as a positive finding, not assumed in advance.

## 3. Deep Validation

### VAL-M6-P3-004 — District-Level Identifiers (LGD Codes)

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-006, EV-M6-P2-004 |
| Question | Are district-level LGD identifiers actually present, unique, and non-null for Telangana in the actually-opened file? |
| Candidate | `LGD_Districts.parquet` (same file as [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-002) |
| Method | Directly inspected the `dist_lgd`, `state_lgd`, and `dtname` columns for all 33 Telangana-filtered rows using `pandas`' `.isnull()`, `.duplicated()`, and `.nunique()` methods |
| Environment | Python 3.14 + `pyarrow` + `pandas`, same session as boundary validation |
| Observation | `dist_lgd`: 33 unique, non-null integer values (observed range 501–721). `state_lgd`: constant value `36` for every Telangana row (consistent with a single state-level LGD code applying to the whole state). `dtname`: 33 unique, non-null string values, no duplicates |
| Expected | Either confirmation of clean, unique identifiers, or discovery of nulls/duplicates |
| Result | **PASS** — no null, no duplicate, for both the identifier field and the name field |
| Evidence | Directly computed boolean checks (`.isnull().any()` returned `False`, `.duplicated().any()` returned `False`), outputs recorded verbatim in the session transcript |
| Limitation | Only district-level identifiers were validated. Mandal- and village-level identifiers were **not** validated in this session — this specific file (`LGD_Districts.parquet`) is district-level only; a separate LGD mandal/village-level file would need to be located and independently opened |
| Decision impact | Partial closure at the district level only; mandal/village-level identifier validation remains open |

### VAL-M6-P3-005 — Mandal/Village-Level Identifiers

| Field | Detail |
|---|---|
| Evidence ID | EV-M6-P2-006, EV-M6-P2-007 |
| Question | Are mandal- and village-level LGD identifiers similarly available and validatable? |
| Candidate | `planemad/india-local-government-directory` (EV-M6-P2-007), or a mandal/village-level release of `india-geodata` |
| Method | Not attempted in this session — time and scope were prioritized toward the district-level hard gate |
| Environment | N/A |
| Observation | Not tested |
| Expected | N/A |
| Result | **NOT TESTED** |
| Evidence | N/A |
| Limitation | This is a genuine scope gap in this session, not an environment limitation — the same download-and-inspect method that succeeded for district-level data would very likely work equally well for mandal/village-level data, but was not attempted |
| Decision impact | No closure; recommended as a priority item for a future validation pass |

## 4. Naming Consistency and Duplicate Identifiers — Cross-Checked Against the Boundary Finding

Restated from [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-003: the SOI-sourced variant of the same release uses a **different** naming convention for the Warangal/Hanumakonda split than the LGD-sourced variant. This is a real, directly-observed **naming inconsistency between two source variants**, not a duplicate-identifier problem within either single file — each file internally has no duplicates, but the two files disagree with each other. This is recorded as evidence for [data-provenance-and-fragmentation-validation.md](data-provenance-and-fragmentation-validation.md), not as a defect in either individual file.

## 5. Temporal/Update Information

The `year_stat` field observed in `LGD_Districts.parquet` (values `'2019'` and `'2016_c'`, per [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-002) provides **some** genuine temporal/vintage signal at the row level — this was directly observed, not assumed. Whether this field reflects "year the district was created" or "year the geometry/record was last updated" was **not** independently confirmed (the file carries no separate documentation/README distinguishing these), and reading this as one or the other without more information is a plausible but not certain interpretation, explicitly flagged as such.

## 6. Relationship Consistency (District → Mandal → Village Hierarchy)

**Not validated in this session.** Only district-level records were opened; no mandal or village-level file was downloaded, so hierarchy relationship consistency (does every mandal correctly reference a valid district, does every village correctly reference a valid mandal) could not be tested. This is recorded as **NOT TESTED**, not as a negative finding.

## 7. No Field Names Inferred

Every field name reported in this document (`dist_lgd`, `state_lgd`, `dtname`, `year_stat`, etc.) was read directly from the actually-opened file's schema (`pyarrow.parquet.ParquetFile.schema_arrow`), never guessed or inferred from a webpage description.

## 8. Overall Finding

**District-level administrative identifiers: EVIDENCE AVAILABLE, PASS-level PoC result.** Mandal- and village-level identifiers, and cross-level hierarchy consistency: **NOT TESTED**, a genuine scope gap for a future validation pass, not a discovered limitation.

## 9. Security

No credential was required for any resource investigated.

## 10. Observability

Every check performed in this document is a directly-executed Python computation over the actually-downloaded file, with outputs recorded as observed.

## 11. Milestone Traceability

This validation supports Item 4.1 (Geographic domain, administrative sub-scope) of [evidence-acquisition-plan.md](../22_Evidence_Acquisition_and_Decision_Closure/evidence-acquisition-plan.md), first needed for M1.

## 12. Open Decisions

No administrative-data source is Confirmed. District-level identifiers from the LGD-sourced candidate are strongly evidenced; mandal/village-level validation remains a priority gap for ED-M6 Part 4.
