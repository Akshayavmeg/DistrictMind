import type { ReactNode } from 'react';

/** Shared loading / error / empty-state blocks. Plain text only; no invented data. */

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <p role="status" className="text-sm text-slate-400">
      {label}
    </p>
  );
}

export function ErrorState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div role="alert" className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-4">
      <p className="font-medium text-rose-200">{title}</p>
      <p className="mt-1 text-sm text-rose-100/80">{message}</p>
      {children}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-600 p-6 text-center">
      <p className="font-medium text-slate-200">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
    </div>
  );
}
