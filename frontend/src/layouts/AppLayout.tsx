import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import { hasDevSession, setDevSession } from '../features/auth/devSession';

/**
 * Application shell. Framer Motion handles the page transition (meaningful, interruptible, short).
 * Reduced-motion users get an instant switch. Simple hover effects stay in CSS (Tailwind).
 */
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const sessionActive = hasDevSession();

  function endSession() {
    setDevSession(false);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="glass sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-semibold tracking-tight text-slate-50 hover:text-cyan-300 transition-colors"
          >
            DistrictMind
          </Link>
          <span className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-medium text-amber-300">
            DEVELOPMENT
          </span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <Link to="/districts" className="text-slate-300 hover:text-cyan-300 transition-colors">
            Districts
          </Link>
          {sessionActive ? (
            <button
              type="button"
              onClick={endSession}
              className="text-slate-300 hover:text-cyan-300 transition-colors"
            >
              End development session
            </button>
          ) : (
            <Link to="/login" className="text-slate-300 hover:text-cyan-300 transition-colors">
              Development login
            </Link>
          )}
        </nav>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="mx-auto max-w-5xl px-6 py-8"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
