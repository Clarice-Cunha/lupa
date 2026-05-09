import {
  Telescope,
  Rocket,
  Heart,
  MessageSquarePlus,
  Smartphone,
  Globe2,
  Code2,
  Headphones,
  Gamepad2,
  Users,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Para onde o LUPA vai — LUPA",
  description:
    "Os próximos passos do LUPA: funcionalidades planejadas, visão de longo prazo e como a comunidade pode participar.",
};

const PROXIMOS_PASSOS = [
  {
    icone: Gamepad2,
    cor: "bg-emerald-100 text-emerald-600",
    titulo: "Novos mini-jogos independentes",
    texto:
      "O Agente LUPA está completo com 5 mundos, e dois novos mini-jogos autônomos foram lançados: 'Detetive da Engenharia Social' (reconhecer táticas de manipulação como pretexting, baiting e rapport) e 'Verdadeiro ou Suspeito?' (analisar manchetes virais em duas etapas). Os próximos na fila são: 'Caça ao Phishing' (identificar armadilhas em mensagens falsas) e 'Caça ao Clickbait' (distinguir manchetes legítimas de chamarizes sensacionalistas). Cada jogo tem pontuação própria e um aprendizado específico ao final.",
  },
  {
    icone: Headphones,
    cor: "bg-rose-100 text-rose-600",
    titulo: "Áudio para toda a Biblioteca",
    texto:
      "Usando o NotebookLM — ferramenta gratuita do Google que gera podcasts a partir de textos — cada livro da Biblioteca Virtual receberá um resumo em áudio. O objetivo é tornar o conteúdo acessível para quem prefere ouvir, incluindo idosos com dificuldade visual e crianças que estão aprendendo a ler.",
  },
  {
    icone: Users,
    cor: "bg-cyan-100 text-cyan-600",
    titulo: "Testes com a comunidade",
    texto:
      "O LUPA precisa ser testado por pessoas reais fora do ambiente escolar: pais, avós, professores, moradores do bairro. Esses testes geram dados concretos sobre o que funciona, o que confunde e o que precisa melhorar — e são fundamentais para provar que a ferramenta é útil na prática.",
  },
  {
    icone: GraduationCap,
    cor: "bg-amber-100 text-amber-600",
    titulo: "Parceria com escolas",
    texto:
      "O próximo passo natural é levar o LUPA para dentro da sala de aula: atividades estruturadas para professores, materiais de apoio pedagógico e um modo específico para uso em turmas — onde o docente acompanha o desempenho dos alunos nos jogos e na ferramenta de análise.",
  },
];

const VISAO_LONGO_PRAZO = [
  {
    icone: Smartphone,
    titulo: "Aplicativo móvel",
    texto:
      "Uma versão para celular (Android e iOS) com análise direta de links compartilhados pelo WhatsApp — sem precisar copiar e colar no navegador.",
  },
  {
    icone: Globe2,
    titulo: "Extensão de navegador",
    texto:
      "Um botão instalável no Chrome ou Firefox que analisa automaticamente a página que você está visitando, sem precisar acessar o site do LUPA separadamente.",
  },
  {
    icone: Code2,
    titulo: "Código aberto",
    texto:
      "Publicar o código do LUPA no GitHub para que qualquer desenvolvedor, professor ou pesquisador possa estudar, adaptar e contribuir com melhorias.",
  },
  {
    icone: MessageSquarePlus,
    titulo: "Colaboração com agências profissionais",
    texto:
      "Integrar as checagens da Agência Lupa e Aos Fatos ao portal comunitário — quando um boato local já foi verificado por uma agência, o LUPA mostraria automaticamente o resultado.",
  },
  {
    icone: Headphones,
    titulo: "Podcast LUPA Conversa",
    texto:
      "Episódios regulares sobre desinformação no Brasil, gerados com NotebookLM e publicados na Biblioteca Virtual. Cada episódio abordaria um tema específico (saúde, política, segurança).",
  },
  {
    icone: Globe2,
    titulo: "Expansão para o espanhol",
    texto:
      "Com a estrutura pronta, adaptar o LUPA para o espanhol permitiria atender estudantes e comunidades em outros países da América Latina — onde o problema da desinformação é igualmente grave.",
  },
];

