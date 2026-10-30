import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    loadingLabel?: ReactNode;
  };

type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variants = {
  primary: "ui-button-primary",
  secondary: "ui-button-secondary",
  ghost: "ui-button-ghost",
  gold: "ui-button-gold"
};

const base = "ui-control inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60";

export function Button({ children, variant = "primary", className, loading = false, loadingLabel, disabled, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <span className="ui-button-spinner" aria-hidden="true" />}
      <span>{loading ? loadingLabel ?? children : children}</span>
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
