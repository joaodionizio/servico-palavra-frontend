"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BibleProgressCard } from "@/components/plano-biblico/BibleProgressCard";
import { DailyReadingCard } from "@/components/plano-biblico/DailyReadingCard";
import { ScheduleTable } from "@/components/plano-biblico/ScheduleTable";
import { formatPlanoDuracao } from "@/lib/planoBiblico";
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
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Plano Bíblico</h1>
          <p className="mt-3 max-w-2xl text-gray-500 dark:text-slate-300">Carregando seu plano bíblico...</p>
          <div className="mt-6 h-2 w-full max-w-md animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </Card>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Acesse sua conta</h1>
          <p className="mt-3 max-w-2xl text-gray-500 dark:text-slate-300">Entre novamente para carregar seu plano bíblico personalizado.</p>
          <LinkButton href="/login" variant="primary" className="mt-6">
            Entrar
          </LinkButton>
        </Card>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <Card className="border-red-100 bg-red-50/60 dark:border-red-950/70 dark:bg-red-950/20">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-300">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Não foi possível carregar o plano</h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-slate-300">{error ?? "Tente novamente em instantes."}</p>
          <Button className="mt-6" onClick={() => void loadPlano()}>
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  if (!planoAtivo) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <Card>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Plano Bíblico</h1>
          <p className="mt-3 max-w-2xl text-gray-500 dark:text-slate-300">Configure seu plano apenas quando desejar iniciar este módulo.</p>
          <LinkButton href="/app/plano-biblico/configurar" variant="primary" className="mt-6">
            Criar plano
          </LinkButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5 animate-fade-in sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 break-words text-3xl font-black text-[var(--sp-brand)] dark:text-sky-100">Plano bíblico de {formatPlanoDuracao(planoAtivo)}</h1>
          <p className="mt-3 text-gray-500 dark:text-slate-300">Leitura do dia, progresso e cronograma resumido.</p>
        </div>
        <LinkButton href="/app/plano-biblico/configurar" variant="secondary" className="sm:shrink-0">
          Alterar plano
        </LinkButton>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}
      {planoAtivo.leituraHoje ? (
        <DailyReadingCard dia={planoAtivo.leituraHoje} onToggle={handleToggleDay} loading={completingDayId === planoAtivo.leituraHoje.id} />
      ) : (
        <Card>
          <h2 className="text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Base bíblica indisponível</h2>
          <p className="mt-3 text-gray-500 dark:text-slate-300">Não há leituras disponíveis para este plano no momento. Tente atualizar a página ou configurar um novo plano.</p>
        </Card>
      )}
      <BibleProgressCard plano={planoAtivo} />
      <ScheduleTable dias={diasPlano.slice(0, 7)} onToggleDay={handleToggleDay} pendingDayId={completingDayId} />
    </div>
  );
}
