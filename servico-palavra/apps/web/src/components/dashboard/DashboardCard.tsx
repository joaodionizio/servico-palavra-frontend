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
    <Card className="flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">{icons[index % icons.length]}</div>
      <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</p>
      <strong className="text-4xl font-black text-[#004B87]">{value}</strong>
      <p className="text-sm font-medium text-gray-400">{description}</p>
    </Card>
  );
}
