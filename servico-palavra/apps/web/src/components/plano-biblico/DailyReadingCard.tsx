import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

export function DailyReadingCard({ dia }: { dia: DiaPlanoBiblico }) {
  return (
    <Card className="border-2 border-[#FFCC00] bg-yellow-50/50">
      <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Leitura do dia {dia.dia}</p>
      <h3 className="mt-3 text-2xl font-black text-[#004B87]">{dia.leitura}</h3>
      <Button className="mt-5">Marcar como concluído</Button>
    </Card>
  );
}
