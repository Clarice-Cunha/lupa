"use client";

/**
 * Página do jogo de aventura 2D — Mundo 1: Fake News
 *
 * Precisa ser Client Component porque usa `dynamic` com `ssr: false`.
 * O Phaser exige o objeto `window` do navegador para funcionar.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const JogoAventura = dynamic(() => import("./JogoAventura"), { ssr: false });

export default function PaginaAventura() {
  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Botão voltar */}
        <Link
          href="/jogos"
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Jogos
        </Link>

        {/* Cabeçalho */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Agente LUPA
          </h1>
          <p className="mt-2 text-slate-600">
            Aventura 2D · Mundo 1 — Fake News
          </p>
        </header>

        {/* Jogo */}
        <JogoAventura />

        {/* Dica de controles */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
          <strong className="text-slate-700">Controles:</strong> Setas ou WASD
          para mover · Espaço ou W para pular · Responda à pergunta quando o
          inimigo te alcançar
        </div>
      </div>
    </main>
  );
}
