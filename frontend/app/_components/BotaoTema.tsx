"use client";

import { Moon, Sun } from "lucide-react";
import { useTema } from "@/lib/tema";

export default function BotaoTema() {
  const { tema, alternarTema } = useTema();

  return (
    <button
      onClick={alternarTema}
      aria-label={tema === "claro" ? "Ativar tema escuro" : "Ativar tema claro"}
      title={tema === "claro" ? "Tema escuro" : "Tema claro"}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
    >
      {tema === "claro" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
