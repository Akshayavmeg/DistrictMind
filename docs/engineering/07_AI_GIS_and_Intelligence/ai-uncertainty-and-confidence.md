---
Document Name: AI Uncertainty and Confidence
Document ID: ED-AI-UNC-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# AI Uncertainty and Confidence

## 1. Purpose

This document distinguishes confidence, uncertainty, data quality, prediction accuracy, evidence strength, and recommendation strength — six related but distinct concepts DistrictMind must never conflate — and defines how each is communicated to users. **Confidence is not truth.** No arbitrary numerical threshold is defined in this document.

## 2. The Six Concepts, Distinguished

| Concept | Definition | Where It Applies | Numeric? |
|---|---|---|---|
| **Confidence** | A model's own self-reported estimate of how reliable its output is (e.g., a Prediction's confidence interval, NFR-032) | Prediction, Simulation (informally, via sensitivity) | Only when a validated method provides it |
| **Uncertainty** | The inherent unpredictability of the thing being estimated, distinct from the model's confidence about its own estimate | Predictions of inherently volatile phenomena (e.g., rainfall) carry irreducible uncertainty regardless of model quality | Rarely a single number; often better expressed as a range or qualitative statement |
| **Data quality** | How complete, accurate, and fresh the underlying Observed data is ([data-quality.md](../04_Data_Engineering/data-quality.md)) | All categories — a low-quality input degrades every downstream Derived/Predicted/Simulated/Recommended output | Metrics defined in [data-quality.md](../04_Data_Engineering/data-quality.md) Section 3, all still unset (Proposed/Initial Target) |
| **Prediction accuracy** | How well a model has historically performed against known outcomes (a backtested/evaluated property of the model itself) | Prediction only — meaningless for Simulation, since a hypothetical has no historical "actual" to compare against | A model evaluation metric, per [model-lifecycle.md](model-lifecycle.md) — no metric is invented in this document |
| **Evidence strength** | How directly and completely a claim is supported by retrieved Evidence (a lot of directly relevant, fresh evidence vs. a little indirect, stale evidence) | AI Response grounding ([ai-safety-and-grounding.md](ai-safety-and-grounding.md)) | Not numeric — described qualitatively (e.g., "based on a single, five-year-old observation" vs. "based on three recent, consistent observations") |
| **Recommendation strength** | How well-supported a Recommendation's evidence chain is, combining Evidence strength across every cited Analytical Result/Prediction/Scenario Output | Recommendation only | Not numeric — a Recommendation's justification text names its supporting evidence explicitly; strength is assessed by a human reviewer reading that evidence, not by a system-assigned score presented as objective |

## 3. Why "Confidence Is Not Truth"

A Prediction with a high stated confidence can still be wrong — confidence describes the model's own estimate of its reliability under the conditions it was trained and evaluated on, not a guarantee about the specific instance being predicted. Presenting a confidence value as if it were a truth-guarantee would violate both the Explainable AI and Fail-Safe Behavior principles ([engineering-principles.md](../00_Engineering_Overview/engineering-principles.md)). DistrictMind's structural response to this (per [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md)) is that a Prediction, however confident, remains structurally and presentationally a Prediction — never promotable to Fact status.

## 4. No Arbitrary Numerical Thresholds

This document does not define, for example, "confidence below 60% should be flagged" or any similar threshold. Such thresholds require a validated method behind them (e.g., a specific model's own calibration study) — inventing one here would itself be an instance of False Precision ([ai-safety-and-grounding.md](ai-safety-and-grounding.md) Section 7). Where a specific model eventually provides a genuine, methodologically justified confidence value (per NFR-032's "where methodologically feasible"), that value is used as-is and disclosed with its source method named; no other numeric confidence value is fabricated anywhere in DistrictMind's outputs.

