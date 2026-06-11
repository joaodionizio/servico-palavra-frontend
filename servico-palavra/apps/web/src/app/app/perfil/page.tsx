import { Card } from "@/components/ui/Card";

export default function PerfilPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Perfil</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Perfil</h1>
      </section>
      <Card>
        <p className="text-gray-500">Dados do usuário serão carregados por GET /api/auth/me.</p>
      </Card>
    </div>
  );
}
