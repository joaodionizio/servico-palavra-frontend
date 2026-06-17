import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

type DailyReadingCardProps = {
  dia: DiaPlanoBiblico;
  onToggle?: (dia: DiaPlanoBiblico) => void;
  loading?: boolean;
};

export function DailyReadingCard({ dia, onToggle, loading = false }: DailyReadingCardProps) {
  const concluido = dia.status === "concluido";

  return (
    <Card className="border-2 border-[#FFCC00] bg-yellow-50/50">
      <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Leitura do dia {dia.dia}</p>
      <h3 className="mt-3 text-2xl font-black text-[#004B87]">{dia.leitura}</h3>
      <Button className="mt-5" variant={concluido ? "secondary" : "primary"} onClick={() => onToggle?.(dia)} disabled={!onToggle || loading}>
        {loading ? "Salvando..." : concluido ? "Desmarcar leitura" : "Marcar como concluído"}
      </Button>
    </Card>
  );
}
