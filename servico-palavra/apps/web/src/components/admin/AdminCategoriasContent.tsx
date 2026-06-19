"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { ApiError } from "@/lib/api";
import {
  createAdminCategoria,
  deleteAdminCategoria,
  listAdminCategorias,
  updateAdminCategoria,
  updateAdminCategoriaStatus
} from "@/services/adminCategoryService";
import type { AdminCategoriaPayload } from "@/services/adminCategoryService";
import type { CategoriaConteudo } from "@/types/categoria";

type CategoriasState =
  | { status: "loading"; categorias: CategoriaConteudo[]; message?: never }
  | { status: "ready"; categorias: CategoriaConteudo[]; message?: never }
  | { status: "error"; categorias: CategoriaConteudo[]; message: string };

type CategoriaFormState = {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: string;
  ativo: boolean;
};

const initialForm: CategoriaFormState = {
  id: "",
  nome: "",
  descricao: "",
  cor: "#0A4F8F",
  icone: "",
  ordem: "",
  ativo: true
};

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 403) {
    return "Você não tem permissão para gerenciar categorias.";
  }

  if (error instanceof ApiError && error.status === 409) {
    return "Esta categoria está em uso por conteúdos e não pode ser excluída.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

function toForm(categoria: CategoriaConteudo): CategoriaFormState {
  return {
    id: categoria.id,
    nome: categoria.nome,
    descricao: categoria.descricao ?? "",
    cor: categoria.cor ?? "#0A4F8F",
    icone: categoria.icone ?? "",
    ordem: categoria.ordem === undefined ? "" : String(categoria.ordem),
    ativo: categoria.ativo ?? true
  };
}

function buildPayload(form: CategoriaFormState): AdminCategoriaPayload {
  return {
    nome: form.nome.trim(),
    descricao: form.descricao.trim() || undefined,
    cor: form.cor.trim() || undefined,
    icone: form.icone.trim() || undefined,
    ordem: form.ordem ? Number(form.ordem) : undefined,
    ativo: form.ativo
  };
}

export function AdminCategoriasContent() {
  const [state, setState] = useState<CategoriasState>({ status: "loading", categorias: [] });
  const [form, setForm] = useState<CategoriaFormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function loadCategorias() {
    setState({ status: "loading", categorias: [] });
    setActionError("");

    try {
      const categorias = await listAdminCategorias();
      setState({ status: "ready", categorias });
    } catch (error) {
      setState({ status: "error", categorias: [], message: getErrorMessage(error) });
    }
  }

  useEffect(() => {
    void loadCategorias();
  }, []);

  function updateField(field: keyof CategoriaFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    setActionMessage("");
  }

  function resetForm() {
    setForm(initialForm);
    setActionError("");
    setActionMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setActionError("");
    setActionMessage("");

    try {
      const payload = buildPayload(form);
      const saved = form.id ? await updateAdminCategoria(form.id, payload) : await createAdminCategoria(payload);

      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }

        const categorias = form.id
          ? current.categorias.map((categoria) => (categoria.id === saved.id ? saved : categoria))
          : [...current.categorias, saved];

        return { status: "ready", categorias: categorias.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome, "pt-BR")) };
      });
      setForm(initialForm);
      setActionMessage(form.id ? "Categoria atualizada." : "Categoria criada.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(categoria: CategoriaConteudo) {
    setActionError("");
    setActionMessage("");
    setStatusUpdatingId(categoria.id);

    try {
      const nextAtivo = !(categoria.ativo ?? true);
      await updateAdminCategoriaStatus(categoria.id, nextAtivo);
      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }

        return {
          status: "ready",
          categorias: current.categorias.map((item) => (item.id === categoria.id ? { ...item, ativo: nextAtivo } : item))
        };
      });
      setActionMessage(nextAtivo ? "Categoria ativada." : "Categoria desativada.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setStatusUpdatingId("");
    }
  }

  async function excluirCategoria(categoria: CategoriaConteudo) {
    const confirmado = window.confirm(`Excluir a categoria "${categoria.nome}"? Esta ação não pode ser desfeita.`);

    if (!confirmado) {
      return;
    }

    setDeletingId(categoria.id);
    setActionError("");
    setActionMessage("");

    try {
      await deleteAdminCategoria(categoria.id);
      setState((current) => {
        if (current.status !== "ready") {
          return current;
        }

        return {
          status: "ready",
          categorias: current.categorias.filter((item) => item.id !== categoria.id)
        };
      });

      if (form.id === categoria.id) {
        setForm(initialForm);
      }

      setActionMessage("Categoria excluída.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setDeletingId("");
    }
  }

  const categorias = state.status === "ready" ? state.categorias : [];
  const editing = Boolean(form.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Categorias</h1>
          <p className="mt-2 text-gray-500">Gerencie categorias usadas nos filtros e no cadastro de formações.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/admin/conteudos" variant="secondary">
            Conteúdos
          </LinkButton>
        </div>
      </div>

      <form className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#004B87]">{editing ? "Editar categoria" : "Nova categoria"}</h2>
            <p className="mt-1 text-sm text-gray-500">Nome é obrigatório. Os demais campos ajudam a ordenar e identificar a categoria.</p>
          </div>
          {editing && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancelar edição
            </Button>
          )}
        </div>

        {actionMessage && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{actionMessage}</p>}
        {actionError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{actionError}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
            Nome <span className="text-xs font-semibold text-[#004B87]">Obrigatório</span>
            <input value={form.nome} onChange={(event) => updateField("nome", event.target.value)} required className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
            Descrição <span className="text-xs font-semibold text-gray-400">Opcional</span>
            <textarea value={form.descricao} onChange={(event) => updateField("descricao", event.target.value)} className="min-h-20 rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-gray-600">
            Cor <span className="text-xs font-semibold text-gray-400">Opcional</span>
            <input type="color" value={form.cor || "#0A4F8F"} onChange={(event) => updateField("cor", event.target.value)} className="h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-gray-600">
            Ícone <span className="text-xs font-semibold text-gray-400">Opcional</span>
            <input value={form.icone} onChange={(event) => updateField("icone", event.target.value)} placeholder="church" className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-gray-600">
            Ordem <span className="text-xs font-semibold text-gray-400">Opcional</span>
            <input type="number" value={form.ordem} onChange={(event) => updateField("ordem", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
          </label>
          <label className="inline-flex items-center gap-2 pt-7 text-sm font-bold text-gray-600">
            <input type="checkbox" checked={form.ativo} onChange={(event) => updateField("ativo", event.target.checked)} />
            Categoria ativa
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar categoria"}
          </Button>
          <Button type="button" variant="secondary" onClick={loadCategorias} disabled={state.status === "loading"}>
            Atualizar lista
          </Button>
        </div>
      </form>

      {state.status === "loading" && <Loading label="Carregando categorias..." />}
      {state.status === "error" && <EmptyState title="Não foi possível carregar" description={`${state.message} Confirme seu acesso de Admin e tente novamente.`} />}
      {state.status === "ready" && categorias.length === 0 && (
        <EmptyState title="Nenhuma categoria encontrada" description="Crie categorias para organizar filtros e facilitar o cadastro de formações." />
      )}

      {categorias.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[1fr_120px_280px] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="h-4 w-4 rounded-full border border-gray-200" style={{ backgroundColor: categoria.cor ?? "#0A4F8F" }} />
                  <strong className="text-[#004B87]">{categoria.nome}</strong>
                </div>
                <p className="mt-1 text-sm text-gray-500">{categoria.descricao || categoria.slug || "Sem descrição"}</p>
              </div>
              <Badge>{categoria.ativo ?? true ? "Ativa" : "Inativa"}</Badge>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button type="button" variant={categoria.ativo ?? true ? "secondary" : "gold"} disabled={statusUpdatingId === categoria.id} onClick={() => toggleStatus(categoria)}>
                  {statusUpdatingId === categoria.id ? "Atualizando..." : categoria.ativo ?? true ? "Desativar" : "Ativar"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setForm(toForm(categoria))}>
                  Editar
                </Button>
                <Button type="button" variant="ghost" disabled={deletingId === categoria.id} onClick={() => excluirCategoria(categoria)}>
                  {deletingId === categoria.id ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
