---
Document Name: Data Provenance and Fragmentation Validation
Document ID: ED-DVP-PROV-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Data Provenance and Fragmentation Validation

## 1. Purpose

This document concretely validates DistrictMind's fragmentation-resolution strategy (Source→Raw→Validation→Curated→Analytical→AI/ML-ready→Serving; and Fact→Derived→Prediction→Simulation→Recommendation→AI Response) against **real, directly-observed fragmentation instances** encountered during this milestone's other validation work — not hypothetical examples.

## 2. Real Fragmentation Instance 1 — Warangal vs. Hanumakonda Naming Divergence

Restated in full from [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) VAL-M6-P3-003:

| Source Variant | How It Represents the Warangal Area |
|---|---|
| `LGD_Districts.parquet` (LGD-sourced) | Two separate districts: `'Warangal'` (dist_lgd 522) and `'Hanumakonda'` (dist_lgd 686) |
| `SOI_Districts.parquet` (Survey of India-sourced) | Two separate districts: `'WARANGAL (RURAL)'` and `'WARANGAL (URBAN)'` |

**Both are real, directly-parsed records from the same aggregation project, differing in how they name and possibly delineate the same real-world geographic reorganization** (Warangal Urban's 2021 renaming to Hanumakonda). This is a genuine instance of the exact problem [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) is designed to address.

### VAL-M6-P3-022 — Applying the Fragmentation-Resolution Pattern to This Real Instance

| Stage | Applied to This Real Instance |
|---|---|
| Canonical schema | Both variants would map to DistrictMind's canonical District entity ([entity-catalog.md](../05_Database_Design/entity-catalog.md) Section 4) — a schema mapping step, not yet performed for real, but the target schema exists and is unambiguous |
| Identifiers | The LGD variant's `dist_lgd` numeric codes (522, 686) are the stronger, more defensible stable-identifier candidate — restated from [administrative-data-deep-validation.md](administrative-data-deep-validation.md) Section 4; the SOI variant's name-derived `District_C` field is weaker |
| Source precedence | **Not established here** — this document does not invent a precedence rule (LGD-over-SOI or vice versa); restated unchanged from [data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 5's requirement that precedence be evidence-based, not assumed. This real instance is exactly the kind of evidence that Section 5 requires before a rule can be finalized — it is now available, but a formal precedence decision is a separate, future step |
| Freshness | The LGD variant's inclusion of both `'2019'` and `'2016_c'` in its `year_stat` field is suggestive that it reflects a more recent administrative-reorganization awareness than a variant using only the older combined "Warangal (Rural/Urban)" split, but this is an inference, not a confirmed freshness timestamp comparison |
| Quality indicators | This divergence, now documented, is itself a quality flag DistrictMind's pipeline should carry forward if either source is ingested |
| Human review | Per the architecture, this conflict — which cannot be confidently resolved by precedence or freshness alone from what was directly observed — would be queued for Data Steward review, not silently resolved by this document |
| Uncertainty | Any DistrictMind Response referencing "Warangal district" would, per this pattern, need to disclose which variant's boundary definition it uses, until the conflict is formally resolved |

## 3. Real Fragmentation Instance 2 — Stale District Labels in the NIC Healthcare Dataset

Restated from [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) Section 4: the NIC-sourced national health facility dataset's `district` field uses the **old 10-district structure** (e.g., `'Warangal'` as a single large district) — a different, older administrative vintage than the boundary dataset's current 33-district structure. **This is a genuine, real cross-source temporal-fragmentation instance**, distinct from Instance 1's naming-divergence-within-current-structure — this is old-structure-vs-current-structure, a materially different kind of conflict.

### VAL-M6-P3-023 — Temporal Fragmentation Applied

| Stage | Applied to This Real Instance |
|---|---|
| Canonical schema | The NIC dataset's `district='Warangal'` (old, large) would need to be resolved to one or more of the *current* 33 districts (Warangal, Hanumakonda, Jangoan, Mahabubabad, etc. — all carved from the old Warangal) — this cannot be done by name-matching alone; it requires a spatial join (point-in-current-polygon), exactly the technique validated in [education-agriculture-deep-validation.md](education-agriculture-deep-validation.md) VAL-M6-P3-020 |
| Identifiers | The NIC dataset's `village_id` field (present on every record, per [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md) Section 4) is a potential bridge to the current administrative hierarchy, *if* it uses the same identifier scheme as the LGD village-level data — this alignment was **not verified** in this session (mandal/village-level LGD data was not opened, per [administrative-data-deep-validation.md](administrative-data-deep-validation.md) VAL-M6-P3-005) |
| Source precedence | Not applicable in the usual sense — this is not two sources disagreeing about a current fact, but one source using stale administrative units. The correct resolution is **re-derivation via spatial join against current boundaries**, not precedence-based selection between two "equally current" values |
| Provenance | The NIC dataset's own `source_id` and `layer` fields would need to be carried forward alongside a *newly computed* current-district assignment, with both the original (stale) label and the re-derived (current) label retained — restated unchanged from the "never silently discard" principle |

## 4. A Genuine Demonstration — Spatial Join as the Resolution Mechanism

**[education-agriculture-deep-validation.md](education-agriculture-deep-validation.md) VAL-M6-P3-020 already demonstrated, with real data, exactly the mechanism Section 3 above calls for**: taking a point dataset with no administrative attribute and correctly assigning it to a current district via point-in-polygon computation against the validated boundary. The same technique, applied to the NIC healthcare dataset's 658 Warangal-area records, would allow re-deriving which of the *current* 33 districts (not just the old, large Warangal) each facility actually falls within — **this specific re-derivation was not performed in this session** (time-scoped to the education-domain demonstration), but is recorded here as the concrete, evidenced next step.

## 5. Six-Category State Model — Not Collapsed

Every finding in this document remains classified within DistrictMind's six categories: the boundary geometry and NIC/OSM facility records are **Source of Truth** (once formally ACCEPTed); a future point-in-polygon re-derivation of current-district assignment would be **Derived**; no Prediction, Simulation, Recommendation, or AI Response was computed or claimed in this document.

## 6. Seven-Layer Data Flow — Applied Conceptually

| Layer | Status for the Real Datasets Investigated This Session |
|---|---|
| Source | External (LGD, SOI, NIC, HOTOSM, MoRTH) — real, identified |
| Raw | Would be the as-downloaded files (already captured in this session's scratchpad, outside the repository) |
| Validation | Partially performed in this session (structural checks — ring closure, null/duplicate checks) — **not** the full validation pipeline ([data-validation-implementation.md](../12_Data_GIS_Implementation/data-validation-implementation.md)) |
| Curated | **Not reached** — no formal ACCEPT decision has been made for any source |
| Analytical/AI-ML-ready/Serving | Not applicable — no Curated data exists yet to derive from |

**No dataset investigated in this milestone has been promoted to Curated.** This document's real findings remain evidence toward a future Curated promotion, not a claim that promotion has occurred.

## 7. No Conflicting Sources Silently Merged

**Restated per this milestone's explicit instruction:** Instance 1 (Warangal/Hanumakonda) and Instance 2 (stale district labels) are both documented with **both** sides of the disagreement preserved (Sections 2–3's tables), never resolved by silently picking one variant's value as if it were the only one.

## 8. Overall Finding

**Two genuine, real, directly-observed fragmentation instances were found and documented, both mapped concretely onto DistrictMind's existing fragmentation-resolution architecture without inventing a new mechanism or silently resolving either conflict.** This materially strengthens the case that the architecture (designed in the abstract across ED-M2/ED-M4) addresses real problems this program's own research has now actually encountered.

## 9. Security

No credential was required for any source investigated.

## 10. Observability

Both fragmentation instances trace directly to specific, dated, downloaded files already documented in [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md) and [healthcare-data-deep-validation.md](healthcare-data-deep-validation.md).

## 11. Milestone Traceability

This validation supports the fragmentation-resolution architecture broadly, first exercisable at M2 once real sources are formally accepted.

## 12. Open Decisions

No precedence rule is finalized for either fragmentation instance. No source is promoted to Curated. The spatial-join re-derivation technique demonstrated in [education-agriculture-deep-validation.md](education-agriculture-deep-validation.md) is recommended as the concrete resolution mechanism for Instance 2, pending a formal implementation.
