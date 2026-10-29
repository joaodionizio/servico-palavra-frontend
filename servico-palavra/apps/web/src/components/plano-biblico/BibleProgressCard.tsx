import { Card } from "@/components/ui/Card";
import { formatPlanoDuracao } from "@/lib/planoBiblico";
import { formatPercent } from "@/lib/utils";
import type { PlanoBiblico } from "@/types/planoBiblico";

export function BibleProgressCard({ plano }: { plano: PlanoBiblico }) {
  return (
    <Card className="relative overflow-hidden">
      <h3 className="text-xl font-black text-[var(--sp-brand)] sm:text-2xl dark:text-sky-100">Plano bíblico de {formatPlanoDuracao(plano)}</h3>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-sm dark:text-slate-300">Duração de {formatPlanoDuracao(plano)}</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E8EFF2] dark:bg-slate-800" role="progressbar" aria-label="Progresso do plano bíblico" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(plano.progresso)}>
        <div className="h-2 rounded-full bg-gradient-to-r from-[#004B87] to-[#FFCC00] transition-all duration-700 motion-reduce:transition-none" style={{ width: `${plano.progresso}%` }} />
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-sm dark:text-slate-300">
        {formatPercent(plano.progresso)} · {plano.diasConcluidos} de {plano.totalDias} dias · sequência de {plano.sequencia} dias
      </p>
    </Card>
  );
}
