import { Link } from 'react-router';

import { BackendStatus } from '../features/system/BackendStatus';

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">DistrictMind</h1>
        <p className="text-lg text-cyan-300/90">Telangana District Intelligence</p>
        <p className="text-sm text-slate-400">Development scaffold — Step 1. Not a production system.</p>
      </div>

      <div className="glass rounded-xl p-5">
        <BackendStatus />
      </div>

      <div className="glass rounded-xl p-5 text-sm text-slate-300 space-y-2">
        <p className="font-medium text-slate-100">Current state</p>
        <ul className="list-disc space-y-1 pl-5 text-slate-400">
          <li>District boundary data is not yet integrated.</li>
          <li>Production authentication is not yet integrated.</li>
          <li>The production AI provider is not yet selected.</li>
          <li>PostgreSQL/PostGIS integration is not yet validated.</li>
        </ul>
      </div>

      <div className="flex gap-4 text-sm">
        <Link
          to="/login"
          className="rounded-md border border-slate-600 px-4 py-2 hover:border-cyan-400 transition-colors"
        >
          Development login
        </Link>
        <Link
          to="/districts"
          className="rounded-md border border-slate-600 px-4 py-2 hover:border-cyan-400 transition-colors"
        >
          Districts
        </Link>
      </div>
    </section>
  );
}
