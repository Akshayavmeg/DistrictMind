---
Document Name: Step 2 — District Reference and Administrative Foundation
Document ID: DM-IMPL-S2
Version: 0.1
Status: Implemented (development)
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Step 2 — District Reference and Administrative Foundation

Written for: engineers extending the district domain and the reviewer approving Step 2.

## 1. What This Step Is — and Is Not

**Is:** a typed administrative reference for the 33 Telangana districts, with a repository, a service, versioned API endpoints, and an API-backed frontend list and detail page.

**Is not:** GIS, geometry, a map, statistics, AI, persistence, or production authentication. No district polygon, coordinate, area, population, healthcare, rainfall, road, agriculture, economic, or risk value exists anywhere in this step.

**Governance status:** the catalog is **administrative reference data**. Its names come from the ED-M6 Part 3 record, which states the source is an aggregator copy with no detected license. Spellings are not independently verified against a primary publication. Nothing here is an approved dataset.

## 2. Existing Structures Reused

| Existing structure | How Step 2 reuses it |
|---|---|
| `backend/app/main.py` `create_app()` | Unchanged; the new router is included through the existing `/api/v1` prefix |
| `backend/app/api/router.py` | Gains one `include_router` line |
| `backend/app/core/errors.py` | Extended with a `DomainError` handler using the same safe error shape as the Step 1 500 handler |
| `backend/app/core/config.py` | Unchanged |
| `shared/` | New `shared/types/district.ts` is the single frontend contract definition |
| `frontend/src/services/apiClient.ts` | Reused unchanged for all district calls |
| `frontend/src/components/StateMessages.tsx` | Reused for loading, error, and empty states |
| `frontend/src/App.tsx` routing | `/districts/:id` kept as the canonical route (AD-RES-001); guard unchanged |
| Test setup (pytest, Vitest, Playwright) | Extended, not replaced |

## 3. Administrative Domain Model

```
backend/app/modules/administrative/
├── domain/        District, DistrictStatus, ReferenceMetadata; DistrictNotFoundError, InvalidDistrictIdError
├── repositories/  DistrictRepository (Protocol); ReferenceCatalogRepository (in-memory)
├── services/      DistrictService (list, get, identifier validation)
├── schemas/       DistrictSchema, DistrictListSchema, ReferenceMetadataSchema (API responses)
└── reference/     TELANGANA_DISTRICTS (the 33-entry catalog)
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Deterministic: `telangana-` + lowercase name with spaces as hyphens. Not database-generated |
| `name` | string | Display name as recorded |
| `state` | string | `Telangana` |
| `status` | `DistrictStatus` enum | Controlled. Currently `active` only; add members as lifecycle states are approved |
| `reference` | optional `ReferenceMetadata` | `source`, `source_id`, `source_url`, `vintage`. Unknown values stay `null` |

**Deliberately absent:** geometry, coordinates, area, centroid, population, any statistic, and any government identifier. The model test `test_model_carries_no_geometry_or_statistics_fields` enforces the field set.

**Reference metadata:** `source` records where the name came from (a repository path to the validation record). `source_id`, `source_url`, and `vintage` are `null` for every district. No LGD code or other government identifier is populated, because the validated file's codes have not been verified against a primary publication.

**Extensibility:** mandals, villages, geometry, and each statistical or spatial domain attach to the district `id` as separate modules. None of them requires changing the district model.

## 4. District Reference Catalog

- **33 entries.** Names are exactly those recorded in [boundary-dataset-deep-validation.md](../engineering/24_Evidence_Deep_Validation_and_PoC/boundary-dataset-deep-validation.md) (VAL-M6-P3-002). Every name was checked to appear in the evidence records.
- **Spelling caveat.** Spellings such as "Jagitial", "Jangoan", and "Kumuram Bheem Asifabad" follow the record. They are not verified against an authoritative source.
- **Identifiers are unique** (33 distinct) and **names are unique** (33 distinct). All states are `Telangana`; all statuses are `active`.

## 5. API Endpoints

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/v1/districts` | 200 `{ "items": [District…], "total": 33 }` | none expected (empty catalog returns 200 with `items: []`) |
| GET | `/api/v1/districts/{district_id}` | 200 `District` | 400 `invalid_district_id` (structure), 404 `district_not_found` |

**Error shape** (same family as the Step 1 internal-error response):

```json
{ "error": "district_not_found", "message": "No district matches the requested reference.", "correlation_id": "…" }
```

No stack trace, repository detail, or internal name is returned.

**Identifier validation** happens in the service, not the route: lowercase letters, digits, and single hyphens, at most 64 characters. Anything else is a structural failure and returns 400, consistent with AD-BE-006 (structural 400, not found 404).

**List envelope:** `{items, total}` is used because [api-design-principles.md](../engineering/06_API_and_Integration/api-design-principles.md) §6 requires a standard list envelope. **Pagination mechanics (cursor or offset) remain Under Evaluation** in that document. Until decided, all 33 entries are returned in one response. This is a recorded decision point, not a resolved one.

