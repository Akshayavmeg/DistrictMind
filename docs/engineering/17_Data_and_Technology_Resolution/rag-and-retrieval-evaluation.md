---
Document Name: RAG and Retrieval Evaluation
Document ID: ED-DTR-RAGEVAL-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-09-02
Last Updated: 2026-09-02
---

# RAG and Retrieval Evaluation

## 1. Purpose

This document defines evaluation requirements for RAG/retrieval technology. **No embedding model, vector database, or RAG framework is selected.** Candidates discussed are only those already present in [technology-stack.md](../00_Engineering_Overview/technology-stack.md): pgvector (Candidate), Chroma (Candidate), Qdrant/Weaviate (To Be Evaluated).

## 2. Existing Candidates — Status Restated Unchanged

| Technology | Status | Source | Stated Rationale |
|---|---|---|---|
| pgvector | Candidate | [technology-stack.md](../00_Engineering_Overview/technology-stack.md) Section 4.6 | Operational simplicity if PostgreSQL is confirmed |
| Chroma | Candidate | Same | Ease of local development, embedding workflow fit |
| Qdrant / Weaviate | To Be Evaluated | Same | Scale requirements, hosting complexity |

No status above is changed by this document. No embedding model is named anywhere in [technology-stack.md](../00_Engineering_Overview/technology-stack.md) — this remains a fully open evaluation dimension (Section 6).

## 3. Evaluation Dimensions

