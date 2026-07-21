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
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
        Nenhuma leitura foi gerada para este plano.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-14">
        {sections.map((section) => {
          const firstMonth = section[0]?.mes ?? 1;
          const lastMonth = section[section.length - 1]?.mes ?? firstMonth;
          const title = `Meses ${firstMonth} ao ${lastMonth}: ${getDominantPhase(section)}`;

          return (
            <section key={`${firstMonth}-${lastMonth}`} className="space-y-8">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="hidden h-px bg-[#FFCC00] md:block" />
                <h2 className="text-center text-2xl font-black uppercase tracking-widest text-[#004B87] md:text-3xl">{title}</h2>
                <div className="hidden h-px bg-[#FFCC00] md:block" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {section.map((group) => (
                  <button
                    key={group.mes}
                    className="group relative min-h-60 overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-[#FDFDFB] p-7 text-left shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#004B87]/20 hover:shadow-xl"
                    type="button"
                    onClick={() => setSelectedMonthNumber(group.mes)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black uppercase tracking-wider text-[#004B87]">Mês {group.mes}</p>
                        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-[#FFCC00]">{group.fase}</p>
                      </div>
                      <span className="mt-1 h-3 w-3 rotate-45 bg-[#FFCC00]" aria-hidden />
                    </div>
                    <div className="mt-5 border-t border-gray-100 pt-5">
                      <p className="min-h-14 text-base leading-relaxed text-gray-500">{group.resumo}</p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <Badge>{getStatusLabel(group.status)}</Badge>
                        <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-[#004B87]">
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#003366]/40 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="month-schedule-title" onClick={() => setSelectedMonthNumber(null)}>
          <section className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-gray-100 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Mês {selectedMonth.mes}</p>
                  <h2 id="month-schedule-title" className="mt-2 text-3xl font-black text-[#004B87]">
                    {selectedMonth.fase}
                  </h2>
                  <p className="mt-2 text-gray-500">{selectedMonth.resumo}</p>
                </div>
                <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-[#004B87] hover:text-white" type="button" onClick={() => setSelectedMonthNumber(null)}>
                  Fechar
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Badge>{getStatusLabel(selectedMonth.status)}</Badge>
                <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-[#004B87]">
                  {selectedMonth.concluidos}/{selectedMonth.dias.length} dias
                </span>
              </div>
            </div>
            <div className="max-h-[58vh] overflow-y-auto">
              {selectedMonth.dias.map((dia) => (
                <div key={dia.id} className="grid gap-3 border-b border-gray-100 p-5 last:border-0 md:grid-cols-[120px_1fr_170px] md:items-center">
                  <div>
                    <strong className="text-[#004B87]">Dia {dia.dia}</strong>
                    {(dia.dataPrevista ?? dia.data) && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{dia.dataPrevista ?? dia.data}</p>}
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
          </section>
        </div>
      )}
    </>
  );
}
