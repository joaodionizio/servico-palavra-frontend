"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import {
  createAdminConteudo,
  getAdminConteudo,
  getOrigemConteudoNumber,
  getTipoConteudoNumber,
  getTipoMaterialApoioNumber,
  ORIGEM_CONTEUDO_OPTIONS,
  TIPO_CONTEUDO_OPTIONS,
  TIPO_MATERIAL_APOIO_OPTIONS,
  updateAdminConteudo
} from "@/services/adminContentService";
import type { AdminConteudoPayload, AdminMaterialApoioPayload } from "@/services/adminContentService";
import { listCategoriasConteudo } from "@/services/categoryService";
import type { AdminMaterialApoio, CategoriaConteudo } from "@/types/conteudo";

type ContentFormProps = {
  mode?: "create" | "edit";
  conteudoId?: string;
};

type MaterialForm = {
  titulo: string;
  descricao: string;
  tipo: string;
  url: string;
  ordem: string;
  ativo: boolean;
};

const initialForm = {
  titulo: "",
  descricao: "",
  resumo: "",
  tipo: "1",
  origem: "1",
  url: "",
  urlThumbnail: "",
  duracaoMinutos: "",
  categoriaConteudoId: "",
  publicado: false,
  destaque: false,
  ordem: "0"
};

const emptyMaterial: MaterialForm = {
  titulo: "",
  descricao: "",
  tipo: "1",
  url: "",
  ordem: "1",
  ativo: true
};

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 403) {
    return "Você não tem permissão para gerenciar conteúdos.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível salvar o conteúdo. Verifique os dados e tente novamente.";
}

function toMaterialForm(material: AdminMaterialApoio, index: number): MaterialForm {
  return {
    titulo: material.titulo,
    descricao: material.descricao ?? "",
    tipo: String(getTipoMaterialApoioNumber(material.tipo)),
    url: material.url,
    ordem: String(material.ordem ?? index + 1),
    ativo: material.ativo ?? true
  };
}

function buildMaterialPayload(material: MaterialForm, index: number): AdminMaterialApoioPayload | null {
  if (!material.titulo.trim() && !material.url.trim()) {
    return null;
  }

  return {
    titulo: material.titulo.trim(),
    descricao: material.descricao.trim() || undefined,
    tipo: Number(material.tipo),
    url: material.url.trim(),
    ordem: Number(material.ordem) || index + 1,
    ativo: material.ativo
  };
}

