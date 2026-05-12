"use client";

import { useState } from "react";
import { Mail, Phone, User, MessageSquare, SendHorizonal, CheckCircle2 } from "lucide-react";
import { criarContato } from "@/lib/api";

export default function PaginaContato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await criarContato({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
        mensagem: mensagem.trim(),
      });
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar a mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mensagem enviada!
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Obrigado por entrar em contato, <strong>{nome}</strong>. A equipe
            LUPA leu sua mensagem e responderá pelo e-mail{" "}
            <strong>{email}</strong> em breve.
          </p>
          <button
            onClick={() => {
              setNome("");
              setEmail("");
              setTelefone("");
              setMensagem("");
              setEnviado(false);
            }}
            className="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Enviar outra mensagem
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">

        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Mail className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Fale com a gente
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-lg text-slate-600 dark:text-slate-400">
            Tem uma dúvida, sugestão ou quer fazer parceria? Preencha o
            formulário abaixo e a equipe LUPA responderá pelo e-mail informado.
          </p>
        </header>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="space-y-5">

            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <User className="h-4 w-4 text-slate-400" />
                Nome completo
                <span className="text-rose-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={200}
                placeholder="Como você se chama?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                E-mail
                <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={300}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="telefone"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <Phone className="h-4 w-4 text-slate-400" />
                Telefone / WhatsApp
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (opcional)
                </span>
              </label>
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                maxLength={30}
                placeholder="(84) 9 0000-0000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>

            {/* Mensagem */}
            <div>
              <label
                htmlFor="mensagem"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                Sua mensagem
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="mensagem"
                required
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                minLength={10}
                maxLength={3000}
                rows={5}
                placeholder="Escreva aqui sua dúvida, sugestão ou proposta..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {mensagem.length}/3000
              </p>
            </div>

            {/* Erro */}
            {erro && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {erro}
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={enviando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? (
                "Enviando…"
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4" />
                  Enviar mensagem
                </>
              )}
            </button>
          </div>
        </form>

        {/* Nota de privacidade */}
        <p
          className="animate-fade-in-up mt-5 text-center text-xs text-slate-400 dark:text-slate-500"
          style={{ animationDelay: "0.2s" }}
        >
          Seus dados são usados exclusivamente para responder à sua mensagem e
          nunca serão compartilhados com terceiros.
        </p>

      </div>
    </main>
  );
}
