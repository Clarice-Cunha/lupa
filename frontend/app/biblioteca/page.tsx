/**
 * Página "Biblioteca Virtual" — recursos educacionais categorizados por
 * faixa etária para aprender a reconhecer estratégias de manipulação.
 */

import { GraduationCap, ExternalLink, Star, Backpack, Laptop, Users, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TipoRecurso = "livro" | "site" | "artigo" | "video" | "curso";

type Recurso = {
  titulo: string;
  descricao: string;
  url: string;
  tipo: TipoRecurso;
  gratuito: boolean;
  urlAudio?: string;
};

type FaixaEtaria = {
  id: string;
  titulo: string;
  faixa: string;
  descricao: string;
  icone: LucideIcon;
  corFundo: string;
  corIcone: string;
  recursos: Recurso[];
};

const ROTULO_TIPO: Record<TipoRecurso, { texto: string; cor: string }> = {
  livro:  { texto: "Livro",  cor: "bg-rose-100 text-rose-700" },
  site:   { texto: "Site",   cor: "bg-sky-100 text-sky-700" },
  artigo: { texto: "Artigo", cor: "bg-teal-100 text-teal-700" },
  video:  { texto: "Vídeo",  cor: "bg-orange-100 text-orange-700" },
  curso:  { texto: "Curso",  cor: "bg-violet-100 text-violet-700" },
};

const FAIXAS: FaixaEtaria[] = [
  {
    id: "criancas",
    titulo: "Crianças",
    faixa: "6–10 anos",
    descricao:
      "Recursos lúdicos que ensinam a curiosidade saudável, como questionar o que veem nas telas e como reconhecer conteúdo enganoso de forma divertida.",
    icone: Star,
    corFundo: "bg-green-100",
    corIcone: "text-green-700",
    recursos: [
      {
        titulo: "Esquadrão Curioso: Caçadores de Fake News",
        descricao:
          "Três alunos formam um grupo para investigar notícias falsas nas redes sociais — e logo incomodam o maléfico Fake Nilson, criador dos posts mentirosos. Primeiro livro brasileiro sobre fake news escrito especificamente para crianças.",
        url: "https://www.amazon.com.br/Esquadr%C3%A3o-Curioso-Marcelo-Duarte/dp/8578887123",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Fake News: A Raposa, o Lobo e a Menina",
        descricao:
          "Dona Raposa e Seu Lobo estão tristes com as fake news que os humanos inventaram sobre eles. Uma fábula que mostra como notícias falsas fazem mal a todos — e convida as crianças a questionar antes de acreditar.",
        url: "https://www.amazon.com.br/Fake-news-raposa-lobo-menina/dp/6525038987",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Google Interland — Seja Fantástico na Internet",
        descricao:
          "Jogo gratuito e interativo do Google onde crianças aprendem a navegar com segurança, identificar golpes digitais e pensar antes de compartilhar.",
        url: "https://beinternetawesome.withgoogle.com/pt_br",
        tipo: "site",
        gratuito: true,
      },
      {
        titulo: "Manual do Mundo (YouTube)",
        descricao:
          "Canal brasileiro com experimentos científicos e explicações que desenvolvem o pensamento crítico e a curiosidade de forma divertida e acessível.",
        url: "https://www.youtube.com/@manualdomundo",
        tipo: "video",
        gratuito: true,
      },
      {
        titulo: "Ernesto, o Sapinho Repórter",
        descricao:
          "Ernesto é um sapinho repórter que ensina de forma lúdica como funciona o jornalismo: apurar, verificar e só então publicar. Uma história que aproxima as crianças do mundo da informação responsável e do pensamento crítico.",
        url: "https://www.amazon.com.br/Ernesto-sapinho-rep%C3%B3rter-Greg-Candalez/dp/6587009530",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Conectados, mas com cuidados! — Volume 1",
        descricao:
          "Ana e Otto se deparam com uma comoção no restaurante de Filippo: alguém criou uma fake news sobre uma promoção inexistente. Com ajuda do professor Mario Sergio Cortella, os personagens aprendem a verificar fontes e descobrem que a tecnologia pode ser muito útil — mas exige equilíbrio.",
        url: "https://www.amazon.com.br/Conectados-mas-com-cuidados-1/dp/655555472X",
        tipo: "livro",
        gratuito: false,
      },
    ],
  },
  {
    id: "pre-adolescentes",
    titulo: "Pré-adolescentes",
    faixa: "11–14 anos",
    descricao:
      "Materiais que ensinam como a desinformação é fabricada, por que engana tanta gente e como checar antes de compartilhar — sem abrir mão do senso crítico.",
    icone: Backpack,
    corFundo: "bg-blue-100",
    corIcone: "text-blue-700",
    recursos: [
      {
        titulo: "Turma da Mônica Jovem em #XôFakeNews",
        descricao:
          "Mônica, Cascão, Magali e Cebola se engajam num projeto escolar para combater a febre de desinformação. Uma novela com os personagens que toda a turma conhece, mostrando de forma leve como identificar e questionar notícias falsas.",
        url: "https://www.amazon.com.br/Turma-M%C3%B4nica-Jovem-X%C3%B4FakeNews-hist%C3%B3ria/dp/655640375X",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Fake News — Não se Deixe Enganar!",
        descricao:
          "Guia prático que explica o que são fake news, como surgem, como se espalham e como desenvolver um radar para identificá-las. Publicado pelo selo juvenil da Voo, é usado em programas educativos com adolescentes.",
        url: "https://www.amazon.com.br/Fake-News-N%C3%A3o-deixe-enganar/dp/6589686297",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Segredos da Internet Que Crianças e Adolescentes Ainda Não Sabem",
        descricao:
          "Mais de 40 histórias reais de bons e maus usos da internet, apresentadas em linguagem simples. Escrito por Kelli Angelini, advogada especializada em educação digital, o livro destaca direitos e deveres dos jovens na legislação brasileira. Inclui encarte de atividades para sala de aula.",
        url: "https://www.amazon.com.br/Segredos-Internet-Crian%C3%A7as-Adolescentes-Ainda/dp/8555403391",
        tipo: "livro",
        gratuito: false,
      },
    ],
  },
  {
    id: "adolescentes",
    titulo: "Adolescentes",
    faixa: "15–17 anos",
    descricao:
      "Livros, cursos e ferramentas para entender a fundo como a manipulação funciona — da propaganda política aos algoritmos das redes sociais.",
    icone: Laptop,
    corFundo: "bg-purple-100",
    corIcone: "text-purple-700",
    recursos: [
      {
        titulo: "Como Não Ser Enganado pelas Fake News",
        descricao:
          "Um livro para quem quer ler notícias com olhos curiosos e descobrir o que não está explícito. Januária Alves e Flávia Aidar explicam como as fake news funcionam, por que enganam tanta gente e quais ferramentas usar para ser leitor — e não apenas consumidor de informação.",
        url: "https://www.amazon.com.br/Como-Enganado-Pelas-Fake-News/dp/851611807X",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Muito Mais que Fake News",
        descricao:
          "E-book gratuito produzido pela Bemtv que explica de forma clara e visual o que são fake news, como identificá-las e quais estratégias usar para não ser enganado. Ideal para adolescentes e educadores.",
        url: "https://bemtv.org.br/wp-content/uploads/2022/06/ebook-fake-news.pdf",
        tipo: "artigo",
        gratuito: true,
      },
    ],
  },
  {
    id: "adultos",
    titulo: "Adultos",
    faixa: "18–59 anos",
    descricao:
      "Leitura aprofundada sobre desinformação como fenômeno político e social, com ferramentas para consumir e compartilhar conteúdo com mais responsabilidade.",
    icone: Users,
    corFundo: "bg-indigo-100",
    corIcone: "text-indigo-700",
    recursos: [
      {
        titulo: "CETIC.br — Pesquisa sobre Internet no Brasil",
        descricao:
          "Dados atualizados sobre uso da internet no Brasil, incluindo pesquisas específicas sobre comportamento informacional e exposição à desinformação.",
        url: "https://www.cetic.br",
        tipo: "site",
        gratuito: true,
      },
      {
        titulo: "TSE — Combate à Desinformação",
        descricao:
          "O Tribunal Superior Eleitoral oferece cartilhas e materiais oficiais sobre como identificar desinformação, especialmente em períodos eleitorais.",
        url: "https://www.justicaeleitoral.jus.br/desinformacao/",
        tipo: "site",
        gratuito: true,
      },
      {
        titulo: "Fake News e Inteligência Artificial: o Poder dos Algoritmos na Guerra da Desinformação",
        descricao:
          "Resultado de quatro anos de pesquisa, o livro de Magaly Prado explora como a IA é usada tanto para produzir e disseminar desinformação em massa quanto para combatê-la. Analisa big data, machine learning e blockchain no contexto da guerra das fake news.",
        url: "https://www.amazon.com.br/Fake-News-Intelig%C3%AAncia-Artificial-Desinforma%C3%A7%C3%A3o/dp/8562938653",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "Pensamento Crítico: O Poder da Lógica e da Argumentação",
        descricao:
          "Apresenta de forma didática como construir bons argumentos e se defender de falácias. Usa exemplos da política, jornalismo e cultura brasileira — e inclui capítulo sobre a \"lógica\" das teorias conspiratórias e fake news. Indicado para estudantes e qualquer pessoa que queira pensar melhor.",
        url: "https://www.amazon.com.br/Pensamento-Cr%C3%ADtico-Poder-L%C3%B3gica-Argumenta%C3%A7%C3%A3o/dp/8533960018",
        tipo: "livro",
        gratuito: false,
      },
    ],
  },
  {
    id: "idosos",
    titulo: "Idosos",
    faixa: "60+ anos",
    descricao:
      "Materiais em linguagem acessível sobre golpes digitais, correntes de WhatsApp falsas e como verificar informações antes de repassar para amigos e família.",
    icone: Heart,
    corFundo: "bg-amber-100",
    corIcone: "text-amber-700",
    recursos: [
      {
        titulo: "Guia Prático para Idosos: Aprenda a Mexer no Celular",
        descricao:
          "Passo a passo sobre como usar o smartphone, navegar na internet e aplicativos com segurança — inclui dicas para não cair em golpes e reconhecer notícias falsas no WhatsApp. Disponível como e-book Kindle.",
        url: "https://www.amazon.com.br/Guia-Pr%C3%A1tico-para-Idosos-Aprenda-ebook/dp/B0CCYX7YGM",
        urlAudio: "/audios/guia-pratico-para-idosos.m4a",
        tipo: "livro",
        gratuito: false,
      },
      {
        titulo: "SaferNet Brasil",
        descricao:
          "ONG brasileira com guias sobre segurança online, tipos de golpes digitais e como denunciar conteúdos abusivos. Linguagem direta e acessível.",
        url: "https://www.safernet.org.br",
        tipo: "site",
        gratuito: true,
      },
      {
        titulo: "Febraban — Antifraude",
        descricao:
          "A Federação Brasileira de Bancos orienta sobre golpes digitais, phishing e fraudes financeiras — tipos de desinformação especialmente direcionados ao público mais velho.",
        url: "https://portal.febraban.org.br/AntiFraude",
        tipo: "site",
        gratuito: true,
      },
    ],
  },
];

export default function Biblioteca() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <GraduationCap className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Biblioteca Virtual
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Livros, sites, vídeos e cursos para aprender a reconhecer
            estratégias de manipulação — organizados por faixa etária.
          </p>
        </header>

        {/* Aviso */}
        <div
          className="animate-fade-in-up mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          style={{ animationDelay: "0.1s" }}
        >
          <strong>Importante:</strong> os links de livros levam ao site da Amazon
          para facilitar a compra — o LUPA não tem nenhuma relação comercial
          com essa ou qualquer outra loja. Recursos marcados como{" "}
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Gratuito
          </span>{" "}
          são totalmente acessíveis sem custo.
        </div>

        {/* Navegação rápida entre faixas */}
        <nav
          aria-label="Ir para faixa etária"
          className="animate-fade-in-up mb-10 flex flex-wrap justify-center gap-2"
          style={{ animationDelay: "0.15s" }}
        >
          {FAIXAS.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${f.corFundo} ${f.corIcone} border-transparent`}
            >
              {f.titulo}{" "}
              <span className="font-normal opacity-75">({f.faixa})</span>
            </a>
          ))}
        </nav>

        {/* Seções por faixa etária */}
        <div className="space-y-14">
          {FAIXAS.map((faixa, i) => (
            <SecaoFaixa key={faixa.id} faixa={faixa} ordem={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SecaoFaixa({
  faixa,
  ordem,
}: {
  faixa: FaixaEtaria;
  ordem: number;
}) {
  const Icone = faixa.icone;
  return (
    <section
      id={faixa.id}
      className="animate-fade-in-up scroll-mt-24"
      style={{ animationDelay: `${0.2 + ordem * 0.08}s` }}
    >
      {/* Cabeçalho da faixa */}
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${faixa.corFundo}`}
        >
          <Icone className={`h-5 w-5 ${faixa.corIcone}`} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">
              {faixa.titulo}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${faixa.corFundo} ${faixa.corIcone}`}
            >
              {faixa.faixa}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{faixa.descricao}</p>
        </div>
      </div>

      {/* Cards dos recursos */}
      <div className="grid gap-3 sm:grid-cols-2">
        {faixa.recursos.map((recurso) => (
          <CartaoRecurso key={recurso.url} recurso={recurso} />
        ))}
      </div>
    </section>
  );
}

function CartaoRecurso({ recurso }: { recurso: Recurso }) {
  const config = ROTULO_TIPO[recurso.tipo];
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 shadow-md shadow-indigo-100/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/40">
      <a
        href={recurso.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 p-4"
      >
        <p className="flex items-start gap-1.5 font-medium text-slate-900">
          <span className="flex-1 leading-snug">{recurso.titulo}</span>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition group-hover:text-indigo-500" />
        </p>
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          {recurso.descricao}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.cor}`}
          >
            {config.texto}
          </span>
          {recurso.gratuito && (
            <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Gratuito
            </span>
          )}
        </div>
      </a>
      {recurso.urlAudio && (
        <div className="border-t border-slate-100 px-4 py-3">
          <p className="mb-1.5 text-xs font-medium text-slate-500">🔊 Resumo em áudio</p>
          <audio controls src={recurso.urlAudio} className="w-full" style={{ height: "36px" }} />
        </div>
      )}
    </div>
  );
}
