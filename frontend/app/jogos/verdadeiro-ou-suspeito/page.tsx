import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import JogoVerdadeiroOuSuspeito from "./JogoVerdadeiroOuSuspeito";

export const metadata = {
  title: "Verdadeiro ou Suspeito? — LUPA",
  description:
    "Classifique manchetes e afirmações virais como verdadeiras ou suspeitas e identifique o principal indício em cada uma.",
};

export default function PaginaVerdadeiroOuSuspeito() {
  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/jogos"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos jogos
        </Link>

        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
            <Scale className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Verdadeiro ou Suspeito?
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Analise 8 afirmações e treine o olhar crítico sobre manchetes virais
          </p>
        </header>

        <JogoVerdadeiroOuSuspeito />
      </div>
    </main>
  );
}
