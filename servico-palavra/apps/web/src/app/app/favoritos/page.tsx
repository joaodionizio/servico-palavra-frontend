"use client";

import { useEffect, useState } from "react";
import { ContentCard } from "@/components/conteudos/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { listFavoritos } from "@/services/contentService";
import type { Conteudo } from "@/types/conteudo";

type FavoritosState =
  | { status: "loading"; conteudos: Conteudo[]; message?: never }
  | { status: "ready"; conteudos: Conteudo[]; message?: never }
  | { status: "error"; conteudos: Conteudo[]; message: string };

export default function FavoritosPage() {
  const [state, setState] = useState<FavoritosState>({ status: "loading", conteudos: [] });

  useEffect(() => {
    let active = true;

    async function loadFavoritos() {
      try {
        const conteudos = await listFavoritos();

        if (active) {
          setState({ status: "ready", conteudos });
        }
      } catch {
        if (active) {
          setState({ status: "error", conteudos: [], message: "Não foi possível carregar seus favoritos agora. Tente novamente em instantes." });
        }
      }
    }

    void loadFavoritos();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="page-stage page-stage-favorites">
        <div className="page-stage-art" aria-hidden="true"><i /><i /><i /></div>
        <div className="relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Favoritos</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.05em] text-[#004B87] md:text-7xl">Favoritos</h1>
        <p className="mt-2 text-gray-500">Conteúdos separados para revisitar com calma.</p>
        </div>
      </section>

      {state.status === "loading" && <Loading label="Carregando favoritos..." />}
      {state.status === "error" && <EmptyState title="Não foi possível carregar" description={state.message} />}
      {state.status === "ready" && state.conteudos.length === 0 && (
        <EmptyState title="Nenhum favorito ainda" description="Abra uma formação e toque em Favoritar para guardá-la nesta lista." />
      )}

      {state.conteudos.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {state.conteudos.map((conteudo) => (
            <ContentCard key={conteudo.id} conteudo={conteudo} />
          ))}
        </div>
      )}
    </div>
  );
}
