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

const DURACOES: Array<[DuracaoPlano, string, number]> = [
  ["6_meses", "6 meses", 6],
  ["1_ano", "1 ano", 12],
  ["2_anos", "2 anos", 24],
  ["personalizado", "Personalizado", 0]
];

const NOMES_PLANO: Record<DuracaoPlano, string> = {
  "6_meses": "Plano bíblico de 6 meses",
  "1_ano": "Plano bíblico de 1 ano",
  "2_anos": "Plano bíblico de 2 anos",
  personalizado: "Plano bíblico personalizado"
};

export function PlanSetupForm({ mode = "create", onSubmit, submitLabel }: PlanSetupFormProps) {
  const [duracao, setDuracao] = useState<DuracaoPlano>("1_ano");
  const [anos, setAnos] = useState("1");
  const [meses, setMeses] = useState("0");
  const [manterProgresso, setManterProgresso] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duracaoMeses = useMemo(() => {
    const predefined = DURACOES.find(([value]) => value === duracao)?.[2] ?? 12;

    if (predefined > 0) {
      return predefined;
    }

    return Number(anos || 0) * 12 + Number(meses || 0);
  }, [anos, duracao, meses]);

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
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Plano bíblico</p>
      <h2 className="mt-3 text-2xl font-black text-[#004B87]">Deseja criar seu plano bíblico personalizado?</h2>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-4">
          {DURACOES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setDuracao(value)}
              className={`rounded-xl border px-4 py-4 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                duracao === value ? "border-[#FFCC00] bg-yellow-50 text-[#004B87] shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {duracao === "personalizado" && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Anos"
              type="number"
              min={0}
              value={anos}
              onChange={(event) => setAnos(event.target.value)}
            />
            <input
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Meses"
              type="number"
              min={0}
              value={meses}
              onChange={(event) => setMeses(event.target.value)}
            />
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
