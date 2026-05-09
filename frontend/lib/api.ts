/**
 * Cliente da API do backend do LUPA.
 * Centraliza todas as chamadas de rede em um único lugar.
 */

import type { RespostaAnalise, RespostaImagem } from "./types";

// Endereço do backend. Em desenvolvimento, roda em localhost:8000.
// Em produção, trocar pela URL pública (variável de ambiente).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function analisarUrl(url: string): Promise<RespostaAnalise> {
  const resposta = await fetch(`${API_URL}/analisar-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!resposta.ok) {
    // Tenta ler a mensagem de erro que o FastAPI devolve em `detail`
    let mensagem = `Erro ${resposta.status}`;
    try {
      const dados = await resposta.json();
      if (dados?.detail) mensagem = dados.detail;
    } catch {
      // ignora — fica a mensagem padrão
    }
    throw new Error(mensagem);
  }

  return (await resposta.json()) as RespostaAnalise;
}

export async function analisarUpload(
  arquivo: File,
  contexto: string,
): Promise<RespostaAnalise> {
  // `FormData` empacota arquivo + campos no formato multipart/form-data.
  // É o mesmo formato que um <form> HTML envia quando tem <input type="file">.
  const dados = new FormData();
  dados.append("arquivo", arquivo);
  dados.append("contexto", contexto);

  const resposta = await fetch(`${API_URL}/analisar-upload`, {
    method: "POST",
    body: dados,
    // Importante: NÃO setar Content-Type — o navegador insere o
    // "boundary" correto automaticamente para multipart.
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const dados = await resposta.json();
      if (dados?.detail) mensagem = dados.detail;
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }

  return (await resposta.json()) as RespostaAnalise;
}

export async function analisarTexto(
  texto: string,
  origem: string,
  suspeita = "",
): Promise<RespostaAnalise> {
  const resposta = await fetch(`${API_URL}/analisar-texto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, origem, suspeita }),
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = d.detail;
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }

  return (await resposta.json()) as RespostaAnalise;
}

// ============================================================
// Portal comunitário de boatos
// ============================================================

export type CategoriaBoato = "cidade" | "escola" | "condominio";

export type StatusBoato =
  | "pendente"
  | "em_apuracao"
  | "verificado_verdadeiro"
  | "verificado_falso"
  | "inconclusivo";

export type Boato = {
  id: string;
  categoria: CategoriaBoato;
  localidade: string;
  descricao: string;
  contato: string | null;
  status: StatusBoato;
  checagem: string | null;
  fontes: string[];
  criado_em: string;
  atualizado_em: string;
  latitude?: number | null;
  longitude?: number | null;
};

export async function listarBoatos(categoria?: CategoriaBoato): Promise<Boato[]> {
  const qs = categoria ? `?categoria=${categoria}` : "";
  const resposta = await fetch(`${API_URL}/boatos${qs}`);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return (await resposta.json()) as Boato[];
}

export async function enviarBoato(dados: {
  categoria: CategoriaBoato;
  localidade: string;
  descricao: string;
  contato?: string;
  latitude?: number | null;
  longitude?: number | null;
}): Promise<Boato> {
  const resposta = await fetch(`${API_URL}/boatos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (Array.isArray(d?.detail)) {
        mensagem = d.detail.map((e: { msg?: string }) => e.msg ?? "").join("; ");
      } else if (d?.detail) {
        mensagem = String(d.detail);
      }
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as Boato;
}

export async function atualizarBoato(
  id: string,
  dados: { status?: StatusBoato; checagem?: string | null; fontes?: string[] },
  chave: string,
): Promise<Boato> {
  const resposta = await fetch(`${API_URL}/boatos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Moderacao-Chave": chave,
    },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as Boato;
}

// ============================================================
// Widget de feedback
// ============================================================

export type Feedback = {
  id: string;
  pagina: string;
  texto: string;
  criado_em: string;
};

export async function enviarFeedback(dados: {
  pagina: string;
  texto: string;
}): Promise<Feedback> {
  const resposta = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return (await resposta.json()) as Feedback;
}

// ============================================================
// Parcerias com escolas
// ============================================================

export type NivelEnsino = "4-5" | "6-7" | "8-9" | "em";

export type Parceria = {
  id: string;
  nome: string;
  escola: string;
  cidade_estado: string;
  email: string;
  niveis: NivelEnsino[];
  como_usar: string;
  criado_em: string;
};

