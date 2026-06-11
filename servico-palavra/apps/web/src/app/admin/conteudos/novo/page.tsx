import { ContentForm } from "@/components/admin/ContentForm";

export default function NovoConteudoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Novo conteúdo</h1>
      </section>
      <ContentForm />
    </div>
  );
}
