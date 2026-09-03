---
Document Name: Deep Validation Strategy
Document ID: ED-DVP-STRAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Deep Validation Strategy

## 1. Purpose

This document defines the strategy and method for ED-M6 Part 3's deep validation and PoC execution work. It also discloses, honestly and specifically, what this session's environment could and could not do — a material change from ED-M6 Part 2, where no file-download-and-inspect capability was available.

## 2. What Changed Since ED-M6 Part 2

[evidence-acquisition-execution.md](../23_Evidence_Acquisition_and_Validation/evidence-acquisition-execution.md) Section 4 recorded a capability limitation: "no capability to download, open, or programmatically inspect a binary geospatial file." **This session tested that limitation directly and found it does not fully apply here.** A live network-connectivity check confirmed the Bash tool has genuine outbound internet access, and Python 3.14 with `pandas` is available. `pyarrow` (a read-only, standard, widely-used library for reading Apache Parquet/GeoParquet files) was installed for this session specifically to open and inspect downloaded files — **no application dependency was added to DistrictMind's own codebase; this is a local, temporary inspection tool used only in this session's scratchpad, never committed to the repository.**

## 3. Method

```mermaid
flowchart LR
    Candidate[Candidate from ED-M6 Part 2] --> Download[Attempt Real Download via curl]
    Download --> Parse[Attempt Real Parse via Python]
    Parse --> Inspect[Inspect Actual Structure/Content]
    Inspect --> Record[Record Genuine Findings as VAL-M6-P3-XXX]
```

Every validation in this folder follows: **Evidence → Validation → Observation → Result → Limitation → Decision impact**, restated per this milestone's explicit instruction, never jumping directly from Evidence to Decision.

## 4. Environment Capability — Precisely Stated

| Capability | Available This Session? |
|---|---|
| Outbound internet access via Bash (`curl`) | **Yes — confirmed** |
| JSON/GeoJSON parsing (Python stdlib `json`) | **Yes** |
| Parquet/GeoParquet parsing (`pyarrow`, installed this session) | **Yes** |
| WKB (Well-Known Binary) geometry parsing | **Yes — implemented manually via Python `struct`, since `shapely` is not installed and was not installed (to keep the inspection footprint minimal)** |
| 7-Zip archive extraction (`.7z` files) | **No** — no `7z`/`p7zip` binary and no `py7zr` Python package available; not installed for this session |
| Live REST API calls | **Yes** |
| Live Overpass API (OpenStreetMap) queries | **Yes, subject to the public server's rate limits** — encountered and honestly reported where hit |
| Full OGC-standard geometry validity checking (self-intersection, ring orientation per ISO 19107) | **No** — no `shapely`/GEOS available; validity checks performed in this milestone are limited to ring closure, point-count sanity, and bounding-box plausibility, which are necessary but not sufficient conditions for full geometric validity |
| Production application code execution | **Not attempted — out of scope, restated unchanged from this milestone's Absolute Rules** |

## 5. Temporary Files — Not Committed

All downloaded files (GeoJSON, Parquet, Overpass API JSON responses) were saved to this session's scratchpad directory (`C:\Users\aksha\AppData\Local\Temp\claude\...\scratchpad\ed-m6-p3\`), **outside the documentation repository**, consistent with this milestone's Section 3 instruction. No downloaded binary or data file is copied into `docs/engineering/`. Only the *findings* from inspecting them are recorded here, as text.

## 6. Evidence Status Vocabulary — Restated Unchanged

EVIDENCE AVAILABLE / EVIDENCE PARTIALLY AVAILABLE / EVIDENCE NOT AVAILABLE / EXTERNAL EVIDENCE REQUIRED (for data), and NOT TESTED / TESTABLE / TEST EXECUTED / PASS / PARTIAL / FAIL / BLOCKED (for PoCs) are used exactly as defined in this milestone's brief. **"Confirmed" is never applied to any technology or dataset in this folder** — a successful PoC is evidence toward a future Decision, never the Decision itself, restated unchanged from [decision-approval-and-status.md](../19_Decision_Records_and_Baseline/decision-approval-and-status.md).

## 7. Validation ID Namespace

This folder introduces `VAL-M6-P3-XXX` identifiers, verified via repository-wide search to collide with nothing existing. Every validation record cites the specific `EV-M6-P2-XXX` (or, where genuinely new evidence was gathered beyond what Part 2 found, a newly numbered `EV-M6-P3-XXX`) evidence record it builds on.

## 8. Directories Confirmed Present

Per this milestone's Section 2 instruction: `17_`, `18_`, `19_`, `20_`, `22_`, `23_` are all confirmed present and were read. **`21_Final_Engineering_Baseline/` does not exist**, restated unchanged from [evidence-acquisition-execution.md](../23_Evidence_Acquisition_and_Validation/evidence-acquisition-execution.md) Section 2 — this gap is carried forward as fact, not filled.

## 9. Governing Principle — Restated

A truthful BLOCKED or FAIL result is preferable to a fabricated PASS. This document's remaining files report exactly what was found, including one PASS-level finding of major significance (the boundary dataset, [boundary-dataset-deep-validation.md](boundary-dataset-deep-validation.md)) and several genuine BLOCKED/rate-limited findings (e.g., a second Overpass query for bridge features).

## 10. Security

No credential was fabricated or bypassed; where an API required a key that was not available (IMD, per [rainfall-weather-deep-validation.md](rainfall-weather-deep-validation.md)), this is reported as a genuine access limitation, not worked around.

## 11. Observability

Every downloaded file's size, hash-equivalent verification (HTTP Content-Length matching), and parse result is recorded in its respective validation file.

## 12. Milestone Traceability

This strategy governs all Files 2–14 of this milestone.

## 13. Open Decisions

No technology or dataset is confirmed by this document. It defines method only.
