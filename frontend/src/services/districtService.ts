import type { District, DistrictListResponse } from '@shared/types/district';

import { apiRequest } from './apiClient';

/** Administrative reference list. The backend catalog is the only source; nothing is hardcoded here. */
export function listDistricts(): Promise<DistrictListResponse> {
  return apiRequest<DistrictListResponse>('/districts');
}

export function getDistrict(districtId: string): Promise<District> {
  return apiRequest<District>(`/districts/${encodeURIComponent(districtId)}`);
}
