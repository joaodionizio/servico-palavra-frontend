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
    <section className="dark-continue-card relative overflow-hidden rounded-[var(--sp-radius-card)] bg-[#004B87] p-6 text-white shadow-lg transition-shadow duration-300 hover:shadow-xl sm:p-8 lg:p-10 dark:bg-[#061D33]">
      {thumbnailUrl && !imageFailed ? (
        <>
          <img
            src={thumbnailUrl}
            alt={`Capa de ${conteudo.titulo}`}
            className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-35 md:block"
            onError={() => setImageFailed(true)}
          />
          <div className="dark-continue-overlay absolute inset-0 bg-gradient-to-r from-[#004B87] via-[#004B87]/95 to-[#004B87]/45 dark:from-[#061D33] dark:via-[#061D33]/95 dark:to-[#061D33]/45" />
        </>
      ) : (
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent" />
      )}
      <div className="relative z-10 min-w-0">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Continuar formação</p>
        <h3 className="mt-4 break-words text-2xl font-black sm:text-3xl">{conteudo.titulo}</h3>
        <p className="mt-3 max-w-2xl break-words text-base text-white/80 sm:text-lg">{conteudo.descricao}</p>
        <LinkButton href={`/app/formacoes/${conteudo.slug}`} variant="gold" className="mt-6 w-full sm:mt-8 sm:w-auto">
          Continuar aula
        </LinkButton>
      </div>
    </section>
  );
}