export function ContentForm({ mode = "create", conteudoId }: ContentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categorias, setCategorias] = useState<CategoriaConteudo[]>([]);
  const [materiais, setMateriais] = useState<MaterialForm[]>([]);
  const [materiaisTouched, setMateriaisTouched] = useState(mode === "create");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategorias() {
      try {
        const nextCategorias = await listCategoriasConteudo();

        if (active) {
          setCategorias(nextCategorias);
          setForm((current) => ({
            ...current,
            categoriaConteudoId: current.categoriaConteudoId || nextCategorias[0]?.id || ""
          }));
        }
      } catch (currentError) {
        if (active) {
          setError(getErrorMessage(currentError));
        }
      }
    }

    void loadCategorias();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !conteudoId) {
      return;
    }

    let active = true;
    const id = conteudoId;

    async function loadConteudo() {
      setLoading(true);
      setError("");

      try {
        const conteudo = await getAdminConteudo(id);

        if (!active) {
          return;
        }

        setForm({
          titulo: conteudo.titulo,
          descricao: conteudo.descricao,
          resumo: conteudo.resumo ?? "",
          tipo: String(getTipoConteudoNumber(conteudo.tipo)),
          origem: String(conteudo.origem ? getOrigemConteudoNumber(conteudo.origem) : 3),
          url: conteudo.url ?? "",
          urlThumbnail: conteudo.urlThumbnail ?? "",
          duracaoMinutos: conteudo.duracaoMinutos ? String(conteudo.duracaoMinutos) : "",
          categoriaConteudoId: conteudo.categoriaConteudoId || conteudo.categoria.id,
          publicado: conteudo.publicado,
          destaque: conteudo.destaque ?? false,
          ordem: String(conteudo.ordem ?? 0)
        });
        setMateriais((conteudo.materiais ?? []).map(toMaterialForm));
        setMateriaisTouched(false);
      } catch (currentError) {
        if (active) {
          setError(getErrorMessage(currentError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadConteudo();

    return () => {
      active = false;
    };
  }, [conteudoId, mode]);

  function updateField(field: keyof typeof initialForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function updateMaterial(index: number, field: keyof MaterialForm, value: string | boolean) {
    setMateriaisTouched(true);
    setMateriais((current) => current.map((material, materialIndex) => (materialIndex === index ? { ...material, [field]: value } : material)));
  }

  function addMaterial() {
    setMateriaisTouched(true);
    setMateriais((current) => [...current, { ...emptyMaterial, ordem: String(current.length + 1) }]);
  }

  function removeMaterial(index: number) {
    setMateriaisTouched(true);
    setMateriais((current) => current.filter((_, materialIndex) => materialIndex !== index));
  }

  function buildPayload(): AdminConteudoPayload {
    const payload: AdminConteudoPayload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      resumo: form.resumo.trim() || undefined,
      tipo: Number(form.tipo),
      origem: Number(form.origem),
      url: form.url.trim() || undefined,
      urlThumbnail: form.urlThumbnail.trim() || undefined,
      duracaoMinutos: form.duracaoMinutos ? Number(form.duracaoMinutos) : undefined,
      categoriaConteudoId: form.categoriaConteudoId,
      publicado: form.publicado,
      destaque: form.destaque,
      ordem: Number(form.ordem) || 0
    };

    if (mode === "create" || materiaisTouched) {
      payload.materiaisApoio = materiais.map(buildMaterialPayload).filter((material): material is AdminMaterialApoioPayload => Boolean(material));
    }

    return payload;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = buildPayload();

      if (mode === "edit" && conteudoId) {
        await updateAdminConteudo(conteudoId, payload);
        setMateriaisTouched(false);
        setMessage("Conteúdo atualizado com sucesso.");
      } else {
        const created = await createAdminConteudo(payload);
        router.push(`/admin/conteudos/${created.id}/editar`);
      }
    } catch (currentError) {
      setError(getErrorMessage(currentError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center font-bold text-[#004B87] shadow-sm">Carregando conteúdo...</div>;
  }

  return (
    <form className="grid gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
          Título
          <input value={form.titulo} onChange={(event) => updateField("titulo", event.target.value)} required className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
          Descrição
          <textarea value={form.descricao} onChange={(event) => updateField("descricao", event.target.value)} required className="min-h-28 rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
          Resumo
          <textarea value={form.resumo} onChange={(event) => updateField("resumo", event.target.value)} className="min-h-20 rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600">
          Categoria
          <select value={form.categoriaConteudoId} onChange={(event) => updateField("categoriaConteudoId", event.target.value)} required className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
            <option value="">Selecione</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600">
          Tipo
          <select value={form.tipo} onChange={(event) => updateField("tipo", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
            {TIPO_CONTEUDO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600">
          Origem
          <select value={form.origem} onChange={(event) => updateField("origem", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10">
            {ORIGEM_CONTEUDO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600">
          Duração em minutos
          <input type="number" min="0" value={form.duracaoMinutos} onChange={(event) => updateField("duracaoMinutos", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
          URL do conteúdo
          <input type="url" value={form.url} onChange={(event) => updateField("url", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600 md:col-span-2">
          URL da thumbnail
          <input type="url" value={form.urlThumbnail} onChange={(event) => updateField("urlThumbnail", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-600">
          Ordem
          <input type="number" value={form.ordem} onChange={(event) => updateField("ordem", event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" />
        </label>
        <div className="flex flex-wrap items-center gap-5 pt-7">
          <label className="inline-flex items-center gap-2 text-sm font-bold text-gray-600">
            <input type="checkbox" checked={form.publicado} onChange={(event) => updateField("publicado", event.target.checked)} />
            Publicado
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-bold text-gray-600">
            <input type="checkbox" checked={form.destaque} onChange={(event) => updateField("destaque", event.target.checked)} />
            Destaque
          </label>
        </div>
      </div>

      <section className="grid gap-4 border-t border-gray-100 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#004B87]">Materiais de apoio</h2>
          <Button type="button" variant="secondary" onClick={addMaterial}>
            Adicionar material
          </Button>
        </div>

        {materiais.length === 0 && <p className="text-sm text-gray-500">Nenhum material cadastrado.</p>}

        {materiais.map((material, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2">
            <input value={material.titulo} onChange={(event) => updateMaterial(index, "titulo", event.target.value)} placeholder="Título do material" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#004B87]" />
            <select value={material.tipo} onChange={(event) => updateMaterial(index, "tipo", event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#004B87]">
              {TIPO_MATERIAL_APOIO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input value={material.url} onChange={(event) => updateMaterial(index, "url", event.target.value)} placeholder="https://..." className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#004B87] md:col-span-2" />
            <input value={material.descricao} onChange={(event) => updateMaterial(index, "descricao", event.target.value)} placeholder="Descrição" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#004B87]" />
            <input type="number" value={material.ordem} onChange={(event) => updateMaterial(index, "ordem", event.target.value)} placeholder="Ordem" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#004B87]" />
            <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm font-bold text-gray-600">
                <input type="checkbox" checked={material.ativo} onChange={(event) => updateMaterial(index, "ativo", event.target.checked)} />
                Ativo
              </label>
              <Button type="button" variant="ghost" onClick={() => removeMaterial(index)}>
                Remover
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Criar conteúdo"}
        </Button>
        <LinkButton href="/admin/conteudos" variant="secondary">
          Voltar
        </LinkButton>
      </div>
    </form>
  );
}
