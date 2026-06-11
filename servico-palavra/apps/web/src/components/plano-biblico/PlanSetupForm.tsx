"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PlanSetupForm() {
  const [duracao, setDuracao] = useState("1_ano");

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFCC00]">Plano bíblico</p>
      <h2 className="mt-3 text-2xl font-black text-[#004B87]">Deseja criar seu plano bíblico personalizado?</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {[
          ["6_meses", "6 meses"],
          ["1_ano", "1 ano"],
          ["2_anos", "2 anos"],
          ["personalizado", "Personalizado"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setDuracao(value)}
            className={`rounded-xl border px-4 py-4 text-sm font-bold transition-all hover:-translate-y-0.5 ${
              duracao === value ? "border-[#FFCC00] bg-yellow-50 text-[#004B87] shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {duracao === "personalizado" && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10" placeholder="Anos" type="number" min={0} />
          <input className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10" placeholder="Meses" type="number" min={1} />
        </div>
      )}
      <Button className="mt-6">Criar plano</Button>
    </Card>
  );
}
