import {
  BarChart2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Zap,
  BookOpen,
  MinusCircle,
} from "lucide-react";

export const metadata = {
  title: "Pesquisa e Dados — LUPA",
  description:
    "Dados sobre desinformação no Brasil e no mundo, comparativo de ferramentas de checagem e referências científicas.",
};

const NUMEROS = [
  {
    destaque: "6×",
    rotulo: "mais rápido",
    texto:
      "Uma informação falsa se espalha até 6 vezes mais rápido que uma verdadeira nas redes sociais, chegando a 1.500 pessoas muito antes de qualquer correção.",
    fonte: "Vosoughi, Roy & Aral — Science, 2018",
    url: "https://doi.org/10.1126/science.aap9559",
    cor: "border-red-200 bg-red-50 text-red-900",
    corDestaque: "text-red-600",
  },
  {
    destaque: "70%",
    rotulo: "mais compartilhada",
    texto:
      "Conteúdos falsos têm 70% mais chance de serem recompartilhados do que verdadeiros. A surpresa e a indignação amplificam a viralização.",
    fonte: "Vosoughi, Roy & Aral — Science, 2018",
    url: "https://doi.org/10.1126/science.aap9559",
    cor: "border-orange-200 bg-orange-50 text-orange-900",
    corDestaque: "text-orange-600",
  },
  {
    destaque: "2015",
    rotulo: "primeira agência brasileira",
    texto:
      "A Agência Lupa foi fundada em outubro de 2015 como a primeira agência brasileira dedicada exclusivamente à checagem profissional de fatos.",
    fonte: "Duke Reporter's Lab — Global Fact-Checking Census, 2024",
    url: "https://reporterslab.org/fact-checking/",
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

type Nivel = "sim" | "nao" | "parcial";

type Ferramenta = {
  nome: string;
  descricao: string;
  url: string | null;
  isLupa: boolean;
  automatica: Nivel;
  tempoReal: Nivel;
  multiformato: Nivel;
  educacional: Nivel;
  semCadastro: Nivel;
  comunidade: Nivel;
};

const FERRAMENTAS: Ferramenta[] = [
  {
    nome: "Agência Lupa",
    descricao:
      "Primeira agência brasileira de fact-checking. Jornalistas especializados analisam declarações de figuras públicas e notícias virais com rigor editorial.",
    url: "https://lupa.uol.com.br",
    isLupa: false,
    automatica: "nao",
    tempoReal: "nao",
    multiformato: "nao",
    educacional: "parcial",
    semCadastro: "sim",
    comunidade: "nao",
  },
  {
    nome: "Aos Fatos",
    descricao:
      "Agência independente focada em política e saúde pública. Destaque pelo verificador 'Fátima', que monitora declarações de políticos em tempo real.",
    url: "https://www.aosfatos.org",
    isLupa: false,
    automatica: "parcial",
    tempoReal: "nao",
    multiformato: "nao",
    educacional: "parcial",
    semCadastro: "sim",
    comunidade: "nao",
  },
  {
    nome: "Boatos.org",
    descricao:
      "Site comunitário brasileiro com foco em boatos e correntes virais. O conteúdo é enviado por leitores e revisado manualmente pela equipe.",
    url: "https://www.boatos.org",
    isLupa: false,
    automatica: "nao",
    tempoReal: "nao",
    multiformato: "nao",
    educacional: "nao",
    semCadastro: "sim",
    comunidade: "sim",
  },
  {
    nome: "Google Fact Check Explorer",
    descricao:
      "Ferramenta do Google que agrega checagens publicadas por agências certificadas. Não analisa conteúdo novo — apenas indexa verificações já publicadas.",
    url: "https://toolbox.google.com/factcheck/explorer",
    isLupa: false,
    automatica: "nao",
    tempoReal: "nao",
    multiformato: "nao",
    educacional: "nao",
    semCadastro: "sim",
    comunidade: "nao",
  },
  {
    nome: "InVID / WeVerify",
    descricao:
      "Extensão de navegador para verificação de vídeos e imagens. Poderosa, mas voltada a jornalistas com conhecimento técnico.",
    url: "https://weverify.eu/",
    isLupa: false,
    automatica: "parcial",
    tempoReal: "sim",
    multiformato: "parcial",
    educacional: "nao",
    semCadastro: "sim",
    comunidade: "nao",
  },
  {
    nome: "LUPA (este site)",
    descricao:
      "Análise automatizada com IA para links, vídeos do YouTube, arquivos de vídeo, textos e imagens. Foco educacional: explica o porquê de cada critério avaliado.",
    url: null,
    isLupa: true,
    automatica: "sim",
    tempoReal: "sim",
    multiformato: "sim",
    educacional: "sim",
    semCadastro: "sim",
    comunidade: "sim",
  },
];

const CRITERIOS: {
  chave: keyof Omit<Ferramenta, "nome" | "descricao" | "url" | "isLupa">;
  rotulo: string;
}[] = [
  { chave: "automatica", rotulo: "Análise automática" },
  { chave: "tempoReal", rotulo: "Resultado imediato" },
  { chave: "multiformato", rotulo: "Múltiplos formatos" },
  { chave: "educacional", rotulo: "Foco educacional" },
  { chave: "semCadastro", rotulo: "Sem cadastro" },
  { chave: "comunidade", rotulo: "Portal comunitário" },
];

function IconeNivel({ nivel }: { nivel: Nivel }) {
  if (nivel === "sim")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
  if (nivel === "nao")
    return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />;
  return <MinusCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />;
}

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

const REFERENCIAS = [
  {
    autores: "Vosoughi, S., Roy, D., & Aral, S.",
    ano: "2018",
    titulo: "The spread of true and false news online",
    veiculo: "Science, 359(6380), 1146–1151",
    nota:
      "Estudo mais citado sobre velocidade de propagação de desinformação. Analisou 126.000 histórias compartilhadas no Twitter entre 2006 e 2017.",
    url: "https://doi.org/10.1126/science.aap9559",
  },
  {
    autores: "Wardle, C., & Derakhshan, H.",
    ano: "2017",
    titulo: "Information Disorder: Toward an interdisciplinary framework",
    veiculo: "Conselho da Europa",
    nota:
      "Criou a taxonomia mais usada para distinguir desinformação (falsa + intencional), mesinformação (falsa + sem intenção) e malinformação (verdadeira + usada para prejudicar).",
    url: "https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c",
  },
  {
    autores: "Reuters Institute for the Study of Journalism",
    ano: "2024",
    titulo: "Digital News Report 2024",
    veiculo: "Universidade de Oxford",
    nota:
      "Pesquisa anual realizada em 47 países, incluindo o Brasil. Mede confiança nas notícias, uso de redes sociais e exposição à desinformação.",
    url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024",
  },
  {
    autores: "Organização Mundial da Saúde (OMS)",
    ano: "2020",
    titulo: "Infodemic Management: A key component of the COVID-19 Global Response",
    veiculo: "WHO — Pan American Health Organization",
    nota:
      "Documento que cunhou formalmente o termo 'infodemia' e definiu estratégias de resposta à desinformação em emergências de saúde pública.",
    url: "https://www.who.int/health-topics/infodemic",
  },
  {
    autores: "UNESCO",
    ano: "2023",
    titulo: "Media and Information Literacy — Global Framework",
    veiculo: "United Nations Educational, Scientific and Cultural Organization",
    nota:
      "Estrutura curricular usada por educadores em todo o mundo para ensinar letramento midiático. Base teórica do enfoque educacional do LUPA.",
    url: "https://www.unesco.org/en/media-information-literacy",
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
            O que a ciência diz sobre desinformação, como as ferramentas existentes
            se comparam e por que o LUPA foi construído do jeito que foi.
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
            acadêmicas e relatórios de organizações reconhecidas. O comparativo
            de ferramentas reflete o estado de cada produto em abril de 2026.
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

        {/* Seção: Comparativo */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            Ferramentas de combate à desinformação
          </h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
            Cada ferramenta tem um foco diferente. O comparativo abaixo mostra
            as capacidades de cada uma — não existe &quot;melhor&quot; absoluto, pois cada
            uma resolve um problema específico.
          </p>

          <div className="space-y-4">
            {FERRAMENTAS.map((f, i) => (
              <div
                key={f.nome}
                className={`rounded-2xl border p-5 shadow-sm animate-fade-in-up ${
                  f.isLupa
                    ? "border-indigo-200 bg-indigo-50 dark:border-indigo-700/50 dark:bg-indigo-900/20"
                    : "border-slate-200/60 bg-white/80 dark:border-slate-700 dark:bg-slate-800"
                }`}
                style={{ animationDelay: `${0.2 + i * 0.04}s` }}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3
                    className={`font-bold ${
                      f.isLupa
                        ? "text-indigo-800 dark:text-indigo-300"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {f.nome}
                    {f.isLupa && (
                      <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200">
                        este site
                      </span>
                    )}
                  </h3>
                  {f.url && (
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-shrink-0 items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visitar
                    </a>
                  )}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                  {f.descricao}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {CRITERIOS.map(({ chave, rotulo }) => (
                    <div key={chave} className="flex items-center gap-1.5">
                      <IconeNivel nivel={f[chave]} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {rotulo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Sim
            </span>
            <span className="flex items-center gap-1">
              <MinusCircle className="h-3.5 w-3.5 text-amber-400" /> Parcial
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-red-400" /> Não
            </span>
          </div>
        </section>

        {/* Seção: Diferenciais */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            O que diferencia o LUPA
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
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Referências e fontes
            </h2>
          </div>
          <div className="space-y-3">
            {REFERENCIAS.map((ref, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/60 bg-white/80 px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {ref.autores} ({ref.ano}).{" "}
                    <em>{ref.titulo}</em>.
                  </p>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-shrink-0 items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Acessar
                  </a>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {ref.veiculo}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                  {ref.nota}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
