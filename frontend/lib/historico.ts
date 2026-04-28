/**
 * Histórico de análises do LUPA — salvo no localStorage do navegador.
 * Nenhum dado é enviado ao servidor. Ao limpar os dados do navegador,
 * o histórico é apagado (comportamento esperado).
 */

import type { RespostaAnalise } from "./types";

const CHAVE_STORAGE = "lupa_historico";
const MAX_ENTRADAS = 10;

export type EntradaHistorico = {
  id: string;
  timestamp: number;
  resultado: RespostaAnalise;
};

export function salvarAnalise(resultado: RespostaAnalise): void {
  if (typeof window === "undefined") return;
  const historico = carregarHistorico();
  const nova: EntradaHistorico = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    resultado,
  };
  const atualizado = [nova, ...historico].slice(0, MAX_ENTRADAS);
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(atualizado));
}

export function carregarHistorico(): EntradaHistorico[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    if (!raw) return [];
    return JSON.parse(raw) as EntradaHistorico[];
  } catch {
    return [];
  }
}

export function limparHistorico(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAVE_STORAGE);
}
