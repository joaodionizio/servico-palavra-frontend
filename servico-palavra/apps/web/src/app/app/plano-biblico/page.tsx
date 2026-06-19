"use client";

import { useCallback, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { BibleProgressCard } from "@/components/plano-biblico/BibleProgressCard";
import { DailyReadingCard } from "@/components/plano-biblico/DailyReadingCard";
import { ScheduleTable } from "@/components/plano-biblico/ScheduleTable";
import {
  BiblePlanNotFoundError,
  BiblePlanUnauthorizedError,
  concluirDia,
  desmarcarDia,
  getCronograma,
  getPlanoAtivo
} from "@/services/biblePlanService";
import type { DiaPlanoBiblico, PlanoBiblico } from "@/types/planoBiblico";

export default function PlanoBiblicoPage() {
  const [planoAtivo, setPlanoAtivo] = useState<PlanoBiblico | null>(null);
  const [diasPlano, setDiasPlano] = useState<DiaPlanoBiblico[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingDayId, setCompletingDayId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"ready" | "empty" | "unauthorized" | "error">("ready");

  function applyScheduleState(plano: PlanoBiblico, dias: DiaPlanoBiblico[]) {
    const sorted = [...dias].sort((a, b) => a.dia - b.dia);
    const leituraHoje = sorted.find((dia) => dia.status === "pendente") ?? sorted[0];
    const diasConcluidos = sorted.filter((dia) => dia.status === "concluido").length;
    const totalDias = plano.totalDias || sorted.length;
    const progresso = totalDias > 0 ? (diasConcluidos / totalDias) * 100 : 0;
    const sequencia = sorted.findIndex((dia) => dia.status !== "concluido");

    setPlanoAtivo({
      ...plano,
      leituraHoje,
      diasConcluidos,
      progresso,
      sequencia: sequencia === -1 ? sorted.length : sequencia
    });
    setDiasPlano(sorted);
  }

  const loadPlano = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const plano = await getPlanoAtivo();
      const dias = plano.id ? await getCronograma(plano.id) : [];

      applyScheduleState(plano, dias);
      setState("ready");
    } catch (loadError) {
      setPlanoAtivo(null);
      setDiasPlano([]);

      if (loadError instanceof BiblePlanNotFoundError) {
        setState("empty");
      } else if (loadError instanceof BiblePlanUnauthorizedError) {
        setState("unauthorized");
      } else {
        setState("error");
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar o plano bíblico.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlano();
  }, [loadPlano]);

  async function handleToggleDay(dia: DiaPlanoBiblico) {
    if (!planoAtivo) {
      return;
    }

    const nextStatus: DiaPlanoBiblico["status"] = dia.status === "concluido" ? "pendente" : "concluido";
    const previousPlan = planoAtivo;
    const previousDays = diasPlano;
    const nextDays = diasPlano.map((item) => (item.id === dia.id ? { ...item, status: nextStatus } : item));

    setCompletingDayId(dia.id);
    setError(null);
    applyScheduleState(planoAtivo, nextDays);

    try {
      if (nextStatus === "concluido") {
        await concluirDia(dia.actionId ?? dia.id);
      } else {
        await desmarcarDia(dia.actionId ?? dia.id);
      }
    } catch (toggleError) {
      applyScheduleState(previousPlan, previousDays);
      setError(toggleError instanceof Error ? toggleError.message : "Não foi possível atualizar a leitura.");
    } finally {
      setCompletingDayId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Plano Bíblico</h1>
          <p className="mt-3 max-w-2xl text-gray-500">Carregando seu plano bíblico...</p>
        </section>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Acesse sua conta</h1>
          <p className="mt-3 max-w-2xl text-gray-500">Entre novamente para carregar seu plano bíblico personalizado.</p>
          <LinkButton href="/login" variant="primary" className="mt-6">
            Entrar
          </LinkButton>
        </section>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Não foi possível carregar o plano</h1>
          <p className="mt-3 max-w-2xl text-gray-500">{error ?? "Tente novamente em instantes."}</p>
          <button className="mt-6 rounded-xl bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003366]" onClick={() => void loadPlano()}>
            Tentar novamente
          </button>
        </section>
      </div>
    );
  }

  if (!planoAtivo) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Plano Bíblico</h1>
          <p className="mt-3 max-w-2xl text-gray-500">Configure seu plano apenas quando desejar iniciar este módulo.</p>
          <LinkButton href="/app/plano-biblico/configurar" variant="primary" className="mt-6">
            Criar plano
          </LinkButton>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">{planoAtivo.nome}</h1>
          <p className="mt-3 text-gray-500">Leitura do dia, progresso e cronograma resumido.</p>
        </div>
        <LinkButton href="/app/plano-biblico/configurar" variant="secondary">
          Alterar plano
        </LinkButton>
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {planoAtivo.leituraHoje ? (
        <DailyReadingCard dia={planoAtivo.leituraHoje} onToggle={handleToggleDay} loading={completingDayId === planoAtivo.leituraHoje.id} />
      ) : (
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#004B87]">Base bíblica indisponível</h2>
          <p className="mt-3 text-gray-500">Não há leituras disponíveis para este plano no momento. Tente atualizar a página ou configurar um novo plano.</p>
        </section>
      )}
      <BibleProgressCard plano={planoAtivo} />
      <ScheduleTable dias={diasPlano.slice(0, 7)} onToggleDay={handleToggleDay} pendingDayId={completingDayId} />
    </div>
  );
}
