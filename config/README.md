# config

Environment-specific configuration notes. Real values and secrets never live here or in source control.

- `development/` — local development notes (variables, ports, services).
- `test/` — test environment notes (throwaway data only).

The environment template is `.env.example` at the repository root. Copy it to `.env` locally; `.env` is git-ignored.

Future staging and production environments are **not defined**. No production hosting is selected.
