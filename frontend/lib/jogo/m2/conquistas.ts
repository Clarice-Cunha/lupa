import type { Conquista } from "../conquistas";

export const CONQUISTAS_M2: Conquista[] = [
  {
    id: "analista_fontes",
    nome: "Analista de Fontes",
    descricao: "Completou o Mundo 2 — Fontes e Evidências com pelo menos 75% de acertos.",
    dificuldade: "medio",
  },
  {
    id: "analise_perfeita_m2",
    nome: "Análise Impecável — Fontes",
    descricao: "Terminou uma rodada do Mundo 2 identificando todos os indícios sem nenhum erro.",
    dificuldade: "medio",
  },
];

export const CONQUISTAS_M2_POR_ID: Record<string, Conquista> = Object.fromEntries(
  CONQUISTAS_M2.map((c) => [c.id, c]),
);
