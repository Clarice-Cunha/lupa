"use client";

/**
 * Sala do jogo multiplayer — usada tanto pelo anfitrião quanto pelos jogadores.
 *
 * O anfitrião (quem tem o anfitriao_id no sessionStorage) vê botões de controle.
 * Os jogadores veem os textos e podem enviar respostas.
 *
 * Polling: a cada 2 segundos o frontend pede o estado atualizado da sala ao backend.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Trophy,
  Timer,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Crown,
  Clock,
  BarChart2,
} from "lucide-react";
import { INDICIOS } from "@/lib/jogo/dados";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const INTERVALO_POLLING_MS = 2000;
const TEMPO_RODADA_SEGUNDOS = 60;

// ── Tipos espelhando o backend ─────────────────────────────────────────────────
type EstadoSala = "aguardando" | "rodada" | "feedback" | "encerrada";

type JogadorPublico = {
  id: string;
  nome: string;
  pontos: number;
  respondeu: boolean;
  pontos_esta_rodada: number | null;
};

type TextoPublico = {
  id: string;
  titulo: string;
  corpo: string;
  indicios_corretos: string[] | null;
  explicacao: string | null;
};

type SalaPublica = {
  codigo: string;
  estado: EstadoSala;
  rodada_atual: number;
  total_rodadas: number;
  anfitriao_id: string;
  anfitriao_participa: boolean;
  jogadores: JogadorPublico[];
  texto_atual: TextoPublico | null;
  rodada_inicio: number | null;
  minha_resposta: string[] | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function nomeIndicio(id: string): string {
  return INDICIOS.find((i) => i.id === id)?.nome ?? id;
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PaginaSala() {
  const params = useParams();
  const codigo = (params.codigo as string).toUpperCase();

  const [sala, setSala] = useState<SalaPublica | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [marcados, setMarcados] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_RODADA_SEGUNDOS);

  const jogadorIdRef = useRef<string | null>(null);
  const anfitrioIdRef = useRef<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lê os IDs do sessionStorage na montagem do componente
  useEffect(() => {
    jogadorIdRef.current = sessionStorage.getItem("lupa_multi_jogador_id");
    anfitrioIdRef.current = sessionStorage.getItem("lupa_multi_anfitriao_id");
  }, []);

  const ehAnfitriao = useCallback(
    (s: SalaPublica) =>
      anfitrioIdRef.current !== null &&
      anfitrioIdRef.current === s.anfitriao_id,
    [],
  );

  // ── Polling ──────────────────────────────────────────────────────────────────
  const buscarEstado = useCallback(async () => {
    const jid = jogadorIdRef.current ?? "";
    const url = `${API_BASE}/multiplayer/sala/${codigo}${jid ? `?jogador_id=${jid}` : ""}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) setErro("Sala não encontrada ou expirada.");
        return;
      }
      const dados: SalaPublica = await res.json();
      setSala(dados);
      setErro(null);
    } catch {
      setErro("Sem conexão com o servidor.");
    }
  }, [codigo]);

  useEffect(() => {
    buscarEstado();
    pollingRef.current = setInterval(buscarEstado, INTERVALO_POLLING_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [buscarEstado]);

  // ── Cronômetro visual ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sala?.rodada_inicio || sala.estado !== "rodada") return;
    const atualizar = () => {
      const elapsed = (Date.now() / 1000) - sala.rodada_inicio!;
      setTempoRestante(Math.max(0, Math.round(TEMPO_RODADA_SEGUNDOS - elapsed)));
    };
    atualizar();
    const id = setInterval(atualizar, 500);
    return () => clearInterval(id);
  }, [sala?.rodada_inicio, sala?.estado]);

  // Limpa marcações ao trocar de rodada
  useEffect(() => {
    setMarcados([]);
  }, [sala?.rodada_atual]);

  // ── Ações ────────────────────────────────────────────────────────────────────
  async function iniciarJogo() {
    await chamarAPI(`/multiplayer/sala/${codigo}/iniciar`, {
      anfitriao_id: anfitrioIdRef.current,
    });
  }

  async function avancar() {
    await chamarAPI(`/multiplayer/sala/${codigo}/avancar`, {
      anfitriao_id: anfitrioIdRef.current,
    });
  }

  async function enviarResposta() {
    if (enviando) return;
    setEnviando(true);
    await chamarAPI(`/multiplayer/sala/${codigo}/responder`, {
      jogador_id: jogadorIdRef.current,
      indicios: marcados,
    });
    setEnviando(false);
  }

  async function chamarAPI(path: string, body: object) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErro(d.detail ?? "Erro na ação.");
        return;
      }
      const dados: SalaPublica = await res.json();
      setSala(dados);
      setErro(null);
    } catch {
      setErro("Sem conexão com o servidor.");
    }
  }

  function alternarIndicio(id: string) {
    setMarcados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ── Renderização ─────────────────────────────────────────────────────────────
  if (!sala && !erro) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-slate-500">Conectando à sala…</p>
      </main>
    );
  }

  if (erro && !sala) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-red-600">{erro}</p>
        <Link href="/jogos" className="text-sm text-indigo-600 underline">
          Voltar para jogos
        </Link>
      </main>
    );
  }

  if (!sala) return null;

  const isAnfitriao = ehAnfitriao(sala);
  // Anfitrião que optou por participar responde como qualquer jogador
  const deveResponder = !isAnfitriao || sala.anfitriao_participa;
  const jaRespondeu = sala.minha_resposta !== null;

  return (
    <main className="flex-1 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Cabeçalho da sala */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Código da sala
            </p>
            <p className="text-4xl font-bold tracking-widest text-indigo-700">
              {sala.codigo}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4" aria-hidden="true" />
            {sala.jogadores.length} jogador{sala.jogadores.length !== 1 ? "es" : ""}
          </div>
        </header>

        {/* Mensagem de erro não-fatal */}
        {erro && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}

        {/* ── Estado: aguardando ── */}
        {sala.estado === "aguardando" && (
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Sala de espera
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Compartilhe o código <strong>{sala.codigo}</strong> com os
              jogadores. Eles entram em{" "}
              <strong>lupa.vercel.app/jogos/multiplayer/entrar</strong>.
            </p>

            <div className="mb-5 space-y-1.5">
              {sala.jogadores.map((j) => (
                <div
                  key={j.id}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm"
                >
                  {j.id === sala.anfitriao_id && (
                    <Crown className="h-4 w-4 flex-shrink-0 text-amber-500" aria-label="Anfitrião" />
                  )}
                  <span className="font-medium text-slate-800">{j.nome}</span>
                  {j.id === sala.anfitriao_id && (
                    <span className="text-xs text-slate-400">(anfitrião)</span>
                  )}
                </div>
              ))}
            </div>

            {isAnfitriao && (
              <button
                onClick={iniciarJogo}
                disabled={sala.jogadores.length < 1}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <ChevronRight className="h-5 w-5" />
                Iniciar jogo
              </button>
            )}
            {!isAnfitriao && (
              <p className="text-center text-sm text-slate-500">
                Aguardando o anfitrião iniciar o jogo…
              </p>
            )}
          </div>
        )}

        {/* ── Estado: rodada ── */}
        {sala.estado === "rodada" && sala.texto_atual && (
          <div className="space-y-4">
            {/* Progresso e cronômetro */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Rodada {sala.rodada_atual + 1} de {sala.total_rodadas}
              </p>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${tempoRestante <= 10 ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"}`}>
                <Timer className="h-4 w-4" aria-hidden="true" />
                {tempoRestante}s
              </div>
            </div>

            {/* Texto */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                {sala.texto_atual.titulo}
              </h2>
              <p className="leading-relaxed text-slate-700">
                {sala.texto_atual.corpo}
              </p>
            </div>

            {/* Seleção de indícios */}
            {deveResponder && !jaRespondeu && (
              <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Quais indícios você identifica neste texto?
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {INDICIOS.map((indicio) => {
                    const selecionado = marcados.includes(indicio.id);
                    return (
                      <button
                        key={indicio.id}
                        onClick={() => alternarIndicio(indicio.id)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
                          selecionado
                            ? "border-indigo-400 bg-indigo-50 font-medium text-indigo-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="flex-1">{indicio.nome}</span>
                        {selecionado && (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={enviarResposta}
                  disabled={enviando}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                >
                  {marcados.length === 0
                    ? "Enviar — sem indícios"
                    : `Enviar ${marcados.length} indício${marcados.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            )}

            {/* Jogador já respondeu */}
            {deveResponder && jaRespondeu && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                Resposta enviada! Aguardando os outros jogadores…
              </div>
            )}

            {/* Placar de quem já respondeu */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Respostas recebidas
              </p>
              <div className="space-y-1.5">
                {sala.jogadores.map((j) => (
                  <div key={j.id} className="flex items-center gap-2 text-sm">
                    {j.respondeu ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-300" />
                    )}
                    <span className={j.respondeu ? "text-slate-700" : "text-slate-400"}>
                      {j.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão do anfitrião para encerrar a rodada */}
            {isAnfitriao && (
              <button
                onClick={avancar}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <ChevronRight className="h-5 w-5" />
                Encerrar rodada e ver gabarito
              </button>
            )}
          </div>
        )}

        {/* ── Estado: feedback ── */}
        {sala.estado === "feedback" && sala.texto_atual && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Gabarito — Rodada {sala.rodada_atual + 1}
            </h2>

            {/* Gabarito */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm">
              <p className="mb-3 font-semibold text-slate-800">
                {sala.texto_atual.titulo}
              </p>

              <p className="mb-3 text-sm font-medium text-slate-600">
                Indícios corretos:
              </p>
              {sala.texto_atual.indicios_corretos &&
              sala.texto_atual.indicios_corretos.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sala.texto_atual.indicios_corretos.map((id) => {
                    const minhaResposta = sala.minha_resposta ?? [];
                    const acertou = minhaResposta.includes(id);
                    return (
                      <span
                        key={id}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                          acertou
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {acertou ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {nomeIndicio(id)}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm italic text-slate-500">
                  Texto sem indícios de desinformação.
                </p>
              )}

              {/* Minha resposta vs gabarito */}
              {deveResponder && sala.minha_resposta !== null && (
                <div className="mt-4 text-sm">
                  <p className="font-medium text-slate-700">Você marcou:</p>
                  {sala.minha_resposta.length === 0 ? (
                    <p className="italic text-slate-500">Nenhum indício</p>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {sala.minha_resposta.map((id) => {
                        const correto =
                          sala.texto_atual?.indicios_corretos?.includes(id) ??
                          false;
                        return (
                          <span
                            key={id}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              correto
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {correto ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {nomeIndicio(id)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Placar desta rodada */}
            <Placar jogadores={sala.jogadores} mostrarPontosRodada />

            {isAnfitriao && (
              <button
                onClick={avancar}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <ChevronRight className="h-5 w-5" />
                {sala.rodada_atual + 1 < sala.total_rodadas
                  ? "Próxima rodada"
                  : "Ver placar final"}
              </button>
            )}
            {!isAnfitriao && (
              <p className="text-center text-sm text-slate-500">
                Aguardando o anfitrião avançar para a próxima rodada…
              </p>
            )}
          </div>
        )}

        {/* ── Estado: encerrada ── */}
        {sala.estado === "encerrada" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center shadow-xl shadow-amber-100/50">
              <Trophy className="mx-auto mb-3 h-10 w-10 text-amber-500" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-slate-900">
                Fim de jogo!
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Placar final da sala <strong>{sala.codigo}</strong>
              </p>
            </div>

            <Placar jogadores={sala.jogadores} mostrarPontosRodada={false} />

            {isAnfitriao && (
              <Link
                href={`/jogos/multiplayer/sala/${codigo}/relatorio`}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110"
              >
                <BarChart2 className="h-5 w-5" />
                Ver relatório pedagógico
              </Link>
            )}

            <Link
              href="/jogos"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Voltar para jogos
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Componente de placar ───────────────────────────────────────────────────────
function Placar({
  jogadores,
  mostrarPontosRodada,
}: {
  jogadores: JogadorPublico[];
  mostrarPontosRodada: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-md backdrop-blur-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Placar
      </p>
      <ol className="space-y-2">
        {jogadores.map((j, i) => (
          <li
            key={j.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
              i === 0 ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
            }`}
          >
            <span className="w-5 text-center text-sm font-bold text-slate-500">
              {i + 1}
            </span>
            {i === 0 && (
              <Trophy className="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden="true" />
            )}
            <span className="flex-1 text-sm font-medium text-slate-800">
              {j.nome}
            </span>
            {mostrarPontosRodada && j.pontos_esta_rodada !== null && (
              <span className="text-xs font-semibold text-indigo-600">
                +{j.pontos_esta_rodada}
              </span>
            )}
            <span className="text-sm font-bold text-slate-700">
              {j.pontos} pts
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
