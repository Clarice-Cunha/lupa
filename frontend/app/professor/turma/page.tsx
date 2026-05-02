"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  LogIn,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  BarChart2,
  BookOpen,
  Link2,
  FileText,
  Video,
  Image as ImageIcon,
  Printer,
  Users,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { criarTurma, obterPainelTurma, type TurmaCriada, type PainelTurma } from "@/lib/api";

// ============================================================
// Tipos e helpers
// ============================================================

type Aba = "criar" | "acessar";

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function corPontuacao(pontuacao: number): string {
  if (pontuacao <= 30) return "text-red-700 bg-red-50";
  if (pontuacao <= 70) return "text-amber-700 bg-amber-50";
  return "text-emerald-700 bg-emerald-50";
}

function icone_tipo(tipo: string) {
  if (tipo === "url") return <Link2 className="h-4 w-4 text-indigo-500" />;
  if (tipo === "texto") return <FileText className="h-4 w-4 text-violet-500" />;
  if (tipo === "video") return <Video className="h-4 w-4 text-rose-500" />;
  return <ImageIcon className="h-4 w-4 text-cyan-500" />;
}

function labelTipo(tipo: string): string {
  const mapa: Record<string, string> = {
    url: "URL/YouTube",
    texto: "Texto",
    video: "Vídeo",
    imagem: "Imagem",
  };
  return mapa[tipo] ?? tipo;
}

// ============================================================
// Componente de cópia de texto
// ============================================================

function BotaoCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="ml-2 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
    >
      {copiado ? (
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
  );
}

// ============================================================
// Seção: Criar turma
// ============================================================

function SecaoCriarTurma() {
  const [nomeProfessor, setNomeProfessor] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [turma, setTurma] = useState<TurmaCriada | null>(null);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await criarTurma({ nome_professor: nomeProfessor, nome_turma: nomeTurma });
      setTurma(resultado);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar a turma.");
    } finally {
      setCarregando(false);
    }
  }

  if (turma) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <Check className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Turma criada com sucesso!</p>
        </div>

        {/* Código para os alunos */}
        <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Código da turma — compartilhe com os alunos
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-3xl font-bold tracking-widest text-indigo-700">
              {turma.codigo}
            </span>
            <BotaoCopiar texto={turma.codigo} />
          </div>
          <p className="mt-2 text-xs text-indigo-600">
            Os alunos digitam este código na página principal antes de fazer uma análise.
          </p>
        </div>

        {/* Chave de acesso — privada */}
        <div className="rounded-2xl border-2 border-amber-100 bg-amber-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Sua chave de acesso — só para você
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold tracking-wider text-amber-800">
              {turma.chave_acesso}
            </span>
            <BotaoCopiar texto={turma.chave_acesso} />
          </div>
          <div className="mt-2 flex items-start gap-2 text-xs text-amber-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Anote esta chave agora — ela <strong>não pode ser recuperada</strong> depois.
              Use-a para acessar o painel e ver as análises da turma.
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-700">{turma.nome_turma}</p>
          <p className="text-xs text-slate-500">Professor(a): {turma.nome_professor}</p>
        </div>

        <button
          type="button"
          onClick={() => setTurma(null)}
          className="text-sm text-indigo-600 underline underline-offset-2 hover:text-indigo-800"
        >
          Criar outra turma
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={aoEnviar} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Seu nome
        </label>
        <input
          type="text"
          required
          value={nomeProfessor}
          onChange={(e) => setNomeProfessor(e.target.value)}
          placeholder="Ex.: Ana Paula Silva"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Nome da turma
        </label>
        <input
          type="text"
          required
          value={nomeTurma}
          onChange={(e) => setNomeTurma(e.target.value)}
          placeholder="Ex.: 9ºB — E.M. João XXIII"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{erro}</p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {carregando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Criar turma
      </button>
    </form>
  );
}

// ============================================================
// Seção: Acessar painel
// ============================================================

function SecaoAcessarPainel() {
  const [codigo, setCodigo] = useState("");
  const [chave, setChave] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [painel, setPainel] = useState<PainelTurma | null>(null);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const dados = await obterPainelTurma(codigo.trim().toUpperCase(), chave.trim());
      setPainel(dados);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao acessar o painel.";
      if (msg.includes("401") || msg.toLowerCase().includes("chave")) {
        setErro("Chave de acesso incorreta. Verifique e tente de novo.");
      } else if (msg.includes("404") || msg.toLowerCase().includes("não encontrado")) {
        setErro("Código de turma não encontrado. Verifique se digitou corretamente.");
      } else {
        setErro(msg);
      }
    } finally {
      setCarregando(false);
    }
  }

  if (painel) {
    return <PainelView painel={painel} onVoltar={() => setPainel(null)} />;
  }

  return (
    <form onSubmit={aoEnviar} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Código da turma
        </label>
        <input
          type="text"
          required
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="Ex.: ABC123"
          maxLength={6}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 font-mono text-lg font-bold tracking-widest text-slate-800 placeholder:font-normal placeholder:text-base placeholder:tracking-normal placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Chave de acesso
        </label>
        <input
          type="password"
          required
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          placeholder="A chave gerada quando você criou a turma"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{erro}</p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {carregando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Acessar painel
      </button>
    </form>
  );
}

// ============================================================
// Painel com as análises da turma
// ============================================================

