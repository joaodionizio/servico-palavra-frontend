import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { conteudos } from "@/data/mocks";

export default function AdminConteudosPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Conteúdos</h1>
          <p className="mt-2 text-gray-500">Listar, criar, editar, publicar e despublicar conteúdos.</p>
        </div>
        <LinkButton href="/admin/conteudos/novo">Novo conteudo</LinkButton>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {conteudos.map((conteudo) => (
          <div key={conteudo.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[1fr_130px_160px_120px] md:items-center">
            <strong>{conteudo.titulo}</strong>
            <Badge>{conteudo.tipo}</Badge>
            <span className="text-sm text-gray-500">{conteudo.publicado ? "Publicado" : "Rascunho"}</span>
            <LinkButton href={`/admin/conteudos/${conteudo.id}/editar`} variant="secondary">Editar</LinkButton>
          </div>
        ))}
      </div>
    </div>
  );
}
