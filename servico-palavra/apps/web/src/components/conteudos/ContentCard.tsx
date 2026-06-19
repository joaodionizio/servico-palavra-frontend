"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getConteudoThumbnailUrl } from "@/lib/youtube";
import type { Conteudo } from "@/types/conteudo";

function ContentFallbackIcon({ tipo }: { tipo: Conteudo["tipo"] }) {
  return (
    <div className="flex h-40 w-full items-center justify-center bg-blue-50 text-4xl">
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
    <Card className="flex flex-col overflow-hidden p-0">
      {thumbnailUrl && !imageFailed ? (
        <img src={thumbnailUrl} alt={`Capa de ${conteudo.titulo}`} className="h-40 w-full object-cover" onError={() => setImageFailed(true)} />
      ) : (
        <ContentFallbackIcon tipo={conteudo.tipo} />
      )}
      <div className="flex flex-1 flex-col p-8">
        {conteudo.categoria && <Badge>{conteudo.categoria.nome}</Badge>}
        <h3 className="mt-3 text-xl font-black text-[#004B87]">{conteudo.titulo}</h3>
        <p className="mt-2 flex-1 leading-6 text-gray-500">{conteudo.resumo ?? conteudo.descricao}</p>
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
