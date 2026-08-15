import {
  BarChart2,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Zap,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Pesquisa e Dados — LUPA",
  description:
    "Dados sobre desinformação no Brasil e no mundo, ferramentas de combate à desinformação e referências científicas.",
};

const NUMEROS = [
  {
    destaque: "6×",
    rotulo: "mais rápido",
    texto:
      "Notícias falsas chegam a 1.500 pessoas 6 vezes mais rápido do que notícias verdadeiras — conclusão de um estudo que analisou 126 mil histórias compartilhadas no Twitter entre 2006 e 2017.",
    fonte: "Vosoughi, Roy & Aral — Science, 2018",
    url: "https://doi.org/10.1126/science.aap9559",
    cor: "border-red-200 bg-red-50 text-red-900",
    corDestaque: "text-red-600",
  },
  {
    destaque: "72%",
    rotulo: "muito preocupados com fake news",
    texto:
      "72% dos brasileiros estão muito preocupados com a quantidade de notícias falsas divulgadas nas redes sociais, segundo pesquisa do DataSenado.",
    fonte: "DataSenado — Redes Sociais e Notícias Falsas",
    url: "https://www12.senado.leg.br/institucional/datasenado/materias/pesquisas/redes-sociais-e-noticias-falsas",
    cor: "border-orange-200 bg-orange-50 text-orange-900",
    corDestaque: "text-orange-600",
  },
  {
    destaque: "2015",
    rotulo: "primeira agência brasileira",
    texto:
      "A Agência Lupa foi fundada em outubro de 2015 como a primeira agência brasileira dedicada exclusivamente à checagem profissional de fatos.",
    fonte: "Agência Lupa — Sobre a Lupa, 2015",
    url: "https://lupa.uol.com.br/sobre-a-lupa/",
    cor: "border-blue-200 bg-blue-50 text-blue-900",
    corDestaque: "text-blue-600",
  },
  {
    destaque: "\"infodemia\"",
    rotulo: "novo conceito global",
    texto:
      "Em fevereiro de 2020, a OMS criou o termo 'infodemia' para descrever a avalanche de informações — verdadeiras e falsas — que dificulta encontrar orientações confiáveis em crises de saúde.",
    fonte: "Organização Mundial da Saúde — PAHO, 2020",
    url: "https://www.who.int/health-topics/infodemic",
    cor: "border-purple-200 bg-purple-50 text-purple-900",
    corDestaque: "text-purple-600",
  },
];

type Ferramenta = {
  nome: string;
  descricao: string;
  url: string;
  pontosFortes: string[];
};

const FERRAMENTAS: Ferramenta[] = [
  {
    nome: "Agência Lupa",
    descricao:
      "Primeira agência brasileira de fact-checking. Jornalistas especializados analisam declarações de figuras públicas e notícias virais com rigor editorial.",
    url: "https://lupa.uol.com.br",
    pontosFortes: [
      "Primeira agência certificada pela IFCN no Brasil (desde 2016)",
      "Foco em declarações de figuras públicas e verificação política",
      "Kits pedagógicos gratuitos para professores",
    ],
  },
  {
    nome: "Aos Fatos",
    descricao:
      "Agência independente focada em política e saúde pública. Destaque pelo verificador 'Fátima', que monitora declarações de políticos em tempo real.",
    url: "https://www.aosfatos.org",
    pontosFortes: [
      "Verificador 'Fátima': monitora políticos em tempo real",
      "Chatbot no WhatsApp para consultas rápidas",
      "Cobertura especializada em saúde pública e eleições",
    ],
  },
  {
    nome: "Boatos.org",
    descricao:
      "Site comunitário brasileiro com foco em boatos e correntes virais. O conteúdo é enviado por leitores e revisado manualmente pela equipe.",
    url: "https://www.boatos.org",
    pontosFortes: [
      "Maior banco de boatos virais em português",
      "Foco em correntes de WhatsApp e redes sociais",
      "Contribuição ativa da comunidade de leitores",
    ],
  },
  {
    nome: "Google Fact Check Explorer",
    descricao:
      "Ferramenta do Google que agrega checagens publicadas por agências certificadas. Não analisa conteúdo novo — apenas indexa verificações já publicadas.",
    url: "https://toolbox.google.com/factcheck/explorer",
    pontosFortes: [
      "Busca global em centenas de agências certificadas pela IFCN",
      "Integrado com o Google Search",
      "Acesso gratuito, sem necessidade de cadastro",
    ],
  },
  {
    nome: "InVID / WeVerify",
    descricao:
      "Extensão de navegador para verificação de vídeos e imagens. Poderosa, mas voltada a jornalistas com conhecimento técnico.",
    url: "https://weverify.eu/",
    pontosFortes: [
      "Análise forense de vídeos: data, localização e edição",
      "Busca reversa de imagens e frames extraídos",
      "Extensão gratuita para Chrome e Firefox",
    ],
  },
];

