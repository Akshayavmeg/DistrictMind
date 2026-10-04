---
Document Name: Data Engineering Stack
Document ID: DM-TB-07
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Data Engineering Stack

Written for: engineers preparing data for development, and the Data Steward reviewer.

## 1. Pipeline

Source → Raw → Validation → Curated → Analytical → AI/ML-ready → Serving

Development ingestion is **batch-based** (AD-DE-003). ELT is preferred over ETL (AD-DE-002). No streaming is introduced.

## 2. Stack

| Component | Status | Role |
|---|---|---|
| Python | SELECTED FOR DEVELOPMENT | Ingestion and transformation |
| pandas | SELECTED FOR DEVELOPMENT (Proposed in [technology-stack.md](../engineering/00_Engineering_Overview/technology-stack.md) §4.8) | Tabular cleaning |
| pyarrow | Used only for read-only inspection in ED-M6 Part 3; **not a DistrictMind application dependency** unless a later decision adds it | GeoParquet inspection |
| Apache Airflow, dbt | DEFERRED | Not needed at development scale |
| GeoPandas, Shapely, OSMnx | Candidate in [development-environment.md](../engineering/08_Implementation_Foundation/development-environment.md) §11; **not selected**. shapely/GEOS was unavailable in ED-M6 Part 3 | Not part of this baseline |

## 3. Development Data Policy

1. **No fake production pipelines.** Development ingestion runs as explicit scripts that load a named file.
2. **Development data is clearly labeled** as development or test data. Synthetic data carries the label `SYNTHETIC DEVELOPMENT DATA — NOT REAL DISTRICTMIND EVIDENCE`, following the ED-M6 Part 3 convention.
3. **Real production data is never used** in development ([environment-management.md](../engineering/08_Implementation_Foundation/environment-management.md), AD-IMP-003).
4. **Every imported dataset** keeps: source, source URL or reference, retrieval date, dataset version (if available), license/provenance, geographic scope, temporal scope, and validation status.

## 4. The Boundary Data Question (D-9) — Stated Honestly

| Fact | Source |
|---|---|
| The strongest boundary candidate is the LGD 33-district dataset, a PASS at the structural-validation level | VAL-M6-P3-002 |
| Its status is RECOMMENDED — PENDING FORMAL APPROVAL, not approved | [boundary-dataset-decision.md](../engineering/25_Decision_Closure_and_Baseline_Promotion/boundary-dataset-decision.md) |
| The brief forbids using it before licensing checks | This brief, Section 8 |
| **The aggregator repository (`yashveeeeeeer/india-geodata`) reports no detectable license** (GitHub license field: NOASSERTION, checked 2026-10-04) | Read-only GitHub API check |
| Upstream terms (the LGD publication itself) have not been verified | Not checked |

**Consequence:** the licensing gate is **not met**. The repository's undetected license makes the question more urgent, not less. The LGD data is therefore not used for the first slice.

**Options for the human reviewer** (one must be chosen before the first slice reaches Gate 5):

- **Option A (recommended):** verify the upstream LGD publication's terms directly, and record the result in the boundary decision record. Use the data only after that record exists.
- **Option B:** use a clearly labeled synthetic development geometry, with 33 placeholder cells that carry the synthetic label and are **never** presented as Telangana geography or as the boundary candidate. This tests the pipeline only.
- **Option C:** do not render districts; test the API and dashboard against fixture records only.

This baseline does not choose among them. Until the human chooses, the first slice cannot honestly claim Gate 5 or Gate 6.

## 5. Source Metadata Record (Required Fields)

| Field | Required |
|---|---|
| Source and publisher | Yes |
| Source URL or reference | Yes |
| Retrieval date | Yes |
| Dataset version | If available |
| License or provenance status | Yes; "undetected" must be stated as such |
| Geographic scope | Yes |
| Temporal scope | Yes |
| Validation status | Yes |

## 6. Known Data-Quality Facts Carried Forward

- NIC healthcare: 54% exact duplication and stale district labels (ED-M6 Part 3). Remediation required before any count or capacity claim.
- Warangal/Hanumakonda naming divergence between LGD and SOI variants (no precedence rule finalized).
- MoRTH highways cover National Highways only; local road networks and bridges are not covered.

## 7. Not Selected

Airflow, dbt, Kafka, streaming ingestion, distributed processing. Not needed for the development dataset sizes documented so far.

## 8. Security

No source credential is committed. Keys for IMD and data.gov.in, if obtained, come from environment variables. Registration is a human action, not an engineering one.

## 9. Open Decisions

Boundary licensing (Option A, B, or C above); source-precedence rule (Item 25); mandal and village identifiers; dataset-deprecation process (Item 24); IMD and data.gov.in API keys.
