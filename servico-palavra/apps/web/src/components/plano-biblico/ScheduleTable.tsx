import { Badge } from "@/components/ui/Badge";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

export function ScheduleTable({ dias }: { dias: DiaPlanoBiblico[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {dias.map((dia) => (
        <div key={dia.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[100px_1fr_140px] md:items-center">
          <strong className="text-[#004B87]">Dia {dia.dia}</strong>
          <span className="text-gray-500">{dia.leitura}</span>
          <Badge>{dia.status}</Badge>
        </div>
      ))}
    </div>
  );
}
