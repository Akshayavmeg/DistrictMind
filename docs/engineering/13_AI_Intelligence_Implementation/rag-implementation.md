---
Document Name: RAG Implementation
Document ID: ED-AII-RAG-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# RAG Implementation

## 1. Purpose

This document defines the implementation approach for Retrieval-Augmented Generation (RAG) as a source of *contextual* knowledge for the AI Agent, distinct from the *structured* district data served by Typed Tools ([typed-tool-implementation.md](typed-tool-implementation.md)). No vector database or embedding provider is selected here — all remain Candidate ([technology-stack.md](../00_Engineering_Overview/technology-stack.md)).

## 2. Why RAG Is Needed

The Agent must sometimes ground its reasoning in unstructured contextual material that no typed tool exposes — e.g., a policy document, a disaster-response guideline, or a government scheme description referenced in the Abstract's decision-support framing. RAG addresses this specific gap; it is not a substitute for typed-tool-mediated structured data retrieval.

## 3. Authoritative vs. Contextual Knowledge

| Type | Source | Example | Access Path |
|---|---|---|---|
| Authoritative (structured) | Curated/Derived/Prediction/Simulation/Recommendation state | District population, coverage-gap result, flood risk score | Typed Tool ([typed-tool-implementation.md](typed-tool-implementation.md)) |
| Contextual (unstructured) | Ingested documents | A disaster-response SOP, a scheme eligibility document | RAG retrieval |

**A number, spatial result, or business determination is never sourced from RAG.** RAG supplies explanatory or policy context; it never substitutes for a typed tool's authoritative output — restated consistent with [ai-implementation-architecture.md](ai-implementation-architecture.md) Section 6.

## 4. When Typed Tools Should Be Preferred Over RAG

| Situation | Preferred Path |
|---|---|
| "What is the population of District X?" | Typed Tool (`get_demographics`) |
| "Which areas are outside 10 km healthcare coverage?" | Typed Tool (`coverage_analysis`) |
| "What does the district disaster-response guideline say about flood evacuation?" | RAG |
| "What government scheme applies to a healthcare facility gap?" | RAG |

The Agent's planning stage ([ai-runtime-architecture.md](ai-runtime-architecture.md) Section 5) selects RAG only when no typed tool can answer the informational need.

## 5. Ingestion Boundary

RAG-ingested documents pass through a boundary distinct from, but structurally parallel to, the data ingestion pipeline ([data-ingestion-implementation.md](../12_Data_GIS_Implementation/data-ingestion-implementation.md)): a document is admitted only from a defined, governed source ([data-governance-implementation.md](../12_Data_GIS_Implementation/data-governance-implementation.md) classification scheme applies equally here) — no document is retrievable by the Agent merely by having been uploaded somewhere.

## 6. Preprocessing

Document normalization (text extraction, format handling) occurs prior to chunking — restated conceptually parallel to [data-transformation-implementation.md](../12_Data_GIS_Implementation/data-transformation-implementation.md), without inventing a specific parsing library.

## 7. Chunking Concept

Documents are divided into retrievable chunks sized to balance retrieval precision against context completeness — no specific chunk-size value is invented; this remains a tuning decision.

## 8. Metadata

Each chunk carries: source document identifier, document version, ingestion timestamp, section/position within the document, and classification (per [data-governance-implementation.md](../12_Data_GIS_Implementation/data-governance-implementation.md)) — this metadata is what makes citation and provenance (Section 12) possible.

## 9. Embedding

Elaborated in [embedding-and-retrieval-implementation.md](embedding-and-retrieval-implementation.md). No embedding model is selected here.

## 10. Indexing

Elaborated in [embedding-and-retrieval-implementation.md](embedding-and-retrieval-implementation.md) Section 4.

## 11. Retrieval, Filtering, Ranking, Context Assembly

Elaborated in [embedding-and-retrieval-implementation.md](embedding-and-retrieval-implementation.md) Sections 5–8. At this layer: retrieved chunks are assembled into a bounded context window alongside any Evidence already collected from Typed Tools, clearly labeled by source type (structured Evidence vs. retrieved contextual chunk) so the Agent — and ultimately the response's provenance — never conflates the two.

## 12. Grounding and Citation/Provenance

Every RAG-retrieved chunk used in a response carries its source document identifier and version into the response's provenance chain ([grounding-and-evidence-implementation.md](grounding-and-evidence-implementation.md)) — a claim drawn from a retrieved document is never presented without attribution, restated unchanged from the Claim→Evidence→Source policy established in [ai-safety-and-grounding.md](../07_AI_GIS_and_Intelligence/ai-safety-and-grounding.md).

## 13. Freshness and Versioning

A retrieved chunk's freshness (time since the source document was last updated/re-ingested) is tracked and disclosed alongside its content, consistent with the freshness discipline applied to structured data ([data-lineage-and-provenance-implementation.md](../12_Data_GIS_Implementation/data-lineage-and-provenance-implementation.md)).

## 14. Stale or Conflicting Documents

| Condition | Behavior |
|---|---|
| A newer version of a document exists | The newer version is preferred for retrieval; the superseded version is retained for audit but not served as current |
| Two ingested documents conflict on a factual point | Both are retrievable; the response discloses the conflict rather than silently picking one, consistent with the source-conflict discipline in [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 7 |

## 15. Retrieval Failure

If retrieval returns no relevant chunk, the Agent discloses that no contextual document was found rather than fabricating an answer from general model knowledge — restated unchanged from the fail-safe principle in [ai-safety-implementation.md](ai-safety-implementation.md) Section 8.

## 16. Hallucination Prevention

RAG's core safety contribution is constraining the Agent's contextual claims to retrievable, attributable source text — elaborated fully in [ai-safety-implementation.md](ai-safety-implementation.md) Section 2.

## 17. Access Control

Retrieval respects the same authorization scope as any other AI request — a document classified as restricted to certain roles is not retrievable outside that scope, restated unchanged from [authorization-implementation.md](../09_Backend_Implementation/authorization-implementation.md).

## 18. District Scope

Where an ingested document is district-specific (e.g., a Warangal-specific disaster-response annex, should one ever be ingested), retrieval is scoped to the requesting user's authorized district(s) — consistent with the district-scoped authorization model established throughout `06_API_and_Integration/`. No Warangal-specific document is assumed to exist; this is a scoping rule, not a claim about ingested content.

## 19. Observability

Every retrieval call emits a trace event (query, chunks returned, scores if applicable) under the request's correlation ID — restated unchanged from [ai-runtime-architecture.md](ai-runtime-architecture.md) Section 18.

## 20. Evaluation

Retrieval quality is a distinct evaluation category, elaborated in [ai-evaluation-implementation.md](ai-evaluation-implementation.md) Section 6 — no benchmark value is invented here.

## 21. Security

Ingested documents are untrusted content until validated — restated and elaborated in [ai-safety-implementation.md](ai-safety-implementation.md) Section 5 (malicious retrieved content, prompt injection via ingested text).

## 22. Milestone Traceability

| RAG Capability | First Needed |
|---|---|
| Contextual document retrieval for AI responses | M3 |

## 23. Open Decisions

- Vector database — Candidate (pgvector/Chroma/Qdrant/Weaviate), unresolved.
- RAG framework — Candidate, unresolved.
- Chunking strategy specifics — unresolved, intentionally left as a tuning decision.
