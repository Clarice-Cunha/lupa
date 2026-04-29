"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function PaginaAcesso() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function verificar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);
    setErro(false);

    try {
      const res = await fetch("/api/acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      if (res.ok) {
        // Recarregamento completo garante que o cookie seja enviado ao servidor
        window.location.href = "/";
      } else {
        setErro(true);
        setCarregando(false);
      }
    } catch {
      setErro(true);
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md shadow-indigo-200">
          <Lock className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-slate-600">
          O LUPA está em fase de testes. Digite a senha para continuar.
        </p>

        <form onSubmit={verificar} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de acesso"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          {erro && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
              Senha incorreta. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            disabled={carregando || !senha}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 disabled:opacity-50"
          >
            {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
            {carregando ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
