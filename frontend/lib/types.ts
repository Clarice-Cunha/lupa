/**
 * Formatos dos dados que o frontend e o backend trocam.
 * TypeScript usa isso para garantir, em tempo de desenvolvimento,
 * que estamos enviando/lendo os campos certos.
 */

export type Camada = "fonte" | "conteudo" | "geral";

export type Justificativa = {
  criterio: string;
  resultado: string;
  impacto: number; // positivo ou negativo
  camada: Camada;  // qual camada de análise (PRD §9)
};

export type FonteSugerida = {
  nome: string;
  url: string;
  descricao: string;
};

export type FonteWeb = {
  titulo: string;
  url: string;
  descricao: string;
};

export type AlertaImagem = {
  nivel: "info" | "aviso" | "alerta";
  mensagem: string;
};

export type LinkBuscaReversa = {
  nome: string;
  url: string;
  descricao: string;
};

export type RespostaImagem = {
  nome_arquivo: string;
  formato: string;
  largura: number;
  altura: number;
  tem_exif: boolean;
  data_criacao: string | null;
  fabricante_camera: string | null;
  modelo_camera: string | null;
  software: string | null;
  tem_gps: boolean;
  latitude: number | null;
  longitude: number | null;
  alertas: AlertaImagem[];
  links_busca_reversa: LinkBuscaReversa[];
};

export type RespostaAnalise = {
  url: string;
  pontuacao: number;          // 0 a 100
  classificacao: string;      // "Confiável" | "Requer Atenção" | "Suspeito"
  cor: string;                // hexadecimal, ex: "#4CAF50"
  titulo_pagina: string | null;
  resumo: string | null;      // resumo gerado por IA (pode vir ausente)
  justificativas: Justificativa[];
  dicas_personalizadas: string[];
  fontes_sugeridas: FonteSugerida[];
  fontes_web: FonteWeb[];
};
