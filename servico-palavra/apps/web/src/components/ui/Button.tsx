import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variants = {
  primary: "bg-[var(--sp-brand)] text-white hover:bg-[var(--sp-brand-strong)] hover:shadow-lg",
  secondary: "bg-gray-100 text-gray-600 hover:bg-[var(--sp-brand)] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-white dark:hover:text-black",
  ghost: "text-gray-500 hover:bg-blue-50 hover:text-[var(--sp-brand)] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  gold: "bg-[var(--sp-accent)] text-slate-950 hover:bg-yellow-400 hover:shadow-lg dark:bg-[#FACC15] dark:text-slate-950 dark:hover:bg-yellow-300"
};

const base = "ui-control inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60";

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, variant = "primary", className, href, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
