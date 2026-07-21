import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("card-hover rounded-[1.5rem] border border-slate-200/70 bg-[#FDFDFB] p-8 shadow-[0_8px_30px_rgba(0,51,102,.045)] dark:border-slate-700 dark:bg-slate-900/70", className)} {...props} />;
}
