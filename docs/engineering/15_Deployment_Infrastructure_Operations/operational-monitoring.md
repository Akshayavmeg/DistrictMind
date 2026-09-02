---
Document Name: Operational Monitoring
Document ID: ED-DIO-MON-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# Operational Monitoring

## 1. Purpose

This document defines operational monitoring for deployed DistrictMind environments, building directly on [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md). **No monitoring vendor is selected, and no numeric threshold is invented.**

## 2. Relationship to ED-M4 Part 3 Observability Documentation

[observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) defines *what* must be observable (logs, metrics, traces, audit events, and the specific trace/monitoring categories per layer). This document defines the *operational* discipline built on that foundation: health checks, readiness/liveness, alerting, dashboards, and investigation practice for a running deployment — it does not redefine or duplicate that document's signal taxonomy.

## 3. Health Checks

A health check is a lightweight, frequently-polled endpoint/mechanism confirming a running instance is minimally functional — restated conceptually from [deployment-strategy.md](deployment-strategy.md) Section 13; no specific health-check protocol or polling interval is mandated.

## 4. Readiness

Readiness indicates whether a running instance is prepared to accept traffic (e.g., its database connection is established, its configuration validated per [configuration-and-secrets-operations.md](configuration-and-secrets-operations.md) Section 14) — distinct from liveness (Section 5): an instance can be alive but not yet ready.

## 5. Liveness Concept

Liveness indicates whether a running instance is still functioning at all (not deadlocked, not crashed) — an instance failing its liveness check is a candidate for restart; an instance failing only readiness is a candidate for temporary traffic exclusion, not necessarily restart.

## 6. Infrastructure Health

| Signal | What It Indicates |
|---|---|
| Compute availability | Whether backend/frontend-serving instances are running and reachable |
| Database health | Connectivity, query responsiveness, replication lag if applicable |
| Storage health | Availability and integrity of Curated/Analytical/model/RAG storage ([storage-and-persistence-operations.md](storage-and-persistence-operations.md)) |
| Network health | Reachability across the boundaries defined in [networking-and-access.md](networking-and-access.md) |

## 7. API Health

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 10 — error rate by category, request volume, and response health, monitored qualitatively against the deployment's own historical baseline.

## 8. Database Health

Restated unchanged from Section 6 — connection failures, query errors, and (once a database technology is confirmed) any provided replication/availability signal.

## 9. GIS Health

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 6 — spatial computation errors, invalid-geometry rejection rate, and computation-time drift relative to baseline.

## 10. AI Runtime Health

Restated unchanged from that document Sections 4, 10 — tool execution failures, plan failures, and unusual agent behavior (excessive tool-call counts, repeated authorization rejections).

## 11. Retrieval Health

Restated unchanged from that document Section 5 — empty or low-confidence RAG retrieval occurrence rate.

## 12. Prediction Health

Restated unchanged from that document Sections 7, 10 — model-unavailable or out-of-distribution rejection rate, and (per [model-lifecycle-implementation.md](../13_AI_Intelligence_Implementation/model-lifecycle-implementation.md) Section 9) drift-detection findings.

## 13. Simulation Health

Restated unchanged from that document Sections 8, 10 — non-runnable scenario rejection rate; a detected sandbox violation (AD-DE-004) is treated as a critical health event, not a routine metric.

## 14. Recommendation Health

Restated unchanged from that document Sections 9–10 — insufficient-evidence rejection rate for Recommendation requests.

## 15. Ingestion Health

Restated unchanged from [data-and-pipeline-testing.md](../14_Testing_Security_Observability/data-and-pipeline-testing.md) Section 15 — failed/retried ingestion run rate, quarantine rate.

## 16. Data Freshness

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 10 — records/Evidence exceeding expected freshness, surfaced as an operational signal rather than only a per-response disclosure.

## 17. Error Rates

Restated unchanged from Section 7, tracked per component/layer so a spike is attributable (e.g., distinguishing an elevated GIS error rate from an elevated AI-provider error rate).

## 18. Resource Usage

Compute/memory/storage utilization is monitored qualitatively against each workload's characteristic (restated from [infrastructure-requirements.md](infrastructure-requirements.md)) — no specific utilization percentage threshold is defined.

## 19. Audit Events

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 2 and FR-036/FR-037 — administrative actions, AI recommendation review, and configuration changes ([configuration-and-secrets-operations.md](configuration-and-secrets-operations.md) Section 13) are all monitored as a distinct, immutable event category.

## 20. Logs, Metrics, Traces

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Sections 2–9 — this document adds no new signal type, only the operational practice of watching them.

## 21. Alerts

An alert notifies a responsible party when a monitored signal (Sections 6–19) exceeds its normal/expected pattern — restated as a concept only; **no specific alerting tool or numeric alert threshold is defined**, consistent with [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 6.

## 22. Dashboards

An operational dashboard (distinct from the DistrictMind product's own end-user dashboard, FR-016) visualizes the signals in Sections 6–19 for operators — no specific dashboarding tool is selected.

## 23. Operational Investigation

Restated unchanged from [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 18 and [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 3 — an operator investigating a reported issue traces the correlation ID/AI Run ID through every layer it touched, reconstructing the full request/plan/tool-call/evidence chain without needing to guess at intermediate state.

## 24. Distinguishing the Six Information Categories — Restated

Restated unchanged from [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 13 — every operational signal that carries a data value also carries its state-category label, so an operator can distinguish, e.g., a Prediction-serving health issue from an unrelated Source-ingestion health issue rather than seeing one undifferentiated "data problem" signal.

## 25. Security

Access to operational monitoring tooling is itself restricted per [networking-and-access.md](networking-and-access.md) Section 10 (Monitoring Access) — read-only, scoped, and never a path to bypass the Database/GIS access restrictions elsewhere in that document.

## 26. Milestone Traceability

| Operational Monitoring Scope | First Needed |
|---|---|
| Infrastructure/API/database health | M1 |
| GIS health | M1–M2 |
| AI/retrieval health | M3 |
| Prediction health | M4 |
| Simulation/Recommendation health | M5, M6 |

## 27. Open Decisions

- Monitoring/alerting/dashboarding platform — Unresolved, restated from [technology-stack.md](../00_Engineering_Overview/technology-stack.md).
- No monitoring threshold value is defined anywhere in this document.
