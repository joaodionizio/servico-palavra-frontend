"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanSetupForm } from "@/components/plano-biblico/PlanSetupForm";
import { LinkButton } from "@/components/ui/Button";
import { BiblePlanNotFoundError, BiblePlanUnauthorizedError, alterarPlano, criarPlano, getPlanoAtivo } from "@/services/biblePlanService";
import type { AlterarPlanoBiblicoPayload, CriarPlanoBiblicoPayload } from "@/types/planoBiblico";

export default function ConfigurarPlanoPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "change">("create");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  async function handleSubmit(payload: CriarPlanoBiblicoPayload | AlterarPlanoBiblicoPayload) {
    if (mode === "change") {
      await alterarPlano({
        nome: payload.nome,
        duracaoMeses: payload.duracaoMeses,
        manterProgresso: "manterProgresso" in payload ? payload.manterProgresso : true
      });
    } else {
      await criarPlano({
        nome: payload.nome,
        duracaoMeses: payload.duracaoMeses
      });
    }

    router.push("/app/plano-biblico");
  }

  useEffect(() => {
    getPlanoAtivo()
      .then(() => setMode("change"))
      .catch((error: unknown) => {
        if (error instanceof BiblePlanNotFoundError) {
          setMode("create");
          return;
        }

        if (error instanceof BiblePlanUnauthorizedError) {
          setUnauthorized(true);
          return;
        }

        setMode("create");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Configurar plano bíblico</h1>
          <p className="mt-2 text-gray-500">Preparando as opções do seu plano...</p>
        </section>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Acesse sua conta</h1>
          <p className="mt-2 text-gray-500">Entre novamente para configurar seu plano bíblico.</p>
          <LinkButton href="/login" variant="primary" className="mt-6">
            Entrar
          </LinkButton>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">{mode === "change" ? "Alterar plano bíblico" : "Criar plano bíblico"}</h1>
        <p className="mt-2 text-gray-500">{mode === "change" ? "Ao trocar o plano, escolha como deseja tratar o progresso atual." : "Escolha a duração para iniciar seu plano personalizado."}</p>
      </section>
      <PlanSetupForm mode={mode} onSubmit={handleSubmit} submitLabel={mode === "change" ? "Salvar alteração" : "Criar plano"} />
    </div>
  );
}
