---
Document Name: Data Catalog
Document ID: ED-DE-CAT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Data Catalog

## 1. Purpose

This document designs a conceptual data catalog for DistrictMind — the structure every dataset entry would carry — and provides **illustrative, conceptual** examples. Per the milestone brief's explicit instruction, examples in this document are clearly labeled **"Illustrative / Conceptual"** and must never be read as a claim that these datasets currently exist, are ingested, or are approved for use. No catalog entry here has a Status of Confirmed.

## 2. Catalog Entry Structure

| Field | Description |
|---|---|
| Dataset ID | Unique identifier for the dataset within DistrictMind's catalog |
| Dataset Name | Human-readable name |
| Domain | Which data domain it belongs to ([data-domain-model.md](data-domain-model.md)) |
| Source | Origin ([data-sources.md](data-sources.md)) |
| Owner | Responsible organization/role (conceptual — [data-governance.md](data-governance.md) Section 2) |
| Description | Purpose and contents |
| Spatial Coverage | Geographic extent (e.g., a specific district, statewide) |
| Temporal Coverage | Time period the dataset spans |
| Update Frequency | How often the dataset refreshes |
| Format | File/data format |
| Quality | Quality status ([data-quality.md](data-quality.md)) |
| Sensitivity | Classification ([data-governance.md](data-governance.md) Section 3) |
| Provenance | Lineage reference ([data-lineage.md](data-lineage.md)) |
| Status | Confirmed / Proposed / Candidate / Under Evaluation / Future |

## 3. Illustrative / Conceptual Catalog Entries

**The entries below are Illustrative / Conceptual. None represent an actual, currently ingested, or approved DistrictMind dataset.**

### Entry: District & Mandal Boundaries (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `geo-boundaries-telangana` (illustrative identifier only) |
| Dataset Name | Telangana District & Mandal Boundaries |
| Domain | Geographic |
| Source | Unidentified boundary data source (candidate category only — [data-sources.md](data-sources.md) Section 3) |
| Owner | Not assigned |
| Description | Polygon geometry and metadata for Telangana's districts and mandals |
| Spatial Coverage | Telangana state |
| Temporal Coverage | Not established |
| Update Frequency | Not established — boundary data changes infrequently |
| Format | GeoJSON / shapefile-derived (Proposed, per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 7) |
| Quality | Not assessed |
| Sensitivity | Public/Open (illustrative classification) |
| Provenance | Not yet established |
| Status | **Proposed** (source category identified; specific dataset not identified) |

### Entry: Road Network (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `transport-roads-osm` (illustrative identifier only) |
| Dataset Name | Road Network (OpenStreetMap-derived) |
| Domain | Transportation |
| Source | OpenStreetMap via Overpass API/OSMnx ([data-sources.md](data-sources.md)) |
| Owner | Not assigned |
| Description | Road segment geometry and classification, convertible to a navigable graph |
| Spatial Coverage | Telangana state (candidate scope) |
| Temporal Coverage | Continuously updated by the OSM community; DistrictMind would poll on a schedule |
| Update Frequency | Not established (AD-DE-003: batch/scheduled) |
| Format | GeoJSON / OSM native formats |
| Quality | Not assessed — community-maintained, "External Source" trust level ([data-governance.md](data-governance.md) Section 6) |
| Sensitivity | Public/Open |
| Provenance | Not yet established |
| Status | **Proposed** (Blueprint §5.7, §11.1) |

### Entry: Hospital & PHC Registry (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `health-facilities` (illustrative identifier only) |
| Dataset Name | Hospital and Primary Health Centre Registry |
| Domain | Healthcare |
| Source | Departmental export — specific department/portal not identified |
| Owner | Not assigned |
| Description | Facility point locations, type, and capacity |
| Spatial Coverage | Not established |
| Temporal Coverage | Not established |
| Update Frequency | Not established — Blueprint's own risk note (§17) flags departmental data as often "infrequently updated" |
| Format | CSV/GeoJSON (candidate, per Blueprint §1.1) |
| Quality | Not assessed |
| Sensitivity | Administrative-Sensitive (illustrative classification — facility capacity is not individually identifying but is administratively significant) |
| Provenance | Not yet established |
| Status | **Candidate** (domain and rough format named; source not identified — see [data-sources.md](data-sources.md) Section 3) |

