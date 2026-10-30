import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

type ScheduleTableProps = {
  dias: DiaPlanoBiblico[];
  onToggleDay?: (dia: DiaPlanoBiblico) => void;
  pendingDayId?: string | null;
};

export function ScheduleTable({ dias, onToggleDay, pendingDayId }: ScheduleTableProps) {
  if (dias.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 text-gray-500 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
        Nenhuma leitura foi gerada para este plano.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-[#FDFDFB] shadow-[0_8px_30px_rgba(0,51,102,.045)] dark:border-slate-700 dark:bg-slate-900/70">
      {dias.map((dia) => (
        <div key={dia.id} className="schedule-row grid gap-3 border-b border-slate-100 p-5 transition-colors last:border-0 hover:bg-[#F4F7F8] md:grid-cols-[120px_1fr_140px] md:items-center dark:border-slate-800 dark:hover:bg-slate-800/70">
          <div>
            <strong className="text-[#004B87] dark:text-sky-100">Dia {dia.dia}</strong>
            {dia.data && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">{dia.data}</p>}
          </div>
          <span className="break-words text-gray-500 dark:text-slate-300">{dia.leitura}</span>
          <div className="schedule-actions flex flex-wrap items-center gap-2 md:justify-end">
            <Badge>{dia.status}</Badge>
            {onToggleDay && (
              <Button
                className="px-3 py-2"
                variant={dia.status === "concluido" ? "secondary" : "ghost"}
                onClick={() => onToggleDay(dia)}
                loading={pendingDayId === dia.id}
                loadingLabel="Salvando"
              >
                {dia.status === "concluido" ? "Desmarcar" : "Concluir"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
