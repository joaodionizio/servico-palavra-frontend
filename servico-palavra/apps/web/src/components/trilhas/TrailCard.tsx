import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPercent } from "@/lib/utils";
import type { Trilha } from "@/types/trilha";

export function TrailCard({ trilha }: { trilha: Trilha }) {
  return (
    <Card>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">🧭</div>
      <h3 className="text-2xl font-black text-[#004B87]">{trilha.titulo}</h3>
      <p className="mt-2 leading-6 text-gray-500">{trilha.descricao}</p>
      <div className="mt-5 h-3 rounded-full bg-blue-50">
        <div className="h-3 rounded-full bg-[#004B87]" style={{ width: `${trilha.progresso}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{formatPercent(trilha.progresso)}</span>
        <LinkButton href={`/app/trilhas/${trilha.slug}`}>Continuar</LinkButton>
      </div>
    </Card>
  );
}
