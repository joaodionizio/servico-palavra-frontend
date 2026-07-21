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
    <Card className="group relative flex min-h-56 flex-col gap-3 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[#004B87]/20 hover:shadow-xl">
      <span className="absolute right-6 top-4 font-brand-script text-6xl text-[#004B87]/[.035] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">{String(index + 1).padStart(2, "0")}</span>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#004B87] text-xl text-white shadow-lg shadow-blue-900/10">{icons[index % icons.length]}</div>
      <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</p>
      <strong className="text-5xl font-black tracking-[-.05em] text-[#004B87]">{value}</strong>
      <p className="text-sm font-medium text-gray-400">{description}</p>
    </Card>
  );
}
