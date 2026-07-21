"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AlterarPlanoBiblicoPayload, CriarPlanoBiblicoPayload, DuracaoPlano } from "@/types/planoBiblico";

type PlanSetupFormProps = {
  mode?: "create" | "change";
  onSubmit: (payload: CriarPlanoBiblicoPayload | AlterarPlanoBiblicoPayload) => Promise<void>;
  submitLabel?: string;
};

type UnidadeDuracao = "meses" | "anos";

const DURACOES: Array<[DuracaoPlano, string, UnidadeDuracao | null, number | null]> = [
  ["6_meses", "6 meses", "meses", 6],
  ["1_ano", "1 ano", "anos", 1],
  ["2_anos", "2 anos", "anos", 2],
  ["personalizado", "Personalizado", null, null]
];

const NOMES_PLANO: Record<DuracaoPlano, string> = {
  "6_meses": "Plano bíblico de 6 meses",
  "1_ano": "Plano bíblico de 1 ano",
  "2_anos": "Plano bíblico de 2 anos",
  personalizado: "Plano bíblico personalizado"
};

export function PlanSetupForm({ mode = "create", onSubmit, submitLabel }: PlanSetupFormProps) {
  const [duracao, setDuracao] = useState<DuracaoPlano>("1_ano");
  const [unidadePersonalizada, setUnidadePersonalizada] = useState<UnidadeDuracao>("meses");
  const [quantidadePersonalizada, setQuantidadePersonalizada] = useState("1");
  const [manterProgresso, setManterProgresso] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duracaoMeses = useMemo((): number => {
    const [, , unidade, quantidade] = DURACOES.find(([value]) => value === duracao) ?? DURACOES[1];

    if (unidade && quantidade !== null) {
      return unidade === "anos" ? quantidade * 12 : quantidade;
    }

    const quantidadeCustomizada = Number(quantidadePersonalizada || 0);
    return unidadePersonalizada === "anos" ? quantidadeCustomizada * 12 : quantidadeCustomizada;
  }, [duracao, quantidadePersonalizada, unidadePersonalizada]);

  function selectDuration(value: DuracaoPlano) {
    setDuracao(value);

    const [, , unidade, quantidade] = DURACOES.find(([duration]) => duration === value) ?? DURACOES[1];
    if (unidade && quantidade !== null) {
      setUnidadePersonalizada(unidade);
      setQuantidadePersonalizada(String(quantidade));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!Number.isInteger(duracaoMeses) || duracaoMeses < 1) {
      setError("Informe uma duração válida para criar o plano.");
      return;
    }

    if (duracaoMeses > 120) {
      setError("A duração máxima permitida pela interface é de 10 anos.");
      return;
    }

    setLoading(true);

    try {
      const payload =
        mode === "change"
          ? {
              nome: NOMES_PLANO[duracao],
              duracaoMeses,
              manterProgresso
            }
          : {
              nome: NOMES_PLANO[duracao],
              duracaoMeses
            };

      await onSubmit(payload);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar o plano bíblico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-[2rem] p-8 md:p-12">
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Plano bíblico</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.035em] text-[#004B87] md:text-5xl">Escolha em quanto tempo deseja concluir a leitura da Bíblia</h2>
      <p className="mt-2 text-gray-500">Você pode usar uma duração pronta ou definir seu próprio tempo em meses ou anos.</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-4">
          {DURACOES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => selectDuration(value)}
              className={`rounded-xl border px-4 py-4 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                duracao === value ? "border-[#FFCC00] bg-yellow-50 text-[#004B87] shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {duracao === "personalizado" && (
          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <p className="font-bold text-[#004B87]">Escolha a duração do plano</p>
            <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="Unidade de duração">
              {(["meses", "anos"] as UnidadeDuracao[]).map((unidade) => (
                <button
                  key={unidade}
                  type="button"
                  onClick={() => setUnidadePersonalizada(unidade)}
                  aria-pressed={unidadePersonalizada === unidade}
                  className={`rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                    unidadePersonalizada === unidade
                      ? "border-[#FFCC00] bg-yellow-50 text-[#004B87] shadow-sm"
                      : "border-gray-100 bg-white text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
                  }`}
                >
                  {unidade === "meses" ? "Meses" : "Anos"}
                </button>
              ))}
            </div>
            <label className="mt-4 grid gap-2 text-sm font-bold text-gray-600">
              {unidadePersonalizada === "meses" ? "Quantidade de meses" : "Quantidade de anos"}
              <input
                className="rounded-xl border border-gray-200 bg-white px-5 py-3.5 outline-none focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
                type="number"
                min={1}
                max={unidadePersonalizada === "meses" ? 120 : 10}
                inputMode="numeric"
                value={quantidadePersonalizada}
                onChange={(event) => setQuantidadePersonalizada(event.target.value)}
              />
            </label>
          </div>
        )}
        {mode === "change" && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setManterProgresso(true)}
              className={`rounded-xl border px-5 py-4 text-left font-bold shadow-sm ${
                manterProgresso ? "border-[#FFCC00] bg-yellow-50 text-[#004B87]" : "border-gray-100 bg-white text-gray-500 transition-all hover:bg-blue-50 hover:text-[#004B87]"
              }`}
            >
              Continuar de onde parei
            </button>
            <button
              type="button"
              onClick={() => setManterProgresso(false)}
              className={`rounded-xl border px-5 py-4 text-left font-bold shadow-sm ${
                !manterProgresso ? "border-[#FFCC00] bg-yellow-50 text-[#004B87]" : "border-gray-100 bg-white text-gray-500 transition-all hover:bg-blue-50 hover:text-[#004B87]"
              }`}
            >
              Recomeçar do início
            </button>
          </div>
        )}
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <Button className="mt-6" type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel ?? (mode === "change" ? "Alterar plano" : "Criar plano")}
        </Button>
      </form>
    </Card>
  );
}
