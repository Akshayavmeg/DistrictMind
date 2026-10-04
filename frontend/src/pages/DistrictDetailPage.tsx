import { Link, useParams } from 'react-router';

import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { useDistrict } from '../hooks/useDistrict';

/**
 * District detail for the canonical route /districts/:id (AD-RES-001).
 * Shows only administrative reference information. Unavailable areas are labeled, never filled in.
 */
export function DistrictDetailPage() {
  const { id = '' } = useParams();
  const district = useDistrict(id);

  if (district.status === 'loading') return <LoadingState label="Loading district reference…" />;

  if (district.status === 'error') {
    const { error } = district;
    if (error.status === 404) {
      return (
        <EmptyState
          title="District not found"
          message="No district in the administrative reference catalog matches this reference."
        />
      );
    }
    if (error.status === 400) {
      return (
        <ErrorState
          title="Invalid district reference"
          message="The district reference in this address is not valid."
        />
      );
    }
    return <ErrorState title="District unavailable" message={error.message} />;
  }

  const { data } = district;
  return (
    <section className="space-y-6">
      <Link to="/districts" className="text-sm text-cyan-300 hover:underline">
        ← All districts
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">{data.name}</h1>
        <p className="text-cyan-300/90">{data.state}</p>
      </div>

      <div className="glass rounded-xl p-5 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Administrative Status</dt>
            <dd className="font-medium text-emerald-300">
              {data.status === 'active' ? 'Active' : data.status}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Identifier</dt>
            <dd className="font-mono text-slate-200">{data.id}</dd>
          </div>
          {data.reference?.source && (
            <div className="sm:col-span-2">
              <dt className="text-slate-400">Reference provenance</dt>
              <dd className="break-all text-slate-300">{data.reference.source}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-slate-100">Intelligence areas</h2>
        <UnavailableArea
          title="Spatial Intelligence"
          reason="Not available — validated GIS layer not yet connected."
        />
        <UnavailableArea
          title="Statistical Indicators"
          reason="Not available — no validated statistical source is connected."
        />
      </div>
    </section>
  );
}

function UnavailableArea({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-600 p-4">
      <p className="font-medium text-slate-300">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{reason}</p>
    </div>
  );
}
