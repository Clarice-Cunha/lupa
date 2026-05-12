"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Lock, Mail, Copy, Check, Search, GraduationCap, Loader2, CheckCircle2, XCircle, MessageCircle, Phone } from "lucide-react";
import {
  type Boato,
  type StatusBoato,
  listarBoatos,
  atualizarBoato,
  type SugestaoInterno,
  listarSugestoesInternas,
  responderSugestao,
  type TurmaResumida,
  buscarTurmas,
  type ValidacaoInterna,
  listarValidacoes,
  aprovarValidacao,
  type Contato,
  listarContatos,
  marcarContatoLido,
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

function CartaoSugestao({
  sugestao,
  chave,
  onAtualizado,
}: {
  sugestao: SugestaoInterno;
  chave: string;
  onAtualizado: (s: SugestaoInterno) => void;
}) {
  const [resposta, setResposta] = useState(sugestao.resposta ?? "");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const jaTemResposta = Boolean(sugestao.resposta);
  const alterado =
    resposta.trim().length > 0 &&
    resposta.trim() !== (sugestao.resposta ?? "").trim();

  async function salvar() {
    if (!resposta.trim()) return;
    setSalvando(true);
    setSucesso(false);
    setErro(null);
    try {
      const atualizado = await responderSugestao(sugestao.id, resposta.trim(), chave);
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
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {sugestao.nome}
          </span>
          {sugestao.email && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Mail className="h-3 w-3" />
              {sugestao.email}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {new Date(sugestao.criado_em).toLocaleDateString("pt-BR")}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
        {sugestao.mensagem}
      </p>

      {jaTemResposta && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-xs text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-900/20 dark:text-indigo-300">
          <strong>Resposta atual:</strong> {sugestao.resposta}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {jaTemResposta
            ? "Editar resposta pública"
            : "Resposta pública (ficará visível no site)"}
        </label>
        <textarea
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Escreva a resposta que ficará visível para todos…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {resposta.length}/2000
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={salvar}
          disabled={salvando || !alterado}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {salvando
            ? "Salvando…"
            : jaTemResposta
              ? "Atualizar resposta"
              : "Publicar resposta"}
        </button>
        {sucesso && (
          <span className="text-sm text-emerald-600">Salvo com sucesso!</span>
        )}
        {erro && <span className="text-sm text-red-600">{erro}</span>}
      </div>
    </div>
  );
}

// ============================================================
// Cartão: Avaliação de usuário
// ============================================================

const PERFIL_ROTULOS: Record<string, string> = {
  estudante: "Estudante",
  professor: "Professor(a)",
  familiar: "Familiar / Responsável",
  outro: "Outro",
};

function CartaoAvaliacao({
  avaliacao,
  chave,
  onAtualizado,
}: {
  avaliacao: ValidacaoInterna;
  chave: string;
  onAtualizado: (a: ValidacaoInterna) => void;
}) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function toggleAprovado() {
    setSalvando(true);
    setErro(null);
    try {
      const atualizado = await aprovarValidacao(avaliacao.id, !avaliacao.aprovado, chave);
      onAtualizado(atualizado);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSalvando(false);
    }
  }

  const sim = "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  const nao = "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {avaliacao.nome}
          </span>
          <p className="mt-0.5 text-xs text-slate-400">
            {PERFIL_ROTULOS[avaliacao.perfil] ?? avaliacao.perfil}
          </p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {new Date(avaliacao.criado_em).toLocaleDateString("pt-BR")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className={avaliacao.aprendeu_algo ? sim : nao}>
          {avaliacao.aprendeu_algo ? "✓" : "✗"} Aprendeu algo
        </span>
        <span className={avaliacao.identificou_sinal ? sim : nao}>
          {avaliacao.identificou_sinal ? "✓" : "✗"} Identificou sinal
        </span>
        <span className={avaliacao.recomendaria ? sim : nao}>
          {avaliacao.recomendaria ? "✓" : "✗"} Recomendaria
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Facilidade: {avaliacao.facilidade}/5
        </span>
      </div>

      {avaliacao.depoimento && (
        <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">
          &ldquo;{avaliacao.depoimento}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={toggleAprovado}
          disabled={salvando || !avaliacao.depoimento}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
            avaliacao.aprovado
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : avaliacao.aprovado ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {avaliacao.aprovado ? "Depoimento aprovado" : "Aprovar depoimento"}
        </button>
        {!avaliacao.depoimento && (
          <span className="text-xs text-slate-400">sem depoimento</span>
        )}
        {erro && <span className="text-sm text-red-600">{erro}</span>}
      </div>
    </div>
  );
}

// ============================================================
// Seção: Buscar turmas (recuperação de código)
// ============================================================

function SecaoBuscarTurmas({ chave }: { chave: string }) {
  const [nomeProfessor, setNomeProfessor] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultados, setResultados] = useState<TurmaResumida[] | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  async function buscar(e: { preventDefault(): void }) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const dados = await buscarTurmas(nomeProfessor, nomeTurma, chave);
      setResultados(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao buscar.");
    } finally {
      setCarregando(false);
    }
  }

  async function copiarCodigo(codigo: string) {
    await navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Busque pelo nome do professor ou da turma para recuperar o código de acesso.
        A chave de acesso privada nunca é exibida aqui.
      </p>

      <form onSubmit={buscar} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={nomeProfessor}
          onChange={(e) => setNomeProfessor(e.target.value)}
          placeholder="Nome do professor"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        />
        <input
          type="text"
          value={nomeTurma}
          onChange={(e) => setNomeTurma(e.target.value)}
          placeholder="Nome da turma"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        />
        <button
          type="submit"
          disabled={carregando}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          {carregando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Buscar
        </button>
      </form>

      {erro && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {erro}
        </div>
      )}

      {resultados !== null && (
        <>
          <p className="text-xs text-slate-400">
            {resultados.length === 0
              ? "Nenhuma turma encontrada com esses critérios."
              : `${resultados.length} turma${resultados.length !== 1 ? "s" : ""} encontrada${resultados.length !== 1 ? "s" : ""}.`}
          </p>
          <div className="space-y-3">
            {resultados.map((t) => (
              <div
                key={t.codigo}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {t.nome_turma}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Prof. {t.nome_professor} · {new Date(t.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-lg font-bold tracking-widest text-indigo-700 dark:text-indigo-300">
                    {t.codigo}
                  </span>
                  <button
                    type="button"
                    onClick={() => copiarCodigo(t.codigo)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {copiado === t.codigo ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Cartão: Mensagem de contato
// ============================================================

function CartaoContato({
  contato,
  chave,
  onAtualizado,
}: {
  contato: Contato;
  chave: string;
  onAtualizado: (c: Contato) => void;
}) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function toggleLido() {
    setSalvando(true);
    setErro(null);
    try {
      const atualizado = await marcarContatoLido(contato.id, !contato.lido, chave);
      onAtualizado(atualizado);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm space-y-3 dark:bg-slate-800 ${
      contato.lido
        ? "border-slate-200 dark:border-slate-700"
        : "border-indigo-300 dark:border-indigo-600"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {contato.nome}
            </span>
            {!contato.lido && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                Novo
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <Mail className="h-3 w-3" />
            {contato.email}
          </p>
          {contato.telefone && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Phone className="h-3 w-3" />
              {contato.telefone}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {new Date(contato.criado_em).toLocaleDateString("pt-BR")}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {contato.mensagem}
      </p>

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={toggleLido}
          disabled={salvando}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
            contato.lido
              ? "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : contato.lido ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {contato.lido ? "Marcar como não lido" : "Marcar como lido"}
        </button>
        <a
          href={`mailto:${contato.email}?subject=Re: Contato via LUPA`}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          <Mail className="h-4 w-4" />
          Responder por e-mail
        </a>
        {erro && <span className="text-sm text-red-600">{erro}</span>}
      </div>
    </div>
  );
}

export default function PaginaModeracao() {
  const [chaveDigitada, setChaveDigitada] = useState("");
  const [chave, setChave] = useState("");
  const [autenticado, setAutenticado] = useState(false);

  const [aba, setAba] = useState<"boatos" | "sugestoes" | "turmas" | "avaliacoes" | "contatos">("boatos");

  const [boatos, setBoatos] = useState<Boato[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [sugestoes, setSugestoes] = useState<SugestaoInterno[]>([]);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [erroSugestoes, setErroSugestoes] = useState<string | null>(null);

  const [avaliacoes, setAvaliacoes] = useState<ValidacaoInterna[]>([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);
  const [erroAvaliacoes, setErroAvaliacoes] = useState<string | null>(null);

  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregandoContatos, setCarregandoContatos] = useState(false);
  const [erroContatos, setErroContatos] = useState<string | null>(null);

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

  const carregarSugestoes = useCallback(
    async (chaveAtual: string) => {
      setCarregandoSugestoes(true);
      setErroSugestoes(null);
      try {
        setSugestoes(await listarSugestoesInternas(chaveAtual));
      } catch {
        setErroSugestoes(
          "Não foi possível carregar as sugestões. Verifique se o servidor está no ar.",
        );
      } finally {
        setCarregandoSugestoes(false);
      }
    },
    [],
  );

  const carregarAvaliacoes = useCallback(async (chaveAtual: string) => {
    setCarregandoAvaliacoes(true);
    setErroAvaliacoes(null);
    try {
      setAvaliacoes(await listarValidacoes(chaveAtual));
    } catch {
      setErroAvaliacoes(
        "Não foi possível carregar as avaliações. Verifique se o servidor está no ar.",
      );
    } finally {
      setCarregandoAvaliacoes(false);
    }
  }, []);

  const carregarContatos = useCallback(async (chaveAtual: string) => {
    setCarregandoContatos(true);
    setErroContatos(null);
    try {
      setContatos(await listarContatos(chaveAtual));
    } catch {
      setErroContatos(
        "Não foi possível carregar os contatos. Verifique se o servidor está no ar.",
      );
    } finally {
      setCarregandoContatos(false);
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      carregar();
      carregarSugestoes(chave);
      carregarAvaliacoes(chave);
      carregarContatos(chave);
    }
  }, [autenticado, carregar, carregarSugestoes, carregarAvaliacoes, carregarContatos, chave]);

  function entrar(e: { preventDefault(): void }) {
    e.preventDefault();
    if (chaveDigitada.trim()) {
      setChave(chaveDigitada.trim());
      setAutenticado(true);
    }
  }

  function onAtualizadoBoato(atualizado: Boato) {
    setBoatos((prev) =>
      prev.map((b) => (b.id === atualizado.id ? atualizado : b)),
    );
  }

  function onAtualizadoSugestao(atualizado: SugestaoInterno) {
    setSugestoes((prev) =>
      prev.map((s) => (s.id === atualizado.id ? atualizado : s)),
    );
  }

  function onAtualizadaAvaliacao(atualizada: ValidacaoInterna) {
    setAvaliacoes((prev) =>
      prev.map((a) => (a.id === atualizada.id ? atualizada : a)),
    );
  }

  function onAtualizadoContato(atualizado: Contato) {
    setContatos((prev) =>
      prev.map((c) => (c.id === atualizado.id ? atualizado : c)),
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
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Painel de Moderação
            </h1>
          </div>
        </header>

        {/* Abas */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setAba("boatos")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              aba === "boatos"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Boatos ({boatos.length})
          </button>
          <button
            onClick={() => setAba("sugestoes")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              aba === "sugestoes"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Sugestões ({sugestoes.length})
          </button>
          <button
            onClick={() => setAba("turmas")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              aba === "turmas"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Turmas
          </button>
          <button
            onClick={() => setAba("avaliacoes")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              aba === "avaliacoes"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Avaliações ({avaliacoes.length})
          </button>
          <button
            onClick={() => setAba("contatos")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              aba === "contatos"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Contatos
            {contatos.filter((c) => !c.lido).length > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                aba === "contatos" ? "bg-white/20 text-white" : "bg-rose-500 text-white"
              }`}>
                {contatos.filter((c) => !c.lido).length}
              </span>
            )}
          </button>
        </div>

        {/* Aba: Boatos */}
        {aba === "boatos" && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {boatos.length} boato{boatos.length !== 1 ? "s" : ""} registrado
              {boatos.length !== 1 ? "s" : ""}. Atualize o status e publique as checagens.
            </p>
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
                  onAtualizado={onAtualizadoBoato}
                />
              ))}
            </div>
          </>
        )}

        {/* Aba: Turmas */}
        {aba === "turmas" && <SecaoBuscarTurmas chave={chave} />}

        {/* Aba: Avaliações */}
        {aba === "avaliacoes" && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? "ões" : ""} recebida
              {avaliacoes.length !== 1 ? "s" : ""}.{" "}
              {avaliacoes.filter((a) => a.aprovado).length} depoimento
              {avaliacoes.filter((a) => a.aprovado).length !== 1 ? "s" : ""} aprovado
              {avaliacoes.filter((a) => a.aprovado).length !== 1 ? "s" : ""}.
            </p>
            {carregandoAvaliacoes && (
              <p className="text-sm text-slate-500">Carregando avaliações…</p>
            )}
            {erroAvaliacoes && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {erroAvaliacoes}
              </div>
            )}
            {!carregandoAvaliacoes && !erroAvaliacoes && avaliacoes.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma avaliação recebida ainda.
              </p>
            )}
            <div className="space-y-4">
              {avaliacoes.map((a) => (
                <CartaoAvaliacao
                  key={a.id}
                  avaliacao={a}
                  chave={chave}
                  onAtualizado={onAtualizadaAvaliacao}
                />
              ))}
            </div>
          </>
        )}

        {/* Aba: Sugestões */}
        {aba === "sugestoes" && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {sugestoes.length} sugestão{sugestoes.length !== 1 ? "ões" : ""} recebida
              {sugestoes.length !== 1 ? "s" : ""}. Escreva e publique respostas.
            </p>
            {carregandoSugestoes && (
              <p className="text-sm text-slate-500">Carregando sugestões…</p>
            )}
            {erroSugestoes && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {erroSugestoes}
              </div>
            )}
            {!carregandoSugestoes && !erroSugestoes && sugestoes.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma sugestão recebida ainda.
              </p>
            )}
            <div className="space-y-4">
              {sugestoes.map((s) => (
                <CartaoSugestao
                  key={s.id}
                  sugestao={s}
                  chave={chave}
                  onAtualizado={onAtualizadoSugestao}
                />
              ))}
            </div>
          </>
        )}

        {/* Aba: Contatos */}
        {aba === "contatos" && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {contatos.length} mensagem{contatos.length !== 1 ? "s" : ""} recebida
              {contatos.length !== 1 ? "s" : ""}.{" "}
              {contatos.filter((c) => !c.lido).length > 0 && (
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {contatos.filter((c) => !c.lido).length} não lida
                  {contatos.filter((c) => !c.lido).length !== 1 ? "s" : ""}.
                </span>
              )}
            </p>
            {carregandoContatos && (
              <p className="text-sm text-slate-500">Carregando contatos…</p>
            )}
            {erroContatos && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {erroContatos}
              </div>
            )}
            {!carregandoContatos && !erroContatos && contatos.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma mensagem de contato recebida ainda.
              </p>
            )}
            <div className="space-y-4">
              {contatos.map((c) => (
                <CartaoContato
                  key={c.id}
                  contato={c}
                  chave={chave}
                  onAtualizado={onAtualizadoContato}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
