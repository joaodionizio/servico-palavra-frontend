import { Badge } from "@/components/ui/Badge";
import type { TrilhaConteudo } from "@/types/trilha";

export function TrailContentList({ conteudos }: { conteudos: TrilhaConteudo[] }) {
  return (
    <div className="grid gap-4">
      {conteudos.map((item) => (
        <div key={item.conteudo.id} className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Aula {item.ordem}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-800 transition-colors group-hover:text-[#004B87]">{item.conteudo.titulo}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.conteudo.tipo}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge>{item.concluido ? "Concluído" : item.emAndamento ? "Em andamento" : "Pendente"}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
