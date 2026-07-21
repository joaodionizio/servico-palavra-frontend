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
      className="grid gap-3 rounded-[1.5rem] border border-slate-200/70 bg-[#FDFDFB] p-3 shadow-[0_12px_35px_rgba(0,51,102,.05)] md:grid-cols-[1fr_220px_180px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        className="rounded-2xl border-0 bg-[#EEF3F5] px-5 py-3.5 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#004B87]/15"
        placeholder="Buscar por título ou tema"
      />
      <select
        className="rounded-2xl border-0 bg-[#EEF3F5] px-5 py-3.5 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#004B87]/15"
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
        className="rounded-2xl border-0 bg-[#EEF3F5] px-5 py-3.5 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#004B87]/15"
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
        className="rounded-2xl bg-[#FFCC00] px-6 py-3.5 text-sm font-black text-[#003A70] transition hover:-translate-y-0.5 hover:bg-[#FFE066] disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}
