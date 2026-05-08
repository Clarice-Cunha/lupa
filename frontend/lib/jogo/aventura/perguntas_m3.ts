/**
 * Banco de perguntas do Mundo 3 — Manipulação de Imagem.
 *
 * Três tipos de inimigo representam as formas mais comuns de enganar com imagens:
 *   edicao   🖼️ — imagem editada digitalmente ou gerada por IA
 *   contexto 📍 — imagem real usada fora do lugar ou tempo correto
 *   legenda  📝 — foto verdadeira com legenda falsa
 */

import type { PerguntaAventura } from "./tipos";

export const PERGUNTAS_MUNDO3: PerguntaAventura[] = [
  {
    id: "edicao1",
    tipoInimigo: "edicao",
    nomeInimigo: "Imagem Gerada por IA",
    situacao:
      "Uma foto circula nas redes mostrando um político famoso em uma situação comprometedora. A imagem tem ótima qualidade, mas foi criada por inteligência artificial.",
    enunciado: "Como identificar que a foto pode ter sido gerada por IA?",
    opcoes: [
      {
        texto: "Observar falhas como mãos com dedos anômalos, sombras inconsistentes e ausência de metadados reais. Ferramentas como FotoForensics ajudam.",
        correta: true,
        feedback:
          "Correto! Imagens de IA ainda falham em detalhes: mãos, dentes, reflexos e sombras. O recurso 'Sobre esta imagem' do Google e o FotoForensics são aliados importantes na checagem.",
      },
      {
        texto: "Se a resolução é alta, a foto é real — IA ainda não consegue isso.",
        correta: false,
        feedback:
          "Não é mais verdade. Modelos como DALL-E e Midjourney já produzem imagens em alta resolução indistinguíveis a olho nu. É preciso usar ferramentas especializadas, não confiar só na aparência.",
      },
    ],
  },
  {
    id: "edicao2",
    tipoInimigo: "edicao",
    nomeInimigo: "Rosto Substituído",
    situacao:
      "Uma imagem viral mostra o rosto de um ator famoso no corpo de alguém cometendo um crime. O ator nunca esteve naquele local — o rosto foi colado digitalmente.",
    enunciado: "Qual a melhor forma de verificar se uma foto foi manipulada digitalmente?",
    opcoes: [
      {
        texto: "Usar pesquisa reversa de imagem (Google Imagens, TinEye) para encontrar a foto original sem o rosto substituído.",
        correta: true,
        feedback:
          "A pesquisa reversa de imagem é uma das ferramentas mais poderosas. Se a mesma foto aparece em contextos diferentes ou sem aquela pessoa, a manipulação fica evidente.",
      },
      {
        texto: "Se as bordas do rosto parecem suaves, é porque a foto é original.",
        correta: false,
        feedback:
          "Ferramentas modernas de edição suavizam bordas automaticamente. Aparência suave não é evidência de autenticidade. A pesquisa reversa de imagem é muito mais confiável.",
      },
    ],
  },
  {
    id: "edicao3",
    tipoInimigo: "edicao",
    nomeInimigo: "Cores Exageradas",
    situacao:
      "Foto de praia compartilhada como 'Praia de Pipa, RN — paraíso real'. As cores foram tão intensificadas digitalmente que a água parece azul turquesa impossível.",
    enunciado: "Por que editar cores de forma extrema também é uma forma de manipulação?",
    opcoes: [
      {
        texto: "Exagerar cores cria expectativa irreal na audiência, induzindo decisões baseadas em uma versão falsa da realidade.",
        correta: true,
        feedback:
          "Manipulação não é só falsificar — é também distorcer. Cores irreais criam uma percepção que não corresponde à realidade, o que pode enganar tanto quanto uma fake news explícita.",
      },
      {
        texto: "Filtros em fotos são só estética — todo mundo sabe que fotos são editadas.",
        correta: false,
        feedback:
          "Nem todo mundo percebe o quanto uma foto pode ser alterada. Além disso, imagens com alto impacto emocional (como anúncios de turismo) exploram isso intencionalmente para influenciar comportamentos.",
      },
    ],
  },
  {
    id: "edicao4",
    tipoInimigo: "edicao",
    nomeInimigo: "Print Falsificado",
    situacao:
      "Uma captura de tela mostra um post de um político famoso dizendo algo extremamente polêmico. O post parece autêntico, mas foi criado com ferramentas online de geração de prints falsos.",
    enunciado: "Como verificar se um print de rede social é autêntico?",
    opcoes: [
      {
        texto: "Acessar diretamente o perfil oficial da pessoa nas redes sociais para ver se o post existe, e consultar agências de checagem.",
        correta: true,
        feedback:
          "Prints são facilmente falsificados — existem até sites que geram posts falsos automaticamente. Sempre vá à fonte: acesse o perfil oficial. Se foi apagado, agências de checagem costumam registrar isso.",
      },
      {
        texto: "Se o print tem curtidas e comentários visíveis, é porque é real.",
        correta: false,
        feedback:
          "Curtidas e comentários também fazem parte do print falso. Ferramentas de edição permitem criar prints com qualquer número de interações. Só a verificação direta no perfil oficial é confiável.",
      },
    ],
  },
  {
    id: "contexto1",
    tipoInimigo: "contexto",
    nomeInimigo: "Foto Fora de Época",
    situacao:
      "Uma foto dramática de enchente é compartilhada com a legenda 'Tragédia hoje em Natal — RN'. A foto é real, mas foi tirada em Bangladesh em 2004.",
    enunciado: "Qual o problema com essa publicação?",
    opcoes: [
      {
        texto: "A imagem é real, mas foi retirada do contexto original. A pesquisa reversa mostra que a foto tem anos e aconteceu em outro país.",
        correta: true,
        feedback:
          "Usar imagens reais com legendas falsas é uma das formas mais comuns de desinformação. A imagem passa sensação de autenticidade, mas o contexto é completamente diferente. Sempre faça pesquisa reversa antes de compartilhar.",
      },
      {
        texto: "Se a foto é real, ela prova que a tragédia aconteceu.",
        correta: false,
        feedback:
          "Uma foto real pode ser usada de forma enganosa ao ser associada a um evento que não a gerou. 'Real' não é sinônimo de 'no contexto certo'. A legenda pode ser 100% falsa mesmo com imagem verdadeira.",
      },
    ],
  },
  {
    id: "contexto2",
    tipoInimigo: "contexto",
    nomeInimigo: "Manifestação Importada",
    situacao:
      "Uma foto de grande manifestação com milhares de pessoas é publicada com a legenda 'Protesto contra o governo em Brasília — hoje'. Na foto aparecem cartazes em idioma estrangeiro.",
    enunciado: "Que detalhe visual já deveria levantar suspeita nessa foto?",
    opcoes: [
      {
        texto: "Cartazes em idioma estrangeiro indicam que a foto não foi tirada no Brasil. Pesquisa reversa de imagem confirma a origem correta.",
        correta: true,
        feedback:
          "Detalhes como idioma dos cartazes, arquitetura, placas de trânsito e vestimentas típicas são pistas visuais importantes. Antes de compartilhar, analise a imagem com atenção e faça pesquisa reversa.",
      },
      {
        texto: "O idioma não importa — o que vale é a força da manifestação mostrada.",
        correta: false,
        feedback:
          "Importa muito. Usar uma manifestação de outro país para ilustrar 'protesto aqui' é desinformação direta. O tamanho da manifestação não justifica a falsidade da legenda.",
      },
    ],
  },
  {
    id: "contexto3",
    tipoInimigo: "contexto",
    nomeInimigo: "Foto Antiga como Atual",
    situacao:
      "Foto de floresta queimada é compartilhada com a legenda 'Amazônia em chamas — HOJE'. A foto é real, mas foi tirada em 2019 durante incêndios registrados na época.",
    enunciado: "Por que usar uma foto antiga como se fosse atual é um problema?",
    opcoes: [
      {
        texto: "Apresentar como 'hoje' uma foto de outra época distorce a percepção sobre a situação atual e manipula a reação emocional do público.",
        correta: true,
        feedback:
          "A recontextualização temporal é uma das manipulações mais comuns. A foto pode ser real, mas 'hoje' é uma mentira. Sempre verifique a data original com pesquisa reversa de imagem.",
      },
      {
        texto: "Se a situação já aconteceu de verdade, usar a foto com outro contexto de tempo é aceitável.",
        correta: false,
        feedback:
          "Não é aceitável. Criar urgência falsa manipula emoções e decisões. Uma foto de 2019 não prova o que está acontecendo hoje. O contexto temporal é parte essencial da informação.",
      },
    ],
  },
  {
    id: "legenda1",
    tipoInimigo: "legenda",
    nomeInimigo: "Legenda Inventada",
    situacao:
      "Foto de uma longa fila na rua compartilhada com a legenda 'brasileiros fazendo fila para receber cestas básicas — crise da fome 2025'. Na realidade, é uma fila para ingresso de show.",
    enunciado: "O que revela que a legenda pode ser falsa?",
    opcoes: [
      {
        texto: "A pesquisa reversa de imagem mostra a foto original associada a um evento de entretenimento, contradizendo a legenda de crise alimentar.",
        correta: true,
        feedback:
          "Fotos neutras (filas, multidões, rostos) são facilmente recontextualizadas com legendas falsas. A pesquisa reversa de imagem é indispensável nesses casos.",
      },
      {
        texto: "Fila grande indica sempre situação de necessidade — a legenda parece coerente.",
        correta: false,
        feedback:
          "Aparência de coerência não é evidência. Uma fila pode ter dezenas de origens: show, lançamento de produto, evento esportivo. Nunca assuma o contexto pela aparência da imagem.",
      },
    ],
  },
  {
    id: "legenda2",
    tipoInimigo: "legenda",
    nomeInimigo: "Descoberta Inventada",
    situacao:
      "Foto de uma médica com jaleco branco em laboratório. A legenda diz: 'Dra. Ana Lima descobre cura definitiva para o câncer de pâncreas.' Nenhum veículo científico confirmou isso.",
    enunciado: "O que você deve fazer antes de compartilhar essa notícia?",
    opcoes: [
      {
        texto: "Verificar se a descoberta foi publicada em periódicos científicos e confirmada por instituições como a OMS ou universidades reconhecidas.",
        correta: true,
        feedback:
          "Uma foto de jaleco não prova nada. Descobertas médicas legítimas são publicadas em revistas revisadas por pares e rapidamente repercutidas por veículos de saúde sérios. Na ausência disso, desconfie.",
      },
      {
        texto: "Se tem nome e foto da médica, a informação é confiável.",
        correta: false,
        feedback:
          "Nome e foto são fáceis de inventar. Uma descoberta desse porte seria noticiada pela OMS, ANVISA e grandes veículos de saúde ao redor do mundo. A ausência disso é um sinal claro de alerta.",
      },
    ],
  },
  {
    id: "legenda3",
    tipoInimigo: "legenda",
    nomeInimigo: "Emoção Explorada",
    situacao:
      "Foto impactante de crianças em situação de miséria com a legenda 'crianças brasileiras hoje — resultado da política atual'. A foto é de um banco de imagens de stock, sem relação com o Brasil.",
    enunciado: "Por que usar imagens de alto impacto emocional com legendas falsas é especialmente perigoso?",
    opcoes: [
      {
        texto: "Imagens emocionalmente poderosas reduzem o senso crítico e aumentam a probabilidade de compartilhamento sem verificação.",
        correta: true,
        feedback:
          "Esse é um mecanismo psicológico explorado intencionalmente: imagens de sofrimento ativam emoções que inibem o raciocínio crítico. Isso torna essas imagens especialmente eficazes para espalhar desinformação — e especialmente importantes de verificar.",
      },
      {
        texto: "Se a miséria infantil existe, a foto representa uma realidade real mesmo que não seja do Brasil.",
        correta: false,
        feedback:
          "Não. Associar um problema real a um contexto falso distorce a análise da situação. A criança da foto pode ser de um país com excelente IDH, fotografada em outro contexto completamente diferente. Contexto importa sempre.",
      },
    ],
  },
];
