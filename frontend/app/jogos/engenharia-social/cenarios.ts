export type TaticaId =
  | "pretexting"
  | "urgencia"
  | "autoridade"
  | "quid_pro_quo"
  | "baiting"
  | "rapport";

export type Tatica = {
  id: TaticaId;
  nome: string;
  icone: string;
  descricaoCurta: string;
};

export type Cenario = {
  id: string;
  titulo: string;
  contexto: string;
  respostaCorreta: TaticaId;
  opcoes: TaticaId[];
  explicacao: string;
};

export const TATICAS: Record<TaticaId, Tatica> = {
  pretexting: {
    id: "pretexting",
    nome: "Pretexting",
    icone: "🎭",
    descricaoCurta: "Criar uma identidade ou situação falsa para extrair informações",
  },
  urgencia: {
    id: "urgencia",
    nome: "Urgência Falsa",
    icone: "⏰",
    descricaoCurta: "Pressão de tempo para impedir que a vítima pense com calma",
  },
  autoridade: {
    id: "autoridade",
    nome: "Autoridade Falsa",
    icone: "🪪",
    descricaoCurta: "Fingir ser uma figura de autoridade para obter obediência",
  },
  quid_pro_quo: {
    id: "quid_pro_quo",
    nome: "Quid Pro Quo",
    icone: "🤝",
    descricaoCurta: "Oferecer algo em troca de acesso ou informações confidenciais",
  },
  baiting: {
    id: "baiting",
    nome: "Baiting (Isca)",
    icone: "🪤",
    descricaoCurta: "Explorar a curiosidade da vítima com iscas físicas ou digitais",
  },
  rapport: {
    id: "rapport",
    nome: "Rapport / Simpatia",
    icone: "💬",
    descricaoCurta: "Construir laço afetivo para depois explorar a confiança conquistada",
  },
};

export const CENARIOS: Cenario[] = [
  {
    id: "c1",
    titulo: "O técnico de TI",
    contexto:
      "Você recebe uma ligação de alguém que se apresenta como 'Carlos, da equipe de TI da empresa'. Ele diz que identificou atividade suspeita na sua conta e precisa do seu login e senha para 'corrigir o problema antes que o sistema caia'. Para parecer legítimo, ele já sabe seu nome completo, departamento e o nome do seu gerente.",
    respostaCorreta: "pretexting",
    opcoes: ["pretexting", "urgencia", "autoridade", "rapport"],
    explicacao:
      "O atacante criou um cenário falso (pretexto) convincente — até pesquisou informações reais sobre você para parecer legítimo. Departamentos de TI nunca pedem senhas por telefone. Sempre confirme ligações suspeitas diretamente com o setor de TI pelos canais oficiais da empresa.",
  },
  {
    id: "c2",
    titulo: "A conta em risco",
    contexto:
      "Você encontra este e-mail na caixa de entrada: 'ATENÇÃO: detectamos acesso não autorizado na sua conta bancária. Você tem apenas 2 HORAS para confirmar sua identidade clicando no link abaixo, ou sua conta será bloqueada permanentemente.' O e-mail tem o logo do banco e parece oficial.",
    respostaCorreta: "urgencia",
    opcoes: ["urgencia", "pretexting", "baiting", "autoridade"],
    explicacao:
      "A pressão de prazo é uma tática clássica de engenharia social. O objetivo é impedir que você pense com calma e verifique se a mensagem é legítima. Bancos reais nunca exigem ação imediata por e-mail com ameaça de bloqueio permanente. Acesse sempre o site do banco digitando o endereço diretamente na barra do navegador.",
  },
  {
    id: "c3",
    titulo: "O inspetor",
    contexto:
      "Um homem bem vestido se aproxima da recepção do seu escritório portando um crachá e diz: 'Boa tarde, sou inspetor da Anvisa. Temos um relatório de contaminação neste andar e preciso acessar imediatamente a sala de servidores para coletar amostras. Cada minuto conta.' Ele parece seguro e profissional.",
    respostaCorreta: "autoridade",
    opcoes: ["autoridade", "urgencia", "quid_pro_quo", "pretexting"],
    explicacao:
      "Fingir ser uma autoridade — inspetor, policial, auditor fiscal — é uma tática poderosa porque instintivamente tendemos a obedecer figuras de poder. Sempre exija ver a credencial oficial, ligue para o órgão pelo número público (não o que o visitante fornecer) e siga os protocolos da empresa antes de conceder qualquer acesso.",
  },
  {
    id: "c4",
    titulo: "A troca",
    contexto:
      "Você está com problemas no computador quando um colega de outro setor se aproxima: 'Ei, eu sei resolver isso — é o mesmo bug que aconteceu comigo semana passada. Se você me deixar entrar com o seu login por um segundo, resolvo na hora.' Ele parece prestativo e o problema está atrasando seu trabalho.",
    respostaCorreta: "quid_pro_quo",
    opcoes: ["quid_pro_quo", "rapport", "pretexting", "baiting"],
    explicacao:
      "Quid pro quo significa 'uma coisa por outra' em latim. O atacante oferece um favor ou serviço em troca de acesso ou informações. A situação de urgência real — o computador com problema — baixa sua guarda. Nunca compartilhe suas credenciais, nem com colegas aparentemente bem-intencionados. Senhas são pessoais e intransferíveis.",
  },
  {
    id: "c5",
    titulo: "O pen-drive misterioso",
    contexto:
      "Você encontra um pen-drive no estacionamento da empresa com uma etiqueta escrita à mão: '📋 Avaliações de Desempenho — Confidencial'. Curioso sobre o que está ali — e se o seu nome aparece —, você considera plugar o dispositivo no computador para dar uma olhada rápida.",
    respostaCorreta: "baiting",
    opcoes: ["baiting", "pretexting", "urgencia", "rapport"],
    explicacao:
      "Baiting (isca) explora a curiosidade humana. Atacantes deixam pen-drives infectados com malware em locais estratégicos, contando que alguém não resista. Ao conectar o dispositivo, o vírus pode ser instalado automaticamente — sem nenhum clique adicional. Nunca use mídias encontradas: entregue ao setor de segurança da empresa.",
  },
  {
    id: "c6",
    titulo: "A nova colega",
    contexto:
      "Há três semanas, Laura entrou na equipe. Desde o primeiro dia foi super simpática: trouxe bolo na sexta, ajudou todos com tarefas e lembrou do aniversário de cada colega. Hoje ela se aproxima: 'Você é a pessoa mais prestativa aqui. Estou num aperto — meu acesso caiu e tenho uma apresentação em 10 minutos. Me empresta sua senha só por hoje?'",
    respostaCorreta: "rapport",
    opcoes: ["rapport", "quid_pro_quo", "urgencia", "autoridade"],
    explicacao:
      "Construir um relacionamento afetivo para depois explorar a confiança conquistada é chamado de rapport manipulation. O investimento emocional prévio cria uma sensação de dívida social — você quer ajudar quem foi gentil com você. Nenhum pedido de senha é legítimo, mesmo de pessoas próximas. A regra é simples: senha não se empresta.",
  },
];
