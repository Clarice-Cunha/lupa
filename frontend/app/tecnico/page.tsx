import {
  Cpu,
  Server,
  Globe,
  Database,
  Zap,
  Code2,
  Cloud,
  Layers,
  ArrowRight,
  GitBranch,
} from "lucide-react";

export const metadata = {
  title: "Arquitetura Técnica — LUPA",
  description:
    "Stack tecnológica, fluxo de análise, módulos do backend e decisões de design do LUPA.",
};

export default function PaginaTecnico() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-indigo-600 shadow-lg shadow-slate-300 dark:shadow-slate-900">
            <Cpu className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Arquitetura Técnica
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Stack tecnológica, fluxo de dados, módulos do backend e decisões de
            design do LUPA.
          </p>
        </header>

        {/* ── 1. Visão Geral ──────────────────────────────── */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Visão Geral da Arquitetura
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

            {/* Linha principal: Usuário → Frontend → Backend → Dados */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-600 dark:bg-slate-700/60">
                <Globe className="mx-auto mb-1 h-5 w-5 text-slate-500 dark:text-slate-400" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Usuário</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Navegador</p>
              </div>

              <ArrowRight className="hidden h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600 sm:block" />
              <span className="text-slate-300 dark:text-slate-600 sm:hidden">↓</span>

              <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-center dark:border-indigo-700 dark:bg-indigo-900/30">
                <Code2 className="mx-auto mb-1 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200">Frontend</p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Next.js · Vercel</p>
              </div>

              <ArrowRight className="hidden h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600 sm:block" />
              <span className="text-slate-300 dark:text-slate-600 sm:hidden">↓</span>

              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-center dark:border-emerald-700 dark:bg-emerald-900/30">
                <Server className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Backend</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">FastAPI · Render</p>
              </div>

              <ArrowRight className="hidden h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600 sm:block" />
              <span className="text-slate-300 dark:text-slate-600 sm:hidden">↓</span>

              <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 px-4 py-3 text-center dark:border-teal-700 dark:bg-teal-900/30">
                <Database className="mx-auto mb-1 h-5 w-5 text-teal-600 dark:text-teal-400" />
                <p className="text-xs font-bold text-teal-800 dark:text-teal-200">Dados</p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400">Supabase · PostgreSQL</p>
              </div>
            </div>

            {/* Linha secundária: APIs Externas (consultadas pelo Backend) */}
            <div className="mt-5 flex flex-col items-center gap-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                O backend consulta APIs externas durante a análise
              </p>
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-6 py-3 text-center dark:border-amber-700 dark:bg-amber-900/20">
                <Zap className="mx-auto mb-1 h-5 w-5 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-bold text-amber-800 dark:text-amber-200">APIs Externas</p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                  Gemini · Firecrawl · VirusTotal · YouTube Data API
                  <br />
                  Google Fact Check Tools · Wayback Machine
                </p>
              </div>
            </div>

            {/* Legenda do fluxo */}
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              O usuário envia uma URL pelo Frontend → o Backend executa 12
              verificações chamando as APIs externas → o resultado é armazenado no
              Supabase (quando aplicável) e devolvido ao Frontend.
            </p>
          </div>
        </section>

        {/* ── 2. Stack Tecnológica ─────────────────────────── */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Stack Tecnológica
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 dark:border-slate-700 dark:bg-slate-800">
            {[
              {
                camada: "Frontend",
                techs: [
                  {
                    nome: "Next.js 14",
                    descricao:
                      "Framework React com renderização híbrida (SSR + geração estática), roteamento por pastas e suporte nativo a TypeScript.",
                  },
                  {
                    nome: "TypeScript",
                    descricao:
                      "Tipagem estática sobre JavaScript — reduz erros de runtime e facilita o entendimento do código.",
                  },
                  {
                    nome: "Tailwind CSS",
                    descricao:
                      "Utilitários CSS aplicados diretamente no JSX — sem arquivos de estilo separados, dark mode nativo.",
                  },
                ],
                cor: "bg-indigo-50 dark:bg-indigo-950/30",
                corLabel: "text-indigo-700 dark:text-indigo-300",
              },
              {
                camada: "Backend",
                techs: [
                  {
                    nome: "Python 3.11+",
                    descricao:
                      "Linguagem principal do servidor — ecossistema rico para IA, processamento de texto e chamadas HTTP.",
                  },
                  {
                    nome: "FastAPI",
                    descricao:
                      "Framework web que gera documentação interativa automática (OpenAPI/Swagger) e valida dados com Pydantic.",
                  },
                  {
                    nome: "Pydantic",
                    descricao:
                      "Validação e serialização de dados baseada em tipos Python — define contratos claros entre frontend e backend.",
                  },
                ],
                cor: "bg-emerald-50 dark:bg-emerald-950/30",
                corLabel: "text-emerald-700 dark:text-emerald-300",
              },
              {
                camada: "Banco de Dados",
                techs: [
                  {
                    nome: "Supabase",
                    descricao:
                      "PostgreSQL gerenciado em nuvem com painel visual, API REST automática e autenticação embutida.",
                  },
                  {
                    nome: "PostgreSQL",
                    descricao:
                      "Banco relacional que armazena boatos comunitários, turmas, feedbacks de usuários e parcerias.",
                  },
                ],
                cor: "bg-teal-50 dark:bg-teal-950/30",
                corLabel: "text-teal-700 dark:text-teal-300",
              },
              {
                camada: "Deploy e CI/CD",
                techs: [
                  {
                    nome: "Vercel",
                    descricao:
                      "Hospedagem do frontend com CDN global — cada push na branch main dispara um deploy automático em segundos.",
                  },
                  {
                    nome: "Render",
                    descricao:
                      "Hospedagem do backend Python com variáveis de ambiente seguras e reinicialização automática em caso de falha.",
                  },
                  {
                    nome: "GitHub",
                    descricao:
                      "Controle de versão centralizado — push na main aciona os pipelines de deploy do Vercel e do Render simultaneamente.",
                  },
                ],
                cor: "bg-violet-50 dark:bg-violet-950/30",
                corLabel: "text-violet-700 dark:text-violet-300",
              },
            ].map((grupo, gi) => (
              <div
                key={grupo.camada}
                className={`${
                  gi > 0
                    ? "border-t border-slate-200/60 dark:border-slate-700"
                    : ""
                } ${grupo.cor} px-5 py-4`}
              >
                <p
                  className={`mb-2.5 text-xs font-bold uppercase tracking-wider ${grupo.corLabel}`}
                >
                  {grupo.camada}
                </p>
                <div className="space-y-2">
                  {grupo.techs.map((t) => (
                    <div key={t.nome} className="flex gap-2 text-sm">
                      <span className="w-36 flex-shrink-0 font-semibold text-slate-800 dark:text-slate-100">
                        {t.nome}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {t.descricao}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Fluxo de uma Análise ──────────────────────── */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Fluxo de uma Análise de URL
            </h2>
          </div>
          <div className="space-y-2">
            {[
              {
                n: "1",
                titulo: "Submissão pelo usuário",
                texto:
                  "O usuário cola uma URL na página inicial. O componente React envia uma requisição POST para o endpoint /analisar no backend, incluindo a URL e o campo de suspeita opcional.",
                cor: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
              },
              {
                n: "2",
                titulo: "Extração de conteúdo",
                texto:
                  "O backend usa o Firecrawl para extrair o texto completo da página. Para URLs do YouTube, o módulo youtube_analyzer.py obtém os metadados do canal e a transcrição do vídeo via YouTube Data API.",
                cor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300",
              },
              {
                n: "3",
                titulo: "12 verificações sequenciais",
                texto:
                  "O arquivo analyzer.py executa uma série de verificações — automáticas e via APIs externas. Cada verificação retorna um impacto numérico (positivo ou negativo) e um texto explicativo que vai aparecer no resultado.",
                cor: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300",
              },
              {
                n: "4",
                titulo: "Análise por Inteligência Artificial",
                texto:
                  "O texto extraído é enviado ao Gemini (Google) com um prompt estruturado. O modelo identifica sensacionalismo, apelos emocionais excessivos, inconsistências lógicas e padrões de manipulação.",
                cor: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300",
              },
              {
                n: "5",
                titulo: "Composição da pontuação",
                texto:
                  "O analyzer.py soma todos os impactos parciais a uma base de 50 pontos, limitando o resultado ao intervalo 0–100. Cada item na lista de justificativas inclui critério, resultado e impacto numérico.",
                cor: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
              },
              {
                n: "6",
                titulo: "Resposta ao frontend",
                texto:
                  "O backend devolve um JSON com: pontuação final (0–100), veredito (suspeito / requer atenção / confiável), lista de justificativas e resumo gerado pelo Gemini. O frontend renderiza o cartão de resultado.",
                cor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
              },
            ].map((etapa) => (
              <div
                key={etapa.n}
                className="flex gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${etapa.cor}`}
                >
                  {etapa.n}
                </div>
                <div>
                  <p className="mb-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {etapa.titulo}
                  </p>
                  <p className="text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                    {etapa.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Módulos do Backend ────────────────────────── */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Server className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Módulos do Backend
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                arquivo: "analyzer.py",
                descricao:
                  "Orquestrador principal. Executa as 12 verificações em sequência, acumula justificativas, compõe a pontuação final e chama o Gemini para gerar o resumo.",
                cor: "border-slate-300 dark:border-slate-600",
                corTitulo: "text-slate-700 dark:text-slate-300",
              },
              {
                arquivo: "image_analyzer.py",
                descricao:
                  "Análise de imagens: detecção de adulterações via ELA (Error Level Analysis), deepfakes e imagens geradas por IA via GHOST, e interpretação semântica com Gemini.",
                cor: "border-violet-200 dark:border-violet-700",
                corTitulo: "text-violet-700 dark:text-violet-300",
              },
              {
                arquivo: "youtube_analyzer.py",
                descricao:
                  "Extrai metadados do canal (data de criação, padrão de publicação) e transcrição do vídeo via YouTube Data API, enviando o conteúdo ao Gemini para análise.",
                cor: "border-rose-200 dark:border-rose-700",
                corTitulo: "text-rose-700 dark:text-rose-300",
              },
              {
                arquivo: "fact_check.py",
                descricao:
                  "Consulta a Google Fact Check Tools API, cruzando o texto com o banco de dados da IFCN (International Fact-Checking Network) — mais de 100 agências internacionais.",
                cor: "border-blue-200 dark:border-blue-700",
                corTitulo: "text-blue-700 dark:text-blue-300",
              },
              {
                arquivo: "virustotal.py",
                descricao:
                  "Verifica a reputação de segurança da URL em 70+ mecanismos de antivírus e anti-phishing do VirusTotal. Detecta malware, phishing e domínios comprometidos.",
                cor: "border-red-200 dark:border-red-700",
                corTitulo: "text-red-700 dark:text-red-300",
              },
              {
                arquivo: "wayback.py",
                descricao:
                  "Consulta o Internet Archive (Wayback Machine) para estimar a antiguidade do domínio, independentemente do WHOIS — útil quando o registro está oculto.",
                cor: "border-teal-200 dark:border-teal-700",
                corTitulo: "text-teal-700 dark:text-teal-300",
              },
            ].map((mod) => (
              <div
                key={mod.arquivo}
                className={`rounded-2xl border-2 ${mod.cor} bg-white/80 p-4 dark:bg-slate-800`}
              >
                <p className={`mb-1 font-mono text-sm font-bold ${mod.corTitulo}`}>
                  {mod.arquivo}
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {mod.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. APIs Externas ─────────────────────────────── */}
        <section
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Cloud className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              APIs Externas Integradas
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400">
                  <th className="px-4 py-3 text-left">API</th>
                  <th className="px-4 py-3 text-left">Função no LUPA</th>
                  <th className="px-4 py-3 text-left">Chave?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700">
                {[
                  {
                    api: "Gemini (Google)",
                    funcao: "Análise de texto, imagem e transcrição de vídeo por IA generativa",
                    chave: true,
                  },
                  {
                    api: "Firecrawl",
                    funcao: "Extração do conteúdo completo de páginas web",
                    chave: true,
                  },
                  {
                    api: "YouTube Data API v3",
                    funcao: "Metadados de canal e vídeo (data de criação, descrição, transcrição)",
                    chave: true,
                  },
                  {
                    api: "Google Fact Check Tools",
                    funcao: "Banco de dados IFCN com checagens de mais de 100 agências",
                    chave: true,
                  },
                  {
                    api: "VirusTotal",
                    funcao: "Reputação de segurança da URL em 70+ mecanismos de antivírus",
                    chave: true,
                  },
                  {
                    api: "Wayback Machine (CDX API)",
                    funcao: "Histórico e antiguidade do domínio no Internet Archive",
                    chave: false,
                  },
                  {
                    api: "Supabase REST API",
                    funcao: "Leitura e escrita no banco de dados (boatos, turmas, feedbacks)",
                    chave: true,
                  },
                ].map((api, i) => (
                  <tr
                    key={api.api}
                    className={
                      i % 2 === 1
                        ? "bg-slate-50/60 dark:bg-slate-800/60"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {api.api}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {api.funcao}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          api.chave
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}
                      >
                        {api.chave ? "Sim" : "Gratuita"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 6. Decisões Técnicas ─────────────────────────── */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Decisões Técnicas
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                decisao: "Por que separar frontend e backend em servidores diferentes?",
                raiz: "O backend precisa de Python para processar texto com IA e chamar APIs de segurança — algo que JavaScript não faz tão bem. O frontend precisa de React para interatividade, animações e renderização rápida. Separar os dois permite escolher a melhor ferramenta para cada função e escalar cada parte independentemente.",
              },
              {
                decisao: "Por que FastAPI em vez de Flask ou Django?",
                raiz: "FastAPI gera documentação interativa automática (Swagger UI, acessível em /docs no backend), valida dados de entrada com Pydantic e tem suporte nativo a tipos Python. Para um projeto educacional, a documentação automática é um diferencial — qualquer pessoa pode ver os endpoints disponíveis sem ler o código.",
              },
              {
                decisao: "Por que Supabase em vez de um banco de dados local?",
                raiz: "O MVP usava arquivos JSON locais, mas com o Portal Comunitário, o Modo Professor e o sistema de turmas surgiu a necessidade de persistência real entre usuários. Supabase oferece PostgreSQL gerenciado com painel visual — ideal para acompanhar os dados sem precisar do terminal, inclusive durante apresentações.",
              },
              {
                decisao: "Por que Vercel (frontend) e Render (backend) separados?",
                raiz: "Vercel é otimizado para Next.js — deploy automático com CDN global e HTTPS gratuito a partir de um push no GitHub. Render suporta processos Python de longa duração com variáveis de ambiente seguras. Usar cada plataforma para o que ela faz melhor é uma prática comum em arquiteturas modernas de aplicações web.",
              },
              {
                decisao: "Como o sistema lida com APIs que podem estar indisponíveis?",
                raiz: "Todas as APIs com chave (VirusTotal, Firecrawl, etc.) são verificadas via os.getenv() antes de cada chamada. Se a chave não estiver configurada, ou se a API retornar um erro, a verificação é pulada silenciosamente — a análise continua com os demais critérios. Isso garante que o LUPA nunca quebre por causa de uma API opcional.",
              },
            ].map((item) => (
              <div
                key={item.decisao}
                className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="mb-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {item.decisao}
                </p>
                <p className="text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-400">
                  {item.raiz}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
