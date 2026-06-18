import { TIPO_MATERIAL_APOIO_LABELS, type MaterialApoio } from "@/types/conteudo";

export function MaterialSupportList({ materiais = [] }: { materiais?: MaterialApoio[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-[#004B87]">Materiais de apoio</h2>
      <div className="mt-5 grid gap-3">
        {materiais.length === 0 && <p className="text-gray-500">Nenhum material cadastrado para esta formação.</p>}
        {materiais.map((material) => (
          <a
            key={material.id}
            href={material.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-[#004B87] hover:text-white"
          >
            {material.titulo} <span className="font-medium opacity-70">({TIPO_MATERIAL_APOIO_LABELS[material.tipo]})</span>
          </a>
        ))}
      </div>
    </div>
  );
}
