---
Document Name: Data Sources
Document ID: ED-DE-SRC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Data Sources

## 1. Purpose

This document inventories candidate data sources for DistrictMind. It is deliberately conservative: **no source below is claimed to be currently integrated, formally accessed, or approved for use** unless explicitly stated. This document distinguishes three separate claims that must never be conflated:

- **"Source exists"** — the dataset/provider is a real, known thing (e.g., "OpenStreetMap exists").
- **"Source is accessible"** — the dataset/provider has a known, generally public access mechanism (e.g., "OSM data is available via the Overpass API").
- **"Source is approved for DistrictMind"** — a specific access agreement, license review, or data-sensitivity clearance has been completed for this project. **No source in this document has reached this status.**

## 2. Status Definitions

| Status | Meaning |
|---|---|
| **Confirmed** | Integrated and actively used. (None — DistrictMind has no implementation.) |
| **Proposed** | Named with clear justification in the original Blueprint/Abstract as the intended source. |
| **Candidate** | A plausible source category, named generically, not tied to a specific provider. |
| **Under Evaluation** | Identified as needed but no specific provider assessed. |
| **Future** | Named only as a later-milestone possibility (Blueprint §16 Future Scope). |

## 3. Source Inventory

| Source | Domain | Data Type | Spatial | Temporal | Update Frequency | Access Method | Reliability | Status |
|---|---|---|---|---|---|---|---|---|
| OpenStreetMap (via OSMnx / Overpass API) | Transportation, Infrastructure | Road network, buildings, places | Yes | Continuously updated by community | Public API (Overpass); community-maintained | Not formally assessed for DistrictMind's accuracy needs | Proposed (Blueprint §5.7, §11.1) |
| Public census portals (unspecified) | Demographic | Population counts by village/mandal, by census year | No (attached to geography) | Per census cycle | Not specified — public government portals, exact source not named | Not formally assessed | Proposed (Blueprint §4.2 Phase 1: "public census portals") — **specific portal/agency not identified** |
| IMD (India Meteorological Department) or equivalent | Weather / Environment | Historical and current rainfall, temperature | Point (station) | Daily/monthly time series | Not specified | Not formally assessed — Blueprint says "or equivalent," acknowledging the specific source is not fixed | Proposed (Blueprint §4.2 Phase 1, §12.2) |
| Departmental CSV/GeoJSON exports (hospitals, schools, government offices, water bodies, roads) | Healthcare, Infrastructure, Transportation | Facility registries, boundary/point/line geometry | Yes | Not specified — "infrequently updated" per Blueprint's own risk assessment (§17) | Manual file export, format/agency unspecified | Explicitly flagged as a risk by the source material itself: "often incomplete, inconsistently formatted, or infrequently updated" (Blueprint §17) | Proposed (Blueprint §1.1, §4.2 Phase 1) — **no specific department or portal identified** |
| Agricultural land-use / crop records | Agriculture | Crop, area, season per village | No (attached to geography) | Per season | Not specified | Not formally assessed | Candidate (Blueprint §4.2 Phase 1 names "agriculture" generically, no specific source) |
| Disaster/hazard records | Disaster | Historical flood-extent records, hazard events | Yes | Event-based | Not specified | Not formally assessed | Candidate (Blueprint §1.1 names "disaster records" generically; §12.1 references "historical flood-extent records" as a training input, no source named) |
| Government office location registries | Infrastructure | Point locations, department | Yes | Not specified | Not specified | Not formally assessed | Candidate (Blueprint §10.3 schemas the table; source not named beyond "departmental exports") |
| Policy documents / government guidelines / prior planning reports | Analytical (Knowledge Base grounding) | Unstructured text | No | Not specified | Not specified | Not formally assessed | Proposed (Blueprint §3.2 "Knowledge Base," §5.5) — **no specific document set identified** |
| Real-time IoT sensor feeds (water levels, traffic counters, air quality) | Transportation, Disaster, Environment | Streaming sensor data | Yes | Real-time | N/A | Not designed | Future (Blueprint §16 Future Scope — explicitly not current scope) |
| Drone imagery | Infrastructure, Disaster | Aerial imagery | Yes | Periodic | N/A | Not designed | Future (Blueprint §16) |
| Satellite imagery (vegetation indices, flood-extent verification) | Agriculture, Disaster | Remote-sensing raster data | Yes | Periodic | N/A | Not designed | Future (Blueprint §16) |

