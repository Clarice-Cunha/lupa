export type Conquista = {
  id: string;
  nome: string;
  descricao: string;
};

export const CONQUISTAS: Conquista[] = [
  {
    id: "aprendiz",
    nome: "Detetive Aprendiz",
    descricao: "Completou o nível Fácil com pelo menos 75% de acertos.",
  },
  {
    id: "investigador",
    nome: "Investigador",
    descricao: "Completou o nível Médio com pelo menos 75% de acertos.",
  },
  {
    id: "detetive_lupa",
    nome: "Detetive LUPA",
    descricao: "Completou todos os níveis do jogo. Missão cumprida!",
  },
  {
    id: "olho_vivo",
    nome: "Olho Vivo",
    descricao: "Identificou corretamente um texto sem indícios de desinformação.",
  },
  {
    id: "analise_perfeita",
    nome: "Análise Impecável",
    descricao: "Terminou uma rodada identificando todos os indícios sem nenhum erro.",
  },
];

export const CONQUISTAS_POR_ID: Record<string, Conquista> = Object.fromEntries(
  CONQUISTAS.map((c) => [c.id, c]),
);
