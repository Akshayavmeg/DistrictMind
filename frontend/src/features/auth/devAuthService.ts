import type { DevLoginResponse } from '@shared/types/devAuth';

import { apiRequest } from '../../services/apiClient';

/** DEVELOPMENT STUB — NOT REAL AUTHENTICATION. Sends no credentials. */
export function postDevLogin(): Promise<DevLoginResponse> {
  return apiRequest<DevLoginResponse>('/auth/dev-login', { method: 'POST' });
}
