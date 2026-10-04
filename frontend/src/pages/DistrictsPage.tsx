import { EmptyState } from '../components/StateMessages';

/**
 * District list placeholder. No district records exist yet, so none are shown.
 * Boundary data is not integrated (see docs/technology and the README).
 */
export function DistrictsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Telangana District Intelligence</h1>
        <p className="text-sm text-slate-400">33 districts — listing pending data integration.</p>
      </div>
      <EmptyState
        title="District data integration pending"
        message="No district records are loaded in this development scaffold. Nothing shown here is real district data."
      />
    </section>
  );
}
