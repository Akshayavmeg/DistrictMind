---
Document Name: Database Performance
Document ID: ED-DB-PERF-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Database Performance

## 1. Purpose

This document defines the database-layer performance strategy required to keep DistrictMind's eventual UI responsive: map interactions, dashboard filters, district switching, AI queries, analytical queries, and spatial queries. It elaborates [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 25 with database-specific detail, and deliberately avoids introducing distributed-database complexity DistrictMind's current scale does not justify.

## 2. Performance-Sensitive Interaction Types

| Interaction | Database Access Pattern | Performance Target Source |
|---|---|---|
| Map pan/zoom, district switching | Boundary geometry retrieval, spatial containment lookup | NFR-001, NFR-035 |
| Dashboard filters (domain, indicator) | Analytical Result reads, filtered by domain/time | NFR-002 |
| AI queries | Bounded Typed Data Tool reads ([ai-data-access-model.md](ai-data-access-model.md)) | NFR-003 |
| Analytical queries (trends, comparisons) | Analytical Result range reads ([database-indexing-strategy.md](database-indexing-strategy.md) Section 5) | FR-025, FR-026 |
| Spatial queries (coverage gap, routing) | Indexed spatial join / graph traversal ([spatial-database-design.md](spatial-database-design.md)) | NFR-035, NFR-036 |

All targets above remain **Initial Target / To Be Validated**, per [non-functional-requirements.md](../01_Requirements/non-functional-requirements.md) — this document does not assert new numeric commitments.

## 3. Query Optimization

- Every performance-sensitive query pattern identified in Section 2 has a corresponding index defined in [database-indexing-strategy.md](database-indexing-strategy.md) — query optimization begins with ensuring the right index exists, not with ad hoc tuning after the fact.
- Queries read from the Analytical layer (Analytical Result) rather than recomputing aggregates from Operational data on every request, per [database-normalization.md](database-normalization.md) Section 6 and [analytical-data-model.md](analytical-data-model.md) Section 7.

## 4. Indexing

Full treatment in [database-indexing-strategy.md](database-indexing-strategy.md) — not repeated here beyond noting that indexing is the first, not last, performance lever applied.

## 5. Aggregation

Aggregation (village → mandal → district rollups, [analytical-data-model.md](analytical-data-model.md) Section 5) is performed once, at Analytical Result computation time, not on every dashboard read — this is the same pattern as [database-normalization.md](database-normalization.md) Section 6's "precomputed indicators" denormalization, restated here as a performance strategy rather than a normalization one.

## 6. Caching

