"use client";

import { useCallback, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { MonthlySchedule } from "@/components/plano-biblico/MonthlySchedule";
import { BiblePlanNotFoundError, BiblePlanUnauthorizedError, concluirDia, desmarcarDia, getCronograma, getPlanoAtivo } from "@/services/biblePlanService";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

export default function CronogramaPage() {
  const [dias, setDias] = useState<DiaPlanoBiblico[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<"ready" | "empty" | "unauthorized" | "error">("ready");
  const [error, setError] = useState<string | null>(null);
  const [pendingDayId, setPendingDayId] = useState<string | null>(null);

  const loadCronograma = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const activePlan = await getPlanoAtivo();
      const schedule = await getCronograma(activePlan.id);

      setDias(schedule);
      setState("ready");
    } catch (loadError) {
      setDias([]);

      if (loadError instanceof BiblePlanNotFoundError) {
        setState("empty");
      } else if (loadError instanceof BiblePlanUnauthorizedError) {
        setState("unauthorized");
      } else {
        setState("error");
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar o cronograma.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCronograma();
  }, [loadCronograma]);

  async function handleToggleDay(dia: DiaPlanoBiblico) {
    const nextStatus: DiaPlanoBiblico["status"] = dia.status === "concluido" ? "pendente" : "concluido";
    const previousDays = dias;
    const nextDays = dias.map((item) => (item.id === dia.id ? { ...item, status: nextStatus } : item));

    setPendingDayId(dia.id);
    setError(null);
    setDias(nextDays);

    try {
      if (nextStatus === "concluido") {
        await concluirDia(dia.actionId ?? dia.id);
      } else {
        await desmarcarDia(dia.actionId ?? dia.id);
      }
    } catch (toggleError) {
      setDias(previousDays);
      setError(toggleError instanceof Error ? toggleError.message : "Não foi possível atualizar a leitura.");
    } finally {
      setPendingDayId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Cronograma</h1>
          <p className="mt-2 text-gray-500">Carregando dias do seu plano...</p>
        </section>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Acesse sua conta</h1>
          <p className="mt-2 text-gray-500">Entre novamente para ver o cronograma do plano bíblico.</p>
          <LinkButton href="/login" variant="primary" className="mt-6">
            Entrar
          </LinkButton>
        </section>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Nenhum plano ativo</h1>
          <p className="mt-2 text-gray-500">Crie um plano bíblico para visualizar o cronograma real de leituras.</p>
          <LinkButton href="/app/plano-biblico/configurar" variant="primary" className="mt-6">
            Criar plano
          </LinkButton>
        </section>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Não foi possível carregar o cronograma</h1>
          <p className="mt-2 text-gray-500">{error ?? "Tente novamente em instantes."}</p>
          <button className="mt-6 rounded-xl bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003366]" onClick={() => void loadCronograma()}>
            Tentar novamente
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 animate-fade-in">
      <section className="schedule-stage relative mx-auto overflow-hidden rounded-[2rem] bg-[#FFCC00] px-8 py-14 text-left md:px-14 md:py-20">
        <div className="schedule-orbit" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#003A70]/70">Visão geral do percurso</p>
          <h1 className="mt-5 text-5xl font-black tracking-[-.055em] text-[#003A70] md:text-7xl">Cronograma Completo</h1>
          <p className="mt-5 text-lg font-medium leading-relaxed text-[#003A70]/75">
            Consulte as principais leituras e fases do plano organizadas por mês. A leitura diária detalhada continua disponível na aba Plano.
          </p>
        </div>
      </section>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      <MonthlySchedule dias={dias} onToggleDay={handleToggleDay} pendingDayId={pendingDayId} />
    </div>
  );
}
