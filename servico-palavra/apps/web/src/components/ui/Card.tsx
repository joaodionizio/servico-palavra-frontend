import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("card-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm", className)} {...props} />;
}
