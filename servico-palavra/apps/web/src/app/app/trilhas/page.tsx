import { TrailCard } from "@/components/trilhas/TrailCard";
import { trilhas } from "@/data/mocks";

export default function TrilhasPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Trilhas</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Trilhas</h1>
        <p className="mt-2 text-gray-500">Sequências de conteúdos para formar com ordem e profundidade.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        {trilhas.map((trilha) => (
          <TrailCard key={trilha.id} trilha={trilha} />
        ))}
      </div>
    </div>
  );
}
