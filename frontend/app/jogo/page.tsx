"use client";

/**
 * Tela inicial do "Detetive LUPA" — jogo educativo de detecção
 * de desinformação.
 *
 * Mostra o que é, como funciona, o progresso salvo e um botão
 * grande para começar ou continuar.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Gamepad2,
  Timer,
  TimerOff,
  Target,
  Award,
  PlayCircle,
  BookOpen,
  Sparkles,
  Trophy,
  RotateCcw,
} from "lucide-react";
import {
  carregarProgresso,
  resetarParaNovoJogo,
  type ProgressoJogo,
} from "@/lib/jogo/progresso";
import { carregarConfig, salvarConfig, type ConfigJogo } from "@/lib/jogo/config";
import { ROTULOS_NIVEL } from "@/lib/jogo/types";
import { CONQUISTAS } from "@/lib/jogo/conquistas";

export default function PaginaJogo() {
  const [progresso, setProgresso] = useState<ProgressoJogo | null>(null);
  const [config, setConfig] = useState<ConfigJogo>({ comCronometro: true });

  useEffect(() => {
    setProgresso(carregarProgresso());
    setConfig(carregarConfig());
  }, []);

  const jaJogou = progresso && progresso.rodadasJogadas > 0;

  function recomecar() {
    const novo = resetarParaNovoJogo(progresso?.conquistas ?? []);
    setProgresso(novo);
  }

  function alternarCronometro() {
    const nova = { ...config, comCronometro: !config.comCronometro };
    salvarConfig(nova);
    setConfig(nova);
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Gamepad2 className="h-8 w-8 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Detetive LUPA
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Jogo educativo de detecção de desinformação
          </p>
        </header>

        {/* Descrição */}
        <section
          className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Como funciona
            </h2>
          </div>
          <p className="leading-relaxed text-slate-700">
            A cada rodada, você lê um texto curto e marca quais{" "}
            <strong>indícios de desinformação</strong> ele contém — como
            linguagem sensacionalista, falta de fontes, contradições. Você
            ganha pontos por acertar, perde por errar, e tem um bônus pelo
            tempo que sobrar. O jogo tem três níveis de dificuldade.
          </p>
          <p className="mt-3 text-sm italic text-slate-500">
            Importante: o jogo é um exercício pedagógico. Os &quot;indícios
            corretos&quot; são sinais comuns de desinformação, não garantia
            absoluta de que um texto é falso.
          </p>
        </section>

        {/* Cartões informativos — o que esperar */}
        <section
          className="mt-5 grid gap-4 sm:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CartaoInfo
            icone={<Timer className="h-5 w-5 text-amber-600" />}
            corFundo="bg-amber-100"
            titulo="60 segundos"
            descricao="Tempo por texto. Quanto mais rápido, mais bônus."
          />
          <CartaoInfo
            icone={<Target className="h-5 w-5 text-emerald-700" />}
            corFundo="bg-emerald-100"
            titulo="3 níveis"
            descricao="Fácil, Médio e Difícil. Avance acertando 70%."
          />
          <CartaoInfo
            icone={<Award className="h-5 w-5 text-rose-600" />}
            corFundo="bg-rose-100"
            titulo="Conquistas"
            descricao="Ganhe badges e um certificado em PDF."
          />
        </section>

        {/* Progresso salvo */}
        {jaJogou && progresso && (
          <section
            className="mt-5 animate-fade-in-up rounded-3xl border border-indigo-200/60 bg-indigo-50/50 p-5"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <Trophy className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Seu progresso
                  </p>
                  <p className="text-xs text-slate-600">
                    Nível {ROTULOS_NIVEL[progresso.nivelAtual]} · {progresso.rodadasJogadas} rodada{progresso.rodadasJogadas !== 1 ? "s" : ""} · {progresso.pontosTotal} pontos
                  </p>
                </div>
              </div>
              <button
                onClick={recomecar}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Recomeçar
              </button>
            </div>
          </section>
        )}

        {/* Conquistas */}
        {progresso && (
          <section
            className="mt-5 animate-fade-in-up"
            style={{ animationDelay: "0.26s" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                <Award className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Conquistas</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CONQUISTAS.map((c) => {
                const desbloqueada = progresso.conquistas?.includes(c.id) ?? false;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                      desbloqueada
                        ? "border-indigo-200 bg-indigo-50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl ${
                        desbloqueada ? "bg-indigo-100" : "bg-slate-200"
                      }`}
                    >
                      {desbloqueada ? "🏅" : "🔒"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`truncate text-sm font-semibold ${desbloqueada ? "text-slate-900" : "text-slate-400"}`}>
                          {c.nome}
                        </p>
                      </div>
                      <p className={`mt-0.5 text-xs leading-tight ${desbloqueada ? "text-slate-600" : "text-slate-400"}`}>
                        {desbloqueada ? c.descricao : "Ainda não desbloqueada"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Opção de cronômetro */}
        <div
          className="mt-5 animate-fade-in-up"
          style={{ animationDelay: "0.28s" }}
        >
          <button
            onClick={alternarCronometro}
            aria-pressed={config.comCronometro}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
              config.comCronometro
                ? "border-indigo-300 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.comCronometro ? "bg-indigo-100" : "bg-slate-100"}`}>
                {config.comCronometro
                  ? <Timer className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  : <TimerOff className="h-5 w-5 text-slate-500" aria-hidden="true" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {config.comCronometro ? "Com cronômetro" : "Sem cronômetro"}
                </p>
                <p className="text-xs text-slate-500">
                  {config.comCronometro
                    ? "Bônus de pontos pelo tempo restante."
                    : "Sem limite de tempo. Bônus de tempo desativado."}
                </p>
              </div>
            </div>
            {/* Toggle visual */}
            <div className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${config.comCronometro ? "bg-indigo-500" : "bg-slate-300"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${config.comCronometro ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>
        </div>

        {/* Botão principal */}
        <div
          className="mt-5 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/jogo/rodada"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98]"
          >
            <PlayCircle className="h-5 w-5 transition group-hover:scale-110" aria-hidden="true" />
            {jaJogou ? "Continuar jogando" : "Iniciar Jogo Solo"}
          </Link>
          <p className="mt-3 text-center text-xs text-slate-500">
            Nada é enviado para o servidor. Seu progresso fica no seu navegador.
          </p>
        </div>

        {/* Link para revisar os tipos de indícios antes de jogar */}
        <div
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" aria-hidden="true" />
            <p>
              Primeiro dia? Dê uma olhada na página{" "}
              <Link
                href="/dicas-de-checagem"
                className="font-semibold underline underline-offset-2 hover:text-amber-950"
              >
                Dicas de Checagem
              </Link>{" "}
              para conhecer os sinais comuns de desinformação antes de começar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

type CartaoInfoProps = {
  icone: React.ReactNode;
  corFundo: string;
  titulo: string;
  descricao: string;
};

function CartaoInfo({ icone, corFundo, titulo, descricao }: CartaoInfoProps) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${corFundo}`}>
        {icone}
      </div>
      <p className="font-semibold text-slate-900">{titulo}</p>
      <p className="mt-1 text-sm text-slate-600">{descricao}</p>
    </div>
  );
}
