import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusNoticeProps = {
  children: ReactNode;
  variant?: "success" | "error" | "info";
  className?: string;
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-900/70 dark:bg-green-950/35 dark:text-green-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/35 dark:text-red-200",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/70 dark:bg-sky-950/35 dark:text-sky-200"
};

const icons = {
  success: "✓",
  error: "!",
  info: "i"
};

export function StatusNotice({ children, variant = "info", className }: StatusNoticeProps) {
  const isError = variant === "error";

  return (
    <div
      className={cn("status-notice flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold", styles[variant], className)}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <span className="status-notice-icon" aria-hidden="true">{icons[variant]}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}
