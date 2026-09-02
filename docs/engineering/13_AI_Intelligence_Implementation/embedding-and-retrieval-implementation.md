---
Document Name: Embedding and Retrieval Implementation
Document ID: ED-AII-EMBED-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Embedding and Retrieval Implementation

## 1. Purpose

This document elaborates the embedding and retrieval mechanics referenced by [rag-implementation.md](rag-implementation.md). No embedding model or vector database is selected here.

## 2. Embedding Lifecycle

```mermaid
flowchart LR
    Chunk[Document Chunk] --> Embed[Embedding Generation]
    Embed --> Vector[Vector + Metadata]
    Vector --> Index[Index]
    Index --> Retrieve[Retrieval at Query Time]
```

## 3. Embedding Inputs and Metadata

Each chunk (per [rag-implementation.md](rag-implementation.md) Section 8) is embedded together with its identifying metadata carried alongside the resulting vector: source document identifier, document version, chunk position, classification. The embedding model's own identifier/version is also recorded per vector, since it determines the embedding's compatibility (Section 12).

## 4. Indexing Lifecycle

Vectors are added to an index at ingestion time; the index is the retrieval-time lookup structure. No specific indexing algorithm (e.g., HNSW, IVF) is selected — that remains a property of whichever vector database is eventually confirmed.

## 5. Retrieval Query Lifecycle

```mermaid
flowchart LR
    Query[Agent's Retrieval Query] --> QEmbed[Query Embedding]
    QEmbed --> Search[Semantic Search]
    Search --> Filter[Metadata Filtering]
    Filter --> Rank[Ranking]
    Rank --> Dedup[Duplicate Removal]
    Dedup --> Select[Evidence Selection]
```

## 6. Semantic Retrieval

The Agent's information need (derived during planning, [ai-runtime-architecture.md](ai-runtime-architecture.md) Section 5) is embedded using the same model/version as the indexed chunks, and compared for semantic similarity — no specific similarity function is mandated here.

## 7. Metadata Filtering

Retrieval may be narrowed by metadata before or after semantic search — e.g., restricting to documents within the requesting user's district authorization scope (Section 18, [rag-implementation.md](rag-implementation.md)) or a required classification level.

## 8. Hybrid Retrieval Concept

A combination of semantic similarity and keyword/metadata matching (hybrid retrieval) may improve precision for queries with specific named entities (e.g., a facility name); this is noted as a conceptual option, not committed, and only justified if semantic-only retrieval proves insufficient — consistent with "do not overengineer."

## 9. Ranking and Top-K Concept

Retrieved chunks are ranked by relevance; only the top-ranked subset is passed into context assembly. **No fixed top-k number is invented** — the appropriate count is a tuning decision balancing context completeness against context window limits.

## 10. Duplicate Removal

Where multiple chunks (potentially from different document versions or overlapping sections) convey substantially the same content, retrieval deduplicates before context assembly, to avoid redundant or repetitive context.

## 11. Source Prioritization

Where multiple relevant chunks exist, more authoritative or fresher sources are prioritized — restated consistent with the source-precedence discipline in [data-gis-integration.md](../12_Data_GIS_Implementation/data-gis-integration.md) Section 7, applied here to contextual documents rather than structured data.

## 12. Freshness, District Scoping, Evidence Selection

Restated unchanged from [rag-implementation.md](rag-implementation.md) Sections 13 and 18. The final selected set of chunks becomes contextual Evidence, tagged distinctly from typed-tool Evidence ([grounding-and-evidence-implementation.md](grounding-and-evidence-implementation.md)).

## 13. Retrieval Confidence

Where the underlying retrieval mechanism produces a similarity score, that score may inform whether a chunk is included at all (a low-similarity result is excluded rather than force-included) — no fixed numeric threshold is invented; the exclusion criterion remains a tuning decision.

## 14. Retrieval Failure

Restated unchanged from [rag-implementation.md](rag-implementation.md) Section 15.

## 15. Stale-Index Handling

If a document is re-ingested (a new version), its prior vectors are superseded/removed from active retrieval rather than left to compete with the current version's vectors — restated consistent with the versioning discipline in Section 16.

## 16. Re-Indexing, Model/Version Changes, Embedding Compatibility

**Embeddings produced by different model versions are not directly comparable.** A change to the embedding model or its version requires re-embedding the full corpus before the new model is used for retrieval against it — mixing vectors from incompatible model versions in one index is treated as a data-integrity defect, not an acceptable shortcut. This mirrors the training-serving consistency discipline applied to Prediction features ([feature-engineering-implementation.md](feature-engineering-implementation.md) Section 10).

## 17. Storage Abstraction

The embedding/index store is accessed through an abstraction consistent with the Repository pattern used elsewhere ([repository-layer-design.md](../09_Backend_Implementation/repository-layer-design.md)) — no application code outside this abstraction directly addresses the underlying vector database, so a future vector-database selection change does not ripple through the Agent or RAG layers.

## 18. Observability

Every embedding generation, indexing operation, and retrieval query emits a trace event — restated unchanged from [ai-runtime-architecture.md](ai-runtime-architecture.md) Section 18 and [rag-implementation.md](rag-implementation.md) Section 19.

## 19. Milestone Traceability

| Capability | First Needed |
|---|---|
| Embedding generation, indexing, semantic retrieval | M3 |

## 20. Open Decisions

- Embedding model/provider — Candidate, unresolved (restated from the AI-provider divergence, [ED-M4-P2-VALIDATION.md](ED-M4-P2-VALIDATION.md) Section 27).
- Vector database/index type — Candidate, unresolved.
- Hybrid retrieval adoption — not committed, conditional on future need.
