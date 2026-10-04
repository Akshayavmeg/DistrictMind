import { useEffect, useState } from 'react';

import { getHealth } from '../services/healthService';

export type HealthState =
  { status: 'loading' } | { status: 'online'; environment: string } | { status: 'offline'; message: string };

/** One health check per mount. No polling loop. */
export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getHealth()
      .then((health) => {
        if (active) setState({ status: 'online', environment: health.environment });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'offline',
            message: error instanceof Error ? error.message : 'Unknown error.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
