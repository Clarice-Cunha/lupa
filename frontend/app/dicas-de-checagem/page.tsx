/**
 * Página "Dicas de Checagem" — conteúdo estático educacional.
 * Lista práticas de verificação de informação, inspiradas em
 * Poynter.org, Aos Fatos e MediaWise.
 */

import {
  BookOpen,
  Search,
  Clock,
  LinkIcon,
  ImageIcon,
  Users,
  Brain,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Dica = {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  exemplo: string;
};

const DICAS: Dica[] = [
  {
    icone: Search,
    titulo: "1. Quem publicou?",
    descricao:
      "Antes de ler o conteúdo, veja quem é a fonte. Procure a página 'Sobre' ou 'Quem somos'. Fontes que escondem quem são geralmente não merecem confiança.",
    exemplo:
      "Um site sem endereço, sem responsável e sem CNPJ deve acender um alerta.",
  },
  {
    icone: BookOpen,
    titulo: "2. Leia além do título",
    descricao:
      "Muitos títulos são feitos para gerar clique, não para informar. Leia a matéria inteira antes de formar opinião ou compartilhar.",
    exemplo:
      "Títulos com 'VOCÊ NÃO VAI ACREDITAR' ou 'BOMBÁSTICO' quase sempre exageram o conteúdo real.",
  },
  {
    icone: Clock,
    titulo: "3. Veja a data",
    descricao:
      "Uma informação pode estar correta mas desatualizada, ou ser reciclada de anos atrás como se fosse nova. Procure sempre a data de publicação.",
    exemplo:
      "Matérias sem data, ou que reaparecem em momentos de crise, frequentemente são usadas fora de contexto.",
  },
  {
    icone: LinkIcon,
    titulo: "4. Investigue a fonte original",
    descricao:
      "Se a matéria cita 'um estudo' ou 'especialistas', procure o link ou nome. Fontes sérias apontam para o material original; fontes duvidosas usam frases vagas.",
    exemplo:
      "'Segundo pesquisa da Universidade X, Y% das pessoas...' — se não há link pro estudo, desconfie.",
  },
  {
    icone: ImageIcon,
    titulo: "5. Faça busca reversa de imagens",
    descricao:
      "Imagens e vídeos podem ser reaproveitados em contextos diferentes. O Google Imagens e o TinEye permitem descobrir onde uma foto apareceu pela primeira vez.",
    exemplo:
      "Uma foto de enchente divulgada como atual pode ser de um desastre de dez anos atrás, em outro país.",
  },
  {
    icone: Users,
    titulo: "6. Compare com outras fontes",
    descricao:
      "Se uma notícia importante é verdade, mais de um veículo sério deve estar cobrindo. Se só um site obscuro fala sobre, reforça a necessidade de cautela.",
    exemplo:
      "Busque o mesmo fato em dois ou três veículos tradicionais antes de acreditar ou compartilhar.",
  },
  {
    icone: Brain,
    titulo: "7. Cuidado com seus próprios vieses",
    descricao:
      "A gente tende a acreditar em coisas que confirmam o que já pensa. Quando uma notícia parece 'boa demais' para o seu lado, é justamente a hora de checar com mais rigor.",
    exemplo:
      "Antes de compartilhar algo que confirma sua opinião, pergunte: 'eu checaria com o mesmo cuidado se fosse o oposto?'",
  },
  {
    icone: MessageSquare,
    titulo: "8. Na dúvida, não compartilhe",
    descricao:
      "Compartilhar dá alcance. Se você não tem certeza, deixar de encaminhar a mensagem já é uma forma de combater a desinformação.",
    exemplo:
      "'Não sei se é verdade' + compartilhar = espalhar a dúvida como fato.",
  },
];

export default function DicasDeChecagem() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <BookOpen className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Dicas de Checagem
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Oito hábitos simples que transformam qualquer pessoa em um
            checador mais atento.
          </p>
        </header>

        {/* Grade de dicas */}
        <div className="grid gap-4 sm:grid-cols-2">
          {DICAS.map((dica, i) => (
            <CartaoDica key={dica.titulo} dica={dica} ordem={i} />
          ))}
        </div>

        {/* Chamada final */}
        <div
          className="animate-fade-in-up mt-10 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-rose-50 p-6 text-center shadow-lg shadow-indigo-100/40"
          style={{ animationDelay: "0.8s" }}
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Quer praticar agora?
          </h2>
          <p className="mt-2 text-slate-600">
            Cole um link na página inicial e veja o LUPA aplicar várias
            dessas dicas automaticamente.
          </p>
        </div>
      </div>
    </main>
  );
}

function CartaoDica({ dica, ordem }: { dica: Dica; ordem: number }) {
  const Icone = dica.icone;
  return (
    <div
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-lg shadow-indigo-100/30 backdrop-blur-sm transition hover:shadow-xl hover:shadow-indigo-100/50"
      style={{ animationDelay: `${ordem * 0.05}s` }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
        <Icone className="h-5 w-5 text-indigo-600" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-slate-900">
        {dica.titulo}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {dica.descricao}
      </p>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs italic text-slate-500">
        💡 {dica.exemplo}
      </p>
    </div>
  );
}
