import { CategoryForm } from "@/components/admin/CategoryForm";
import { Badge } from "@/components/ui/Badge";
import { categorias } from "@/data/mocks";

export default function AdminCategoriasPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Categorias</h1>
        <p className="mt-2 text-gray-500">Criar e editar categorias de conteúdo.</p>
      </section>
      <CategoryForm />
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="grid gap-3">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <span className="font-semibold">{categoria.nome}</span>
              <Badge>Editar</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
