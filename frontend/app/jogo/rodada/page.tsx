"use client";

/**
 * Tela de rodada do Detetive LUPA.
 *
 * Mecânica: exibir um texto, contar 60 segundos, deixar o jogador
 * marcar quais indícios de desinformação identifica, encerrar a
 * rodada (por tempo ou botão) e mostrar feedback detalhado com
 * pontuação (PRD §4.3 e §4.4).
 */

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
  Gamepad2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  ShieldCheck,
  Star,
} from "lucide-react";
import { INDICIOS, INDICIOS_POR_ID, textosDoNivel } from "@/lib/jogo/dados";
import {
  ROTULOS_NIVEL,
  TEMPO_POR_NIVEL,
  type NivelDificuldade,
  type TextoJogo,
} from "@/lib/jogo/types";
import { calcularResultado, type ResultadoRodada } from "@/lib/jogo/pontuacao";
import {
  carregarProgresso,
  registrarRodada,
  resetarNivel,
  resetarParaNovoJogo,
  type ProgressoJogo,
} from "@/lib/jogo/progresso";
import { carregarConfig } from "@/lib/jogo/config";
import { CONQUISTAS, CONQUISTAS_POR_ID } from "@/lib/jogo/conquistas";

const SEM_INDICIOS_ID = "sem_indicios";

// Tipo que guarda o "retrato" do resultado final do nível,
// salvo antes de qualquer reset para não perder os dados.
type ResumoNivel = {
  nivel: NivelDificuldade;
  porcentagem: number;
  passou: boolean;
  pontosTotal: number;
};

