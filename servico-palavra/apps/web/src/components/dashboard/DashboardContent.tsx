"use client";

import { useCallback, useEffect, useState } from "react";
import { BiblePlanSummaryCard } from "@/components/dashboard/BiblePlanSummaryCard";
import { ContinueWatchingCard } from "@/components/dashboard/ContinueWatchingCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ContentCard } from "@/components/conteudos/ContentCard";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api";
import { getDashboardMe } from "@/services/dashboardService";
import type { DashboardMe } from "@/types/dashboard";

type DashboardState =
  | { status: "loading"; data: null; message?: never }
  | { status: "ready"; data: DashboardMe; message?: never }
  | { status: "error"; data: null; message: string };

function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in sm:space-y-8">
      <Card className="sm:p-8 md:p-10">
        <div className="space-y-4">
          <div className="h-4 w-36 animate-pulse rounded bg-yellow-100 dark:bg-yellow-300/15" />
          <div className="h-9 w-80 max-w-full animate-pulse rounded bg-blue-50 dark:bg-sky-200/10" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
        </div>
      </Card>
      <section className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <div className="h-12 w-12 animate-pulse rounded-full bg-blue-50 dark:bg-sky-200/10" />
            <div className="mt-5 h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
            <div className="mt-4 h-10 w-16 animate-pulse rounded bg-blue-50 dark:bg-sky-200/10" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
          </Card>
        ))}
      </section>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <Card className="border-red-100 bg-red-50/60 dark:border-red-950/70 dark:bg-red-950/20">
        <p className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-300">Dashboard indisponível</p>
        <h2 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Não foi possível carregar sua jornada agora</h2>
        <p className="mt-2 text-gray-600 dark:text-slate-300">{message}</p>
        <Button type="button" onClick={onRetry} className="mt-6">
          Tentar novamente
        </Button>
      </Card>
    </div>
  );
}

export function DashboardContent() {
  const [state, setState] = useState<DashboardState>({ status: "loading", data: null });

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getDashboardMe();
      setState({ status: "ready", data });
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 401
          ? "Entre novamente para consultar seu dashboard."
          : "A API não respondeu como esperado. Suas formações continuam preservadas.";

      setState({ status: "error", data: null, message });
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  function retryDashboard() {
    setState({ status: "loading", data: null });
    void loadDashboard();
  }

  if (state.status === "loading") {
    return <DashboardLoading />;
  }

  if (state.status === "error") {
    return <DashboardError message={state.message} onRetry={retryDashboard} />;
  }

  const dashboard = state.data;
  const continuingContent = dashboard.conteudosComProgresso[0];
  const recentFormations = dashboard.formacoesRecentes.slice(0, 3);
  const favoriteContent = dashboard.favoritosRecentes.slice(0, 2);
  const recommendedContent = dashboard.formacoesRecentes.slice(0, 2);
  const plan = dashboard.planoBiblicoAtivo
    ? {
        ...dashboard.planoBiblicoAtivo,
        leituraHoje: dashboard.planoBiblicoAtivo.leituraHoje ?? dashboard.leituraHoje ?? undefined
      }
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in sm:space-y-8">
      <section className="dashboard-hero relative min-h-[380px] overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[#FDFDFB] p-8 shadow-sm md:flex md:items-center md:p-14 dark:border-slate-800 dark:bg-slate-900/75">
        <div className="dashboard-ribbon" aria-hidden="true"><i /><i /><i /></div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative z-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Bem-vindo</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-.045em] text-[#003A70] md:text-6xl dark:text-sky-100">Sua jornada de formação</h2>
            <p className="mt-5 max-w-2xl text-slate-500 dark:text-slate-300">
              Continue sua caminhada bíblica, espiritual e pastoral com formações, favoritos, progresso e plano bíblico no seu ritmo.
            </p>
          </div>
        </div>
      </section>

      <section className="journey-stats grid gap-4 sm:gap-6 md:grid-cols-3">
        <DashboardCard
          index={0}
          title="Continuar"
          value={String(dashboard.conteudosComProgresso.length)}
          description={continuingContent?.titulo ?? "Nada em andamento"}
        />
        <DashboardCard index={1} title="Concluídos" value={String(dashboard.estatisticas.totalConteudosConcluidos)} description="Conteúdos finalizados" />
        <DashboardCard index={2} title="Favoritos" value={String(dashboard.estatisticas.totalFavoritos)} description="Separados para rever" />
      </section>

      <section className="journey-focus grid gap-4 sm:gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {continuingContent ? (
            <ContinueWatchingCard conteudo={continuingContent} />
          ) : (
            <Card>
              <p className="text-sm font-bold uppercase tracking-wider text-[#C99600] dark:text-[#FFCC00]">Continuar formação</p>
              <h3 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Nenhuma formação em andamento</h3>
              <p className="mt-2 text-gray-500 dark:text-slate-300">Abra uma formação e marque progresso para retomá-la rapidamente por aqui.</p>
              <LinkButton href="/app/formacoes" variant="primary" className="mt-5">
                Ver formações
              </LinkButton>
            </Card>
          )}
        </div>
        <BiblePlanSummaryCard plano={plan} leituraHoje={dashboard.leituraHoje} />
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">Formação recente</p>
            <h2 className="text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Continue estudando</h2>
          </div>
          <LinkButton href="/app/formacoes" variant="ghost">
            Ver formações
          </LinkButton>
        </div>
        {recentFormations.length > 0 ? (
          <div className="formation-grid mt-5 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentFormations.map((conteudo) => (
              <ContentCard key={conteudo.id} conteudo={conteudo} />
            ))}
          </div>
        ) : (
          <Card className="mt-5">
            <p className="text-gray-500 dark:text-slate-300">Quando houver formações publicadas, elas aparecerão aqui para você começar.</p>
          </Card>
        )}
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">Favoritos</p>
          <h2 className="mt-2 text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Para rever</h2>
          <div className="mt-5 space-y-4">
            {favoriteContent.length > 0 ? (
              favoriteContent.map((conteudo) => (
                <div key={conteudo.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 dark:border-slate-800">
                  <p className="font-bold text-[var(--sp-brand)] dark:text-sky-100">{conteudo.titulo}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">{conteudo.categoria?.nome ?? "Sem categoria"}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-300">Favorite formações para montar uma lista de revisão pessoal.</p>
            )}
          </div>
          <LinkButton href="/app/favoritos" variant="secondary" className="mt-6">
            Abrir favoritos
          </LinkButton>
        </Card>

        <div className="lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">Recomendados</p>
              <h2 className="text-2xl font-black text-[var(--sp-brand)] dark:text-sky-100">Conteúdos para hoje</h2>
            </div>
            <span className="text-sm font-medium text-gray-400 dark:text-slate-400">Selecionados a partir das formações disponíveis.</span>
          </div>
          {recommendedContent.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:gap-6 md:grid-cols-2">
              {recommendedContent.map((conteudo) => (
                <ContentCard key={conteudo.id} conteudo={conteudo} />
              ))}
            </div>
          ) : (
            <Card className="mt-5">
              <p className="text-gray-500 dark:text-slate-300">Publique formações no admin para alimentar esta área.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
