import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CategoryForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <Input label="Nome" name="nome" placeholder="Nome da categoria" />
      <Input label="Descrição" name="descricao" placeholder="Descrição curta" />
      <Button type="button">Salvar categoria</Button>
    </form>
  );
}
