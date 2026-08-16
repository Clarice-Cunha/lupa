import type { ReactNode } from "react";
import {
  FileText,
  Users,
  Cpu,
  Database,
  Code2,
  BookOpen,
  Lock,
  Scale,
  AlertTriangle,
  Mail,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

export const metadata = {
  title: "Ficha Técnica — LUPA",
  description:
    "Quem fez o LUPA, quais tecnologias e inteligências artificiais são usadas, de onde vem o conteúdo educativo e como os dados são tratados.",
};

// ============================================================
// Dados da ficha
// ============================================================

type Membro = {
  nome: string;
  papel: string;
  contribuicoes: string[];
};

const EQUIPE: Membro[] = [
  {
    nome: "Clarice Cunha Pinto",
    papel: "Capitã da equipe e desenvolvimento",
    contribuicoes: [
      "Coordenação da equipe e responsável pelos envios oficiais da competição",
      "Desenvolvimento da ferramenta: transformou em código as ideias definidas pela equipe",
      "Testes de confiabilidade do analisador — identificou o falso positivo da checagem IFCN em portais de notícia",
    ],
  },
  {
    nome: "Benjamim de Almeida das Chagas",
    papel: "Pesquisa científica e validação de dados",
    contribuicoes: [
      "Levantamento das pesquisas e dos conceitos científicos que embasam o projeto",
      "Validação dos dados e das fontes usadas nas análises e no conteúdo educativo",
    ],
  },
  {
    nome: "Pedro Moreno de Lima Bessa",
    papel: "Design instrucional",
    contribuicoes: [
      "Design instrucional: definiu como o conteúdo é organizado para ensinar — a sequência das explicações, dos jogos e dos materiais de apoio",
      "Adequação da linguagem e dos percursos de aprendizagem aos diferentes públicos do LUPA",
    ],
  },
];

type Servico = {
  nome: string;
  url: string;
  papel: string;
};

// Serviços externos consultados durante uma análise. Todos são de terceiros —
// o LUPA apenas consulta e cita, não reivindica autoria sobre eles.
const SERVICOS: Servico[] = [
  {
    nome: "Google Gemini",
    url: "https://ai.google.dev",
    papel:
      "Modelo de linguagem que faz a leitura interpretativa de textos, transcrições de vídeo e imagens. É a camada de maior peso na pontuação.",
  },
  {
    nome: "Google Fact Check Tools (rede IFCN)",
    url: "https://toolbox.google.com/factcheck/explorer",
    papel:
      "Banco global de checagens publicadas por agências certificadas. O LUPA cruza o conteúdo analisado com esse banco e cita a checagem encontrada.",
  },
  {
    nome: "VirusTotal",
    url: "https://www.virustotal.com",
    papel:
      "Cruza o endereço analisado com mais de 70 mecanismos antivírus e bases de phishing.",
  },
  {
    nome: "Internet Archive — Wayback Machine",
    url: "https://web.archive.org",
    papel:
      "Histórico público de páginas ao longo do tempo. Usado para saber há quanto tempo um domínio existe e se mudou de forma suspeita.",
  },
  {
    nome: "Firecrawl",
    url: "https://firecrawl.dev",
    papel: "Leitura do conteúdo de páginas web para análise.",
  },
  {
    nome: "YouTube Data API",
    url: "https://developers.google.com/youtube/v3",
    papel:
      "Dados públicos de vídeos e canais: data de publicação, histórico do canal e padrão de visualizações.",
  },
  {
    nome: "Tavily",
    url: "https://tavily.com",
    papel: "Busca na web para complementar a checagem de afirmações.",
  },
];

type Fonte = {
  tema: string;
  origem: string;
  autoria: string;
  url: string;
};

// De onde vem o conteúdo educativo do site. Educação midiática também é
// dar crédito a quem produziu o conhecimento que usamos.
const CURADORIA: Fonte[] = [
  {
    tema: "Método SIFT",
    origem: "Página /metodo-sift",
    autoria:
      "Criado por Mike Caulfield, pesquisador de letramento digital. O LUPA explica e aplica o método, sem reivindicar sua autoria.",
    url: "https://hapgood.us/2019/06/19/sift-the-four-moves/",
  },
  {
    tema: "Prebunking e inoculação psicológica",
    origem: "Página /neurobiologia",
    autoria:
      "Baseado na teoria da inoculação desenvolvida por Sander van der Linden e colegas na Universidade de Cambridge.",
    url: "https://inoculation.science",
  },
  {
    tema: "Fontes confiáveis e agências de checagem",
    origem: "Páginas /fontes-confiaveis e /pesquisa",
    autoria:
      "Seleção baseada nas agências certificadas pela IFCN (International Fact-Checking Network), do Poynter Institute.",
    url: "https://www.poynter.org/ifcn/",
  },
  {
    tema: "Legislação brasileira sobre desinformação",
    origem: "Página /legislacao",
    autoria:
      "Textos legais consultados nas fontes oficiais do governo brasileiro (Planalto e Congresso Nacional).",
    url: "https://www.planalto.gov.br",
  },
  {
    tema: "Dicas de checagem exibidas nas análises",
    origem: "Módulo tips.py",
    autoria:
      "Escritas pela própria equipe, em linguagem simples, e ligadas aos sinais concretamente detectados em cada análise.",
    url: "",
  },
];

type Tecnologia = { camada: string; itens: string };

const TECNOLOGIAS: Tecnologia[] = [
  {
    camada: "Servidor (backend)",
    itens:
      "Python · FastAPI · Uvicorn · Pydantic · BeautifulSoup · lxml · Requests · python-whois · SlowAPI · Pillow · Hachoir · youtube-transcript-api · pytest",
  },
  {
    camada: "Interface (frontend)",
    itens:
      "TypeScript · Next.js · React · Tailwind CSS · Lucide (ícones) · Leaflet (mapa) · Phaser (jogos) · html-to-image (certificado)",
  },
  {
    camada: "Armazenamento e hospedagem",
    itens: "Supabase (banco de dados) · Render (servidor) · Vercel (interface) · GitHub (código e automações)",
  },
];

// ============================================================
// Componentes de apoio
// ============================================================

function Secao({
  icone,
  cor,
  corFundo,
  titulo,
  children,
  atraso,
  id,
}: {
  icone: ReactNode;
  cor: string;
  corFundo: string;
  titulo: string;
  children: ReactNode;
  atraso: number;
  /** Âncora opcional, para que outras páginas possam apontar direto para a seção. */
  id?: string;
}) {
  return (
    <section
      id={id}
      // scroll-mt-20 impede que o menu fixo do topo cubra o título ao chegar pela âncora
      className="animate-fade-in-up scroll-mt-20 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/40 sm:p-8"
      style={{ animationDelay: `${atraso}s` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${corFundo} ${cor}`}>
          {icone}
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{titulo}</h2>
      </div>
      {children}
    </section>
  );
}

function LinhaDados({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-700 sm:flex-row sm:gap-4">
      <dt className="w-full flex-shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400 sm:w-48">
        {rotulo}
      </dt>
      <dd className="text-sm text-slate-800 dark:text-slate-200">{valor}</dd>
    </div>
  );
}

function LinkExterno({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 transition hover:text-indigo-800 dark:text-indigo-400 dark:decoration-indigo-700 dark:hover:text-indigo-300"
    >
      {children}
      <ExternalLink className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
    </a>
  );
}

// ============================================================
// Página
// ============================================================

export default function PaginaFichaTecnica() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-indigo-600 shadow-lg shadow-slate-300 dark:shadow-slate-900">
            <FileText className="h-8 w-8 text-white" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Ficha Técnica
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Quem fez o LUPA, com o quê ele foi feito e de onde vem cada
            conteúdo que você encontra aqui.
          </p>
        </header>

        {/* Nota de princípio */}
        <div
          className="mb-8 flex gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 animate-fade-in-up dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
          style={{ animationDelay: "0.05s" }}
        >
          <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <p className="text-justify">
            Educação midiática também é dar os devidos créditos a tudo que
            vem de outro lugar. Esta página existe para que qualquer pessoa
            saiba exatamente quem está por trás do LUPA, que tecnologias ele
            usa e em que conhecimento ele se apoia.
          </p>
        </div>

        <div className="space-y-5">
          {/* ---------------- Identificação ---------------- */}
          <Secao
            icone={<FileText className="h-5 w-5" />}
            cor="text-slate-600 dark:text-slate-300"
            corFundo="bg-slate-100 dark:bg-slate-700"
            titulo="Identificação do projeto"
            atraso={0.1}
          >
            <dl>
              <LinhaDados
                rotulo="Nome completo"
                valor="LUPA — Leitor de URLs, Plataformas e Audiovisuais"
              />
              <LinhaDados
                rotulo="O que é"
                valor="Ferramenta educativa de apoio à checagem de conteúdos digitais, com jogos, biblioteca e recursos para professores."
              />
              <LinhaDados
                rotulo="Escola"
                valor="Complexo Educacional Contemporâneo — Unidade Lagoa Nova"
              />
              <LinhaDados rotulo="Cidade" valor="Natal, Rio Grande do Norte" />
              <LinhaDados
                rotulo="Professor orientador"
                valor="Hector Gabriel Ribeiro Liberalino"
              />
              <LinhaDados
                rotulo="Contexto"
                valor="Desenvolvido para o HackaNAV 2026 — Programa Nave a Vela, tema “Soluções contra a Desinformação Digital”."
              />
              <LinhaDados
                rotulo="Direitos autorais"
                valor="Os estudantes autores são os titulares dos direitos sobre o projeto."
              />
            </dl>
          </Secao>

          {/* ---------------- Quem fez o quê ---------------- */}
          <Secao
            icone={<Users className="h-5 w-5" />}
            cor="text-rose-600 dark:text-rose-400"
            corFundo="bg-rose-100 dark:bg-rose-900/40"
            titulo="Quem fez o quê"
            atraso={0.17}
          >
            <div className="space-y-4">
              {EQUIPE.map((membro) => (
                <div
                  key={membro.nome}
                  className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-700/50"
                >
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {membro.nome}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
                    {membro.papel}
                  </p>
                  {membro.contribuicoes.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {membro.contribuicoes.map((c) => (
                        <li
                          key={c}
                          className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                          <span className="text-justify">{c}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-600">
                <div className="mb-1 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Orientação
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-justify">
                  O professor Hector Gabriel Ribeiro Liberalino acompanhou o
                  desenvolvimento, orientou o processo e deu suporte à equipe.
                  As decisões técnicas e a autoria do projeto são dos estudantes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-600">
                <div className="mb-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Fora da escola
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-justify">
                  Familiares, vizinhos e professores testaram o LUPA e deram
                  retorno que gerou mudanças reais na ferramenta. Quem quiser
                  contribuir com sugestões, correções ou ideias pode fazer
                  isso pela página{" "}
                  <a
                    href="/colaboracao"
                    className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 dark:text-indigo-400 dark:decoration-indigo-700"
                  >
                    Colabore com o LUPA
                  </a>
                  .
                </p>
              </div>
            </div>
          </Secao>

          {/* ---------------- Inteligência artificial ---------------- */}
          <Secao
            icone={<Cpu className="h-5 w-5" />}
            cor="text-violet-600 dark:text-violet-400"
            corFundo="bg-violet-100 dark:bg-violet-900/40"
            titulo="Que inteligência artificial o LUPA usa"
            atraso={0.24}
          >
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p className="text-justify">
                O LUPA usa o <strong>Google Gemini</strong> como camada de
                análise interpretativa. É ele quem lê o texto de uma página, a
                transcrição de um vídeo ou uma imagem e aponta padrões de
                sensacionalismo, inconsistências lógicas, apelos emocionais
                excessivos e indícios de manipulação — incluindo sinais de
                deepfake e de imagens geradas por IA.
              </p>
              <p className="text-justify">
                <strong>O que a IA não faz:</strong> ela não decide sozinha a
                nota final nem declara que algo é verdadeiro ou falso. O
                resultado dela entra como uma camada entre várias, ao lado de
                verificações objetivas que não dependem de IA. E toda
                conclusão vem acompanhada da justificativa que a gerou, para
                que você possa discordar.
              </p>
              <p className="text-justify">
                <strong>Onde a IA pode errar:</strong> em conteúdos ambíguos,
                irônicos ou muito técnicos. Por isso o LUPA é ferramenta de
                apoio à checagem — nunca substituto do julgamento humano nem
                das agências profissionais.
              </p>
            </div>
          </Secao>

          {/* ---------------- Serviços de terceiros ---------------- */}
          <Secao
            icone={<Database className="h-5 w-5" />}
            cor="text-emerald-600 dark:text-emerald-400"
            corFundo="bg-emerald-100 dark:bg-emerald-900/40"
            titulo="Serviços externos consultados"
            atraso={0.31}
          >
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-justify">
              Uma análise do LUPA consulta serviços mantidos por outras
              organizações. Todos os créditos são delas:
            </p>
            <ul className="space-y-3">
              {SERVICOS.map((s) => (
                <li key={s.nome} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-slate-700 dark:text-slate-300 text-justify">
                    <LinkExterno href={s.url}>{s.nome}</LinkExterno> — {s.papel}
                  </span>
                </li>
              ))}
            </ul>
          </Secao>

          {/* ---------------- Curadoria do conteúdo ---------------- */}
          <Secao
            icone={<BookOpen className="h-5 w-5" />}
            cor="text-amber-600 dark:text-amber-400"
            corFundo="bg-amber-100 dark:bg-amber-900/40"
            titulo="De onde vem o conteúdo educativo"
            atraso={0.38}
          >
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-justify">
              O material de aprendizagem do LUPA se apoia em métodos e
              pesquisas de outras pessoas. Cada um tem sua origem declarada:
            </p>
            <ul className="space-y-3.5">
              {CURADORIA.map((f) => (
                <li key={f.tema} className="text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {f.tema}{" "}
                    <span className="font-normal text-slate-400 dark:text-slate-500">
                      · {f.origem}
                    </span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-justify">
                    {f.autoria}{" "}
                    {f.url && <LinkExterno href={f.url}>fonte</LinkExterno>}
                  </p>
                </li>
              ))}
            </ul>
          </Secao>

          {/* ---------------- Tecnologias ---------------- */}
          <Secao
            icone={<Code2 className="h-5 w-5" />}
            cor="text-indigo-600 dark:text-indigo-400"
            corFundo="bg-indigo-100 dark:bg-indigo-900/40"
            titulo="Tecnologias usadas"
            atraso={0.45}
          >
            <div className="space-y-3">
              {TECNOLOGIAS.map((t) => (
                <div key={t.camada}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {t.camada}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{t.itens}</p>
                </div>
              ))}
              <p className="pt-1 text-sm text-slate-600 dark:text-slate-400 text-justify">
                Todas são ferramentas de código aberto ou de uso livre,
                mantidas por suas respectivas comunidades. O detalhamento da
                arquitetura está na página{" "}
                <a
                  href="/tecnico"
                  className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 dark:text-indigo-400 dark:decoration-indigo-700"
                >
                  Técnico
                </a>
                .
              </p>
            </div>
          </Secao>

          {/* ---------------- Privacidade ---------------- */}
          <Secao
            icone={<Lock className="h-5 w-5" />}
            cor="text-sky-600 dark:text-sky-400"
            corFundo="bg-sky-100 dark:bg-sky-900/40"
            titulo="O que o LUPA guarda (e o que não guarda)"
            atraso={0.52}
          >
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p className="text-justify">
                <strong>Não guardamos:</strong> não há login, cadastro nem
                senha. O LUPA não pede seu nome, seu e-mail nem qualquer dado
                pessoal para analisar um conteúdo. As análises que você faz
                não ficam vinculadas a você e não montamos histórico de
                navegação.
              </p>
              <p className="text-justify">
                <strong>Guardamos apenas o que você envia de propósito:</strong>{" "}
                boatos enviados ao Portal Comunitário, sugestões de melhoria,
                avaliações da ferramenta e mensagens pelo formulário de
                contato. No Modo Professor, as análises feitas com um código de
                turma ficam registradas no painel daquela turma — é a
                finalidade da funcionalidade, e o código é criado e
                compartilhado pelo próprio professor.
              </p>
              <p className="text-justify">
                <strong>Enviamos a terceiros:</strong> o conteúdo que você
                submete para análise é enviado aos serviços listados acima
                para que a verificação aconteça. Não enviamos nada além disso.
              </p>
            </div>
          </Secao>

          {/* ---------------- Termos de uso ---------------- */}
          <Secao
            icone={<Scale className="h-5 w-5" />}
            cor="text-slate-600 dark:text-slate-300"
            corFundo="bg-slate-100 dark:bg-slate-700"
            titulo="Termos de uso"
            atraso={0.59}
            id="termos-de-uso"
          >
            <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {[
                "O LUPA é gratuito e de uso educacional. Pode ser usado livremente por estudantes, professores e famílias.",
                "A pontuação é uma estimativa de risco, não um veredito. Não use o resultado do LUPA como prova de que algo é verdadeiro ou falso.",
                "O LUPA não substitui agências de checagem profissionais nem o julgamento humano.",
                "Professores podem usar o LUPA em sala de aula e reproduzir seus materiais educativos, citando a fonte.",
                "Ao enviar um boato, sugestão ou avaliação, você autoriza sua publicação no site após moderação da equipe.",
                "Se você identificar um erro de análise, avise pela página de contato — erros relatados viram correções.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                  <span className="text-justify">{item}</span>
                </li>
              ))}
            </ul>
          </Secao>

          {/* ---------------- Limites ---------------- */}
          <Secao
            icone={<AlertTriangle className="h-5 w-5" />}
            cor="text-red-600 dark:text-red-400"
            corFundo="bg-red-100 dark:bg-red-900/40"
            titulo="Limites que assumimos"
            atraso={0.66}
          >
            <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {[
                "Nenhuma camada de análise é infalível — nem a IA, nem as verificações automáticas.",
                "O banco de checagens só cobre assuntos que agências já investigaram. Não encontrar nada não significa que o conteúdo é confiável.",
                "Sites e vídeos muito recentes têm menos rastros públicos, o que reduz a precisão da análise.",
                "Conteúdo irônico, satírico ou muito técnico pode ser mal interpretado pela IA.",
                "O LUPA analisa sinais de forma, contexto e histórico — ele não sabe, por si só, se um fato aconteceu.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  <span className="text-justify">{item}</span>
                </li>
              ))}
            </ul>
          </Secao>

          {/* ---------------- Contato ---------------- */}
          <Secao
            icone={<Mail className="h-5 w-5" />}
            cor="text-teal-600 dark:text-teal-400"
            corFundo="bg-teal-100 dark:bg-teal-900/40"
            titulo="Falar com a equipe"
            atraso={0.73}
          >
            <p className="text-sm text-slate-700 dark:text-slate-300 text-justify">
              Dúvidas, correções, propostas de parceria ou interesse em levar o
              LUPA para outra escola: use a{" "}
              <a
                href="/contato"
                className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 dark:text-indigo-400 dark:decoration-indigo-700"
              >
                página de contato
              </a>
              . Toda mensagem é lida pela equipe.
            </p>
          </Secao>
        </div>
      </div>
    </main>
  );
}
