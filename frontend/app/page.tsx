"use client";

/**
 * Página principal do LUPA — visual "amigável educativo".
 *
 * A tela tem 3 estados:
 *   - "formulario" : campo de URL + botão Analisar
 *   - "carregando" : animação enquanto o backend processa
 *   - "resultado"  : pontuação, cor, resumo e justificativas
 */

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CircleAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Info,
  FileText,
  BookOpen,
  Link2,
  Upload,
  FileVideo,
  FileImage,
  X,
  Lightbulb,
  Library,
  ExternalLink,
  Download,
  Loader2,
  MapPin,
  Camera,
  CalendarDays,
  Cpu,
} from "lucide-react";
import { analisarImagem, analisarTexto, analisarUpload, analisarUrl } from "@/lib/api";
import type { FonteWeb, Justificativa, RespostaAnalise, RespostaImagem } from "@/lib/types";
import { salvarAnalise } from "@/lib/historico";
import { registrarReset } from "@/lib/resetHome";

type Estado = "formulario" | "carregando" | "resultado";
type Aba = "url" | "upload" | "imagem" | "texto";

type ResultadoEstado =
  | { tipo: "analise"; dados: RespostaAnalise }
  | { tipo: "texto"; dados: RespostaAnalise }
  | { tipo: "imagem"; dados: RespostaImagem[] }
  | null;

// Links usados nos botões "Ver exemplo" — ajudam o usuário a entender
// como o LUPA se comporta em conteúdos de perfis bem diferentes.
const EXEMPLOS_URL = {
  confiavel: "https://www.bbc.com/portuguese",
  suspeito: "https://www.boatos.org",
};

/**
 * Converte mensagens técnicas vindas do backend em frases
 * compreensíveis para quem não é desenvolvedor.
 */
function traduzirErro(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("429") || m.includes("rate limit") || m.includes("too many")) {
    return "Você fez muitas análises seguidas. Aguarde alguns minutos e tente de novo.";
  }
  if (m.includes("413") || m.includes("maior que o limite de 100")) {
    return "O arquivo é maior que o limite de 100 MB.";
  }
  if (m.includes("maior que o limite de 10")) {
    return "A imagem é maior que o limite de 10 MB. Reduza o tamanho e tente novamente.";
  }
  if (m.includes("formato não suportado") && m.includes("jpg")) {
    return "Formato não aceito. Use JPG, PNG, WEBP, GIF, BMP ou TIFF.";
  }
  if (m.includes("formato não suportado")) {
    return "Formato de arquivo não aceito. Use MP4, MOV, AVI, MKV ou WEBM.";
  }
  if (m.includes("failed to fetch") || m.includes("networkerror")) {
    return "Não foi possível falar com o servidor. Verifique sua conexão.";
  }
  if (m.includes("500") || m.includes("erro inesperado")) {
    return "O servidor teve um problema ao analisar. Tente novamente em instantes.";
  }
  return mensagem;
}

