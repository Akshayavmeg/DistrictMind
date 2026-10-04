# development

Local development. Development and synthetic data only, always labeled.

| Service | Address (default) | Status |
|---|---|---|
| Frontend (Vite) | http://127.0.0.1:5173 | Running in Step 1 |
| Backend (FastAPI) | http://127.0.0.1:8000 | Running in Step 1 |
| PostgreSQL/PostGIS | 127.0.0.1:5432 | NOT RUNNING — not validated; see docker/ |
| Ollama | http://127.0.0.1:11434 | Not used in Step 1 |

`AUTH_MODE=development` enables the login stub. It is rejected outside `APP_ENV=development`.
