"use client";

import { useEffect, useState } from "react";
import { ContentCard } from "@/components/conteudos/ContentCard";
import { ContentFilters } from "@/components/conteudos/ContentFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { listCategoriasConteudo } from "@/services/categoryService";
import { listConteudos } from "@/services/contentService";
import type { CategoriaConteudo, Conteudo, ConteudoPage, TipoConteudo } from "@/types/conteudo";

type FormacoesState =
  | { status: "loading"; page: null; message?: never }
  | { status: "ready"; page: ConteudoPage; message?: never }
  | { status: "error"; page: null; message: string };

type CategoriasState =
  | { status: "loading"; categorias: CategoriaConteudo[]; message?: never }
  | { status: "ready"; categorias: CategoriaConteudo[]; message?: never }
  | { status: "error"; categorias: CategoriaConteudo[]; message: string };

export function FormacoesContent() {
  const [busca, setBusca] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("todas");
  const [tipo, setTipo] = useState<TipoConteudo | "">("");
  const [pagina, setPagina] = useState(1);
  const [state, setState] = useState<FormacoesState>({ status: "loading", page: null });
  const [categoriasState, setCategoriasState] = useState<CategoriasState>({ status: "loading", categorias: [] });

  async function loadFormacoes(nextPage = 1) {
    setState((current) => (nextPage === 1 ? { status: "loading", page: null } : current));

    try {
      const page = await listConteudos({
        busca,
        categoriaSlug: categoriaSlug === "todas" ? "" : categoriaSlug,
        tipo,
        pagina: nextPage,
        tamanhoPagina: 12
      });

      setState((current) => {
        if (nextPage > 1 && current.status === "ready") {
          return {
            status: "ready",
            page: {
              ...page,
              itens: [...current.page.itens, ...page.itens]
            }
          };
        }

        return { status: "ready", page };
      });
      setPagina(nextPage);
    } catch {
      setState({ status: "error", page: null, message: "Não foi possível carregar as formações agora." });
    }
  }

  useEffect(() => {
    loadFormacoes(1);
  }, []);

  useEffect(() => {
    async function loadCategorias() {
      setCategoriasState({ status: "loading", categorias: [] });

      try {
        const categorias = await listCategoriasConteudo();
        setCategoriasState({ status: "ready", categorias });
      } catch {
        setCategoriasState({
          status: "error",
          categorias: [],
          message: "Não foi possível carregar as categorias agora."
        });
      }
    }

    loadCategorias();
  }, []);

  const conteudos: Conteudo[] = state.status === "ready" ? state.page.itens : [];
  const hasMore = state.status === "ready" && state.page.pagina < state.page.totalPaginas;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <section className="formation-hero relative overflow-hidden rounded-[2rem] bg-[#003A70] p-8 text-white shadow-xl shadow-blue-950/10 md:p-12">
        <div className="formation-sculpture" aria-hidden="true"><i /><i /><i /></div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Formação</p>
          <h1 className="mt-3 text-5xl font-black tracking-[-.05em] text-white md:text-7xl">Formações</h1>
          <p className="mt-4 text-white/65">Conteúdos bíblicos e espirituais para sua caminhada de formação.</p>
        </div>
      </section>

      <ContentFilters
        busca={busca}
        categoriaSlug={categoriaSlug}
        tipo={tipo}
        categorias={categoriasState.categorias}
        loading={state.status === "loading"}
        categoriasLoading={categoriasState.status === "loading"}
        categoriasError={categoriasState.status === "error" ? categoriasState.message : ""}
        onBuscaChange={setBusca}
        onCategoriaChange={setCategoriaSlug}
        onTipoChange={setTipo}
        onSubmit={() => loadFormacoes(1)}
      />

      {categoriasState.status === "error" && <p className="text-sm font-semibold text-yellow-700">{categoriasState.message}</p>}

      {state.status === "loading" && <Loading label="Carregando formações..." />}
      {state.status === "error" && <EmptyState title="Não foi possível carregar" description={`${state.message} Tente novamente ou ajuste os filtros.`} />}
      {state.status === "ready" && conteudos.length === 0 && (
        <EmptyState title="Nenhuma formação encontrada" description="Remova filtros, tente outra busca ou aguarde novas formações publicadas." />
      )}

      {conteudos.length > 0 && (
        <div className="formation-grid grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {conteudos.map((conteudo) => (
            <ContentCard key={conteudo.id} conteudo={conteudo} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => loadFormacoes(pagina + 1)}
            className="rounded-xl bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#003366]"
          >
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
}
