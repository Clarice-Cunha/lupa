"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookOpen, Library, Gamepad2, Scale, BookMarked, GraduationCap, Users, BarChart2, Telescope, School } from "lucide-react";
import { chamarReset } from "@/lib/resetHome";
import BotaoTema from "./BotaoTema";

const LINKS = [
  { href: "/", rotulo: "Início", icone: Search },
  { href: "/jogos", rotulo: "Jogos", icone: Gamepad2 },
  { href: "/dicas-de-checagem", rotulo: "Dicas", icone: BookOpen },
  { href: "/fontes-confiaveis", rotulo: "Fontes", icone: Library },
  { href: "/biblioteca", rotulo: "Biblioteca", icone: GraduationCap },
  { href: "/legislacao", rotulo: "Legislação", icone: Scale },
  { href: "/glossario", rotulo: "Glossário", icone: BookMarked },
  { href: "/comunidade", rotulo: "Comunidade", icone: Users },
  { href: "/pesquisa", rotulo: "Pesquisa", icone: BarChart2 },
  { href: "/futuro", rotulo: "Futuro", icone: Telescope },
  { href: "/professor", rotulo: "Professor", icone: School },
];

function estaAtivo(caminhoAtual: string, href: string): boolean {
  if (href === "/") return caminhoAtual === "/";
  if (href === "/jogos") {
    return caminhoAtual === "/jogos" ||
      caminhoAtual.startsWith("/jogos/") ||
      caminhoAtual === "/jogo" ||
      caminhoAtual.startsWith("/jogo/");
  }
  return caminhoAtual === href;
}

export default function Navegacao() {
  const caminhoAtual = usePathname();

  function aoClicarInicio(e: React.MouseEvent) {
    if (caminhoAtual === "/") {
      e.preventDefault();
      chamarReset();
    }
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Logo + nome */}
        <Link
          href="/"
          onClick={aoClicarInicio}
          aria-label="LUPA — ir para a página inicial"
          className="flex items-center gap-2 rounded-lg transition hover:opacity-80 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 shadow-sm">
            <Search className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            LUPA
          </span>
        </Link>

        {/* Links + botão de tema */}
        <div className="flex items-center gap-1">
          {LINKS.map(({ href, rotulo, icone: Icone }) => {
            const ativa = estaAtivo(caminhoAtual, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={href === "/" ? aoClicarInicio : undefined}
                aria-current={ativa ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
                  ativa
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Icone className="h-4 w-4" />
                <span className="hidden sm:inline">{rotulo}</span>
              </Link>
            );
          })}

          {/* Separador visual */}
          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

          <BotaoTema />
        </div>
      </div>
    </nav>
  );
}
