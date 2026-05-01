/**
 * Banco de perguntas do Mundo 1 — Fake News.
 *
 * Cada pergunta está vinculada a um tipo de inimigo que a representa
 * visualmente no jogo. As opções sempre têm exatamente 2 alternativas.
 * A ordem das opções é embaralhada pelo componente antes de exibir.
 */

import type { PerguntaAventura } from "./tipos";

export const PERGUNTAS_MUNDO1: PerguntaAventura[] = [
  {
    id: "bot1",
    tipoInimigo: "bot",
    nomeInimigo: "Bot Espalhador",
    situacao:
      'Um perfil criado há 3 dias, com apenas 1 foto, está compartilhando uma "cura milagrosa" que já tem 80.000 compartilhamentos.',
    enunciado: "O que você faz ao ver essa postagem?",
    opcoes: [
      {
        texto: "Verifico em fontes confiáveis (Ministério da Saúde, médicos) antes de acreditar",
        correta: true,
        feedback:
          "Correto! Perfis novos e muitos compartilhamentos não provam que algo é verdade. Bots são criados exatamente para parecer populares.",
      },
      {
        texto: "Compartilho com minha família para ajudá-los",
        correta: false,
        feedback:
          "Cuidado! Compartilhar sem verificar espalha desinformação. Perfis suspeitos e compartilhamentos em massa são sinais de alerta.",
      },
    ],
  },
  {
    id: "manchete1",
    tipoInimigo: "manchete",
    nomeInimigo: "Manchete Falsa",
    situacao:
      'Você vê a manchete: "🚨 URGENTE: Cientista brasileiro descobre cura do câncer (médicos não querem que você saiba!!)"',
    enunciado: "O que você pensa sobre essa manchete?",
    opcoes: [
      {
        texto:
          "É clickbait: curas reais aparecem em todos os jornais sérios, não só em sites desconhecidos",
        correta: true,
        feedback:
          'Exato! Frases como "não querem que você saiba" e "URGENTE" são marcas clássicas de clickbait. Notícias científicas reais citam estudos e pesquisadores.',
      },
      {
        texto: "Clico e compartilho antes que censurem a descoberta",
        correta: false,
        feedback:
          "Cuidado! A sensação de urgência e o medo de censura são táticas para fazer você agir sem pensar. Sempre verifique a fonte antes de compartilhar.",
      },
    ],
  },
  {
    id: "corrente1",
    tipoInimigo: "corrente",
    nomeInimigo: "Corrente Viral",
    situacao:
      'Chega no WhatsApp: "Encaminhe para 10 pessoas e ganhe R$50 de cashback no Pix! Válido por 1 hora! ✅✅✅"',
    enunciado: "O que você faz com essa mensagem?",
    opcoes: [
      {
        texto: "Apago. Nenhum banco ou app real paga para você encaminhar mensagens",
        correta: true,
        feedback:
          "Perfeito! Correntes do tipo 'encaminhe e ganhe' são sempre falsas. Ao encaminhar, você vira parte do problema e pode expor seus contatos a golpes.",
      },
      {
        texto: "Encaminho para minha família para eles ganharem também",
        correta: false,
        feedback:
          "Esse é exatamente o objetivo do golpe! Correntes com promessas de dinheiro fácil são falsas e muitas vezes contêm links maliciosos.",
      },
    ],
  },
  {
    id: "bot2",
    tipoInimigo: "bot",
    nomeInimigo: "Bot de Vídeo",
    situacao:
      "Um vídeo viral com 2 milhões de visualizações mostra um político dizendo algo absurdo. O vídeo parece muito real.",
    enunciado: "O que você faz antes de compartilhar?",
    opcoes: [
      {
        texto:
          "Verifico em sites de checagem (Aos Fatos, Agência Lupa) se o vídeo é autêntico",
        correta: true,
        feedback:
          "Ótimo! Tecnologia de deepfake consegue criar vídeos falsos muito convincentes. Sites de checagem especializados têm como verificar a autenticidade.",
      },
      {
        texto: "Compartilho porque 2 milhões de pessoas não podem estar erradas",
        correta: false,
        feedback:
          "Errado! Vídeos falsos já chegaram a dezenas de milhões de visualizações. Popularidade não é prova de veracidade.",
      },
    ],
  },
  {
    id: "manchete2",
    tipoInimigo: "manchete",
    nomeInimigo: "Foto Fora de Contexto",
    situacao:
      'Uma foto dramática de enchente tem a legenda: "ISSO ESTÁ ACONTECENDO NO BRASIL AGORA — compartilhe para alertar todo mundo!"',
    enunciado: "O que você faz antes de compartilhar a foto?",
    opcoes: [
      {
        texto:
          "Faço busca reversa da imagem para verificar se é real, recente e do Brasil",
        correta: true,
        feedback:
          "Perfeito! Fotos antigas de outros países são frequentemente reutilizadas com novas legendas. Busca reversa (Google Imagens, TinEye) revela a origem real.",
      },
      {
        texto: "Compartilho imediatamente para alertar as pessoas",
        correta: false,
        feedback:
          "Cuidado! Fotos de outros países e de anos atrás são frequentemente usadas fora de contexto para criar pânico. Verifique sempre antes de compartilhar.",
      },
    ],
  },
  {
    id: "bot_rn1",
    tipoInimigo: "bot",
    nomeInimigo: "Bot Coordenado",
    situacao:
      "Uma investigação do Ministério Público do RN desmantelou uma central de fake news em Natal: dezenas de perfis diferentes publicavam o mesmo texto atacando políticos locais — todos ao mesmo tempo e com fotos de perfil distintas.",
    enunciado: "Como você identifica que uma notícia pode vir de uma operação coordenada de bots?",
    opcoes: [
      {
        texto:
          "Vejo se vários perfis diferentes publicam o mesmo texto quase simultaneamente — ação coordenada é sinal clássico de bot",
        correta: true,
        feedback:
          "Correto! Quando perfis distintos postam o mesmo conteúdo ao mesmo tempo, isso indica automação coordenada — não popularidade real. O MP/RN descobriu exatamente esse tipo de central operando em Natal e Parnamirim em 2024.",
      },
      {
        texto:
          "Se muitos perfis diferentes falam a mesma coisa, a informação provavelmente é verdadeira",
        correta: false,
        feedback:
          "Cuidado! Volume e repetição são justamente o objetivo de uma operação de bots. Quanto mais perfis repetem o mesmo texto simultaneamente, mais suspeita fica a origem — não o contrário.",
      },
    ],
  },
  {
    id: "corrente_rn1",
    tipoInimigo: "corrente",
    nomeInimigo: "Corrente de Emergência",
    situacao:
      "Chega um áudio no grupo de família no WhatsApp: 'Gente, tô avisando: o SAMU de Natal não está funcionando por causa das macas retidas no Walfredo Gurgel. Não liguem pro SAMU em emergências, procurem o pronto-socorro mais próximo!'",
    enunciado: "O que você faz com esse áudio?",
    opcoes: [
      {
        texto:
          "Ligo direto para o SAMU (192) para confirmar antes de repassar — informações falsas sobre emergências podem custar vidas",
        correta: true,
        feedback:
          "Perfeito! Boatos sobre serviços de emergência são especialmente perigosos — podem fazer alguém deixar de acionar o socorro. Sempre verifique na fonte oficial. Esse boato circulou em Natal em 2025 e foi desmentido pela própria Secretaria de Saúde.",
      },
      {
        texto: "Encaminho para os grupos da família para protegê-los",
        correta: false,
        feedback:
          "Ao encaminhar sem verificar, você pode fazer alguém evitar o SAMU em uma emergência real. Essa é exatamente a intenção de boatos sobre serviços públicos: paralisar a confiança nas instituições.",
      },
    ],
  },
];
