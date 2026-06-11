import { LinkButton } from "@/components/ui/Button";
import { TrailCard } from "@/components/trilhas/TrailCard";
import { trilhas } from "@/data/mocks";

export default function AdminTrilhasPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Trilhas</h1>
          <p className="mt-2 text-gray-500">Criar trilhas, adicionar conteúdos e ordenar sequências.</p>
        </div>
        <LinkButton href="/admin/trilhas/nova">Nova trilha</LinkButton>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {trilhas.map((trilha) => (
          <TrailCard key={trilha.id} trilha={trilha} />
        ))}
      </div>
    </div>
  );
}
