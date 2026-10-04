import { API_PREFIX } from '@shared/constants/api';

import { API_BASE_URL } from '../config/env';

/** Error raised for any failed API call. Messages are safe to show to users. */
export class ApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Minimal typed JSON client. The frontend calls only the backend API, never a database.
 * Requests time out so a stalled backend shows an error state instead of hanging.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new ApiError(`The backend responded with status ${response.status}.`, response.status);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('The backend is unreachable or did not respond in time.');
  } finally {
    clearTimeout(timer);
  }
}
