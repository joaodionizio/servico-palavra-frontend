import { Card } from "@/components/ui/Card";

const icons = ["📚", "🧭", "🎬", "⭐", "📖"];

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
  index?: number;
};

export function DashboardCard({ title, value, description, index = 0 }: DashboardCardProps) {
  return (
    <Card className="group relative flex min-h-48 flex-col gap-3 overflow-hidden hover:border-[#004B87]/20 sm:min-h-56 dark:hover:border-sky-300/25">
      <span className="absolute right-5 top-4 font-brand-script text-5xl text-[#004B87]/[.035] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125 motion-reduce:transform-none motion-reduce:transition-none sm:right-6 sm:text-6xl dark:text-white/[.035]">{String(index + 1).padStart(2, "0")}</span>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sp-brand)] text-xl text-white shadow-lg shadow-blue-900/10 dark:bg-sky-100 dark:text-slate-950">{icons[index % icons.length]}</div>
      <p className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">{title}</p>
      <strong className="text-4xl font-black tracking-[-.05em] text-[var(--sp-brand)] sm:text-5xl dark:text-sky-100">{value}</strong>
      <p className="text-sm font-medium text-gray-400 dark:text-slate-400">{description}</p>
    </Card>
  );
}
