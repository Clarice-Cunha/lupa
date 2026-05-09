export type Classificacao = "verdadeiro" | "suspeito";

export type IndicadorId =
  | "autoridade_vaga"
  | "linguagem_sensacionalista"
  | "teoria_conspiratoria"
  | "promessa_milagrosa"
  | "fora_de_contexto"
  | "sem_fonte"
  | "fonte_verificavel";

export type Indicador = {
  id: IndicadorId;
  label: string;
  tipo: "alerta" | "confiavel";
};

export type Afirmacao = {
  id: string;
  manchete: string;
  classificacaoCorreta: Classificacao;
  indicadorCorreto: IndicadorId;
  indicadores: IndicadorId[];
  explicacao: string;
};

export const INDICADORES: Record<IndicadorId, Indicador> = {
  autoridade_vaga: {
    id: "autoridade_vaga",
    label: "Autoridade vaga",
    tipo: "alerta",
  },
  linguagem_sensacionalista: {
    id: "linguagem_sensacionalista",
    label: "Linguagem sensacionalista",
    tipo: "alerta",
  },
  teoria_conspiratoria: {
    id: "teoria_conspiratoria",
    label: "Teoria conspiratória",
    tipo: "alerta",
  },
  promessa_milagrosa: {
    id: "promessa_milagrosa",
    label: "Promessa milagrosa",
    tipo: "alerta",
  },
  fora_de_contexto: {
    id: "fora_de_contexto",
    label: "Dado fora de contexto",
    tipo: "alerta",
  },
  sem_fonte: {
    id: "sem_fonte",
    label: "Ausência de fonte",
    tipo: "alerta",
  },
  fonte_verificavel: {
    id: "fonte_verificavel",
    label: "Fonte verificável citada",
    tipo: "confiavel",
  },
};

