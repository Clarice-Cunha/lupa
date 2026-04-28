"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Lock, Mail, Copy, Check } from "lucide-react";
import {
  type Boato,
  type StatusBoato,
  listarBoatos,
  atualizarBoato,
} from "@/lib/api";

const ROTULO_CATEGORIA: Record<string, string> = {
  cidade: "Cidade/Bairro",
  escola: "Escola",
  condominio: "Condomínio",
};

function gerarCorpoEmail(boato: Boato): string {
  const data = new Date(boato.criado_em).toLocaleDateString("pt-BR");
  const linhas = [
    "Prezado(a),",
    "",
    "O seguinte boato foi reportado pela comunidade através do Portal LUPA e encaminhado para sua análise:",
    "",
    `Categoria: ${ROTULO_CATEGORIA[boato.categoria] ?? boato.categoria}`,
    `Local: ${boato.localidade}`,
    `Data do reporte: ${data}`,
    `Descrição: ${boato.descricao}`,
  ];
  if (boato.contato) linhas.push(`Contato do(a) reportante: ${boato.contato}`);
  linhas.push(
    "",
    "Solicitamos, se possível, que investigue e nos informe o resultado para que possamos publicar a checagem no site.",
    "",
    "Atenciosamente,",
    "Equipe LUPA",
  );
  return linhas.join("\n");
}

function gerarTextoWhatsApp(boato: Boato): string {
  const data = new Date(boato.criado_em).toLocaleDateString("pt-BR");
  const linhas = [
    "*BOATO REPORTADO — LUPA*",
    "",
    `*Categoria:* ${ROTULO_CATEGORIA[boato.categoria] ?? boato.categoria}`,
    `*Local:* ${boato.localidade}`,
    `*Data:* ${data}`,
    "",
    "*Descrição:*",
    boato.descricao,
  ];
  if (boato.contato) linhas.push("", `*Contato:* ${boato.contato}`);
  linhas.push("", "_Reportado via Portal Comunitário do LUPA_");
  return linhas.join("\n");
}

const ROTULO_STATUS: Record<StatusBoato, string> = {
  pendente: "Pendente",
  em_apuracao: "Em Apuração",
  verificado_verdadeiro: "Verificado — Verdadeiro",
  verificado_falso: "Verificado — Falso",
  inconclusivo: "Inconclusivo",
};

function CartaoModeracao({
  boato,
  chave,
  onAtualizado,
}: {
  boato: Boato;
  chave: string;
  onAtualizado: (b: Boato) => void;
}) {
  const [status, setStatus] = useState<StatusBoato>(boato.status);
  const [checagem, setChecagem] = useState(boato.checagem ?? "");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [emailAutoridade, setEmailAutoridade] = useState("");
  const [copiado, setCopiado] = useState(false);

  const alterado =
    status !== boato.status ||
    checagem.trim() !== (boato.checagem ?? "").trim();

  function abrirEmail() {
    const assunto = encodeURIComponent(
      `[LUPA] Boato para análise — ${ROTULO_CATEGORIA[boato.categoria] ?? boato.categoria} — ${boato.localidade}`,
    );
    const corpo = encodeURIComponent(gerarCorpoEmail(boato));
    window.open(`mailto:${emailAutoridade.trim()}?subject=${assunto}&body=${corpo}`);
  }

  async function copiarTexto() {
    const texto = gerarTextoWhatsApp(boato);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Fallback para navegadores mais antigos
      const el = document.createElement("textarea");
      el.value = texto;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function salvar() {
    setSalvando(true);
    setSucesso(false);
    setErro(null);
    try {
      const atualizado = await atualizarBoato(
        boato.id,
        { status, checagem: checagem.trim() || null },
        chave,
      );
      onAtualizado(atualizado);
      setSucesso(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {boato.categoria} — {boato.localidade}
          </span>
          {boato.contato && (
            <p className="mt-0.5 text-xs text-slate-400">
              Contato: {boato.contato}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {new Date(boato.criado_em).toLocaleDateString("pt-BR")}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
        {boato.descricao}
      </p>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusBoato)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        >
          {(Object.keys(ROTULO_STATUS) as StatusBoato[]).map((s) => (
            <option key={s} value={s}>
              {ROTULO_STATUS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Texto da checagem (deixe vazio se ainda não verificou)
        </label>
        <textarea
          value={checagem}
          onChange={(e) => setChecagem(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Descreva o resultado da investigação…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {checagem.length}/2000
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={salvar}
          disabled={salvando || !alterado}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {salvando ? "Salvando…" : "Salvar alterações"}
        </button>
        {sucesso && (
          <span className="text-sm text-emerald-600">Salvo com sucesso!</span>
        )}
        {erro && <span className="text-sm text-red-600">{erro}</span>}
      </div>

      {/* Encaminhar para autoridade */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Encaminhar para autoridade
        </p>

        <div className="flex gap-2">
          <input
            type="email"
            value={emailAutoridade}
            onChange={(e) => setEmailAutoridade(e.target.value)}
            placeholder="E-mail da autoridade (ex: diretoria@escola.com)"
            className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          />
          <button
            onClick={abrirEmail}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            <Mail className="h-4 w-4" />
            Enviar e-mail
          </button>
        </div>

        <button
          onClick={copiarTexto}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          {copiado ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar texto (WhatsApp)
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function PaginaModeracao() {
  const [chaveDigitada, setChaveDigitada] = useState("");
  const [chave, setChave] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [boatos, setBoatos] = useState<Boato[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setBoatos(await listarBoatos());
    } catch {
      setErro("Não foi possível carregar os boatos. Verifique se o servidor está no ar.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (autenticado) carregar();
  }, [autenticado, carregar]);

  function entrar(e: { preventDefault(): void }) {
    e.preventDefault();
    if (chaveDigitada.trim()) {
      setChave(chaveDigitada.trim());
      setAutenticado(true);
    }
  }

  function onAtualizado(atualizado: Boato) {
    setBoatos((prev) =>
      prev.map((b) => (b.id === atualizado.id ? atualizado : b)),
    );
  }

  if (!autenticado) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Painel de Moderação
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Área restrita à equipe LUPA.
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-4">
            <input
              type="password"
              value={chaveDigitada}
              onChange={(e) => setChaveDigitada(e.target.value)}
              placeholder="Chave de acesso"
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Painel de Moderação
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            {boatos.length} boato{boatos.length !== 1 ? "s" : ""} registrado
            {boatos.length !== 1 ? "s" : ""}. Atualize o status e publique as
            checagens.
          </p>
        </header>

        {carregando && (
          <p className="text-sm text-slate-500">Carregando boatos…</p>
        )}
        {erro && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {erro}
          </div>
        )}
        {!carregando && !erro && boatos.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhum boato registrado ainda.
          </p>
        )}

        <div className="space-y-4">
          {boatos.map((boato) => (
            <CartaoModeracao
              key={boato.id}
              boato={boato}
              chave={chave}
              onAtualizado={onAtualizado}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
