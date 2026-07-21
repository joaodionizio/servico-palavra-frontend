"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getConteudoThumbnailUrl } from "@/lib/youtube";
import type { Conteudo } from "@/types/conteudo";

function ContentFallbackIcon({ tipo }: { tipo: Conteudo["tipo"] }) {
  return (
    <div className="content-cover flex h-52 w-full items-center justify-center bg-blue-50 text-4xl">
      {tipo === "audio" ? "🎧" : tipo === "documento" ? "📄" : tipo === "texto" ? "✍️" : "🎬"}
    </div>
  );
}

export function ContentCard({ conteudo }: { conteudo: Conteudo }) {
  const thumbnailUrl = getConteudoThumbnailUrl(conteudo);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [thumbnailUrl]);

  return (
    <Card className="content-card group min-w-0 flex flex-col overflow-hidden p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/10">
      {thumbnailUrl && !imageFailed ? (
        <div className="content-cover relative h-52 overflow-hidden bg-[#EAF1F5]">
          <img src={thumbnailUrl} alt={`Capa de ${conteudo.titulo}`} className="content-cover-image h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" onError={() => setImageFailed(true)} />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#003A70]/25 to-transparent" />
        </div>
      ) : (
        <ContentFallbackIcon tipo={conteudo.tipo} />
      )}
      <div className="min-w-0 flex flex-1 flex-col p-7">
        {conteudo.categoria && <Badge>{conteudo.categoria.nome}</Badge>}
        <h3 className="break-words mt-3 text-2xl font-black tracking-tight text-[#003A70]">{conteudo.titulo}</h3>
        <p className="break-words mt-2 flex-1 leading-6 text-gray-500">{conteudo.resumo ?? conteudo.descricao}</p>
        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-gray-400">
          {conteudo.tipoLabel ?? conteudo.tipo} {conteudo.origemLabel ? `• ${conteudo.origemLabel}` : ""} {conteudo.duracao ? `• ${conteudo.duracao}` : ""}
        </p>
        <LinkButton href={`/app/formacoes/${conteudo.slug}`} variant="secondary" className="mt-5">
          Ver formação
        </LinkButton>
      </div>
    </Card>
  );
}
