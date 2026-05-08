/**
 * Banco de perguntas do Mundo 5 — Chefe Final: Campanha Coordenada.
 *
 * Três tipos de inimigo representam os pilares das operações de desinformação em escala:
 *   botnet    🕸️ — redes de contas automatizadas que amplificam conteúdo falso
 *   narrativa 🎯 — narrativas falsas coordenadas que simulam múltiplas fontes independentes
 *   astroturf 🌿 — movimentos de aparência popular financiados por interesses ocultos
 */

import type { PerguntaAventura } from "./tipos";

export const PERGUNTAS_MUNDO5: PerguntaAventura[] = [
  {
    id: "botnet1",
    tipoInimigo: "botnet",
    nomeInimigo: "Hashtag Fabricada",
    situacao:
      "Uma hashtag sobe ao topo dos trending topics em menos de uma hora. Ao analisar os perfis que a publicaram, você percebe que todos foram criados no mesmo dia, têm poucas publicações e seguem exatamente as mesmas contas.",
    enunciado: "O que esses sinais indicam sobre o trending topic?",
    opcoes: [
      {
        texto: "São características clássicas de uma rede de bots. O trending foi artificialmente inflado por contas automatizadas, não por interesse orgânico real da população.",
        correta: true,
        feedback:
          "Exato! Bots são programados para criar trending topics falsos, simulando interesse popular. Ferramentas como o Botometer (Indiana University) ajudam a identificar contas automatizadas. Trending topics fabricados são usados para dar visibilidade a narrativas que não teriam alcance orgânico.",
      },
      {
        texto: "Um assunto pode viralizar naturalmente em pouco tempo — isso não é prova suficiente de manipulação.",
        correta: false,
        feedback:
          "Viralizações orgânicas acontecem, mas o padrão descrito é diferente: contas criadas no mesmo dia, sem histórico, seguindo as mesmas contas e publicando de forma coordenada. A combinação desses fatores é um sinal forte de rede de bots — não de engajamento espontâneo.",
      },
    ],
  },
  {
    id: "botnet2",
    tipoInimigo: "botnet",
    nomeInimigo: "Petição Inflada",
    situacao:
      "Uma petição online reúne 500 mil assinaturas em 24 horas. Ao verificar os perfis, a maioria foi criada recentemente, tem fotos genéricas (imagens de stock) e usa padrões de nome suspeitos como 'usuario123' e 'perfil456'.",
    enunciado: "Como verificar se uma petição ou campanha online tem suporte real?",
    opcoes: [
      {
        texto: "Analisar os perfis participantes: contas com pouca atividade, fotos genéricas, data de criação recente e padrões repetitivos de nome são sinais de contas falsas criadas para inflar os números.",
        correta: true,
        feedback:
          "Ferramentas como Botometer e a própria análise manual de perfis revelam padrões de automação. Petições com alto volume repentino e perfis suspeitos devem ser tratadas como artificialmente infladas até que se prove o contrário.",
      },
      {
        texto: "500 mil assinaturas é uma quantidade grande demais para ser fabricada — bots não conseguem gerar esse volume.",
        correta: false,
        feedback:
          "Redes de bots podem gerar milhões de interações em poucas horas. Volume alto é precisamente a característica que torna esses ataques eficazes — a percepção de 'muita gente apoia isso' influencia quem ainda não formou opinião.",
      },
    ],
  },
  {
    id: "botnet3",
    tipoInimigo: "botnet",
    nomeInimigo: "Amplificação Coordenada",
    situacao:
      "Uma informação falsa sobre um candidato começa a circular. Em poucas horas, centenas de contas diferentes publicam a mesma frase, quase palavra por palavra, em horários ligeiramente espaçados para parecer orgânico.",
    enunciado: "O que esse comportamento coordenado revela sobre a campanha de desinformação?",
    opcoes: [
      {
        texto: "É uma rede de amplificação coordenada. A repetição quase idêntica do texto revela automação ou coordenação centralizada — campanhas orgânicas produzem variações naturais de linguagem.",
        correta: true,
        feedback:
          "Pesquisadores de desinformação chamam isso de 'astroturfing textual'. Quando centenas de perfis usam exatamente as mesmas palavras, é sinal de que receberam instrução centralizada ou são contas automatizadas. Diversidade de linguagem é um traço de engajamento genuíno.",
      },
      {
        texto: "Quando algo é verdadeiro, as pessoas naturalmente usam as mesmas palavras para descrevê-lo — isso é uma característica de informação clara.",
        correta: false,
        feedback:
          "Clareza de informação não produz cópias idênticas em centenas de contas. Pessoas reais reinterpretam, adicionam contexto e variam o vocabulário. A uniformidade textual em massa é um marcador técnico de operação coordenada, não de verdade.",
      },
    ],
  },
  {
    id: "botnet4",
    tipoInimigo: "botnet",
    nomeInimigo: "Inundação de Ruído",
    situacao:
      "Uma reportagem investigativa sobre corrupção é publicada. Em minutos, a seção de comentários é inundada com ataques à jornalista e desvios do tema, tornando impossível qualquer discussão construtiva sobre o conteúdo.",
    enunciado: "Essa tática de inundar comentários com ataques é uma forma de desinformação?",
    opcoes: [
      {
        texto: "Sim. É chamada de 'inundação do espaço informacional': busca não refutar a reportagem, mas tornar impossível a discussão racional ao saturar o espaço com ruído e ataques pessoais.",
        correta: true,
        feedback:
          "Essa tática é usada especificamente para desviar a atenção de informações inconvenientes. Ao inundar o espaço com ruído, os operadores impedem que o público discuta o mérito da investigação. Não é debate — é sabotagem deliberada da informação.",
      },
      {
        texto: "Não, comentários são livre expressão de opiniões — qualquer pessoa pode comentar o que quiser em qualquer publicação.",
        correta: false,
        feedback:
          "Liberdade de expressão e operação coordenada de sabotagem são coisas diferentes. Quando centenas de contas inundam comentários de forma sincronizada com ataques pessoais, estão usando a liberdade de expressão como ferramenta de censura indireta — impedindo o debate real.",
      },
    ],
  },
  {
    id: "narrativa1",
    tipoInimigo: "narrativa",
    nomeInimigo: "Notícia Espelhada",
    situacao:
      "Três portais de notícias desconhecidos publicam, no mesmo dia, matérias com a mesma afirmação falsa, usando fontes anônimas diferentes, mas com argumentos e estrutura de texto idênticos.",
    enunciado: "O que a publicação simultânea de informações falsas idênticas em vários portais sugere?",
    opcoes: [
      {
        texto: "Sugere coordenação centralizada. É uma técnica para criar a ilusão de 'múltiplas fontes independentes' confirmando a mesma história — quando na verdade todas apontam para uma única origem falsa.",
        correta: true,
        feedback:
          "Essa técnica é chamada de 'content farm coordination'. Os portais podem parecer independentes, mas publicam conteúdo produzido centralmente. Sempre verifique a data de fundação dos portais, quem é o responsável editorial e se as 'fontes anônimas' se repetem entre as publicações.",
      },
      {
        texto: "Se vários portais publicaram a mesma coisa ao mesmo tempo, é mais provável que a informação seja verdadeira — a coincidência confirmaria o fato.",
        correta: false,
        feedback:
          "Publicação simultânea em múltiplos portais é exatamente o que operações de desinformação buscam criar. A aparência de 'múltiplas fontes confirmando' é construída intencionalmente para aumentar a credibilidade percebida de uma história falsa.",
      },
    ],
  },
  {
    id: "narrativa2",
    tipoInimigo: "narrativa",
    nomeInimigo: "Lavagem de Narrativa",
    situacao:
      "Uma afirmação falsa começa em um fórum obscuro. É republicada por um blog, depois por um site de médio porte, depois citada como 'notícia' por um veículo que parece respeitável — que a cita como se fosse o site de médio porte a fonte original.",
    enunciado: "Como esse processo de 'lavagem' de desinformação funciona?",
    opcoes: [
      {
        texto: "Cada republicação adiciona aparente legitimidade. No final, a desinformação parece ter múltiplas fontes independentes, mas todas apontam para a mesma origem falsa. Rastrear a fonte primária quebra a cadeia.",
        correta: true,
        feedback:
          "Jornalistas chamam isso de 'lavar' a origem da desinformação. Ao rastrear a cadeia de publicações de volta à origem, quase sempre se encontra um fórum anônimo, uma conta suspeita ou um site sem credibilidade. Sempre pergunte: quem publicou isso primeiro, e com qual evidência?",
      },
      {
        texto: "Se um veículo respeitável publicou a informação, ela passou por verificação editorial e pode ser considerada confiável.",
        correta: false,
        feedback:
          "Veículos respeitáveis cometem erros e às vezes publicam sem verificação adequada — especialmente quando a história já 'circulou' o suficiente para parecer estabelecida. A reputação do veículo que republica não valida a origem da informação: é preciso rastrear a fonte primária.",
      },
    ],
  },
  {
    id: "narrativa3",
    tipoInimigo: "narrativa",
    nomeInimigo: "Operação de Influência",
    situacao:
      "Antes de uma eleição, surgem centenas de perfis em redes sociais criados meses antes que passam a publicar, de forma coordenada, a mesma narrativa sobre um candidato, fingindo ser cidadãos comuns de diferentes regiões do país.",
    enunciado: "O que é uma 'operação de influência' e como identificá-la?",
    opcoes: [
      {
        texto: "Operações de influência usam redes de perfis falsos ou coordenados para criar a ilusão de opinião pública espontânea. Sinais: criação em massa no mesmo período, padrões de publicação similares e ausência de atividade anterior.",
        correta: true,
        feedback:
          "A operação IRA russa de 2016 (Internet Research Agency) é o exemplo mais documentado. Investigações do Facebook e Twitter revelaram que dezenas de milhões de pessoas foram expostas a conteúdo produzido por operações de influência. Plataformas publicam relatórios de transparência sobre redes removidas — é possível estudar os padrões.",
      },
      {
        texto: "Cidadãos que compartilham a mesma visão política naturalmente se organizam e publicam coisas parecidas — isso é normal em democracias e não configura operação.",
        correta: false,
        feedback:
          "Engajamento político orgânico existe, mas tem características diferentes: perfis com histórico de atividade variada, linguagem diversa, discussões sobre temas além da campanha. O que define uma operação de influência é a artificialidade: perfis criados em massa para uma finalidade específica, sem vida digital real.",
      },
    ],
  },
  {
    id: "astroturf1",
    tipoInimigo: "astroturf",
    nomeInimigo: "Movimento de Fachada",
    situacao:
      "Um 'movimento popular' ganha destaque nas redes pedindo a reversão de uma lei ambiental. Ao investigar, descobrimos que o domínio do site foi registrado por uma empresa de relações públicas contratada por indústrias do setor afetado.",
    enunciado: "O que é astroturfing e por que é uma forma de desinformação?",
    opcoes: [
      {
        texto: "Astroturfing é criar a aparência de movimento popular orgânico quando na verdade é uma campanha financiada por interesses específicos. Engana o público sobre o real suporte que uma posição tem na sociedade.",
        correta: true,
        feedback:
          "O nome vem da grama artificial 'AstroTurf' — simula algo natural que na verdade é fabricado. Ao descobrir que um 'movimento cidadão' é financiado pela indústria afetada pela lei, toda a percepção de legitimidade desmorona. Sempre verifique quem registrou o domínio (WHOIS) e quem financia a organização.",
      },
      {
        texto: "Empresas também têm direito de se organizar e defender seus interesses — fazer isso publicamente não é desinformação.",
        correta: false,
        feedback:
          "O problema não é defender interesses, mas fazê-lo fingindo ser um movimento popular espontâneo. A desinformação está na ocultação da origem: se a campanha fosse transparente sobre quem a financia, o público poderia avaliar corretamente os interesses por trás das mensagens.",
      },
    ],
  },
  {
    id: "astroturf2",
    tipoInimigo: "astroturf",
    nomeInimigo: "Especialista de Fachada",
    situacao:
      "Um 'especialista independente' aparece em vídeos virais criticando uma vacina. Ao investigar, ele não tem formação na área de saúde e é pago por grupos que se opõem a políticas de vacinação.",
    enunciado: "Como verificar se um especialista que aparece em campanhas online é legítimo?",
    opcoes: [
      {
        texto: "Verificar formação acadêmica em fontes oficiais (currículo Lattes, instituições), buscar conflitos de interesse declarados e checar se é reconhecido por pares na área — não apenas por grupos com agenda política ou comercial.",
        correta: true,
        feedback:
          "No Brasil, o Currículo Lattes (CNPq) é uma fonte confiável para verificar a formação de pesquisadores. Especialistas legítimos publicam em periódicos revisados por pares, são citados por colegas da área e têm vínculos institucionais verificáveis. Ausência dessas credenciais em uma área técnica é um sinal de alerta.",
      },
      {
        texto: "Se a pessoa aparece em vídeos com visual profissional, usa termos técnicos e fala com confiança, provavelmente é especialista legítimo.",
        correta: false,
        feedback:
          "Aparência profissional e vocabulário técnico são facilmente simulados. Operações de desinformação investem em produção de vídeo de qualidade. O que valida um especialista é seu histórico verificável na área — não a qualidade de sua apresentação.",
      },
    ],
  },
  {
    id: "astroturf3",
    tipoInimigo: "astroturf",
    nomeInimigo: "Boicote Fabricado",
    situacao:
      "Uma campanha de 'consumidores indignados' exige o boicote a uma empresa. Ao investigar os perfis que lideram a campanha, todos foram criados no mesmo dia e têm o mesmo padrão de publicação.",
    enunciado: "Qual é o objetivo principal do astroturfing em campanhas de desinformação?",
    opcoes: [
      {
        texto: "Criar a ilusão de suporte popular espontâneo para uma posição, tornando-a mais aceitável socialmente. A percepção de que 'muitas pessoas comuns pensam assim' influencia quem ainda não formou opinião.",
        correta: true,
        feedback:
          "Esse é o mecanismo central: explorar a prova social. Seres humanos são influenciados pelo comportamento percebido de outros. Ao fabricar a aparência de movimento popular, o astroturfing manipula essa tendência psicológica para fazer posições minoritárias (ou de grupos específicos) parecerem majoritárias.",
      },
      {
        texto: "O objetivo é apenas aumentar a visibilidade de um assunto nas redes sociais, sem intenção de enganar ninguém.",
        correta: false,
        feedback:
          "A intenção de enganar está no núcleo do astroturfing: esconder a origem e o financiamento para criar uma percepção falsa de engajamento espontâneo. Se fosse apenas visibilidade, a campanha seria transparente sobre quem está por trás dela — a ocultação é o elemento que define a desinformação.",
      },
    ],
  },
];
