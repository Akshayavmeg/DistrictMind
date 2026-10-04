import { useHealth } from '../../hooks/useHealth';
import { ErrorState, LoadingState } from '../../components/StateMessages';

/** Live backend health indicator. One request per mount. */
export function BackendStatus() {
  const health = useHealth();

  if (health.status === 'loading') return <LoadingState label="Checking backend…" />;

  if (health.status === 'offline') {
    return (
      <ErrorState title="Backend: OFFLINE" message={health.message}>
        <p className="mt-2 text-xs text-rose-100/70">
          Start the backend with the commands in the README, then reload this page.
        </p>
      </ErrorState>
    );
  }

  return (
    <p className="text-sm text-emerald-300">
      Backend: ONLINE <span className="text-slate-400">({health.environment})</span>
    </p>
  );
}
