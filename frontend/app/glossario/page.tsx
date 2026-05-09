import { BookMarked } from "lucide-react";

export const metadata = {
  title: "Glossário | LUPA",
  description:
    "Termos essenciais para entender desinformação, fake news e checagem de fatos.",
};

type Termo = {
  palavra: string;
  definicao: string;
  exemplo?: string;
};

const TERMOS: Termo[] = [
  {
    palavra: "Algoritmos de recomendação",
    definicao:
      "Programas utilizados por plataformas digitais (redes sociais, serviços de streaming, mecanismos de busca) para decidir automaticamente qual conteúdo mostrar a cada usuário. Eles analisam o comportamento da pessoa — o que ela clicou, assistiu, curtiu e por quanto tempo — e priorizam conteúdos que gerem mais engajamento. O problema é que conteúdos sensacionalistas e emocionalmente intensos costumam gerar mais cliques, o que pode favorecer involuntariamente a circulação de desinformação.",
    exemplo:
      "Após assistir a um vídeo sobre dietas, um algoritmo pode recomendar conteúdos cada vez mais extremos sobre alimentação, criando uma bolha de filtro sem que o usuário perceba.",
  },
  {
    palavra: "Astroturfing",
    definicao:
      "Prática de criar a falsa impressão de que um movimento popular existe espontaneamente, quando na verdade é organizado e financiado por grupos políticos ou empresariais. O nome vem de uma marca de grama artificial — simula algo orgânico que, na verdade, é fabricado.",
    exemplo:
      "Centenas de perfis falsos coordenados para parecer que há revolta popular sobre um tema.",
  },
  {
    palavra: "Autoridade falsa",
    definicao:
      "Técnica de engenharia social em que o atacante finge ser uma figura de autoridade — inspetor governamental, policial, auditor, gerente sênior — para provocar obediência automática na vítima. Baseia-se no princípio psicológico de que as pessoas tendem a obedecer figuras de poder sem questionar.",
    exemplo:
      "Pessoa que se apresenta como inspetor da Anvisa na recepção de uma empresa para conseguir acesso a áreas restritas sem passar pelos protocolos de segurança.",
  },
  {
    palavra: "Autoridade vaga",
    definicao:
      "Quando uma informação é atribuída a fontes genéricas e não verificáveis, como 'especialistas dizem', 'estudos mostram' ou 'cientistas afirmam', sem citar nomes, instituições ou referências concretas. É um sinal clássico de desinformação.",
    exemplo: "'Médicos recomendam tomar vitamina C em grandes doses' — quais médicos? Onde publicaram?",
  },
  {
    palavra: "Bolha de filtro",
    definicao:
      "Fenômeno em que algoritmos de redes sociais e mecanismos de busca mostram principalmente conteúdos alinhados com as preferências e opiniões já existentes do usuário, reduzindo a exposição a visões diferentes. Isso pode reforçar crenças errôneas.",
  },
  {
    palavra: "Baiting (Isca)",
    definicao:
      "Técnica de engenharia social que explora a curiosidade ou a ganância da vítima por meio de iscas físicas ou digitais. Iscas físicas são dispositivos infectados com malware — como pen-drives — deixados propositalmente em locais estratégicos. Iscas digitais incluem downloads gratuitos, prêmios falsos e links atrativos.",
    exemplo:
      "Pen-drive encontrado no estacionamento de uma empresa com a etiqueta 'Salários — Confidencial', deixado intencionalmente por um atacante contando com a curiosidade dos funcionários.",
  },
  {
    palavra: "Bot",
    definicao:
      "Conta automatizada em redes sociais controlada por um programa de computador, não por um ser humano. Bots são usados para amplificar artificialmente mensagens, criar tendências falsas e disseminar desinformação em grande escala.",
  },
  {
    palavra: "Câmara de eco",
    definicao:
      "Ambiente (online ou físico) em que as pessoas só interagem com quem compartilha as mesmas opiniões, fazendo com que essas opiniões sejam repetidas e amplificadas sem questionamento. Diferente da bolha de filtro, a câmara de eco envolve escolha ativa.",
  },
  {
    palavra: "Checagem de fatos",
    definicao:
      "Processo jornalístico de verificar a veracidade de afirmações feitas por políticos, notícias ou conteúdos virais, consultando fontes primárias, dados oficiais e especialistas. No Brasil, agências como Agência Lupa, Aos Fatos e g1 Fato ou Fake fazem esse trabalho.",
  },
  {
    palavra: "Clickbait",
    definicao:
      "Título ou manchete exagerado, sensacionalista ou enganoso, criado para atrair cliques a qualquer custo, independentemente se o conteúdo entrega o que promete. Muito comum em sites que lucram com publicidade por visualização.",
    exemplo: "'Você não vai acreditar no que esse político fez!' — sem especificar nada.",
  },
  {
    palavra: "Engenharia social",
    definicao:
      "Conjunto de técnicas de manipulação psicológica usadas para enganar pessoas e fazê-las revelar informações confidenciais, conceder acessos ou tomar decisões prejudiciais a elas mesmas. Diferente dos ataques técnicos, a engenharia social explora comportamentos humanos — confiança, medo, curiosidade e vontade de ajudar — em vez de vulnerabilidades em sistemas. Inclui táticas como pretexting, baiting, urgência falsa e rapport.",
    exemplo:
      "Um golpista que liga fingindo ser do suporte técnico e convence um funcionário a revelar sua senha está praticando engenharia social — sem precisar 'invadir' nenhum sistema.",
  },
  {
    palavra: "Ecossistema",
    definicao:
      "Conjunto interdependente de ferramentas, conteúdos e espaços que se complementam para cumprir um objetivo comum. No mundo digital, o termo descreve plataformas que crescem além de uma única função e passam a integrar múltiplos recursos relacionados — como jogos, biblioteca de conteúdo, espaços comunitários e APIs para desenvolvedores. A metáfora vem da biologia, onde um ecossistema é formado por organismos diferentes que dependem uns dos outros para sobreviver.",
    exemplo:
      "O Ecossistema LUPA reúne a ferramenta de análise de links e mídias, os jogos educativos (Detetive LUPA, Agente LUPA, Caça ao Phishing), a Biblioteca Virtual, o portal comunitário de boatos e o Modo Professor — todos conectados pelo mesmo propósito: apoiar o letramento midiático.",
  },
  {
    palavra: "Deepfake",
    definicao:
      "Vídeo, imagem ou áudio manipulado com inteligência artificial para fazer parecer que uma pessoa disse ou fez algo que nunca aconteceu. O nome vem de 'deep learning' (aprendizado profundo) + 'fake' (falso). São cada vez mais difíceis de detectar.",
  },
  {
    palavra: "Desinformação",
    definicao:
      "Informação falsa criada e distribuída intencionalmente para enganar pessoas, influenciar opiniões ou causar danos. Diferente de um erro involuntário: há intenção deliberada por trás. É o conceito mais amplo que engloba fake news, propaganda e manipulação.",
  },
  {
    palavra: "Fake news",
    definicao:
      "Notícias falsas publicadas em formatos que imitam o jornalismo legítimo — com manchetes, logos e layout profissional — para parecerem confiáveis. O objetivo pode ser político, financeiro (tráfego para sites com anúncios) ou simplesmente causar confusão.",
  },
  {
    palavra: "Falta de fontes",
    definicao:
      "Quando uma afirmação não cita de onde vêm os dados apresentados — nenhum estudo, instituição, pesquisador ou documento original. Informações sérias sempre indicam sua origem para que o leitor possa verificá-las de forma independente.",
  },
  {
    palavra: "Infodemik",
    definicao:
      "Palavra criada pela junção de 'informação' e 'epidemia'. Descreve a circulação excessiva e desordenada de informações — verdadeiras ou falsas — sobre um mesmo tema, dificultando que as pessoas identifiquem o que é confiável. O termo ficou conhecido durante a pandemia de Covid-19.",
  },
  {
    palavra: "Linguagem sensacionalista",
    definicao:
      "Uso de palavras exageradas, alarmes e emoções intensas para chamar atenção e provocar reações impulsivas, como medo, raiva ou urgência. Expressões como 'URGENTE', 'Você precisa ver isso' ou 'Isso está sendo escondido de você' são exemplos típicos.",
  },
  {
    palavra: "Metadados",
    definicao:
      "Informações técnicas embutidas automaticamente em arquivos digitais — fotos, vídeos, documentos — que descrevem o próprio arquivo, não o seu conteúdo visível. Incluem dados como data e hora de criação, dispositivo utilizado, localização geográfica e programa de edição. São invisíveis a olho nu, mas acessíveis por programas específicos e podem revelar muito sobre a origem de um conteúdo.",
    exemplo:
      "Uma foto enviada pelo WhatsApp pode conter nos metadados o modelo do celular, a data exata e as coordenadas GPS de onde foi tirada.",
  },
  {
    palavra: "Metadados EXIF",
    definicao:
      "Padrão específico de metadados criado para câmeras digitais e smartphones. EXIF é a sigla em inglês para 'Exchangeable Image File Format' (Formato de Arquivo de Imagem Intercambiável). Além das informações básicas, o EXIF registra dados técnicos da câmera (abertura de lente, velocidade, ISO) e o nome do software de edição usado — o que ajuda a verificar se uma imagem foi alterada após ser tirada.",
    exemplo:
      "Uma foto apresentada como sendo de 2015 mas com data EXIF de 2023 provavelmente foi tirada recentemente — o que levanta dúvidas sobre o contexto em que está sendo usada.",
  },
  {
    palavra: "Microtargeting",
    definicao:
      "Técnica que usa dados pessoais (comportamento online, localização, preferências) para direcionar mensagens específicas a grupos muito segmentados de pessoas. Quando usado com desinformação, permite enviar conteúdos falsos adaptados às vulnerabilidades de cada grupo.",
  },
  {
    palavra: "Misinformação",
    definicao:
      "Informação falsa ou imprecisa compartilhada sem necessariamente haver intenção de enganar. Diferente da desinformação, a misinformação pode acontecer por erro, desatualização ou má interpretação de dados.",
    exemplo:
      "Compartilhar uma notícia antiga como se fosse atual, sem perceber que o contexto mudou.",
  },
  {
    palavra: "Pretexting",
    definicao:
      "Tática de engenharia social em que o atacante cria uma identidade falsa ou uma história inventada — o pretexto — para ganhar a confiança da vítima e extrair informações ou acesso. Para tornar o pretexto convincente, o golpista costuma pesquisar detalhes reais sobre a vítima: nome, cargo, colegas e rotinas.",
    exemplo:
      "Alguém que liga fingindo ser do setor de TI da empresa e afirma ter 'identificado atividade suspeita na sua conta' para obter login e senha.",
  },
  {
    palavra: "Phishing",
    definicao:
      "Golpe digital em que criminosos se passam por empresas, bancos, órgãos do governo ou pessoas conhecidas para enganar a vítima e obter dados pessoais, senhas ou dinheiro. O nome vem do inglês 'fishing' (pescar) — a ideia é 'pescar' informações das vítimas com uma isca atraente. O golpe chega geralmente por e-mail, SMS ou link falso compartilhado em aplicativos de mensagens.",
    exemplo:
      "Um e-mail que parece ser do seu banco pedindo para 'atualizar seus dados' por um link — o link leva a um site falso idêntico ao original, que captura sua senha.",
  },
  {
    palavra: "Pós-verdade",
    definicao:
      "Contexto em que apelos a emoções e crenças pessoais influenciam mais a opinião pública do que fatos verificáveis. O Oxford English Dictionary elegeu 'post-truth' como a palavra do ano em 2016. Num ambiente de pós-verdade, desmentir um boato pode ser menos eficaz do que o boato original.",
  },
  {
    palavra: "Propaganda",
    definicao:
      "Difusão sistemática e organizada de informações (verdadeiras ou falsas) para promover um ponto de vista, uma ideologia ou um grupo político. Diferente do jornalismo, a propaganda não busca informar com equilíbrio — busca persuadir e mobilizar.",
  },
  {
    palavra: "Quid pro quo",
    definicao:
      "Do latim 'uma coisa por outra'. Tática de engenharia social em que o atacante oferece um favor, serviço ou benefício em troca de informações confidenciais ou acesso a sistemas. A aparência de troca justa e voluntária baixa a guarda da vítima, que sente que está apenas aceitando ajuda.",
    exemplo:
      "Colega que se oferece para resolver um problema no computador em troca de usar seu login 'por um segundo' para acessar um sistema.",
  },
  {
    palavra: "Rapport",
    definicao:
      "Técnica de engenharia social que consiste em construir um relacionamento afetivo genuíno ao longo do tempo — sendo prestativo, gentil e presente — para depois usar a confiança conquistada como alavanca para obter informações ou acessos. Explora a reciprocidade social: a tendência humana de querer retribuir quem nos tratou bem.",
    exemplo:
      "Novo colega que durante semanas age de forma exemplar, ajudando a todos, para depois pedir emprestada a senha de alguém 'só por hoje, numa emergência'.",
  },
  {
    palavra: "Teoria da conspiração",
    definicao:
      "Explicação alternativa para eventos que atribui causas a grupos secretos e poderosos agindo de forma coordenada, sem evidências verificáveis. Algumas conspiratações começam como hipóteses legítimas, mas se tornam problemáticas quando resistem a qualquer evidência contrária.",
  },
  {
    palavra: "Urgência falsa",
    definicao:
      "Técnica de engenharia social que usa pressão de tempo artificial — prazos curtos, ameaças de consequências graves e imediatas — para impedir que a vítima pense com calma, verifique a legitimidade da mensagem ou consulte outras pessoas antes de agir. O estado de urgência desativa o pensamento crítico e favorece reações impulsivas.",
    exemplo:
      "E-mail que afirma 'Sua conta será bloqueada em 2 horas se você não clicar aqui agora' — o prazo curto e a ameaça buscam provocar uma ação imediata sem reflexão.",
  },
  {
    palavra: "Viés de confirmação",
    definicao:
      "Tendência humana de buscar, interpretar e lembrar informações que confirmam o que já acreditamos, ignorando ou desvalorizando evidências contrárias. É um dos principais motivos pelos quais a desinformação se espalha — as pessoas compartilham o que confirma sua visão de mundo.",
  },
  {
    palavra: "Viralização",
    definicao:
      "Fenômeno em que um conteúdo se espalha rapidamente pela internet por meio de compartilhamentos em cadeia, alcançando grande audiência em pouco tempo. A velocidade da viralização muitas vezes supera a capacidade de verificação, sendo um dos principais vetores da desinformação.",
  },
];

