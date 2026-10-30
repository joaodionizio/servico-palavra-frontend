"use client";

import { Button } from "@/components/ui/Button";
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

const fieldClass = "min-h-11 min-w-0 w-full rounded-2xl border border-[var(--sp-border)] bg-[var(--sp-surface-muted)] px-4 py-3 text-sm text-[var(--sp-text)] transition-colors placeholder:text-[var(--sp-text-muted)] focus:border-[var(--sp-focus)] focus:bg-[var(--sp-surface)] focus:ring-2 focus:ring-[#0B73B9]/15 sm:px-5 sm:py-3.5 dark:focus:ring-yellow-300/15";

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
      className="grid gap-3 rounded-[1.5rem] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-3 text-[var(--sp-text)] shadow-[0_12px_35px_rgba(0,51,102,.05)] md:grid-cols-[minmax(0,1fr)_minmax(170px,220px)_minmax(150px,180px)_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        className={fieldClass}
        aria-label="Buscar formações por título ou tema"
        placeholder="Buscar por título ou tema"
      />
      <select
        className={fieldClass}
        value={categoriaSlug}
        disabled={categoriasLoading}
        aria-label="Filtrar por categoria"
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
        className={fieldClass}
        value={tipo || "todos"}
        aria-label="Filtrar por tipo de conteúdo"
        onChange={(event) => onTipoChange(event.target.value === "todos" ? "" : (event.target.value as TipoConteudo))}
      >
        {tipos.map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo === "todos" ? "Todos os tipos" : TIPO_CONTEUDO_LABELS[tipo]}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={loading} variant="gold" className="!rounded-2xl px-6 sm:min-w-28">
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
}
