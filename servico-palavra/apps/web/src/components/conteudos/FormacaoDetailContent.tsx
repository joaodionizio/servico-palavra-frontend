"use client";

import { useEffect, useState } from "react";
import { ContentPlayer } from "@/components/conteudos/ContentPlayer";
import { MaterialSupportList } from "@/components/conteudos/MaterialSupportList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import {
  concluirConteudo,
  desmarcarConclusaoConteudo,
  desfavoritarConteudo,
  favoritarConteudo,
  getConteudoBySlug
} from "@/services/contentService";
import type { Conteudo } from "@/types/conteudo";

type FormacaoDetailState =
  | { status: "loading"; conteudo: null; message?: never }
  | { status: "ready"; conteudo: Conteudo; message?: never }
  | { status: "error"; conteudo: null; message: string };

export function FormacaoDetailContent({ slug }: { slug: string }) {
  const [state, setState] = useState<FormacaoDetailState>({ status: "loading", conteudo: null });
  const [actionMessage, setActionMessage] = useState("");

  async function loadConteudo() {
    setState({ status: "loading", conteudo: null });

    try {
      const conteudo = await getConteudoBySlug(slug);
      setState({ status: "ready", conteudo });
    } catch {
      setState({ status: "error", conteudo: null, message: "Não foi possível carregar esta formação." });
    }
  }

  useEffect(() => {
    loadConteudo();
  }, [slug]);

  async function toggleFavorito() {
    if (state.status !== "ready") {
      return;
    }

    const previous = state.conteudo;
    const nextFavorito = !previous.favorito;

    setActionMessage("");
    setState({ status: "ready", conteudo: { ...previous, favorito: nextFavorito } });

    try {
      if (nextFavorito) {
        await favoritarConteudo(previous.id);
      } else {
        await desfavoritarConteudo(previous.id);
      }
    } catch {
      setState({ status: "ready", conteudo: previous });
      setActionMessage("Não foi possível atualizar o favorito agora.");
    }
  }

  async function toggleConclusao() {
    if (state.status !== "ready") {
      return;
    }

    const previous = state.conteudo;
    const nextConcluido = !previous.concluido;

    setActionMessage("");
    setState({ status: "ready", conteudo: { ...previous, concluido: nextConcluido } });

    try {
      if (nextConcluido) {
        await concluirConteudo(previous.id);
      } else {
        await desmarcarConclusaoConteudo(previous.id);
      }
    } catch {
      setState({ status: "ready", conteudo: previous });
      setActionMessage("Não foi possível atualizar a conclusão agora.");
    }
  }

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-5xl animate-fade-in">
        <Loading label="Carregando formação..." />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-5xl animate-fade-in">
        <EmptyState title="Formação indisponível" description={state.message} />
      </div>
    );
  }

  const conteudo = state.conteudo;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <div className="content-detail-stage relative overflow-hidden rounded-[2rem] bg-[#003A70] p-8 text-white shadow-xl md:p-12">
        <div className="content-detail-light" aria-hidden="true" />
        <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          {conteudo.categoria && <Badge>{conteudo.categoria.nome}</Badge>}
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">{conteudo.tipoLabel ?? conteudo.tipo}</span>
          {conteudo.origemLabel && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">{conteudo.origemLabel}</span>}
          {conteudo.duracao && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">{conteudo.duracao}</span>}
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-.045em] text-white md:text-6xl">{conteudo.titulo}</h1>
        <p className="mt-5 max-w-3xl leading-7 text-white/60">{conteudo.descricao}</p>
        </div>
      </div>

      <ContentPlayer conteudo={conteudo} />

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant={conteudo.favorito ? "gold" : "secondary"} onClick={toggleFavorito}>
          {conteudo.favorito ? "Remover favorito" : "Favoritar"}
        </Button>
        <Button type="button" onClick={toggleConclusao}>
          {conteudo.concluido ? "Desmarcar conclusão" : "Marcar como concluído"}
        </Button>
      </div>

      {actionMessage && <p className="rounded-xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-gray-600">{actionMessage}</p>}

      <MaterialSupportList materiais={conteudo.materiais} />
    </div>
  );
}
