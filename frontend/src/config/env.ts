/**
 * Frontend environment configuration. Only non-secret, public values belong here.
 * Set VITE_API_BASE_URL in a local .env file (see .env.example). Default: local backend.
 */
export const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
);
