import { Scale, AlertTriangle, ExternalLink, FileText, Shield, Vote, Users } from "lucide-react";

export const metadata = {
  title: "Legislação | LUPA",
  description:
    "Principais normas federais brasileiras sobre desinformação e fake news.",
};

type Link = {
  rotulo: string;
  url: string;
};

type Norma = {
  icone: React.ReactNode;
  cor: string;
  corBorda: string;
  identificacao: string;
  nome: string;
  resumo: string;
  destaques: string[];
  status: "vigente" | "em tramitação";
  links: Link[];
};

const NORMAS: Norma[] = [
  {
    icone: <FileText className="h-5 w-5" />,
    cor: "text-indigo-600",
    corBorda: "border-indigo-200 bg-indigo-50",
    identificacao: "Lei nº 12.965/2014",
    nome: "Marco Civil da Internet",
    resumo:
      "Estabelece princípios, garantias, direitos e deveres para o uso da internet no Brasil. É a principal referência legal para a responsabilidade de plataformas digitais por conteúdos publicados por terceiros.",
    destaques: [
      "Art. 19 — provedores só respondem por conteúdo de terceiros após descumprimento de ordem judicial, o que dificulta a remoção rápida de desinformação.",
      "Art. 7º — garante o direito à privacidade e à liberdade de expressão dos usuários.",
      "Art. 3º — estabelece os princípios da neutralidade da rede e da proteção dos dados pessoais.",
    ],
    status: "vigente",
    links: [
      {
        rotulo: "Texto completo no Planalto",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm",
      },
    ],
  },
  {
    icone: <Shield className="h-5 w-5" />,
    cor: "text-emerald-600",
    corBorda: "border-emerald-200 bg-emerald-50",
    identificacao: "Lei nº 13.709/2018",
    nome: "Lei Geral de Proteção de Dados (LGPD)",
    resumo:
      "Regula o tratamento de dados pessoais no Brasil. Tem relação direta com a desinformação: o uso ilegal de dados pessoais para criar perfis e direcionar conteúdo falso a grupos específicos — prática conhecida como microtargeting — viola expressamente a LGPD.",
    destaques: [
      "Art. 6º — exige finalidade legítima, transparência e não discriminação no tratamento de dados.",
      "Art. 18 — garante ao titular o direito de saber como seus dados são coletados e utilizados.",
      "A Autoridade Nacional de Proteção de Dados (ANPD) é o órgão responsável por fiscalizar o cumprimento da lei.",
    ],
    status: "vigente",
    links: [
      {
        rotulo: "Texto completo no Planalto",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
      },
    ],
  },
  {
    icone: <Scale className="h-5 w-5" />,
    cor: "text-rose-600",
    corBorda: "border-rose-200 bg-rose-50",
    identificacao: "Lei nº 14.197/2021",
    nome: "Crimes contra o Estado Democrático de Direito",
    resumo:
      "Acrescentou ao Código Penal crimes relacionados à tentativa de abolição violenta do Estado Democrático de Direito. Inclui a tipificação da comunicação enganosa em massa — divulgação deliberada de informações falsas com o objetivo de desestabilizar as instituições democráticas.",
    destaques: [
      "Art. 359-L — tipifica a comunicação enganosa em massa com o fim de atentar contra o Estado Democrático de Direito.",
      "Penas que variam de 2 a 8 anos, podendo ser agravadas conforme o resultado obtido.",
      "Aprovada após episódios de ataques a instituições públicas motivados por desinformação em larga escala.",
    ],
    status: "vigente",
    links: [
      {
        rotulo: "Texto completo no Planalto",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14197.htm",
      },
    ],
  },
  {
    icone: <Vote className="h-5 w-5" />,
    cor: "text-amber-600",
    corBorda: "border-amber-200 bg-amber-50",
    identificacao: "Lei nº 9.504/1997 e Resoluções do TSE",
    nome: "Legislação Eleitoral Antidesinformação",
    resumo:
      "A Lei das Eleições proíbe a veiculação de propaganda eleitoral com informações falsas e garante o direito de resposta. O Tribunal Superior Eleitoral (TSE) edita resoluções a cada eleição aprofundando as regras de combate à desinformação eleitoral e tem firmado parcerias com plataformas digitais e agências de checagem.",
    destaques: [
      "Art. 58 da Lei 9.504/97 — direito de resposta em caso de ofensa ou divulgação de fato inverídico em propaganda eleitoral.",
      "Resolução TSE nº 23.714/2022 — obrigou plataformas digitais a remover conteúdos eleitorais falsos em até 24 horas durante as eleições de 2022.",
      "O TSE mantém o Programa de Enfrentamento à Desinformação, com canal direto para denúncias durante períodos eleitorais.",
    ],
    status: "vigente",
    links: [
      {
        rotulo: "Lei nº 9.504/1997 no Planalto",
        url: "https://www.planalto.gov.br/ccivil_03/leis/l9504.htm",
      },
      {
        rotulo: "Normas do TSE",
        url: "https://www.tse.jus.br/legislacao/normas-editadas-pelo-tse",
      },
    ],
  },
  {
    icone: <Users className="h-5 w-5" />,
    cor: "text-slate-600",
    corBorda: "border-slate-200 bg-slate-50",
    identificacao: "Decreto-Lei nº 2.848/1940 — Arts. 138 a 141",
    nome: "Código Penal — Crimes contra a Honra",
    resumo:
      "Embora anteriores à era digital, os crimes de calúnia, difamação e injúria se aplicam plenamente à desinformação que atinge pessoas específicas. Fake news que atribuem falsamente a alguém a prática de um crime configuram calúnia, e a lei prevê agravante específico para crimes cometidos por meio de redes sociais.",
    destaques: [
      "Art. 138 — calúnia: imputar falsamente a alguém um fato definido como crime.",
      "Art. 139 — difamação: imputar fato ofensivo à reputação de alguém, mesmo que não seja crime.",
      "Art. 141, III — agravante quando o crime é praticado com o emprego de meios que facilitam a divulgação, como redes sociais e aplicativos de mensagem.",
    ],
    status: "vigente",
    links: [
      {
        rotulo: "Código Penal compilado no Planalto",
        url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
      },
    ],
  },
  {
    icone: <FileText className="h-5 w-5" />,
    cor: "text-violet-600",
    corBorda: "border-violet-200 bg-violet-50",
    identificacao: "PL nº 2.630/2020",
    nome: "Projeto de Lei das Redes Sociais (\"PL das Fake News\")",
    resumo:
      "Propõe responsabilidades específicas para plataformas digitais no combate à desinformação: transparência sobre conteúdo impulsionado, rastreabilidade de mensagens em massa e obrigação de remoção de conteúdos comprovadamente falsos. O projeto é considerado um dos mais importantes em tramitação no Congresso sobre o tema.",
    destaques: [
      "Exigiria que plataformas com mais de 2 milhões de usuários adotem políticas ativas de moderação de conteúdo e publiquem relatórios de transparência.",
      "Prevê multas de até 10% do faturamento anual no Brasil para plataformas que descumprirem as regras.",
      "Ponto mais debatido: encontrar o equilíbrio entre o combate eficaz à desinformação e a preservação da liberdade de expressão.",
    ],
    status: "em tramitação",
    links: [
      {
        rotulo: "Acompanhar na Câmara dos Deputados",
        url: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2256735",
      },
    ],
  },
];