## 4. Reading This Table Correctly

Every row above satisfies only the **"source exists"** claim (Section 1) — each is a real category of data or a real public platform (OpenStreetMap and its Overpass API in particular are genuinely public and generally accessible without a project-specific agreement). No row satisfies **"source is accessible for DistrictMind specifically"** with a verified endpoint, credentials, license terms, or data-sharing agreement — because none of that verification work has been done. No row satisfies **"source is approved for DistrictMind"** — no data governance, privacy, or licensing review has occurred (per [constraints.md](../01_Requirements/constraints.md) Data Constraints, which already flags this as **"Constraint requires confirmation"** at the ED-M1 level, and remains unresolved here).

## 5. Relationship to ED-M1 Assumptions and Constraints

This document does not resolve [assumptions.md](../01_Requirements/assumptions.md) AS-001 (GIS boundary data availability) or AS-002 (multi-domain indicator data availability) — both remain **Unvalidated**. What this document adds, drawn from the Blueprint, is more specific *category* detail (OSM for roads/buildings, IMD-or-equivalent for weather, census portals for population) than ED-M1 had — but category detail is not the same as confirmed access, and this document does not claim otherwise.

## 6. Vector / Embedding Data Sources

The Semantic/Vector layer ([data-architecture.md](data-architecture.md) Section 13) requires source text to embed. The only candidate source named by the Blueprint is the Knowledge Base's policy documents/guidelines/prior reports row (Section 3 above) — no specific document corpus has been identified or approved.

## 7. Data Reliability Notes

The original source material itself is explicit that government departmental data should not be assumed reliable or current: Blueprint §17 (Challenges, Data row) states plainly that "government datasets are often incomplete, inconsistently formatted, or infrequently updated" and that "reconciling data from multiple departments into one consistent schema takes significant cleaning effort." This document preserves that caution rather than presenting departmental sources as dependable — see [data-quality.md](data-quality.md) for how this shapes the quality framework, and [data-validation.md](data-validation.md) for how ingestion handles this uncertainty.

## 8. Milestone Traceability

| Source Category | First Needed | Status |
|---|---|---|
| GIS boundary data (district/mandal/village) | M1 | Proposed source category (OSM for roads; boundary-specific source still unidentified) |
| OSM road/building data | M1–M2 | Proposed |
| Census/population data | M2 — Future | Proposed, source unidentified |
| Healthcare, education, infrastructure registries | M2 — Future | Proposed, source unidentified |
| Weather data | M2 — Future (data), M4 — Future (forecasting input) | Proposed |
| Agricultural data | M2 — Future | Candidate |
| Disaster/hazard records | M2 — Future (data), M4 — Future (risk modeling) | Candidate |
| Policy documents (Knowledge Base) | M3 — Future | Proposed, corpus unidentified |
| Real-time IoT, drone, satellite | Not scheduled | Future |

## 9. Open Decisions

- Identification of a specific, named census data portal.
- Identification of a specific weather data provider/API (IMD or an equivalent aggregator).
- Identification of the specific Telangana departments/portals for hospital, school, road, and government-office registries, and confirmation of their license terms for reuse.
- Identification of a specific disaster/hazard historical dataset.
- Identification of a specific policy-document corpus for the Knowledge Base.
- Formal data-sharing/licensing review for every source above before any is treated as Confirmed (per [constraints.md](../01_Requirements/constraints.md) Data Constraints and Regulatory/Privacy Considerations).
