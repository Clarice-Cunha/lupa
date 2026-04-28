"use client";

/**
 * Menu de jogos do LUPA.
 *
 * A partir daqui o usuário escolhe entre:
 *   - Detetive LUPA Solo — jogo individual que já existe (/jogo)
 *   - Detetive LUPA Multiplayer — modo estilo Kahoot (/jogos/multiplayer)
 */

import Link from "next/link";
import {
  Gamepad2,
  User,
  Users,
  ArrowRight,
  Sparkles,
  Swords,
} from "lucide-react";

export default function PaginaMenuJogos() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Gamepad2 className="h-8 w-8 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Jogos
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Escolha como quer jogar o Detetive LUPA
          </p>
        </header>

        {/* Cartões dos jogos */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Solo */}
          <Link
            href="/jogo"
            className="group animate-fade-in-up flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-200">
              <User className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Detetive LUPA Solo
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              Jogue sozinho no seu ritmo. Três níveis de dificuldade,
              conquistas para desbloquear e progresso salvo no seu navegador.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Disponível
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition group-hover:gap-2">
                Jogar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Multiplayer */}
          <div
            className="animate-fade-in-up flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-rose-100/50 backdrop-blur-sm"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-500 shadow-md shadow-rose-200">
              <Users className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Detetive LUPA Multiplayer
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              Modo estilo Kahoot: um professor ou jogador cria uma sala,
              os outros entram com um código e disputam pontos em tempo real.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Disponível
              </span>
              <div className="flex gap-3 text-sm font-semibold">
                <Link
                  href="/jogos/multiplayer/entrar"
                  className="text-slate-600 hover:text-slate-900 transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/jogos/multiplayer/criar"
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
                >
                  Criar sala
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Agente LUPA — Aventura 2D */}
          <Link
            href="/jogos/aventura"
            className="group animate-fade-in-up flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-amber-100/50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md shadow-amber-200">
              <Swords className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Agente LUPA
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              Aventura 2D estilo plataforma: um personagem perseguido por
              inimigos de fake news. Responda certo para derrotá-los e avançar
              de mundo!
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Mundo 1 disponível
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 transition group-hover:gap-2">
                Jogar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>

        {/* Nota pedagógica */}
        <p
          className="mt-8 text-center text-sm text-slate-500 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Todos os jogos usam os mesmos textos do banco educativo do LUPA.
        </p>
      </div>
    </main>
  );
}
