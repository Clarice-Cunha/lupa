"use client";

import { useState } from "react";
import Link from "next/link";
import {
  School,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Send,
  CheckCircle2,
  Loader2,
  Users,
  Award,
  GraduationCap,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import { enviarParceria, type NivelEnsino } from "@/lib/api";

// ============================================================
// Tipos
// ============================================================

type Etapa = {
  tempo: string;
  titulo: string;
  descricao: string;
};

type Fonte = {
  nome: string;
  url: string;
};

type PlanoAula = {
  id: string;
  serie: string;
  faixa: string;
  titulo: string;
  duracao: string;
  objetivo: string;
  bncc: string[];
  etapas: Etapa[];
  comoUsarLupa: string;
  fontes: Fonte[];
  corFundo: string;
  corIcone: string;
  corBorda: string;
  corBadge: string;
};

// ============================================================
// Dados dos planos de aula
// ============================================================

const PLANOS: PlanoAula[] = [
  {
    id: "4-5",
    serie: "4º e 5º ano",
    faixa: "9–11 anos",
    titulo: "Verdade ou boato? Aprendendo a questionar antes de compartilhar",
    duracao: "50 minutos",
    objetivo:
      "Os alunos reconhecem que nem todo conteúdo visto na tela é verdadeiro e desenvolvem o hábito de fazer perguntas básicas antes de repassar qualquer informação.",
    bncc: [
      "Competência Geral 2 — Pensamento científico, crítico e criativo: investigar causas, analisar criticamente e formular hipóteses a partir de evidências.",
      "Competência Geral 5 — Cultura digital: compreender e utilizar tecnologias de informação de forma crítica e reflexiva.",
      "Língua Portuguesa — Anos Iniciais — Leitura e escuta: identificar a função social dos textos que circulam no cotidiano e reconhecer elementos que compõem sua credibilidade.",
    ],
    etapas: [
      {
        tempo: "10 min",
        titulo: "Provocação: votação de manchetes",
        descricao:
          "O professor projeta 3 manchetes: uma verdadeira (de veículo reconhecido), uma exagerada (clickbait real) e uma falsa. Pede para a turma votar levantando a mão: qual parece verdadeira? Registra os votos no quadro sem revelar as respostas ainda.",
      },
      {
        tempo: "10 min",
        titulo: "Por que acreditamos?",
        descricao:
          "O professor revela as respostas e conduz a discussão: 'O que nos convenceu?' Apresenta o conceito de viés de confirmação em linguagem simples: 'A gente tende a acreditar mais nas coisas que confirmam o que já pensamos.' Pergunta: 'Alguém votou na manchete falsa? Por quê ela pareceu real?'",
      },
      {
        tempo: "20 min",
        titulo: "Analisando juntos com o LUPA",
        descricao:
          "O professor abre o LUPA no projetor e analisa ao vivo: primeiro um site conhecido e confiável (ex: nasa.gov/pt ou g1.globo.com), depois um site com linguagem sensacionalista. Lê em voz alta cada justificativa da pontuação e explica o que ela significa. A turma observa e levanta a mão para comentar.",
      },
      {
        tempo: "10 min",
        titulo: "Registro individual",
        descricao:
          "Cada aluno anota no caderno: '3 perguntas que farei antes de compartilhar uma notícia.' O professor coleta algumas respostas oralmente para encerrar. Sugestão de perguntas a estimular: Quem publicou isso? Quando foi publicado? Outros sites falam sobre isso?",
      },
    ],
    comoUsarLupa:
      "Use a aba 'Analisar URL' no projetor com toda a turma observando. Foque nas justificativas de linguagem sensacionalista e verificação de fonte. Escolha previamente os dois sites a analisar para garantir que um mostre pontuação alta e outro baixa — isso torna a comparação mais didática.",
    fontes: [
      {
        nome: "BNCC — Base Nacional Comum Curricular (MEC)",
        url: "http://basenacionalcomum.mec.gov.br/",
      },
      {
        nome: "SaferNet Brasil — Guia de segurança digital para crianças",
        url: "https://www.safernet.org.br/",
      },
      {
        nome: "Instituto Palavra Aberta — Educação midiática para anos iniciais",
        url: "https://palavraaberta.org.br/",
      },
      {
        nome: "Agência Lupa — Lupa na Escola: recursos para educadores",
        url: "https://lupa.uol.com.br/",
      },
    ],
    corFundo: "bg-green-50",
    corIcone: "text-green-700",
    corBorda: "border-green-200",
    corBadge: "bg-green-100 text-green-700",
  },
  {
    id: "6-7",
    serie: "6º e 7º ano",
    faixa: "11–13 anos",
    titulo: "Clique com cuidado: identificando clickbait e linguagem sensacionalista",
    duracao: "50 minutos",
    objetivo:
      "Os alunos identificam as técnicas usadas no clickbait, reconhecem linguagem sensacionalista em manchetes e títulos, e comparam a credibilidade de diferentes sites usando o LUPA.",
    bncc: [
      "Competência Geral 2 — Pensamento crítico: analisar criticamente conteúdos digitais e reconhecer estratégias de manipulação.",
      "Competência Geral 5 — Cultura digital: usar tecnologias de forma reflexiva para verificar informações.",
      "Competência Geral 7 — Argumentação: formular e defender posicionamentos com base em evidências.",
      "Língua Portuguesa — Anos Finais — Leitura crítica de textos digitais: reconhecer recursos retóricos usados para influenciar o leitor.",
    ],
    etapas: [
      {
        tempo: "5 min",
        titulo: "Abertura: o que essas manchetes têm em comum?",
        descricao:
          "O professor projeta 5 manchetes reais de sites sensacionalistas (exemplos já coletados com antecedência). Pergunta: 'O que todas essas manchetes têm em comum?' Aguarda respostas livres da turma.",
      },
      {
        tempo: "10 min",
        titulo: "Mapa do clickbait",
        descricao:
          "A turma, com mediação do professor, identifica coletivamente os recursos: URGÊNCIA ('AGORA', 'BREAKING'), SUPERLATIVO ('o maior de todos os tempos'), SEGREDO ('o que o governo não quer que você saiba'), APELO EMOCIONAL (medo, raiva, surpresa), PERGUNTA SEM RESPOSTA ('Você sabe o que realmente aconteceu?'). Cada recurso é anotado no quadro como um 'mapa do clickbait'.",
      },
      {
        tempo: "25 min",
        titulo: "Análise em grupo com o LUPA",
        descricao:
          "O professor prepara com antecedência 5 URLs: 2 de veículos confiáveis, 2 sensacionalistas, 1 desconhecido. Grupos de 3–4 alunos recebem URLs diferentes (impressas ou enviadas por QR Code) e as analisam no LUPA usando os celulares. Cada grupo anota: pontuação, 2 justificativas principais, e se o LUPA identificou o que eles mesmos perceberam.",
      },
      {
        tempo: "10 min",
        titulo: "Socialização dos resultados",
        descricao:
          "Cada grupo apresenta seu site em 1 minuto: 'O nosso site recebeu nota X porque...' A turma compara: qual foi o mais suspeito? O LUPA flagrou as mesmas coisas que o grupo percebeu visualmente? O que o LUPA viu que o grupo não tinha notado?",
      },
    ],
    comoUsarLupa:
      "Oriente os grupos a usar a aba 'Analisar URL'. Peça que prestem atenção especialmente nas justificativas sobre linguagem sensacionalista, HTTPS e idade do domínio. Se houver celulares suficientes, cada grupo analisa no próprio dispositivo; se não, o professor analisa no projetor enquanto os grupos anotam.",
    fontes: [
      {
        nome: "BNCC — Base Nacional Comum Curricular (MEC)",
        url: "http://basenacionalcomum.mec.gov.br/",
      },
      {
        nome: "Aos Fatos — Guia de checagem de fatos para jornalistas e cidadãos",
        url: "https://aosfatos.org/nosso-guia-de-checagem-de-fatos/",
      },
      {
        nome: "Agência Lupa — Como identificar fake news",
        url: "https://lupa.uol.com.br/",
      },
      {
        nome: "ANDI Comunicação e Direitos — Mídia, democracia e desinformação",
        url: "https://andi.org.br/",
      },
    ],
    corFundo: "bg-blue-50",
    corIcone: "text-blue-700",
    corBorda: "border-blue-200",
    corBadge: "bg-blue-100 text-blue-700",
  },
  {
    id: "8-9",
    serie: "8º e 9º ano",
    faixa: "13–15 anos",
    titulo: "Checando na prática: análise de links, imagens e fontes",
    duracao: "50 minutos",
    objetivo:
      "Os alunos executam um fluxo completo de verificação de informação usando múltiplas ferramentas: análise de URL, leitura de metadados de imagem e busca reversa de imagem. Desenvolvem a capacidade de apresentar um veredicto fundamentado em evidências.",
    bncc: [
      "Competência Geral 2 — Pensamento científico: elaborar e testar hipóteses sobre a veracidade de um conteúdo a partir de evidências.",
      "Competência Geral 5 — Cultura digital: criar soluções e exercer protagonismo usando ferramentas digitais de forma ética.",
      "Competência Geral 7 — Argumentação: formular e defender conclusões com base em fatos, dados e informações verificáveis.",
      "Língua Portuguesa — Anos Finais — práticas de pesquisa, verificação e análise crítica de fontes primárias e secundárias.",
      "Ciências Humanas — análise crítica de fontes e contextos de produção das informações.",
    ],
    etapas: [
      {
        tempo: "10 min",
        titulo: "Cenário: o que você faria?",
        descricao:
          "O professor apresenta o cenário: 'Chegou no grupo da família uma imagem de uma enchente, com a legenda dizendo que aconteceu ontem na nossa cidade. O que você faz?' Os alunos discutem em pares por 2 minutos e compartilham respostas com a turma. O professor lista as estratégias sugeridas no quadro.",
      },
      {
        tempo: "15 min",
        titulo: "Análise da imagem com o LUPA e busca reversa",
        descricao:
          "O professor carrega a imagem no LUPA (aba Imagem) e projeta para a turma. Lê os metadados EXIF em voz alta, explicando o que cada dado revela: data de criação, modelo do celular, software de edição. Em seguida, usa o link de busca reversa gerado pelo LUPA para pesquisar a origem da imagem no Google Lens. Mostra onde a foto apareceu pela primeira vez.",
      },
      {
        tempo: "15 min",
        titulo: "Análise das fontes em grupo",
        descricao:
          "O professor apresenta o mesmo tema em 3 URLs: um veículo reconhecido, um site suspeito e um desconhecido. Grupos de 3–4 alunos analisam cada URL no LUPA e comparam as justificativas. Cada grupo preenche uma tabela simples: Site | Pontuação | Principal alerta | Confiável? (sim/não/talvez).",
      },
      {
        tempo: "10 min",
        titulo: "Veredicto com evidências",
        descricao:
          "Cada grupo apresenta seu veredicto usando a estrutura: 'Esta imagem/fonte é [confiável/suspeita/falsa] porque [evidência 1] e [evidência 2].' O professor estimula o uso do vocabulário trabalhado: metadados, domínio, HTTPS, linguagem sensacionalista.",
      },
    ],
    comoUsarLupa:
      "Esta aula usa duas abas do LUPA: 'Analisar Imagem' (metadados EXIF + link para busca reversa automática no Google Lens e TinEye) e 'Analisar URL' (análise de credibilidade das fontes). Para a análise de imagem, selecione previamente uma foto real de evento antigo que esteja sendo recirculada como atual — isso tornará a atividade mais impactante.",
    fontes: [
      {
        nome: "BNCC — Base Nacional Comum Curricular (MEC)",
        url: "http://basenacionalcomum.mec.gov.br/",
      },
      {
        nome: "Projeto Comprova — Metodologia de verificação colaborativa",
        url: "https://projetocomprova.com.br/metodologia",
      },
      {
        nome: "Aos Fatos — Guia de checagem de fatos",
        url: "https://aosfatos.org/nosso-guia-de-checagem-de-fatos/",
      },
      {
        nome: "Agência Lupa — Guia de verificação de imagens",
        url: "https://lupa.uol.com.br/",
      },
      {
        nome: "CERT.br — Cartilha de segurança na internet",
        url: "https://cartilha.cert.br/",
      },
    ],
    corFundo: "bg-purple-50",
    corIcone: "text-purple-700",
    corBorda: "border-purple-200",
    corBadge: "bg-purple-100 text-purple-700",
  },
  {
    id: "em",
    serie: "Ensino Médio",
    faixa: "15–18 anos",
    titulo: "A engrenagem da desinformação: algoritmos, deepfakes e cidadania digital",
    duracao: "50 minutos (pode ser expandida para 2 aulas)",
    objetivo:
      "Os alunos compreendem os mecanismos sociais, econômicos e tecnológicos por trás da desinformação; analisam um caso real usando múltiplas ferramentas; e conectam o tema à legislação brasileira e ao papel do cidadão.",
    bncc: [
      "Competência Geral 2 — Pensamento científico e crítico: analisar evidências, formular argumentos e avaliar conclusões sobre fenômenos sociais complexos.",
      "Competência Geral 5 — Cultura digital: compreender como algoritmos e plataformas influenciam a circulação de informações.",
      "Competência Geral 7 — Argumentação: formular e defender posicionamentos sobre responsabilidades de cidadãos, plataformas e Estado.",
      "Linguagens e suas Tecnologias (EM) — leitura crítica e produção de textos argumentativos em ambientes digitais.",
      "Ciências Humanas e Sociais Aplicadas (EM) — democracia, cidadania e direitos digitais.",
    ],
    etapas: [
      {
        tempo: "10 min",
        titulo: "Provocação: quem lucra com a desinformação?",
        descricao:
          "O professor apresenta um dado do CETIC.br: no Brasil, mais de 80% dos internautas recebem notícias por aplicativos de mensagens, e a maioria não verifica as informações antes de repassar (TIC Domicílios 2023). Pergunta: 'Por que as pessoas não verificam?' e 'Quem se beneficia quando uma informação falsa se espalha?' Os alunos debatem em duplas por 3 minutos, depois compartilham com a turma.",
      },
      {
        tempo: "15 min",
        titulo: "A cadeia da desinformação",
        descricao:
          "Leitura compartilhada de um infográfico ou trecho sobre a cadeia: quem cria o conteúdo falso → como é financiado (monetização por cliques, financiamento político) → como os algoritmos amplificam conteúdo que gera engajamento emocional → quem lucra e quem perde. Fontes sugeridas: ANDI Comunicação e Direitos e Projeto Comprova. Discussão guiada: 'Qual papel cada um de nós tem nessa cadeia — como consumidores e como compartilhadores?'",
      },
      {
        tempo: "15 min",
        titulo: "Análise avançada de um caso real",
        descricao:
          "O professor seleciona com antecedência um tema controverso e já verificado por agências de checagem. Grupos analisam: (1) um vídeo do YouTube sobre o tema usando a aba YouTube do LUPA — avaliando canal, data, estatísticas; (2) 2 artigos sobre o mesmo tema em veículos distintos usando a aba URL; (3) o que as agências Agência Lupa e Aos Fatos já publicaram sobre esse tema. Os grupos anotam: 'O que o LUPA encontrou que confirma ou contraria o que as agências já verificaram?'",
      },
      {
        tempo: "10 min",
        titulo: "Legislação e responsabilidade",
        descricao:
          "O professor abre a página /legislacao do LUPA e a turma lê juntos os destaques do Marco Civil da Internet (art. 19), da Lei 14.197/2021 (comunicação enganosa em massa) e do PL 2.630/2020 (PL das Fake News, em tramitação). Debate final: 'O que cabe aos cidadãos? O que cabe às plataformas? O que cabe ao Estado?' O professor pode pedir que cada aluno escreva uma frase de posicionamento fundamentado para fechar a aula.",
      },
    ],
    comoUsarLupa:
      "Esta aula usa todas as abas do LUPA: 'Analisar URL' (fontes jornalísticas), 'Analisar YouTube' (vídeo sobre o tema) e, se aplicável, 'Analisar Imagem' ou 'Analisar Texto'. Aproveite também as páginas /legislacao e /glossario do LUPA durante a discussão — elas funcionam como material de apoio complementar.",
    fontes: [
      {
        nome: "BNCC — Base Nacional Comum Curricular (MEC)",
        url: "http://basenacionalcomum.mec.gov.br/",
      },
      {
        nome: "CETIC.br — TIC Domicílios 2023: uso da internet e acesso a informação",
        url: "https://cetic.br/pesquisa/domicilios/",
      },
      {
        nome: "ANDI Comunicação e Direitos — Desinformação, mídia e democracia",
        url: "https://andi.org.br/",
      },
      {
        nome: "Projeto Comprova — Metodologia de checagem colaborativa",
        url: "https://projetocomprova.com.br/metodologia",
      },
      {
        nome: "Agência Lupa — acervo de verificações",
        url: "https://lupa.uol.com.br/",
      },
      {
        nome: "Aos Fatos — acervo de checagens",
        url: "https://aosfatos.org/",
      },
    ],
    corFundo: "bg-rose-50",
    corIcone: "text-rose-700",
    corBorda: "border-rose-200",
    corBadge: "bg-rose-100 text-rose-700",
  },
];

// ============================================================
// Componentes
// ============================================================

function CartaoPlano({ plano }: { plano: PlanoAula }) {
  const [aberto, setAberto] = useState(false);

  return (
    <article className={`rounded-2xl border ${plano.corBorda} bg-white/90 shadow-md overflow-hidden`}>
      {/* Cabeçalho sempre visível */}
      <button
        onClick={() => setAberto((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition"
        aria-expanded={aberto}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${plano.corFundo}`}>
            <BookOpen className={`h-5 w-5 ${plano.corIcone}`} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${plano.corBadge}`}>
                {plano.serie}
              </span>
              <span className="text-xs text-slate-400">{plano.faixa}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {plano.duracao}
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-900 leading-snug">
              {plano.titulo}
            </h2>
          </div>
        </div>
        {aberto ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 text-slate-400 mt-1" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-400 mt-1" />
        )}
      </button>

      {/* Conteúdo expandido */}
      {aberto && (
        <div className="border-t border-slate-100 px-5 py-5 space-y-6">
          {/* Objetivo */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Target className={`h-4 w-4 ${plano.corIcone}`} />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Objetivo da aula</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 text-justify">{plano.objetivo}</p>
          </section>

          {/* BNCC */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Award className={`h-4 w-4 ${plano.corIcone}`} />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Relação com a BNCC</h3>
            </div>
            <ul className="space-y-1.5">
              {plano.bncc.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${plano.corFundo.replace("bg-", "bg-").replace("-50", "-400")}`} />
                  <span className="text-justify">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-400">
              Fonte:{" "}
              <a
                href="http://basenacionalcomum.mec.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo-600"
              >
                Base Nacional Comum Curricular — MEC
              </a>
            </p>
          </section>

          {/* Etapas */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`h-4 w-4 ${plano.corIcone}`} />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Roteiro da aula</h3>
            </div>
            <ol className="space-y-3">
              {plano.etapas.map((etapa, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${plano.corFundo.replace("bg-", "bg-").replace("-50", "-500")}`}>
                      {i + 1}
                    </div>
                    {i < plano.etapas.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[12px] ${plano.corFundo.replace("bg-", "bg-").replace("-50", "-200")}`} />
                    )}
                  </div>
                  <div className="pb-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{etapa.titulo}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${plano.corBadge}`}>
                        {etapa.tempo}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 text-justify">{etapa.descricao}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Como usar o LUPA */}
          <section className={`rounded-xl border ${plano.corBorda} ${plano.corFundo} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className={`h-4 w-4 ${plano.corIcone}`} />
              <h3 className="text-sm font-semibold text-slate-800">Como usar o LUPA nesta aula</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 text-justify">{plano.comoUsarLupa}</p>
          </section>

          {/* Fontes */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Fontes e referências
            </h3>
            <ul className="space-y-1.5">
              {plano.fontes.map((fonte) => (
                <li key={fonte.url}>
                  <a
                    href={fonte.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 hover:underline"
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    <span>{fonte.nome}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </article>
  );
}

// ============================================================
// Formulário de parceria
// ============================================================

const NIVEIS_OPCOES: { valor: NivelEnsino; rotulo: string }[] = [
  { valor: "4-5", rotulo: "4º e 5º ano" },
  { valor: "6-7", rotulo: "6º e 7º ano" },
  { valor: "8-9", rotulo: "8º e 9º ano" },
  { valor: "em", rotulo: "Ensino Médio" },
];

function FormularioParceria() {
  const [nome, setNome] = useState("");
  const [escola, setEscola] = useState("");
  const [cidadeEstado, setCidadeEstado] = useState("");
  const [email, setEmail] = useState("");
  const [niveis, setNiveis] = useState<NivelEnsino[]>([]);
  const [comoUsar, setComoUsar] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function toggleNivel(nivel: NivelEnsino) {
    setNiveis((prev) =>
      prev.includes(nivel) ? prev.filter((n) => n !== nivel) : [...prev, nivel]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !escola.trim() || !cidadeEstado.trim() || !email.trim() || niveis.length === 0) return;
    setEnviando(true);
    setErro(null);
    try {
      await enviarParceria({
        nome: nome.trim(),
        escola: escola.trim(),
        cidade_estado: cidadeEstado.trim(),
        email: email.trim(),
        niveis,
        como_usar: comoUsar.trim(),
      });
      setSucesso(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
        <p className="text-lg font-semibold text-emerald-800">Solicitação enviada!</p>
        <p className="mt-2 text-sm text-emerald-700">
          A equipe LUPA entrará em contato com você em breve pelo e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={150}
            required
            placeholder="Ex: Maria da Silva"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Escola / Instituição <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            maxLength={200}
            required
            placeholder="Ex: Escola Municipal João Paulo"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Cidade e estado <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cidadeEstado}
            onChange={(e) => setCidadeEstado(e.target.value)}
            maxLength={100}
            required
            placeholder="Ex: Natal/RN"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            E-mail para contato <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            required
            placeholder="seu@email.com.br"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Séries / níveis que leciona <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {NIVEIS_OPCOES.map((op) => (
            <button
              key={op.valor}
              type="button"
              onClick={() => toggleNivel(op.valor)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition border ${
                niveis.includes(op.valor)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-300 hover:border-indigo-300"
              }`}
            >
              {op.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Como pretende usar o LUPA em aula?{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <textarea
          value={comoUsar}
          onChange={(e) => setComoUsar(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Descreva brevemente como imagina usar o LUPA com seus alunos..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{comoUsar.length} / 1000</p>
      </div>

      {erro && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando || !nome.trim() || !escola.trim() || !cidadeEstado.trim() || !email.trim() || niveis.length === 0}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {enviando ? "Enviando…" : "Enviar solicitação"}
      </button>
    </form>
  );
}

// ============================================================
// Página principal
// ============================================================

export default function PaginaProfessor() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-12">

        {/* Cabeçalho */}
        <header className="text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <School className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Área do Professor
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Planos prontos para usar o LUPA em sala de aula — com objetivos,
            roteiro, relação com a BNCC e fontes em português.
          </p>
        </header>

        {/* Aviso de uso */}
        <div
          className="animate-fade-in-up rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-900"
          style={{ animationDelay: "0.06s" }}
        >
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
            <div className="space-y-1">
              <p className="font-semibold">Como usar estes planos</p>
              <p className="text-indigo-800 leading-relaxed">
                Cada plano foi pensado para uma aula de 50 minutos e pode ser adaptado livremente.
                Os conteúdos são sugestões — você pode alterar os exemplos, reorganizar as etapas
                e ajustar o vocabulário para a realidade da sua turma. Clique em qualquer plano
                para expandir e ver o roteiro completo.
              </p>
            </div>
          </div>
        </div>

        {/* Planos de aula */}
        <section className="animate-fade-in-up space-y-4" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-semibold text-slate-900">Planos de Aula</h2>
          <div className="space-y-3">
            {PLANOS.map((plano) => (
              <CartaoPlano key={plano.id} plano={plano} />
            ))}
          </div>
        </section>

        {/* Painel do Professor */}
        <section className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
          <Link
            href="/professor/turma"
            className="group flex items-center justify-between gap-4 rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 shadow-md transition hover:border-indigo-400 hover:shadow-lg sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow">
                <GraduationCap className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Painel do Professor</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Crie uma turma, compartilhe o código com seus alunos e acompanhe em tempo
                  real as análises que eles fizeram — com pontuação média e distribuição por
                  classificação.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    <BarChart2 className="h-3.5 w-3.5" /> Desempenho da turma
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                    <Users className="h-3.5 w-3.5" /> Código de turma para alunos
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-indigo-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
          </Link>
        </section>

        {/* Formulário de parceria */}
        <section
          className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-8"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Quero fazer parceria com o LUPA</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Se você quer usar o LUPA de forma estruturada com sua turma — e ter suporte
              da equipe para planejar as atividades — preencha o formulário abaixo. Entraremos
              em contato pelo e-mail informado.
            </p>
          </div>
          <FormularioParceria />
        </section>

      </div>
    </main>
  );
}
