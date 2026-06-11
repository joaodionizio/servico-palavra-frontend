import { ContentCard } from "@/components/conteudos/ContentCard";
import { ContentFilters } from "@/components/conteudos/ContentFilters";
import { categorias, conteudos } from "@/data/mocks";

export default function BibliotecaPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Biblioteca</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Biblioteca</h1>
        <p className="mt-3 text-gray-500">Lista geral de conteúdos, materiais, documentos e links para consulta.</p>
      </section>
      <div className="mt-6">
        <ContentFilters categorias={categorias} />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {conteudos.map((conteudo) => (
          <ContentCard key={conteudo.id} conteudo={conteudo} />
        ))}
      </div>
    </div>
  );
}
