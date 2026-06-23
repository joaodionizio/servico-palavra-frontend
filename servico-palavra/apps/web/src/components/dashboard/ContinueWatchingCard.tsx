"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { getConteudoThumbnailUrl } from "@/lib/youtube";
import type { Conteudo } from "@/types/conteudo";

export function ContinueWatchingCard({ conteudo }: { conteudo: Conteudo }) {
  const thumbnailUrl = getConteudoThumbnailUrl(conteudo);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [thumbnailUrl]);

  return (
    <section className="dark-continue-card relative overflow-hidden rounded-2xl bg-[#004B87] p-10 text-white shadow-lg transition-all hover:shadow-xl">
      {thumbnailUrl && !imageFailed ? (
        <>
          <img
            src={thumbnailUrl}
            alt={`Capa de ${conteudo.titulo}`}
            className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-35 md:block"
            onError={() => setImageFailed(true)}
          />
          <div className="dark-continue-overlay absolute inset-0 bg-gradient-to-r from-[#004B87] via-[#004B87]/95 to-[#004B87]/45" />
        </>
      ) : (
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />
      )}
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
