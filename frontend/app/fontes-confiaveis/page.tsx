/**
 * Página "Fontes Confiáveis" — lista curada de agências de checagem,
 * jornalismo de referência e instituições de pesquisa.
 *
 * Seleção feita com base em organizações reconhecidas pela International
 * Fact-Checking Network (IFCN) e por universidades/veículos tradicionais.
 */

import { Library, ExternalLink, ShieldCheck, Newspaper, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Fonte = {
  nome: string;
  url: string;
  descricao: string;
};

type Categoria = {
  titulo: string;
  icone: LucideIcon;
  descricao: string;
  fontes: Fonte[];
};

const CATEGORIAS: Categoria[] = [
  {
    titulo: "Agências de Checagem",
    icone: ShieldCheck,
    descricao:
      "Organizações dedicadas a verificar afirmações, notícias e correntes. Todas seguem o código da IFCN (rede internacional de checadores).",
    fontes: [
      {
        nome: "Aos Fatos",
        url: "https://www.aosfatos.org",
        descricao: "Checagem de declarações políticas e boatos virais.",
      },
      {
        nome: "Agência Lupa",
        url: "https://lupa.uol.com.br",
        descricao:
          "Primeira agência de fact-checking do Brasil, em parceria com o UOL.",
      },
      {
        nome: "Projeto Comprova",
        url: "https://projetocomprova.com.br",
        descricao:
          "Coalizão de veículos brasileiros que checam informações nas eleições.",
      },
      {
        nome: "Boatos.org",
        url: "https://www.boatos.org",
        descricao: "Banco de boatos e correntes de WhatsApp desmentidos.",
      },
      {
        nome: "e-Farsas",
        url: "https://www.e-farsas.com",
        descricao: "Desmistifica boatos e imagens manipuladas desde 2002.",
      },
      {
        nome: "AFP Checamos",
        url: "https://checamos.afp.com/afp-brasil",
        descricao: "Braço de checagem da agência internacional AFP.",
      },
      {
        nome: "Snopes (inglês)",
        url: "https://www.snopes.com",
        descricao: "Referência mundial em checagem de boatos e lendas urbanas.",
      },
    ],
  },
  {
    titulo: "Jornalismo de Referência",
    icone: Newspaper,
    descricao:
      "Veículos com redação profissional, processos editoriais e histórico de correção pública de erros. Nenhum é perfeito — ler mais de um ajuda.",
    fontes: [
      {
        nome: "Agência Pública",
        url: "https://apublica.org",
        descricao: "Jornalismo investigativo sem fins lucrativos.",
      },
      {
        nome: "Nexo Jornal",
        url: "https://www.nexojornal.com.br",
        descricao:
          "Contexto explicativo de temas políticos, sociais e ambientais.",
      },
      {
        nome: "JOTA",
        url: "https://www.jota.info",
        descricao: "Especializado em poder público, justiça e economia.",
      },
      {
        nome: "BBC News Brasil",
        url: "https://www.bbc.com/portuguese",
        descricao:
          "Serviço em português do grupo britânico, com forte cobertura internacional.",
      },
      {
        nome: "Reuters Brasil",
        url: "https://www.reuters.com/world/americas",
        descricao: "Agência internacional com padrão rigoroso de verificação.",
      },
    ],
  },
  {
    titulo: "Instituições e Pesquisa",
    icone: GraduationCap,
    descricao:
      "Órgãos públicos, universidades e centros de pesquisa que geram dados primários — os 'donos' originais das informações.",
    fontes: [
      {
        nome: "IBGE",
        url: "https://www.ibge.gov.br",
        descricao:
          "Instituto oficial brasileiro de estatísticas (população, economia, etc.).",
      },
      {
        nome: "Fiocruz",
        url: "https://portal.fiocruz.br",
        descricao:
          "Principal instituição brasileira de pesquisa em saúde pública.",
      },
      {
        nome: "IPEA",
        url: "https://www.ipea.gov.br",
        descricao:
          "Instituto de pesquisa econômica aplicada, ligado ao governo federal.",
      },
      {
        nome: "Poynter Institute",
        url: "https://www.poynter.org",
        descricao:
          "Escola de jornalismo nos EUA, referência global em ética e checagem.",
      },
      {
        nome: "MIT Media Lab",
        url: "https://www.media.mit.edu",
        descricao:
          "Laboratório de pesquisa em tecnologia e mídia, com estudos sobre desinformação.",
      },
      {
        nome: "First Draft News",
        url: "https://firstdraftnews.org",
        descricao:
          "Recursos e treinamento sobre verificação de mídia digital.",
      },
    ],
  },
];

export default function FontesConfiaveis() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Library className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Fontes Confiáveis
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Uma lista curada de onde buscar informação verificada —
            agências de checagem, jornalismo profissional e centros de
            pesquisa.
          </p>
        </header>

        {/* Aviso */}
        <div
          className="animate-fade-in-up mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          style={{ animationDelay: "0.1s" }}
        >
          <strong>Importante:</strong> nenhuma fonte é infalível. O objetivo
          aqui é reunir lugares com processos sérios de apuração, não
          garantir que tudo que publicam esteja 100% correto. O hábito de
          cruzar informações continua valendo.
        </div>

        {/* Categorias */}
        <div className="space-y-8">
          {CATEGORIAS.map((cat, i) => (
            <Categoria key={cat.titulo} categoria={cat} ordem={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Categoria({
  categoria,
  ordem,
}: {
  categoria: Categoria;
  ordem: number;
}) {
  const Icone = categoria.icone;
  return (
    <section
      className="animate-fade-in-up"
      style={{ animationDelay: `${0.2 + ordem * 0.1}s` }}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <Icone className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {categoria.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{categoria.descricao}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categoria.fontes.map((fonte) => (
          <a
            key={fonte.url}
            href={fonte.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-md shadow-indigo-100/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/40"
          >
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-medium text-slate-900">
                {fonte.nome}
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-indigo-500" />
              </p>
              <p className="mt-1 text-xs text-slate-600">{fonte.descricao}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
