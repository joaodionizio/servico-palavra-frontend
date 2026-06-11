import type { CategoriaConteudo, TipoConteudo } from "@/types/conteudo";

const tipos: Array<TipoConteudo | "todos"> = ["todos", "video", "audio", "documento", "link", "texto"];

export function ContentFilters({ categorias }: { categorias: CategoriaConteudo[] }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-3">
      <input
        className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
        placeholder="Buscar conteúdo"
      />
      <select className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" defaultValue="todas">
        <option value="todas">Todas as categorias</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
      <select className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" defaultValue="todos">
        {tipos.map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo === "todos" ? "Todos os tipos" : tipo}
          </option>
        ))}
      </select>
    </div>
  );
}
