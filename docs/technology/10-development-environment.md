---
Document Name: Development Environment
Document ID: DM-TB-10
Version: 0.1
Status: Draft
Owner: DistrictMind Engineering
Created: 2026-10-04
Last Updated: 2026-10-04
---

# Development Environment

Written for: any engineer setting up a local machine.

## 1. Observed Environment (Read-Only Check, 2026-10-04)

| Tool | Observed | Status |
|---|---|---|
| Git | 2.53.0 | EXISTING |
| Node.js | v24.14.1 | Runtime present |
| npm | 11.11.0 | Present |
| Python | 3.14.3 | Runtime present |
| Ollama | 0.34.4 (ED-M6 Part 3 recorded 0.33.2) | Present; `llama3.2:3b` installed |
| Docker | **Not installed** | BLOCKED (D-13) |
| Docker Compose | **Not installed** | BLOCKED (D-13) |
| PostgreSQL / PostGIS | **Not installed** | BLOCKED (VAL-M6-P3-025) |
| Browser for Playwright | **Not installed** | BLOCKED |

These are observations of this machine, not requirements. Other machines may differ.

## 2. Setup Steps (Documented, Not Executed)

The steps below are what a developer does on a fresh machine. **They have not been executed by this baseline.**

1. Install Git (EXISTING).
2. Install Node.js 24.x. Pin the version in a repository file at setup.
3. Install Python 3.14.x, or the earlier minor version chosen if a required package lacks a 3.14 wheel. Create a virtual environment inside the backend folder. Do not commit it.
4. Install Docker Desktop, then start PostgreSQL/PostGIS through Docker Compose. Until Docker is installed, use a native PostgreSQL install with PostGIS.
5. Install Ollama and pull the development model.
6. Copy the environment template to a local `.env` (created at implementation, not committed) and fill in local values.
7. Install frontend dependencies with npm; install backend dependencies into the virtual environment.

## 3. Environment Separation

| Environment | Data | Status |
|---|---|---|
| Local development | Development and synthetic data only, labeled | Defined here; used from first slice |
| Test | Throwaway database; test fixtures only | Defined here |
| Future staging | Not defined; no real data | **Not defined** (no hosting decided) |
| Future production | Real, governed data | **Not defined**; PRODUCTION NOT CONFIRMED; deployment platform unresolved (RG-TECH-012) |

No production environment exists. No deployment target is chosen.

## 4. Environment Variables (Names and Groups Only)

Defined in [09](09-security-and-observability-stack.md) Section 3. Real values are never written in documentation.

## 5. Ports and Local Services (Conceptual)

Frontend dev server, backend API, PostgreSQL/PostGIS, Ollama (its local HTTP endpoint). Exact port numbers are set at implementation in configuration, not in this document.

## 6. Known Limitations

- No browser is available here, so browser tests and animation checks cannot run on this machine.
- Docker is absent, so the planned containerized database cannot start on this machine until Docker is installed.
- The Python version's wheel availability for all required packages is unverified.

## 7. Open Decisions

Python minor version pinning; Node version pinning; whether to standardize on a dependency manager beyond npm and pip (not selected here).
