"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  School,
  Building2,
  Landmark,
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  Loader2,
  Send,
  ChevronDown,
  Info,
  Map,
  LocateFixed,
  X,
} from "lucide-react";
import { listarBoatos, enviarBoato } from "@/lib/api";
import type { Boato, CategoriaBoato } from "@/lib/api";
import type { MarcadorBoato } from "@/components/MapaBoatos";

// Carrega o mapa apenas no cliente (Leaflet depende de `window`)
const MapaBoatos = dynamic(() => import("@/components/MapaBoatos"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  ),
});

// ============================================================
// Configurações de exibição
// ============================================================

const CONFIG_CATEGORIA: Record<
  CategoriaBoato,
  { rotulo: string; icone: React.ReactNode; cor: string }
> = {
  cidade: {
    rotulo: "Cidade / Prefeitura",
    icone: <Landmark className="h-3.5 w-3.5" />,
    cor: "bg-sky-100 text-sky-700 border-sky-200",
  },
  escola: {
    rotulo: "Escola",
    icone: <School className="h-3.5 w-3.5" />,
    cor: "bg-violet-100 text-violet-700 border-violet-200",
  },
  condominio: {
    rotulo: "Condomínio",
    icone: <Building2 className="h-3.5 w-3.5" />,
    cor: "bg-teal-100 text-teal-700 border-teal-200",
  },
};