export default function PaginaLegislacao() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Scale className="h-8 w-8 text-white" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Legislação
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Normas federais brasileiras sobre desinformação e fake news
          </p>
        </header>

        {/* Aviso importante */}
        <div
          className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-justify">
            Esta página tem fins <strong>educativos</strong>. As informações são
            resumos simplificados das normas — não substituem consulta jurídica.
            A legislação sobre desinformação está em constante evolução no Brasil.
          </p>
        </div>

        {/* Introdução */}
        <section
          className="mb-8 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Por que a legislação importa?
          </h2>
          <p className="leading-relaxed text-slate-700 text-justify">
            O Brasil ainda não tem uma lei específica e abrangente sobre
            desinformação. O combate às fake news se apoia em um conjunto de
            normas espalhadas: o Marco Civil da Internet regula a
            responsabilidade das plataformas; o Código Penal pune crimes contra
            a honra e o Estado Democrático; a legislação eleitoral protege o
            processo democrático; e a LGPD coíbe o uso indevido de dados para
            manipulação. Conhecer esse conjunto é fundamental para entender os
            limites e as ferramentas disponíveis para combater a desinformação.
          </p>
        </section>

        {/* Lista de normas */}
        <section className="space-y-5">
          {NORMAS.map((norma, i) => (
            <article
              key={norma.identificacao}
              className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm sm:p-8"
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              {/* Topo do cartão */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${norma.corBorda} ${norma.cor}`}>
                    {norma.icone}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {norma.identificacao}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      {norma.nome}
                    </h3>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    norma.status === "vigente"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {norma.status === "vigente" ? "Vigente" : "Em tramitação"}
                </span>
              </div>

              {/* Resumo */}
              <p className="mb-4 leading-relaxed text-slate-700 text-justify">
                {norma.resumo}
              </p>

              {/* Destaques */}
              <div className="mb-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pontos relevantes
                </p>
                <ul className="space-y-1.5">
                  {norma.destaques.map((d, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-700">
                      <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${norma.cor.replace("text-", "bg-")}`} />
                      <span className="text-justify">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links oficiais */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {norma.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition hover:brightness-95 ${norma.corBorda} ${norma.cor}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    {link.rotulo}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Rodapé informativo */}
        <div
          className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-900 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="font-semibold">Quer acompanhar as atualizações legislativas?</p>
          <p className="mt-1 text-justify text-indigo-800">
            Consulte os textos completos e o andamento de projetos de lei nos
            sites oficiais do{" "}
            <a
              href="https://www.senado.leg.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-indigo-950"
            >
              Senado Federal
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>{" "}
            e da{" "}
            <a
              href="https://www.camara.leg.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-indigo-950"
            >
              Câmara dos Deputados
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
