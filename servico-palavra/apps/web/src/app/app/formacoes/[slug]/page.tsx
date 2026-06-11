import { notFound } from "next/navigation";
import { ContentPlayer } from "@/components/conteudos/ContentPlayer";
import { MaterialSupportList } from "@/components/conteudos/MaterialSupportList";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { conteudos } from "@/data/mocks";

export default async function FormacaoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conteudo = conteudos.find((item) => item.slug === slug);

  if (!conteudo) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <Badge>{conteudo.categoria.nome}</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">{conteudo.titulo}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-500">{conteudo.descricao}</p>
      </div>
      <ContentPlayer conteudo={conteudo} />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary">Favoritar</Button>
        <Button>Marcar como concluido</Button>
      </div>
      <MaterialSupportList materiais={conteudo.materiais} />
    </div>
  );
}
