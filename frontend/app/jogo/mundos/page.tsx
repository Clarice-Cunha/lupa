"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Globe, Lock, BookOpen, Search, ArrowRight, Trophy } from "lucide-react";
import { carregarProgresso } from "@/lib/jogo/progresso";
import { carregarProgressoM2 } from "@/lib/jogo/m2/progresso";
import { TOTAL_TEXTOS_M2 } from "@/lib/jogo/m2/dados";

type CartaoMundo = {
  numero: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  cor: string;
  corBg: string;
  corBorda: string;
  Icone: React.ElementType;
  href: string;
  disponivel: boolean;
  progresso: number;
  total: number;
  pontos: number;
  conquistas: string[];
};

export default function PaginaMundos() {
  const [mundos, setMundos] = useState<CartaoMundo[]>([]);

  useEffect(() => {
    const p1 = carregarProgresso();
    const p2 = carregarProgressoM2();

    const totalM1 =
      (p1.textosVistosPorNivel.facil.length ?? 0) +
      (p1.textosVistosPorNivel.medio.length ?? 0) +
      (p1.textosVistosPorNivel.dificil.length ?? 0);

    setMundos([
      {
        numero: 1,
        titulo: "Análise de Texto",
        subtitulo: "Mundo 1",
        descricao:
          "Detecte desinformação em textos do cotidiano. Identifique linguagem sensacionalista, promessas exageradas e outros 7 tipos de indícios.",
        cor: "text-indigo-700",
        corBg: "bg-indigo-600",
        corBorda: "border-indigo-200",
        Icone: BookOpen,
        href: "/jogo",
        disponivel: true,
        progresso: totalM1,
        total: 34,
        pontos: p1.pontosTotal,
        conquistas: p1.conquistas,
      },
      {
        numero: 2,
        titulo: "Fontes e Evidências",
        subtitulo: "Mundo 2",
        descricao:
          "Aprenda a avaliar a credibilidade das fontes. Identifique conflitos de interesse, citações fora de contexto e correlações falsas em 8 casos reais.",
        cor: "text-emerald-700",
        corBg: "bg-emerald-600",
        corBorda: "border-emerald-200",
        Icone: Search,
        href: "/jogo/mundo2",
        disponivel: true,
        progresso: p2.textosVistos.length,
        total: TOTAL_TEXTOS_M2,
        pontos: p2.pontosTotal,
        conquistas: p2.conquistas,
      },
      {
        numero: 3,
        titulo: "Manipulação de Imagem",
        subtitulo: "Mundo 3",
        descricao: "Identifique imagens com legenda enganosa, fotos antigas reusadas como atuais e sinais de edição digital.",
        cor: "text-violet-700",
        corBg: "bg-violet-600",
        corBorda: "border-violet-200",
        Icone: Globe,
        href: "#",
        disponivel: false,
        progresso: 0,
        total: 0,
        pontos: 0,
        conquistas: [],
      },
      {
        numero: 4,
        titulo: "Deepfake e Vídeo",
        subtitulo: "Mundo 4",
        descricao: "Detecte vídeos manipulados, áudios sintéticos e cortes seletivos usados para distorcer declarações reais.",
        cor: "text-rose-700",
        corBg: "bg-rose-600",
        corBorda: "border-rose-200",
        Icone: Globe,
        href: "#",
        disponivel: false,
        progresso: 0,
        total: 0,
        pontos: 0,
        conquistas: [],
      },
      {
        numero: 5,
        titulo: "Chefe Final",
        subtitulo: "Mundo 5 — Campanha Coordenada",
        descricao: "Enfrente o desafio final: identificar todos os tipos de desinformação em uma campanha coordenada completa.",
        cor: "text-amber-700",
        corBg: "bg-amber-500",
        corBorda: "border-amber-200",
        Icone: Trophy,
        href: "#",
        disponivel: false,
        progresso: 0,
        total: 0,
        pontos: 0,
        conquistas: [],
      },
    ]);
  }, []);

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
            <Globe className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Agente LUPA
          </h1>
          <p className="mt-2 text-slate-500">
            Escolha um mundo para jogar. Cada mundo ensina um aspecto diferente
            do combate à desinformação.
          </p>
        </header>

        <div className="space-y-4">
          {mundos.map((mundo) => (
            <CartaoMundo key={mundo.numero} mundo={mundo} />
          ))}
        </div>
      </div>
    </main>
  );
}

function CartaoMundo({ mundo }: { mundo: CartaoMundo }) {
  const { Icone } = mundo;
  const porcentagem =
    mundo.total > 0 ? Math.round((mundo.progresso / mundo.total) * 100) : 0;
  const concluido = mundo.progresso >= mundo.total && mundo.total > 0;

  if (!mundo.disponivel) {
    return (
      <div className={`rounded-3xl border-2 ${mundo.corBorda} bg-slate-50 p-5 opacity-50`}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-200">
            <Lock className="h-6 w-6 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {mundo.subtitulo} — Em breve
            </p>
            <h2 className="text-lg font-bold text-slate-500">{mundo.titulo}</h2>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">{mundo.descricao}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={mundo.href}
      className={`group block rounded-3xl border-2 ${mundo.corBorda} bg-white p-5 shadow-md transition hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${mundo.corBg} shadow`}
        >
          <Icone className="h-6 w-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${mundo.cor}`}>
                {mundo.subtitulo}
              </p>
              <h2 className="text-lg font-bold text-slate-900">{mundo.titulo}</h2>
            </div>
            <ArrowRight
              className={`h-5 w-5 shrink-0 ${mundo.cor} opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100`}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            {mundo.descricao}
          </p>

          {/* Barra de progresso */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">
                {mundo.progresso}/{mundo.total} casos
                {concluido && (
                  <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Concluído
                  </span>
                )}
              </span>
              {mundo.pontos > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                  <Trophy className="h-3 w-3" />
                  {mundo.pontos} pts
                </span>
              )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${mundo.corBg}`}
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>

          {/* Conquistas */}
          {mundo.conquistas.length > 0 && (
            <div className="mt-2 flex gap-1.5">
              {mundo.conquistas.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200"
                >
                  🏅
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
