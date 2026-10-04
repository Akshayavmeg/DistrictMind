import type { HealthResponse } from '@shared/types/health';

import { apiRequest } from './apiClient';

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health');
}
