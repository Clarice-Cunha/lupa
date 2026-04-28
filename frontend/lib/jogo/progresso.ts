/**
 * Gerenciamento de progresso do Detetive LUPA via localStorage.
 *
 * O progresso fica salvo no navegador do jogador — não é enviado
 * para nenhum servidor. Se o jogador limpar os dados do navegador,
 * o progresso é perdido (comportamento esperado no MVP).
 */

import type { NivelDificuldade } from "./types";

const CHAVE_STORAGE = "lupa_progresso";

const ORDEM_NIVEIS: NivelDificuldade[] = ["facil", "medio", "dificil"];

export type ProgressoJogo = {
  nivelAtual: NivelDificuldade;
  textosVistosPorNivel: Record<NivelDificuldade, string[]>;
  pontosPorNivel: Record<NivelDificuldade, number>;
  /** Total de indícios que existiam nos textos jogados neste nível. */
  indiciosTotaisPorNivel: Record<NivelDificuldade, number>;
  /** Total de indícios que o jogador acertou neste nível. */
  acertosPorNivel: Record<NivelDificuldade, number>;
  pontosTotal: number;
  rodadasJogadas: number;
  /** IDs das conquistas (badges) desbloqueadas pelo jogador. */
  conquistas: string[];
};

function criarProgressoInicial(): ProgressoJogo {
  return {
    nivelAtual: "facil",
    textosVistosPorNivel: { facil: [], medio: [], dificil: [] },
    pontosPorNivel: { facil: 0, medio: 0, dificil: 0 },
    indiciosTotaisPorNivel: { facil: 0, medio: 0, dificil: 0 },
    acertosPorNivel: { facil: 0, medio: 0, dificil: 0 },
    pontosTotal: 0,
    rodadasJogadas: 0,
    conquistas: [],
  };
}

export function carregarProgresso(): ProgressoJogo {
  if (typeof window === "undefined") return criarProgressoInicial();
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    if (!raw) return criarProgressoInicial();
    const salvo = JSON.parse(raw) as ProgressoJogo;
    if (!salvo.indiciosTotaisPorNivel) return criarProgressoInicial();
    // Garante compatibilidade com saves antigos sem o campo conquistas.
    if (!salvo.conquistas) salvo.conquistas = [];
    return salvo;
  } catch {
    return criarProgressoInicial();
  }
}

export function salvarProgresso(p: ProgressoJogo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(p));
}

export function resetarProgresso(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAVE_STORAGE);
}

/**
 * Recomeça o jogo do zero, mas preserva as conquistas já desbloqueadas.
 * Usar este em vez de `resetarProgresso` quando o jogador termina o jogo
 * ou clica em "Recomeçar" — assim os badges não são perdidos.
 */
export function resetarParaNovoJogo(conquistasAnteriores: string[]): ProgressoJogo {
  const novo = criarProgressoInicial();
  novo.conquistas = conquistasAnteriores;
  salvarProgresso(novo);
  return novo;
}

/**
 * Registra o resultado de uma rodada e devolve o progresso atualizado.
 *
 * Regra de avanço: quando todos os textos do nível foram jogados e o
 * jogador atingiu >= 75% dos "acertos possíveis", ele avança.
 * - Texto com indícios: cada indício correto identificado = 1 acerto,
 *   cada indício no texto = 1 possível.
 * - Texto limpo: identificar corretamente ("sem indícios") = 1 acerto,
 *   e o texto todo = 1 possível.
 *
 * Conquistas desbloqueadas na rodada são devolvidas em `novasConquistas`.
 */