export default function Home() {
  const [estado, setEstado] = useState<Estado>("formulario");
  const [aba, setAba] = useState<Aba>("url");
  const [url, setUrl] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [imagensArquivos, setImagensArquivos] = useState<File[]>([]);
  const [imagemContexto, setImagemContexto] = useState("");
  const [textoConteudo, setTextoConteudo] = useState("");
  const [textoOrigem, setTextoOrigem] = useState("");
  const [textoSuspeita, setTextoSuspeita] = useState("");
  const [contexto, setContexto] = useState("");
  const [resultado, setResultado] = useState<ResultadoEstado>(null);
  const [erro, setErro] = useState<string | null>(null);

  function reiniciar() {
    setResultado(null);
    setUrl("");
    setArquivo(null);
    setImagensArquivos([]);
    setImagemContexto("");
    setTextoConteudo("");
    setTextoOrigem("");
    setTextoSuspeita("");
    setContexto("");
    setErro(null);
    setEstado("formulario");
  }

  // Registra a função de reinício para que a navbar possa chamá-la
  // quando o usuário clica em "Início" ou no logo já estando nesta página.
  useEffect(() => {
    registrarReset(reiniciar);
  });

  async function aoEnviarUrl(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEstado("carregando");
    try {
      const dados = await analisarUrl(url);
      salvarAnalise(dados);
      setResultado({ tipo: "analise", dados });
      setEstado("resultado");
    } catch (e) {
      setErro(traduzirErro(e instanceof Error ? e.message : "Erro desconhecido"));
      setEstado("formulario");
    }
  }

  async function aoEnviarUpload(evento: React.FormEvent) {
    evento.preventDefault();
    if (!arquivo) return;
    setErro(null);
    setEstado("carregando");
    try {
      const dados = await analisarUpload(arquivo, contexto);
      salvarAnalise(dados);
      setResultado({ tipo: "analise", dados });
      setEstado("resultado");
    } catch (e) {
      setErro(traduzirErro(e instanceof Error ? e.message : "Erro desconhecido"));
      setEstado("formulario");
    }
  }

  async function aoEnviarImagem(evento: React.FormEvent) {
    evento.preventDefault();
    if (imagensArquivos.length === 0) return;
    setErro(null);
    setEstado("carregando");
    try {
      const dados = await Promise.all(
        imagensArquivos.map((arq) => analisarImagem(arq, imagemContexto))
      );
      setResultado({ tipo: "imagem", dados });
      setEstado("resultado");
    } catch (e) {
      setErro(traduzirErro(e instanceof Error ? e.message : "Erro desconhecido"));
      setEstado("formulario");
    }
  }

  async function aoEnviarTexto(evento: React.FormEvent) {
    evento.preventDefault();
    if (!textoConteudo.trim()) return;
    setErro(null);
    setEstado("carregando");
    try {
      const dados = await analisarTexto(textoConteudo, textoOrigem, textoSuspeita);
      salvarAnalise(dados);
      setResultado({ tipo: "texto", dados });
      setEstado("resultado");
    } catch (e) {
      setErro(traduzirErro(e instanceof Error ? e.message : "Erro desconhecido"));
      setEstado("formulario");
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Cabecalho />

        {estado === "formulario" && (
          <>
            <SeletorAba aba={aba} setAba={setAba} />
            {aba === "url" && (
              <Formulario
                url={url}
                setUrl={setUrl}
                aoEnviar={aoEnviarUrl}
                erro={erro}
              />
            )}
            {aba === "upload" && (
              <FormularioUpload
                arquivo={arquivo}
                setArquivo={setArquivo}
                contexto={contexto}
                setContexto={setContexto}
                aoEnviar={aoEnviarUpload}
                erro={erro}
              />
            )}
            {aba === "imagem" && (
              <FormularioImagem
                arquivos={imagensArquivos}
                setArquivos={setImagensArquivos}
                contexto={imagemContexto}
                setContexto={setImagemContexto}
                aoEnviar={aoEnviarImagem}
                erro={erro}
              />
            )}
            {aba === "texto" && (
              <FormularioTexto
                texto={textoConteudo}
                setTexto={setTextoConteudo}
                origem={textoOrigem}
                setOrigem={setTextoOrigem}
                suspeita={textoSuspeita}
                setSuspeita={setTextoSuspeita}
                aoEnviar={aoEnviarTexto}
                erro={erro}
              />
            )}
          </>
        )}

        {estado === "carregando" && <Carregando />}

        {estado === "resultado" && resultado && (
          resultado.tipo === "imagem"
            ? <ResultadoImagem dados={resultado.dados} aoReiniciar={reiniciar} />
            : <Resultado
                dados={resultado.dados}
                aoReiniciar={reiniciar}
                modoTexto={resultado.tipo === "texto"}
              />
        )}

        <Rodape />
      </div>
    </main>
  );
}

// ============================================================
// Componentes auxiliares
// ============================================================

function Cabecalho() {
  return (
    <header className="mb-10 text-center animate-fade-in-up">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
        <Search className="h-8 w-8 text-white" strokeWidth={2.5} />
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        LUPA
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        Leitor de URLs, Plataformas e Audiovisuais
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Apoio à checagem de confiabilidade de conteúdos digitais.
      </p>
    </header>
  );
}

type FormularioProps = {
  url: string;
  setUrl: (v: string) => void;
  aoEnviar: (e: React.FormEvent) => void;
  erro: string | null;
};

function Formulario({ url, setUrl, aoEnviar, erro }: FormularioProps) {
  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8">
      <form onSubmit={aoEnviar} className="space-y-4">
        <label
          htmlFor="url"
          className="flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Cole aqui um link de site ou vídeo do YouTube
        </label>

        <div className="relative">
          <input
            id="url"
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com/noticia ou https://youtu.be/..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <button
          type="submit"
          className="group w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4 transition group-hover:rotate-12" />
            Analisar
          </span>
        </button>

        {/* Atalhos para experimentar sem pensar em qual link usar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
          <span>Sem link à mão?</span>
          <button
            type="button"
            onClick={() => setUrl(EXEMPLOS_URL.confiavel)}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            Exemplo confiável
          </button>
          <button
            type="button"
            onClick={() => setUrl(EXEMPLOS_URL.suspeito)}
            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700 transition hover:bg-amber-100"
          >
            Exemplo para cruzar fontes
          </button>
        </div>

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{erro}</p>
          </div>
        )}
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>Atenção:</strong> o LUPA não afirma verdade absoluta. Ele
          aponta sinais de confiabilidade e risco, como apoio ao seu
          pensamento crítico.
        </p>
      </div>
    </section>
  );
}

type SeletorAbaProps = {
  aba: Aba;
  setAba: (v: Aba) => void;
};

function SeletorAba({ aba, setAba }: SeletorAbaProps) {
  return (
    <div className="mb-4 flex gap-1.5 rounded-2xl border border-slate-200/60 bg-white/60 p-1.5 shadow-sm backdrop-blur-sm">
      <BotaoAba
        ativa={aba === "url"}
        onClick={() => setAba("url")}
        icone={<Link2 className="h-4 w-4" />}
        rotulo="Link"
      />
      <BotaoAba
        ativa={aba === "upload"}
        onClick={() => setAba("upload")}
        icone={<FileVideo className="h-4 w-4" />}
        rotulo="Vídeo"
      />
      <BotaoAba
        ativa={aba === "imagem"}
        onClick={() => setAba("imagem")}
        icone={<FileImage className="h-4 w-4" />}
        rotulo="Imagem"
      />
      <BotaoAba
        ativa={aba === "texto"}
        onClick={() => setAba("texto")}
        icone={<FileText className="h-4 w-4" />}
        rotulo="Texto"
      />
    </div>
  );
}

function BotaoAba({
  ativa,
  onClick,
  icone,
  rotulo,
}: {
  ativa: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  rotulo: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        ativa
          ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icone}
      {rotulo}
    </button>
  );
}

type FormularioUploadProps = {
  arquivo: File | null;
  setArquivo: (a: File | null) => void;
  contexto: string;
  setContexto: (v: string) => void;
  aoEnviar: (e: React.FormEvent) => void;
  erro: string | null;
};

function FormularioUpload({
  arquivo,
  setArquivo,
  contexto,
  setContexto,
  aoEnviar,
  erro,
}: FormularioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  function aoSoltar(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setArrastando(false);
    const primeiro = e.dataTransfer.files?.[0];
    if (primeiro) setArquivo(primeiro);
  }

  function formatarTamanho(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8">
      <form onSubmit={aoEnviar} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Envie um vídeo para análise
        </label>

        {/* Área de arrastar e soltar */}
        {!arquivo ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={aoSoltar}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
              arrastando
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
            }`}
          >
            <Upload className="h-10 w-10 text-indigo-500" strokeWidth={1.5} />
            <p className="font-medium text-slate-700">
              Arraste um vídeo aqui ou clique para escolher
            </p>
            <p className="text-xs text-slate-500">
              Formatos: MP4, MOV, AVI, MKV, WEBM — até 100 MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".mp4,.mov,.avi,.mkv,.webm"
              className="hidden"
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100">
              <FileVideo className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {arquivo.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatarTamanho(arquivo.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setArquivo(null)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
              title="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Campo de contexto opcional */}
        <div>
          <label
            htmlFor="contexto"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Qual a sua suspeita sobre este vídeo? (opcional)
          </label>
          <textarea
            id="contexto"
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Ex.: Acho que as imagens não correspondem ao que a legenda diz. O vídeo parece antigo mas está sendo compartilhado como atual..."
            rows={3}
            className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={!arquivo}
          className="group w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4 transition group-hover:rotate-12" />
            Analisar vídeo
          </span>
        </button>

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{erro}</p>
          </div>
        )}
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>Importante:</strong> o arquivo é apagado do servidor após
          a análise — nada fica armazenado. Nesta versão ainda não
          transcrevemos o áudio, então a análise é mais limitada que a de
          links.
        </p>
      </div>
    </section>
  );
}

function Carregando() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-12 text-center shadow-xl shadow-indigo-100/50 backdrop-blur-sm"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-rose-100">
        <Sparkles className="h-8 w-8 text-indigo-600" />
      </div>

      <p className="text-lg font-medium text-slate-800">
        Analisando seu conteúdo
      </p>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        <span
          className="loading-dot h-2.5 w-2.5 rounded-full bg-indigo-500"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="loading-dot h-2.5 w-2.5 rounded-full bg-indigo-500"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="loading-dot h-2.5 w-2.5 rounded-full bg-indigo-500"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Isso pode levar alguns segundos.
      </p>
    </section>
  );
}

// ── Sugestões de verificação para análise de texto ────────────────────────────

const SUGESTOES_POR_CRITERIO: Record<string, string> = {
  "Linguagem sensacionalista":
    "O tom alarmista pode nos fazer compartilhar antes de pensar. Leia o mesmo fato em outro veículo de comunicação para comparar.",
  "Fontes e atribuições":
    "Identifique quem exatamente faz essas afirmações: nome completo, cargo e instituição. Fontes vagas (\"especialistas dizem\") são impossíveis de verificar.",
  "Apelo emocional":
    "Textos que geram urgência, medo ou raiva nos fazem agir sem refletir. Pause e verifique antes de repassar para outras pessoas.",
  "Afirmações verificáveis":
    "Faltam detalhes concretos como datas, nomes e locais. Procure a versão completa em um veículo com autoria identificada.",
  "Consistência interna":
    "O texto apresenta pontos que se contradizem. Leia com atenção e compare com outras versões do mesmo assunto.",
  "Objetividade da linguagem":
    "A linguagem carregada pode estar conduzindo sua conclusão antes da análise dos fatos. Compare com textos sobre o mesmo tema em fontes diferentes.",
};

const SUGESTOES_UNIVERSAIS = [
  "Busque o mesmo assunto em ao menos uma fonte independente (ex: G1, BBC Brasil, Reuters).",
  "Verifique em agências de checagem se já analisaram este tema: Aos Fatos (aosfatos.org) e Agência Lupa (lupa.uol.com.br).",
  "Se é um título ou trecho curto, leia o texto completo antes de compartilhar — títulos costumam simplificar ou omitir contexto importante.",
];

function DicasVerificacao({
  justificativas,
  pontuacao,
}: {
  justificativas: Justificativa[];
  pontuacao: number;
}) {
  const sugestoes: string[] = [];

  for (const j of justificativas) {
    if (j.impacto < 0) {
      const s = SUGESTOES_POR_CRITERIO[j.criterio];
      if (s && !sugestoes.includes(s)) sugestoes.push(s);
    }
  }

  for (const s of SUGESTOES_UNIVERSAIS) {
    if (sugestoes.length >= 4) break;
    if (!sugestoes.includes(s)) sugestoes.push(s);
  }

  const intro =
    pontuacao >= 71
      ? "Boa pontuação — ainda assim, confirme o conteúdo antes de compartilhar:"
      : pontuacao >= 31
      ? "Para aumentar sua confiança neste texto:"
      : "Este texto tem vários sinais de alerta. Antes de compartilhar:";

  return (
    <div
      className="animate-fade-in-up rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg shadow-indigo-100/30"
      style={{ animationDelay: "0.35s" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
          <Search className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Como verificar este texto
        </h3>
      </div>
      <p className="mb-3 text-sm text-slate-600">{intro}</p>
      <ul className="space-y-2.5">
        {sugestoes.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ResultadoProps = {
  dados: RespostaAnalise;
  aoReiniciar: () => void;
  modoTexto?: boolean;
};

function Resultado({ dados, aoReiniciar, modoTexto = false }: ResultadoProps) {
  const cartaoRef = useRef<HTMLDivElement>(null);
  const [baixando, setBaixando] = useState(false);

  async function baixarImagem() {
    if (!cartaoRef.current) return;
    setBaixando(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cartaoRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `lupa-${dados.pontuacao}pts.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silencia erros de captura sem travar a UI
    } finally {
      setBaixando(false);
    }
  }

  const IconeClassificacao =
    dados.pontuacao >= 71
      ? ShieldCheck
      : dados.pontuacao >= 31
      ? AlertTriangle
      : CircleAlert;

  // Em cartões amarelos (faixa "Requer Atenção") texto branco tem
  // contraste insuficiente (falha WCAG AA). Usamos texto escuro.
  const faixaAmarela = dados.pontuacao >= 31 && dados.pontuacao <= 70;
  const corTextoCartao = faixaAmarela ? "text-slate-900" : "text-white";

  return (
    <section
      aria-live="polite"
      aria-label="Resultado da análise"
      className="space-y-5"
    >
      {/* Cartão principal com pontuação */}
      <div
        ref={cartaoRef}
        className={`animate-fade-in-up overflow-hidden rounded-3xl p-8 shadow-2xl ${corTextoCartao}`}
        style={{
          background: `linear-gradient(135deg, ${dados.cor} 0%, ${dados.cor}dd 100%)`,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-90">
              <IconeClassificacao className="h-4 w-4" aria-hidden="true" />
              Classificação
            </p>
            <h2 className="mt-1 text-3xl font-bold">{dados.classificacao}</h2>
          </div>
          <IconeClassificacao className="h-12 w-12 opacity-30" aria-hidden="true" />
        </div>

        <div className="mt-8 flex items-baseline gap-2">
          <p className="text-7xl font-bold leading-none" aria-label={`Pontuação ${dados.pontuacao} de 100`}>
            {dados.pontuacao}
          </p>
          <p className="text-lg opacity-80" aria-hidden="true">/ 100</p>
        </div>

        {/* Fonte analisada e aviso — aparecem na imagem baixada */}
        <div className="mt-6 border-t border-white/20 pt-4">
          {dados.titulo_pagina && (
            <p className="truncate text-sm font-semibold opacity-95">
              {dados.titulo_pagina}
            </p>
          )}
          <p className="mt-0.5 truncate text-xs opacity-70">{dados.url}</p>
          <p className="mt-3 text-xs leading-relaxed opacity-60">
            ⚠️ Esta análise é um apoio à checagem e não constitui julgamento
            definitivo sobre a veracidade do conteúdo. Verifique sempre em
            fontes e agências de fact-checking especializadas.
          </p>
          <p className="mt-2 text-xs opacity-40">lupa.vercel.app</p>
        </div>
      </div>

      {/* Informações da página */}
      <div
        className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-sm"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {modoTexto ? "Conteúdo analisado" : "URL analisada"}
        </p>
        <p className="mt-1 break-all text-sm text-slate-800">{dados.url}</p>
        {dados.titulo_pagina && (
          <>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
              Título da página
            </p>
            <p className="mt-1 text-sm text-slate-800">{dados.titulo_pagina}</p>
          </>
        )}
      </div>

      {/* Resumo (se disponível) */}
      {dados.resumo && (
        <div
          className="animate-fade-in-up rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg shadow-indigo-100/30"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Resumo do conteúdo
            </h3>
          </div>
          <p className="mb-3 text-xs italic text-slate-500">
            Gerado por IA — apenas descreve, não avalia.
          </p>
          <p className="leading-relaxed text-slate-700">{dados.resumo}</p>
        </div>
      )}

      {/* O que a web diz — só aparece na análise de texto com resultados */}
      {modoTexto && (dados.fontes_web ?? []).length > 0 && (
        <SecaoFontesWeb fontes={dados.fontes_web} />
      )}

      {/* Dicas personalizadas (se houver) */}
      {(dados.dicas_personalizadas ?? []).length > 0 && (
        <div
          className="animate-fade-in-up rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg shadow-amber-100/30"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Dicas para esta análise
            </h3>
          </div>
          <ul className="space-y-2">
            {dados.dicas_personalizadas!.map((dica, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                <span className="leading-relaxed">{dica}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fontes sugeridas para cruzar (se houver) */}
      {(dados.fontes_sugeridas ?? []).length > 0 && (
        <div
          className="animate-fade-in-up rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg shadow-emerald-100/30"
          style={{ animationDelay: "0.28s" }}
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Library className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Fontes sugeridas para cruzar
            </h3>
          </div>
          <p className="mb-4 text-xs italic text-slate-500">
            Consultar mais de uma fonte é a melhor forma de checar informações.
          </p>
          <ul className="space-y-2">
            {dados.fontes_sugeridas!.map((fonte, i) => (
              <li key={i}>
                <a
                  href={fonte.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 group-hover:text-emerald-700">
                        {fonte.nome}
                      </p>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-emerald-600" />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {fonte.descricao}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Justificativas */}
      <div
        className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-sm"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
            <BookOpen className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Como chegamos nessa pontuação
          </h3>
        </div>

        <ul className="space-y-3">
          {dados.justificativas.map((j, i) => {
            const IconeImpacto =
              j.impacto > 0
                ? CheckCircle2
                : j.impacto < 0
                ? XCircle
                : Info;
            const corImpacto =
              j.impacto > 0
                ? "text-emerald-600 bg-emerald-50"
                : j.impacto < 0
                ? "text-red-600 bg-red-50"
                : "text-slate-500 bg-slate-100";
            const corTexto =
              j.impacto > 0
                ? "text-emerald-700 bg-emerald-100"
                : j.impacto < 0
                ? "text-red-700 bg-red-100"
                : "text-slate-700 bg-slate-100";

            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-slate-200 hover:shadow-sm"
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${corImpacto}`}
                >
                  <IconeImpacto className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900">{j.criterio}</p>
                    <span
                      className={`flex-shrink-0 rounded-lg px-2 py-0.5 text-xs font-mono font-semibold ${corTexto}`}
                    >
                      {j.impacto >= 0 ? `+${j.impacto}` : j.impacto}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{j.resultado}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sugestões de verificação — só para análise de texto */}
      {modoTexto && (
        <DicasVerificacao
          justificativas={dados.justificativas}
          pontuacao={dados.pontuacao}
        />
      )}

      {/* Botões de ação */}
      <div className="animate-fade-in-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.4s" }}>
        <button
          onClick={baixarImagem}
          disabled={baixando}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          {baixando
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Download className="h-4 w-4" />}
          {baixando ? "Gerando…" : "Baixar como imagem"}
        </button>
        <button
          onClick={aoReiniciar}
          className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4 transition group-hover:-rotate-180" />
          Analisar novo conteúdo
        </button>
      </div>
    </section>
  );
}

// ── Formulário de texto ───────────────────────────────────────────────────────

const ORIGENS_TEXTO = [
  { valor: "", rotulo: "Selecione (opcional)" },
  { valor: "WhatsApp", rotulo: "WhatsApp" },
  { valor: "Instagram", rotulo: "Instagram" },
  { valor: "X / Twitter", rotulo: "X / Twitter" },
  { valor: "Facebook", rotulo: "Facebook" },
  { valor: "TikTok", rotulo: "TikTok" },
  { valor: "E-mail", rotulo: "E-mail" },
  { valor: "Site", rotulo: "Site / Notícia" },
  { valor: "Outro", rotulo: "Outro" },
];

type FormularioTextoProps = {
  texto: string;
  setTexto: (v: string) => void;
  origem: string;
  setOrigem: (v: string) => void;
  suspeita: string;
  setSuspeita: (v: string) => void;
  aoEnviar: (e: React.FormEvent) => void;
  erro: string | null;
};

function FormularioTexto({ texto, setTexto, origem, setOrigem, suspeita, setSuspeita, aoEnviar, erro }: FormularioTextoProps) {
  const caracteres = texto.length;
  const LIMITE = 20_000;

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8">
      <form onSubmit={aoEnviar} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Cole aqui o texto que você quer verificar
        </label>

        <div className="relative">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Cole uma mensagem de WhatsApp, post do Instagram, trecho de notícia, corrente..."
            rows={7}
            maxLength={LIMITE}
            required
            className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
          <span className={`absolute bottom-3 right-4 text-xs ${caracteres > LIMITE * 0.9 ? "text-amber-600" : "text-slate-400"}`}>
            {caracteres.toLocaleString("pt-BR")} / {LIMITE.toLocaleString("pt-BR")}
          </span>
        </div>

        <div>
          <label htmlFor="origem-texto" className="mb-2 block text-sm font-medium text-slate-700">
            De onde vem esse texto? (opcional)
          </label>
          <select
            id="origem-texto"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            {ORIGENS_TEXTO.map((o) => (
              <option key={o.valor} value={o.valor}>{o.rotulo}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="suspeita-texto" className="mb-2 block text-sm font-medium text-slate-700">
            Por que você desconfia deste texto? (opcional)
          </label>
          <textarea
            id="suspeita-texto"
            value={suspeita}
            onChange={(e) => setSuspeita(e.target.value)}
            placeholder="Ex.: Acho que os números estão errados. Vi uma versão diferente circulando..."
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
          {suspeita.length > 0 && (
            <p className="mt-1 text-right text-xs text-slate-400">{suspeita.length}/500</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!texto.trim()}
          className="group w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4 transition group-hover:rotate-12" />
            Analisar texto
          </span>
        </button>

        {erro && (
          <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{erro}</p>
          </div>
        )}
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>Como funciona:</strong> a IA analisa o texto buscando sinais como linguagem
          sensacionalista, falta de fontes, apelo emocional excessivo e afirmações sem evidência.
          Ela não afirma se o conteúdo é verdadeiro — apenas aponta o que você deve checar.
        </p>
      </div>
    </section>
  );
}

// ── Formulário de imagem ──────────────────────────────────────────────────────

const _FORMATOS_IMAGEM = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"]);
const _LIMITE_IMAGEM_BYTES = 10 * 1024 * 1024; // 10 MB

type FormularioImagemProps = {
  arquivos: File[];
  setArquivos: (a: File[]) => void;
  contexto: string;
  setContexto: (v: string) => void;
  aoEnviar: (e: React.FormEvent) => void;
  erro: string | null;
};

function FormularioImagem({ arquivos, setArquivos, contexto, setContexto, aoEnviar, erro }: FormularioImagemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  function validar(arq: File): string | null {
    const ext = "." + (arq.name.split(".").pop() ?? "").toLowerCase();
    if (!_FORMATOS_IMAGEM.has(ext))
      return `"${arq.name}" não é um formato aceito. Use JPG, PNG, WEBP, GIF, BMP ou TIFF.`;
    if (arq.size > _LIMITE_IMAGEM_BYTES)
      return `"${arq.name}" excede o limite de 10 MB.`;
    return null;
  }

  function adicionarArquivos(novos: File[]) {
    setErroLocal(null);
    for (const arq of novos) {
      const erroVal = validar(arq);
      if (erroVal) { setErroLocal(erroVal); return; }
    }
    const existentes = new Set(arquivos.map((a) => a.name));
    const filtrados = novos.filter((a) => !existentes.has(a.name));
    setArquivos([...arquivos, ...filtrados].slice(0, 3));
  }

  function remover(nome: string) {
    setArquivos(arquivos.filter((a) => a.name !== nome));
  }

  function formatarTamanho(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-8">
      <form onSubmit={aoEnviar} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Envie até 3 imagens para análise
        </label>

        {/* Lista de arquivos já selecionados */}
        {arquivos.length > 0 && (
          <div className="space-y-2">
            {arquivos.map((arq, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                  <FileImage className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{arq.name}</p>
                  <p className="text-xs text-slate-500">{formatarTamanho(arq.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remover(arq.name)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                  title="Remover"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Zona de arrastar — visível enquanto houver espaço (menos de 3 arquivos) */}
        {arquivos.length < 3 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e) => { e.preventDefault(); setArrastando(false); adicionarArquivos(Array.from(e.dataTransfer.files)); }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
              arrastando
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
            }`}
          >
            <FileImage className="h-8 w-8 text-indigo-400" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">
              {arquivos.length === 0 ? "Arraste uma imagem ou clique para escolher" : "Adicionar outra imagem"}
            </p>
            <p className="text-xs text-slate-500">JPG, PNG, WEBP, GIF, BMP, TIFF — até 10 MB cada</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif"
              className="hidden"
              onChange={(e) => { adicionarArquivos(Array.from(e.target.files ?? [])); e.target.value = ""; }}
            />
          </div>
        )}

        {/* Campo de contexto / suspeita */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            O que você suspeita desta imagem?{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <textarea
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Ex: Acho que essa foto foi tirada em outro lugar e está sendo usada fora de contexto..."
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
          />
          <p className="text-xs text-slate-400">
            Se preenchido, a IA vai confrontar sua suspeita com o que observar na imagem.
          </p>
        </div>

        <button
          type="submit"
          disabled={arquivos.length === 0}
          className="group w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4 transition group-hover:rotate-12" />
            {arquivos.length > 1 ? `Analisar ${arquivos.length} imagens` : "Analisar imagem"}
          </span>
        </button>

        {erroLocal && (
          <div role="alert" className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{erroLocal}</p>
          </div>
        )}

        {erro && (
          <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{erro}</p>
          </div>
        )}
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>O que são metadados EXIF?</strong> São informações técnicas gravadas
          pela câmera quando a foto é tirada: data, modelo do dispositivo, software de
          edição e coordenadas GPS. Combinados com a análise visual da IA, ajudam a
          verificar a origem e a autenticidade de uma imagem.
        </p>
      </div>
    </section>
  );
}

// ── Resultado de imagem ───────────────────────────────────────────────────────

function CartaoImagem({ dados, indice, total }: { dados: RespostaImagem; indice: number; total: number }) {
  const corAlerta = (nivel: string) => {
    if (nivel === "alerta") return "border-red-200 bg-red-50 text-red-800";
    if (nivel === "aviso") return "border-amber-200 bg-amber-50 text-amber-800";
    return "border-blue-200 bg-blue-50 text-blue-800";
  };

  return (
    <div className="space-y-4">
      {/* Cartão principal */}
      <div className="animate-fade-in-up overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            {total > 1 && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider opacity-70">
                Imagem {indice + 1} de {total}
              </p>
            )}
            <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-90">
              <FileImage className="h-4 w-4" />
              Análise de imagem
            </p>
            <h2 className="mt-1 text-xl font-bold leading-tight break-all">
              {dados.nome_arquivo}
            </h2>
          </div>
          <FileImage className="h-12 w-12 opacity-20" aria-hidden="true" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-5 text-center text-sm">
          <div>
            <p className="opacity-70">Formato</p>
            <p className="mt-0.5 font-bold">{dados.formato}</p>
          </div>
          <div>
            <p className="opacity-70">Dimensões</p>
            <p className="mt-0.5 font-bold">{dados.largura}×{dados.altura}</p>
          </div>
          <div>
            <p className="opacity-70">Metadados</p>
            <p className="mt-0.5 font-bold">{dados.tem_exif ? "Presentes" : "Ausentes"}</p>
          </div>
        </div>
      </div>

      {/* Análise visual por IA */}
      {dados.analise_visual && (
        <div className="animate-fade-in-up rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100">
              <Sparkles className="h-4 w-4 text-violet-700" />
            </div>
            Análise visual por IA
          </h3>
          <div className="space-y-2 text-sm leading-relaxed text-slate-700">
            {dados.analise_visual.split("\n").filter(Boolean).map((paragrafo, i) => (
              <p key={i}>{paragrafo}</p>
            ))}
          </div>
          <p className="mt-3 text-xs italic text-slate-400">
            Análise gerada pelo Gemini. Indica indícios, não certezas absolutas.
          </p>
        </div>
      )}

      {/* Metadados EXIF */}
      {dados.tem_exif && (
        <div className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100">
              <Info className="h-4 w-4 text-teal-700" />
            </div>
            Metadados encontrados
          </h3>
          <dl className="space-y-3 text-sm">
            {dados.data_criacao && (
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <dt className="font-medium text-slate-500">Data de criação</dt>
                  <dd className="text-slate-800">{dados.data_criacao}</dd>
                </div>
              </div>
            )}
            {(dados.fabricante_camera || dados.modelo_camera) && (
              <div className="flex items-start gap-3">
                <Camera className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <dt className="font-medium text-slate-500">Câmera / dispositivo</dt>
                  <dd className="text-slate-800">
                    {[dados.fabricante_camera, dados.modelo_camera].filter(Boolean).join(" ")}
                  </dd>
                </div>
              </div>
            )}
            {dados.software && (
              <div className="flex items-start gap-3">
                <Cpu className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <dt className="font-medium text-slate-500">Software</dt>
                  <dd className="text-slate-800">{dados.software}</dd>
                </div>
              </div>
            )}
            {dados.tem_gps && dados.latitude !== null && dados.longitude !== null && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <dt className="font-medium text-slate-500">Coordenadas GPS</dt>
                  <dd className="text-slate-800">
                    {dados.latitude.toFixed(5)}, {dados.longitude.toFixed(5)}
                  </dd>
                  <dd>
                    <a
                      href={`https://maps.google.com/?q=${dados.latitude},${dados.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-teal-600 underline hover:text-teal-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver no Google Maps
                    </a>
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Alertas */}
      {dados.alertas.length > 0 && (
        <div className="animate-fade-in-up space-y-3">
          {dados.alertas.map((alerta, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${corAlerta(alerta.nivel)}`}
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p className="leading-relaxed">{alerta.mensagem}</p>
            </div>
          ))}
        </div>
      )}

      {/* Busca reversa */}
      <div className="animate-fade-in-up rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg">
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
            <Search className="h-4 w-4 text-emerald-700" />
          </div>
          Verificar a origem da imagem
        </h3>
        <p className="mb-4 text-xs italic text-slate-500">
          Envie a imagem a um destes serviços para descobrir onde ela aparece na internet.
        </p>
        <ul className="space-y-2">
          {dados.links_busca_reversa.map((link, i) => (
            <li key={i}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 group-hover:text-emerald-700">{link.nome}</p>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{link.descricao}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResultadoImagem({ dados, aoReiniciar }: { dados: RespostaImagem[]; aoReiniciar: () => void }) {
  return (
    <section aria-live="polite" aria-label="Resultado da análise de imagem" className="space-y-8">
      {dados.map((item, i) => (
        <CartaoImagem key={i} dados={item} indice={i} total={dados.length} />
      ))}

      {/* Botão voltar */}
      <div className="animate-fade-in-up">
        <button
          onClick={aoReiniciar}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4 transition group-hover:-rotate-180" />
          Analisar outro conteúdo
        </button>
      </div>
    </section>
  );
}

function SecaoFontesWeb({ fontes }: { fontes: FonteWeb[] }) {
  return (
    <div
      className="animate-fade-in-up rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-lg shadow-sky-100/30"
      style={{ animationDelay: "0.22s" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
          <Search className="h-5 w-5 text-sky-700" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          O que a web diz sobre este assunto
        </h3>
      </div>
      <p className="mb-4 text-xs italic text-slate-500">
        Artigos encontrados automaticamente. Leia as fontes antes de tirar conclusões.
      </p>
      <ul className="space-y-2">
        {fontes.map((fonte, i) => (
          <li key={i}>
            <a
              href={fonte.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-sky-200 hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 group-hover:text-sky-700 line-clamp-1">
                    {fonte.titulo}
                  </p>
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-sky-600" />
                </div>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{fonte.descricao}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Rodape() {
  return (
    <footer className="mt-12 text-center text-xs text-slate-500">
      <p>LUPA — Projeto educacional. O LUPA não afirma verdade absoluta: é apoio ao pensamento crítico.</p>
    </footer>
  );
}
