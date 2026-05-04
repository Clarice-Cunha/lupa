"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  PlayCircle,
  RotateCcw,
  Trophy,
  Award,
  BarChart2,
  Globe,
} from "lucide-react";
import {
  carregarProgressoM2,
  resetarM2ParaNovoJogo,
  type ProgressoM2,
} from "@/lib/jogo/m2/progresso";
import { INDICIOS_M2, TOTAL_TEXTOS_M2 } from "@/lib/jogo/m2/dados";
import { CONQUISTAS_M2, CONQUISTAS_M2_POR_ID } from "@/lib/jogo/m2/conquistas";

export default function PaginaMundo2() {
  const [progresso, setProgresso] = useState<ProgressoM2 | null>(null);

  useEffect(() => {
    setProgresso(carregarProgressoM2());
  }, []);

  const jaJogou = progresso && progresso.rodadasJogadas > 0;
  const concluido =
    progresso && progresso.textosVistos.length >= TOTAL_TEXTOS_M2;

  function recomecar() {
    const novo = resetarM2ParaNovoJogo(progresso?.conquistas ?? []);
    setProgresso(novo);
  }

  const porcentagemAcerto =
    progresso && progresso.indiciosTotais > 0
      ? Math.round((progresso.acertosTotal / progresso.indiciosTotais) * 100)
      : null;

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <Link
            href="/jogo/mundos"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900"
          >
            <Globe className="h-4 w-4" />
            Ver todos os mundos
          </Link>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
            <Search className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Mundo 2
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fontes e Evidências
          </h1>
          <p className="mt-2 text-slate-500">
            Aprenda a avaliar a credibilidade das fontes antes de acreditar ou
            compartilhar uma informação.
          </p>
        </header>

        {/* Botão principal */}
        <div className="animate-fade-in-up mb-8 text-center" style={{ animationDelay: "0.06s" }}>
          {concluido ? (
            <div className="space-y-3">
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
                <p className="text-lg font-bold text-emerald-800">
                  🎉 Mundo 2 concluído!
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  {porcentagemAcerto !== null
                    ? `Você acertou ${porcentagemAcerto}% dos indícios com ${progresso?.pontosTotal} pontos.`
                    : "Parabéns por completar todos os casos!"}
                </p>
              </div>
              <button
                onClick={recomecar}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Jogar novamente
              </button>
            </div>
          ) : (
            <Link
              href="/jogo/mundo2/rodada"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            >
              <PlayCircle className="h-5 w-5" />
              {jaJogou ? "Continuar jogando" : "Começar o Mundo 2"}
            </Link>
          )}

          {jaJogou && !concluido && (
            <p className="mt-3 text-sm text-slate-500">
              {progresso?.textosVistos.length}/{TOTAL_TEXTOS_M2} casos analisados
            </p>
          )}
        </div>

        {/* Progresso */}
        {jaJogou && (
          <div
            className="animate-fade-in-up mb-8 grid grid-cols-3 gap-3"
            style={{ animationDelay: "0.08s" }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-800">
                {progresso?.rodadasJogadas}
              </p>
              <p className="mt-1 text-xs text-slate-500">Rodadas</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-800">
                {progresso?.pontosTotal}
              </p>
              <p className="mt-1 text-xs text-amber-600">Pontos</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-800">
                {porcentagemAcerto !== null ? `${porcentagemAcerto}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-emerald-600">Acertos</p>
            </div>
          </div>
        )}

        {/* Conquistas */}
        <section
          className="animate-fade-in-up mb-8 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-emerald-100/30 backdrop-blur-sm"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Award className="h-5 w-5 text-emerald-600" />
            Conquistas do Mundo 2
          </h2>
          <div className="space-y-3">
            {CONQUISTAS_M2.map((c) => {
              const ganhou = progresso?.conquistas.includes(c.id) ?? false;
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                    ganhou
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-100 bg-slate-50 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-xl">{ganhou ? "🏅" : "🔒"}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.nome}</p>
                    <p className="text-xs text-slate-500">{c.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Indícios deste mundo */}
        <section
          className="animate-fade-in-up mb-8 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-emerald-100/30 backdrop-blur-sm"
          style={{ animationDelay: "0.12s" }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BarChart2 className="h-5 w-5 text-emerald-600" />
            Indícios que você vai aprender
          </h2>
          <ul className="space-y-3">
            {INDICIOS_M2.map((ind) => {
              const stats = progresso?.estatisticasPorIndicio?.[ind.id];
              const taxa =
                stats && stats.visto > 0
                  ? Math.round((stats.acertos / stats.visto) * 100)
                  : null;
              return (
                <li key={ind.id} className="flex items-start gap-3">
                  <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{ind.nome}</p>
                      {taxa !== null && (
                        <span
                          className={`shrink-0 text-xs font-semibold ${
                            taxa >= 75
                              ? "text-emerald-700"
                              : taxa >= 50
                                ? "text-amber-700"
                                : "text-rose-700"
                          }`}
                        >
                          {taxa}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{ind.descricao}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Como funciona */}
        <section
          className="animate-fade-in-up rounded-2xl border border-emerald-100 bg-emerald-50 p-5"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="mb-3 text-sm font-semibold text-emerald-700">
            Como funciona o Mundo 2
          </p>
          <ol className="space-y-2 text-sm text-emerald-900">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">1</span>
              Você recebe um texto real ou adaptado de casos noticiados.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">2</span>
              Marque os indícios que identificar sobre a qualidade das fontes.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">3</span>
              Se o texto for confiável, marque "Sem indícios" — isso também conta!
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">4</span>
              Conclua os 8 casos com pelo menos 75% de acertos para ganhar o badge.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
