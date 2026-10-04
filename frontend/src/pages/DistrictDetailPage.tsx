import { Link, useParams } from 'react-router';

import { EmptyState } from '../components/StateMessages';

/**
 * District dashboard placeholder for the canonical route /districts/:id (AD-RES-001).
 * The id is shown as plain text only. No statistics are invented.
 */
export function DistrictDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <Link to="/districts" className="text-sm text-cyan-300 hover:underline">
          ← All districts
        </Link>
        <h1 className="text-2xl font-semibold text-slate-50">District dashboard</h1>
        <p className="text-sm text-slate-400">
          Requested district reference: <span className="font-mono text-slate-200">{id ?? '(none)'}</span>
        </p>
      </div>
      <EmptyState
        title="District data integration pending"
        message="The dashboard will show validated district data once a boundary and data source are approved and loaded."
      />
    </section>
  );
}
