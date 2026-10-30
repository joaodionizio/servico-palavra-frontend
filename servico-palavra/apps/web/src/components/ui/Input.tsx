import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[var(--sp-text-muted)]">
      {label}
      <input
        className="rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface-muted)] px-5 py-3.5 text-[var(--sp-text)] outline-none transition-all duration-300 placeholder:text-[var(--sp-text-muted)] focus:border-[var(--sp-focus)] focus:bg-[var(--sp-surface)] focus:ring-4 focus:ring-[#0B73B9]/10 dark:focus:ring-yellow-300/10"
        {...props}
      />
    </label>
  );
}
