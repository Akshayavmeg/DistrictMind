---
Document Name: Project Assumptions
Document ID: ED-ASSUMP-001
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-08-31
Last Updated: 2026-08-31
---

# Project Assumptions

## Purpose

This document records assumptions that architecture and implementation may initially rely on, in the absence of confirmed facts. Assumptions are distinct from constraints ([constraints.md](constraints.md)): a constraint is an external limitation; an assumption is a working belief that may later be validated or invalidated.

## Assumptions Register

| ID | Assumption | Reason | Risk if False | Validation Method | Status |
|---|---|---|---|---|---|
| AS-001 | Telangana district and mandal boundary data is available in a usable digital format (e.g., shapefile or GeoJSON) from a public or government source. | GIS features (M1) require boundary geometry to function at all. | GIS/Digital Twin layer cannot be built as scoped without sourcing or digitizing boundary data, delaying M1. | Research/source publicly available Telangana GIS boundary datasets during architecture design. | Unvalidated |
| AS-002 | Multi-domain district indicator data (health, education, infrastructure, etc.) will become available for ingestion during M2, even if not currently in hand. | M2 (District Intelligence) is scoped on the premise that real district data will be sourced. | If data is unavailable or heavily restricted, M2 scope must be reduced or delayed. | Confirm data source availability and access terms before committing to M2 architecture. | Unvalidated |
| AS-003 | The primary users of DistrictMind are district-level administrators with domain knowledge but not necessarily deep technical expertise. | Shapes usability and explainability requirements (see NFR-017, Explainable AI principle). | UI/UX and AI explanation design may be miscalibrated for actual users (e.g., too technical or too simplistic). | Confirm target user profile with project stakeholders before UI/UX design. | Unvalidated |
| AS-004 | A single LLM provider will be sufficient for both the Grounded AI Assistant (M3) and Agentic Intelligence (M6) capabilities. | Simplifies initial AI architecture and vendor evaluation. | Multi-agent orchestration (M6) may require different model capabilities (e.g., cost/latency trade-offs per agent) not met by a single provider. | Revisit during M6 architecture design once agent responsibilities are defined. | Unvalidated |
| AS-005 | The system will initially be used by a modest number of concurrent users (tens, not thousands), consistent with a district-administration audience. | Informs initial scalability targets (see NFR-006). | If actual concurrent usage is significantly higher, initial architecture may require earlier scaling work than planned. | Confirm expected user base size with stakeholders; monitor real usage post-launch. | Unvalidated |
| AS-006 | DistrictMind will be evaluated in academic/hackathon and technical review contexts in addition to potential real administrative use. | Stated explicitly in the documentation quality requirements for this milestone. | Documentation or design choices optimized purely for production robustness may not suit evaluation timelines, or vice versa. | Confirm evaluation context and timeline with stakeholders as the project proceeds. | Unvalidated |
| AS-007 | English (and possibly Telugu) will be the primary language(s) for the user interface and AI assistant interactions. | Telangana state context suggests Telugu relevance; no localization requirement has been stated explicitly. | Significant rework may be needed if additional language support is required later, especially for AI assistant grounding and prompts. | Confirm language/localization requirements with stakeholders before M3 AI assistant design. | Unvalidated |
| AS-008 | Cloud-hosted infrastructure is an acceptable deployment model (as opposed to a strict on-premises/government-infrastructure-only requirement). | No infrastructure constraint has been specified yet; cloud hosting is the default assumption for a greenfield build. | If on-premises/government-infrastructure-only deployment is actually required, architecture choices (e.g., managed services) may need significant rework. | Confirm deployment/hosting constraints with stakeholders during infrastructure planning. | Unvalidated |
| AS-009 | The project has access to, or can obtain, standard open-source tooling (frameworks, libraries) without licensing restrictions specific to government use. | No licensing constraint has been raised; open-source tooling is the default assumption for cost and flexibility reasons. | Government procurement or licensing rules could restrict use of certain open-source or third-party tools. | Confirm any procurement/licensing constraints with stakeholders before finalizing technology stack. | Unvalidated |
| AS-010 | This documentation set (ED-M1) will be reviewed by a human stakeholder before architecture design (a future milestone) begins. | Consistent with the documentation lifecycle defined in [engineering-overview.md](../00_Engineering_Overview/engineering-overview.md) (Draft → Under Review → Approved). | Proceeding to architecture design without review risks building on unvalidated assumptions and unconfirmed requirements. | Explicit stakeholder sign-off or review checkpoint before starting the next documentation or architecture milestone. | Unvalidated |
