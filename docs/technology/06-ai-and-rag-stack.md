---
Document Name: AI and RAG Stack
Document ID: DM-TB-06
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# AI and RAG Stack

Written for: engineers building the AI assistant after the first vertical slice, and the reviewer.

## 1. Scope

**AI is not the first dependency.** The first vertical slice (see [14](14-development-architecture-baseline.md)) contains no AI. Everything here applies from the AI phase onward, and every AI technology is development-only.

## 2. Stack

| Component | Status | Role |
|---|---|---|
| Ollama | SELECTED FOR DEVELOPMENT (dev provider only) | Local LLM runtime |
| LangGraph | SELECTED FOR DEVELOPMENT (not needed for the first slice) | Agent workflow |
| LangChain | CANDIDATE, use only where justified | Integration abstractions |
| sentence-transformers | SELECTED FOR DEVELOPMENT (experiments) | Embeddings |
| ChromaDB | SELECTED FOR DEVELOPMENT (development RAG store) | Vector store |

All: PRODUCTION NOT CONFIRMED.

## 3. The AI Provider Status — Stated Plainly

- **Ollama is the initial development provider.** It was chosen because it runs locally, sends no data outside the machine, and was already exercised in ED-M6 Part 3.
- **The AI provider remains UNRESOLVED at the production architecture level.** The divergence between ED-M1's hosted Claude/Anthropic-centered candidate list and the Blueprint's local-first Llama 3/Ollama proposal is unchanged.
- Choosing Ollama for development is not a provider decision. The earlier governance rule still applies: a provider is not selected merely because an API is easy to call.

## 4. Observed Evidence (ED-M6 Part 3, EV-M6-P3-004)

| Test | Result |
|---|---|
| Single-step tool selection (`llama3.2:3b`) | PASS |
| Multi-step tool sequencing | PARTIAL: selected only the entry-point tool |
| Grounded answer when evidence is present | PASS |
| Honest decline when evidence is absent | PASS |

These are four single, unrepeated runs. They are not benchmarks and support no accuracy claim. The observed Ollama version is 0.34.4 (ED-M6 Part 3 recorded 0.33.2 earlier). The only model installed is `llama3.2:3b`.

## 5. Typed-Tool Boundary (Non-Negotiable)

```
User → AI Assistant API → LangGraph Agent → Intent/Planning → Typed Tool → Authorization → Application Service → Evidence/Data → Grounded Response
```

- The agent may only call **typed tools** (16 documented, [ai-tool-contracts.md](../engineering/06_API_and_Integration/ai-tool-contracts.md)).
- Every tool call is authorized (AD-DE-005, AD-DB-006, AD-API-002).
- The model never writes SQL and never touches the database or filesystem.
- Minimum-sufficient tool planning (AD-AI-004) limits tool calls.

## 6. Response Requirements

Every AI response carries, per claim: **Claim, Evidence, Source, Timestamp, Transformation, Confidence.** No numeric confidence is invented; numeric confidence comes only from a validated method (AD-AI-003).

Unrestricted autonomous behavior is not implemented.

## 7. RAG Pipeline (Development)

```
Documents → Parsing → Chunking → Embeddings (sentence-transformers) → ChromaDB → Retriever → Evidence → LLM (Ollama)
```

RAG is a development capability. **No production retrieval quality is claimed.**

## 8. RAG Evaluation (Required Before Any Quality Claim)

| Dimension | Test |
|---|---|
| Retrieval relevance | Do retrieved chunks answer the question? |
| Groundedness | Is each claim supported by a retrieved chunk? |
| Citation/provenance | Does every claim carry a traceable source? |
| Hallucination | Are unsupported claims produced when evidence is absent? |
| Staleness | Is a retrieved document's date disclosed and current? |

None of these has been run.

## 9. Known Contradictions Preserved

- **D-4:** RG-TECH-007 and [rag-and-retrieval-evaluation.md](../engineering/17_Data_and_Technology_Resolution/rag-and-retrieval-evaluation.md) §6 say no embedding candidate exists in prior documentation. [dependency-management.md](../engineering/08_Implementation_Foundation/dependency-management.md) names Sentence Transformers, FAISS, and ChromaDB as Candidates. Both statements remain; this baseline selects sentence-transformers for experiments only.
- **ChromaDB is an initial development choice**, not a production vector-store decision. pgvector (on PostgreSQL) remains a Candidate and the likely comparison point.

## 10. Local Environment Requirement

Local LLM inference is compute-bound. A 3B model has run on this machine. Larger models may not fit. Hardware limits are unmeasured and are not claimed.

## 11. Not Selected

LangChain as a default layer; FAISS (named as a Candidate, not in the baseline); hosted providers (unresolved, not chosen for development).

## 12. Security

No API key is required for Ollama. Any future hosted provider's credentials come only from environment variables, never from documentation or version control. No prompt containing real user or non-development data is sent to any external provider without a governance decision.

## 13. Open Decisions

AI provider (production); model choice beyond `llama3.2:3b`; LangGraph PoC; RAG evaluation; embedding model choice beyond experiments; vector store for production.
