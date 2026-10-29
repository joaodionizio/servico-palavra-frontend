import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPlanoDuracao } from "@/lib/planoBiblico";
import type { DiaPlanoBiblico, PlanoBiblico } from "@/types/planoBiblico";

type BiblePlanSummaryCardProps = {
  plano?: PlanoBiblico | null;
  leituraHoje?: DiaPlanoBiblico | null;
  loading?: boolean;
  message?: string;
};

export function BiblePlanSummaryCard({ plano, leituraHoje, loading = false, message }: BiblePlanSummaryCardProps) {
  if (loading) {
    return (
      <Card className="border-blue-100 dark:border-slate-700">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-300">Plano bíblico</p>
        <div className="mt-4 space-y-3">
          <div className="h-5 w-2/3 animate-pulse rounded bg-blue-50 dark:bg-sky-200/10" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
        </div>
      </Card>
    );
  }

  if (!plano) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50 shadow-sm dark:border-yellow-300/20 dark:bg-yellow-300/5">
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-300">Plano bíblico</p>
          <h3 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Configure quando desejar</h3>
          <p className="mt-2 text-gray-500 dark:text-slate-300">{message ?? "O plano bíblico fica disponível como apoio complementar à sua formação."}</p>
          <LinkButton href="/app/plano-biblico" variant="primary" className="mt-5 w-full sm:w-auto">
            Abrir plano
          </LinkButton>
        </div>
      </Card>
    );
  }

  const dailyReading = plano.leituraHoje ?? leituraHoje;
  const progress = Math.max(0, Math.min(100, plano.progresso));

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-[#C99600] dark:text-[#FFCC00]">Plano bíblico ativo</p>
      <h3 className="mt-2 text-xl font-black text-[var(--sp-brand)] dark:text-sky-100">Plano bíblico de {formatPlanoDuracao(plano)}</h3>
      <p className="mt-2 break-words text-gray-500 dark:text-slate-300">
        {dailyReading ? `Leitura de hoje: ${dailyReading.leitura}` : "Continue seu cronograma quando puder."}
      </p>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-blue-50 dark:bg-slate-800" role="progressbar" aria-label="Progresso do plano bíblico" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <div className="h-3 rounded-full bg-gradient-to-r from-[#004B87] to-[#FFCC00] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-300">{Math.round(progress)}% concluído</span>
        <LinkButton href="/app/cronograma" variant="secondary" className="w-full sm:w-auto">
          Ver leitura
        </LinkButton>
      </div>
    </Card>
  );
}
