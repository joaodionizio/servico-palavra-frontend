import { ScheduleTable } from "@/components/plano-biblico/ScheduleTable";
import { diasPlano } from "@/data/mocks";

export default function CronogramaPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Cronograma</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Cronograma</h1>
        <p className="mt-2 text-gray-500">Dias do plano, leituras e status de conclusão.</p>
      </section>
      <ScheduleTable dias={diasPlano} />
    </div>
  );
}