const CONFIG_STATUS = {
  pendente: {
    rotulo: "Aguardando verificação",
    icone: <Clock className="h-3.5 w-3.5" />,
    cor: "bg-slate-100 text-slate-600 border-slate-200",
  },
  em_apuracao: {
    rotulo: "Em apuração",
    icone: <AlertCircle className="h-3.5 w-3.5" />,
    cor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  verificado_verdadeiro: {
    rotulo: "Verificado: verdadeiro",
    icone: <CheckCircle2 className="h-3.5 w-3.5" />,
    cor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  verificado_falso: {
    rotulo: "Boato refutado",
    icone: <XCircle className="h-3.5 w-3.5" />,
    cor: "bg-red-100 text-red-700 border-red-200",
  },
  inconclusivo: {
    rotulo: "Inconclusivo",
    icone: <HelpCircle className="h-3.5 w-3.5" />,
    cor: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

// ============================================================
// Componente de card de boato
// ============================================================

function CartaoBoato({ boato }: { boato: Boato }) {
  const catConf = CONFIG_CATEGORIA[boato.categoria];
  const stConf = CONFIG_STATUS[boato.status];
  const temResultado =
    boato.status === "verificado_verdadeiro" ||
    boato.status === "verificado_falso" ||
    boato.status === "inconclusivo";

  const data = new Date(boato.criado_em).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-md shadow-slate-100/40 backdrop-blur-sm overflow-hidden">
      {/* Cabeçalho do card */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${catConf.cor}`}
        >
          {catConf.icone}
          {catConf.rotulo}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${stConf.cor}`}
        >
          {stConf.icone}
          {stConf.rotulo}
        </span>
      </div>

      {/* Corpo */}
      <div className="px-5 pb-4 space-y-2.5">
        <div className="flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>{boato.localidade}</span>
        </div>

        <p className="text-sm leading-relaxed text-slate-700">{boato.descricao}</p>

        <p className="text-xs text-slate-400">{data}</p>
      </div>

      {/* Resultado da verificação (quando existe) */}
      {temResultado && boato.checagem && (
        <div
          className={`border-t px-5 py-3 text-sm ${
            boato.status === "verificado_falso"
              ? "bg-red-50 border-red-100"
              : boato.status === "verificado_verdadeiro"
              ? "bg-emerald-50 border-emerald-100"
              : "bg-orange-50 border-orange-100"
          }`}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Resultado da verificação
          </p>
          <p className="leading-relaxed text-slate-700">{boato.checagem}</p>
        </div>
      )}
    </article>
  );
}

// ============================================================
// Formulário de reporte
// ============================================================

function FormularioBoato({
  onSucesso,
  onCancelar,
}: {
  onSucesso: () => void;
  onCancelar: () => void;
}) {
  const [categoria, setCategoria] = useState<CategoriaBoato>("escola");
  const [localidade, setLocalidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapaAberto, setMapaAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!localidade.trim() || !descricao.trim()) return;
    setEnviando(true);
    setErro(null);
    try {
      await enviarBoato({
        categoria,
        localidade: localidade.trim(),
        descricao: descricao.trim(),
        contato: contato.trim() || undefined,
        latitude,
        longitude,
      });
      onSucesso();
    } catch (err) {
      const detalhe = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(`Erro ao enviar: ${detalhe}`);
    } finally {
      setEnviando(false);
    }
  }

  function limparLocalizacao() {
    setLatitude(null);
    setLongitude(null);
    setMapaAberto(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 space-y-4"
    >
      {/* Categoria */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaBoato)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="escola">Escola</option>
          <option value="cidade">Cidade / Prefeitura</option>
          <option value="condominio">Condomínio</option>
        </select>
      </div>

      {/* Localidade */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Onde está circulando? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={localidade}
          onChange={(e) => setLocalidade(e.target.value)}
          maxLength={200}
          required
          placeholder="Ex: Colégio Contemporâneo — Lagoa Nova, Natal/RN"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Marcar no mapa (opcional) */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Marcar no mapa{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          {latitude != null && longitude != null && (
            <button
              type="button"
              onClick={limparLocalizacao}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" />
              Remover pin
            </button>
          )}
        </div>

        {/* Confirmação de pin já definido */}
        {latitude != null && longitude != null ? (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <LocateFixed className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>
              Localização marcada: {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
            <button
              type="button"
              onClick={() => setMapaAberto((v) => !v)}
              className="ml-auto text-emerald-600 underline hover:text-emerald-800"
            >
              {mapaAberto ? "Fechar" : "Mover pin"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMapaAberto((v) => !v)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-white/70 py-2.5 text-sm text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            <Map className="h-4 w-4" />
            {mapaAberto ? "Fechar mapa" : "Clique aqui para marcar no mapa"}
          </button>
        )}

        {/* Mapa seletor */}
        {mapaAberto && (
          <div className="mt-2">
            <p className="mb-1.5 text-xs text-slate-500">
              Clique no mapa para marcar o local do boato. Clique novamente para
              mover o pin.
            </p>
            <MapaBoatos
              onSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              latSelecionado={latitude}
              lngSelecionado={longitude}
              altura="260px"
            />
          </div>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          O que está sendo dito? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={1000}
          required
          rows={4}
          placeholder="Cole aqui o boato, mensagem ou rumor que está circulando..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {descricao.length} / 1000
        </p>
      </div>

      {/* Contato opcional */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Contato para retorno{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
        </label>
        <input
          type="text"
          value={contato}
          onChange={(e) => setContato(e.target.value)}
          maxLength={200}
          placeholder="E-mail, telefone ou como preferir ser contatado"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1 text-xs text-slate-400">
          Sua denúncia é anônima. O contato é usado apenas para informar o resultado da verificação.
        </p>
      </div>

      {/* Erro */}
      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 border border-red-200">
          {erro}
        </p>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={enviando || !localidade.trim() || !descricao.trim()}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {enviando ? "Enviando..." : "Enviar denúncia"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ============================================================
// Página principal
// ============================================================

type Filtro = CategoriaBoato | "todos";

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "escola", rotulo: "Escola" },
  { valor: "cidade", rotulo: "Cidade / Prefeitura" },
  { valor: "condominio", rotulo: "Condomínio" },
];

export default function PaginaComunidade() {
  const [boatos, setBoatos] = useState<Boato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [formAberto, setFormAberto] = useState(false);
  const [sucessoEnvio, setSucessoEnvio] = useState(false);

  const carregarBoatos = useCallback(async () => {
    setCarregando(true);
    setErroLista(null);
    try {
      const dados = await listarBoatos(filtro === "todos" ? undefined : filtro);
      setBoatos(dados);
    } catch {
      setErroLista(
        "Não foi possível carregar os boatos. Verifique se o servidor está no ar."
      );
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregarBoatos();
  }, [carregarBoatos]);

  function handleSucesso() {
    setFormAberto(false);
    setSucessoEnvio(true);
    carregarBoatos();
    setTimeout(() => setSucessoEnvio(false), 6000);
  }

  // Filtra apenas os boatos que têm coordenadas para exibir no mapa
  const marcadores: MarcadorBoato[] = boatos
    .filter((b) => b.latitude != null && b.longitude != null)
    .map((b) => ({
      lat: b.latitude!,
      lng: b.longitude!,
      localidade: b.localidade,
      descricao: b.descricao,
      status: b.status,
    }));

  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Cabeçalho */}
        <header className="text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <MessageSquareWarning className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Portal Comunitário
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Reporte boatos que estão circulando na sua escola, cidade ou condomínio.
            A equipe investiga e publica o resultado aqui.
          </p>
        </header>

        {/* Como funciona */}
        <div
          className="animate-fade-in-up rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-900"
          style={{ animationDelay: "0.06s" }}
        >
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
            <div className="space-y-2">
              <p className="font-semibold">Como funciona?</p>
              <p className="text-indigo-700 leading-relaxed text-justify">
                Você reporta um boato que está circulando. A autoridade responsável — diretor(a)
                da escola, ouvidoria da prefeitura ou síndico(a) do condomínio — investiga
                usando os métodos de pesquisa que o próprio LUPA ensina. O resultado pode
                ficar disponível para toda a comunidade aqui no site, se a autoridade entender
                que a resposta seja de interesse da coletividade.
              </p>
              <p className="text-indigo-600 text-xs leading-relaxed text-justify border-t border-indigo-200 pt-2">
                <strong>Sobre o tempo de resposta:</strong> o LUPA recebe a denúncia e a encaminha
                à autoridade responsável com base no local indicado. O prazo de apuração e resposta
                depende exclusivamente de cada autoridade — o LUPA não tem controle sobre esse tempo.
              </p>
            </div>
          </div>
        </div>

        {/* Botão / formulário de reporte */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {sucessoEnvio && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              Denúncia enviada com sucesso! A equipe responsável irá apurar o boato.
            </div>
          )}

          {formAberto ? (
            <FormularioBoato
              onSucesso={handleSucesso}
              onCancelar={() => setFormAberto(false)}
            />
          ) : (
            <button
              onClick={() => setFormAberto(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 bg-white/60 py-4 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              <ChevronDown className="h-4 w-4" />
              Reportar um boato circulando na minha comunidade
            </button>
          )}
        </div>

        {/* Mapa de casos */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.13s" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Map className="h-5 w-5 text-slate-500" />
            <h2 className="text-xl font-bold text-slate-900">Mapa dos casos</h2>
          </div>

          {!carregando && marcadores.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-400">
              <MapPin className="h-7 w-7 text-slate-300" />
              <p>Nenhum caso com localização marcada ainda.</p>
              <p className="text-xs">
                Ao reportar um boato, você pode marcar o local no mapa.
              </p>
            </div>
          ) : (
            !carregando && (
              <MapaBoatos marcadores={marcadores} altura="360px" />
            )
          )}
        </div>

        {/* Divisor */}
        <div className="border-t border-slate-200" />

        {/* Filtros */}
        <div
          className="animate-fade-in-up flex flex-wrap gap-2"
          style={{ animationDelay: "0.16s" }}
        >
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filtro === f.valor
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>

        {/* Lista de boatos */}
        <div
          className="animate-fade-in-up space-y-4"
          style={{ animationDelay: "0.2s" }}
        >
          {carregando ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          ) : erroLista ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {erroLista}
            </div>
          ) : boatos.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white/60 px-5 py-10 text-center text-slate-500">
              <MessageSquareWarning className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="font-medium">Nenhum boato reportado ainda nesta categoria.</p>
              <p className="mt-1 text-sm">Seja o primeiro a reportar!</p>
            </div>
          ) : (
            boatos.map((b) => <CartaoBoato key={b.id} boato={b} />)
          )}
        </div>

        <p
          className="animate-fade-in-up text-center text-xs text-slate-400"
          style={{ animationDelay: "0.24s" }}
        >
          Os boatos reportados são verificados pela equipe responsável de cada localidade.
          O LUPA não se responsabiliza pelo conteúdo das denúncias antes da verificação.
        </p>
      </div>
    </main>
  );
}
