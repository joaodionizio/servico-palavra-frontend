import { Card } from "@/components/ui/Card";
import { formatPlanoDuracao } from "@/lib/planoBiblico";
import { formatPercent } from "@/lib/utils";
import type { PlanoBiblico } from "@/types/planoBiblico";

export function BibleProgressCard({ plano }: { plano: PlanoBiblico }) {
  return (
    <Card className="relative overflow-hidden">
      <h3 className="text-2xl font-black text-[#004B87]">Plano bíblico de {formatPlanoDuracao(plano)}</h3>
      <p className="mt-2 text-sm font-bold uppercase tracking-wider text-gray-500">Duração de {formatPlanoDuracao(plano)}</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E8EFF2]">
        <div className="h-2 rounded-full bg-gradient-to-r from-[#004B87] to-[#FFCC00] transition-all duration-700" style={{ width: `${plano.progresso}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-500">
        {formatPercent(plano.progresso)} - {plano.diasConcluidos} de {plano.totalDias} dias - sequência de {plano.sequencia} dias
      </p>
    </Card>
  );
}
