# shared

Cross-cutting definitions used by both `frontend/` and `backend/`.

- `types/` — TypeScript interfaces mirroring backend response shapes.
- `constants/` — values that must match on both sides (API prefix, development-login warning).
- `schemas/` — reserved; empty until an endpoint needs a JSON Schema contract.

Do not duplicate backend models here unnecessarily. Each file names the backend file it mirrors.
