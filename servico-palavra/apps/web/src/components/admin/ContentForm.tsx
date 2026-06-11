import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ContentForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  return (
    <form className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <Input label="Título" name="titulo" placeholder="Título da formação" />
      <label className="grid gap-2 text-sm font-bold text-gray-600">
        Descrição
        <textarea className="min-h-28 rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10" placeholder="Descrição pastoral e objetiva" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Categoria" name="categoria" placeholder="Bíblia" />
        <Input label="Tipo" name="tipo" placeholder="video, audio, documento, link ou texto" />
      </div>
      <Input label="URL do conteúdo" name="url" placeholder="https://..." />
      <Button type="button">{mode === "edit" ? "Salvar alterações" : "Criar conteúdo"}</Button>
    </form>
  );
}
