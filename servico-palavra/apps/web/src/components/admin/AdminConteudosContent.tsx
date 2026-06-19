"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { ApiError } from "@/lib/api";
import { deleteAdminConteudo, listAdminConteudos, TIPO_CONTEUDO_OPTIONS, updateAdminConteudoPublicacao } from "@/services/adminContentService";
import type { AdminConteudo, AdminConteudoPage } from "@/types/conteudo";
import { listAdminCategorias } from "@/services/adminCategoryService";
import type { CategoriaConteudo } from "@/types/conteudo";

type AdminConteudosState =
  | { status: "loading"; page: null; message?: never }
  | { status: "ready"; page: AdminConteudoPage; message?: never }
  | { status: "error"; page: null; message: string };

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 403) {
    return "Você não tem permissão para gerenciar conteúdos.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível carregar os conteúdos.";
}

export function AdminConteudosContent() {
  const [busca, setBusca] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [tipo, setTipo] = useState("");
  const [publicado, setPublicado] = useState("");
  const [categorias, setCategorias] = useState<CategoriaConteudo[]>([]);
  const [categoriaError, setCategoriaError] = useState("");
  const [state, setState] = useState<AdminConteudosState>({ status: "loading", page: null });
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  async function loadConteudos(nextPage = 1) {
    setState({ status: "loading", page: null });
    setActionError("");

    try {
      const page = await listAdminConteudos({
        busca,
        categoriaSlug,
        tipo: tipo ? Number(tipo) : "",
        publicado: publicado === "" ? "" : publicado === "true",
        pagina: nextPage,
        tamanhoPagina: 20
      });

      setState({ status: "ready", page });
    } catch (error) {
      setState({ status: "error", page: null, message: getErrorMessage(error) });
    }
  }

  useEffect(() => {
    async function loadCategorias() {
      try {
        setCategorias(await listAdminCategorias());
      } catch (error) {
        setCategoriaError(getErrorMessage(error));
      }
    }

    void loadCategorias();
    void loadConteudos(1);
  }, []);

  async function togglePublicacao(conteudo: AdminConteudo) {
    setActionError("");
    setActionMessage("");

    try {
      await updateAdminConteudoPublicacao(conteudo.id, !conteudo.publicado);
      setActionMessage(conteudo.publicado ? "Conteúdo despublicado." : "Conteúdo publicado.");
      await loadConteudos(state.status === "ready" ? state.page.pagina : 1);
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  async function excluirConteudo(conteudo: AdminConteudo) {
    const confirmado = window.confirm(`Excluir o conteúdo "${conteudo.titulo}"? Esta ação não pode ser desfeita.`);

    if (!confirmado) {
      return;
    }

    setDeletingId(conteudo.id);
    setActionError("");
    setActionMessage("");

    try {
      await deleteAdminConteudo(conteudo.id);
      setActionMessage("Conteúdo excluído.");
      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }

        const itens = current.page.itens.filter((item) => item.id !== conteudo.id);

        return {
          status: "ready",
          page: {
            ...current.page,
            itens,
            totalItens: Math.max(0, current.page.totalItens - 1)
          }
        };
      });
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeletingId("");
    }
  }

  const conteudos = state.status === "ready" ? state.page.itens : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Conteúdos</h1>
          <p className="mt-2 text-gray-500">Listar, criar, editar, publicar e despublicar conteúdos.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/admin/categorias" variant="secondary">
            Categorias
          </LinkButton>
          <LinkButton href="/admin/conteudos/novo">Novo conteúdo</LinkButton>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_180px_160px_160px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void loadConteudos(1);
        }}
      >
        <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar conteúdo" className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        <select value={categoriaSlug} onChange={(event) => setCategoriaSlug(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.slug ?? categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
        <select value={tipo} onChange={(event) => setTipo(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
          <option value="">Todos os tipos</option>
          {TIPO_CONTEUDO_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select value={publicado} onChange={(event) => setPublicado(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
          <option value="">Todos</option>
          <option value="true">Publicados</option>
          <option value="false">Rascunhos</option>
        </select>
        <Button type="submit" disabled={state.status === "loading"}>
          Buscar
        </Button>
      </form>

      {categoriaError && <p className="text-sm font-semibold text-yellow-700">{categoriaError}</p>}
      {actionMessage && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{actionMessage}</p>}
      {actionError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{actionError}</p>}

      {state.status === "loading" && <Loading label="Carregando conteúdos..." />}
      {state.status === "error" && <EmptyState title="Não foi possível carregar" description={state.message} />}
      {state.status === "ready" && conteudos.length === 0 && <EmptyState title="Nenhum conteúdo encontrado" description="Ajuste os filtros ou crie uma nova formação." />}

      {conteudos.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {conteudos.map((conteudo) => (
            <div key={conteudo.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[1fr_120px_120px_300px] md:items-center">
              <div>
                <strong className="text-[#004B87]">{conteudo.titulo}</strong>
                <p className="mt-1 text-sm text-gray-500">{conteudo.categoria?.nome ?? "Sem categoria"}</p>
              </div>
              <Badge>{conteudo.tipoLabel ?? conteudo.tipo}</Badge>
              <span className="text-sm font-semibold text-gray-500">{conteudo.publicado ? "Publicado" : "Rascunho"}</span>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button type="button" variant={conteudo.publicado ? "secondary" : "gold"} onClick={() => togglePublicacao(conteudo)}>
                  {conteudo.publicado ? "Despublicar" : "Publicar"}
                </Button>
                <LinkButton href={`/admin/conteudos/${conteudo.id}/editar`} variant="secondary">
                  Editar
                </LinkButton>
                <Button type="button" variant="ghost" disabled={deletingId === conteudo.id} onClick={() => excluirConteudo(conteudo)}>
                  {deletingId === conteudo.id ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.status === "ready" && state.page.totalPaginas > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="secondary" disabled={state.page.pagina <= 1} onClick={() => loadConteudos(state.page.pagina - 1)}>
            Anterior
          </Button>
          <span className="text-sm font-bold text-gray-500">
            Página {state.page.pagina} de {state.page.totalPaginas}
          </span>
          <Button type="button" variant="secondary" disabled={state.page.pagina >= state.page.totalPaginas} onClick={() => loadConteudos(state.page.pagina + 1)}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
