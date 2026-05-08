"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { MENSAGENS, type Segmento, type Mensagem } from "./mensagens";

type Fase = "intro" | "jogando" | "resumo" | "fim";

const PONTOS_POR_ARMADILHA = 20;
const TOTAL_POSSIVEIS = MENSAGENS.reduce((a, m) => a + m.totalArmadilhas, 0);
const MAX_PONTOS = TOTAL_POSSIVEIS * PONTOS_POR_ARMADILHA;

function getResultado(pontos: number) {
  const pct = pontos / MAX_PONTOS;
  if (pct >= 0.9)
    return {
      titulo: "Especialista em Phishing",
      emoji: "🏆",
      cor: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    };
  if (pct >= 0.7)
    return {
      titulo: "Detetive Digital",
      emoji: "🥈",
      cor: "text-slate-600",
      bg: "bg-slate-50 border-slate-200",
    };
  if (pct >= 0.5)
    return {
      titulo: "Aprendiz Cibernético",
      emoji: "🥉",
      cor: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    };
  return {
    titulo: "Continue praticando",
    emoji: "🔍",
    cor: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
  };
}

// Coleta todas as armadilhas de uma mensagem na ordem de aparição
function coletarArmadilhas(msg: Mensagem) {
  return [
    ...msg.de.filter((s) => s.armadilha).map((s) => s.armadilha!),
    ...(msg.assunto ?? []).filter((s) => s.armadilha).map((s) => s.armadilha!),
    ...msg.corpo.flat().filter((s) => s.armadilha).map((s) => s.armadilha!),
  ];
}

// Renderiza um array de segmentos inline (dentro de um <p>)
function Segmentos({
  segs,
  encontradas,
  revelar,
  onClicar,
}: {
  segs: Segmento[];
  encontradas: Set<string>;
  revelar: boolean;
  onClicar: (seg: Segmento) => void;
}) {
  return (
    <>
      {segs.map((seg, i) => {
        if (!seg.armadilha) return <span key={i}>{seg.texto}</span>;

        const encontrada = encontradas.has(seg.armadilha.id);

        if (revelar) {
          return (
            <span
              key={i}
              className={
                encontrada
                  ? "rounded bg-emerald-100 px-0.5 text-emerald-800"
                  : "rounded bg-red-100 px-0.5 text-red-700"
              }
            >
              {seg.texto}
              {!encontrada && " ⚠️"}
            </span>
          );
        }

        return (
          <span
            key={i}
            onClick={() => onClicar(seg)}
            className={
              encontrada
                ? "cursor-default rounded bg-orange-100 px-0.5 text-orange-800"
                : "cursor-pointer rounded px-0.5 transition hover:bg-yellow-50"
            }
          >
            {seg.texto}
          </span>
        );
      })}
    </>
  );
}

