import { BiblePlanSummaryCard } from "@/components/dashboard/BiblePlanSummaryCard";
import { ContinueWatchingCard } from "@/components/dashboard/ContinueWatchingCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TrailProgressCard } from "@/components/dashboard/TrailProgressCard";
import { ContentCard } from "@/components/conteudos/ContentCard";
import { dashboard } from "@/data/mocks";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm transition-all hover:shadow-md">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Bem-vindo</p>
        <h2 className="mt-3 text-3xl font-bold text-[#004B87]">Sua jornada de formação</h2>
        <p className="mt-3 text-gray-500">Continue firme. Cada formação ajuda a aprofundar sua caminhada na Palavra.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <DashboardCard index={0} title="Continuar" value={`${dashboard.continuarAssistindo.length}`} description={dashboard.continuarAssistindo[0]?.titulo ?? "Nada em andamento"} />
        <DashboardCard index={1} title="Trilhas" value={String(dashboard.trilhasEmAndamento.length)} description="Caminhos em progresso" />
        <DashboardCard index={2} title="Formações" value={String(dashboard.ultimasFormacoes.length)} description="Conteúdos disponíveis" />
        <DashboardCard index={3} title="Favoritos" value={String(dashboard.favoritos.length)} description="Separados para rever" />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContinueWatchingCard conteudo={dashboard.continuarAssistindo[0]} />
        </div>
        <BiblePlanSummaryCard plano={dashboard.planoBiblicoAtivo} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {dashboard.trilhasEmAndamento.map((trilha) => (
          <TrailProgressCard key={trilha.id} trilha={trilha} />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-black text-[#004B87]">Conteúdos recomendados</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {dashboard.recomendados.map((conteudo) => (
            <ContentCard key={conteudo.id} conteudo={conteudo} />
          ))}
        </div>
      </section>
    </div>
  );
}
