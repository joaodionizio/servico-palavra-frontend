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
    <Card className="daily-reading relative overflow-hidden border-0 bg-[#003A70] p-10 text-white shadow-xl shadow-blue-950/10 md:p-12">
      <div className="daily-reading-mark" aria-hidden="true">{dia.dia}</div>
      <div className="relative z-10">
      <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Leitura do dia {dia.dia}</p>
      <h3 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.04em] text-white md:text-5xl">{dia.leitura}</h3>
      <Button className="mt-5" variant={concluido ? "secondary" : "primary"} onClick={() => onToggle?.(dia)} disabled={!onToggle || loading}>
        {loading ? "Salvando..." : concluido ? "Desmarcar leitura" : "Marcar como concluído"}
      </Button>
      </div>
    </Card>
  );
}
