import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--sp-brand)] dark:text-white">
      {children}
    </span>
  );
}
