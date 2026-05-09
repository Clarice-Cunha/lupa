"use client";

import { useState } from "react";
import {
  AFIRMACOES,
  INDICADORES,
  type Classificacao,
  type IndicadorId,
} from "./afirmacoes";

type Fase = "intro" | "jogando" | "fim";
type Etapa = "classificar" | "indicar" | "revelar";

type ResultadoRodada = {
  manchete: string;
  classCorreta: boolean;
  indCorreto: boolean;
};

const MAX_PONTOS = AFIRMACOES.length * 20;

function getMedalha(pontos: number) {
  const pct = pontos / MAX_PONTOS;
  if (pct >= 0.875)
    return { emoji: "🏆", titulo: "Leitor Crítico Expert", cor: "text-amber-600" };
  if (pct >= 0.6875)
    return { emoji: "🥈", titulo: "Analista de Mídia", cor: "text-slate-500" };
  if (pct >= 0.5)
    return { emoji: "🥉", titulo: "Leitor Atento", cor: "text-orange-600" };
  return { emoji: "🔍", titulo: "Continue Praticando", cor: "text-indigo-600" };
}

export default function JogoVerdadeiroOuSuspeito() {
  const [fase, setFase] = useState<Fase>("intro");
  const [etapa, setEtapa] = useState<Etapa>("classificar");
  const [rodada, setRodada] = useState(0);
  const [classificacao, setClassificacao] = useState<Classificacao | null>(null);
  const [indicador, setIndicador] = useState<IndicadorId | null>(null);
  const [pontos, setPontos] = useState(0);
  const [resultados, setResultados] = useState<ResultadoRodada[]>([]);

  const afirmacao = AFIRMACOES[rodada];
  const ultima = rodada === AFIRMACOES.length - 1;

  function handleClassificar(escolha: Classificacao) {
    setClassificacao(escolha);
    setEtapa("indicar");
  }

  function handleIndicar(escolha: IndicadorId) {
    setIndicador(escolha);
    const classCorreta = classificacao === afirmacao.classificacaoCorreta;
    const indCorreto = escolha === afirmacao.indicadorCorreto;
    let ganhos = 0;
    if (classCorreta) ganhos += 10;
    if (indCorreto) ganhos += 10;
    setPontos((p) => p + ganhos);
    setResultados((prev) => [
      ...prev,
      { manchete: afirmacao.manchete, classCorreta, indCorreto },
    ]);
    setEtapa("revelar");
  }

  function handleProxima() {
    if (ultima) {
      setFase("fim");
    } else {
      setRodada((r) => r + 1);
      setClassificacao(null);
      setIndicador(null);
      setEtapa("classificar");
    }
  }

  function handleReiniciar() {
    setFase("intro");
    setEtapa("classificar");
    setRodada(0);
    setClassificacao(null);
    setIndicador(null);
    setPontos(0);
    setResultados([]);
  }

  // ── INTRO ──────────────────────────────────────────────────
  if (fase === "intro") {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-sm leading-relaxed text-violet-900">
            Você verá <strong>8 manchetes e afirmações</strong> que circulam na
            internet. Para cada uma, classifique como{" "}
            <strong>Verdadeiro</strong> ou <strong>Suspeito</strong> e depois
            identifique o principal indício que justifica sua resposta.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
            <p className="text-2xl">✓</p>
            <p className="mt-1 text-sm font-bold text-emerald-800">Verdadeiro</p>
            <p className="mt-0.5 text-xs text-emerald-700">
              Fonte identificada, linguagem precisa
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
            <p className="text-2xl">⚠</p>
            <p className="mt-1 text-sm font-bold text-amber-800">Suspeito</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Fonte vaga, exagero, promessa milagrosa…
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Cada afirmação vale 20 pontos: 10 pela classificação + 10 pelo indício.
        </p>

        <button
          onClick={() => setFase("jogando")}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
        >
          Começar →
        </button>
      </div>
    );
  }

  // ── FIM ────────────────────────────────────────────────────
  if (fase === "fim") {
    const medalha = getMedalha(pontos);
    const classAcertos = resultados.filter((r) => r.classCorreta).length;
    const indAcertos = resultados.filter((r) => r.indCorreto).length;

    return (
      <div className="animate-fade-in-up space-y-6 text-center">
        <div className="text-6xl">{medalha.emoji}</div>
        <div>
          <p className={`text-2xl font-bold ${medalha.cor}`}>{medalha.titulo}</p>
          <p className="mt-1 text-slate-600">
            <strong className="text-slate-900">{pontos}</strong> de{" "}
            <strong className="text-slate-900">{MAX_PONTOS}</strong> pontos
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-2xl font-bold text-slate-800">
              {classAcertos}/{AFIRMACOES.length}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">classificações corretas</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-2xl font-bold text-slate-800">
              {indAcertos}/{AFIRMACOES.length}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">indícios corretos</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Resultado por afirmação
          </p>
          <div className="space-y-2">
            {resultados.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-0.5 shrink-0 font-bold ${
                    r.classCorreta && r.indCorreto
                      ? "text-emerald-600"
                      : r.classCorreta || r.indCorreto
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}
                >
                  {r.classCorreta && r.indCorreto
                    ? "✓✓"
                    : r.classCorreta
                    ? "✓✗"
                    : r.indCorreto
                    ? "✗✓"
                    : "✗✗"}
                </span>
                <span className="text-slate-600 line-clamp-2">
                  &ldquo;{r.manchete}&rdquo;
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            ✓✓ ambos corretos &middot; ✓✗ só classificação &middot; ✗✓ só indício
          </p>
        </div>

        <button
          onClick={handleReiniciar}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Jogar novamente
        </button>
      </div>
    );
  }

  // ── JOGANDO ────────────────────────────────────────────────
  const corretaClass = afirmacao.classificacaoCorreta;
  const corretaInd = afirmacao.indicadorCorreto;
  const classAcertou = classificacao === corretaClass;
  const indAcertou = indicador === corretaInd;

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Progresso */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Afirmação {rodada + 1} de {AFIRMACOES.length}
        </span>
        <span className="text-sm font-semibold text-violet-700">{pontos} pts</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all"
          style={{ width: `${(rodada / AFIRMACOES.length) * 100}%` }}
        />
      </div>

      {/* Card da afirmação */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          etapa !== "classificar"
            ? "border-slate-200/60 bg-slate-50"
            : "border-slate-200/60 bg-white"
        }`}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-600">
          {etapa === "classificar" ? "O que você acha desta afirmação?" : "Afirmação analisada"}
        </p>
        <p className="text-sm font-medium leading-relaxed text-slate-800">
          &ldquo;{afirmacao.manchete}&rdquo;
        </p>
      </div>

      {/* ETAPA 1 — Classificar */}
      {etapa === "classificar" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleClassificar("verdadeiro")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 active:scale-95"
          >
            <span className="text-3xl">✓</span>
            <span className="text-base font-bold">Verdadeiro</span>
          </button>
          <button
            onClick={() => handleClassificar("suspeito")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-amber-800 transition hover:border-amber-400 hover:bg-amber-100 active:scale-95"
          >
            <span className="text-3xl">⚠</span>
            <span className="text-base font-bold">Suspeito</span>
          </button>
        </div>
      )}

      {/* ETAPA 2 — Indicar */}
      {etapa === "indicar" && (
        <>
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
              classificacao === "verdadeiro"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <span>{classificacao === "verdadeiro" ? "✓" : "⚠"}</span>
            <span>
              Você marcou:{" "}
              <strong>
                {classificacao === "verdadeiro" ? "Verdadeiro" : "Suspeito"}
              </strong>
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Qual característica mais se destaca nessa afirmação?
          </p>
          <div className="space-y-2.5">
            {afirmacao.indicadores.map((indId) => (
              <button
                key={indId}
                onClick={() => handleIndicar(indId)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 active:scale-[0.99]"
              >
                {INDICADORES[indId].label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ETAPA 3 — Revelar */}
      {etapa === "revelar" && (
        <>
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
              classAcertou
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span className="text-lg">{classAcertou ? "✓" : "✗"}</span>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-semibold">
                {classAcertou ? "Classificação correta" : "Classificação incorreta"}
              </span>
              {!classAcertou && (
                <span className="text-slate-600">
                  — era{" "}
                  <strong>
                    {corretaClass === "verdadeiro" ? "Verdadeiro" : "Suspeito"}
                  </strong>
                </span>
              )}
              <span className="ml-1 text-xs font-bold">
                {classAcertou ? "+10 pts" : "+0 pts"}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
              indAcertou
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span className="text-lg">{indAcertou ? "✓" : "✗"}</span>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-semibold">
                {indAcertou ? "Indício correto" : "Indício incorreto"}
              </span>
              {!indAcertou && (
                <span className="text-slate-600">
                  — era{" "}
                  <strong>{INDICADORES[corretaInd].label}</strong>
                </span>
              )}
              <span className="ml-1 text-xs font-bold">
                {indAcertou ? "+10 pts" : "+0 pts"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
            <p className="mb-1 font-semibold text-slate-900">Por quê?</p>
            <p>{afirmacao.explicacao}</p>
          </div>

          <button
            onClick={handleProxima}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-95"
          >
            {ultima ? "Ver resultado" : "Próxima →"}
          </button>
        </>
      )}
    </div>
  );
}