const DIFERENCIAIS = [
  {
    titulo: "Análise em segundos, não em dias",
    texto:
      "Agências profissionais podem levar horas ou dias para publicar uma checagem. O LUPA devolve uma análise completa em segundos — ideal para decidir na hora se vale compartilhar.",
  },
  {
    titulo: "Cobre cinco tipos de conteúdo",
    texto:
      "Um único site analisa links de sites, vídeos do YouTube, arquivos de vídeo enviados do celular, textos copiados e fotografias — sem precisar de ferramentas diferentes para cada formato.",
  },
  {
    titulo: "Explica o porquê da pontuação",
    texto:
      "Toda nota vem acompanhada das justificativas que a geraram. O objetivo não é dizer 'é falso' — é ensinar o usuário a reconhecer os padrões por conta própria.",
  },
  {
    titulo: "Portal de boatos hiperlocal",
    texto:
      "Qualquer pessoa pode reportar um boato do próprio bairro, escola ou condomínio. A equipe encaminha à autoridade competente e publica a resposta — algo que nenhuma agência nacional oferece nessa escala local.",
  },
  {
    titulo: "Sem cadastro, sem rastreamento",
    texto:
      "Nenhuma análise armazena dados pessoais. Não há login, histórico no servidor nem perfil de usuário. Privacidade é um princípio, não uma opção.",
  },
  {
    titulo: "API aberta para desenvolvedores",
    texto:
      "Qualquer escola, ONG ou desenvolvedor pode integrar as análises do LUPA em seus próprios projetos — de forma gratuita e documentada.",
  },
];

// ============================================================
// Referências bibliográficas — normas ABNT (NBR 6023)
// ============================================================
//
// Cada referência é dividida em três partes porque a ABNT destaca
// um elemento diferente conforme o tipo de obra:
//   - em ARTIGO de periódico, destaca-se o nome da revista;
//   - em LIVRO ou RELATÓRIO, destaca-se o título da obra.
// Por isso os campos `antes`, `destaque` e `depois`.
//
// ⚠️ ANTES DA ENTREGA: confirmar o link direto e a data de acesso das
// referências marcadas com `conferirLink: true`. Abrir o documento,
// copiar a URL exata e atualizar DATA_ACESSO para o dia da conferência.

const DATA_ACESSO = "15 ago. 2026";

type TipoFonte =
  | "Artigo científico"
  | "Relatório institucional"
  | "Manual técnico"
  | "E-book"
  | "Vídeo"
  | "Material educativo";

type Referencia = {
  tipo: TipoFonte;
  antes: string;
  destaque: string;
  depois: string;
  url: string;
  nota: string;
  conferirLink?: boolean;
};

