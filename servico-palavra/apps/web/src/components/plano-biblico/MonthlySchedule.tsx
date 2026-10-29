"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  status: "pendente" | "em andamento" | "concluido";
};

const GROUP_PRIORITY = [
  "Cartas Joaninas",
  "Evangelhos",
  "Cartas Apostólicas",
  "Pentateuco",
  "Históricos",
  "Profetas",
  "Sapienciais",
  "Deuterocanônicos"
];

const BOOK_GROUPS: Array<[string, string[]]> = [
  ["Cartas Joaninas", ["1 joao", "2 joao", "3 joao", "1a carta de sao joao", "2a carta de sao joao", "3a carta de sao joao", "primeira carta de sao joao", "segunda carta de sao joao", "terceira carta de sao joao"]],
  ["Evangelhos", ["mateus", "marcos", "lucas", "evangelho de sao joao", "evangelho segundo joao", "evangelho de joao", "sao joao"]],
  ["Cartas Apostólicas", ["atos dos apostolos", "atos", "romanos", "corintios", "galatas", "efesios", "filipenses", "colossenses", "tessalonicenses", "timoteo", "tito", "filemon", "hebreus", "tiago", "pedro", "judas", "apocalipse"]],
  ["Pentateuco", ["genesis", "exodo", "levitico", "numeros", "deuteronomio"]],
  ["Históricos", ["josue", "juizes", "rute", "samuel", "reis", "cronicas", "esdras", "neemias"]],
  ["Profetas", ["isaias", "jeremias", "lamentacoes", "ezequiel", "daniel", "oseias", "joel", "amos", "abdias", "jonas", "miqueias", "naum", "habacuc", "sofonias", "ageu", "zacarias", "malaquias"]],
  ["Sapienciais", ["jo", "proverbios", "eclesiastes", "cantico dos canticos"]],
  ["Deuterocanônicos", ["tobias", "judite", "ester", "sabedoria", "eclesiastico", "baruc", "macabeus"]]
];

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function hasBook(text: string, book: string) {
  return new RegExp(`(^|[^a-z0-9])${book.replace(/\s+/g, "\\s+")}([^a-z0-9]|$)`).test(text);
}

function getReadingGroups(reading: string) {
  const text = normalizeText(reading);
  const groups = new Set<string>();

  for (const [group, books] of BOOK_GROUPS) {
    if (books.some((book) => hasBook(text, book))) {
      groups.add(group);
    }
  }

  return groups;
}

function inferPhase(dias: DiaPlanoBiblico[]) {
  const groups = new Set<string>();

  for (const dia of dias) {
    for (const group of getReadingGroups(dia.leitura)) {
      groups.add(group);
    }
  }

  const ordered = GROUP_PRIORITY.filter((group) => groups.has(group));
  return formatPhaseLabel(ordered);
}

function formatPhaseLabel(groups: string[]) {
  if (groups.length === 0) {
    return "Leituras mistas";
  }

  if (groups.length === 1) {
    return groups[0];
  }

  if (groups.length === 2) {
    return `${groups[0]} e ${groups[1]}`;
  }

  return `${groups.slice(0, -1).join(", ")} e ${groups[groups.length - 1]}`;
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

function getMonthStatus(concluidos: number, total: number): MonthGroup["status"] {
  if (concluidos === 0) {
    return "pendente";
  }

  if (concluidos >= total) {
    return "concluido";
  }

  return "em andamento";
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
        resumo: getMonthSummary(sorted),
        status: getMonthStatus(sorted.filter((dia) => dia.status === "concluido").length, sorted.length)
      };
    });
}

function groupIntoSections(groups: MonthGroup[]) {
  const sections: MonthGroup[][] = [];

  for (let index = 0; index < groups.length; index += 6) {
    sections.push(groups.slice(index, index + 6));
  }

  return sections;
}

function getDominantPhase(groups: MonthGroup[]) {
  const sectionGroups = new Set<string>();

  for (const group of groups) {
    for (const dia of group.dias) {
      for (const pastoralGroup of getReadingGroups(dia.leitura)) {
        sectionGroups.add(pastoralGroup);
      }
    }
  }

  return formatPhaseLabel(GROUP_PRIORITY.filter((group) => sectionGroups.has(group)));
}

function getStatusLabel(status: MonthGroup["status"]) {
  if (status === "concluido") {
    return "Concluído";
  }

  if (status === "em andamento") {
    return "Em andamento";
  }

  return "Pendente";
}

