import { ContentForm } from "@/components/admin/ContentForm";

export default function NovoConteudoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="admin-stage p-8 md:p-12">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.05em] text-white md:text-6xl">Novo conteúdo</h1>
      </section>
      <ContentForm />
    </div>
  );
}
