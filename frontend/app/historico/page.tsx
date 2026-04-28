"use client";

/**
 * Histórico das últimas análises feitas pelo usuário neste navegador.
 * Os dados ficam no localStorage — nada é enviado ao servidor.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  CircleAlert,
} from "lucide-react";
import {
  carregarHistorico,
  limparHistorico,
  type EntradaHistorico,
} from "@/lib/historico";

// ── Helpers de pontuação ───────────────────────────────────────────────────────
function corPontuacao(pontuacao: number) {
  if (pontuacao >= 71) return { texto: "text-emerald-700", fundo: "bg-emerald-100", borda: "border-emerald-200" };
  if (pontuacao >= 31) return { texto: "text-amber-700", fundo: "bg-amber-100", borda: "border-amber-200" };
  return { texto: "text-red-700", fundo: "bg-red-100", borda: "border-red-200" };
}

function IconePontuacao({ pontuacao }: { pontuacao: number }) {
  if (pontuacao >= 71) return <ShieldCheck className="h-4 w-4" aria-hidden="true" />;
  if (pontuacao >= 31) return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
  return <CircleAlert className="h-4 w-4" aria-hidden="true" />;
}

function formatarData(timestamp: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

// ── Componente de cartão individual ───────────────────────────────────────────
function CartaoHistorico({ entrada }: { entrada: EntradaHistorico }) {
  const [expandido, setExpandido] = useState(false);
  const { resultado } = entrada;
  const cores = corPontuacao(resultado.pontuacao);
  const ehUrl = resultado.url.startsWith("http");

  return (
    <article className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Cabeçalho do cartão */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Título e URL */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900 text-sm">
              {resultado.titulo_pagina ?? resultado.url}
            </p>
            {resultado.titulo_pagina && (
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {resultado.url}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {formatarData(entrada.timestamp)}
            </p>
          </div>

          {/* Badge de pontuação */}
          <div className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold ${cores.texto} ${cores.fundo} ${cores.borda}`}>
            <IconePontuacao pontuacao={resultado.pontuacao} />
            {resultado.pontuacao}
            <span className="text-xs font-normal">/ 100</span>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ehUrl && (
            <Link
              href={`/?url=${encodeURIComponent(resultado.url)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Analisar novamente
            </Link>
          )}
          {ehUrl && (
            <a
              href={resultado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir site
            </a>
          )}
          <button
            onClick={() => setExpandido((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            {expandido ? (
              <><ChevronUp className="h-4 w-4" /> Menos detalhes</>
            ) : (
              <><ChevronDown className="h-4 w-4" /> Ver detalhes</>
            )}
          </button>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {expandido && (
        <div className="border-t border-slate-100 px-4 py-4 sm:px-5 space-y-3">
          {resultado.resumo && (
            <p className="text-sm leading-relaxed text-slate-700 text-justify">
              {resultado.resumo}
            </p>
          )}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Justificativas
            </p>
            <ul className="space-y-1.5">
              {resultado.justificativas.map((j, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${j.impacto >= 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                  <span className="text-slate-700 text-justify">{j.criterio}: {j.resultado}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function PaginaHistorico() {
  const [historico, setHistorico] = useState<EntradaHistorico[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setHistorico(carregarHistorico());
    setCarregado(true);
  }, []);

  function limpar() {
    if (!confirm("Apagar todo o histórico?")) return;
    limparHistorico();
    setHistorico([]);
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md shadow-indigo-200">
                <History className="h-6 w-6 text-white" strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Histórico</h1>
                <p className="text-sm text-slate-500">
                  Últimas {historico.length > 0 ? historico.length : ""} análises neste navegador
                </p>
              </div>
            </div>
            {historico.length > 0 && (
              <button
                onClick={limpar}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Limpar tudo
              </button>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        {!carregado && (
          <p className="text-center text-slate-400">Carregando…</p>
        )}

        {carregado && historico.length === 0 && (
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 text-center shadow-md backdrop-blur-sm animate-fade-in-up">
            <History className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-500">Nenhuma análise ainda</p>
            <p className="mt-1 text-sm text-slate-400">
              Faça sua primeira análise na{" "}
              <Link href="/" className="font-semibold text-indigo-600 hover:underline">
                página inicial
              </Link>
              .
            </p>
          </div>
        )}

        {carregado && historico.length > 0 && (
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            {historico.map((entrada) => (
              <CartaoHistorico key={entrada.id} entrada={entrada} />
            ))}
            <p className="text-center text-xs text-slate-400 pt-2">
              O histórico fica salvo neste navegador. Limpar os dados do navegador apaga o histórico.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