export function MonthlySchedule({ dias, onToggleDay, pendingDayId }: MonthlyScheduleProps) {
  const groups = useMemo(() => groupByMonth(dias), [dias]);
  const sections = useMemo(() => groupIntoSections(groups), [groups]);
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number | null>(null);
  const selectedMonth = groups.find((group) => group.mes === selectedMonthNumber) ?? null;

  if (dias.length === 0) {
    return <Card className="text-gray-500 dark:text-slate-300">Nenhuma leitura foi gerada para este plano.</Card>;
  }

  return (
    <>
      <div className="space-y-9 sm:space-y-12 lg:space-y-14">
        {sections.map((section) => {
          const firstMonth = section[0]?.mes ?? 1;
          const lastMonth = section[section.length - 1]?.mes ?? firstMonth;
          const title = `Meses ${firstMonth} ao ${lastMonth}: ${getDominantPhase(section)}`;

          return (
            <section key={`${firstMonth}-${lastMonth}`} className="space-y-5 sm:space-y-8">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="hidden h-px bg-[#FFCC00] md:block" />
                <h2 className="break-words text-center text-xl font-black uppercase tracking-wider text-[var(--sp-brand)] sm:text-2xl md:text-3xl md:tracking-widest dark:text-sky-100">{title}</h2>
                <div className="hidden h-px bg-[#FFCC00] md:block" />
              </div>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {section.map((group) => (
                  <button
                    key={group.mes}
                    className="ui-card card-hover group relative min-h-52 min-w-0 overflow-hidden border border-slate-200/70 bg-[#FDFDFB] p-5 text-left sm:min-h-60 sm:p-7 dark:border-slate-700 dark:bg-slate-900/70"
                    type="button"
                    onClick={() => setSelectedMonthNumber(group.mes)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-lg font-black uppercase tracking-wider text-[var(--sp-brand)] sm:text-xl dark:text-sky-100">Mês {group.mes}</p>
                        <p className="mt-2 break-words text-sm font-bold uppercase tracking-wider text-[#C99600] dark:text-[#FFCC00]">{group.fase}</p>
                      </div>
                      <span className="mt-1 h-3 w-3 shrink-0 rotate-45 bg-[#FFCC00]" aria-hidden />
                    </div>
                    <div className="mt-5 border-t border-gray-100 pt-5 dark:border-slate-800">
                      <p className="min-h-14 break-words text-base leading-relaxed text-gray-500 dark:text-slate-300">{group.resumo}</p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <Badge>{getStatusLabel(group.status)}</Badge>
                        <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-[var(--sp-brand)] dark:bg-sky-200/10 dark:text-sky-100">
                          {group.concluidos}/{group.dias.length} dias
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {selectedMonth && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#003366]/55 px-3 py-5 backdrop-blur-sm sm:px-4 sm:py-8" role="dialog" aria-modal="true" aria-labelledby="month-schedule-title" onClick={() => setSelectedMonthNumber(null)}>
          <section className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[var(--sp-radius-card)] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-gray-100 p-5 sm:p-6 md:p-8 dark:border-slate-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#C99600] dark:text-[#FFCC00]">Mês {selectedMonth.mes}</p>
                  <h2 id="month-schedule-title" className="mt-2 break-words text-2xl font-black text-[var(--sp-brand)] sm:text-3xl dark:text-sky-100">
                    {selectedMonth.fase}
                  </h2>
                  <p className="mt-2 break-words text-gray-500 dark:text-slate-300">{selectedMonth.resumo}</p>
                </div>
                <Button variant="secondary" type="button" onClick={() => setSelectedMonthNumber(null)} className="w-full shrink-0 sm:w-auto">
                  Fechar
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Badge>{getStatusLabel(selectedMonth.status)}</Badge>
                <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-[var(--sp-brand)] dark:bg-sky-200/10 dark:text-sky-100">
                  {selectedMonth.concluidos}/{selectedMonth.dias.length} dias
                </span>
              </div>
            </div>
            <div className="max-h-[58vh] overflow-y-auto">
              {selectedMonth.dias.map((dia) => (
                <div key={dia.id} className="grid gap-3 border-b border-gray-100 p-4 sm:p-5 last:border-0 md:grid-cols-[120px_1fr_170px] md:items-center dark:border-slate-800">
                  <div>
                    <strong className="text-[var(--sp-brand)] dark:text-sky-100">Dia {dia.dia}</strong>
                    {(dia.dataPrevista ?? dia.data) && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">{dia.dataPrevista ?? dia.data}</p>}
                  </div>
                  <span className="break-words text-gray-500 dark:text-slate-300">{dia.leitura}</span>
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
          </section>
        </div>
      )}
    </>
  );
}
