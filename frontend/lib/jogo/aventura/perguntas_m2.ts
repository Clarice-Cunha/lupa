/**
 * Banco de perguntas do Mundo 2 — Fontes e Evidências.
 *
 * Três tipos de inimigo representam os erros mais comuns ao avaliar fontes:
 *   conflito  💰 — conflito de interesse (quem financia a pesquisa?)
 *   citacao   ✂️ — citação fora de contexto (frase cortada ou distorcida)
 *   correlacao 📊 — correlação ≠ causalidade (dois fatos juntos não provam causa)
 */

import type { PerguntaAventura } from "./tipos";

export const PERGUNTAS_MUNDO2: PerguntaAventura[] = [
  {
    id: "conflito1",
    tipoInimigo: "conflito",
    nomeInimigo: "Conflito de Interesse",
    situacao:
      "Um estudo afirma que refrigerantes não causam obesidade em doses moderadas. O financiador da pesquisa? Uma grande empresa de bebidas.",
    enunciado: "Como você avalia a credibilidade desse estudo?",
    opcoes: [
      {
        texto: "Com cautela: quem financiou tem interesse no resultado. Busco estudos independentes.",
        correta: true,
        feedback:
          "Correto! Pesquisas financiadas pela indústria tendem a favorecer o financiador. Isso não torna o estudo automaticamente falso, mas exige comparação com outras fontes independentes.",
      },
      {
        texto: "Confio plenamente: pesquisadores são sempre imparciais.",
        correta: false,
        feedback:
          "Atenção! Mesmo bons pesquisadores podem sofrer influência de quem financia. Sempre verifique quem pagou a pesquisa e se há estudos independentes com conclusões diferentes.",
      },
    ],
  },
  {
    id: "citacao1",
    tipoInimigo: "citacao",
    nomeInimigo: "Citação Distorcida",
    situacao:
      'Manchete: "Cientista diz: vacinas podem ser perigosas!" O texto original: "Vacinas têm efeitos colaterais raros, mas os benefícios superam amplamente os riscos."',
    enunciado: "O que aconteceu com a declaração do cientista?",
    opcoes: [
      {
        texto: "A frase foi cortada pela metade, invertendo o sentido original da declaração.",
        correta: true,
        feedback:
          "Exato! Omitir a parte 'mas os benefícios superam amplamente os riscos' transforma uma afirmação pró-vacina em anti-vacina. Sempre leia a citação completa e o contexto.",
      },
      {
        texto: "O cientista realmente é contra vacinas — está nas aspas.",
        correta: false,
        feedback:
          "Cuidado! A citação omite a conclusão mais importante. Sempre procure o trecho completo e o contexto original antes de tirar conclusões.",
      },
    ],
  },
  {
    id: "correlacao1",
    tipoInimigo: "correlacao",
    nomeInimigo: "Correlação Falsa",
    situacao:
      '"Países com mais sorvete vendido têm mais afogamentos. Logo: sorvete causa afogamento!"',
    enunciado: "O que há de errado nesse raciocínio?",
    opcoes: [
      {
        texto: "Correlação não é causalidade: o calor do verão aumenta tanto o consumo de sorvete quanto os banhos de mar.",
        correta: true,
        feedback:
          "Perfeito! É um exemplo clássico de variável oculta. Os dois fenômenos ocorrem juntos por causa do calor, mas um não causa o outro. Isso se chama correlação espúria.",
      },
      {
        texto: "O estudo tem razão: se os dados mostram correlação, há causalidade.",
        correta: false,
        feedback:
          "Errado! Correlação mostra que dois fenômenos ocorrem juntos, mas não prova causa. Quase sempre há uma terceira variável explicando ambos.",
      },
    ],
  },
  {
    id: "conflito2",
    tipoInimigo: "conflito",
    nomeInimigo: "Fonte Anônima",
    situacao:
      '"Segundo fontes que preferiram não se identificar, o governo planeja aumentar impostos em 50%." Nenhum documento ou declaração oficial apoia a afirmação.',
    enunciado: "Como você trata essa informação?",
    opcoes: [
      {
        texto: "Com ceticismo: fontes anônimas sem documentos exigem corroboração oficial antes de ser tratadas como fato.",
        correta: true,
        feedback:
          "Correto! Fontes anônimas são legítimas no jornalismo, mas uma afirmação de grande impacto sem documentação não deve ser tratada como confirmada.",
      },
      {
        texto: "Confio: se o veículo publicou, a fonte é confiável.",
        correta: false,
        feedback:
          "Atenção! Mesmo veículos sérios publicam informações que depois são desmentidas. Uma afirmação de grande impacto precisa de corroboração — documentos ou declarações oficiais.",
      },
    ],
  },
  {
    id: "citacao2",
    tipoInimigo: "citacao",
    nomeInimigo: "Autoridade Fora da Área",
    situacao:
      "Um cardiologista famoso posta nas redes: 'O método X de alfabetização é comprovadamente superior — a ciência prova!' Sem citar estudos pedagógicos.",
    enunciado: "Por que você deve avaliar essa afirmação com cuidado?",
    opcoes: [
      {
        texto: "Expertise em medicina não garante autoridade em pedagogia. São áreas distintas com evidências próprias.",
        correta: true,
        feedback:
          "Correto! Isso se chama 'apelo à autoridade indevida'. A competência do médico em cardiologia não o torna especialista em educação. Para afirmações sobre ensino, busque pedagogos e pesquisas da área.",
      },
      {
        texto: "Médico famoso tem credibilidade geral — posso confiar no que diz sobre educação.",
        correta: false,
        feedback:
          "Cuidado! Especialistas de alta competência em sua área podem se equivocar profundamente em outras. A expertise não é transferível entre domínios.",
      },
    ],
  },
  {
    id: "correlacao2",
    tipoInimigo: "correlacao",
    nomeInimigo: "Anedota como Evidência",
    situacao:
      '"Minha avó tomou chá de erva X e curou a diabetes em duas semanas! Todo mundo deveria tomar."',
    enunciado: "Por que um relato individual não é evidência suficiente para recomendar um tratamento?",
    opcoes: [
      {
        texto: "Um caso pode ser coincidência, placebo ou outro fator. Precisamos de estudos com muitas pessoas e grupo de controle.",
        correta: true,
        feedback:
          "Exato! Relatos pessoais (anedotas) não são evidência científica. A melhora pode ter ocorrido por dieta, medicamento ou placebo. Estudos controlados em larga escala são necessários para provar eficácia.",
      },
      {
        texto: "Se funcionou com uma pessoa, pode funcionar para todos.",
        correta: false,
        feedback:
          "Esse é o raciocínio anedótico. Um caso não representa a população. O que funciona para uma pessoa pode ser prejudicial para outra. A medicina baseada em evidências exige dados de muitos pacientes.",
      },
    ],
  },
  {
    id: "conflito_rn1",
    tipoInimigo: "conflito",
    nomeInimigo: "Especialista Pago",
    situacao:
      "Um médico aparece em comerciais defendendo um suplemento vitamínico e depois dá entrevistas jornalísticas recomendando o mesmo produto 'com base em estudos'.",
    enunciado: "O que você deve verificar antes de confiar na recomendação?",
    opcoes: [
      {
        texto: "Se o médico tem contrato com a empresa do produto — o vínculo financeiro compromete a imparcialidade.",
        correta: true,
        feedback:
          "Correto! Quando um especialista tem relação comercial com quem vende o produto, há conflito de interesse. Isso não prova que ele mente, mas exige que você busque outras opiniões sem esse vínculo.",
      },
      {
        texto: "Ele é médico, então a recomendação é imparcial.",
        correta: false,
        feedback:
          "Atenção! O título de médico não elimina conflito de interesse. Um especialista pago para promover um produto tem incentivo financeiro para fazê-lo — isso deve ser declarado e considerado na avaliação.",
      },
    ],
  },
];
