/**
 * Regras de pontuação do Detetive LUPA.
 *
 * Função pura: dado um texto (com gabarito), os indícios que o
 * jogador marcou e o tempo que sobrou no cronômetro, devolve o
 * que ele acertou, perdeu, errou e os pontos finais.
 *
 * Fórmula (PRD §4.3):
 *   pontos = (acertos × 10) - (erros × 5) + bonus_tempo
 *
 * "Erro" inclui tanto indício marcado indevidamente quanto indício
 * correto que passou batido — as duas coisas são falhas de análise.
 */

import type { TextoJogo } from "./types";

export type ResultadoRodada = {
  /** Indícios corretamente identificados (marcados E no gabarito). */
  acertos: string[];
  /** Indícios do gabarito que o jogador deixou passar. */
  perdidos: string[];
  /** Indícios marcados que não estão no gabarito (falso positivo). */
  erros: string[];
  /** Pontos ganhos pelo tempo restante (1 a cada 3 segundos). */
  bonusTempo: number;
  /** Pontuação final (nunca negativa). */
  pontos: number;
};

export function calcularResultado(
  texto: TextoJogo,
  selecionados: Set<string>,
  tempoRestante: number,
  marcouSemIndicios: boolean = false,
): ResultadoRodada {
  const gabarito = new Set(texto.indicios_corretos);

  const acertos: string[] = [];
  const erros: string[] = [];
  const perdidos: string[] = [];

  for (const id of selecionados) {
    if (gabarito.has(id)) acertos.push(id);
    else erros.push(id);
  }
  for (const id of gabarito) {
    if (!selecionados.has(id)) perdidos.push(id);
  }

  const totalErros = erros.length + perdidos.length;
  const bonusTempo = Math.floor(Math.max(0, tempoRestante) / 3);
  // Texto limpo identificado corretamente vale 10 pontos — mesmo peso
  // que um indício acertado, pois exige o mesmo discernimento crítico.
  const bonusTextoLimpo = gabarito.size === 0 && marcouSemIndicios ? 10 : 0;
  const bruto = acertos.length * 10 - totalErros * 5 + bonusTempo + bonusTextoLimpo;
  const pontos = Math.max(0, bruto);

  return { acertos, perdidos, erros, bonusTempo, pontos };
}

/**
 * Caso especial: texto "limpo" (gabarito vazio).
 *
 * Se o jogador não marca nada, acertou. Mas o array `acertos` fica
 * vazio, o que deixaria a nota zero. A função acima já lida bem —
 * `bonusTempo` é o único componente positivo. Ainda assim, uma
 * pequena recompensa fixa por "acertar o vazio" ajuda a manter o
 * incentivo de não clicar à toa.
 */
export function acertouTextoLimpo(
  texto: TextoJogo,
  selecionados: Set<string>,
): boolean {
  return texto.indicios_corretos.length === 0 && selecionados.size === 0;
}
