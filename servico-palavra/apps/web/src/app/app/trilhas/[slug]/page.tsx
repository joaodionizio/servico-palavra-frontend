import { notFound } from "next/navigation";
import { TrailContentList } from "@/components/trilhas/TrailContentList";
import { TrailProgress } from "@/components/trilhas/TrailProgress";
import { trilhas } from "@/data/mocks";

export default async function TrilhaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trilha = trilhas.find((item) => item.slug === slug);

  if (!trilha) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Trilha</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">{trilha.titulo}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-500">{trilha.descricao}</p>
      </div>
      <TrailProgress progresso={trilha.progresso} />
      <TrailContentList conteudos={trilha.conteudos} />
    </div>
  );
}
