"use client";

/**
 * Página para o anfitrião criar uma sala multiplayer.
 * Envia o nome, recebe o código de 6 letras e redireciona
 * para /jogos/multiplayer/sala/[codigo] com os dados salvos
 * no sessionStorage.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, Loader2, User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function PaginaCriarSala() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [participa, setParticipa] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function criarSala(e: React.FormEvent) {
    e.preventDefault();
    const nomeTrimado = nome.trim();
    if (!nomeTrimado) return;

    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(`${API_BASE}/multiplayer/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_anfitriao: nomeTrimado,
          anfitriao_participa: participa,
        }),
      });

      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        throw new Error(dados.detail ?? "Erro ao criar sala.");
      }

      const dados = await res.json();

      // Salva o ID do anfitrião no sessionStorage para identificá-lo
      // nas chamadas seguintes (não enviamos senha — é MVP).
      sessionStorage.setItem("lupa_multi_jogador_id", dados.anfitriao_id);
      sessionStorage.setItem("lupa_multi_anfitriao_id", dados.anfitriao_id);

      router.push(`/jogos/multiplayer/sala/${dados.codigo}`);
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
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md shadow-indigo-200">
            <Users className="h-6 w-6 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Criar sala</h1>
          <p className="mt-2 text-sm text-slate-600">
            Você será o anfitrião. Depois de criar a sala, compartilhe o
            código com os jogadores para que eles entrem.
          </p>

          <form onSubmit={criarSala} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Seu nome (anfitrião)
              </label>
              <input
                id="nome"
                type="text"
                maxLength={30}
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Prof. Ana"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Toggle: anfitrião participa como jogador? */}
            <button
              type="button"
              onClick={() => setParticipa((v) => !v)}
              aria-pressed={participa}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
                participa
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${participa ? "bg-indigo-100" : "bg-slate-100"}`}>
                  <User className={`h-5 w-5 ${participa ? "text-indigo-600" : "text-slate-400"}`} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Quero participar como jogador
                  </p>
                  <p className="text-xs text-slate-500">
                    {participa
                      ? "Você vai ver as perguntas e aparecer no placar."
                      : "Você só controla o jogo, sem responder perguntas."}
                  </p>
                </div>
              </div>
              <div className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${participa ? "bg-indigo-500" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${participa ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>

            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !nome.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? "Criando sala…" : "Criar sala"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
