import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPercent } from "@/lib/utils";
import type { Trilha } from "@/types/trilha";

export function TrailProgressCard({ trilha }: { trilha: Trilha }) {
  return (
    <Card>
      <h3 className="text-xl font-black text-[#004B87]">{trilha.titulo}</h3>
      <p className="mt-2 leading-6 text-gray-500">{trilha.descricao}</p>
      <div className="mt-5 h-3 rounded-full bg-blue-50">
        <div className="h-3 rounded-full bg-[#004B87]" style={{ width: `${trilha.progresso}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{formatPercent(trilha.progresso)}</span>
        <LinkButton href={`/app/trilhas/${trilha.slug}`} variant="secondary">
          Continuar
        </LinkButton>
      </div>
    </Card>
  );
}
