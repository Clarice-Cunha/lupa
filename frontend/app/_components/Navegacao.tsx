"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, BookOpen, Library, Gamepad2, Users,
  School, ChevronDown, Menu, X,
} from "lucide-react";
import { chamarReset } from "@/lib/resetHome";
import BotaoTema from "./BotaoTema";
import { useState, useEffect, useRef } from "react";

type Filho = { href: string; rotulo: string };
type Item = { rotulo: string; icone: React.ElementType; href?: string; filhos?: Filho[] };

const MENU: Item[] = [
  { rotulo: "Analisador", href: "/", icone: Search },
  { rotulo: "Jogos", href: "/jogos", icone: Gamepad2 },
  {
    rotulo: "Aprender",
    icone: BookOpen,
    filhos: [
      { href: "/dicas-de-checagem", rotulo: "Dicas de Checagem" },
      { href: "/metodo-sift", rotulo: "Método SIFT" },
      { href: "/neurobiologia", rotulo: "Acelerador e Freio" },
    ],
  },
  {
    rotulo: "Referências",
    icone: Library,
    filhos: [
      { href: "/fontes-confiaveis", rotulo: "Fontes Confiáveis" },
      { href: "/pesquisa", rotulo: "Pesquisa e Dados" },
      { href: "/glossario", rotulo: "Glossário" },
      { href: "/biblioteca", rotulo: "Biblioteca" },
      { href: "/legislacao", rotulo: "Legislação" },
    ],
  },
  {
    rotulo: "Comunidade",
    icone: Users,
    filhos: [
      { href: "/comunidade", rotulo: "Portal Comunitário" },
      { href: "/colaboracao", rotulo: "Colaboração" },
      { href: "/futuro", rotulo: "Futuro" },
      { href: "/validacao", rotulo: "Validação" },
      { href: "/tecnico", rotulo: "Técnico" },
    ],
  },
  { rotulo: "Professor", href: "/professor", icone: School },
];

function estaAtivo(caminhoAtual: string, item: Item): boolean {
  if (item.href) {
    if (item.href === "/") return caminhoAtual === "/";
    if (item.href === "/jogos") {
      return (
        caminhoAtual === "/jogos" ||
        caminhoAtual.startsWith("/jogos/") ||
        caminhoAtual === "/jogo" ||
        caminhoAtual.startsWith("/jogo/")
      );
    }
    return caminhoAtual === item.href;
  }
  return (
    item.filhos?.some(
      (f) => caminhoAtual === f.href || caminhoAtual.startsWith(f.href + "/")
    ) ?? false
  );
}

export default function Navegacao() {
  const caminhoAtual = usePathname();
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);
  const [mobileAberto, setMobileAberto] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora da navegação
  useEffect(() => {
    function fecharFora(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownAberto(null);
      }
    }
    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, []);

  // Fecha tudo ao mudar de página
  useEffect(() => {
    setDropdownAberto(null);
    setMobileAberto(false);
  }, [caminhoAtual]);

  function aoClicarInicio(e: React.MouseEvent) {
    if (caminhoAtual === "/") {
      e.preventDefault();
      chamarReset();
    }
  }

  function toggleDropdown(rotulo: string) {
    setDropdownAberto((prev) => (prev === rotulo ? null : rotulo));
  }

  return (
    <nav
      ref={navRef}
      aria-label="Navegação principal"
      className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Logo */}
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

        {/* ── Desktop ─────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {MENU.map((item) => {
            const ativo = estaAtivo(caminhoAtual, item);
            const Icone = item.icone;
            const classeBase = `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200`;
            const classeAtivo = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300";
            const classeInativo = "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";

            // Link simples (sem filhos)
            if (!item.filhos?.length) {
              return (
                <Link
                  key={item.rotulo}
                  href={item.href!}
                  onClick={item.href === "/" ? aoClicarInicio : undefined}
                  aria-current={ativo ? "page" : undefined}
                  className={`${classeBase} ${ativo ? classeAtivo : classeInativo}`}
                >
                  <Icone className="h-4 w-4" />
                  <span>{item.rotulo}</span>
                </Link>
              );
            }

            // Botão com dropdown
            return (
              <div key={item.rotulo} className="relative">
                <button
                  onClick={() => toggleDropdown(item.rotulo)}
                  aria-expanded={dropdownAberto === item.rotulo}
                  className={`${classeBase} ${ativo ? classeAtivo : classeInativo}`}
                >
                  <Icone className="h-4 w-4" />
                  <span>{item.rotulo}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      dropdownAberto === item.rotulo ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownAberto === item.rotulo && (
                  <div className="absolute right-0 top-full mt-1.5 min-w-[200px] rounded-2xl border border-slate-200/60 bg-white/95 py-1.5 shadow-xl shadow-slate-200/60 backdrop-blur-sm dark:bg-slate-900 dark:border-slate-700/60">
                    {item.filhos.map((filho) => (
                      <Link
                        key={filho.href}
                        href={filho.href}
                        className={`block px-4 py-2 text-sm transition hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300 ${
                          caminhoAtual === filho.href
                            ? "font-semibold text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {filho.rotulo}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <BotaoTema />
        </div>

        {/* ── Mobile: tema + hambúrguer ────────────────────── */}
        <div className="flex md:hidden items-center gap-2">
          <BotaoTema />
          <button
            onClick={() => setMobileAberto((prev) => !prev)}
            aria-label={mobileAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileAberto}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
          >
            {mobileAberto ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Painel mobile ───────────────────────────────────── */}
      {mobileAberto && (
        <div className="border-t border-slate-200/60 bg-white/95 px-4 pb-4 pt-2 dark:bg-slate-900 dark:border-slate-700/60 md:hidden">
          {MENU.map((item) => {
            const Icone = item.icone;

            // Link simples no mobile
            if (!item.filhos?.length) {
              return (
                <Link
                  key={item.rotulo}
                  href={item.href!}
                  onClick={item.href === "/" ? aoClicarInicio : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    estaAtivo(caminhoAtual, item)
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icone className="h-4 w-4" />
                  {item.rotulo}
                </Link>
              );
            }

            // Grupo com subitens no mobile
            return (
              <div key={item.rotulo}>
                <div className="flex items-center gap-1.5 px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Icone className="h-3.5 w-3.5" />
                  {item.rotulo}
                </div>
                {item.filhos.map((filho) => (
                  <Link
                    key={filho.href}
                    href={filho.href}
                    className={`block rounded-xl px-5 py-2 text-sm font-medium transition ${
                      caminhoAtual === filho.href
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {filho.rotulo}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
