/** Response shape of GET /api/v1/health. Mirrors backend/app/api/health.py. */
export interface HealthResponse {
  status: 'ok';
  service: string;
  environment: string;
}
