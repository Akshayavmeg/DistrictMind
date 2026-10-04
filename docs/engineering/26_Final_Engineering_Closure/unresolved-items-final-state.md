---
Document Name: Unresolved Items Final State
Document ID: ED-FEC-UNRESOLVED-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-03
Last Updated: 2026-09-03
---

# Unresolved Items Final State

## 1. Purpose

This is the final, complete unresolved-items register for the entire DistrictMind engineering program. **This list is not reduced to make implementation appear ready.** It consolidates [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md)'s original 27 items with every item that ED-M6 Parts 2–4 added, narrowed, or left unchanged.

## 2. The Final Register

| # | Item | Final Status |
|---|---|---|
| 1 | Real data sources (all 8 domains) | UNRESOLVED — no domain reaches ACCEPT; several domains now have substantive PoC-level evidence (boundary, healthcare, roads, education) |
| 2 | 33-district boundary dataset | UNRESOLVED — strongest evidentiary state in the program (RECOMMENDED — PENDING FORMAL APPROVAL); 5 named gates open (licensing, geometry validity/topology, CRS, provenance) |
| 3 | AI provider | UNRESOLVED — real local-LLM feasibility evidence exists; governance question untouched |
| 4 | AI framework (agent orchestration) | UNRESOLVED |
| 5 | LLM model | UNRESOLVED — downstream of Item 3 |
| 6 | Embedding model | UNRESOLVED — no candidate named anywhere |
| 7 | Vector database | UNRESOLVED |
| 8 | RAG framework | UNRESOLVED |
| 9 | Agent framework (duplicate framing of Item 4) | UNRESOLVED |
| 10 | ML framework | UNRESOLVED |
| 11 | Model serving | UNRESOLVED |
| 12 | Background jobs | UNRESOLVED |
| 13 | Frontend technology | UNRESOLVED — Node.js availability confirmed as an environmental fact only |
| 14 | Backend technology | UNRESOLVED |
| 15 | Database technology (PostgreSQL/PostGIS) | UNRESOLVED — PostgreSQL Candidate/Proposed divergence now fully documented, still not reconciled |
| 16 | GIS technology | UNRESOLVED — algorithm-level logic PASS is not PostGIS/GIS-technology evidence |
| 17 | Authentication provider | UNRESOLVED |
| 18 | Authorization provider | UNRESOLVED |
| 19 | Observability platform | UNRESOLVED |
| 20 | CI/CD | UNRESOLVED |
| 21 | Deployment platform | UNRESOLVED |
| 22 | RPO | UNRESOLVED — NFR-038, "To Be Finalized During Architecture Design" |
| 23 | RTO | UNRESOLVED — same |
| 24 | Dataset-deprecation process | UNRESOLVED — non-blocking, framework designed but never exercised |
| 25 | Source-precedence calibration | UNRESOLVED — now has real calibration evidence (2 genuine fragmentation instances) but no rule finalized |
| 26 | Healthcare Demand forecasting contradiction | UNRESOLVED — unchanged by ED-M6 Parts 2–5 |
| 27 | Recommendation Engine weighted-scoring gap | UNRESOLVED — unchanged |

## 3. Items Newly Named or Sharpened Since the Original 27

| Item | Detail | Status |
|---|---|---|
| Healthcare data-quality remediation | NIC dataset: 54% duplication, stale district labels — both real, quantified, disclosed | UNRESOLVED — remediation (deduplication, spatial re-derivation) named but not performed |
| Local road/network/bridge data | MoRTH covers National Highways only; local network and bridge-closure analysis (Canonical Example B) have no evidence | UNRESOLVED |
| Rainfall API access | IMD and data.gov.in both real/live, both require a key not obtained | UNRESOLVED (access-specific, not data-quality) |
| Boundary approval gates | Licensing, full geometry validity/topology, explicit CRS declaration, direct-primary-source provenance | UNRESOLVED — 5 distinct sub-gates |
| Mandal/village-level identifiers | Never opened or evaluated | UNRESOLVED |

## 4. No Item Removed to Improve Appearance

**Every item in Sections 2–3 remains listed as unresolved, even where real, substantial evidence now exists (boundary, healthcare, roads, education).** Evidence progress is recorded honestly as evidence progress — not as resolution. This is the same discipline restated throughout [implementation-readiness-reassessment.md](../25_Decision_Closure_and_Baseline_Promotion/implementation-readiness-reassessment.md).

## 5. Security

No unresolved item is treated as a justification to weaken any documented security boundary.

## 6. Observability

Every item traces to [unresolved-items-baseline.md](../16_Engineering_Readiness_and_Baseline/unresolved-items-baseline.md) or a specific ED-M6 Part 3/4 finding — no item is invented or removed without basis.

## 7. Milestone Traceability

Restated per-item's own milestone impact, unchanged from the original register.

## 8. Open Decisions

**All 27 original items plus the 5 sharpened sub-items in Section 3 remain open.** This document answers none of them — it is a final register, not a resolution.