export default function PaginaRodada() {
  const router = useRouter();
  const [progresso, setProgresso] = useState<ProgressoJogo | null>(null);
  const [comCronometro, setComCronometro] = useState(true);
  const [rodadaIdx, setRodadaIdx] = useState(0);
  const [avancouNivel, setAvancouNivel] = useState(false);
  const [novasConquistas, setNovasConquistas] = useState<string[]>([]);
  const [resumoNivel, setResumoNivel] = useState<ResumoNivel | null>(null);
  const [textoEncerrado, setTextoEncerrado] = useState<TextoJogo | null>(null);
  const [nivelEncerrado, setNivelEncerrado] = useState<NivelDificuldade>("facil");

  useEffect(() => {
    setProgresso(carregarProgresso());
    setComCronometro(carregarConfig().comCronometro);
  }, []);

  const nivel: NivelDificuldade = progresso?.nivelAtual ?? "facil";
  const tempoInicial = TEMPO_POR_NIVEL[nivel];

  const textosNivel = useMemo(() => textosDoNivel(nivel), [nivel]);
  const totalTextosNoNivel = textosNivel.length;

  const textoAtual: TextoJogo | undefined = useMemo(() => {
    if (!progresso) return undefined;
    const vistos = progresso.textosVistosPorNivel[nivel];
    const naoVistos = textosNivel.filter((t) => !vistos.includes(t.id));
    return naoVistos.length > 0 ? naoVistos[0] : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progresso?.nivelAtual, textosNivel, rodadaIdx]);

  const [tempoRestante, setTempoRestante] = useState(tempoInicial);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [encerrada, setEncerrada] = useState(false);
  const [resultadoAtual, setResultadoAtual] = useState<ResultadoRodada | null>(
    null,
  );

  useEffect(() => {
    setTempoRestante(TEMPO_POR_NIVEL[nivel]);
  }, [nivel]);

  useEffect(() => {
    if (encerrada || !comCronometro) return;
    if (tempoRestante <= 0) {
      setEncerrada(true);
      return;
    }
    const id = setInterval(() => {
      setTempoRestante((t) => t - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [tempoRestante, encerrada, comCronometro]);

  // Quando a rodada encerra, captura texto e nível ANTES de salvar o
  // progresso — assim o feedback sempre mostra os dados certos, mesmo
  // que o nível avance e `textoAtual`/`nivel` mudem logo em seguida.
  useEffect(() => {
    if (!encerrada || !textoAtual || !progresso || resultadoAtual) return;
    const textoCapturado = textoAtual;
    const nivelCapturado = nivel;
    const totalCapturado = totalTextosNoNivel;
    // Remove "sem_indicios" antes de calcular — é opção de UI, não do gabarito.
    const marcouSemIndicios = selecionados.has(SEM_INDICIOS_ID);
    const selecionadosSemFiltro = new Set(
      [...selecionados].filter((id) => id !== SEM_INDICIOS_ID),
    );
    const eraTextoLimpo = textoCapturado.indicios_corretos.length === 0;
    const acertouLimpo = eraTextoLimpo && marcouSemIndicios;
    // Sem cronômetro: bônus de tempo é zero.
    const resultado = calcularResultado(
      textoCapturado,
      selecionadosSemFiltro,
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
    setNivelEncerrado(nivelCapturado);
    const { novoProgresso, avancouNivel: avancou, novasConquistas: conquistadas } = registrarRodada(
      progresso,
      textoCapturado.id,
      resultado.pontos,
      totalCapturado,
      resultado.acertos.length,
      textoCapturado.indicios_corretos.length,
      acertouLimpo,
      rodadaPerfeita,
    );
    setProgresso(novoProgresso);
    setAvancouNivel(avancou);
    setNovasConquistas(conquistadas);
  }, [encerrada, textoAtual, progresso, selecionados, tempoRestante, resultadoAtual, totalTextosNoNivel, nivel]);

  function alternarIndicio(id: string) {
    if (encerrada) return;
    setSelecionados((atual) => {
      const proxima = new Set(atual);
      if (id === SEM_INDICIOS_ID) {
        // "Sem indícios" é exclusivo: selecionar apaga todos os outros.
        if (proxima.has(id)) proxima.delete(id);
        else { proxima.clear(); proxima.add(id); }
      } else {
        // Qualquer outro indício desmarca "sem indícios" automaticamente.
        proxima.delete(SEM_INDICIOS_ID);
        if (proxima.has(id)) proxima.delete(id);
        else proxima.add(id);
      }
      return proxima;
    });
  }

  function finalizar() {
    setEncerrada(true);
  }

  function reiniciar() {
    if (!progresso) return;
    // Usa nivelEncerrado (o nível que foi jogado nesta rodada), não
    // `nivel` — que pode já ter avançado se o jogador desbloqueou o próximo.
    const nivelJogado = nivelEncerrado;
    const totalNivelJogado = textosDoNivel(nivelJogado).length;
    const vistos = progresso.textosVistosPorNivel[nivelJogado];
    if (vistos.length >= totalNivelJogado) {
      const totInd = progresso.indiciosTotaisPorNivel[nivelJogado];
      const totAc = progresso.acertosPorNivel[nivelJogado];
      const taxa = totInd > 0 ? totAc / totInd : 1;
      setResumoNivel({
        nivel: nivelJogado,
        porcentagem: Math.round(taxa * 100),
        passou: taxa >= 0.75,
        pontosTotal: progresso.pontosTotal,
      });
      return;
    }
    setTextoEncerrado(null);
    setRodadaIdx((i) => i + 1);
    setTempoRestante(TEMPO_POR_NIVEL[nivel]);
    setSelecionados(new Set());
    setEncerrada(false);
    setResultadoAtual(null);
    setAvancouNivel(false);
    setNovasConquistas([]);
  }

  function concluirJogo() {
    resetarParaNovoJogo(progresso?.conquistas ?? []);
    router.push("/jogo");
  }

  function continuarProximoNivel() {
    setResumoNivel(null);
    setTextoEncerrado(null);
    setRodadaIdx((i) => i + 1);
    setTempoRestante(TEMPO_POR_NIVEL[progresso?.nivelAtual ?? "medio"]);
    setSelecionados(new Set());
    setEncerrada(false);
    setResultadoAtual(null);
    setAvancouNivel(false);
    setNovasConquistas([]);
  }

  function tentarNivelNovamente() {
    if (!progresso) return;
    const nivelReset = resumoNivel!.nivel;
    setProgresso(resetarNivel(progresso, nivelReset));
    setResumoNivel(null);
    setTextoEncerrado(null);
    setRodadaIdx((i) => i + 1);
    setTempoRestante(TEMPO_POR_NIVEL[nivelReset]);
    setSelecionados(new Set());
    setEncerrada(false);
    setResultadoAtual(null);
    setAvancouNivel(false);
    setNovasConquistas([]);
  }

  if (!progresso) {
    return (
      <main className="flex-1 px-4 py-16 text-center">
        <p className="text-slate-700">Carregando...</p>
      </main>
    );
  }

  // Guarda contra estado inválido: jogador entrou na rodada com todos
  // os textos de todos os níveis já vistos (jogo concluído anteriormente).
  const todosNiveisCompletos =
    nivel === "dificil" &&
    !textoAtual &&
    !encerrada &&
    !resumoNivel;
  if (todosNiveisCompletos) {
    return (
      <main className="flex-1 px-4 py-16 text-center">
        <p className="text-slate-700 mb-4">
          Você já completou todos os níveis! Que tal jogar de novo?
        </p>
        <button
          onClick={concluirJogo}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
        >
          Recomeçar do início
        </button>
      </main>
    );
  }

  if (resumoNivel) {
    const { passou, porcentagem } = resumoNivel;
    const jogoCompleto = resumoNivel.nivel === "dificil";

    return (
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                passou
                  ? "bg-gradient-to-br from-amber-400 to-amber-500"
                  : "bg-gradient-to-br from-rose-500 to-rose-600"
              }`}
            >
              {passou ? (
                <Trophy className="h-8 w-8 text-white" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-8 w-8 text-white" aria-hidden="true" />
              )}
            </div>

            {jogoCompleto && passou ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900">
                  Parabéns, Detetive!
                </h2>
                <p className="mt-3 text-slate-600">
                  Você completou todos os níveis do Detetive LUPA com{" "}
                  <strong className="text-slate-900">
                    {progresso.pontosTotal} pontos
                  </strong>
                  . Continue praticando seu olhar crítico no dia a dia.
                </p>

                {/* Conquistas ganhas */}
                {progresso.conquistas.length > 0 && (
                  <div className="mt-5 text-left">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Suas conquistas:
                    </p>
                    <div className="space-y-2">
                      {CONQUISTAS.map((c) => {
                        const ganhou = progresso.conquistas.includes(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                              ganhou
                                ? "border-indigo-200 bg-indigo-50"
                                : "border-slate-100 bg-slate-50 opacity-40 grayscale"
                            }`}
                          >
                            <span className="text-lg">{ganhou ? "🏅" : "🔒"}</span>
                            <span className="text-sm font-medium text-slate-900">
                              {c.nome}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : passou ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900">
                  Nível {ROTULOS_NIVEL[resumoNivel.nivel]} completo!
                </h2>
                <p className="mt-3 text-slate-600">
                  Você acertou{" "}
                  <strong className="text-emerald-700">{porcentagem}%</strong>{" "}
                  dos indícios e desbloqueou o próximo nível. Pontuação total:{" "}
                  <strong className="text-slate-900">
                    {progresso.pontosTotal} pontos
                  </strong>
                  .
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">
                  Nível {ROTULOS_NIVEL[resumoNivel.nivel]} — quase!
                </h2>
                <p className="mt-3 text-slate-600">
                  Você acertou{" "}
                  <strong className="text-rose-600">{porcentagem}%</strong> dos
                  indícios, mas precisa de pelo menos{" "}
                  <strong>75%</strong> para avançar ao próximo nível.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Não desanime! Revise as dicas de checagem e tente novamente.
                  A cada tentativa, seu olhar fica mais afiado.
                </p>
              </>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {jogoCompleto && passou ? (
                <button
                  onClick={concluirJogo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                >
                  Voltar ao início
                </button>
              ) : passou ? (
                <button
                  onClick={continuarProximoNivel}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                >
                  Ir para o nível {ROTULOS_NIVEL[progresso.nivelAtual]}
                </button>
              ) : (
                <button
                  onClick={tentarNivelNovamente}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalNivelEncerrado = textosDoNivel(nivelEncerrado).length;
  const textosRestantes =
    totalNivelEncerrado - progresso.textosVistosPorNivel[nivelEncerrado].length;

  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <CabecalhoRodada
          nivel={nivel}
          tempoRestante={tempoRestante}
          tempoInicial={tempoInicial}
          encerrada={encerrada}
          comCronometro={comCronometro}
          rodada={progresso.textosVistosPorNivel[nivel].length + (encerrada ? 0 : 1)}
          totalRodadas={totalTextosNoNivel}
          pontosTotal={progresso.pontosTotal}
        />

        {/* Enquanto não encerrada: mostra o texto atual. Após encerrar:
            usa textoEncerrado (capturado no momento do encerramento) para
            que o feedback não mude caso o nível avance. */}
        {(!encerrada ? textoAtual : textoEncerrado) && (
          <>
            <CartaoTexto texto={(!encerrada ? textoAtual : textoEncerrado)!} />

            <SelecaoIndicios
              selecionados={selecionados}
              alternar={alternarIndicio}
              desabilitado={encerrada}
            />

            {!encerrada ? (
              <button
                onClick={finalizar}
                disabled={selecionados.size === 0}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
              >
                <Flag className="h-4 w-4 transition group-hover:-rotate-12" aria-hidden="true" />
                {selecionados.size === 0 ? "Marque ao menos uma opção" : "Finalizar análise"}
              </button>
            ) : resultadoAtual && textoEncerrado ? (
              <Feedback
                texto={textoEncerrado}
                resultado={resultadoAtual}
                aoReiniciar={reiniciar}
                avancouNivel={avancouNivel}
                novoNivel={progresso.nivelAtual}
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

type CabecalhoProps = {
  nivel: NivelDificuldade;
  tempoRestante: number;
  tempoInicial: number;
  encerrada: boolean;
  comCronometro: boolean;
  rodada: number;
  totalRodadas: number;
  pontosTotal: number;
};

function CabecalhoRodada({
  nivel,
  tempoRestante,
  tempoInicial,
  encerrada,
  comCronometro,
  rodada,
  totalRodadas,
  pontosTotal,
}: CabecalhoProps) {
  const porcentagem = (tempoRestante / tempoInicial) * 100;
  const corBarra =
    porcentagem > 50
      ? "bg-emerald-500"
      : porcentagem > 25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <header className="animate-fade-in-up sticky top-[4.5rem] z-40 rounded-3xl border border-slate-200/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
            <Gamepad2 className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Nível {ROTULOS_NIVEL[nivel]}
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Rodada {rodada}/{totalRodadas}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-600" aria-hidden="true" />
          <span className="font-mono text-sm font-bold tabular-nums text-amber-800">
            {pontosTotal}
          </span>
        </div>

        {comCronometro ? (
          <div
            role="timer"
            aria-live={tempoRestante <= 10 && !encerrada ? "assertive" : "off"}
            aria-label={`Tempo restante: ${tempoRestante} segundos`}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5"
          >
            <Timer className="h-4 w-4 text-slate-600" aria-hidden="true" />
            <span className="font-mono text-lg font-bold tabular-nums text-slate-900">
              {tempoRestante}s
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5">
            <TimerOff className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-400">livre</span>
          </div>
        )}
      </div>

      {/* Barra de progresso do tempo — só aparece com cronômetro */}
      {comCronometro && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${corBarra}`}
            style={{ width: `${porcentagem}%` }}
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  );
}

function CartaoTexto({ texto }: { texto: TextoJogo }) {
  return (
    <article
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-sm sm:p-8"
      style={{ animationDelay: "0.1s" }}
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {texto.titulo}
      </h2>
      <p className="mt-4 leading-relaxed text-slate-700">{texto.conteudo}</p>
    </article>
  );
}

type SelecaoProps = {
  selecionados: Set<string>;
  alternar: (id: string) => void;
  desabilitado: boolean;
};

function SelecaoIndicios({
  selecionados,
  alternar,
  desabilitado,
}: SelecaoProps) {
  return (
    <section
      aria-label="Marque os indícios de desinformação presentes no texto"
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-sm"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Marque os indícios que você identificou
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Pode marcar mais de um. "Sem indícios" é exclusivo com os demais.
        </p>
      </div>

      {/* Opção especial "Sem indícios" — mutuamente exclusiva */}
      {(() => {
        const ativo = selecionados.has(SEM_INDICIOS_ID);
        const Icone = ativo ? CheckSquare : Square;
        return (
          <button
            type="button"
            onClick={() => alternar(SEM_INDICIOS_ID)}
            disabled={desabilitado}
            aria-pressed={ativo}
            className={`mb-3 flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              ativo
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"
            }`}
          >
            <Icone
              className={`mt-0.5 h-5 w-5 flex-shrink-0 ${ativo ? "text-emerald-600" : "text-slate-400"}`}
              aria-hidden="true"
            />
            <span className="flex-1">
              <span className="block text-sm font-medium text-slate-900">
                Sem indícios de desinformação
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                O texto parece confiável — não identifiquei sinais de desinformação.
                Selecionar isso desmarca as outras opções.
              </span>
            </span>
          </button>
        );
      })()}

      <ul className="grid gap-2 sm:grid-cols-2">
        {INDICIOS.map((indicio) => {
          const ativo = selecionados.has(indicio.id);
          const Icone = ativo ? CheckSquare : Square;
          return (
            <li key={indicio.id}>
              <button
                type="button"
                onClick={() => alternar(indicio.id)}
                disabled={desabilitado}
                aria-pressed={ativo}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                  ativo
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30"
                }`}
              >
                <Icone
                  className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                    ativo ? "text-indigo-600" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
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

type FeedbackProps = {
  texto: TextoJogo;
  resultado: ResultadoRodada;
  aoReiniciar: () => void;
  avancouNivel: boolean;
  novoNivel: NivelDificuldade;
  textosRestantes: number;
  comCronometro: boolean;
  novasConquistas: string[];
};

function Feedback({
  texto,
  resultado,
  aoReiniciar,
  avancouNivel,
  novoNivel,
  textosRestantes,
  comCronometro,
  novasConquistas,
}: FeedbackProps) {
  const { acertos, perdidos, erros, bonusTempo, pontos } = resultado;
  const totalCorretos = texto.indicios_corretos.length;
  const textoLimpo = totalCorretos === 0;
  const acertouLimpo = textoLimpo && erros.length === 0;

  // Escolhe cor e ícone do cartão principal de acordo com o resultado.
  let cor: "verde" | "amarelo" | "vermelho";
  if (textoLimpo) {
    cor = acertouLimpo ? "verde" : "vermelho";
  } else {
    const proporcaoAcerto = acertos.length / totalCorretos;
    if (proporcaoAcerto >= 0.7 && erros.length === 0) cor = "verde";
    else if (proporcaoAcerto >= 0.4) cor = "amarelo";
    else cor = "vermelho";
  }

  const estilo = {
    verde: {
      bg: "from-emerald-500 to-emerald-600",
      texto: "text-white",
      Icone: ShieldCheck,
      titulo: acertouLimpo ? "Ótimo olhar crítico!" : "Muito bem!",
    },
    amarelo: {
      bg: "from-amber-400 to-amber-500",
      texto: "text-slate-900",
      Icone: AlertCircle,
      titulo: "Quase lá",
    },
    vermelho: {
      bg: "from-rose-600 to-rose-700",
      texto: "text-white",
      Icone: AlertCircle,
      titulo: "Tem o que revisar",
    },
  }[cor];

  const { Icone } = estilo;

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Resultado da rodada"
      className="space-y-4"
    >
      {/* Cartão principal com pontuação */}
      <div
        className={`animate-fade-in-up overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-2xl ${estilo.bg} ${estilo.texto}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-90">
              <Icone className="h-4 w-4" aria-hidden="true" />
              Rodada concluída
            </p>
            <h3 className="mt-1 text-2xl font-bold">{estilo.titulo}</h3>
          </div>
          <Trophy className="h-10 w-10 opacity-30" aria-hidden="true" />
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <p
            className="text-6xl font-bold leading-none"
            aria-label={`Pontuação da rodada: ${pontos} pontos`}
          >
            {pontos}
          </p>
          <p className="text-base opacity-80" aria-hidden="true">pontos</p>
        </div>

        {/* "A conta" da pontuação — PRD pede transparência na nota */}
        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <ItemConta rotulo="Acertos" valor={`+${acertos.length * 10}`} />
          <ItemConta
            rotulo="Erros"
            valor={`-${(erros.length + perdidos.length) * 5}`}
          />
          <ItemConta rotulo="Bônus tempo" valor={`+${bonusTempo}`} />
        </dl>
      </div>

      {/* Detalhamento dos indícios */}
      <div
        className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-sm"
        style={{ animationDelay: "0.1s" }}
      >
        <h4 className="mb-4 text-lg font-semibold text-slate-900">
          Veja onde acertou e onde errou
        </h4>

        <div className="space-y-3">
          {textoLimpo && acertouLimpo && (
            <LinhaFeedback
              tipo="acerto"
              titulo="Texto sem indícios relevantes"
              explicacao="Correto! Você marcou 'Sem indícios' e acertou — este texto não apresenta sinais de desinformação. Saber reconhecer um texto confiável é tão importante quanto identificar um suspeito."
            />
          )}

          {acertos.map((id) => (
            <LinhaFeedback
              key={`a-${id}`}
              tipo="acerto"
              titulo={INDICIOS_POR_ID[id]?.nome ?? id}
              explicacao={texto.explicacoes[id] ?? ""}
            />
          ))}

          {perdidos.map((id) => (
            <LinhaFeedback
              key={`p-${id}`}
              tipo="perdido"
              titulo={INDICIOS_POR_ID[id]?.nome ?? id}
              explicacao={texto.explicacoes[id] ?? ""}
            />
          ))}

          {erros.map((id) => (
            <LinhaFeedback
              key={`e-${id}`}
              tipo="erro"
              titulo={INDICIOS_POR_ID[id]?.nome ?? id}
              explicacao={
                INDICIOS_POR_ID[id]?.descricao ??
                "Este indício não estava presente no texto."
              }
            />
          ))}
        </div>

        {texto.fonte_original && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Fonte original adaptada:{" "}
            <a
              href={texto.fonte_original}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline hover:text-indigo-700"
            >
              {texto.fonte_original}
            </a>
          </p>
        )}
      </div>

      {avancouNivel && (
        <div
          className="animate-fade-in-up flex items-center gap-3 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-4"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-200">
            <Star className="h-5 w-5 text-amber-700" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-amber-900">Nível desbloqueado!</p>
            <p className="text-sm text-amber-800">
              Você avançou para o nível{" "}
              <strong>{ROTULOS_NIVEL[novoNivel]}</strong>
              {comCronometro ? ". Os textos ficam mais sutis e o tempo diminui." : ". Os textos ficam mais sutis."}
            </p>
          </div>
        </div>
      )}

      {novasConquistas.length > 0 && (
        <div
          className="animate-fade-in-up space-y-2"
          style={{ animationDelay: "0.2s" }}
        >
          {novasConquistas.map((id) => {
            const c = CONQUISTAS_POR_ID[id];
            if (!c) return null;
            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-2xl border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-violet-50 p-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-200 text-xl">
                  🏅
                </div>
                <div>
                  <p className="font-bold text-indigo-900">
                    Conquista desbloqueada!
                  </p>
                  <p className="text-sm font-semibold text-indigo-800">
                    {c.nome}
                  </p>
                  <p className="text-xs text-indigo-700">{c.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!avancouNivel && textosRestantes > 0 && (
        <p
          className="animate-fade-in-up text-center text-sm text-slate-500"
          style={{ animationDelay: "0.25s" }}
        >
          {textosRestantes === 1
            ? "Falta 1 texto neste nível."
            : `Faltam ${textosRestantes} textos neste nível.`}
        </p>
      )}

      {/* Ações */}
      <div
        className="flex animate-fade-in-up flex-col gap-2 sm:flex-row"
        style={{ animationDelay: "0.2s" }}
      >
        <button
          onClick={aoReiniciar}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Próxima rodada
        </button>
        <Link
          href="/jogo"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}

function ItemConta({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
      <dt className="text-xs opacity-80">{rotulo}</dt>
      <dd className="font-mono text-base font-semibold tabular-nums">{valor}</dd>
    </div>
  );
}

type TipoFeedback = "acerto" | "perdido" | "erro";

function LinhaFeedback({
  tipo,
  titulo,
  explicacao,
}: {
  tipo: TipoFeedback;
  titulo: string;
  explicacao: string;
}) {
  const config = {
    acerto: {
      Icone: CheckCircle2,
      corIcone: "text-emerald-600 bg-emerald-50",
      borda: "border-emerald-100",
      selo: "Acertou",
      corSelo: "bg-emerald-100 text-emerald-700",
    },
    perdido: {
      Icone: AlertCircle,
      corIcone: "text-amber-600 bg-amber-50",
      borda: "border-amber-100",
      selo: "Passou batido",
      corSelo: "bg-amber-100 text-amber-800",
    },
    erro: {
      Icone: XCircle,
      corIcone: "text-red-600 bg-red-50",
      borda: "border-red-100",
      selo: "Não se aplica",
      corSelo: "bg-red-100 text-red-700",
    },
  }[tipo];

  const { Icone } = config;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border bg-white p-4 ${config.borda}`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${config.corIcone}`}
      >
        <Icone className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-slate-900">{titulo}</p>
          <span
            className={`flex-shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${config.corSelo}`}
          >
            {config.selo}
          </span>
        </div>
        {explicacao && (
          <p className="mt-1 text-sm text-slate-600">{explicacao}</p>
        )}
      </div>
    </div>
  );
}
