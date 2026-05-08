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
  ShieldAlert,
  ExternalLink,
  FlaskConical,
} from "lucide-react";

const JOGOS_EXTERNOS = [
  {
    nome: "Bad News Game",
    url: "https://www.getbadnews.com/pt/",
    descricao:
      "Você é o criador das fake news. Aprenda as táticas de desinformação jogando de dentro delas. Desenvolvido pela Universidade de Cambridge.",
    tag: "Estratégia",
    cor: "from-rose-500 to-orange-500",
  },
  {
    nome: "Harmony Square",
    url: "https://harmonysquare.game/en",
    descricao:
      "Gerencie a cidade de Harmony Square enquanto ela é alvo de campanhas de desinformação. Descubra como a manipulação midiática corrói comunidades. Da Universidade de Cambridge.",
    tag: "Simulação",
    cor: "from-indigo-500 to-violet-500",
  },
];

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

          {/* Agente LUPA — Aventura por mundos */}
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
              Aventura por mundos temáticos. Responda 3 perguntas por mundo com
              apenas 3 vidas — perca todas e recomece do início. Até o Mundo 5
              para conquistar.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Disponível
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 transition group-hover:gap-2">
                Jogar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Caça ao Phishing */}
          <Link
            href="/jogos/phishing"
            className="group animate-fade-in-up flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-orange-100/50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-md shadow-orange-200">
              <ShieldAlert className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Caça ao Phishing
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              Analise 5 mensagens falsas — e-mails, WhatsApp e SMS — e clique
              nas partes suspeitas. Aprenda a reconhecer golpes digitais na
              prática.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Disponível
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-orange-600 transition group-hover:gap-2">
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

        {/* Jogos externos validados pela ciência */}
        <section className="animate-fade-in-up mt-14" style={{ animationDelay: "0.4s" }}>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <FlaskConical className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Jogos validados pela ciência
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Estes jogos foram desenvolvidos por universidades e baseiam-se na{" "}
                <strong>teoria da inoculação psicológica</strong>: assim como uma vacina expõe
                você a uma versão enfraquecida do vírus, esses jogos ensinam as táticas de
                desinformação para que você as reconheça na vida real.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {JOGOS_EXTERNOS.map((jogo, i) => (
              <a
                key={jogo.nome}
                href={jogo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-fade-in-up group flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-lg shadow-indigo-100/30 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                style={{ animationDelay: `${0.45 + i * 0.05}s` }}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${jogo.cor} shadow-sm`}>
                  <Gamepad2 className="h-5 w-5 text-white" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">
                    {jogo.nome}
                  </h3>
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-indigo-500" aria-hidden="true" />
                </div>
                <span className="mt-1 inline-block w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {jogo.tag}
                </span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {jogo.descricao}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
