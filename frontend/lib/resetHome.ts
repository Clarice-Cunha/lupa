/**
 * Canal simples entre a navbar e a página inicial.
 *
 * A página registra sua função de reinício aqui. A navbar chama
 * chamarReset() quando o usuário clica em "Início" ou no logo
 * já estando na página "/", evitando que o resultado fique preso
 * na tela sem que o Next.js recarregue o componente.
 */

let _fn: (() => void) | null = null;

export function registrarReset(fn: () => void): void {
  _fn = fn;
}

export function chamarReset(): void {
  _fn?.();
}
