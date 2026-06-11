import { ContentCard } from "@/components/conteudos/ContentCard";
import { ContentFilters } from "@/components/conteudos/ContentFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { categorias, conteudos } from "@/data/mocks";

export default function FormacoesPage() {
  const loading = false;
  const error = "";

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Formação</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Formações</h1>
        <p className="mt-2 text-gray-500">Conteúdos bíblicos e espirituais para sua caminhada de formação.</p>
      </section>
      <div className="mt-6">
        <ContentFilters categorias={categorias} />
      </div>
      {loading && <div className="mt-6"><Loading /></div>}
      {error && <EmptyState title="Nao foi possivel carregar" description="Tente novamente em alguns instantes." />}
      {!loading && conteudos.length === 0 && <EmptyState title="Nenhuma formacao encontrada" description="Ajuste os filtros ou aguarde novos conteudos." />}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {conteudos.map((conteudo) => (
          <ContentCard key={conteudo.id} conteudo={conteudo} />
        ))}
      </div>
    </div>
  );
}