export function registrarRodada(
  progresso: ProgressoJogo,
  textoId: string,
  pontos: number,
  totalTextosNoNivel: number,
  acertosRodada: number,
  indiciosNoTexto: number,
  acertouTextoLimpo: boolean = false,
  rodadaPerfeita: boolean = false,
): { novoProgresso: ProgressoJogo; avancouNivel: boolean; novasConquistas: string[] } {
  const nivel = progresso.nivelAtual;
  const conquistasAtuais = progresso.conquistas ?? [];
  const novasConquistas: string[] = [];

  const vistos = [...progresso.textosVistosPorNivel[nivel]];
  if (!vistos.includes(textoId)) vistos.push(textoId);

  const novoProgresso: ProgressoJogo = {
    ...progresso,
    textosVistosPorNivel: {
      ...progresso.textosVistosPorNivel,
      [nivel]: vistos,
    },
    pontosPorNivel: {
      ...progresso.pontosPorNivel,
      [nivel]: progresso.pontosPorNivel[nivel] + pontos,
    },
    indiciosTotaisPorNivel: {
      ...progresso.indiciosTotaisPorNivel,
      // Texto limpo conta como 1 "possível" — o jogador tinha a chance
      // de marcar "sem indícios" corretamente.
      [nivel]: progresso.indiciosTotaisPorNivel[nivel] + (indiciosNoTexto > 0 ? indiciosNoTexto : 1),
    },
    acertosPorNivel: {
      ...progresso.acertosPorNivel,
      // Texto limpo acertado = 1 acerto; textos com indícios = quantidade acertada.
      [nivel]: progresso.acertosPorNivel[nivel] + (indiciosNoTexto > 0 ? acertosRodada : (acertouTextoLimpo ? 1 : 0)),
    },
    pontosTotal: progresso.pontosTotal + pontos,
    rodadasJogadas: progresso.rodadasJogadas + 1,
    conquistas: conquistasAtuais,
  };

  // --- Conquistas da rodada ---
  const jaTemOlhoVivo = conquistasAtuais.includes("olho_vivo");
  if (acertouTextoLimpo && !jaTemOlhoVivo) {
    novasConquistas.push("olho_vivo");
  }

  const jaTemAnalisePerfeita = conquistasAtuais.includes("analise_perfeita");
  if (rodadaPerfeita && indiciosNoTexto > 0 && !jaTemAnalisePerfeita) {
    novasConquistas.push("analise_perfeita");
  }

  // --- Conquistas de conclusão de nível ---
  let avancouNivel = false;

  if (vistos.length >= totalTextosNoNivel) {
    const totalIndicios = novoProgresso.indiciosTotaisPorNivel[nivel];
    const totalAcertos = novoProgresso.acertosPorNivel[nivel];
    const taxa = totalIndicios > 0 ? totalAcertos / totalIndicios : 1;
    const idx = ORDEM_NIVEIS.indexOf(nivel);

    if (taxa >= 0.75) {
      // Badge pelo nível concluído
      const badgePorNivel: Record<NivelDificuldade, string> = {
        facil: "aprendiz",
        medio: "investigador",
        dificil: "detetive_lupa",
      };
      const badge = badgePorNivel[nivel];
      if (!conquistasAtuais.includes(badge) && !novasConquistas.includes(badge)) {
        novasConquistas.push(badge);
      }

      if (idx < ORDEM_NIVEIS.length - 1) {
        novoProgresso.nivelAtual = ORDEM_NIVEIS[idx + 1];
        avancouNivel = true;
      }
    }
  }

  novoProgresso.conquistas = [...conquistasAtuais, ...novasConquistas];
  salvarProgresso(novoProgresso);
  return { novoProgresso, avancouNivel, novasConquistas };
}

/** Limpa o progresso de um nível específico para o jogador tentar de novo. */
export function resetarNivel(
  progresso: ProgressoJogo,
  nivel: NivelDificuldade,
): ProgressoJogo {
  const novo: ProgressoJogo = {
    ...progresso,
    textosVistosPorNivel: {
      ...progresso.textosVistosPorNivel,
      [nivel]: [],
    },
    pontosPorNivel: {
      ...progresso.pontosPorNivel,
      [nivel]: 0,
    },
    indiciosTotaisPorNivel: {
      ...progresso.indiciosTotaisPorNivel,
      [nivel]: 0,
    },
    acertosPorNivel: {
      ...progresso.acertosPorNivel,
      [nivel]: 0,
    },
  };
  salvarProgresso(novo);
  return novo;
}

export function proximoNivel(
  nivel: NivelDificuldade,
): NivelDificuldade | null {
  const idx = ORDEM_NIVEIS.indexOf(nivel);
  return idx < ORDEM_NIVEIS.length - 1 ? ORDEM_NIVEIS[idx + 1] : null;
}
