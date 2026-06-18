"use client";

import { TIPO_CONTEUDO_LABELS, type CategoriaConteudo, type TipoConteudo } from "@/types/conteudo";

const tipos: Array<TipoConteudo | "todos"> = ["todos", "video", "audio", "documento", "link", "texto"];

type ContentFiltersProps = {
  busca?: string;
  categoriaSlug?: string;
  tipo?: TipoConteudo | "";
  categorias: CategoriaConteudo[];
  loading?: boolean;
  categoriasLoading?: boolean;
  categoriasError?: string;
  onBuscaChange?: (value: string) => void;
  onCategoriaChange?: (value: string) => void;
  onTipoChange?: (value: TipoConteudo | "") => void;
  onSubmit?: () => void;
};

export function ContentFilters({
  busca = "",
  categoriaSlug = "todas",
  tipo = "",
  categorias,
  loading = false,
  categoriasLoading = false,
  categoriasError = "",
  onBuscaChange = () => {},
  onCategoriaChange = () => {},
  onTipoChange = () => {},
  onSubmit = () => {}
}: ContentFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px_180px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
        placeholder="Buscar conteúdo"
      />
      <select
        className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
        value={categoriaSlug}
        disabled={categoriasLoading}
        aria-invalid={Boolean(categoriasError)}
        onChange={(event) => onCategoriaChange(event.target.value)}
      >
        <option value="todas">{categoriasLoading ? "Carregando categorias..." : "Todas as categorias"}</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.slug ?? categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
      <select
        className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
        value={tipo || "todos"}
        onChange={(event) => onTipoChange(event.target.value === "todos" ? "" : (event.target.value as TipoConteudo))}
      >
        {tipos.map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo === "todos" ? "Todos os tipos" : TIPO_CONTEUDO_LABELS[tipo]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#004B87] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#003366] disabled:translate-y-0 disabled:opacity-60"
      >
        Buscar
      </button>
    </form>
  );
}
