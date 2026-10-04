# tests

Cross-cutting tests that span frontend and backend. Component-level unit tests live beside their code (`backend/tests/`, `frontend/src/**/*.test.tsx`).

- `e2e/` — Playwright browser tests for the development flow: home, login stub, district routes, unknown route, and a request-loop check.

Run (backend and frontend must already be running):

```
cd tests
npm install
npm run test:e2e
```

The browser is the installed Microsoft Edge by default (`PW_CHANNEL`). No browser binary is downloaded by this configuration.
