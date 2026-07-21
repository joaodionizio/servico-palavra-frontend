import { ContentForm } from "@/components/admin/ContentForm";

export default async function EditarConteudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="admin-stage p-8 md:p-12">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.05em] text-white md:text-6xl">Editar conteúdo</h1>
        <p className="mt-2 text-white/60">ID do conteúdo: {id}</p>
      </section>
      <ContentForm mode="edit" conteudoId={id} />
    </div>
  );
}
