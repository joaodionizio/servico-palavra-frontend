"use client";

import { useEffect, useState } from "react";
import { getApiHealth } from "@/services/healthService";

type HealthState = "checking" | "online" | "offline";

// Indicador temporario para validar a conexao inicial com a API V2.
export function ApiHealthStatus() {
  const [status, setStatus] = useState<HealthState>("checking");
  const [message, setMessage] = useState("Verificando API...");

  useEffect(() => {
    let active = true;

    getApiHealth()
      .then((response) => {
        if (!active) {
          return;
        }

        setStatus(response.trim().toLowerCase() === "healthy" ? "online" : "offline");
        setMessage(response.trim() || "Resposta vazia da API");
      })
      .catch(() => {
        if (active) {
          setStatus("offline");
          setMessage("API indisponivel");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const dotClassName =
    status === "online" ? "bg-emerald-500" : status === "offline" ? "bg-red-500" : "animate-pulse bg-yellow-400";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500">
      <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
      <span>API: {message}</span>
    </div>
  );
}
