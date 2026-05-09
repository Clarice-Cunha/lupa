"use client";

import { useState } from "react";
import { CENARIOS, TATICAS, type TaticaId } from "./cenarios";

type Fase = "intro" | "jogando" | "fim";

function getMedalha(acertos: number): { emoji: string; titulo: string; cor: string } {
  if (acertos >= 5) return { emoji: "🏆", titulo: "Detetive Expert", cor: "text-amber-600" };
  if (acertos >= 4) return { emoji: "🥈", titulo: "Agente Perspicaz", cor: "text-slate-500" };
  if (acertos >= 3) return { emoji: "🥉", titulo: "Investigador em Formação", cor: "text-orange-600" };
  return { emoji: "🔍", titulo: "Continue Treinando", cor: "text-indigo-600" };
}

export default function JogoEngenhariaSocial() {
  const [fase, setFase] = useState<Fase>("intro");
  const [rodada, setRodada] = useState(0);
  const [selecionada, setSelecionada] = useState<TaticaId | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const cenario = CENARIOS[rodada];
  const ultima = rodada === CENARIOS.length - 1;

  function handleSelecionar(opcao: TaticaId) {
    if (revelado) return;
    setSelecionada(opcao);
    setRevelado(true);
    if (opcao === cenario.respostaCorreta) {
      setAcertos((a) => a + 1);
    }
  }

  function handleProxima() {
    if (ultima) {
      setFase("fim");
    } else {
      setRodada((r) => r + 1);
      setSelecionada(null);
      setRevelado(false);
    }
  }

  function handleReiniciar() {
    setFase("intro");
    setRodada(0);
    setSelecionada(null);
    setRevelado(false);
    setAcertos(0);
  }

  // ── INTRO ──────────────────────────────────────────────────
  if (fase === "intro") {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="text-sm leading-relaxed text-teal-900">
            Engenharia social é a arte de <strong>manipular pessoas</strong> para
            obter informações ou acesso, sem precisar invadir sistemas. Cada cenário
            apresenta uma situação do cotidiano — seu trabalho é identificar qual
            tática está sendo usada.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Táticas que você vai encontrar
          </p>
          {Object.values(TATICAS).map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
            >
              <span className="text-xl">{t.icone}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.nome}</p>
                <p className="text-xs text-slate-500">{t.descricaoCurta}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setFase("jogando")}
          className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-200 transition hover:opacity-90 active:scale-95"
        >
          Começar →
        </button>
      </div>
    );
  }

  // ── FIM ────────────────────────────────────────────────────
  if (fase === "fim") {
    const medalha = getMedalha(acertos);
    return (
      <div className="animate-fade-in-up space-y-6 text-center">
        <div className="text-6xl">{medalha.emoji}</div>
        <div>
          <p className={`text-2xl font-bold ${medalha.cor}`}>{medalha.titulo}</p>
          <p className="mt-1 text-slate-600">
            Você identificou{" "}
            <strong className="text-slate-900">
              {acertos} de {CENARIOS.length}
            </strong>{" "}
            táticas corretamente
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Resumo das táticas
          </p>
          <div className="space-y-1.5">
            {CENARIOS.map((c) => {
              const tatica = TATICAS[c.respostaCorreta];
              return (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{tatica.icone}</span>
                  <span className="font-medium text-slate-700">{c.titulo}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-600">{tatica.nome}</span>
                </div>
              );
            })}
          </div>
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
  const correta = cenario.respostaCorreta;

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Progresso */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Cenário {rodada + 1} de {CENARIOS.length}
        </span>
        <span className="text-sm font-semibold text-teal-700">{acertos} ✓</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all"
          style={{ width: `${(rodada / CENARIOS.length) * 100}%` }}
        />
      </div>

      {/* Cenário */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
          {cenario.titulo}
        </p>
        <p className="text-sm leading-relaxed text-slate-700">{cenario.contexto}</p>
      </div>

      {/* Pergunta */}
      <p className="text-sm font-semibold text-slate-800">
        Qual tática de engenharia social está sendo usada?
      </p>

      {/* Opções */}
      <div className="space-y-2.5">
        {cenario.opcoes.map((opcaoId) => {
          const tatica = TATICAS[opcaoId];
          let estilo =
            "flex items-center gap-3 w-full rounded-2xl border p-4 text-left text-sm font-medium transition ";

          if (!revelado) {
            estilo +=
              "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50 cursor-pointer";
          } else if (opcaoId === correta) {
            estilo += "border-emerald-400 bg-emerald-50 text-emerald-800";
          } else if (opcaoId === selecionada) {
            estilo += "border-red-300 bg-red-50 text-red-700";
          } else {
            estilo += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
          }

          return (
            <button
              key={opcaoId}
              onClick={() => handleSelecionar(opcaoId)}
              disabled={revelado}
              className={estilo}
            >
              <span className="text-xl">{tatica.icone}</span>
              <span className="flex-1">{tatica.nome}</span>
              {revelado && opcaoId === correta && (
                <span className="text-emerald-600">✓</span>
              )}
              {revelado && opcaoId === selecionada && opcaoId !== correta && (
                <span className="text-red-500">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explicação */}
      {revelado && (
        <div
          className={`animate-fade-in-up rounded-2xl p-4 text-sm leading-relaxed ${
            selecionada === correta
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-red-200 bg-red-50 text-red-900"
          }`}
        >
          <p className="mb-1 font-semibold">
            {selecionada === correta ? "✓ Correto!" : "✗ Não exatamente."}
          </p>
          <p>{cenario.explicacao}</p>
        </div>
      )}

      {/* Próxima */}
      {revelado && (
        <button
          onClick={handleProxima}
          className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-200 transition hover:opacity-90 active:scale-95"
        >
          {ultima ? "Ver resultado" : "Próximo cenário →"}
        </button>
      )}
    </div>
  );
}
