---
Document Name: Data Source Decision Record Standard
Document ID: ED-DRB-DATASTD-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Data Source Decision Record Standard

## 1. Purpose

This document defines the standard record for accepting or rejecting a candidate data source, specializing [architecture-decision-record-standard.md](architecture-decision-record-standard.md) and formalizing [data-source-validation-plan.md](../18_Evidence_and_PoC_Resolution/data-source-validation-plan.md) into a decision-record structure. **No actual data source is named, evaluated, or accepted by this document.**

## 2. The Standard Structure

| Field | Detail |
|---|---|
| Source identity | The exact publisher/provider and specific dataset/product name and version under decision |
| Domain | Geographic, demographic, healthcare, transportation, agriculture, weather/environment, disaster, or infrastructure (per [data-source-requirements.md](../17_Data_and_Technology_Resolution/data-source-requirements.md)) |
| Authority evidence | Documented basis for treating this source as authoritative (or explicitly secondary/aggregated) for this domain |
| Provenance | The source's own documented origin and chain of custody |
| Spatial coverage | Confirmed geographic extent of the data |
| Temporal coverage | Confirmed time range and historical depth |
| Freshness | The source's disclosed update cadence, and how current the specific version under decision is |
| Schema | The source's native schema, and its mapping to DistrictMind's canonical schema ([data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md) Section 3) |
| Identifiers | Whether the source provides stable identifiers, or requires reconciliation against DistrictMind's own identifier scheme |
| Quality | Findings on completeness, consistency, and duplicate/outlier presence |
| Licensing | The specific license terms and whether they permit DistrictMind's intended ingestion, storage, computation, and display |
| Accessibility | How DistrictMind would actually obtain this data, and whether that process is documented and repeatable |
| Reproducibility | Whether querying/extracting the same data twice yields a consistent result |
| Validation evidence | Reference to the specific validation run against [data-source-validation-plan.md](../18_Evidence_and_PoC_Resolution/data-source-validation-plan.md)'s checklist |
| Limitations | What this source does not provide, or provides only partially |
| Decision | ACCEPT / REJECT / CONDITIONAL ACCEPTANCE / MORE EVIDENCE REQUIRED, per [data-source-validation-plan.md](../18_Evidence_and_PoC_Resolution/data-source-validation-plan.md) Section 2 |
| Status | Candidate / Under Evaluation / Selected / Confirmed / Rejected / Deprecated |
| Version | The specific dataset version this record evaluates — a future update to the same source requires a new or amended record, not a silent assumption of continued validity |

## 3. "Available Online" Is Not "Authoritative" — Explicit Statement

**A dataset being freely accessible on the internet does not, by itself, establish Authority, Provenance, or Quality.** This is stated explicitly because it is a common and dangerous shortcut: a well-formatted, easily discoverable file may originate from an unattributed aggregator, may be stale, or may silently diverge from the actual authoritative source it claims to represent. Every Authority evidence field in a real future record must trace the data back to a genuinely responsible publishing body — restated consistent with [data-source-evaluation-framework.md](../17_Data_and_Technology_Resolution/data-source-evaluation-framework.md) Section 2's Authority dimension and [data-source-validation-plan.md](../18_Evidence_and_PoC_Resolution/data-source-validation-plan.md) Section 4's non-negotiable provenance check.

## 4. Relationship to Data Fragmentation

Where a domain has multiple candidate sources under simultaneous decision, each source receives its own independent record — the fragmentation-resolution precedence question ([data-fragmentation-resolution.md](../17_Data_and_Technology_Resolution/data-fragmentation-resolution.md)) is addressed only after individual sources have each reached their own ACCEPT/CONDITIONAL ACCEPTANCE decision, never conflated into a single multi-source record.

## 5. Sensitive Data Handling

For domains touching Potentially Sensitive classification (Demographic, Healthcare — restated from [data-governance.md](../04_Data_Engineering/data-governance.md) Section 3), the record's Licensing field must explicitly confirm the license permits DistrictMind's derived computation (e.g., population-weighted coverage-gap scoring) without violating any privacy constraint — a source lacking this confirmation cannot reach ACCEPT regardless of its other strengths.

## 6. No Provider Named

**This document names no real provider, agency, or dataset for any domain.** It defines the record structure a future, actually-executed source evaluation would populate.

## 7. Security

Licensing and Accessibility fields (Section 2) explicitly verify ingestion credentials can be scoped per least-privilege, restated unchanged from [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 9.

## 8. Observability

Every completed record feeds [decision-register-baseline.md](../16_Engineering_Readiness_and_Baseline/decision-register-baseline.md) and, once ACCEPTed, [data-baseline-management.md](data-baseline-management.md)'s data baseline.

## 9. Milestone Traceability

| Domain | First Needed |
|---|---|
| Geographic | M1 |
| All other domains | M2 |

## 10. Open Decisions

None introduced — this document defines a record template; no data source has an actual completed record as a result of this milestone. Every domain remains SOURCE UNRESOLVED.