### Entry: Population Records (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `demo-population` (illustrative identifier only) |
| Dataset Name | Village-Level Population Records |
| Domain | Demographic |
| Source | Public census portal — specific portal not identified |
| Owner | Not assigned |
| Description | Population counts by village and census year, with age-band breakdown |
| Spatial Coverage | Not established |
| Temporal Coverage | Multiple census years (exact years not established) |
| Update Frequency | Per census cycle |
| Format | CSV (candidate) |
| Quality | Not assessed |
| Sensitivity | Administrative-Sensitive (aggregated counts; individually identifying data is explicitly out of scope per [engineering-overview.md](../00_Engineering_Overview/engineering-overview.md) system boundaries) |
| Provenance | Not yet established |
| Status | **Proposed** (Blueprint §4.2 Phase 1: "public census portals"; portal not identified) |

### Entry: Rainfall Observations (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `weather-rainfall` (illustrative identifier only) |
| Dataset Name | Historical and Current Rainfall Observations |
| Domain | Weather / Environment |
| Source | IMD or equivalent — specific provider not confirmed |
| Owner | Not assigned |
| Description | Daily/monthly rainfall by weather station |
| Spatial Coverage | Not established |
| Temporal Coverage | Historical daily/monthly series (extent not established) |
| Update Frequency | Not established |
| Format | Not established |
| Quality | Not assessed |
| Sensitivity | Public/Open |
| Provenance | Not yet established |
| Status | **Proposed** (Blueprint §12.2; provider named as "IMD (or equivalent)," acknowledging the specific source is unconfirmed) |

### Entry: Policy & Planning Document Corpus (Illustrative / Conceptual)

| Field | Value |
|---|---|
| Dataset ID | `knowledge-policy-docs` (illustrative identifier only) |
| Dataset Name | Government Policy and Prior Planning Report Corpus |
| Domain | Analytical (Knowledge Base grounding — [ai-architecture.md](../02_System_Architecture/ai-architecture.md)) |
| Source | Not identified |
| Owner | Not assigned |
| Description | Unstructured policy/guideline/report text, embedded for retrieval to ground recommendations |
| Spatial Coverage | Not established |
| Temporal Coverage | Not established |
| Update Frequency | Manual (administrator-added) |
| Format | Not established (PDF/text, candidate) |
| Quality | Not assessed |
| Sensitivity | Not assessed |
| Provenance | Not yet established |
| Status | **Proposed** (Blueprint §3.2 "Knowledge Base"; document corpus not identified — [data-sources.md](data-sources.md) Section 6) |

## 4. Catalog Governance

Every entry's `Status` field must be kept consistent with [data-sources.md](data-sources.md) Section 3's classification for the same source — the catalog does not maintain an independent, potentially conflicting status. A dataset only moves to Confirmed in the catalog once it has actually been onboarded via the approval workflow proposed in [data-governance.md](data-governance.md) Section 11.

## 5. Milestone Traceability

| Catalog Capability | Milestone |
|---|---|
| Boundary dataset cataloged | M1 |
| Full multi-domain catalog populated with real (not illustrative) entries | M2 — Future |
| Knowledge Base corpus cataloged | M3 — Future |

## 6. Open Decisions

- Whether the catalog is a standalone tool/service or a set of metadata tables within the primary database — **To Be Evaluated**, deferred to ED-M2 Part 2B.
- Real dataset onboarding, replacing every illustrative entry above with actual sourced, approved data.
