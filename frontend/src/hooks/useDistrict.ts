import { useEffect, useState } from 'react';

import type { District } from '@shared/types/district';

import { ApiError } from '../services/apiClient';
import { getDistrict } from '../services/districtService';

export type DistrictState =
  { status: 'loading' } | { status: 'ready'; data: District } | { status: 'error'; error: ApiError };

/** Loads one district reference by id. Re-requests when the id changes. No fallback data. */
export function useDistrict(districtId: string): DistrictState {
  const [state, setState] = useState<DistrictState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    getDistrict(districtId)
      .then((data) => {
        if (active) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            error: error instanceof ApiError ? error : new ApiError('Unexpected error.'),
          });
        }
      });
    return () => {
      active = false;
    };
  }, [districtId]);

  return state;
}
