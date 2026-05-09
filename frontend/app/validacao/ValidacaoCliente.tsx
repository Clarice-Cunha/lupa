"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  obterResultadosValidacao,
  enviarValidacao,
  type ResultadosValidacao,
} from "@/lib/api";

const PERFIS = [
  { valor: "estudante", rotulo: "Estudante" },
  { valor: "professor", rotulo: "Professor(a)" },
  { valor: "familiar", rotulo: "Familiar / Responsável" },
  { valor: "outro", rotulo: "Outro" },
];

const PERGUNTAS = [
  {
    key: "aprendeuAlgo" as const,
    texto: "Você aprendeu algo novo sobre como identificar desinformação?",
  },
  {
    key: "identificouSinal" as const,
    texto: "Conseguiu identificar pelo menos um sinal de alerta durante o uso?",
  },
  {
    key: "recomendaria" as const,
    texto: "Você recomendaria o LUPA para alguém de confiança?",
  },
];

const PERFIL_ROTULOS: Record<string, string> = {
  estudante: "Estudante",
  professor: "Professor(a)",
  familiar: "Familiar / Responsável",
  outro: "Outro",
};

function BarraPorcentagem({ valor, cor }: { valor: number; cor: string }) {
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${cor}`}
        style={{ width: `${Math.min(valor, 100)}%` }}
      />
    </div>
  );
}

export default function ValidacaoCliente() {
  const [resultados, setResultados] = useState<ResultadosValidacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  // estado do formulário
  const [nome, setNome] = useState("");
  const [perfil, setPerfil] = useState("");
  const [respostas, setRespostas] = useState<Record<string, boolean | null>>({
    aprendeuAlgo: null,
    identificouSinal: null,
    recomendaria: null,
  });
  const [facilidade, setFacilidade] = useState(0);
  const [depoimento, setDepoimento] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarResultados();
  }, []);

  async function carregarResultados() {
    try {
      setResultados(await obterResultadosValidacao());
    } catch {
      // ignora falha de rede — a página ainda funciona para envio
    } finally {
      setCarregando(false);
    }
  }

  function setResposta(key: string, valor: boolean) {
    setRespostas((prev) => ({ ...prev, [key]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const todasRespondidas = PERGUNTAS.every((p) => respostas[p.key] !== null);
    if (!perfil || !todasRespondidas || !facilidade) {
      setErro("Por favor, responda todas as perguntas obrigatórias (marcadas com *).");
      return;
    }

    setEnviando(true);
    try {
      await enviarValidacao({
        nome,
        perfil,
        aprendeu_algo: respostas.aprendeuAlgo as boolean,
        identificou_sinal: respostas.identificouSinal as boolean,
        recomendaria: respostas.recomendaria as boolean,
        facilidade,
        depoimento,
      });
      setEnviado(true);
      await carregarResultados();
    } catch {
      setErro("Erro ao enviar a avaliação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900">
            <Users className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Validação com Usuários
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            O LUPA foi testado por pessoas reais. Veja o que elas disseram —
            e deixe a sua avaliação também.
          </p>
        </header>

        {/* Como foi feita a validação */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800/40 dark:bg-emerald-900/20">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-emerald-800 dark:text-emerald-200">
                Como foi feita a validação
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-justify text-emerald-900 dark:text-emerald-200">
              O LUPA foi testado por pessoas de diferentes perfis —
              estudantes, professores e familiares — que usaram o site pela
              primeira vez, sem orientação prévia. Após o uso, cada pessoa
              respondeu a esta avaliação. O objetivo era entender se a
              ferramenta cumpre sua proposta: ensinar a identificar sinais de
              desinformação de forma acessível e intuitiva.
            </p>
          </div>
        </section>

        {/* Resultados agregados */}
        {!carregando && resultados && resultados.total > 0 && (
          <section
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Resultados —{" "}
              <span className="text-slate-500 dark:text-slate-400">
                {resultados.total}{" "}
                {resultados.total === 1 ? "avaliação" : "avaliações"}
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  valor: resultados.percentual_aprendeu,
                  label: "Aprenderam algo novo",
                  exibir: `${resultados.percentual_aprendeu.toFixed(0)}%`,
                  cor: "bg-indigo-400",
                  corTexto: "text-indigo-600 dark:text-indigo-400",
                },
                {
                  valor: resultados.percentual_identificou,
                  label: "Identificaram sinal de alerta",
                  exibir: `${resultados.percentual_identificou.toFixed(0)}%`,
                  cor: "bg-violet-400",
                  corTexto: "text-violet-600 dark:text-violet-400",
                },
                {
                  valor: resultados.percentual_recomendaria,
                  label: "Recomendariam o LUPA",
                  exibir: `${resultados.percentual_recomendaria.toFixed(0)}%`,
                  cor: "bg-emerald-400",
                  corTexto: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  valor: resultados.media_facilidade * 20,
                  label: "Facilidade média de uso",
                  exibir: `${resultados.media_facilidade.toFixed(1)}/5`,
                  cor: "bg-amber-400",
                  corTexto: "text-amber-600 dark:text-amber-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <p className={`text-2xl font-bold tabular-nums ${item.corTexto}`}>
                    {item.exibir}
                  </p>
                  <p className="mt-1 text-xs leading-tight text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <BarraPorcentagem valor={item.valor} cor={item.cor} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Depoimentos aprovados */}
        {resultados && resultados.depoimentos.length > 0 && (
          <section
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                O que as pessoas disseram
              </h2>
            </div>
            <div className="space-y-3">
              {resultados.depoimentos.map((dep) => (
                <div
                  key={dep.id}
                  className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <p className="text-sm italic leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                    &ldquo;{dep.depoimento}&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    — {dep.nome} ·{" "}
                    {PERFIL_ROTULOS[dep.perfil] ?? dep.perfil}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulário */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Deixe a sua avaliação
            </h2>
          </div>

          {enviado ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800/40 dark:bg-emerald-900/20">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
              <h3 className="mb-2 text-lg font-bold text-emerald-800 dark:text-emerald-200">
                Obrigado pela avaliação!
              </h3>
              <p className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-300">
                Seu feedback foi registrado e vai ajudar a melhorar o LUPA.
                Depoimentos são revisados pela equipe antes de aparecer nesta
                página.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Nome */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Seu nome{" "}
                  <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={100}
                  placeholder="Como prefere ser chamado(a)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Perfil */}
              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Você se identifica como{" "}
                  <span className="text-rose-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {PERFIS.map((p) => (
                    <button
                      key={p.valor}
                      type="button"
                      onClick={() => setPerfil(p.valor)}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                        perfil === p.valor
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p.rotulo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perguntas sim/não */}
              <div className="space-y-4">
                {PERGUNTAS.map((pergunta) => (
                  <div key={pergunta.key}>
                    <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {pergunta.texto}{" "}
                      <span className="text-rose-500">*</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setResposta(pergunta.key, true)}
                        className={`rounded-xl px-6 py-2 text-sm font-medium transition ${
                          respostas[pergunta.key] === true
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "border border-slate-200 text-slate-600 hover:bg-emerald-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-emerald-900/20"
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setResposta(pergunta.key, false)}
                        className={`rounded-xl px-6 py-2 text-sm font-medium transition ${
                          respostas[pergunta.key] === false
                            ? "bg-rose-400 text-white shadow-sm"
                            : "border border-slate-200 text-slate-600 hover:bg-rose-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-rose-900/20"
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Facilidade */}
              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Facilidade de uso{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (1 = muito difícil · 5 = muito fácil)
                  </span>{" "}
                  <span className="text-rose-500">*</span>
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFacilidade(n)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold transition ${
                        n <= facilidade
                          ? "bg-amber-400 text-white shadow-sm"
                          : "border border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500 dark:border-slate-600 dark:text-slate-500"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Depoimento */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Depoimento{" "}
                  <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                  value={depoimento}
                  onChange={(e) => setDepoimento(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="O que você achou? O que funcionou bem? O que poderia melhorar?"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
                <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                  {depoimento.length}/500
                </p>
              </div>

              {/* Erro */}
              {erro && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60 dark:shadow-indigo-900"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar avaliação
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Depoimentos são revisados pela equipe antes de aparecer nesta
                página. As estatísticas incluem todas as respostas.
              </p>
            </form>
          )}
        </section>

      </div>
    </main>
  );
}