| Dimension | Requirement Source |
|---|---|
| Document ingestion | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 5 |
| Chunking | Same, Section 7 |
| Embeddings | [embedding-and-retrieval-implementation.md](../13_AI_Intelligence_Implementation/embedding-and-retrieval-implementation.md) Sections 2–3 |
| Vector storage | Same, Section 4 |
| Retrieval | Same, Sections 5–6 |
| Reranking (if applicable) | Same, Section 8 (hybrid retrieval concept, not committed) |
| Provenance | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 12 |
| Evidence retrieval | [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) |
| Freshness | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 13 |
| Grounding | [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 2 |
| Citation/evidence attachment | [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md) Section 12 |
| Access control | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 17 |
| Hallucination resistance | Same, Section 16 |
| Retrieval quality | [ai-evaluation-implementation.md](../13_AI_Intelligence_Implementation/ai-evaluation-implementation.md) Section 6 |
| Source traceability | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 4 (metadata) |
| Update handling | [embedding-and-retrieval-implementation.md](../13_AI_Intelligence_Implementation/embedding-and-retrieval-implementation.md) Sections 15–16 |
| Latency | [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) — no numeric target invented |
| Scalability | [scalability-and-capacity.md](../15_Deployment_Infrastructure_Operations/scalability-and-capacity.md) Section 12 |
| Operational complexity | Restated from Qdrant/Weaviate's own stated evaluation criteria |

## 4. Evaluation Matrix — Vector Storage

| Dimension | pgvector | Chroma | Qdrant/Weaviate |
|---|---|---|---|
| Coupling to database decision | Directly coupled to [database-technology-evaluation.md](database-technology-evaluation.md) outcome | Independent | Independent |
| Operational simplicity | To Be Evaluated | To Be Evaluated | To Be Evaluated |
| Scale ceiling | To Be Evaluated | To Be Evaluated | To Be Evaluated (explicitly flagged as its own evaluation criterion) |
| Hosting complexity | To Be Evaluated | To Be Evaluated | To Be Evaluated (explicitly flagged) |

**Every cell reads "To Be Evaluated."**

## 5. Document Ingestion and Chunking

Restated unchanged from [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Sections 5–7: any candidate technology must support the same governed-source ingestion boundary and metadata attachment (document identifier, version, ingestion timestamp) already architected — no chunk-size value is invented here, consistent with that document's own refusal to fix one.

## 6. Embeddings — No Model Named

**No embedding model is named as a candidate anywhere in prior documentation.** This is a fully open evaluation dimension: a future evaluation must first identify candidate embedding models (which may itself depend on the AI provider decision, per [ai-technology-evaluation.md](ai-technology-evaluation.md) Section 3, since some providers bundle their own embedding models) before this document's evaluation dimensions (Section 3) can be meaningfully applied.

## 7. Retrieval and Reranking

Restated unchanged from [embedding-and-retrieval-implementation.md](../13_AI_Intelligence_Implementation/embedding-and-retrieval-implementation.md) Sections 5–9: hybrid retrieval (semantic + keyword) is a noted concept, not committed — evaluated only if semantic-only retrieval proves insufficient once real evaluation occurs, consistent with "do not overengineer."

## 8. Provenance and Citation

Restated unchanged from [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 12: any candidate technology must preserve source document identifier and version through to the final AI Response citation — a technology that discards this metadata during retrieval is disqualified regardless of retrieval quality.

## 9. The Claim → Evidence → Source → Timestamp → Transformation → Confidence Chain — Restated

**This chain, restated unchanged from [grounding-and-evidence-implementation.md](../13_AI_Intelligence_Implementation/grounding-and-evidence-implementation.md), governs every RAG/retrieval technology evaluation.** A retrieved chunk used in a response must carry its Source and Timestamp (Sections 4–5 of that document); any Transformation applied (chunking, embedding) must be traceable; and Confidence is communicated only where the retrieval mechanism itself produces a genuine similarity/relevance signal — never fabricated.

## 10. Access Control

Restated unchanged from [rag-implementation.md](../13_AI_Intelligence_Implementation/rag-implementation.md) Section 17: any candidate vector store must support scoping retrieval to the requesting user's authorized district/classification level — a technology lacking any access-control primitive would require significant additional engineering to satisfy this requirement.

## 11. Hallucination Resistance

Restated unchanged from Section 16 of that document: the retrieval mechanism itself is not what prevents hallucination (that is a response-validation-stage responsibility, [ai-runtime-architecture.md](../13_AI_Intelligence_Implementation/ai-runtime-architecture.md) Section 9) — but a retrieval technology that cannot reliably indicate "no relevant result found" (forcing a low-quality match to always be returned) is a poor fit, since it removes the signal the validation stage needs.

## 12. Update Handling

Restated unchanged from [embedding-and-retrieval-implementation.md](../13_AI_Intelligence_Implementation/embedding-and-retrieval-implementation.md) Section 16: a candidate must support re-indexing when a document is updated or when the embedding model itself changes version, without silently mixing incompatible-version vectors in one index.

## 13. Latency and Scalability

No numeric latency target or corpus-size threshold is invented — restated consistent with this program's discipline throughout. Evaluation is qualitative: does retrieval remain responsive enough not to dominate overall AI response time (restated from [performance-and-responsiveness-testing.md](../14_Testing_Security_Observability/performance-and-responsiveness-testing.md) Section 3)?

## 14. Security

RAG/retrieval technology evaluation includes whether the candidate treats retrieved content as untrusted data rather than executable instruction — restated unchanged from [ai-safety-implementation.md](../13_AI_Intelligence_Implementation/ai-safety-implementation.md) Section 5 and [security-and-trust-boundary-matrix.md](../16_Engineering_Readiness_and_Baseline/security-and-trust-boundary-matrix.md) Section 4.

## 15. Observability

RAG/retrieval technology evaluation includes whether the candidate supports per-query trace logging (query, chunks returned, scores) consistent with [observability-and-monitoring.md](../14_Testing_Security_Observability/observability-and-monitoring.md) Section 5.

## 16. Milestone Traceability

| RAG/Retrieval Decision | First Needed |
|---|---|
| Embedding model, vector database, RAG framework | M3 |

## 17. Open Decisions

**No embedding model, vector database, or RAG framework is selected by this document.** pgvector and Chroma remain exactly as Candidate; Qdrant/Weaviate remain To Be Evaluated, per [technology-stack.md](../00_Engineering_Overview/technology-stack.md). No embedding model candidate exists in any prior documentation.
