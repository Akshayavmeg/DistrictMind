/**
 * Response shape of POST /api/v1/auth/dev-login.
 * DEVELOPMENT STUB ONLY — NOT REAL AUTHENTICATION. Mirrors backend/app/api/auth.py.
 */
export interface DevLoginResponse {
  authenticated: boolean;
  mode: 'development';
  user: { id: string; display_name: string };
  warning: string;
}
