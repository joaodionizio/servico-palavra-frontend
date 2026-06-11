import { Card } from "@/components/ui/Card";

export function AdminStatsCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</p>
      <strong className="mt-3 block text-4xl font-black text-[#004B87]">{value}</strong>
      <p className="mt-2 text-sm font-medium text-gray-400">{description}</p>
    </Card>
  );
}
