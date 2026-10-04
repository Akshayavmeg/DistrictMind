import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Page not found</h1>
      <p className="text-sm text-slate-400">
        The requested page does not exist in this development scaffold.
      </p>
      <Link to="/" className="text-sm text-cyan-300 hover:underline">
        Return to the home page
      </Link>
    </section>
  );
}
