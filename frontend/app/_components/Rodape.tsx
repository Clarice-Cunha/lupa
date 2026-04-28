import Link from "next/link";
import { Search } from "lucide-react";

export default function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/70 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg transition hover:opacity-80 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-rose-500">
            <Search className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">LUPA</span>
        </Link>

        {/* Links secundários */}
        <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <Link href="/sobre" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Sobre o LUPA
          </Link>
          <Link href="/equipe" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Nossa Equipe
          </Link>
          <Link href="/comunidade" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Comunidade
          </Link>
          <Link href="/glossario" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Glossário
          </Link>
          <Link href="/dicas-de-checagem" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Dicas de checagem
          </Link>
          <Link href="/legislacao" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Legislação
          </Link>
          <Link href="/api" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            API
          </Link>
          <Link href="/evolucao" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Evolução
          </Link>
          <Link href="/pesquisa" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Pesquisa e Dados
          </Link>
          <Link href="/futuro" className="text-xs text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-300">
            Para onde o LUPA vai
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          © {ano} LUPA — uso educativo
        </p>
      </div>
    </footer>
  );
}
