import { Card } from "@/components/ui/Card";
import { TIPO_MATERIAL_APOIO_LABELS, type MaterialApoio } from "@/types/conteudo";

export function MaterialSupportList({ materiais = [] }: { materiais?: MaterialApoio[] }) {
  return (
    <Card className="rounded-[2rem] p-8 md:p-10">
      <h2 className="text-2xl font-black text-[var(--sp-brand)] dark:text-white">Materiais de apoio</h2>
      <div className="mt-5 grid gap-3">
        {materiais.length === 0 && <p className="text-[var(--sp-text-muted)]">Nenhum material cadastrado para esta formação.</p>}
        {materiais.map((material) => (
          <a
            key={material.id}
            href={material.url}
            target="_blank"
            rel="noreferrer"
            className="ui-control rounded-2xl border border-[var(--sp-border)] bg-[var(--sp-surface-muted)] px-5 py-4 text-sm font-bold text-[var(--sp-text)] hover:border-[var(--sp-focus)] hover:bg-[var(--sp-action-primary-bg)] hover:text-[var(--sp-action-primary-fg)]"
          >
            {material.titulo} <span className="font-medium opacity-70">({TIPO_MATERIAL_APOIO_LABELS[material.tipo]})</span>
          </a>
        ))}
      </div>
    </Card>
  );
}
