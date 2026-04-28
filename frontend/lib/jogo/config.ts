/**
 * Configurações de preferência do Detetive LUPA.
 * Salvas no localStorage do navegador, persistem entre sessões.
 */

const CHAVE_CONFIG = "lupa_config";

export type ConfigJogo = {
  comCronometro: boolean;
};

const PADRAO: ConfigJogo = { comCronometro: true };

export function carregarConfig(): ConfigJogo {
  if (typeof window === "undefined") return PADRAO;
  try {
    const raw = localStorage.getItem(CHAVE_CONFIG);
    if (!raw) return PADRAO;
    return { ...PADRAO, ...(JSON.parse(raw) as Partial<ConfigJogo>) };
  } catch {
    return PADRAO;
  }
}

export function salvarConfig(config: ConfigJogo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
}
