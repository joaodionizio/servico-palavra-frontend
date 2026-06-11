import { LinkButton } from "@/components/ui/Button";
import { BibleProgressCard } from "@/components/plano-biblico/BibleProgressCard";
import { DailyReadingCard } from "@/components/plano-biblico/DailyReadingCard";
import { PlanSetupForm } from "@/components/plano-biblico/PlanSetupForm";
import { ScheduleTable } from "@/components/plano-biblico/ScheduleTable";
import { diasPlano, planoAtivo } from "@/data/mocks";

export default function PlanoBiblicoPage() {
  if (!planoAtivo) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Plano Bíblico</h1>
          <p className="mt-3 max-w-2xl text-gray-500">Configure seu plano apenas quando desejar iniciar este módulo.</p>
        </section>
        <PlanSetupForm />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
          <h1 className="mt-3 text-3xl font-black text-[#004B87]">Plano Bíblico</h1>
          <p className="mt-3 text-gray-500">Leitura do dia, progresso e cronograma resumido.</p>
        </div>
        <LinkButton href="/app/plano-biblico/configurar" variant="secondary">
          Alterar plano
        </LinkButton>
      </div>
      {planoAtivo.leituraHoje && <DailyReadingCard dia={planoAtivo.leituraHoje} />}
      <BibleProgressCard plano={planoAtivo} />
      <ScheduleTable dias={diasPlano.slice(0, 3)} />
    </div>
  );
}
