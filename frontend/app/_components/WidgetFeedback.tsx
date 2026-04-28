"use client";

/**
 * Widget flutuante de feedback — aparece em todas as páginas.
 * Permite que qualquer usuário reporte o que ficou confuso,
 * sem sair da página atual. Os dados vão para o backend e
 * a equipe lê periodicamente via GET /feedbacks.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircleQuestion, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { enviarFeedback } from "@/lib/api";

export default function WidgetFeedback() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function abrir() {
    setAberto(true);
    setSucesso(false);
    setTexto("");
  }

  function fechar() {
    setAberto(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarFeedback({ pagina: pathname, texto: texto.trim() });
      setSucesso(true);
      // Fecha o widget automaticamente após 3 segundos
      setTimeout(() => {
        setAberto(false);
        setSucesso(false);
        setTexto("");
      }, 3000);
    } catch {
      // Falha silenciosa — feedback é sempre opcional e não-crítico
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">

      {/* Popup de feedback */}
      {aberto && (
        <div className="w-72 rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40 overflow-hidden animate-fade-in-up">

          {/* Cabeçalho colorido */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-rose-500 px-4 py-3">
            <span className="text-sm font-semibold text-white">Algo ficou confuso?</span>
            <button
              onClick={fechar}
              aria-label="Fechar widget de feedback"
              className="rounded-lg p-0.5 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Estado de sucesso */}
          {sucesso ? (
            <div className="px-4 py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-800">Obrigado pelo feedback!</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Isso nos ajuda a tornar o LUPA mais fácil de usar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
              {/* Indicador de página */}
              <p className="text-xs text-slate-400">
                Página:{" "}
                <span className="font-mono text-slate-600 break-all">{pathname}</span>
              </p>

              {/* Campo de texto */}
              <div>
                <label
                  htmlFor="feedback-texto"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  O que foi difícil ou confuso?{" "}
                  <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                  id="feedback-texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Ex: Não entendi o que significa 'domínio'..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-0.5 text-right text-xs text-slate-400">
                  {texto.length}/300
                </p>
              </div>

              {/* Rodapé do formulário */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-400">Anônimo. Sem dados pessoais.</p>
                <button
                  type="submit"
                  disabled={enviando}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {enviando ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                  Enviar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={aberto ? fechar : abrir}
        aria-label={aberto ? "Fechar feedback" : "Deixar feedback sobre esta página"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-300/50 transition hover:scale-105 hover:shadow-xl hover:shadow-indigo-300/60 active:scale-95"
      >
        {aberto ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircleQuestion className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
