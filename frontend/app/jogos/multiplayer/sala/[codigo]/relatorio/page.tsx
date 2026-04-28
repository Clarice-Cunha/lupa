"use client";

/**
 * Relatório pedagógico da partida multiplayer.
 * Disponível apenas ao anfitrião após o jogo encerrar.
 * Mostra: ranking, desempenho por texto e por tipo de indício.
 */

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart2,
  Trophy,
  FileText,
  ArrowLeft,
  Download,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { INDICIOS } from "@/lib/jogo/dados";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Tipos ──────────────────────────────────────────────────────────────────────
type EstatisticaIndicio = {
  id: string;
  total_possiveis: number;
  total_acertos: number;
  taxa_acerto: number;
};

type EstatisticaTexto = {
  titulo: string;
  indicios_corretos: string[];
  taxa_acerto_turma: number;
};

type JogadorPublico = {
  id: string;
  nome: string;
  pontos: number;
};

type Relatorio = {
  codigo: string;
  total_jogadores: number;
  ranking: JogadorPublico[];
  por_indicio: EstatisticaIndicio[];
  por_texto: EstatisticaTexto[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function nomeIndicio(id: string) {
  return INDICIOS.find((i) => i.id === id)?.nome ?? id;
}

function corBarra(taxa: number) {
  if (taxa >= 0.7) return "bg-emerald-500";
  if (taxa >= 0.4) return "bg-amber-400";
  return "bg-red-500";
}

function pct(taxa: number) {
  return `${Math.round(taxa * 100)}%`;
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PaginaRelatorio() {
  const params = useParams();
  const codigo = (params.codigo as string).toUpperCase();
  const relatorioRef = useRef<HTMLDivElement>(null);

  const [dados, setDados] = useState<Relatorio | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [baixando, setBaixando] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/multiplayer/sala/${codigo}/relatorio`)
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(d.detail); });
        return r.json();
      })
      .then(setDados)
      .catch((e) => setErro(e.message ?? "Erro ao carregar relatório."));
  }, [codigo]);

  async function baixarRelatorio() {
    if (!relatorioRef.current) return;
    setBaixando(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(relatorioRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `lupa-relatorio-${codigo}.png`;
      link.href = url;
      link.click();
    } finally {
      setBaixando(false);
    }
  }

  if (erro) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600">{erro}</p>
        <Link href="/jogos" className="text-sm text-indigo-600 underline">
          Voltar para jogos
        </Link>
      </main>
    );
  }

  if (!dados) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Carregando relatório…</p>
      </main>
    );
  }

  // Indícios ordenados: piores primeiro (mais oportunidade pedagógica)
  const indiciosPiores = [...dados.por_indicio].slice(0, 6);
  const textosMaisDificeis = [...dados.por_texto].sort(
    (a, b) => a.taxa_acerto_turma - b.taxa_acerto_turma
  );

  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/jogos/multiplayer/sala/${codigo}`}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Sala
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Relatório da turma
                </h1>
                <p className="text-xs text-slate-400">
                  Sala {codigo} · {dados.total_jogadores} jogador{dados.total_jogadores !== 1 ? "es" : ""}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={baixarRelatorio}
            disabled={baixando}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
          >
            {baixando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {baixando ? "Gerando…" : "Baixar relatório"}
          </button>
        </div>

        {/* Conteúdo capturável */}
        <div ref={relatorioRef} className="space-y-5 rounded-3xl bg-white/50 p-1">

          {/* Ranking */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-900">Ranking final</h2>
            </div>
            <ol className="space-y-2">
              {dados.ranking.map((j, i) => (
                <li
                  key={j.id}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm ${
                    i === 0 ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
                  }`}
                >
                  <span className="w-5 text-center font-bold text-slate-400">{i + 1}</span>
                  <span className="flex-1 font-medium text-slate-800">{j.nome}</span>
                  <span className="font-bold text-slate-700">{j.pontos} pts</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Desempenho por tipo de indício */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-500" />
              <h2 className="font-bold text-slate-900">Desempenho por tipo de indício</h2>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              % da turma que identificou corretamente cada indício. Barras vermelhas indicam onde focar.
            </p>
            <div className="space-y-3">
              {indiciosPiores.map((e) => (
                <div key={e.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{nomeIndicio(e.id)}</span>
                    <span className={`font-bold ${e.taxa_acerto >= 0.7 ? "text-emerald-600" : e.taxa_acerto >= 0.4 ? "text-amber-600" : "text-red-600"}`}>
                      {pct(e.taxa_acerto)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${corBarra(e.taxa_acerto)}`}
                      style={{ width: pct(e.taxa_acerto) }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {indiciosPiores.length > 0 && indiciosPiores[0].taxa_acerto < 0.5 && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-800">
                <TrendingDown className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>{nomeIndicio(indiciosPiores[0].id)}</strong> foi o indício com menor taxa de acerto
                  — vale reforçar esse conceito em aula.
                </span>
              </div>
            )}
            {indiciosPiores.length > 0 && indiciosPiores[indiciosPiores.length - 1].taxa_acerto >= 0.8 && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
                <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Ótimo desempenho geral! A turma identificou bem a maioria dos indícios.</span>
              </div>
            )}
          </section>

          {/* Desempenho por texto */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-500" />
              <h2 className="font-bold text-slate-900">Desempenho por texto</h2>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Média de acerto da turma em cada texto analisado.
            </p>
            <div className="space-y-4">
              {textosMaisDificeis.map((t) => (
                <div key={t.titulo}>
                  <div className="mb-1 flex items-start justify-between gap-2 text-sm">
                    <span className="font-medium leading-snug text-slate-700">{t.titulo}</span>
                    <span className={`flex-shrink-0 font-bold ${t.taxa_acerto_turma >= 0.7 ? "text-emerald-600" : t.taxa_acerto_turma >= 0.4 ? "text-amber-600" : "text-red-600"}`}>
                      {pct(t.taxa_acerto_turma)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${corBarra(t.taxa_acerto_turma)}`}
                      style={{ width: pct(t.taxa_acerto_turma) }}
                    />
                  </div>
                  {t.indicios_corretos.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Indícios: {t.indicios_corretos.map(nomeIndicio).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Rodapé do relatório */}
          <p className="text-center text-xs text-slate-400">
            Relatório gerado pelo LUPA · lupa.vercel.app
          </p>
        </div>
      </div>
    </main>
  );
}
