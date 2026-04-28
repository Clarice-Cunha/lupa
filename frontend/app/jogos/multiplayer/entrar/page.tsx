"use client";

/**
 * Página para o jogador entrar em uma sala multiplayer existente.
 * O jogador digita o código de 6 letras e seu nome, e é redirecionado
 * para a sala compartilhada com o anfitrião.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowLeft, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function PaginaEntrarSala() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrarNaSala(e: React.FormEvent) {
    e.preventDefault();
    const codigoFormatado = codigo.trim().toUpperCase();
    const nomeTrimado = nome.trim();
    if (!codigoFormatado || !nomeTrimado) return;

    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(
        `${API_BASE}/multiplayer/sala/${codigoFormatado}/entrar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: nomeTrimado }),
        },
      );

      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        throw new Error(dados.detail ?? "Não foi possível entrar na sala.");
      }

      const dados = await res.json();

      // Salva o ID do jogador para que a página da sala o reconheça
      sessionStorage.setItem("lupa_multi_jogador_id", dados.jogador_id);
      // Garante que não há ID de anfitrião salvo de sessão anterior
      sessionStorage.removeItem("lupa_multi_anfitriao_id");

      router.push(`/jogos/multiplayer/sala/${codigoFormatado}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link
          href="/jogos"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para jogos
        </Link>

        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-500 shadow-md">
            <LogIn className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Entrar na sala</h1>
          <p className="mt-2 text-sm text-slate-600">
            Digite o código de 6 letras que o anfitrião compartilhou e
            escolha um apelido para jogar.
          </p>

          <form onSubmit={entrarNaSala} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="codigo"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Código da sala
              </label>
              <input
                id="codigo"
                type="text"
                maxLength={6}
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ex.: AB1C2D"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-lg tracking-widest text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="nome"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Seu apelido
              </label>
              <input
                id="nome"
                type="text"
                maxLength={20}
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !codigo.trim() || !nome.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? "Entrando…" : "Entrar na sala"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Quer criar uma sala?{" "}
          <Link
            href="/jogos/multiplayer/criar"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Seja o anfitrião
          </Link>
        </p>
      </div>
    </main>
  );
}
