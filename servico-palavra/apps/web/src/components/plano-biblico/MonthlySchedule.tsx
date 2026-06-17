"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DiaPlanoBiblico } from "@/types/planoBiblico";

type MonthlyScheduleProps = {
  dias: DiaPlanoBiblico[];
  onToggleDay?: (dia: DiaPlanoBiblico) => void;
  pendingDayId?: string | null;
};

type MonthGroup = {
  mes: number;
  dias: DiaPlanoBiblico[];
  concluidos: number;
  fase: string;
  resumo: string;
};

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function inferPhase(dias: DiaPlanoBiblico[]) {
  const text = normalizeText(dias.map((dia) => dia.leitura).join(" "));

  if (text.includes("joao") || text.includes("1 jo") || text.includes("2 jo") || text.includes("3 jo")) {
    return "Cartas Joaninas";
  }

  if (text.includes("mateus") || text.includes("marcos") || text.includes("lucas")) {
    return "Novo Testamento";
  }

  if (text.includes("romanos") || text.includes("corintios") || text.includes("galatas") || text.includes("efesios")) {
    return "Cartas Apostólicas";
  }

  if (text.includes("genesis") || text.includes("exodo") || text.includes("levitico") || text.includes("numeros") || text.includes("deuteronomio")) {
    return "Pentateuco";
  }

  if (text.includes("isaias") || text.includes("jeremias") || text.includes("ezequiel") || text.includes("daniel")) {
    return "Profetas";
  }

  if (text.includes("salmo") || text.includes("proverbios") || text.includes("eclesiastico") || text.includes("sabedoria")) {
    return "Sapienciais";
  }

  return "Leitura pastoral";
}

function getMonthSummary(dias: DiaPlanoBiblico[]) {
  const unique = Array.from(
    new Set(
      dias
        .flatMap((dia) => dia.leitura.split(/[;,]/))
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6)
    )
  );

  return unique.slice(0, 3).join("; ") || "Leituras do mês";
}

function groupByMonth(dias: DiaPlanoBiblico[]) {
  const groups = new Map<number, DiaPlanoBiblico[]>();

  for (const dia of dias) {
    const mes = dia.mes ?? Math.max(1, Math.ceil(dia.dia / 30));
    groups.set(mes, [...(groups.get(mes) ?? []), dia]);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([mes, groupDias]): MonthGroup => {
      const sorted = [...groupDias].sort((a, b) => a.dia - b.dia);
      return {
        mes,
        dias: sorted,
        concluidos: sorted.filter((dia) => dia.status === "concluido").length,
        fase: inferPhase(sorted),
        resumo: getMonthSummary(sorted)
      };
    });
}

export function MonthlySchedule({ dias, onToggleDay, pendingDayId }: MonthlyScheduleProps) {
  const groups = useMemo(() => groupByMonth(dias), [dias]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(groups[0]?.mes ?? null);

  if (dias.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
        Nenhuma leitura foi gerada para este plano.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {groups.map((group) => {
        const expanded = expandedMonth === group.mes;
        const complete = group.concluidos === group.dias.length;

        return (
          <section key={group.mes} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <button className="w-full p-6 text-left transition-all hover:bg-blue-50/40" type="button" onClick={() => setExpandedMonth(expanded ? null : group.mes)}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Mês {group.mes}</p>
                  <h2 className="mt-2 text-2xl font-black text-[#004B87]">{group.fase}</h2>
                  <p className="mt-2 text-gray-500">{group.resumo}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{complete ? "Concluído" : "Pendente"}</Badge>
                  <span className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold text-gray-500">
                    {group.concluidos}/{group.dias.length} dias
                  </span>
                </div>
              </div>
            </button>
            {expanded && (
              <div className="border-t border-gray-100">
                {group.dias.map((dia) => (
                  <div key={dia.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[120px_1fr_170px] md:items-center">
                    <div>
                      <strong className="text-[#004B87]">Dia {dia.dia}</strong>
                      {dia.data && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{dia.data}</p>}
                    </div>
                    <span className="text-gray-500">{dia.leitura}</span>
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <Badge>{dia.status === "concluido" ? "Concluído" : "Pendente"}</Badge>
                      {onToggleDay && (
                        <Button className="px-3 py-2" variant={dia.status === "concluido" ? "secondary" : "ghost"} onClick={() => onToggleDay(dia)} disabled={pendingDayId === dia.id}>
                          {pendingDayId === dia.id ? "Salvando" : dia.status === "concluido" ? "Desmarcar" : "Concluir"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
