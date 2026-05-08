/**
 * Banco de perguntas do Mundo 4 — Deepfake e Vídeo.
 *
 * Três tipos de inimigo representam as formas mais comuns de enganar com vídeo e áudio:
 *   deepfake  🎭 — rosto ou expressão substituída por IA em vídeo
 *   videoctx  📹 — vídeo real usado fora do contexto original
 *   clonevoz  🎙️ — áudio com voz clonada ou manipulada por IA
 */

import type { PerguntaAventura } from "./tipos";

export const PERGUNTAS_MUNDO4: PerguntaAventura[] = [
  {
    id: "deepfake1",
    tipoInimigo: "deepfake",
    nomeInimigo: "Rosto Sintético",
    situacao:
      "Um vídeo viral mostra um político famoso fazendo um discurso polêmico. O vídeo foi criado com tecnologia deepfake: o rosto é sintético, gerado por inteligência artificial.",
    enunciado: "Como identificar que um vídeo pode ser um deepfake?",
    opcoes: [
      {
        texto: "Observar inconsistências como piscadas anormais, bordas do rosto tremendo, sombras inconsistentes e ausência de micromovimentos naturais. Ferramentas como Deepware Scanner ajudam.",
        correta: true,
        feedback:
          "Correto! Modelos de deepfake ainda falham em detalhes sutis: piscadas, reflexos nos olhos, transição entre rosto e cabelo, e micromovimentos naturais da pele. Ferramentas como Deepware Scanner e o detector do MIT oferecem análise automatizada.",
      },
      {
        texto: "Se a resolução do vídeo é alta e a qualidade é boa, o rosto deve ser real — IA ainda não consegue isso.",
        correta: false,
        feedback:
          "Não é mais verdade. Modelos como DeepFaceLab e FaceSwap produzem deepfakes em alta resolução que enganam facilmente o olho humano. Qualidade não é evidência de autenticidade — é preciso usar ferramentas especializadas.",
      },
    ],
  },
  {
    id: "deepfake2",
    tipoInimigo: "deepfake",
    nomeInimigo: "Lábios Dessincronizados",
    situacao:
      "Um vídeo circula com um CEO famoso anunciando uma fusão milionária. A voz parece convincente, mas a movimentação dos lábios está ligeiramente fora do sincronismo com o áudio.",
    enunciado: "A dessincronização entre lábios e voz é um sinal confiável de deepfake?",
    opcoes: [
      {
        texto: "Sim. Modelos de deepfake ainda têm dificuldade em sincronizar perfeitamente lábios e áudio. Observe especialmente consoantes como 'p', 'b' e 'm' — são as mais difíceis de falsificar.",
        correta: true,
        feedback:
          "Exato! A síntese de movimento labial é um dos pontos mais frágeis dos deepfakes. Assista o vídeo sem som e depois só com o som — se o encaixe parecer artificial em algum momento, é um sinal de alerta importante.",
      },
      {
        texto: "Não, vídeos reais também podem ter esse problema por causa da compressão do arquivo de vídeo.",
        correta: false,
        feedback:
          "Compressão pode causar leve desfoque, mas não dessincronização labial perceptível. Quando os lábios formam consoantes bilabiais ('p', 'b', 'm') de forma inconsistente com o áudio, é um forte indício de manipulação artificial.",
      },
    ],
  },
  {
    id: "deepfake3",
    tipoInimigo: "deepfake",
    nomeInimigo: "Piscada Artificial",
    situacao:
      "Em um vídeo de entrevista, a pessoa parece não piscar de forma natural, e suas sobrancelhas quase não se movem quando ela fala. O restante do vídeo parece completamente normal.",
    enunciado: "Por que a falta de piscadas naturais é um indício de deepfake?",
    opcoes: [
      {
        texto: "Redes neurais que geram rostos são treinadas principalmente com fotos estáticas, onde os olhos estão abertos. Isso faz com que o deepfake pisque com frequência anormal ou não pisque de forma natural.",
        correta: true,
        feedback:
          "Isso mesmo! É uma limitação conhecida dos modelos de deepfake. Pessoas reais piscam entre 15 e 20 vezes por minuto de forma irregular e natural. Um deepfake tende a piscar raramente ou de forma mecânica — preste atenção a isso.",
      },
      {
        texto: "Pessoas reais também piscam de forma irregular quando estão nervosas em entrevistas — esse sinal não é confiável.",
        correta: false,
        feedback:
          "Mesmo sob nervosismo, pessoas reais mantêm padrões biológicos de piscada. A ausência quase total de piscadas, combinada com expressões faciais pouco variadas e bordas do rosto instáveis, é um conjunto de sinais que aponta para deepfake.",
      },
    ],
  },
  {
    id: "deepfake4",
    tipoInimigo: "deepfake",
    nomeInimigo: "Endosso Falso de Celebridade",
    situacao:
      "Um vídeo em redes sociais mostra uma atriz famosa endossando um produto milagroso para emagrecer. A atriz nunca fez tal anúncio — é um deepfake usado em um golpe financeiro.",
    enunciado: "Qual a melhor forma de verificar se o vídeo de endosso de uma celebridade é real?",
    opcoes: [
      {
        texto: "Verificar o perfil oficial da celebridade nas redes sociais e buscar notícias sobre o endosso em veículos de comunicação reconhecidos. Endossos reais são amplamente divulgados.",
        correta: true,
        feedback:
          "Correto! Celebridades e marcas divulgam parcerias oficialmente em múltiplos canais verificados. A ausência de qualquer menção oficial é um sinal claro de fraude. Golpes com deepfake de celebridades são crescentes — sempre vá à fonte.",
      },
      {
        texto: "Se o vídeo tem muitas curtidas e comentários positivos, é porque a celebridade realmente fez o anúncio.",
        correta: false,
        feedback:
          "Curtidas e comentários positivos podem ser comprados ou gerados por bots. Golpes com deepfake de celebridades frequentemente usam anúncios pagos e engajamento artificial para parecer legítimos. Só a fonte oficial confirma um endosso real.",
      },
    ],
  },
  {
    id: "videoctx1",
    tipoInimigo: "videoctx",
    nomeInimigo: "Protesto Importado",
    situacao:
      "Um vídeo de grande tumulto em uma rua é postado com a legenda 'Rebelião em São Paulo — agora!' Na realidade, é uma filmagem de protestos na França, gravada há dois anos.",
    enunciado: "Como verificar a origem real de um vídeo que circula como 'ao vivo' ou 'agora'?",
    opcoes: [
      {
        texto: "Usar ferramentas de busca inversa de vídeo (como InVID/WeVerify) para encontrar a publicação original. Placas de trânsito, idioma das faixas e arquitetura ajudam a identificar o país.",
        correta: true,
        feedback:
          "A extensão InVID/WeVerify permite extrair quadros do vídeo e fazer pesquisa reversa de imagem em cada um. Detalhes visuais como placas, faixas, uniformes policiais e arquitetura são pistas geográficas valiosas para identificar onde o vídeo foi realmente gravado.",
      },
      {
        texto: "Se o vídeo parece de qualidade amadora (tremido, com barulho), é mais provável que seja filmagem real e recente.",
        correta: false,
        feedback:
          "Qualidade amadora não garante autenticidade nem atualidade. Muitos vídeos antigos de celular têm essa aparência. A origem do vídeo precisa ser verificada por pesquisa inversa e análise de detalhes visuais — não pela qualidade da imagem.",
      },
    ],
  },
  {
    id: "videoctx2",
    tipoInimigo: "videoctx",
    nomeInimigo: "Desastre Reciclado",
    situacao:
      "Um vídeo emocionante de resgate de vítimas de enchente é compartilhado como 'tragédia no Sul do Brasil — hoje'. O vídeo é real, mas foi filmado em 2011 no Japão após um tsunami.",
    enunciado: "Por que vídeos reais de desastres antigos são tão frequentemente reutilizados em desinformação?",
    opcoes: [
      {
        texto: "Vídeos de desastres provocam forte reação emocional, que inibe o raciocínio crítico e acelera o compartilhamento. O impacto emocional faz as pessoas esquecerem de verificar a data e a origem.",
        correta: true,
        feedback:
          "Esse é exatamente o mecanismo explorado. A resposta emocional intensa (medo, compaixão, indignação) ativa o sistema límbico e reduz o pensamento analítico. Quanto mais impactante o conteúdo, mais importante é fazer uma pausa e verificar antes de compartilhar.",
      },
      {
        texto: "Porque editores de vídeo conseguem alterar os metadados para o vídeo parecer atual e recente.",
        correta: false,
        feedback:
          "Alterar metadados é possível, mas não é o principal motivo. O ponto central é a exploração emocional: vídeos de desastres são compartilhados sem verificação por causa da reação emocional que provocam, não por causa de manipulação técnica de metadados.",
      },
    ],
  },
  {
    id: "videoctx3",
    tipoInimigo: "videoctx",
    nomeInimigo: "Celebração Distorcida",
    situacao:
      "Um vídeo de pessoas festejando em rua é postado como 'comemoração pela queda do governo X'. Na realidade, é uma celebração esportiva em outro país, sem qualquer conotação política.",
    enunciado: "Que informações são essenciais para contextualizar corretamente um vídeo de celebração?",
    opcoes: [
      {
        texto: "Data, local, motivo da celebração e quem filmou. Busca inversa de vídeo (InVID) e análise de referências visuais no próprio vídeo (placas, faixas, bandeiras) ajudam a confirmar.",
        correta: true,
        feedback:
          "Contexto é tudo em um vídeo. A mesma multidão comemorando pode ter dezenas de motivações diferentes. Sempre busque a publicação original: onde foi postado pela primeira vez, quando e por quem? Essas respostas revelam o contexto real.",
      },
      {
        texto: "O número de pessoas e a intensidade da festa confirmam a importância política do evento mostrado.",
        correta: false,
        feedback:
          "Quantidade de pessoas e intensidade não revelam o motivo da celebração. Uma final da Copa do Mundo reúne multidões tão grandes quanto protestos políticos históricos. Só a verificação do contexto original explica o que realmente está acontecendo no vídeo.",
      },
    ],
  },
  {
    id: "clonevoz1",
    tipoInimigo: "clonevoz",
    nomeInimigo: "Clone de Voz Familiar",
    situacao:
      "Você recebe uma ligação onde a voz da sua mãe pede dinheiro urgente para uma emergência. A voz parece idêntica à dela. Ferramentas de IA conseguem clonar vozes com apenas 3 segundos de áudio.",
    enunciado: "Como se proteger de golpes com clone de voz por IA?",
    opcoes: [
      {
        texto: "Estabeleça uma palavra-código com familiares para emergências. Desligue e ligue de volta para o número oficial da pessoa. Nunca transfira dinheiro apenas por ligação, mesmo que a voz pareça real.",
        correta: true,
        feedback:
          "A palavra-código familiar é a proteção mais eficaz contra esse tipo de golpe. Se a 'mãe' ou o 'filho' não souber a palavra combinada, é sinal de fraude. Sempre confirme emergências ligando de volta para números salvos previamente — nunca para o número que te ligou.",
      },
      {
        texto: "Se a voz soa exatamente igual à da pessoa, é impossível que seja falsa — a tecnologia não chegou a esse nível.",
        correta: false,
        feedback:
          "A tecnologia já chegou a esse nível. Ferramentas como ElevenLabs e outras plataformas de síntese de voz clonam com alta fidelidade usando poucos segundos de áudio disponível publicamente (redes sociais, vídeos). Vozes sintéticas já enganaram familiares e profissionais treinados.",
      },
    ],
  },
  {
    id: "clonevoz2",
    tipoInimigo: "clonevoz",
    nomeInimigo: "Áudio Falso de Autoridade",
    situacao:
      "Um áudio circula no WhatsApp com a voz de um governador anunciando um toque de recolher emergencial. Nenhum veículo de imprensa nem canal oficial do governo confirmou o anúncio.",
    enunciado: "Como verificar se um áudio de autoridade é autêntico?",
    opcoes: [
      {
        texto: "Buscar a informação em canais oficiais do governo (site, redes sociais verificadas) e em grandes veículos de imprensa. Anúncios oficiais são sempre confirmados por múltiplas fontes independentes.",
        correta: true,
        feedback:
          "Um toque de recolher ou medida emergencial real seria imediatamente divulgado pelo Diário Oficial, TV, rádio e redes sociais verificadas do governo. A ausência de confirmação em qualquer canal oficial é prova suficiente de que o áudio é falso.",
      },
      {
        texto: "Se muitas pessoas no grupo de WhatsApp estão afirmando que o áudio é real, provavelmente é verdadeiro.",
        correta: false,
        feedback:
          "Volume de pessoas afirmando algo não é evidência. Desinformação se espalha exatamente porque muitas pessoas a compartilham sem verificar. A confirmação real vem de fontes primárias oficiais — não da quantidade de repasses em grupos.",
      },
    ],
  },
  {
    id: "clonevoz3",
    tipoInimigo: "clonevoz",
    nomeInimigo: "Entrevista Fabricada",
    situacao:
      "Um podcast compartilha uma entrevista onde uma jornalista famosa 'confessa' ter sido paga para divulgar informações falsas. A jornalista nega completamente ter dado essa entrevista — o áudio foi gerado por IA.",
    enunciado: "Que indícios no próprio áudio podem sugerir que uma entrevista foi fabricada por IA?",
    opcoes: [
      {
        texto: "Pausas artificiais, ritmo mecânico de fala, ausência de ruídos ambientes naturais (respiração, papel, ambiente), respostas excessivamente fluidas sem hesitações reais, e timbre ligeiramente diferente do habitual.",
        correta: true,
        feedback:
          "Esses são os sinais técnicos de áudio sintético. Voz humana real tem micro-imperfeições: hesitações ('ã', 'hm'), variações de volume, respiração audível e ruído de ambiente. Áudio gerado por IA tende a ser 'limpo demais' e uniforme demais para ser natural.",
      },
      {
        texto: "Se o arquivo de áudio é longo (vários minutos), é mais difícil falsificar — IA só consegue criar clipes curtos.",
        correta: false,
        feedback:
          "Não é uma limitação real. Ferramentas modernas de síntese de voz conseguem gerar áudios longos e coerentes. O tamanho do arquivo não é um indicador de autenticidade. Os sinais relevantes são qualitativos: naturalidade da fala, ruídos de ambiente e consistência com o estilo vocal conhecido da pessoa.",
      },
    ],
  },
];