const REFERENCIAS: Referencia[] = [
  // ----- Artigos científicos -----
  {
    tipo: "Artigo científico",
    antes: "VOSOUGHI, Soroush; ROY, Deb; ARAL, Sinan. The spread of true and false news online. ",
    destaque: "Science",
    depois: ", v. 359, n. 6380, p. 1146-1151, 2018. DOI: 10.1126/science.aap9559.",
    url: "https://doi.org/10.1126/science.aap9559",
    nota: "Embasa o dado de que notícias falsas se espalham mais rápido, usado na seção 'Em números' desta página.",
  },
  {
    tipo: "Artigo científico",
    antes: "ROOZENBEEK, Jon; VAN DER LINDEN, Sander. Fake news game confers psychological resistance against online misinformation. ",
    destaque: "Humanities and Social Sciences Communications",
    depois: ", v. 5, art. 65, 2019. DOI: 10.1057/s41599-019-0279-9.",
    url: "https://doi.org/10.1057/s41599-019-0279-9",
    nota: "Base científica dos jogos do LUPA: demonstra que jogar com desinformação cria resistência psicológica a ela. Fundamenta o Agente LUPA e a página 'Acelerador e Freio'.",
  },
  {
    tipo: "Artigo científico",
    antes: "PENNYCOOK, Gordon; MCPHETRES, Jonathon; ZHANG, Yunhao; LU, Jackson G.; RAND, David G. Fighting COVID-19 misinformation on social media: experimental evidence for a scalable accuracy-nudge intervention. ",
    destaque: "Psychological Science",
    depois: ", v. 31, n. 7, p. 770-780, 2020. DOI: 10.1177/0956797620939054.",
    url: "https://doi.org/10.1177/0956797620939054",
    nota: "Mostra que simplesmente lembrar a pessoa de pensar na precisão antes de compartilhar já reduz a propagação. Inspirou o formato das dicas exibidas junto de cada análise.",
  },
  {
    tipo: "Artigo científico",
    antes: "PENNYCOOK, Gordon; RAND, David G. Accuracy prompts are a replicable and generalizable approach for reducing the spread of misinformation. ",
    destaque: "Nature Communications",
    depois: ", v. 13, art. 2333, 2022. DOI: 10.1038/s41467-022-30073-5.",
    url: "https://doi.org/10.1038/s41467-022-30073-5",
    nota: "Confirma em escala o resultado anterior. Sustenta a decisão de o LUPA sempre explicar o porquê da nota, em vez de apenas exibir um veredito.",
  },

  // ----- Relatórios e documentos institucionais -----
  {
    tipo: "Relatório institucional",
    antes: "WARDLE, Claire; DERAKHSHAN, Hossein. ",
    destaque: "Information disorder: toward an interdisciplinary framework for research and policy making",
    depois: ". Strasbourg: Council of Europe, 2017.",
    url: "https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c",
    nota: "Origem da distinção entre desinformação (falsa e intencional), mesinformação (falsa sem intenção) e malinformação. Sustenta a escolha do LUPA por linguagem neutra, sem acusar intenção.",
  },
  {
    tipo: "Relatório institucional",
    antes: "UNESCO. ",
    destaque: "Media and information literate citizens: think critically, click wisely!",
    depois: " 2. ed. Paris: UNESCO, 2021.",
    url: "https://www.unesco.org/en/media-information-literacy",
    nota: "Currículo internacional de letramento midiático. Referência para a organização do conteúdo educativo do site.",
    conferirLink: true,
  },
  {
    tipo: "Relatório institucional",
    antes: "UNESCO. ",
    destaque: "Media and information literacy curriculum for teachers",
    depois: ". Paris: UNESCO, 2011.",
    url: "https://www.unesco.org/en/media-information-literacy",
    nota: "Base da área do Professor: como transformar letramento midiático em atividade de sala de aula.",
    conferirLink: true,
  },
  {
    tipo: "Relatório institucional",
    antes: "BRASIL. Senado Federal. Instituto de Pesquisa DataSenado. ",
    destaque: "Panorama Político 2024: notícias falsas e democracia",
    depois: ". Brasília, DF: Senado Federal, 2024.",
    url: "https://www.senado.leg.br/institucional/datasenado/relatorio_online/pesquisa_fake_news/2024/interativo.html#acesso-a-not%C3%ADcias-falsas-e-seus-impactos",
    nota: "Dados sobre a preocupação da população brasileira com notícias falsas — dimensiona o problema no país.",
    conferirLink: true,
  },
  {
    tipo: "Relatório institucional",
    antes: "COMITÊ GESTOR DA INTERNET NO BRASIL. ",
    destaque: "TIC Kids Online Brasil 2024: crianças e adolescentes",
    depois: ". São Paulo: CGI.br, 2024.",
    url: "https://cetic.br/pesquisa/kids-online/",
    nota: "Retrato de como crianças e adolescentes brasileiros usam a internet. Justifica o público-alvo do LUPA e a linguagem adotada.",
    conferirLink: true,
  },
  {
    tipo: "Relatório institucional",
    antes: "NÚCLEO DE INFORMAÇÃO E COORDENAÇÃO DO PONTO BR. ",
    destaque: "TIC Domicílios 2023",
    depois: ": pesquisa sobre o uso das tecnologias de informação e comunicação nos domicílios brasileiros. São Paulo: NIC.br, 2023.",
    url: "https://cetic.br/pesquisa/domicilios/",
    nota: "Dados de acesso à internet no Brasil, usados para dimensionar o alcance possível de uma ferramenta como o LUPA.",
    conferirLink: true,
  },
  {
    tipo: "Relatório institucional",
    antes: "ORGANIZAÇÃO MUNDIAL DA SAÚDE. ",
    destaque: "Infodemic",
    depois: ". Genebra: OMS, [s. d.].",
    url: "https://www.who.int/health-topics/infodemic",
    nota: "Origem do conceito de 'infodemia', citado na seção 'Em números' desta página.",
  },

  // ----- Manual técnico -----
  {
    tipo: "Manual técnico",
    antes: "GOOGLE. ",
    destaque: "Fact Check Tools API",
    depois: ": documentação para desenvolvedores. [S. l.]: Google Developers, [s. d.].",
    url: "https://developers.google.com/fact-check/tools/api",
    nota: "Documentação técnica usada para integrar o LUPA ao banco global de checagens da rede IFCN — e para corrigir os falsos positivos encontrados nos testes.",
  },

  // ----- E-book, vídeo e material educativo -----
  {
    tipo: "E-book",
    antes: "BEMTV. ",
    destaque: "Muito mais que fake news",
    depois: ". [S. l.]: Bemtv, 2022. E-book.",
    url: "https://bemtv.org.br/wp-content/uploads/2022/06/ebook-fake-news.pdf",
    nota: "Material introdutório sobre fake news voltado a adolescentes e educadores. Indicado na Biblioteca do LUPA e usado como referência de linguagem acessível para o público jovem.",
    conferirLink: true,
  },
  {
    tipo: "Vídeo",
    antes: "EDUCAMÍDIA. ",
    destaque: "Educação midiática",
    depois: ": playlist do canal no YouTube. [S. l.]: YouTube, [s. d.].",
    url: "https://www.youtube.com/playlist?list=PLXSpBL0lECkVL35XerdUJHisgS8vNOFmg",
    nota: "Formação audiovisual em educação midiática, referência nacional para educadores e famílias.",
    conferirLink: true,
  },
  {
    tipo: "Material educativo",
    antes: "EDUCAMÍDIA. ",
    destaque: "Recursos para educadores",
    depois: ". São Paulo: Instituto Palavra Aberta, [s. d.].",
    url: "https://educamidia.org.br/educadores/",
    nota: "Planos de aula e materiais abertos de educação midiática, indicados como complemento na área do Professor.",
    conferirLink: true,
  },
];

