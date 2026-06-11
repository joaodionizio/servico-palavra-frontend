import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { PlanoBiblico } from "@/types/planoBiblico";

export function BiblePlanSummaryCard({ plano }: { plano?: PlanoBiblico | null }) {
  if (!plano) {
    return (
      <Card className="border-2 border-[#FFCC00] bg-yellow-50/50 shadow-sm">
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Plano bíblico</p>
          <h3 className="mt-3 text-2xl font-black text-[#004B87]">Criar meu plano bíblico personalizado</h3>
          <p className="mt-2 text-gray-500">Configure quando desejar, sem interromper suas formações.</p>
          <LinkButton href="/app/plano-biblico" variant="primary" className="mt-5">
            Abrir plano
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Plano bíblico ativo</p>
      <h3 className="mt-2 text-xl font-black text-[#004B87]">Leitura do dia {plano.leituraHoje?.dia}</h3>
      <p className="mt-2 text-gray-500">{plano.leituraHoje?.leitura}</p>
    </Card>
  );
}