**AD-AI-003 — No Fabricated Numeric Confidence; Numeric Confidence Only From a Validated Model Method**
- **Context:** It would be tempting, for UI polish, to attach a numeric confidence score to every AI-influenced output (predictions, recommendations, even AI responses) so the interface looks consistently quantified — but most of these outputs have no statistically valid basis for a single number.
- **Decision:** A numeric confidence value is displayed only when it originates from a validated model method that actually produces one (e.g., a Prophet confidence interval, an XGBoost prediction interval — NFR-032). Every other output (Recommendation strength, AI Response evidence strength, Simulation sensitivity) is communicated qualitatively (Section 5–7), never assigned an invented number.
- **Alternatives considered:** A uniform 0–100% "confidence" score applied to every output type for interface consistency (rejected — this is precisely the False Precision failure mode named in [ai-safety-and-grounding.md](ai-safety-and-grounding.md) Section 7, and would misrepresent categories like Recommendation strength that have no valid numeric basis).
- **Reasoning:** Directly required by the milestone brief ("do not define arbitrary numerical thresholds... numerical confidence values should only be used when a validated method/model provides them") and consistent with Explainable AI and Fail-Safe Behavior.
- **Trade-offs:** A less uniform-looking interface (some outputs show a number, others show qualitative language) — accepted because uniformity here would be dishonest, not merely stylistic.
- **Consequences:** [prediction-architecture.md](prediction-architecture.md) Section 4's per-domain "Uncertainty" fields distinguish which domains actually specify a numeric confidence mechanism (few do, per the Blueprint) from those where none is specified.
- **Status:** Proposed.

## 5. Communicating Uncertainty to Users — By State Category

This is the direct realization of the milestone brief's own examples, applied consistently across every state category from [digital-twin-state-model.md](../05_Database_Design/digital-twin-state-model.md):

| State Category | Communication Pattern (Illustrative Phrasing) |
|---|---|
| **Observed** | *"Rainfall recorded at [station] on [date] was [value]."* — stated as fact, with source and timestamp, no confidence language (Observed data is not itself uncertain in this sense; its *quality* may still be disclosed separately, per data-quality metadata) |
| **Derived** | *"Based on currently available facility data, [N] villages fall outside the 10 km coverage threshold."* — stated as a computed fact, with its computation basis named |
| **Predicted** | *"The model estimates rainfall of approximately [value] for [period], based on historical patterns; this is a forecast, not a certainty."* — explicitly hedged, confidence disclosed if available |
| **Scenario** | *"Under the assumed scenario (bridge R42 closed), estimated travel time to the nearest hospital increases from [X] to [Y] minutes. This reflects a hypothetical condition, not an event that has occurred."* — explicitly hypothetical framing |
| **Recommendation** | *"Based on the evaluated coverage gap, population growth forecast, and accessibility analysis, the system recommends [candidate] as a strong candidate for a new facility. This is a suggestion for human review, not a directive."* — explicitly advisory framing, per Human-in-the-Loop |
| **AI Interpretation** | The AI Response itself is framed as the system's synthesis of the above, with every claim's category (Observed/Derived/Predicted/Scenario/Recommendation) evident from its phrasing and its resolvable citation ([evidence-provenance-flow.md](../06_API_and_Integration/evidence-provenance-flow.md)) |

## 6. Evidence Strength in Practice

An AI Response's evidence strength is disclosed by what it names, not by a manufactured score: *"based on a single weather station's data from three months ago"* conveys weaker evidence strength than *"based on consistent readings from four stations over the past year"* — both are honest disclosures of what was actually retrieved, never inflated to sound more authoritative than the underlying Evidence supports.

## 7. Recommendation Strength in Practice

A Recommendation's strength is conveyed by the completeness and recency of its cited evidence chain (Section 24 of [data-architecture.md](../04_Data_Engineering/data-architecture.md); [recommendation-engine.md](recommendation-engine.md)) — a recommendation citing a fresh coverage analysis, a recent population forecast, and a completed accessibility simulation is stronger than one citing only a single stale indicator, and the justification text must let a human reviewer see this difference, not obscure it behind a single opaque score.

## 8. Milestone Traceability

| Capability | Milestone |
|---|---|
| Observed/Derived state-category phrasing discipline | M2 — Future |
| AI Interpretation framing across all categories | M3 — Future |
| Predicted confidence disclosure | M4 — Future |
| Scenario hypothetical framing | M5 — Future |
| Recommendation strength disclosure | M6 — Future |

## 9. Open Decisions

- Exact illustrative phrasing in Section 5 is conceptual, not a fixed UI copy specification — final wording is a future UX/content-design task, not resolved here.
- Whether a qualitative (not numeric) evidence-strength indicator is ever surfaced as a structured field vs. only conveyed through response phrasing — **Under Evaluation**.
