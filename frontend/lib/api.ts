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
): Promise<RespostaAnalise> {
  const resposta = await fetch(`${API_URL}/analisar-texto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, origem }),
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

export async function analisarImagem(arquivo: File): Promise<RespostaImagem> {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

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