function PainelView({
  painel,
  onVoltar,
}: {
  painel: PainelTurma;
  onVoltar: () => void;
}) {
  const suspeitas = painel.analises.filter((a) => a.pontuacao <= 30).length;
  const atencao = painel.analises.filter((a) => a.pontuacao > 30 && a.pontuacao <= 70).length;
  const confiaveis = painel.analises.filter((a) => a.pontuacao > 70).length;

  const porTipo: Record<string, number> = {};
  for (const a of painel.analises) {
    porTipo[a.tipo] = (porTipo[a.tipo] ?? 0) + 1;
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
        <button
          type="button"
          onClick={onVoltar}
          className="text-sm text-indigo-600 underline underline-offset-2 hover:text-indigo-800"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <Printer className="h-4 w-4" />
          Imprimir / salvar PDF
        </button>
      </div>

      {/* Identidade da turma */}
      <div className="rounded-2xl bg-indigo-600 px-6 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
          Painel da turma
        </p>
        <h2 className="mt-1 text-2xl font-bold">{painel.nome_turma}</h2>
        <p className="mt-0.5 text-sm text-indigo-200">
          Professor(a): {painel.nome_professor} · Código: {painel.codigo}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-800">{painel.total_analises}</p>
          <p className="mt-1 text-xs text-slate-500">Análises</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-800">
            {painel.media_pontuacao !== null ? painel.media_pontuacao : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Média</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <p className="text-3xl font-bold text-red-700">{suspeitas}</p>
          </div>
          <p className="mt-1 text-xs text-red-600">Suspeitos</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <p className="text-3xl font-bold text-emerald-700">{confiaveis}</p>
          </div>
          <p className="mt-1 text-xs text-emerald-600">Confiáveis</p>
        </div>
      </div>

      {/* Barra de distribuição */}
      {painel.total_analises > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Distribuição das classificações
          </p>
          <div className="flex h-4 overflow-hidden rounded-full">
            {suspeitas > 0 && (
              <div
                style={{ width: `${(suspeitas / painel.total_analises) * 100}%` }}
                className="bg-red-500"
                title={`Suspeito: ${suspeitas}`}
              />
            )}
            {atencao > 0 && (
              <div
                style={{ width: `${(atencao / painel.total_analises) * 100}%` }}
                className="bg-amber-400"
                title={`Requer Atenção: ${atencao}`}
              />
            )}
            {confiaveis > 0 && (
              <div
                style={{ width: `${(confiaveis / painel.total_analises) * 100}%` }}
                className="bg-emerald-500"
                title={`Confiável: ${confiaveis}`}
              />
            )}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Suspeito ({suspeitas})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Requer Atenção ({atencao})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Confiável ({confiaveis})
            </span>
          </div>
        </div>
      )}

      {/* Análises por tipo */}
      {Object.keys(porTipo).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">Por tipo de análise</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(porTipo).map(([tipo, qtd]) => (
              <span
                key={tipo}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {icone_tipo(tipo)}
                {labelTipo(tipo)}: {qtd}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de análises */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-700">
            Todas as análises ({painel.total_analises})
          </p>
        </div>

        {painel.total_analises === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            Nenhuma análise registrada ainda. Os alunos precisam digitar o código da turma
            na página principal antes de analisar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Pontuação</th>
                  <th className="px-4 py-3">Classificação</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Resumo</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {painel.analises.map((a, i) => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {painel.total_analises - i}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {icone_tipo(a.tipo)}
                        <span className="text-slate-700">{labelTipo(a.tipo)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-lg px-2.5 py-0.5 text-sm font-bold ${corPontuacao(a.pontuacao)}`}
                      >
                        {a.pontuacao}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{a.classificacao}</td>
                    <td className="px-4 py-3 hidden max-w-xs truncate text-xs text-slate-500 sm:table-cell">
                      {a.resumo ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatarData(a.criado_em)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Página principal
// ============================================================

export default function PaginaTurma() {
  const [aba, setAba] = useState<Aba>("criar");

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
            <GraduationCap className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Painel do Professor
          </h1>
          <p className="mt-2 text-slate-500">
            Crie uma turma, compartilhe o código com seus alunos e acompanhe as análises
            que eles fizeram em sala de aula.
          </p>
        </header>

        {/* Abas */}
        <div className="mb-6 flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setAba("criar")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
              aba === "criar"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Plus className="h-4 w-4" />
            Criar turma
          </button>
          <button
            type="button"
            onClick={() => setAba("acessar")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
              aba === "acessar"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Acessar painel
          </button>
        </div>

        {/* Conteúdo */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8">
          {aba === "criar" ? <SecaoCriarTurma /> : <SecaoAcessarPainel />}
        </div>

        {/* Instrução de uso */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-700">
            <BookOpen className="h-4 w-4" />
            Como funciona
          </p>
          <ol className="space-y-2 text-sm text-indigo-900">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
              Crie a turma aqui e anote o <strong>código</strong> (6 letras/números) e a <strong>chave de acesso</strong>.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
              Compartilhe o código com seus alunos. Cada aluno digita o código na{" "}
              <strong>página inicial</strong> antes de fazer uma análise.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
              Quando um aluno conclui a análise, o resultado é automaticamente registrado
              nesta turma.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">4</span>
              Use "Acessar painel" com o código + sua chave para ver o histórico completo.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