export const AFIRMACOES: Afirmacao[] = [
  {
    id: "a1",
    manchete:
      "Médicos alertam: café em jejum destrói o fígado silenciosamente — pesquisa revela o que ninguém te conta",
    classificacaoCorreta: "suspeito",
    indicadorCorreto: "autoridade_vaga",
    indicadores: [
      "autoridade_vaga",
      "linguagem_sensacionalista",
      "teoria_conspiratoria",
      "fonte_verificavel",
    ],
    explicacao:
      '"Médicos alertam" e "pesquisa revela" são autoridade vaga: nenhum nome, instituição ou estudo é identificado. Informações de saúde confiáveis sempre dizem quem pesquisou e onde publicou. Na prática, estudos sérios associam o consumo moderado de café a benefícios para o fígado, não a danos.',
  },
  {
    id: "a2",
    manchete:
      "Segundo o IBGE (2023), a expectativa de vida do brasileiro chegou a 76,4 anos, o maior índice já registrado",
    classificacaoCorreta: "verdadeiro",
    indicadorCorreto: "fonte_verificavel",
    indicadores: [
      "fonte_verificavel",
      "autoridade_vaga",
      "promessa_milagrosa",
      "sem_fonte",
    ],
    explicacao:
      "O IBGE publica as tábuas de mortalidade anualmente — citar o órgão e o ano permite verificação direta no site oficial. Não há linguagem exagerada, promessas nem teorias. É um dado factual de fonte oficial acessível a qualquer pessoa.",
  },
  {
    id: "a3",
    manchete:
      "O que as operadoras de telefonia não querem que você saiba: radiação do 5G provoca doenças — estudo confirma",
    classificacaoCorreta: "suspeito",
    indicadorCorreto: "teoria_conspiratoria",
    indicadores: [
      "teoria_conspiratoria",
      "linguagem_sensacionalista",
      "fora_de_contexto",
      "fonte_verificavel",
    ],
    explicacao:
      '"O que [grupo poderoso] não quer que você saiba" é um marcador clássico de teoria conspiratória. Nenhum estudo peer-reviewed comprovou relação entre 5G e doenças. A OMS monitora as emissões de radiofrequência e não identificou riscos nas frequências utilizadas pelo 5G.',
  },
  {
    id: "a4",
    manchete:
      "Segundo a OMS, o tabagismo mata mais de 8 milhões de pessoas por ano, incluindo não fumantes expostos à fumaça",
    classificacaoCorreta: "verdadeiro",
    indicadorCorreto: "fonte_verificavel",
    indicadores: [
      "fonte_verificavel",
      "teoria_conspiratoria",
      "promessa_milagrosa",
      "sem_fonte",
    ],
    explicacao:
      "A OMS publica relatórios periódicos sobre tabagismo disponíveis em seu site (who.int/tobacco). A citação da organização responsável e a ausência de linguagem exagerada ou alarmista são características de conteúdo verificável e confiável.",
  },
  {
    id: "a5",
    manchete:
      "Chá de hibisco emagrece 10 kg em 2 semanas sem dieta nem exercício, confirmam nutricionistas",
    classificacaoCorreta: "suspeito",
    indicadorCorreto: "promessa_milagrosa",
    indicadores: [
      "promessa_milagrosa",
      "autoridade_vaga",
      "fora_de_contexto",
      "fonte_verificavel",
    ],
    explicacao:
      "A promessa de resultado expressivo sem esforço é o principal sinal de alerta: nenhum alimento isolado promove perda de peso significativa. O hibisco tem propriedades antioxidantes, mas sem os efeitos mágicos prometidos. \"Confirmam nutricionistas\" — quais? — é um indício adicional de autoridade vaga, mas o primeiro alerta já está na promessa impossível.",
  },
  {
    id: "a6",
    manchete:
      "Pesquisa de 2003 comprova que a vacina contra sarampo tem eficácia de apenas 68% — ainda vale tomar?",
    classificacaoCorreta: "suspeito",
    indicadorCorreto: "fora_de_contexto",
    indicadores: [
      "fora_de_contexto",
      "sem_fonte",
      "teoria_conspiratoria",
      "fonte_verificavel",
    ],
    explicacao:
      "Usar dados de 20 anos atrás como se fossem atuais é desinformação por contexto. A vacina MMR moderna (2 doses) tem eficácia de 97%. A ciência avança: dados de 2003 não representam o conhecimento atual. A pergunta \"ainda vale tomar?\" ao final induz à dúvida sem base científica.",
  },
  {
    id: "a7",
    manchete:
      "Segundo o Ministério da Saúde, o Brasil vacinou 95,3% das crianças contra sarampo em 2023, superando a meta da OMS",
    classificacaoCorreta: "verdadeiro",
    indicadorCorreto: "fonte_verificavel",
    indicadores: [
      "fonte_verificavel",
      "autoridade_vaga",
      "teoria_conspiratoria",
      "sem_fonte",
    ],
    explicacao:
      "O Ministério da Saúde publica regularmente os dados do PNI (Programa Nacional de Imunizações). Citar o órgão responsável, o percentual preciso e a referência de comparação (meta da OMS) são características de informação verificável e confiável.",
  },
  {
    id: "a8",
    manchete:
      "Pesquisadores comprovam: dormir menos de 6 horas por noite reduz a expectativa de vida em 15 anos",
    classificacaoCorreta: "suspeito",
    indicadorCorreto: "autoridade_vaga",
    indicadores: [
      "autoridade_vaga",
      "fonte_verificavel",
      "promessa_milagrosa",
      "linguagem_sensacionalista",
    ],
    explicacao:
      '"Pesquisadores comprovam" é autoridade vaga: não há nomes, universidade, periódico nem ano de publicação. Estudos reais sobre sono e longevidade existem, mas são nuançados e sempre identificam a fonte. O número preciso de "15 anos" sem qualquer referência é outro sinal de alerta.',
  },
];
