import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "ui-card card-hover border border-[var(--sp-border)] bg-[var(--sp-surface)] p-5 text-[var(--sp-text)] sm:p-7 lg:p-8",
        className
      )}
      {...props}
    />
  );
}