// Mockup de e-mail
function MockupEmail({
  msg,
  encontradas,
  revelar,
  onClicar,
}: {
  msg: Mensagem;
  encontradas: Set<string>;
  revelar: boolean;
  onClicar: (seg: Segmento) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md text-sm">
      {/* Barra de título estilo cliente de e-mail */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-slate-400">Caixa de Entrada</span>
      </div>
      {/* Cabeçalho do e-mail */}
      <div className="space-y-1.5 border-b border-slate-100 bg-white px-5 py-4">
        <div className="flex gap-2">
          <span className="w-16 flex-shrink-0 text-right text-slate-400">De:</span>
          <span className="font-mono text-slate-700">
            <Segmentos
              segs={msg.de}
              encontradas={encontradas}
              revelar={revelar}
              onClicar={onClicar}
            />
          </span>
        </div>
        {msg.assunto && (
          <div className="flex gap-2">
            <span className="w-16 flex-shrink-0 text-right text-slate-400">Assunto:</span>
            <span className="font-semibold text-slate-800">
              <Segmentos
                segs={msg.assunto}
                encontradas={encontradas}
                revelar={revelar}
                onClicar={onClicar}
              />
            </span>
          </div>
        )}
      </div>
      {/* Corpo do e-mail */}
      <div className="space-y-3 bg-white px-5 py-5 leading-relaxed text-slate-700">
        {msg.corpo.map((paragrafo, i) => (
          <p key={i}>
            <Segmentos
              segs={paragrafo}
              encontradas={encontradas}
              revelar={revelar}
              onClicar={onClicar}
            />
          </p>
        ))}
      </div>
    </div>
  );
}

// Mockup de WhatsApp
function MockupWhatsApp({
  msg,
  encontradas,
  revelar,
  onClicar,
}: {
  msg: Mensagem;
  encontradas: Set<string>;
  revelar: boolean;
  onClicar: (seg: Segmento) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md text-sm">
      {/* Header verde do WhatsApp */}
      <div className="flex items-center gap-3 bg-emerald-600 px-4 py-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-white">
          ?
        </div>
        <div>
          <p className="font-semibold text-white">
            <Segmentos
              segs={msg.de}
              encontradas={encontradas}
              revelar={revelar}
              onClicar={onClicar}
            />
          </p>
          <p className="text-xs text-emerald-200">online</p>
        </div>
      </div>
      {/* Área de chat */}
      <div className="min-h-28 bg-[#ECE5DD] px-4 py-5">
        <div className="ml-auto max-w-xs space-y-1.5 rounded-lg rounded-tr-none bg-white px-3 py-2.5 shadow-sm leading-snug text-slate-800">
          {msg.corpo.map((paragrafo, i) => (
            <p key={i}>
              <Segmentos
                segs={paragrafo}
                encontradas={encontradas}
                revelar={revelar}
                onClicar={onClicar}
              />
            </p>
          ))}
          <p className="mt-1 text-right text-xs text-slate-400">23:12 ✓✓</p>
        </div>
      </div>
    </div>
  );
}

// Mockup de SMS
function MockupSMS({
  msg,
  encontradas,
  revelar,
  onClicar,
}: {
  msg: Mensagem;
  encontradas: Set<string>;
  revelar: boolean;
  onClicar: (seg: Segmento) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md text-sm">
      {/* Header do SMS */}
      <div className="flex items-center gap-3 bg-slate-700 px-4 py-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-500 text-base">
          📱
        </div>
        <div>
          <p className="font-semibold font-mono text-white">
            <Segmentos
              segs={msg.de}
              encontradas={encontradas}
              revelar={revelar}
              onClicar={onClicar}
            />
          </p>
          <p className="text-xs text-slate-300">Mensagem de texto</p>
        </div>
      </div>
      {/* Balão do SMS */}
      <div className="bg-slate-100 px-4 py-5">
        <div className="max-w-xs space-y-1.5 rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm leading-snug text-slate-800">
          {msg.corpo.map((paragrafo, i) => (
            <p key={i}>
              <Segmentos
                segs={paragrafo}
                encontradas={encontradas}
                revelar={revelar}
                onClicar={onClicar}
              />
            </p>
          ))}
          <p className="mt-1 text-right text-xs text-slate-400">Hoje 14:37</p>
        </div>
      </div>
    </div>
  );
}

export default function JogoPhishing() {
  const [fase, setFase] = useState<Fase>("intro");
  const [rodada, setRodada] = useState(0);
  const [encontradas, setEncontradas] = useState<Set<string>>(new Set());
  const [totalPontos, setTotalPontos] = useState(0);
  const [totalAchadas, setTotalAchadas] = useState(0);
  const [ultimoFeedback, setUltimoFeedback] = useState<{
    label: string;
    explicacao: string;
  } | null>(null);

  const mensagem = MENSAGENS[rodada];

  function handleClicarTrap(seg: Segmento) {
    if (!seg.armadilha) return;
    setUltimoFeedback({
      label: seg.armadilha.label,
      explicacao: seg.armadilha.explicacao,
    });
    if (encontradas.has(seg.armadilha.id)) return;
    setEncontradas((prev) => new Set([...prev, seg.armadilha!.id]));
  }

  function handleRevelar() {
    setFase("resumo");
  }

  function handleProxima() {
    const pontosRodada = encontradas.size * PONTOS_POR_ARMADILHA;
    setTotalPontos((p) => p + pontosRodada);
    setTotalAchadas((a) => a + encontradas.size);

    if (rodada < MENSAGENS.length - 1) {
      setRodada((r) => r + 1);
      setEncontradas(new Set());
      setUltimoFeedback(null);
      setFase("jogando");
    } else {
      setFase("fim");
    }
  }

  function handleReiniciar() {
    setFase("intro");
    setRodada(0);
    setEncontradas(new Set());
    setTotalPontos(0);
    setTotalAchadas(0);
    setUltimoFeedback(null);
  }

  // ── INTRO ──────────────────────────────────────────────
  if (fase === "intro") {
    return (
      <div className="animate-fade-in-up space-y-6 rounded-3xl border border-orange-200 bg-orange-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-200">
          <ShieldAlert className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Caça ao Phishing
          </h2>
          <p className="mt-2 leading-relaxed text-slate-600">
            Você vai analisar <strong>5 mensagens falsas</strong> — e-mails,
            WhatsApp e SMS — e precisa{" "}
            <strong>clicar em tudo que parecer suspeito</strong>.
          </p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-white p-4 text-left text-sm text-slate-700 space-y-1.5">
          <p>
            🎯 <strong>Objetivo:</strong> identificar as armadilhas de phishing
            em cada mensagem
          </p>
          <p>
            🏆 <strong>Pontuação:</strong> +{PONTOS_POR_ARMADILHA} pontos por
            armadilha encontrada
          </p>
          <p>
            💡 <strong>Dica:</strong> clique em qualquer parte que pareça
            suspeita
          </p>
        </div>
        <button
          onClick={() => setFase("jogando")}
          className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Começar a caçar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── FIM ────────────────────────────────────────────────
  if (fase === "fim") {
    const pontosFinais = totalPontos;
    const achadasFinais = totalAchadas;
    const resultado = getResultado(pontosFinais);
    return (
      <div
        className={`animate-fade-in-up space-y-5 rounded-3xl border p-8 text-center ${resultado.bg}`}
      >
        <div className="text-5xl">{resultado.emoji}</div>
        <div>
          <h2 className={`text-2xl font-bold ${resultado.cor}`}>
            {resultado.titulo}
          </h2>
          <p className="mt-1 text-slate-600">
            Você encontrou{" "}
            <strong>
              {achadasFinais} de {TOTAL_POSSIVEIS}
            </strong>{" "}
            armadilhas
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pontosFinais} pts
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 space-y-1.5">
          <p className="mb-2 font-semibold text-slate-900">
            O que você aprendeu hoje:
          </p>
          <p>📧 Sempre verifique o domínio do endereço de e-mail remetente</p>
          <p>🔗 Nunca clique em links sem verificar o destino real</p>
          <p>⏰ Urgência artificial é uma tática para evitar que você pense</p>
          <p>💳 Nenhum serviço legítimo pede dados bancários por mensagem</p>
          <p>📱 Números estrangeiros não representam empresas brasileiras</p>
        </div>
        <button
          onClick={handleReiniciar}
          className="mx-auto flex items-center gap-2 rounded-xl bg-slate-800 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          Jogar novamente
        </button>
      </div>
    );
  }

  // ── JOGANDO / RESUMO ───────────────────────────────────
  const revelar = fase === "resumo";
  const armadilhasDaMensagem = coletarArmadilhas(mensagem);

  return (
    <div className="space-y-4">
      {/* Barra de progresso */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          Mensagem {rodada + 1} de {MENSAGENS.length} —{" "}
          <span className="font-medium">{mensagem.tema}</span>
        </span>
        <span className="font-semibold text-slate-900">{totalPontos} pts</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
          style={{ width: `${(rodada / MENSAGENS.length) * 100}%` }}
        />
      </div>

      {/* Contexto / instrução */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>
          {revelar
            ? "Veja o que era suspeito nesta mensagem:"
            : mensagem.contexto}
        </span>
      </div>

      {/* Mockup da mensagem */}
      {mensagem.tipo === "email" && (
        <MockupEmail
          msg={mensagem}
          encontradas={encontradas}
          revelar={revelar}
          onClicar={handleClicarTrap}
        />
      )}
      {mensagem.tipo === "whatsapp" && (
        <MockupWhatsApp
          msg={mensagem}
          encontradas={encontradas}
          revelar={revelar}
          onClicar={handleClicarTrap}
        />
      )}
      {mensagem.tipo === "sms" && (
        <MockupSMS
          msg={mensagem}
          encontradas={encontradas}
          revelar={revelar}
          onClicar={handleClicarTrap}
        />
      )}

      {/* Feedback da última armadilha clicada (só na fase jogando) */}
      {!revelar && ultimoFeedback && (
        <div
          key={ultimoFeedback.label}
          className="animate-fade-in-up rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900"
        >
          <p className="font-semibold">🚩 {ultimoFeedback.label}</p>
          <p className="mt-0.5 text-orange-800">{ultimoFeedback.explicacao}</p>
        </div>
      )}

      {/* Contador + botão de ação */}
      {!revelar ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Armadilhas encontradas:{" "}
            <strong className="text-orange-600">
              {encontradas.size}/{mensagem.totalArmadilhas}
            </strong>
          </span>
          <button
            onClick={handleRevelar}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {encontradas.size === mensagem.totalArmadilhas
              ? "Continuar →"
              : "Revelar e continuar"}
          </button>
        </div>
      ) : (
        /* Resumo da rodada */
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm space-y-2">
            <p className="font-semibold text-slate-900">
              Resultado desta mensagem:
            </p>
            {armadilhasDaMensagem.map((arm) => {
              const achada = encontradas.has(arm.id);
              return (
                <div key={arm.id} className="flex items-start gap-2">
                  {achada ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  )}
                  <div>
                    <span
                      className={
                        achada
                          ? "font-medium text-emerald-700"
                          : "font-medium text-red-700"
                      }
                    >
                      {arm.label}
                    </span>
                    {!achada && (
                      <p className="mt-0.5 text-slate-500">{arm.explicacao}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              +{encontradas.size * PONTOS_POR_ARMADILHA} pontos nesta rodada
            </span>
            <button
              onClick={handleProxima}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
            >
              {rodada < MENSAGENS.length - 1
                ? "Próxima mensagem"
                : "Ver resultado final"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
