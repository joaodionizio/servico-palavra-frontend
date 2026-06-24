import { Card } from "@/components/ui/Card";
import { formatPlanoDuracao } from "@/lib/planoBiblico";
import { formatPercent } from "@/lib/utils";
import type { PlanoBiblico } from "@/types/planoBiblico";

export function BibleProgressCard({ plano }: { plano: PlanoBiblico }) {
  return (
    <Card>
      <h3 className="text-2xl font-black text-[#004B87]">Plano bíblico de {formatPlanoDuracao(plano)}</h3>
      <p className="mt-2 text-sm font-bold uppercase tracking-wider text-gray-500">Duração de {formatPlanoDuracao(plano)}</p>
      <div className="mt-5 h-3 rounded-full bg-blue-50">
        <div className="h-3 rounded-full bg-[#004B87]" style={{ width: `${plano.progresso}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-500">
        {formatPercent(plano.progresso)} - {plano.diasConcluidos} de {plano.totalDias} dias - sequência de {plano.sequencia} dias
      </p>
    </Card>
  );
}