const COMO_PARTICIPAR = [
  {
    titulo: "Use e dê feedback",
    texto:
      "A forma mais valiosa de ajudar é usar o LUPA com alguém que nunca usou — um familiar, um colega, um professor — e observar onde eles travam ou se confundem. Esse tipo de relato não tem preço.",
  },
  {
    titulo: "Reporte boatos da sua comunidade",
    texto:
      "O portal comunitário só funciona se as pessoas reportarem. Se você ouvir um boato no bairro, na escola ou no condomínio, registre em /comunidade. Cada relato ajuda a mapear como a desinformação circula localmente.",
  },
  {
    titulo: "Sugira melhorias",
    texto:
      "Achou algo confuso? Teve uma ideia de funcionalidade? A equipe LUPA lê todos os retornos. O projeto é construído de forma aberta justamente para incorporar perspectivas que a equipe original não teria sozinha.",
  },
  {
    titulo: "Compartilhe com educadores",
    texto:
      "Se você conhece professores, coordenadores ou diretores de escola, apresente o LUPA como ferramenta de aula. O letramento midiático ainda é raro no currículo escolar — e o LUPA foi feito exatamente para preencher essa lacuna.",
  },
];

export default function PaginaFuturo() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Telescope className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Para onde o LUPA vai
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            O LUPA é um protótipo — um ponto de partida, não um produto
            acabado. Esta página é um convite: veja o que vem por aí e como
            você pode fazer parte disso.
          </p>
        </header>

        {/* Onde estamos hoje */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-700/40 dark:bg-indigo-900/20">
            <div className="mb-3 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-indigo-800 dark:text-indigo-300">
                Onde estamos hoje
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-justify text-indigo-900 dark:text-indigo-200">
              Em maio de 2026, o LUPA analisa <strong>cinco tipos de
              conteúdo</strong> (links, YouTube, vídeos, textos e imagens),
              tem uma área de <strong>jogos educativos</strong> com modo
              multiplayer, o <strong>Agente LUPA</strong> — aventura completa
              com 5 mundos temáticos (Fake News, Fontes e Evidências,
              Manipulação de Imagem, Deepfake e Vídeo, e Campanha Coordenada)
              — e dois mini-jogos autônomos recém-lançados:{" "}
              <strong>Detetive da Engenharia Social</strong> e{" "}
              <strong>Verdadeiro ou Suspeito?</strong>. O site também conta com
              uma <strong>Biblioteca Virtual</strong> com mais de 20 recursos
              por faixa etária, um{" "}
              <strong>portal comunitário de boatos</strong> com mapa
              georreferenciado e painel de moderação, um{" "}
              <strong>Modo Professor</strong> para acompanhar turmas, e uma{" "}
              <strong>API aberta</strong> para desenvolvedores.
              Tudo em português, gratuito e sem cadastro.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-justify text-indigo-900 dark:text-indigo-200">
              Mas há muito mais pela frente.
            </p>
          </div>
        </section>

        {/* Próximos passos */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            Próximos passos
          </h2>
          <div className="space-y-4">
            {PROXIMOS_PASSOS.map((item, i) => {
              const Icone = item.icone;
              return (
                <div
                  key={item.titulo}
                  className="flex gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm animate-fade-in-up dark:border-slate-700 dark:bg-slate-800"
                  style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${item.cor}`}
                  >
                    <Icone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">
                      {item.titulo}
                    </h3>
                    <p className="text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                      {item.texto}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Visão de longo prazo */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            Visão de longo prazo
          </h2>
          <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
            Se o LUPA crescer além do protótipo, estes são os horizontes que a
            equipe enxerga. Não são promessas — são direções.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VISAO_LONGO_PRAZO.map((item, i) => {
              const Icone = item.icone;
              return (
                <div
                  key={item.titulo}
                  className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm animate-fade-in-up dark:border-slate-700 dark:bg-slate-800"
                  style={{ animationDelay: `${0.3 + i * 0.04}s` }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icone className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.titulo}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                    {item.texto}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Como participar */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="mb-5 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Como você pode participar
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="space-y-4">
              {COMO_PARTICIPAR.map((item) => (
                <div
                  key={item.titulo}
                  className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span className="text-justify">
                    <strong className="text-slate-900 dark:text-slate-100">
                      {item.titulo}:
                    </strong>{" "}
                    {item.texto}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Construído de forma aberta */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-6 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-indigo-900/10">
            <h2 className="mb-3 font-bold text-slate-900 dark:text-slate-100">
              Construído de forma aberta
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
              O LUPA foi desenvolvido com o suporte de inteligências artificiais
              (Claude Code, da Anthropic) — mas todas as decisões foram tomadas
              pela equipe: o que construir, como explicar, o que priorizar e
              quais princípios não abrir mão.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
              Essa transparência é intencional. Acreditamos que mostrar o
              processo — incluindo as ferramentas usadas e os limites do projeto
              — é tão importante quanto o resultado final. O combate à
              desinformação começa em casa.
            </p>
            <a
              href="/evolucao"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Ver a linha do tempo completa do desenvolvimento
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
