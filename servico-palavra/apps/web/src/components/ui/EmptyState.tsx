import { Card } from "@/components/ui/Card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="text-center">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FFCC00]">Serviço</p>
      <h3 className="mt-3 text-2xl font-black text-[#004B87]">{title}</h3>
      <p className="mt-2 leading-6 text-gray-500">{description}</p>
    </Card>
  );
}
