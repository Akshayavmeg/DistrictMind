/**
 * Frontend representation of the district API contract.
 * Mirrors backend/app/modules/administrative/schemas/district.py.
 *
 * ADMINISTRATIVE REFERENCE ONLY. There is no geometry, coordinate, area, population,
 * or statistic in this contract. Those attach later, after the GIS/data gates clear.
 */

/** Controlled lifecycle values. Extend this union only when a lifecycle state is approved. */
export type DistrictStatus = 'active';

export interface DistrictReference {
  source: string | null;
  source_id: string | null;
  source_url: string | null;
  vintage: string | null;
}

export interface District {
  id: string;
  name: string;
  state: string;
  status: DistrictStatus;
  reference: DistrictReference | null;
}

/** List envelope. Pagination mechanics are Under Evaluation; all entries are returned for now. */
export interface DistrictListResponse {
  items: District[];
  total: number;
}
