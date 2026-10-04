import { Navigate, Outlet, useLocation } from 'react-router';

import { hasDevSession } from '../features/auth/devSession';

/**
 * UI route guard for the development stub. Not an authorization control:
 * the backend does not enforce this, and the flag is client-side only.
 */
export function RequireDevSession() {
  const location = useLocation();
  if (!hasDevSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
