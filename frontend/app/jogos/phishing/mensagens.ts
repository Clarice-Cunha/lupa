export type TipoArmadilha =
  | "url"
  | "urgencia"
  | "dados"
  | "remetente"
  | "erro"
  | "numero"
  | "premio";

export type Segmento = {
  texto: string;
  armadilha?: {
    id: string;
    tipo: TipoArmadilha;
    label: string;
    explicacao: string;
  };
};

export type Mensagem = {
  id: string;
  tipo: "email" | "whatsapp" | "sms";
  tema: string;
  contexto: string;
  de: Segmento[];
  assunto?: Segmento[];
  corpo: Segmento[][];
  totalArmadilhas: number;
};

export const MENSAGENS: Mensagem[] = [
  // Mensagem 1 — E-mail de banco falso
  {
    id: "m1",
    tipo: "email",
    tema: "Bloqueio de conta bancária",
    contexto:
      "Você recebeu este e-mail às 23h47. Clique em tudo que parecer suspeito.",
    de: [
      { texto: "seguranca@" },
      {
        texto: "bradescoo.com.br",
        armadilha: {
          id: "m1-remetente",
          tipo: "remetente",
          label: "Domínio com erro proposital",
          explicacao:
            "O domínio correto do Bradesco é bradesco.com.br. Este endereço tem duas letras 'o' — um erro proposital para enganar quem lê rápido.",
        },
      },
    ],
    assunto: [
      {
        texto: "⚠️ URGENTE: Sua conta foi bloqueada — ação imediata necessária",
        armadilha: {
          id: "m1-urgencia",
          tipo: "urgencia",
          label: "Urgência e pânico artificiais",
          explicacao:
            "Criar urgência é a principal tática do phishing. Bancos reais nunca ameaçam bloqueio imediato por e-mail — eles notificam pelo app oficial ou por carta.",
        },
      },
    ],
    corpo: [
      [{ texto: "Prezado cliente," }],
      [
        {
          texto:
            "Identificamos acessos não autorizados à sua conta. Para restaurar o acesso, clique no link abaixo imediatamente:",
        },
      ],
      [
        { texto: "→ " },
        {
          texto: "www.bradescoo-seguro.net/verificar-conta",
          armadilha: {
            id: "m1-url",
            tipo: "url",
            label: "Link com domínio falso",
            explicacao:
              "O domínio 'bradescoo-seguro.net' não pertence ao Bradesco. O site oficial é bradesco.com.br. Bancos nunca enviam links por e-mail para você clicar.",
          },
        },
      ],
      [{ texto: "Equipe de Segurança Bradesco" }],
    ],
    totalArmadilhas: 3,
  },

  // Mensagem 2 — WhatsApp de prêmio falso
  {
    id: "m2",
    tipo: "whatsapp",
    tema: "Promoção de supermercado",
    contexto:
      "Mensagem no WhatsApp de um número desconhecido. Você ganhou alguma coisa?",
    de: [
      {
        texto: "+1 (305) 849-2241",
        armadilha: {
          id: "m2-numero",
          tipo: "numero",
          label: "Número estrangeiro",
          explicacao:
            "O prefixo +1 é dos Estados Unidos. Empresas brasileiras como Pão de Açúcar sempre usam números nacionais (+55). Mensagens promocionais de números estrangeiros são quase sempre golpes.",
        },
      },
    ],
    corpo: [
      [
        { texto: "🎉 Parabéns! Você foi selecionado(a) para receber um " },
        {
          texto: "vale-compras de R$500 do Pão de Açúcar",
          armadilha: {
            id: "m2-premio",
            tipo: "premio",
            label: "Prêmio surgido do nada",
            explicacao:
              "Promoções legítimas não surgem aleatoriamente no WhatsApp de números desconhecidos. A tática de 'você foi selecionado' é clássica em golpes digitais.",
          },
        },
        { texto: "." },
      ],
      [{ texto: "Para resgatar seu prêmio, acesse agora:" }],
      [
        { texto: "→ " },
        {
          texto: "bit.ly/paodeacucar-brinde2025",
          armadilha: {
            id: "m2-url",
            tipo: "url",
            label: "Link encurtado suspeito",
            explicacao:
              "Links encurtados (como bit.ly) escondem o destino real. Empresas legítimas nunca os usam em comunicações oficiais — elas sempre usam seus próprios domínios.",
          },
        },
      ],
      [{ texto: "Oferta válida por apenas 24 horas." }],
    ],
    totalArmadilhas: 3,
  },

  // Mensagem 3 — SMS dos Correios falso
  {
    id: "m3",
    tipo: "sms",
    tema: "Falha na entrega dos Correios",
    contexto:
      "SMS recebido no celular. Você pediu algo online recentemente — mas algo está errado.",
    de: [
      {
        texto: "CORRIEOS",
        armadilha: {
          id: "m3-erro",
          tipo: "erro",
          label: "Erro ortográfico no nome",
          explicacao:
            "O nome correto é CORREIOS. Erros de ortografia em mensagens de grandes empresas são sinal de fraude — sistemas automatizados legítimos nunca erram o próprio nome.",
        },
      },
    ],
    corpo: [
      [
        {
          texto:
            "Sua encomenda nao pode ser entregue. Atualize o endereço em ",
        },
        {
          texto: "até 24h",
          armadilha: {
            id: "m3-urgencia",
            tipo: "urgencia",
            label: "Prazo artificialmente curto",
            explicacao:
              "Os Correios sempre oferecem prazos razoáveis e múltiplas opções de reagendamento. Prazos de '24h' são usados para impedir que você verifique a autenticidade da mensagem.",
          },
        },
        { texto: " ou o pacote sera devolvido." },
      ],
      [
        { texto: "Atualizar endereço: " },
        {
          texto: "correios-rastrear.net/atualizar",
          armadilha: {
            id: "m3-url",
            tipo: "url",
            label: "Site falso dos Correios",
            explicacao:
              "O site oficial dos Correios é correios.com.br. O domínio 'correios-rastrear.net' é uma cópia falsa criada para roubar seus dados pessoais.",
          },
        },
      ],
    ],
    totalArmadilhas: 3,
  },

  // Mensagem 4 — E-mail da Netflix falso
  {
    id: "m4",
    tipo: "email",
    tema: "Assinatura de streaming cancelada",
    contexto:
      "E-mail sobre sua assinatura. Parece oficial — mas verifique com atenção.",
    de: [
      { texto: "noreply@" },
      {
        texto: "netflix-suporte.com",
        armadilha: {
          id: "m4-remetente",
          tipo: "remetente",
          label: "Domínio que imita a Netflix",
          explicacao:
            "O domínio oficial da Netflix é netflix.com. O endereço 'netflix-suporte.com' é um domínio completamente diferente, criado para parecer legítimo à primeira vista.",
        },
      },
    ],
    assunto: [{ texto: "Ação necessária: confirme seu pagamento" }],
    corpo: [
      [{ texto: "Olá," }],
      [
        {
          texto:
            "Houve um problema com seu método de pagamento. Para continuar assistindo, confirme seus dados:",
        },
      ],
      [
        {
          texto: "→ Clique aqui para atualizar seu cartão de crédito",
          armadilha: {
            id: "m4-dados",
            tipo: "dados",
            label: "Pedido de dados bancários por e-mail",
            explicacao:
              "Nenhum serviço legítimo pede dados de cartão por e-mail ou link. Sempre acesse diretamente o site oficial digitando o endereço no navegador.",
          },
        },
      ],
      [
        { texto: "Se você não atualizar em " },
        {
          texto: "48 horas",
          armadilha: {
            id: "m4-urgencia",
            tipo: "urgencia",
            label: "Prazo para criar pressão",
            explicacao:
              "Prazos curtos ('48 horas') impedem que a vítima reflita com calma. A Netflix nunca cancela uma conta sem avisos repetidos e acesso ao painel da própria conta.",
          },
        },
        { texto: " sua conta será desativada permanentemente." },
      ],
      [{ texto: "Equipe Netflix" }],
    ],
    totalArmadilhas: 3,
  },

  // Mensagem 5 — WhatsApp de emprego falso
  {
    id: "m5",
    tipo: "whatsapp",
    tema: "Oferta de emprego home office",
    contexto:
      "Mensagem de vaga de emprego no WhatsApp. Parece boa demais — será que é?",
    de: [{ texto: "RH Vagas Online" }],
    corpo: [
      [{ texto: "Olá! Sua rede indicou você para uma vaga de trabalho remoto." }],
      [
        { texto: "💼 Cargo: Digitador(a) de dados | " },
        {
          texto: "💰 Remuneração: R$4.800/mês — apenas 2h por dia",
          armadilha: {
            id: "m5-premio",
            tipo: "premio",
            label: "Salário irreal para trabalho simples",
            explicacao:
              "Vagas com salários muito altos para tarefas simples como 'digitação' são um sinal de alerta clássico. Golpistas usam promessas financeiras atrativas para nublar o julgamento.",
          },
        },
      ],
      [
        { texto: "Para garantir sua vaga, é necessário um " },
        {
          texto: "depósito de R$89,90 para o kit de treinamento",
          armadilha: {
            id: "m5-taxa",
            tipo: "dados",
            label: "Cobrança para trabalhar",
            explicacao:
              "Nenhuma empresa legítima cobra do candidato para fornecer treinamento ou equipamento. Essa é a marca principal do 'golpe do emprego': você paga e nunca recebe nada.",
          },
        },
        { texto: "." },
      ],
      [
        { texto: "Responda AGORA e envie seu " },
        {
          texto: "CPF e número da conta bancária",
          armadilha: {
            id: "m5-cpf",
            tipo: "dados",
            label: "Pedido de CPF e dados bancários",
            explicacao:
              "Processos seletivos legítimos nunca pedem CPF ou dados bancários por WhatsApp antes de uma entrevista formal. Compartilhar essas informações pode levar a roubo de identidade.",
          },
        },
        { texto: " para começar." },
      ],
    ],
    totalArmadilhas: 3,
  },
];