export async function enviarParceria(dados: {
  nome: string;
  escola: string;
  cidade_estado: string;
  email: string;
  niveis: NivelEnsino[];
  como_usar: string;
}): Promise<Parceria> {
  const resposta = await fetch(`${API_URL}/parcerias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (Array.isArray(d?.detail)) {
        mensagem = d.detail.map((e: { msg?: string }) => e.msg ?? "").join("; ");
      } else if (d?.detail) {
        mensagem = String(d.detail);
      }
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as Parceria;
}

// ============================================================
// Portal de colaboração — sugestões e melhorias
// ============================================================

export type Sugestao = {
  id: string;
  nome: string;
  mensagem: string;
  resposta: string | null;
  criado_em: string;
  respondido_em: string | null;
};

export type SugestaoInterno = Sugestao & { email: string | null };

export async function listarSugestoes(): Promise<Sugestao[]> {
  const resposta = await fetch(`${API_URL}/sugestoes`);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return (await resposta.json()) as Sugestao[];
}

export async function listarSugestoesInternas(chave: string): Promise<SugestaoInterno[]> {
  const resposta = await fetch(`${API_URL}/sugestoes/interno`, {
    headers: { "X-Moderacao-Chave": chave },
  });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return (await resposta.json()) as SugestaoInterno[];
}

export async function enviarSugestao(dados: {
  nome: string;
  email?: string;
  mensagem: string;
}): Promise<Sugestao> {
  const resposta = await fetch(`${API_URL}/sugestoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (Array.isArray(d?.detail)) {
        mensagem = d.detail.map((e: { msg?: string }) => e.msg ?? "").join("; ");
      } else if (d?.detail) {
        mensagem = String(d.detail);
      }
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as Sugestao;
}

export async function responderSugestao(
  id: string,
  resposta: string,
  chave: string,
): Promise<SugestaoInterno> {
  const resp = await fetch(`${API_URL}/sugestoes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Moderacao-Chave": chave,
    },
    body: JSON.stringify({ resposta }),
  });
  if (!resp.ok) {
    let mensagem = `Erro ${resp.status}`;
    try {
      const d = await resp.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
  return (await resp.json()) as SugestaoInterno;
}

// ============================================================
// Modo Professor — turmas e painel
// ============================================================

export type TurmaCriada = {
  codigo: string;
  chave_acesso: string;
  nome_professor: string;
  nome_turma: string;
  criado_em: string;
};

export type AnaliseRegistrada = {
  id: string;
  tipo: string;
  pontuacao: number;
  classificacao: string;
  resumo: string | null;
  criado_em: string;
};

export type PainelTurma = {
  nome_professor: string;
  nome_turma: string;
  codigo: string;
  total_analises: number;
  media_pontuacao: number | null;
  analises: AnaliseRegistrada[];
};

export async function criarTurma(dados: {
  nome_professor: string;
  nome_turma: string;
}): Promise<TurmaCriada> {
  const resposta = await fetch(`${API_URL}/turmas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch { /* ignora */ }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as TurmaCriada;
}

export async function registrarAnaliseTurma(
  codigoTurma: string,
  tipo: "url" | "texto" | "imagem" | "video",
  pontuacao: number,
  classificacao: string,
  resumo?: string,
): Promise<void> {
  // Fire-and-forget: não bloqueia o fluxo principal se falhar.
  await fetch(`${API_URL}/turmas/${codigoTurma}/analises`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, pontuacao, classificacao, resumo: resumo ?? null }),
  });
}

export type TurmaResumida = {
  codigo: string;
  nome_professor: string;
  nome_turma: string;
  criado_em: string;
};

export async function buscarTurmas(
  nomeProfessor: string,
  nomeTurma: string,
  chaveModeracao: string,
): Promise<TurmaResumida[]> {
  const params = new URLSearchParams();
  if (nomeProfessor.trim()) params.set("nome_professor", nomeProfessor.trim());
  if (nomeTurma.trim()) params.set("nome_turma", nomeTurma.trim());
  const resposta = await fetch(`${API_URL}/turmas/buscar?${params.toString()}`, {
    headers: { "X-Moderacao-Chave": chaveModeracao },
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch { /* ignora */ }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as TurmaResumida[];
}

export async function obterPainelTurma(
  codigo: string,
  chaveAcesso: string,
): Promise<PainelTurma> {
  const resposta = await fetch(`${API_URL}/turmas/${codigo}/painel`, {
    headers: { "X-Turma-Chave": chaveAcesso },
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch { /* ignora */ }
    throw new Error(mensagem);
  }
  return (await resposta.json()) as PainelTurma;
}

// ============================================================
// Validação com usuários reais
// ============================================================

export type DepoimentoPublico = {
  id: string;
  nome: string;
  perfil: string;
  depoimento: string;
  criado_em: string;
};

export type ResultadosValidacao = {
  total: number;
  percentual_aprendeu: number;
  percentual_identificou: number;
  percentual_recomendaria: number;
  media_facilidade: number;
  depoimentos: DepoimentoPublico[];
};

export async function obterResultadosValidacao(): Promise<ResultadosValidacao> {
  const resposta = await fetch(`${API_URL}/validacoes/resultados`);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return (await resposta.json()) as ResultadosValidacao;
}

export async function enviarValidacao(dados: {
  nome: string;
  perfil: string;
  aprendeu_algo: boolean;
  identificou_sinal: boolean;
  recomendaria: boolean;
  facilidade: number;
  depoimento: string;
}): Promise<void> {
  const resposta = await fetch(`${API_URL}/validacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = String(d.detail);
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }
}

export async function analisarImagem(arquivo: File, contexto = ""): Promise<RespostaImagem> {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  formData.append("contexto", contexto);

  const resposta = await fetch(`${API_URL}/analisar-imagem`, {
    method: "POST",
    body: formData,
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const d = await resposta.json();
      if (d?.detail) mensagem = d.detail;
    } catch {
      // ignora
    }
    throw new Error(mensagem);
  }

  return (await resposta.json()) as RespostaImagem;
}
