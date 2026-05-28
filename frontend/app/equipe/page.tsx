import type { ReactNode } from "react";
import { Users, Crown, MapPin, BookOpen, Trophy, Star, Dumbbell, Palette } from "lucide-react";

export const metadata = {
  title: "Nossa Equipe — LUPA",
  description:
    "Conheça os estudantes do Colégio Contemporâneo que criaram o LUPA para o HackaNAV 2026.",
};

type Destaque = {
  icone: ReactNode;
  texto: string;
};

type Membro = {
  iniciais: string;
  nome: string;
  papel: string;
  lider: boolean;
  anoTurma: string;
  escola: string;
  cidade: string;
  destaques: Destaque[];
  corFundo: string;
  corBorda: string;
  corPapel: string;
  corPapelTexto: string;
};

const MEMBROS: Membro[] = [
  {
    iniciais: "CC",
    nome: "Clarice Cunha Pinto",
    papel: "Líder do Projeto",
    lider: true,
    anoTurma: "8º ano — Turma A",
    escola: "Colégio Contemporâneo",
    cidade: "Lagoa Nova, Natal/RN",
    destaques: [
      { icone: <BookOpen className="h-3.5 w-3.5" />, texto: "Matemática, Inglês e Português" },
      { icone: <Dumbbell className="h-3.5 w-3.5" />, texto: "Taekwondo na escola" },
      { icone: <Crown className="h-3.5 w-3.5" />, texto: "Xadrez — entre as melhores da sua idade no Nordeste" },
    ],
    corFundo: "from-indigo-500 to-violet-600",
    corBorda: "border-indigo-200",
    corPapel: "bg-indigo-100",
    corPapelTexto: "text-indigo-700",
  },
  {
    iniciais: "BC",
    nome: "Benjamim de Almeida das Chagas",
    papel: "Integrante",
    lider: false,
    anoTurma: "8º ano — Turma B",
    escola: "Colégio Contemporâneo",
    cidade: "Lagoa Nova, Natal/RN",
    destaques: [
      { icone: <BookOpen className="h-3.5 w-3.5" />, texto: "História" },
      { icone: <Dumbbell className="h-3.5 w-3.5" />, texto: "Taekwondo na escola" },
      { icone: <BookOpen className="h-3.5 w-3.5" />, texto: "Leitura" },
    ],
    corFundo: "from-teal-500 to-cyan-600",
    corBorda: "border-teal-200",
    corPapel: "bg-teal-100",
    corPapelTexto: "text-teal-700",
  },
  {
    iniciais: "PM",
    nome: "Pedro Moreno de Lima Bessa",
    papel: "Integrante",
    lider: false,
    anoTurma: "8º ano — Turma A",
    escola: "Colégio Contemporâneo",
    cidade: "Lagoa Nova, Natal/RN",
    destaques: [
      { icone: <BookOpen className="h-3.5 w-3.5" />, texto: "Matemática e Física" },
      { icone: <Dumbbell className="h-3.5 w-3.5" />, texto: "Judô" },
      { icone: <Palette className="h-3.5 w-3.5" />, texto: "Desenho" },
    ],
    corFundo: "from-amber-500 to-orange-600",
    corBorda: "border-amber-200",
    corPapel: "bg-amber-100",
    corPapelTexto: "text-amber-700",
  },
];

function CartaoMembro({ membro }: { membro: Membro }) {
  return (
    <div className={`animate-fade-in-up rounded-3xl border-2 ${membro.corBorda} bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm flex flex-col gap-5`}>
      {/* Avatar e nome */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${membro.corFundo} shadow-lg`}
          aria-hidden="true"
        >
          <span className="text-2xl font-bold text-white">{membro.iniciais}</span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{membro.nome}</h2>
          <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${membro.corPapel} ${membro.corPapelTexto}`}>
            {membro.lider && <Star className="h-3 w-3" />}
            {membro.papel}
          </span>
        </div>
      </div>

      {/* Escola e turma */}
      <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span>{membro.anoTurma}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span>{membro.escola} — {membro.cidade}</span>
        </div>
      </div>

      {/* Destaques */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Interesses e atividades</p>
        <ul className="space-y-2">
          {membro.destaques.map((d, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex-shrink-0 text-slate-400">{d.icone}</span>
              {d.texto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


export default function PaginaEquipe() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Users className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Nossa Equipe
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Estudantes do 8º ano do Colégio Contemporâneo que criaram o LUPA para a competição HackaNAV 2026.
          </p>
        </header>

        {/* Contexto da competição */}
        <div
          className="animate-fade-in-up mb-10 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-900"
          style={{ animationDelay: "0.08s" }}
        >
          <p className="font-semibold mb-1">HackaNAV 2026 — Programa Nave a Vela</p>
          <p className="text-indigo-700 leading-relaxed">
            O LUPA foi desenvolvido como solução para o desafio <em>"Combate à Desinformação Digital"</em>.
            O projeto nasceu da identificação de um problema real: as ferramentas de verificação existentes
            são difíceis de usar para crianças, adolescentes e idosos. A equipe propôs uma alternativa
            acessível para toda a família.
          </p>
        </div>

        {/* Cards da equipe */}
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ animationDelay: "0.12s" }}
        >
          {MEMBROS.map((membro) => (
            <CartaoMembro key={membro.nome} membro={membro} />
          ))}
        </div>

        {/* Nota de rodapé */}
        <p
          className="animate-fade-in-up mt-10 text-center text-sm text-slate-400"
          style={{ animationDelay: `${0.15 + MEMBROS.length * 0.05}s` }}
        >
          Escola Complexo Educacional Contemporâneo — Unidade Lagoa Nova, Natal/RN
        </p>
      </div>
    </main>
  );
}
