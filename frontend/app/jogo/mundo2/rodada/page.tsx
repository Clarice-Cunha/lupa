"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Timer,
  TimerOff,
  CheckSquare,
  Square,
  Flag,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  ShieldCheck,
  Star,
} from "lucide-react";
import { INDICIOS_M2, INDICIOS_M2_POR_ID, TOTAL_TEXTOS_M2, textosM2Embaralhados } from "@/lib/jogo/m2/dados";
import { CONQUISTAS_M2_POR_ID } from "@/lib/jogo/m2/conquistas";
import type { TextoJogo } from "@/lib/jogo/types";
import { calcularResultado, type ResultadoRodada } from "@/lib/jogo/pontuacao";
import {
  carregarProgressoM2,
  registrarRodadaM2,
  resetarM2ParaNovoJogo,
  type ProgressoM2,
} from "@/lib/jogo/m2/progresso";
import { carregarConfig } from "@/lib/jogo/config";

const SEM_INDICIOS_ID = "sem_indicios";
const TEMPO_M2 = 90;

export default function PaginaRodadaM2() {
  const router = useRouter();
  const [progresso, setProgresso] = useState<ProgressoM2 | null>(null);
  const [comCronometro, setComCronometro] = useState(true);
  const [rodadaIdx, setRodadaIdx] = useState(0);
  const [mundoConcluido, setMundoConcluido] = useState(false);
  const [novasConquistas, setNovasConquistas] = useState<string[]>([]);
  const [textoEncerrado, setTextoEncerrado] = useState<TextoJogo | null>(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_M2);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [encerrada, setEncerrada] = useState(false);
  const [resultadoAtual, setResultadoAtual] = useState<ResultadoRodada | null>(null);

  useEffect(() => {
    setProgresso(carregarProgressoM2());
    setComCronometro(carregarConfig().comCronometro);
  }, []);

  const textosBaralhados = useMemo(() => textosM2Embaralhados(), []);

  const textoAtual: TextoJogo | undefined = useMemo(() => {
    if (!progresso) return undefined;
    const naoVistos = textosBaralhados.filter(
      (t) => !progresso.textosVistos.includes(t.id),
    );
    return naoVistos.length > 0 ? naoVistos[0] : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progresso?.textosVistos.length, textosBaralhados, rodadaIdx]);

  useEffect(() => {
    if (encerrada || !comCronometro) return;
    if (tempoRestante <= 0) { setEncerrada(true); return; }
    const id = setInterval(() => setTempoRestante((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [tempoRestante, encerrada, comCronometro]);

  useEffect(() => {
    if (!encerrada || !textoAtual || !progresso || resultadoAtual) return;
    const textoCapturado = textoAtual;
    const marcouSemIndicios = selecionados.has(SEM_INDICIOS_ID);
    const selecionadosFiltrados = new Set(
      [...selecionados].filter((id) => id !== SEM_INDICIOS_ID),
    );
    const eraTextoLimpo = textoCapturado.indicios_corretos.length === 0;
    const acertouLimpo = eraTextoLimpo && marcouSemIndicios;
    const resultado = calcularResultado(
      textoCapturado,
      selecionadosFiltrados,
      comCronometro ? tempoRestante : 0,
      marcouSemIndicios,
    );
    const rodadaPerfeita =
      !eraTextoLimpo &&
      resultado.erros.length === 0 &&
      resultado.perdidos.length === 0 &&
      resultado.acertos.length > 0;

    setResultadoAtual(resultado);
    setTextoEncerrado(textoCapturado);

    const { novoProgresso, mundoConcluido: concluido, novasConquistas: conquistadas } =
      registrarRodadaM2(
        progresso,
        textoCapturado.id,
        resultado.pontos,
        TOTAL_TEXTOS_M2,
        resultado.acertos.length,
        textoCapturado.indicios_corretos.length,
        acertouLimpo,
        rodadaPerfeita,
        resultado.acertos,
        textoCapturado.indicios_corretos,
      );
    setProgresso(novoProgresso);
    setMundoConcluido(concluido);
    setNovasConquistas(conquistadas);
  }, [encerrada, textoAtual, progresso, selecionados, tempoRestante, resultadoAtual]);

  function alternarIndicio(id: string) {
    if (encerrada) return;
    setSelecionados((atual) => {
      const proxima = new Set(atual);
      if (id === SEM_INDICIOS_ID) {
        if (proxima.has(id)) proxima.delete(id);
        else { proxima.clear(); proxima.add(id); }
      } else {
        proxima.delete(SEM_INDICIOS_ID);
        if (proxima.has(id)) proxima.delete(id);
        else proxima.add(id);
      }
      return proxima;
    });
  }

  function proximaRodada() {
    setTextoEncerrado(null);
    setRodadaIdx((i) => i + 1);
    setTempoRestante(TEMPO_M2);
    setSelecionados(new Set());
    setEncerrada(false);
    setResultadoAtual(null);
    setMundoConcluido(false);
    setNovasConquistas([]);
  }

  function tentarNovamente() {
    if (!progresso) return;
    const novo = resetarM2ParaNovoJogo(progresso.conquistas);
    setProgresso(novo);
    setTextoEncerrado(null);
    setRodadaIdx((i) => i + 1);
    setTempoRestante(TEMPO_M2);
    setSelecionados(new Set());
    setEncerrada(false);
    setResultadoAtual(null);
    setMundoConcluido(false);
    setNovasConquistas([]);
  }

  if (!progresso) {
    return (
      <main className="flex-1 px-4 py-16 text-center">
        <p className="text-slate-700">Carregando...</p>
      </main>
    );
  }

  // Tela de conclusão do mundo
  if (mundoConcluido && !resultadoAtual) {
    const taxa =
      progresso.indiciosTotais > 0
        ? Math.round((progresso.acertosTotal / progresso.indiciosTotais) * 100)
        : 100;
    const passou = taxa >= 75;
    return (
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${passou ? "bg-gradient-to-br from-emerald-400 to-emerald-500" : "bg-gradient-to-br from-rose-500 to-rose-600"}`}>
              {passou ? <Trophy className="h-8 w-8 text-white" /> : <AlertCircle className="h-8 w-8 text-white" />}
            </div>
            {passou ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Mundo 2 concluído!</h2>
                <p className="mt-3 text-slate-600">
                  Você acertou <strong className="text-emerald-700">{taxa}%</strong> dos indícios
                  e conquistou <strong className="text-slate-900">{progresso.pontosTotal} pontos</strong>.
                  Seu olhar para fontes ficou mais afiado!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Quase lá!</h2>
                <p className="mt-3 text-slate-600">
                  Você acertou <strong className="text-rose-600">{taxa}%</strong> dos indícios,
                  mas precisa de pelo menos <strong>75%</strong> para ganhar o badge de Analista de Fontes.
                  Tente novamente — os casos vêm em ordem diferente.
                </p>
              </>
            )}
            {progresso.conquistas.length > 0 && (
              <div className="mt-5 space-y-2 text-left">
                {progresso.conquistas.map((id) => {
                  const c = CONQUISTAS_M2_POR_ID[id];
                  if (!c) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                      <span className="text-lg">🏅</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.nome}</p>
                        <p className="text-xs text-slate-500">{c.descricao}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {passou ? (
                <Link
                  href="/jogo/mundo2"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Voltar ao Mundo 2
                </Link>
              ) : (
                <button
                  onClick={tentarNovamente}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const todosConcluidos = !textoAtual && !encerrada && !mundoConcluido;
  if (todosConcluidos) {
    return (
      <main className="flex-1 px-4 py-16 text-center">
        <p className="text-slate-700 mb-4">Você já completou todos os casos! Quer jogar novamente?</p>
        <button
          onClick={tentarNovamente}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Jogar novamente
        </button>
      </main>
    );
  }

  const textosRestantes = TOTAL_TEXTOS_M2 - progresso.textosVistos.length;

  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <CabecalhoRodadaM2
          tempoRestante={tempoRestante}
          encerrada={encerrada}
          comCronometro={comCronometro}
          rodada={progresso.textosVistos.length + (encerrada ? 0 : 1)}
          totalRodadas={TOTAL_TEXTOS_M2}
          pontosTotal={progresso.pontosTotal}
        />

        {(!encerrada ? textoAtual : textoEncerrado) && (
          <>
            <CartaoTextoM2 texto={(!encerrada ? textoAtual : textoEncerrado)!} />

            <SelecaoIndiciosM2
              selecionados={selecionados}
              alternar={alternarIndicio}
              desabilitado={encerrada}
            />

            {!encerrada ? (
              <button
                onClick={() => setEncerrada(true)}
                disabled={selecionados.size === 0}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <Flag className="h-4 w-4 transition group-hover:-rotate-12" />
                {selecionados.size === 0 ? "Marque ao menos uma opção" : "Finalizar análise"}
              </button>
            ) : resultadoAtual && textoEncerrado ? (
              <FeedbackM2
                texto={textoEncerrado}
                resultado={resultadoAtual}
                aoProxima={mundoConcluido ? undefined : proximaRodada}
                aoMundoConcluido={mundoConcluido ? () => router.push("/jogo/mundo2") : undefined}
                textosRestantes={textosRestantes}
                comCronometro={comCronometro}
                novasConquistas={novasConquistas}
              />
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

// ============================================================
// Componentes internos
// ============================================================

function CabecalhoRodadaM2({
  tempoRestante,
  encerrada,
  comCronometro,
  rodada,
  totalRodadas,
  pontosTotal,
}: {
  tempoRestante: number;
  encerrada: boolean;
  comCronometro: boolean;
  rodada: number;
  totalRodadas: number;
  pontosTotal: number;
}) {
  const porcentagem = (tempoRestante / TEMPO_M2) * 100;
  const corBarra =
    porcentagem > 50 ? "bg-emerald-500" : porcentagem > 25 ? "bg-amber-500" : "bg-red-500";

  return (
    <header className="animate-fade-in-up sticky top-[4.5rem] z-40 rounded-3xl border border-slate-200/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
            <Search className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Mundo 2 — Fontes
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Caso {rodada}/{totalRodadas}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-600" />
          <span className="font-mono text-sm font-bold tabular-nums text-amber-800">
            {pontosTotal}
          </span>
        </div>

        {comCronometro ? (
          <div
            role="timer"
            aria-live={tempoRestante <= 10 && !encerrada ? "assertive" : "off"}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5"
          >
            <Timer className="h-4 w-4 text-slate-600" />
            <span className="font-mono text-lg font-bold tabular-nums text-slate-900">
              {tempoRestante}s
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5">
            <TimerOff className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">livre</span>
          </div>
        )}
      </div>

      {comCronometro && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${corBarra}`}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      )}
    </header>
  );
}

function CartaoTextoM2({ texto }: { texto: TextoJogo }) {
  return (
    <article
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-emerald-100/30 backdrop-blur-sm sm:p-8"
      style={{ animationDelay: "0.1s" }}
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{texto.titulo}</h2>
      <p className="mt-4 leading-relaxed text-slate-700">{texto.conteudo}</p>
    </article>
  );
}

function SelecaoIndiciosM2({
  selecionados,
  alternar,
  desabilitado,
}: {
  selecionados: Set<string>;
  alternar: (id: string) => void;
  desabilitado: boolean;
}) {
  return (
    <section
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-emerald-100/30 backdrop-blur-sm"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Marque os problemas de fonte que você identificou
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Pode marcar mais de um. "Sem indícios" é exclusivo com os demais.
        </p>
      </div>

      {(() => {
        const ativo = selecionados.has(SEM_INDICIOS_ID);
        const Icone = ativo ? CheckSquare : Square;
        return (
          <button
            type="button"
            onClick={() => alternar(SEM_INDICIOS_ID)}
            disabled={desabilitado}
            aria-pressed={ativo}
            className={`mb-3 flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 ${ativo ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"}`}
          >
            <Icone className={`mt-0.5 h-5 w-5 flex-shrink-0 ${ativo ? "text-emerald-600" : "text-slate-400"}`} />
            <span className="flex-1">
              <span className="block text-sm font-medium text-slate-900">
                Sem indícios de desinformação
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                As fontes parecem confiáveis — não identifiquei problemas neste texto.
              </span>
            </span>
          </button>
        );
      })()}

      <ul className="grid gap-2 sm:grid-cols-2">
        {INDICIOS_M2.map((indicio) => {
          const ativo = selecionados.has(indicio.id);
          const Icone = ativo ? CheckSquare : Square;
          return (
            <li key={indicio.id}>
              <button
                type="button"
                onClick={() => alternar(indicio.id)}
                disabled={desabilitado}
                aria-pressed={ativo}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 ${ativo ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"}`}
              >
                <Icone className={`mt-0.5 h-5 w-5 flex-shrink-0 ${ativo ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-slate-900">
                    {indicio.nome}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {indicio.descricao}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FeedbackM2({
  texto,
  resultado,
  aoProxima,
  aoMundoConcluido,
  textosRestantes,
  comCronometro,
  novasConquistas,
}: {
  texto: TextoJogo;
  resultado: ResultadoRodada;
  aoProxima?: () => void;
  aoMundoConcluido?: () => void;
  textosRestantes: number;
  comCronometro: boolean;
  novasConquistas: string[];
}) {
  const { acertos, perdidos, erros, bonusTempo, pontos } = resultado;
  const totalCorretos = texto.indicios_corretos.length;
  const textoLimpo = totalCorretos === 0;
  const acertouLimpo = textoLimpo && erros.length === 0;

  let cor: "verde" | "amarelo" | "vermelho";
  if (textoLimpo) {
    cor = acertouLimpo ? "verde" : "vermelho";
  } else {
    const prop = acertos.length / totalCorretos;
    if (prop >= 0.7 && erros.length === 0) cor = "verde";
    else if (prop >= 0.4) cor = "amarelo";
    else cor = "vermelho";
  }

  const estilo = {
    verde: { bg: "from-emerald-500 to-emerald-600", texto: "text-white", Icone: ShieldCheck, titulo: acertouLimpo ? "Ótimo olhar crítico!" : "Muito bem!" },
    amarelo: { bg: "from-amber-400 to-amber-500", texto: "text-slate-900", Icone: AlertCircle, titulo: "Quase lá" },
    vermelho: { bg: "from-rose-600 to-rose-700", texto: "text-white", Icone: AlertCircle, titulo: "Tem o que revisar" },
  }[cor];

  const { Icone } = estilo;

  return (
    <section role="status" aria-live="polite" className="space-y-4">
      <div className={`animate-fade-in-up overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-2xl ${estilo.bg} ${estilo.texto}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-90">
              <Icone className="h-4 w-4" />
              Caso concluído
            </p>
            <h3 className="mt-1 text-2xl font-bold">{estilo.titulo}</h3>
          </div>
          <Trophy className="h-10 w-10 opacity-30" />
        </div>
        <div className="mt-6 flex items-baseline gap-2">
          <p className="text-6xl font-bold leading-none">{pontos}</p>
          <p className="text-base opacity-80">pontos</p>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <dt className="text-xs opacity-80">Acertos</dt>
            <dd className="font-mono text-base font-semibold">+{acertos.length * 10}</dd>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <dt className="text-xs opacity-80">Erros</dt>
            <dd className="font-mono text-base font-semibold">-{(erros.length + perdidos.length) * 5}</dd>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <dt className="text-xs opacity-80">Bônus tempo</dt>
            <dd className="font-mono text-base font-semibold">+{comCronometro ? bonusTempo : 0}</dd>
          </div>
        </dl>
      </div>

      <div className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
        <h4 className="mb-4 text-lg font-semibold text-slate-900">Veja onde acertou e onde errou</h4>
        <div className="space-y-3">
          {textoLimpo && acertouLimpo && (
            <LinhaFeedback tipo="acerto" titulo="Texto sem indícios relevantes" explicacao="Correto! Você identificou que as fontes deste texto são confiáveis. Saber reconhecer boas práticas é tão importante quanto detectar problemas." />
          )}
          {acertos.map((id) => (
            <LinhaFeedback key={`a-${id}`} tipo="acerto" titulo={INDICIOS_M2_POR_ID[id]?.nome ?? id} explicacao={texto.explicacoes[id] ?? ""} />
          ))}
          {perdidos.map((id) => (
            <LinhaFeedback key={`p-${id}`} tipo="perdido" titulo={INDICIOS_M2_POR_ID[id]?.nome ?? id} explicacao={texto.explicacoes[id] ?? ""} />
          ))}
          {erros.map((id) => (
            <LinhaFeedback key={`e-${id}`} tipo="erro" titulo={INDICIOS_M2_POR_ID[id]?.nome ?? id} explicacao={INDICIOS_M2_POR_ID[id]?.descricao ?? "Este indício não estava presente no texto."} />
          ))}
        </div>
      </div>

      {novasConquistas.length > 0 && (
        <div className="animate-fade-in-up space-y-2" style={{ animationDelay: "0.15s" }}>
          {novasConquistas.map((id) => {
            const c = CONQUISTAS_M2_POR_ID[id];
            if (!c) return null;
            return (
              <div key={id} className="flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200 text-xl">🏅</div>
                <div>
                  <p className="font-bold text-emerald-900">Conquista desbloqueada!</p>
                  <p className="text-sm font-semibold text-emerald-800">{c.nome}</p>
                  <p className="text-xs text-emerald-700">{c.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {textosRestantes > 1 && (
        <p className="animate-fade-in-up text-center text-sm text-slate-500" style={{ animationDelay: "0.2s" }}>
          {textosRestantes - 1 === 1 ? "Falta 1 caso." : `Faltam ${textosRestantes - 1} casos.`}
        </p>
      )}

      <div className="flex animate-fade-in-up flex-col gap-2 sm:flex-row" style={{ animationDelay: "0.2s" }}>
        {aoMundoConcluido ? (
          <button
            onClick={aoMundoConcluido}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Star className="h-4 w-4" />
            Ver resultado final
          </button>
        ) : (
          <button
            onClick={aoProxima}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Próximo caso
          </button>
        )}
        <Link
          href="/jogo/mundo2"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Voltar ao Mundo 2
        </Link>
      </div>
    </section>
  );
}

function LinhaFeedback({ tipo, titulo, explicacao }: { tipo: "acerto" | "perdido" | "erro"; titulo: string; explicacao: string }) {
  const cfg = {
    acerto: { Icone: CheckCircle2, corIcone: "text-emerald-600 bg-emerald-50", borda: "border-emerald-100", selo: "Acertou", corSelo: "bg-emerald-100 text-emerald-700" },
    perdido: { Icone: AlertCircle, corIcone: "text-amber-600 bg-amber-50", borda: "border-amber-100", selo: "Passou batido", corSelo: "bg-amber-100 text-amber-800" },
    erro: { Icone: XCircle, corIcone: "text-red-600 bg-red-50", borda: "border-red-100", selo: "Não se aplica", corSelo: "bg-red-100 text-red-700" },
  }[tipo];
  const { Icone } = cfg;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border bg-white p-4 ${cfg.borda}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.corIcone}`}>
        <Icone className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-slate-900">{titulo}</p>
          <span className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${cfg.corSelo}`}>{cfg.selo}</span>
        </div>
        {explicacao && <p className="mt-1 text-sm text-slate-600">{explicacao}</p>}
      </div>
    </div>
  );
}
