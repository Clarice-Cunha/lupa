"use client";

import { useState, useEffect } from "react";
import {
  MessageSquarePlus,
  User,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { listarSugestoes, enviarSugestao, type Sugestao } from "@/lib/api";

export default function PaginaColaboracao() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarSugestoes()
      .then(setSugestoes)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) return;
    setEnviando(true);
    setErro(null);
    try {
      const nova = await enviarSugestao({
        nome: nome.trim(),
        email: email.trim() || undefined,
        mensagem: mensagem.trim(),
      });
      setSugestoes((prev) => [nova, ...prev]);
      setNome("");
      setEmail("");
      setMensagem("");
      setSucesso(true);
      setTimeout(() => setSucesso(false), 6000);
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <MessageSquarePlus
              className="h-8 w-8 text-white"
              strokeWidth={2.5}
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Colabore com o LUPA
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Encontrou algo confuso? Tem uma ideia de melhoria? Escreva aqui. A
            equipe lê tudo e responde publicamente.
          </p>
        </header>

        {/* Formulário */}
        <section
          className="mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-100/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
            <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-slate-100">
              Enviar sugestão ou relato
            </h2>

            <form onSubmit={enviar} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Nome */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nome *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como quer ser identificado(a)"
                      maxLength={200}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    E-mail{" "}
                    <span className="font-normal text-slate-400">
                      (opcional — não aparece publicamente)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      maxLength={300}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mensagem *
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Descreva sua sugestão, melhoria ou inconsistência encontrada…"
                  required
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {mensagem.length}/2000
                </p>
              </div>

              {/* Rodapé do form */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  * campos obrigatórios. O e-mail, se informado, é visto apenas
                  pela equipe e jamais exibido no site.
                </p>
                <button
                  type="submit"
                  disabled={enviando || !nome.trim() || !mensagem.trim()}
                  className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {enviando ? "Enviando…" : "Enviar"}
                </button>
              </div>

              {/* Feedback de envio */}
              {sucesso && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  Sugestão enviada! Ela já aparece na lista abaixo. A equipe
                  responderá em breve.
                </div>
              )}
              {erro && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {erro}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Lista de sugestões */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="mb-5 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              O que a comunidade sugere
            </h2>
          </div>

          {carregando && (
            <p className="text-sm text-slate-500">Carregando sugestões…</p>
          )}

          {!carregando && sugestoes.length === 0 && (
            <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma sugestão ainda. Seja o primeiro a contribuir!
              </p>
            </div>
          )}

          <div className="space-y-4">
            {sugestoes.map((s, i) => (
              <div
                key={s.id}
                className="animate-fade-in-up rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                style={{ animationDelay: `${0.05 + i * 0.03}s` }}
              >
                {/* Cabeçalho do cartão */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {s.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {s.nome}
                    </span>
                  </div>
                  <span className="flex-shrink-0 text-xs text-slate-400">
                    {new Date(s.criado_em).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {/* Mensagem */}
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {s.mensagem}
                </p>

                {/* Resposta da equipe */}
                {s.resposta && (
                  <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 dark:border-indigo-800/40 dark:bg-indigo-900/20">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                      Resposta da equipe LUPA
                    </p>
                    <p className="text-sm leading-relaxed text-indigo-900 dark:text-indigo-200">
                      {s.resposta}
                    </p>
                    {s.respondido_em && (
                      <p className="mt-1.5 text-right text-xs text-indigo-400 dark:text-indigo-500">
                        {new Date(s.respondido_em).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