// Organiza os termos em grupos por letra inicial
const GRUPOS = TERMOS.reduce<Record<string, Termo[]>>((acc, termo) => {
  const letra = termo.palavra[0].toUpperCase();
  if (!acc[letra]) acc[letra] = [];
  acc[letra].push(termo);
  return acc;
}, {});

export default function PaginaGlossario() {
  const letras = Object.keys(GRUPOS).sort();

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <BookMarked className="h-8 w-8 text-white" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Glossário
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Termos essenciais para entender desinformação e checagem de fatos
          </p>
        </header>

        {/* Índice de letras */}
        <nav
          aria-label="Índice do glossário"
          className="mb-8 flex flex-wrap gap-2 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          {letras.map((letra) => (
            <a
              key={letra}
              href={`#letra-${letra}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50 hover:border-indigo-300"
            >
              {letra}
            </a>
          ))}
        </nav>

        {/* Termos agrupados por letra */}
        <div className="space-y-10">
          {letras.map((letra, i) => (
            <section
              key={letra}
              id={`letra-${letra}`}
              className="animate-fade-in-up scroll-mt-20"
              style={{ animationDelay: `${0.1 + i * 0.04}s` }}
            >
              {/* Separador de letra */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 text-lg font-bold text-white shadow-md">
                  {letra}
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-4">
                {GRUPOS[letra].map((termo) => (
                  <article
                    key={termo.palavra}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
                  >
                    <h2 className="mb-2 text-base font-bold text-slate-900">
                      {termo.palavra}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-700 text-justify">
                      {termo.definicao}
                    </p>
                    {termo.exemplo && (
                      <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800 text-justify">
                        <span className="font-semibold">Exemplo: </span>
                        {termo.exemplo}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
