import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import JogoPhishing from "./JogoPhishing";

export const metadata = {
  title: "Caça ao Phishing — LUPA",
  description:
    "Identifique armadilhas em mensagens falsas de e-mail, WhatsApp e SMS. Aprenda a reconhecer tentativas de phishing.",
};

export default function PaginaPhishing() {
  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        {/* Voltar */}
        <Link
          href="/jogos"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos jogos
        </Link>

        {/* Cabeçalho */}
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-200">
            <ShieldAlert className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Caça ao Phishing
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Identifique armadilhas em e-mails, WhatsApp e SMS falsos
          </p>
        </header>

        {/* Jogo */}
        <JogoPhishing />
      </div>
    </main>
  );
}
