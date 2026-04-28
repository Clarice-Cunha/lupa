"use client";

/**
 * Página /api — documentação pública da API do LUPA.
 * Mostra exemplos de uso em Python, JavaScript (fetch) e curl.
 */

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Globe,
  FileVideo,
  FileImage,
} from "lucide-react";

const API_BASE = "https://lupa-api.onrender.com";

// ── Dados dos endpoints ────────────────────────────────────────────────────────

type Endpoint = {
  metodo: string;
  caminho: string;
  descricao: string;
  icone: React.ReactNode;
  exemplos: {
    linguagem: string;
    codigo: string;
  }[];
};

const ENDPOINTS: Endpoint[] = [
  {
    metodo: "POST",
    caminho: "/analisar-url",
    descricao: "Analisa um site ou vídeo do YouTube e retorna a pontuação de confiabilidade com justificativas.",
    icone: <Globe className="h-5 w-5" />,
    exemplos: [
      {
        linguagem: "Python",
        codigo: `import requests

resposta = requests.post(
    "${API_BASE}/analisar-url",
    json={"url": "https://www.bbc.com/portuguese"},
)

dados = resposta.json()
print(dados["pontuacao"])       # ex: 85
print(dados["classificacao"])   # ex: "Confiável"
print(dados["resumo"])          # resumo do conteúdo
for j in dados["justificativas"]:
    print(j["criterio"], j["impacto"])`,
      },
      {
        linguagem: "JavaScript",
        codigo: `const resposta = await fetch("${API_BASE}/analisar-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://www.bbc.com/portuguese" }),
});

const dados = await resposta.json();
console.log(dados.pontuacao);      // ex: 85
console.log(dados.classificacao);  // ex: "Confiável"`,
      },
      {
        linguagem: "curl",
        codigo: `curl -X POST "${API_BASE}/analisar-url" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.bbc.com/portuguese"}'`,
      },
    ],
  },
  {
    metodo: "POST",
    caminho: "/analisar-upload",
    descricao: "Recebe um arquivo de vídeo (MP4, MOV, AVI, MKV, WEBM — até 100 MB) e retorna a análise. O arquivo é apagado após o processamento.",
    icone: <FileVideo className="h-5 w-5" />,
    exemplos: [
      {
        linguagem: "Python",
        codigo: `import requests

with open("video.mp4", "rb") as f:
    resposta = requests.post(
        "${API_BASE}/analisar-upload",
        files={"arquivo": f},
        data={"contexto": "Vídeo recebido pelo WhatsApp"},
    )

dados = resposta.json()
print(dados["pontuacao"])
print(dados["classificacao"])`,
      },
      {
        linguagem: "JavaScript",
        codigo: `const arquivo = document.querySelector('input[type="file"]').files[0];
const formData = new FormData();
formData.append("arquivo", arquivo);
formData.append("contexto", "Vídeo recebido pelo WhatsApp");

const resposta = await fetch("${API_BASE}/analisar-upload", {
  method: "POST",
  body: formData,
  // NÃO definir Content-Type — o navegador insere o boundary certo
});

const dados = await resposta.json();
console.log(dados.pontuacao);`,
      },
      {
        linguagem: "curl",
        codigo: `curl -X POST "${API_BASE}/analisar-upload" \\
  -F "arquivo=@video.mp4" \\
  -F "contexto=Vídeo recebido pelo WhatsApp"`,
      },
    ],
  },
  {
    metodo: "POST",
    caminho: "/analisar-imagem",
    descricao: "Recebe uma imagem (JPG, PNG, WEBP, GIF, BMP, TIFF — até 20 MB) e retorna seus metadados EXIF com alertas pedagógicos e links para busca reversa.",
    icone: <FileImage className="h-5 w-5" />,
    exemplos: [
      {
        linguagem: "Python",
        codigo: `import requests

with open("foto.jpg", "rb") as f:
    resposta = requests.post(
        "${API_BASE}/analisar-imagem",
        files={"arquivo": f},
    )

dados = resposta.json()
print(dados["formato"])             # ex: "JPEG"
print(dados["largura"], dados["altura"])
print(dados["fabricante_camera"])   # ex: "Apple"
print(dados["data_criacao"])        # ex: "2024:03:15 10:30:00"
print(dados["tem_gps"])             # True/False
for alerta in dados["alertas"]:
    print(alerta["nivel"], alerta["mensagem"])`,
      },
      {
        linguagem: "JavaScript",
        codigo: `const arquivo = document.querySelector('input[type="file"]').files[0];
const formData = new FormData();
formData.append("arquivo", arquivo);

const resposta = await fetch("${API_BASE}/analisar-imagem", {
  method: "POST",
  body: formData,
});

const dados = await resposta.json();
console.log(dados.formato);           // ex: "JPEG"
console.log(dados.fabricante_camera); // ex: "Apple"
dados.alertas.forEach(a => console.log(a.nivel, a.mensagem));`,
      },
      {
        linguagem: "curl",
        codigo: `curl -X POST "${API_BASE}/analisar-imagem" \\
  -F "arquivo=@foto.jpg"`,
      },
    ],
  },
];

// ── Tipos de resposta ─────────────────────────────────────────────────────────

