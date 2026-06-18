import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <Card className="border border-blue-100 bg-white">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Plano bíblico</p>
        <div className="mt-4 space-y-3">
          <div className="h-5 w-2/3 animate-pulse rounded bg-blue-50" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
        </div>
      </Card>
    );
  }

  if (!plano) {
    return (
      <Card className="border border-yellow-200 bg-yellow-50/50 shadow-sm">
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Plano bíblico</p>
          <h3 className="mt-3 text-2xl font-black text-[#004B87]">Configure quando desejar</h3>
          <p className="mt-2 text-gray-500">{message ?? "O plano bíblico fica disponível como apoio complementar à sua formação."}</p>
          <LinkButton href="/app/plano-biblico" variant="primary" className="mt-5">
            Abrir plano
          </LinkButton>
        </div>
      </Card>
    );
  }

  const dailyReading = plano.leituraHoje ?? leituraHoje;

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Plano bíblico ativo</p>
      <h3 className="mt-2 text-xl font-black text-[#004B87]">{plano.nome}</h3>
      <p className="mt-2 text-gray-500">
        {dailyReading ? `Leitura de hoje: ${dailyReading.leitura}` : "Continue seu cronograma quando puder."}
      </p>
      <div className="mt-5 h-3 rounded-full bg-blue-50">
        <div className="h-3 rounded-full bg-[#004B87]" style={{ width: `${plano.progresso}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{Math.round(plano.progresso)}% concluído</span>
        <LinkButton href="/app/cronograma" variant="secondary">
          Ver leitura
        </LinkButton>
      </div>
    </Card>
  );
}
