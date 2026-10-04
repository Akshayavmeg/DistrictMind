import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { DEV_LOGIN_WARNING } from '@shared/constants/api';

import { ErrorState } from '../components/StateMessages';
import { postDevLogin } from '../features/auth/devAuthService';
import { hasDevSession, setDevSession } from '../features/auth/devSession';
import { ApiError } from '../services/apiClient';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/districts';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enterDevelopmentSession() {
    setBusy(true);
    setError(null);
    try {
      const result = await postDevLogin();
      if (!result.authenticated) throw new ApiError('The development login did not succeed.');
      setDevSession(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-xl space-y-6">
      <div className="rounded-lg border border-amber-400/60 bg-amber-950/30 p-4">
        <p className="font-semibold tracking-wide text-amber-300">DEVELOPMENT LOGIN</p>
        <p className="mt-1 text-sm text-amber-100/80">{DEV_LOGIN_WARNING}</p>
        <p className="mt-2 text-sm text-amber-100/70">
          No password is requested and no account is checked. This only lets developers exercise the
          navigation flow.
        </p>
      </div>

      <h1 className="text-2xl font-semibold text-slate-50">Enter development session</h1>

      {hasDevSession() ? (
        <p className="text-sm text-slate-300">
          A development session is active.{' '}
          <Link to="/districts" className="text-cyan-300 underline">
            Open districts
          </Link>
          .
        </p>
      ) : (
        <button
          type="button"
          onClick={enterDevelopmentSession}
          disabled={busy}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Starting…' : 'Enter development session'}
        </button>
      )}

      {error && (
        <ErrorState title="Development login failed" message={error}>
          <p className="mt-2 text-xs text-rose-100/70">
            The backend must be running and AUTH_MODE must be development.
          </p>
        </ErrorState>
      )}
    </section>
  );
}
