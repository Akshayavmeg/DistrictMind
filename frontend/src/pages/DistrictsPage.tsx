import { Link } from 'react-router';

import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { useDistricts } from '../hooks/useDistricts';

/**
 * District reference list, loaded from GET /api/v1/districts.
 * Administrative reference only: no statistics, geometry, or map are shown.
 */
export function DistrictsPage() {
  const districts = useDistricts();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Telangana District Intelligence</h1>
        {districts.status === 'ready' && (
          <p className="text-sm text-slate-400">
            {districts.data.total} districts · administrative reference
          </p>
        )}
      </div>

      {districts.status === 'loading' && <LoadingState label="Loading districts from the backend…" />}

      {districts.status === 'error' && (
        <ErrorState title="District list unavailable" message={districts.error.message}>
          <p className="mt-2 text-xs text-rose-100/70">
            No district names are shown instead. Start the backend and reload this page.
          </p>
        </ErrorState>
      )}

      {districts.status === 'ready' && districts.data.items.length === 0 && (
        <EmptyState
          title="No districts in the reference catalog"
          message="The backend returned an empty administrative reference catalog."
        />
      )}

      {districts.status === 'ready' && districts.data.items.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Districts">
          {districts.data.items.map((district) => (
            <li key={district.id}>
              <Link
                to={`/districts/${district.id}`}
                className="glass block rounded-lg p-4 transition-colors hover:border-cyan-400"
              >
                <span className="block font-medium text-slate-50">{district.name}</span>
                <span className="mt-1 block text-sm text-slate-400">{district.state}</span>
                <span className="mt-2 inline-block rounded border border-emerald-400/40 px-2 py-0.5 text-xs text-emerald-300">
                  {district.status === 'active' ? 'Active' : district.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
