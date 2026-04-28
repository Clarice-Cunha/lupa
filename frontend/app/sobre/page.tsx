import { Search, Shield, Lightbulb, Scale, Heart, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Sobre o LUPA",
  description:
    "Entenda o que é o LUPA, como funciona a pontuação e os princípios que guiam o projeto.",
};

type Secao = {
  icone: React.ReactNode;
  cor: string;
  corFundo: string;
  titulo: string;
  conteudo: React.ReactNode;
};

const SECOES: Secao[] = [
  {
    icone: <Search className="h-5 w-5" />,
    cor: "text-indigo-600",
    corFundo: "bg-indigo-100",
    titulo: "O que é o LUPA?",
    conteudo: (
      <p className="leading-relaxed text-slate-700 text-justify">
        O <strong>LUPA — Leitor de URLs, Plataformas e Audiovisuais</strong> é
        uma ferramenta educativa de apoio à checagem de conteúdos digitais.
        Ele analisa links de sites, vídeos do YouTube e arquivos enviados pelo
        usuário, devolvendo uma pontuação de confiabilidade acompanhada de
        justificativas detalhadas. O objetivo não é afirmar que um conteúdo é
        verdadeiro ou falso — é ajudar o leitor a identificar sinais de alerta
        e desenvolver o pensamento crítico antes de compartilhar.
      </p>
    ),
  },
  {
    icone: <Scale className="h-5 w-5" />,
    cor: "text-rose-600",
    corFundo: "bg-rose-100",
    titulo: "Como funciona a pontuação?",
    conteudo: (
      <div className="space-y-3 text-slate-700">
        <p className="leading-relaxed text-justify">
          Cada análise gera uma pontuação de <strong>0 a 100</strong> baseada
          em critérios verificáveis automaticamente — como transparência da
          fonte, presença de HTTPS, qualidade dos metadados e sinais de
          sensacionalismo no texto. A pontuação é dividida em três faixas:
        </p>
        <div className="space-y-2">
          {[
            { faixa: "0 – 30", rotulo: "Suspeito", cor: "bg-red-100 text-red-800 border-red-200" },
            { faixa: "31 – 70", rotulo: "Requer atenção", cor: "bg-amber-100 text-amber-800 border-amber-200" },
            { faixa: "71 – 100", rotulo: "Confiável", cor: "bg-emerald-100 text-emerald-800 border-emerald-200" },
          ].map((item) => (
            <div key={item.faixa} className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${item.cor}`}>
              <span className="font-bold tabular-nums">{item.faixa}</span>
              <span className="text-sm font-medium">{item.rotulo}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-justify text-slate-600">
          Toda pontuação vem acompanhada das justificativas que a geraram,
          para que o usuário entenda o raciocínio e possa discordar ou
          aprofundar a verificação por conta própria.
        </p>
      </div>
    ),
  },
  {
    icone: <Shield className="h-5 w-5" />,
    cor: "text-emerald-600",
    corFundo: "bg-emerald-100",
    titulo: "Princípios do projeto",
    conteudo: (
      <ul className="space-y-3">
        {[
          {
            titulo: "Sem julgamento absoluto",
            texto:
              "O LUPA não afirma que um conteúdo é falso. Ele aponta sinais de risco e incentiva a verificação independente.",
          },
          {
            titulo: "Privacidade total",
            texto:
              "Nenhuma análise armazena dados do usuário. Não há login, histórico no servidor nem rastreamento. O que você analisa fica só com você.",
          },
          {
            titulo: "Explicabilidade obrigatória",
            texto:
              "Toda pontuação é acompanhada de justificativas claras. Nunca apresentamos um veredito sem explicar o porquê.",
          },
          {
            titulo: "Linguagem neutra",
            texto:
              "Evitamos termos com julgamento moral como 'mentira' ou 'fake'. Usamos 'suspeito', 'requer atenção' e 'indício' — porque checagem é processo, não sentença.",
          },
          {
            titulo: "Foco educacional",
            texto:
              "O objetivo final não é a nota — é ajudar o usuário a desenvolver habilidades de leitura crítica para usar de forma autônoma.",
          },
        ].map((item) => (
          <li key={item.titulo} className="flex gap-3 text-sm text-slate-700">
            <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
            <span className="text-justify">
              <strong className="text-slate-900">{item.titulo}:</strong>{" "}
              {item.texto}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icone: <Lightbulb className="h-5 w-5" />,
    cor: "text-amber-600",
    corFundo: "bg-amber-100",
    titulo: "Para quem foi feito?",
    conteudo: (
      <p className="leading-relaxed text-slate-700 text-justify">
        O LUPA foi pensado para <strong>estudantes</strong> que querem
        aprender a verificar fontes, <strong>professores</strong> que precisam
        de ferramentas para trabalhar letramento midiático em sala de aula, e{" "}
        <strong>famílias</strong> que desejam desenvolver o senso crítico sobre
        o que consomem e compartilham nas redes. Qualquer pessoa curiosa sobre
        a confiabilidade de um conteúdo é bem-vinda.
      </p>
    ),
  },
  {
    icone: <Heart className="h-5 w-5" />,
    cor: "text-rose-500",
    corFundo: "bg-rose-100",
    titulo: "Sobre o desenvolvimento",
    conteudo: (
      <p className="leading-relaxed text-slate-700 text-justify">
        O LUPA é um projeto em desenvolvimento contínuo, construído com
        tecnologias abertas: <strong>Python</strong> e{" "}
        <strong>FastAPI</strong> no servidor, <strong>Next.js</strong> e{" "}
        <strong>Tailwind CSS</strong> na interface. Toda sugestão de melhoria
        é bem-vinda — o projeto nasce justamente do desejo de aprender fazendo
        e de contribuir com a saúde da informação digital no Brasil.
      </p>
    ),
  },
];

export default function PaginaSobre() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Search className="h-8 w-8 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Sobre o LUPA
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Uma ferramenta educativa de apoio à checagem de conteúdos digitais
          </p>
        </header>

        {/* Aviso */}
        <div
          className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-justify">
            O LUPA é uma ferramenta de <strong>apoio</strong> à checagem —
            não substitui agências de fact-checking profissionais nem
            julgamento humano. Use-o como ponto de partida, não como
            veredito final.
          </p>
        </div>

        {/* Seções */}
        <div className="space-y-5">
          {SECOES.map((secao, i) => (
            <section
              key={secao.titulo}
              className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm sm:p-8"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${secao.corFundo} ${secao.cor}`}>
                  {secao.icone}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{secao.titulo}</h2>
              </div>
              {secao.conteudo}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
