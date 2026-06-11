import { ContentCard } from "@/components/conteudos/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { conteudos } from "@/data/mocks";

export default function FavoritosPage() {
  const favoritos = conteudos.filter((conteudo) => conteudo.favorito);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Favoritos</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Favoritos</h1>
        <p className="mt-2 text-gray-500">Conteúdos separados para revisitar com calma.</p>
      </section>
      {favoritos.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum favorito ainda" description="Favorite formacoes para encontra-las aqui." />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {favoritos.map((conteudo) => (
            <ContentCard key={conteudo.id} conteudo={conteudo} />
          ))}
        </div>
      )}
    </div>
  );
}
