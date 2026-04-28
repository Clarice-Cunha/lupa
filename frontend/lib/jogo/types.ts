/**
 * Tipos usados pelo Detetive LUPA.
 *
 * Manter estes tipos em um arquivo separado permite que tanto os
 * dados JSON quanto os componentes React usem o mesmo contrato.
 */

export type NivelDificuldade = "facil" | "medio" | "dificil";

export type Categoria =
  | "politica"
  | "saude"
  | "ciencia"
  | "tecnologia"
  | "cultura";

/** Um tipo de indício de desinformação que o jogador pode marcar. */
export type Indicio = {
  id: string;
  nome: string;
  descricao: string;
};

/** Um texto do banco do jogo, com gabarito. */
export type TextoJogo = {
  id: string;
  titulo: string;
  conteudo: string;
  nivel: NivelDificuldade;
  categoria: Categoria;
  /** IDs dos indícios presentes no texto (o gabarito). */
  indicios_corretos: string[];
  /** Explicação específica por indício, no contexto deste texto. */
  explicacoes: Record<string, string>;
  /** URL da notícia real quando o texto é adaptação; null quando é fictício. */
  fonte_original: string | null;
};

/** Rótulos legíveis para exibir o nível na interface. */
export const ROTULOS_NIVEL: Record<NivelDificuldade, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

/** Tempo (em segundos) de cronômetro por nível. PRD §3.3 / §3.4. */
export const TEMPO_POR_NIVEL: Record<NivelDificuldade, number> = {
  facil: 75,
  medio: 60,
  dificil: 45,
};
