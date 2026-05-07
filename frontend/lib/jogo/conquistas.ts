export type Conquista = {
  id: string;
  nome: string;
  descricao: string;
  /** Fácil: mostra a descrição mesmo bloqueada. Difícil: mostra "Conquista secreta". */
  dificuldade: "facil" | "medio" | "dificil";
};

export const CONQUISTAS: Conquista[] = [
  {
    id: "primeira_pista",
    nome: "Primeira Pista",
    descricao: "Completou sua primeira rodada do Detetive LUPA.",
    dificuldade: "facil",
  },
  {
    id: "aprendiz",
    nome: "Detetive Aprendiz",
    descricao: "Completou o nível Fácil com pelo menos 75% de acertos.",
    dificuldade: "facil",
  },
  {
    id: "olho_vivo",
    nome: "Olho Vivo",
    descricao: "Identificou corretamente um texto sem indícios de desinformação.",
    dificuldade: "facil",
  },
  {
    id: "persistente",
    nome: "Persistente",
    descricao: "Jogou 10 rodadas no total.",
    dificuldade: "facil",
  },
  {
    id: "investigador",
    nome: "Investigador",
    descricao: "Completou o nível Médio com pelo menos 75% de acertos.",
    dificuldade: "medio",
  },
  {
    id: "analise_perfeita",
    nome: "Análise Impecável",
    descricao: "Terminou uma rodada identificando todos os indícios sem nenhum erro.",
    dificuldade: "medio",
  },
  {
    id: "nivel_perfeito",
    nome: "Nível Perfeito",
    descricao: "Completou um nível inteiro com 100% de acertos.",
    dificuldade: "medio",
  },
  {
    id: "detetive_lupa",
    nome: "Detetive LUPA",
    descricao: "Completou todos os níveis do jogo. Missão cumprida!",
    dificuldade: "dificil",
  },
  {
    id: "detetive_mestre",
    nome: "Mestre Detetive",
    descricao: "Desbloqueou todas as outras conquistas.",
    dificuldade: "dificil",
  },
];

export const CONQUISTAS_POR_ID: Record<string, Conquista> = Object.fromEntries(
  CONQUISTAS.map((c) => [c.id, c]),
);
