import { useEffect, useState } from 'react';

import type { DistrictListResponse } from '@shared/types/district';

import { ApiError } from '../services/apiClient';
import { listDistricts } from '../services/districtService';

export type DistrictListState =
  | { status: 'loading' }
  | { status: 'ready'; data: DistrictListResponse }
  | { status: 'error'; error: ApiError };

/** Loads the district reference list once per mount. No polling and no fallback data. */
export function useDistricts(): DistrictListState {
  const [state, setState] = useState<DistrictListState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    listDistricts()
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
  }, []);

  return state;
}
