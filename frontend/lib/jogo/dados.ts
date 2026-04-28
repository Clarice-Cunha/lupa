/**
 * Ponto de entrada dos dados do jogo.
 *
 * Importa os JSONs e expõe funções de consulta. Centralizar aqui
 * evita espalhar `import "../../lib/jogo/textos.json"` pelos componentes
 * e facilita trocar a fonte de dados no futuro (ex: API).
 */

import indiciosJson from "./indicios.json";
import textosJson from "./textos.json";
import type { Indicio, NivelDificuldade, TextoJogo } from "./types";

// O TS infere tipos muito específicos para cada objeto literal do JSON
// (ex: nivel: "facil" em um, "medio" em outro), o que impede a
// conversão direta para `TextoJogo[]`. Passamos por `unknown` para
// dizer "confie em mim, conferi o formato".
export const INDICIOS: Indicio[] = indiciosJson as unknown as Indicio[];
export const TEXTOS: TextoJogo[] = textosJson as unknown as TextoJogo[];

/** Mapa id → indício, útil para lookups rápidos. */
export const INDICIOS_POR_ID: Record<string, Indicio> = Object.fromEntries(
  INDICIOS.map((i) => [i.id, i]),
);

/** Devolve textos de um nível embaralhados, limitados a `quantidade` (padrão: 4). */
export function textosDoNivel(nivel: NivelDificuldade, quantidade: number = 4): TextoJogo[] {
  const filtrados = TEXTOS.filter((t) => t.nivel === nivel);
  return embaralhar(filtrados).slice(0, quantidade);
}

/** Embaralha uma cópia do array (Fisher-Yates). Não modifica o original. */
function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
