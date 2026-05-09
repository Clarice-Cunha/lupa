import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";
import JogoEngenhariaSocial from "./JogoEngenhariaSocial";

export const metadata = {
  title: "Detetive da Engenharia Social — LUPA",
  description:
    "Identifique táticas de manipulação psicológica usadas por golpistas. Aprenda a reconhecer pretexting, urgência falsa, autoridade falsa e mais.",
};

export default function PaginaEngenhariaSocial() {
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
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-200">
            <Brain className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Detetive da Engenharia Social
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Identifique táticas de manipulação em 6 cenários do cotidiano
          </p>
        </header>

        <JogoEngenhariaSocial />
      </div>
    </main>
  );
}
