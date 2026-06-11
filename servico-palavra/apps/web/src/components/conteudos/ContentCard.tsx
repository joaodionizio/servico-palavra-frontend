import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Conteudo } from "@/types/conteudo";

export function ContentCard({ conteudo }: { conteudo: Conteudo }) {
  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
        {conteudo.tipo === "audio" ? "🎧" : conteudo.tipo === "documento" ? "📄" : "🎬"}
      </div>
      <Badge>{conteudo.categoria.nome}</Badge>
      <h3 className="mt-3 text-xl font-black text-[#004B87]">{conteudo.titulo}</h3>
      <p className="mt-2 flex-1 leading-6 text-gray-500">{conteudo.descricao}</p>
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-gray-400">
        {conteudo.tipo} {conteudo.duracao ? `• ${conteudo.duracao}` : ""}
      </p>
      <LinkButton href={`/app/formacoes/${conteudo.slug}`} variant="secondary" className="mt-5">
        Ver formação
      </LinkButton>
    </Card>
  );
}
