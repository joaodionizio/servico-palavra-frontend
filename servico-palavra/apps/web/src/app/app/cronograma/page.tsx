"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Cronograma</h1>
          <p className="mt-2 text-gray-500 dark:text-slate-300">Carregando dias do seu plano...</p>
          <div className="mt-6 h-2 w-full max-w-md animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </Card>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Acesse sua conta</h1>
          <p className="mt-2 text-gray-500 dark:text-slate-300">Entre novamente para ver o cronograma do plano bíblico.</p>
          <LinkButton href="/login" variant="primary" className="mt-6">
            Entrar
          </LinkButton>
        </Card>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Nenhum plano ativo</h1>
          <p className="mt-2 text-gray-500 dark:text-slate-300">Crie um plano bíblico para visualizar o cronograma real de leituras.</p>
          <LinkButton href="/app/plano-biblico/configurar" variant="primary" className="mt-6">
            Criar plano
          </LinkButton>
        </Card>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
        <Card className="border-red-100 bg-red-50/60 dark:border-red-950/70 dark:bg-red-950/20">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-300">Cronograma</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Não foi possível carregar o cronograma</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-300">{error ?? "Tente novamente em instantes."}</p>
          <Button className="mt-6" onClick={() => void loadCronograma()}>
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 animate-fade-in sm:space-y-10 lg:space-y-12">
      <section className="schedule-stage relative mx-auto overflow-hidden rounded-[var(--sp-radius-hero)] bg-[#FFCC00] px-6 py-10 text-left sm:px-8 sm:py-12 md:px-14 md:py-16 lg:py-20 dark:bg-[#EAB308]">
        <div className="schedule-orbit" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#003A70]/70 sm:text-sm sm:tracking-[0.45em]">Visão geral do percurso</p>
          <h1 className="mt-4 break-words text-4xl font-black tracking-[-.055em] text-[#003A70] sm:mt-5 sm:text-5xl md:text-6xl lg:text-7xl">Cronograma Completo</h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#003A70]/80 sm:mt-5 sm:text-lg">
            Consulte as principais leituras e fases do plano organizadas por mês. A leitura diária detalhada continua disponível na aba Plano.
          </p>
        </div>
      </section>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}
      <MonthlySchedule dias={dias} onToggleDay={handleToggleDay} pendingDayId={pendingDayId} />
    </div>
  );
}
