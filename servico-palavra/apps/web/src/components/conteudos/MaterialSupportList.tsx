import { TIPO_MATERIAL_APOIO_LABELS, type MaterialApoio } from "@/types/conteudo";

export function MaterialSupportList({ materiais = [] }: { materiais?: MaterialApoio[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-[#FDFDFB] p-8 shadow-sm md:p-10">
      <h2 className="text-2xl font-black text-[#004B87]">Materiais de apoio</h2>
      <div className="mt-5 grid gap-3">
        {materiais.length === 0 && <p className="text-gray-500">Nenhum material cadastrado para esta formação.</p>}
        {materiais.map((material) => (
          <a
            key={material.id}
            href={material.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-200/70 bg-[#F4F7F8] px-5 py-4 text-sm font-bold text-gray-600 transition-all hover:translate-x-1 hover:bg-[#004B87] hover:text-white"
          >
            {material.titulo} <span className="font-medium opacity-70">({TIPO_MATERIAL_APOIO_LABELS[material.tipo]})</span>
          </a>
        ))}
      </div>
    </div>
  );
}
