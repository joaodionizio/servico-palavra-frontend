import { AdminStatsCard } from "@/components/admin/AdminStatsCard";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">Visão inicial para gestão da plataforma.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard title="Usuarios" value="0" description="Cadastros e perfis de acesso" />
        <AdminStatsCard title="Conteudos" value="3" description="Videos, audios e materiais" />
        <AdminStatsCard title="Planos Biblicos" value="0" description="Planos ativos e historico" />
        <AdminStatsCard title="Conteudos concluidos" value="0" description="Progresso geral dos usuarios" />
      </div>
    </div>
  );
}