const ESQUEMA_URL = `{
  "url": "https://www.exemplo.com",
  "pontuacao": 85,
  "classificacao": "Confiável",
  "cor": "#4CAF50",
  "titulo_pagina": "Título da página",
  "resumo": "Resumo gerado por IA...",
  "justificativas": [
    {
      "criterio": "Domínio com HTTPS",
      "resultado": "O site usa conexão segura.",
      "impacto": 10,
      "camada": "fonte"
    }
  ],
  "dicas_personalizadas": ["..."],
  "fontes_sugeridas": [
    { "nome": "Agência Lupa", "url": "...", "descricao": "..." }
  ]
}`;

const ESQUEMA_IMAGEM = `{
  "nome_arquivo": "foto.jpg",
  "formato": "JPEG",
  "largura": 4032,
  "altura": 3024,
  "tem_exif": true,
  "data_criacao": "2024:03:15 10:30:00",
  "fabricante_camera": "Apple",
  "modelo_camera": "iPhone 15 Pro",
  "software": null,
  "tem_gps": true,
  "latitude": -23.5505,
  "longitude": -46.6333,
  "alertas": [
    { "nivel": "info", "mensagem": "Esta imagem contém coordenadas GPS..." }
  ],
  "links_busca_reversa": [
    { "nome": "Google Lens", "url": "https://lens.google.com/", "descricao": "..." }
  ]
}`;

// ── Helpers ────────────────────────────────────────────────────────────────────

function corMetodo(metodo: string) {
  if (metodo === "GET") return "bg-emerald-100 text-emerald-800";
  if (metodo === "POST") return "bg-indigo-100 text-indigo-800";
  return "bg-slate-100 text-slate-800";
}

function CopiarBotao({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      title="Copiar código"
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-700 hover:text-white"
    >
      {copiado ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copiado ? "Copiado!" : "Copiar"}
    </button>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function PaginaApi() {
  const [linguagemAtiva, setLinguagemAtiva] = useState<string>("Python");
  const linguagens = ["Python", "JavaScript", "curl"];

  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Cabeçalho */}
        <header>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">API do LUPA</h1>
              <p className="text-sm text-slate-500">Integre a análise do LUPA em seus próprios projetos</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-900">
            <p className="mb-2 font-semibold">Base URL</p>
            <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-indigo-700 shadow-sm">
              {API_BASE}
            </code>
            <p className="mt-3 text-xs text-indigo-700">
              A documentação interativa completa (gerada automaticamente) está disponível em{" "}
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium underline hover:text-indigo-900"
              >
                {API_BASE}/docs
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </header>

        {/* Seletor de linguagem global */}
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Ver exemplos em:</span>
          <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {linguagens.map((lang) => (
              <button
                key={lang}
                onClick={() => setLinguagemAtiva(lang)}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                  linguagemAtiva === lang
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        {ENDPOINTS.map((ep) => {
          const exemplo = ep.exemplos.find((e) => e.linguagem === linguagemAtiva) ?? ep.exemplos[0];
          return (
            <section
              key={ep.caminho}
              className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-md backdrop-blur-sm"
            >
              {/* Cabeçalho do endpoint */}
              <div className="flex items-start gap-3 border-b border-slate-100 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  {ep.icone}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${corMetodo(ep.metodo)}`}>
                      {ep.metodo}
                    </span>
                    <code className="font-mono text-sm font-semibold text-slate-800">{ep.caminho}</code>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{ep.descricao}</p>
                </div>
              </div>

              {/* Código de exemplo */}
              <div className="p-5">
                <div className="overflow-hidden rounded-2xl bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
                    <span className="text-xs font-medium text-slate-400">{exemplo.linguagem}</span>
                    <CopiarBotao codigo={exemplo.codigo} />
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed text-slate-200">
                    <code>{exemplo.codigo}</code>
                  </pre>
                </div>
              </div>
            </section>
          );
        })}

        {/* Schemas de resposta */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Code2 className="h-5 w-5 text-indigo-500" />
            Formato das respostas
          </h2>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-md">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              <code className="font-mono text-indigo-700">/analisar-url</code> e{" "}
              <code className="font-mono text-indigo-700">/analisar-upload</code>
            </p>
            <div className="overflow-hidden rounded-2xl bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
                <span className="text-xs font-medium text-slate-400">JSON</span>
                <CopiarBotao codigo={ESQUEMA_URL} />
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed text-slate-200">
                <code>{ESQUEMA_URL}</code>
              </pre>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-md">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              <code className="font-mono text-indigo-700">/analisar-imagem</code>
            </p>
            <div className="overflow-hidden rounded-2xl bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
                <span className="text-xs font-medium text-slate-400">JSON</span>
                <CopiarBotao codigo={ESQUEMA_IMAGEM} />
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed text-slate-200">
                <code>{ESQUEMA_IMAGEM}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Limites e notas */}
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <h2 className="mb-3 font-bold">Limites e boas práticas</h2>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
              <span><strong>Rate limit:</strong> 20 requisições por IP por hora em todos os endpoints.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
              <span><strong>Cache:</strong> análises de URL são cacheadas por 24 horas para economizar recursos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
              <span><strong>Arquivos:</strong> vídeos até 100 MB; imagens até 20 MB. Apagados após o processamento.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
              <span><strong>Uso educacional:</strong> esta API é gratuita e pública, voltada a fins educacionais. Não use para fins comerciais ou para processar dados em massa.</span>
            </li>
          </ul>
        </section>

        <p className="text-center text-xs text-slate-400">
          LUPA — Projeto educacional ·{" "}
          <Link href="/" className="text-indigo-500 underline hover:text-indigo-700">
            Voltar para o início
          </Link>
        </p>
      </div>
    </main>
  );
}
