import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#004B87] dark:bg-neutral-800 dark:text-white">{children}</span>;
}
