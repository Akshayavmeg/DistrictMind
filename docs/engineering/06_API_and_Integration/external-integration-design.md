---
Document Name: External Integration Design
Document ID: ED-API-EXT-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# External Integration Design

## 1. Purpose

This document defines the logical integration boundary for external sources/services, elaborating [integration-architecture.md](../02_System_Architecture/integration-architecture.md) and [data-sources.md](../04_Data_Engineering/data-sources.md) with API-boundary-specific detail. Status discipline is maintained strictly per Section 27 of the milestone brief: no source is elevated to Confirmed by this document.

## 2. Integration Categories

| Category | Purpose | Expected Data | Ingestion Method | API/Service Boundary | Status |
|---|---|---|---|---|---|
| Government datasets | Census, departmental registries | Population, facility, infrastructure records | Batch/file, per [data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 4 | Ingestion Service (internal), never exposed as a passthrough API | Proposed (Blueprint §1.1); specific source unidentified ([data-sources.md](../04_Data_Engineering/data-sources.md)) |
| Geographic datasets (OpenStreetMap) | Road/building/place data | Road, Road Segment, Infrastructure point data | API (Overpass), scheduled | Ingestion Service; GIS Service consumes the resulting Curated data, never calls OSM directly at request time | Proposed (Blueprint §5.7, §11.1) |
| Weather services | Rainfall, temperature | Weather Observation | API or file, scheduled | Ingestion Service; Weather Service reads Curated data only | Proposed (Blueprint §12.2, "IMD or equivalent") — specific provider unidentified |
| Disaster information | Hazard/flood-extent records | Disaster Event, Impact Observation | File/batch, event-triggered + scheduled | Ingestion Service | Candidate — no specific source identified ([data-sources.md](../04_Data_Engineering/data-sources.md) Section 3) |
| Transportation/open map data | Road network (overlaps with Geographic datasets — OSM serves both) | Road geometry, routing graph input | Same as Geographic | Same as Geographic | Proposed |
| Demographic datasets | Population, census | Population Observation | Batch, historical + scheduled | Ingestion Service | Proposed, source unidentified |
| Healthcare datasets | Facility registries | Health Facility | File/batch, manual + scheduled | Ingestion Service | Proposed, source unidentified |
| AI providers | LLM inference for the AI Agent Layer | N/A (a compute service, not a data source) | API, called by AI Orchestration Service only, never by any other service | AI Orchestration Service exclusively, via the Integration layer's adapter pattern ([integration-architecture.md](../02_System_Architecture/integration-architecture.md) Section 8) | Candidate — [technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.5 (Claude/Anthropic, self-hosted, other hosted); the Blueprint separately proposes local Llama 3 via Ollama with OpenAI GPT as optional fallback (§5.4) — this divergence is unresolved, restated unchanged from [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 33 (#2) |
| Authentication providers | Identity/SSO | User identity assertions | API (OAuth 2.0/OIDC, Proposed protocol) | Authentication Service exclusively | Candidate ([technology-stack.md](../00_Engineering_Overview/technology-stack.md) §4.9) |

## 3. Ingestion Method Detail

Every data-category integration (government, geographic, weather, disaster, transportation, demographic, healthcare) uses the batch/scheduled ingestion pattern established by AD-DE-003 ([data-architecture.md](../04_Data_Engineering/data-architecture.md)) — no real-time streaming ingestion is designed here, consistent with that decision's continued force.

## 4. API/Service Boundary Principle

**No external integration is ever called synchronously, mid-request, by a client-facing API endpoint.** Data-source integrations feed the Curated layer via the Ingestion Service, asynchronously and on their own schedule; API endpoints always read from already-curated, already-validated data ([data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 7), never proxy a live call to an external government API or OSM at request time. The two exceptions, by nature of what they are, are the AI provider (called synchronously by the AI Orchestration Service specifically to fulfill Operation 16) and the authentication provider (called synchronously by the Authentication Service to fulfill login) — both are still mediated exclusively by their owning service, never reachable by any other API consumer directly.

## 5. Validation

Every ingested external record passes through the identical validation pipeline regardless of source category ([data-validation.md](../04_Data_Engineering/data-validation.md)) — no source is exempted from validation on the basis of category (government data is not implicitly trusted more than OSM data at the validation stage, though it may carry a different trust classification at the governance layer, [data-governance.md](../04_Data_Engineering/data-governance.md) Section 6).

## 6. Failure Handling

| Integration Category | Failure Behavior |
|---|---|
| Government/Geographic/Weather/Disaster/Demographic/Healthcare data sources | Ingestion run fails loudly, logged, no partial commit (NFR-009, unchanged from [data-ingestion.md](../04_Data_Engineering/data-ingestion.md) Section 6) |
| AI provider | The AI Orchestration Service returns an explicit failure to the user, per [ai-architecture.md](../02_System_Architecture/ai-architecture.md) Section 15 — never a silent retry loop or a fabricated fallback answer |
| Authentication provider | Authentication fails closed (access denied), never fails open, per [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 14 |

## 7. Rate Limits

Every external integration's adapter respects that provider's rate limits with backoff/queuing, per [integration-architecture.md](../02_System_Architecture/integration-architecture.md) Section 12 — restated unchanged here; the AI provider and any rate-limited government/OSM API are the most likely to have materially constraining limits.

## 8. Provenance

Every record entering DistrictMind via any integration category carries its source and ingestion-run provenance ([data-lineage.md](../04_Data_Engineering/data-lineage.md)), regardless of category — this is not weakened for any "trusted" source.

## 9. Security

- All outbound calls to external providers use TLS (NFR-011).
- Credentials/API keys for every integration category are managed as configuration/secrets, never hardcoded, per [security-architecture.md](../02_System_Architecture/security-architecture.md) Section 8.
- Data sent to a third-party AI provider (if that path is chosen) remains subject to the unresolved data-sensitivity constraint ([constraints.md](../01_Requirements/constraints.md) AI/LLM Constraints) — this document does not assume that constraint has been cleared, consistent with every prior milestone's treatment of it.

## 10. Fallback Behavior

| Integration | Fallback |
|---|---|
| Government/Geographic/Weather/Disaster/Demographic/Healthcare data sources | No fallback source — a failed ingestion run simply does not update the Curated layer for that run; the prior Curated version remains available and is served with disclosed staleness ([api-design-principles.md](api-design-principles.md) Section 12) |
| AI provider | If a fallback provider is configured (e.g., the Blueprint's proposed local-model + cloud-fallback pattern, §5.4), the AI Orchestration Service may attempt it — this remains **Candidate**, not a confirmed DistrictMind design, since ED-M1's provider list and the Blueprint's specific proposal remain unreconciled ([data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 33 #2) |
| Authentication provider | No fallback — an unavailable authentication provider means no new sessions can be created; existing valid sessions are unaffected until their own expiry |

## 11. Milestone Traceability

| Integration | First Needed |
|---|---|
| Geographic (GIS boundary/OSM) | M1 |
| Government, Weather, Disaster, Demographic, Healthcare datasets | M2 — Future |
| AI provider | M3 — Future |
| Authentication provider (if externally hosted, beyond basic M1 auth) | M1 (basic), Future (SSO, unscheduled) |

## 12. Status Discipline Confirmation

Per Section 27 of the milestone brief: no integration category above is marked Confirmed. Where a category was already Proposed in prior milestones (Geographic/OSM, Weather, Government datasets, authentication protocol), that status is preserved unchanged, not elevated. Where a category remains Candidate (AI provider, Disaster source, authentication provider), it remains Candidate. **Implementation technology for every integration in this document remains under evaluation.**

## 13. Open Decisions

Unchanged from [integration-architecture.md](../02_System_Architecture/integration-architecture.md) Section 18 and [data-sources.md](../04_Data_Engineering/data-sources.md) Section 9 — not re-litigated here: specific boundary/indicator/disaster data sources, specific identity provider, specific AI provider (including the unresolved local-vs-hosted divergence), and whether data-sensitivity constraints preclude third-party AI providers entirely.