**Detail response** returns the resource directly, not wrapped in an envelope.

## 6. Repository and Service Boundary

```
API route  →  DistrictService  →  DistrictRepository (Protocol)  →  ReferenceCatalogRepository (in-memory)
   ↑ maps domain → schema          ↑ business rules here             ↑ replaceable by a database implementation
```

- **Routes** (`backend/app/api/districts.py`) do not contain business rules. They call the service and map results to schemas.
- **Service** owns identifier validation and the not-found decision.
- **Repository** is a `Protocol`. The in-memory implementation is **not database persistence**. A future PostgreSQL implementation satisfies the same protocol, and the API contract does not change.
- **Dependency seam:** `get_district_service()` lets tests substitute an empty catalog.

## 7. Frontend Data Flow

```
page (DistrictsPage / DistrictDetailPage)
  ↓
hook (useDistricts / useDistrict)        — loading, ready, error state; cancels stale requests
  ↓
service (listDistricts / getDistrict)    — endpoint paths only
  ↓
API client (apiRequest)                  — timeout, typed errors, base URL
  ↓
backend GET /api/v1/districts[/{id}]
```

- The frontend has **no copy of the 33 districts**. Its only source is the API.
- On API failure, the list page shows an error state. It does **not** fall back to any district names.
- 404 shows "District not found"; 400 shows "Invalid district reference"; other failures show a generic unavailable state.
- The detail page shows reference fields and labels unavailable areas (`Spatial Intelligence`, `Statistical Indicators`) as intentionally unavailable. It fills none of them.
- The contract type is `shared/types/district.ts`. It mirrors the backend schema, and the frontend has no second district model.

## 8. Reference Data vs. Spatial and Statistical Data

| Administrative reference data (Step 2, present) | Spatial and statistical layers (absent) |
|---|---|
| District identity, name, state | District polygon / boundary geometry |
| Administrative status | Mandal and village boundaries |
| Optional reference provenance | Roads, lakes, hospitals, schools, rainfall, population |

The district catalog **does not contain geometry** and must not be presented as spatial. Geometry attaches to a district `id` only after the boundary-licensing decision (D-9) and the GIS/data validation gates are cleared. Until then the frontend shows "Not available — validated GIS layer not yet connected."

## 9. Tests

| Layer | File | Covers |
|---|---|---|
| Catalog | `backend/tests/administrative/test_catalog.py` | 33 entries, unique IDs and names, state, status, ID format and slug rule, field set, no invented identifiers |
| Repository | `backend/tests/administrative/test_repository.py` | list returns catalog, valid and unknown lookup, copy semantics, duplicate-ID rejection, empty catalog |
| Service | `backend/tests/administrative/test_service.py` | list, valid retrieval, not found, invalid identifiers, empty catalog |
| API | `backend/tests/test_districts_api.py` | 200 list, 200 detail, 404 with safe shape, 400, empty catalog, no internals exposed |
| Frontend | `frontend/src/pages/districts.test.tsx` | loading, rendering from API data (not a hardcoded list), links to canonical route, API failure with no fallback, empty catalog, detail loading, detail rendering, 404, 400, generic failure |
| Browser | `tests/e2e/navigation.spec.ts` | Flow 1 (login → list → Warangal → detail), Flow 2 (direct navigation), Flow 3 (unknown and invalid IDs), plus Step 1 checks |

## 10. Current Limitations

- Reference names are unverified against a primary publication. The source's license is undetected (D-9 still open).
- The catalog is in-memory. Restarting the backend resets nothing, because nothing is persisted; there is no database.
- All 33 entries are returned in one list response. Pagination is Under Evaluation.
- Production authentication, authorization, and rate limiting are not implemented. The login is a development stub, and the UI route guard is not an access control.
- The console shows browser-level "Failed to load resource" messages for the deliberate 400 and 404 checks in Flow 3. The Playwright suite filters only those messages.
- No database, GIS, map, AI, or analytics is present.

## 11. Future Dependencies

| Future step | Depends on |
|---|---|
| District geometry and map | Boundary licensing decision (D-9) and the GIS validation gates (RG-GIS-002/003) |
| Persistence (PostgreSQL) | Database PoC passing (PostgreSQL/PostGIS not yet validated) |
| Mandals, villages | Administrative identifier decision for mandal/village level (Item 25 area; `administrative-data-decision.md`) |
| Statistics per district | Validated statistical source (population, healthcare, etc.) |
| Production access control | Authentication provider selection (Item 17) and authorization provider (Item 18) |
| Lifecycle states beyond `active` | An approved decision on district lifecycle (add to `DistrictStatus`) |

## 12. Decisions Not Made by This Step

No new Architecture Decision (AD-*) was created. The following remain open and are recorded here, not resolved:

1. Pagination mechanics for list responses (Under Evaluation in api-design-principles.md §6).
2. Whether `/districts/:id` uses the stable identifier `telangana-<slug>` or a later mapped identifier (noted as a future decision in boundary-dataset-deep-validation.md, check 15).
3. Authoritative district spellings and government identifiers (`source_id`).
