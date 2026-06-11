import { formatPercent } from "@/lib/utils";

export function TrailProgress({ progresso }: { progresso: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="h-3 rounded-full bg-blue-50">
        <div className="h-3 rounded-full bg-[#004B87]" style={{ width: `${progresso}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-500">{formatPercent(progresso)} concluído</p>
    </div>
  );
}
