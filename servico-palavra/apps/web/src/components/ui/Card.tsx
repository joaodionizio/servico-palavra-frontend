import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "ui-card card-hover border border-slate-200/70 bg-[#FDFDFB] p-5 sm:p-7 lg:p-8 dark:border-slate-700 dark:bg-slate-900/70",
        className
      )}
      {...props}
    />
  );
}