- **Proposed** cache layer (Redis, per [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 25 and the Blueprint's own rationale, §5.3): "reduces repeated-query latency for common dashboard requests (e.g. district boundary geometry) without hitting PostGIS every time."
- Cache candidates: boundary geometry (low change frequency, high read frequency — an ideal cache target), frequently-requested Analytical Results, and AI Assistant retrieval results where the underlying data has not changed since the last identical query.
- Cache invalidation is tied to the underlying data's update path (a boundary correction invalidates that entity's cached geometry) — never a fixed TTL alone, per [data-architecture.md](../04_Data_Engineering/data-architecture.md) Section 25's stated invalidation principle, to avoid serving stale data as current (Data Integrity).

## 7. Precomputation

Precomputation applies to genuinely expensive, infrequently-changing derived values — e.g., statewide coverage-gap analysis — realized as the materialized-view candidate already discussed in [database-normalization.md](database-normalization.md) Section 6. Precomputation is not applied blanket-wide; it is reserved for the specific cases named there.

## 8. Materialized Analytical Views

Where justified (Section 7), a materialized view trades write-time computation cost for read-time speed. Refresh strategy (scheduled vs. triggered-on-change) is an open decision (Section 15), deferred to physical design once real query-frequency and data-change-frequency data exists.

## 9. Pagination

Every list-shaped Serving-layer read (e.g., a list of facilities, a list of Recommendations) is paginated, per [technical-requirements.md](../01_Requirements/technical-requirements.md) API requirements — the database layer supports this via ordered, indexed range queries (Section 3), not by ever returning an entire table to the application layer.

## 10. Result Limits

Restated from [ai-data-access-model.md](ai-data-access-model.md) Section 9 and generalized: every query pattern in this document has a bounded maximum result size, whether it is AI-facing or dashboard-facing.

## 11. Asynchronous Processing

| Workload | Sync or Async | Rationale |
|---|---|---|
| Single-entity lookup (District detail, Health Facility detail) | Synchronous | Fast, indexed, low-latency by design — no reason to defer |
| Dashboard indicator read (from precomputed Analytical Result) | Synchronous | Already precomputed (Section 5); reading it is fast |
| Coverage-gap / routing computation *if not precomputed* | Synchronous, but bounded | Acceptable if the underlying spatial index (Section 4 of [database-indexing-strategy.md](database-indexing-strategy.md)) keeps it fast; escalate to precomputation (Section 7) if it does not |
| Data ingestion runs | Asynchronous (background job) | Per [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 12 and AD-DE-003 — never blocks a user-facing request |
| Model inference (Prediction) | Asynchronous (background job) | Per Blueprint §12.6's offline-training/online-inference split — inference itself may still need to be reasonably fast for interactive use, but training/batch scoring runs are async |
| Simulation execution | Asynchronous where computation is non-trivial (e.g., statewide rerouting) | The sandboxing itself (AD-DE-004) does not dictate sync/async, but a potentially expensive recomputation should not block the request thread — consistent with [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 12 |
| Recommendation generation | Asynchronous | Involves multiple upstream reads (Analytical, Prediction, Scenario) — a multi-step, potentially slower operation, appropriately backgrounded |

This table is the direct answer to the milestone brief's "explain what should happen synchronously vs asynchronously" instruction.

## 12. Background Analytical Workloads

Analytical Result computation (Section 5) and materialized view refresh (Section 8) are background workloads, decoupled from any single user's request — consistent with [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 12's background-job scoping.

## 13. Spatial Query Optimization

- Geometry simplification at low zoom levels, full detail only for the currently focused district — per [gis-architecture.md](../02_System_Architecture/gis-architecture.md) Section 15, restated here as a database-read-pattern implication: the database must be able to serve a simplified geometry variant efficiently, not just the full-precision source geometry, for wide-area map views.
- Spatial indexes (Section 4 of [database-indexing-strategy.md](database-indexing-strategy.md)) are the primary lever; buffer/intersection/containment queries (Sections 17–19 of [spatial-database-design.md](spatial-database-design.md)) are only fast if the underlying geometry columns are indexed.

## 14. Connection Management

Consistent with [backend-architecture.md](../02_System_Architecture/backend-architecture.md) Section 3's stateless API layer and Section 14 (Scalability) of [system-architecture.md](../02_System_Architecture/system-architecture.md): connection pooling at the application layer is the expected mechanism for managing concurrent database access efficiently, rather than each request establishing a new connection. No specific pool sizing is prescribed here — an implementation-time tuning concern.

## 15. Read/Write Separation — Evaluated, Not Adopted

| Consideration | Assessment |
|---|---|
| Would a read replica help? | DistrictMind's write volume (batch ingestion, periodic model runs, occasional user-driven writes like a Recommendation status change) is low relative to read volume (dashboard, map, AI queries) |
| Is it justified now? | **No** — at current scale (NFR-006's ~50 concurrent users, Initial Target), a single database instance with proper indexing and caching (Sections 4, 6) is expected to be sufficient |
| When would it be revisited? | If real production load data shows read contention that indexing/caching cannot resolve — an explicitly deferred, not rejected, option, consistent with the "do not overengineer" and "do not automatically introduce distributed databases" guidance in this milestone's brief |

## 16. What This Document Deliberately Does Not Do

Per the milestone brief's explicit instruction: this document does not introduce a distributed database, does not mandate sharding, and does not commit to read replicas. Every performance technique above is chosen because a specific, named DistrictMind access pattern (Section 2) justifies it — not by default.

## 17. Milestone Traceability

| Performance Capability | Milestone |
|---|---|
| Spatial indexing, geometry simplification for map performance | M1 |
| Analytical Result precomputation, caching, pagination | M2 — Future |
| AI query result bounding, evidence caching | M3 — Future |
| Async model inference | M4 — Future |
| Async simulation execution | M5 — Future |
| Async recommendation generation | M6 — Future |

## 18. Open Decisions

- Specific caching technology confirmation (Redis remains Proposed — [database-design.md](database-design.md) Section 25).
- Materialized view refresh cadence/trigger (Section 8).
- Connection pool sizing and configuration (Section 14) — implementation-time tuning.
- Whether/when read replicas become justified (Section 15) — explicitly deferred pending real load data.
