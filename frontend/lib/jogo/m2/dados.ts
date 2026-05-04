import indiciosJson from "./indicios.json";
import textosJson from "./textos.json";
import type { Indicio, TextoJogo } from "../types";

export const INDICIOS_M2: Indicio[] = indiciosJson as unknown as Indicio[];
export const TEXTOS_M2: TextoJogo[] = textosJson as unknown as TextoJogo[];

export const INDICIOS_M2_POR_ID: Record<string, Indicio> = Object.fromEntries(
  INDICIOS_M2.map((i) => [i.id, i]),
);

export const TOTAL_TEXTOS_M2 = TEXTOS_M2.length;

export function textosM2Embaralhados(): TextoJogo[] {
  return embaralhar([...TEXTOS_M2]);
}

function embaralhar<T>(lista: T[]): T[] {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}
