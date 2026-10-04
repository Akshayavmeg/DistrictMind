/**
 * DEVELOPMENT SESSION FLAG — NOT AUTHORIZATION.
 * A sessionStorage marker that lets the UI route-guard demonstrate the login flow.
 * Any user can set it. Real access control must live in the backend, which this stub does not provide.
 * Replace this module with the real session handling when an authentication provider is selected.
 */
const KEY = 'districtmind.devSession';

export function hasDevSession(): boolean {
  try {
    return sessionStorage.getItem(KEY) === 'active';
  } catch {
    return false;
  }
}

export function setDevSession(active: boolean): void {
  try {
    if (active) sessionStorage.setItem(KEY, 'active');
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage unavailable (private mode or blocked): the session is simply not remembered.
  }
}
