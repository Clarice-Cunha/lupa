"use client";

import { useState } from "react";
import { Bot, RotateCcw, AlertTriangle, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

// ============================================================
// Perguntas do calculador
// ============================================================

const PERGUNTAS = [
  {
    id: 1,
    texto: "O perfil não tem foto de rosto real (imagem genérica, IA ou ausente)?",
  },
  {
    id: 2,
    texto: "O nome de usuário tem números aleatórios ou é claramente gerado (ex: @joao1847302)?",
  },
  {
    id: 3,
    texto: "A conta foi criada há menos de 6 meses?",
  },
  {
    id: 4,
    texto: "A bio está vazia ou é completamente genérica (sem informações pessoais)?",
  },
  {
    id: 5,
    texto: "A conta publica mais de 10 vezes por dia com regularidade?",
  },
  {
    id: 6,
    texto: "Posts aparecem em horários de madrugada ou com segundos de intervalo entre si?",
  },
  {
    id: 7,
    texto: "Quase todos os posts abordam o mesmo tema (político, comercial ou ideológico)?",
  },
  {
    id: 8,
    texto: "A conta nunca responde comentários nem interage com outros usuários?",
  },
  {
    id: 9,
    texto: "A conta tem muitos seguidores, mas poucos curtidas/comentários nos posts?",
  },
  {
    id: 10,
    texto: "Os comentários que a conta faz em outros posts são sempre curtos e genéricos (ex: 'concordo!', 'verdade!')?",
  },
];

// ============================================================
// Tipos
// ============================================================

type Resposta = "sim" | "nao" | null;

type Nivel = "humano" | "suspeito" | "alto" | "bot";

function calcularNivel(pontuacao: number): Nivel {
  if (pontuacao <= 2) return "humano";
  if (pontuacao <= 4) return "suspeito";
  if (pontuacao <= 7) return "alto";
  return "bot";
}

const CONFIG_NIVEL: Record<Nivel, {
  label: string;
  descricao: string;
  cor: string;
  corFundo: string;
  corBarra: string;
  icone: React.ComponentType<{ className?: string }>;
}> = {
  humano: {
    label: "Provável humano",
    descricao: "Poucos sinais de automação. Este perfil tem características compatíveis com uma conta real.",
    cor: "text-emerald-700",
    corFundo: "bg-emerald-50 border-emerald-200",
    corBarra: "bg-emerald-500",
    icone: ShieldCheck,
  },
  suspeito: {
    label: "Suspeito",
    descricao: "Alguns sinais presentes. Observe mais a conta antes de interagir ou compartilhar conteúdo dela.",
    cor: "text-amber-700",
    corFundo: "bg-amber-50 border-amber-200",
    corBarra: "bg-amber-400",
    icone: ShieldQuestion,
  },
  alto: {
    label: "Alta suspeita",
    descricao: "Múltiplas características típicas de bot. Desconfie do conteúdo e não o amplifique.",
    cor: "text-orange-700",
    corFundo: "bg-orange-50 border-orange-200",
    corBarra: "bg-orange-500",
    icone: ShieldAlert,
  },
  bot: {
    label: "Muito provável bot",
    descricao: "Perfil com quase todos os sinais de automação. Evite interagir e não compartilhe o conteúdo desta conta.",
    cor: "text-red-700",
    corFundo: "bg-red-50 border-red-200",
    corBarra: "bg-red-500",
    icone: AlertTriangle,
  },
};

// ============================================================
// Componente principal
// ============================================================

export function CalculadorBot() {
  const [respostas, setRespostas] = useState<Record<number, Resposta>>({});
  const [concluido, setConcluido] = useState(false);

  const respondidas = Object.values(respostas).filter((r) => r !== null).length;
  const pontuacao = Object.values(respostas).filter((r) => r === "sim").length;
  const progresso = (respondidas / PERGUNTAS.length) * 100;

  function responder(id: number, valor: Resposta) {
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  }

  function reiniciar() {
    setRespostas({});
    setConcluido(false);
  }

  const nivel = calcularNivel(pontuacao);
  const config = CONFIG_NIVEL[nivel];
  const Icone = config.icone;
  const percBarra = (pontuacao / PERGUNTAS.length) * 100;

  return (
    <div className="mt-6 rounded-3xl border border-violet-200 bg-white shadow-lg shadow-violet-100/30 overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Calculador de Probabilidade de Bot</h3>
            <p className="text-sm text-violet-100">
              Observe o perfil suspeito e marque os sinais que você identifica.
            </p>
          </div>
        </div>
        {/* Barra de progresso das respostas */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-violet-200 mb-1">
            <span>{respondidas}/{PERGUNTAS.length} sinais verificados</span>
            <span>{pontuacao} {pontuacao === 1 ? "sinal encontrado" : "sinais encontrados"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/80 transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista de perguntas */}
      <div className="divide-y divide-slate-100">
        {PERGUNTAS.map((pergunta) => {
          const resposta = respostas[pergunta.id] ?? null;
          return (
            <div
              key={pergunta.id}
              className={`px-5 py-4 transition-colors ${
                resposta === "sim" ? "bg-red-50" : resposta === "nao" ? "bg-emerald-50/40" : "bg-white"
              }`}
            >
              <p className="mb-3 text-sm font-medium text-slate-800 leading-relaxed">
                <span className="mr-2 inline-block h-5 w-5 rounded-full bg-violet-100 text-center text-xs font-bold leading-5 text-violet-600">
                  {pergunta.id}
                </span>
                {pergunta.texto}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => responder(pergunta.id, "sim")}
                  className={`rounded-xl border px-4 py-1.5 text-sm font-medium transition ${
                    resposta === "sim"
                      ? "border-red-400 bg-red-500 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => responder(pergunta.id, "nao")}
                  className={`rounded-xl border px-4 py-1.5 text-sm font-medium transition ${
                    resposta === "nao"
                      ? "border-emerald-400 bg-emerald-500 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  Não
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resultado */}
      {respondidas >= 5 && (
        <div className={`mx-5 mb-5 mt-4 rounded-2xl border p-5 ${config.corFundo}`}>
          <div className="flex items-start gap-3">
            <Icone className={`mt-0.5 h-5 w-5 shrink-0 ${config.cor}`} />
            <div className="flex-1">
              <p className={`text-base font-bold ${config.cor}`}>
                {config.label}
              </p>
              <p className={`mt-1 text-sm ${config.cor} opacity-90`}>
                {config.descricao}
              </p>

              {/* Barra de risco */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-medium ${config.cor}`}>
                    {pontuacao} de {PERGUNTAS.length} sinais detectados
                  </span>
                  <span className={`font-bold ${config.cor}`}>
                    {Math.round(percBarra)}% de risco
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.corBarra}`}
                    style={{ width: `${percBarra}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-400">
          {respondidas < 5
            ? `Responda mais ${5 - respondidas} ${5 - respondidas === 1 ? "pergunta" : "perguntas"} para ver o resultado.`
            : "Resultado baseado nos sinais marcados acima."}
        </p>
        {respondidas > 0 && (
          <button
            type="button"
            onClick={reiniciar}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Recomeçar
          </button>
        )}
      </div>
    </div>
  );
}
