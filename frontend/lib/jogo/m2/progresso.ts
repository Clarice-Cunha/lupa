const CHAVE_STORAGE = "lupa_progresso_m2";

export type ProgressoM2 = {
  textosVistos: string[];
  pontosTotal: number;
  rodadasJogadas: number;
  indiciosTotais: number;
  acertosTotal: number;
  conquistas: string[];
  recordePontos: number;
  estatisticasPorIndicio: Record<string, { acertos: number; visto: number }>;
};

function criarProgressoInicial(): ProgressoM2 {
  return {
    textosVistos: [],
    pontosTotal: 0,
    rodadasJogadas: 0,
    indiciosTotais: 0,
    acertosTotal: 0,
    conquistas: [],
    recordePontos: 0,
    estatisticasPorIndicio: {},
  };
}

export function carregarProgressoM2(): ProgressoM2 {
  if (typeof window === "undefined") return criarProgressoInicial();
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    if (!raw) return criarProgressoInicial();
    const salvo = JSON.parse(raw) as ProgressoM2;
    if (!salvo.textosVistos) return criarProgressoInicial();
    if (!salvo.conquistas) salvo.conquistas = [];
    if (!salvo.estatisticasPorIndicio) salvo.estatisticasPorIndicio = {};
    if (salvo.recordePontos === undefined) salvo.recordePontos = 0;
    return salvo;
  } catch {
    return criarProgressoInicial();
  }
}

export function salvarProgressoM2(p: ProgressoM2): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(p));
}

export function resetarM2ParaNovoJogo(conquistasAnteriores: string[]): ProgressoM2 {
  const novo = criarProgressoInicial();
  novo.conquistas = conquistasAnteriores;
  salvarProgressoM2(novo);
  return novo;
}

export function registrarRodadaM2(
  progresso: ProgressoM2,
  textoId: string,
  pontos: number,
  totalTextos: number,
  acertosRodada: number,
  indiciosNoTexto: number,
  acertouTextoLimpo: boolean = false,
  rodadaPerfeita: boolean = false,
  acertosIds: string[] = [],
  indiciosNoTextoIds: string[] = [],
): { novoProgresso: ProgressoM2; mundoConcluido: boolean; novasConquistas: string[] } {
  const conquistasAtuais = progresso.conquistas ?? [];
  const novasConquistas: string[] = [];

  const statsAtuais = { ...(progresso.estatisticasPorIndicio ?? {}) };
  for (const id of indiciosNoTextoIds) {
    const s = statsAtuais[id] ?? { acertos: 0, visto: 0 };
    statsAtuais[id] = { ...s, visto: s.visto + 1 };
  }
  for (const id of acertosIds) {
    const s = statsAtuais[id] ?? { acertos: 0, visto: 0 };
    statsAtuais[id] = { ...s, acertos: s.acertos + 1 };
  }

  const vistos = [...progresso.textosVistos];
  if (!vistos.includes(textoId)) vistos.push(textoId);

  const novoIndicios = progresso.indiciosTotais + (indiciosNoTexto > 0 ? indiciosNoTexto : 1);
  const novoAcertos =
    progresso.acertosTotal +
    (indiciosNoTexto > 0 ? acertosRodada : acertouTextoLimpo ? 1 : 0);
  const novosPontos = progresso.pontosTotal + pontos;

  if (
    rodadaPerfeita &&
    indiciosNoTexto > 0 &&
    !conquistasAtuais.includes("analise_perfeita_m2")
  ) {
    novasConquistas.push("analise_perfeita_m2");
  }

  let mundoConcluido = false;
  if (vistos.length >= totalTextos) {
    mundoConcluido = true;
    const taxa = novoIndicios > 0 ? novoAcertos / novoIndicios : 1;
    if (taxa >= 0.75 && !conquistasAtuais.includes("analista_fontes")) {
      novasConquistas.push("analista_fontes");
    }
  }

  const novoProgresso: ProgressoM2 = {
    textosVistos: vistos,
    pontosTotal: novosPontos,
    rodadasJogadas: progresso.rodadasJogadas + 1,
    indiciosTotais: novoIndicios,
    acertosTotal: novoAcertos,
    conquistas: [...conquistasAtuais, ...novasConquistas],
    recordePontos: Math.max(progresso.recordePontos ?? 0, novosPontos),
    estatisticasPorIndicio: statsAtuais,
  };

  salvarProgressoM2(novoProgresso);
  return { novoProgresso, mundoConcluido, novasConquistas };
}
