import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-gray-600">
      {label}
      <input className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" {...props} />
    </label>
  );
}
