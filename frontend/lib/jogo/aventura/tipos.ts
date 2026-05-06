/**
 * Tipos do jogo de aventura 2D do LUPA.
 *
 * Usado tanto pelo componente React (overlays) quanto pela cena
 * do Phaser para garantir que os dados trafeguem com o formato certo.
 */

/** Tipos de inimigos: Mundo 1 (Fake News) e Mundo 2 (Fontes e Evidências) */
export type TipoInimigo =
  | "bot" | "manchete" | "corrente"          // Mundo 1
  | "conflito" | "citacao" | "correlacao";   // Mundo 2

/** Uma opção de resposta dentro de uma pergunta */
export type OpcaoResposta = {
  texto: string;
  correta: boolean;
  /** Explicação exibida após o jogador responder */
  feedback: string;
};

/** Uma pergunta vinculada a um inimigo */
export type PerguntaAventura = {
  id: string;
  tipoInimigo: TipoInimigo;
  nomeInimigo: string;
  /** Contexto curto exibido antes da pergunta */
  situacao: string;
  enunciado: string;
  opcoes: [OpcaoResposta, OpcaoResposta];
};

/** Estado do overlay React que aparece sobre o canvas do Phaser */
export type EstadoOverlay =
  | { tipo: "nenhum" }
  | { tipo: "pergunta"; pergunta: PerguntaAventura }
  | { tipo: "feedback"; correta: boolean; feedback: string }
  | { tipo: "gameOver"; pontos: number }
  | { tipo: "vitoria"; pontos: number; corretas: number; total: number };

/** Funções que a cena Phaser chama para atualizar o React */
export interface GameCallbacks {
  onMostrarPergunta: (pergunta: PerguntaAventura) => void;
  onGameOver: (pontos: number) => void;
  onVitoria: (pontos: number, corretas: number, total: number) => void;
  onAtualizarVidas: (vidas: number) => void;
  onAtualizarPontos: (pontos: number) => void;
}