export default function PaginaPesquisa() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <BarChart2 className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Pesquisa e Dados
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            O que a ciência diz sobre desinformação, quais ferramentas existem
            e as referências científicas por trás desta iniciativa.
          </p>
        </header>

        {/* Aviso metodológico */}
        <div
          className="mb-10 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 animate-fade-in-up dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200"
          style={{ animationDelay: "0.05s" }}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <p className="text-justify">
            Os dados apresentados nesta página são baseados em publicações
            acadêmicas e relatórios de organizações reconhecidas. As
            informações sobre cada ferramenta refletem o estado em abril de
            2026.
          </p>
        </div>

        {/* Seção: Em números */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            A desinformação em números
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NUMEROS.map((item) => (
              <div
                key={item.destaque}
                className={`rounded-2xl border p-5 ${item.cor} dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}
              >
                <div
                  className={`mb-1 text-3xl font-black ${item.corDestaque} dark:text-slate-100`}
                >
                  {item.destaque}
                </div>
                <div className="mb-2 text-sm font-bold uppercase tracking-wide opacity-70">
                  {item.rotulo}
                </div>
                <p className="text-sm leading-relaxed text-justify opacity-90">
                  {item.texto}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs italic opacity-60 hover:opacity-100 hover:underline transition-opacity"
                >
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  {item.fonte}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Ferramentas */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            Ferramentas de combate à desinformação
          </h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
            Cada ferramenta tem um foco diferente e resolve um problema
            específico. Conheça os pontos fortes de cada uma.
          </p>

          <div className="space-y-4">
            {FERRAMENTAS.map((f, i) => (
              <div
                key={f.nome}
                className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm animate-fade-in-up dark:border-slate-700 dark:bg-slate-800"
                style={{ animationDelay: `${0.2 + i * 0.04}s` }}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    {f.nome}
                  </h3>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-shrink-0 items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visitar
                  </a>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                  {f.descricao}
                </p>
                <ul className="space-y-1.5">
                  {f.pontosFortes.map((ponto) => (
                    <li key={ponto} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Diferenciais */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            O que o LUPA faz
          </h2>
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="space-y-4">
              {DIFERENCIAIS.map((d) => (
                <div
                  key={d.titulo}
                  className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                  <span className="text-justify">
                    <strong className="text-slate-900 dark:text-slate-100">
                      {d.titulo}:
                    </strong>{" "}
                    {d.texto}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção: Referências */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Referências bibliográficas
            </h2>
          </div>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400 text-justify">
            Fontes que embasaram a compreensão do problema e o desenvolvimento
            da solução, citadas segundo as normas da ABNT (NBR 6023). A lista
            reúne artigos científicos, relatórios institucionais, documentação
            técnica e material audiovisual.
          </p>
          <ol className="space-y-3">
            {REFERENCIAS.map((ref) => (
              <li
                key={ref.destaque + ref.antes}
                className="rounded-2xl border border-slate-200/60 bg-white/80 px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  {ref.tipo}
                </span>

                {/* Citação no formato ABNT */}
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {ref.antes}
                  <span className="font-bold">{ref.destaque}</span>
                  {ref.depois}{" "}
                  <span className="text-slate-600 dark:text-slate-400">
                    Disponível em:{" "}
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-800 dark:text-indigo-400 dark:decoration-indigo-700"
                    >
                      {ref.url}
                    </a>
                    . Acesso em: {DATA_ACESSO}.
                  </span>
                </p>

                {/* Para que serviu no projeto */}
                <p className="mt-2 border-l-2 border-slate-200 pl-3 text-xs leading-relaxed text-justify text-slate-600 dark:border-slate-600 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">
                    Como foi usada:
                  </strong>{" "}
                  {ref.nota}
                </p>
              </li>
            ))}
          </ol>
        </section>

      </div>
    </main>
  );
}
