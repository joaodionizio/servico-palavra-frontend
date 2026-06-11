import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Conteudo } from "@/types/conteudo";

export function ContinueWatchingCard({ conteudo }: { conteudo: Conteudo }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#004B87] p-10 text-white shadow-lg transition-all hover:shadow-xl">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />
      <div className="relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Continuar formação</p>
        <h3 className="mt-4 text-3xl font-black">{conteudo.titulo}</h3>
        <p className="mt-3 max-w-2xl text-lg text-white/80">{conteudo.descricao}</p>
        <LinkButton href={`/app/formacoes/${conteudo.slug}`} variant="gold" className="mt-8">
          Continuar aula
        </LinkButton>
      </div>
    </section>
  );
}
