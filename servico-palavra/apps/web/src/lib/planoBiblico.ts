import type { PlanoBiblico } from "@/types/planoBiblico";

type PlanoComDuracao = Pick<PlanoBiblico, "duracaoAnos" | "duracaoMeses" | "totalDias">;

function formatQuantidade(quantidade: number, singular: string, plural: string) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

export function formatPlanoDuracao(plano: PlanoComDuracao) {
  const anos = Math.max(0, Math.floor(plano.duracaoAnos || 0));
  const meses = Math.max(0, Math.floor(plano.duracaoMeses || 0));
  const totalMeses = anos * 12 + meses;
  const mesesCalculados = totalMeses > 0 ? totalMeses : Math.max(0, Math.round((plano.totalDias || 0) / 30));

  if (mesesCalculados < 12) {
    return formatQuantidade(mesesCalculados, "mês", "meses");
  }

  const anosFormatados = Math.floor(mesesCalculados / 12);
  const mesesRestantes = mesesCalculados % 12;
  const textoAnos = formatQuantidade(anosFormatados, "ano", "anos");

  return mesesRestantes > 0 ? `${textoAnos} e ${formatQuantidade(mesesRestantes, "mês", "meses")}` : textoAnos;
}
