import { PlanSetupForm } from "@/components/plano-biblico/PlanSetupForm";
import { Card } from "@/components/ui/Card";

export default function ConfigurarPlanoPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Plano bíblico</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Alterar plano bíblico</h1>
        <p className="mt-2 text-gray-500">Ao trocar o plano, escolha como deseja tratar o progresso atual.</p>
      </section>
      <Card>
        <h2 className="text-2xl font-black text-[#004B87]">Comportamento do progresso</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button className="rounded-xl border border-[#FFCC00] bg-yellow-50 px-5 py-4 text-left font-bold text-[#004B87] shadow-sm">Continuar de onde parei</button>
          <button className="rounded-xl border border-gray-100 bg-white px-5 py-4 text-left font-bold text-gray-500 transition-all hover:bg-blue-50 hover:text-[#004B87]">Recomeçar do início</button>
        </div>
      </Card>
      <PlanSetupForm />
    </div>
  );
}
