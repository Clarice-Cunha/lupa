import { Pause, Search, Globe, GitBranch } from "lucide-react";

const PASSOS = [
  {
    letra: "S",
    nome: "Pare",
    ingles: "Stop",
    icone: Pause,
    cor: "from-rose-500 to-orange-500",
    corTexto: "text-rose-700 dark:text-rose-400",
    corFundo: "bg-rose-50 dark:bg-rose-900/20",
    corBorda: "border-rose-200 dark:border-rose-800",
    descricao:
      "Antes de compartilhar qualquer informação, pare. Pergunte-se: \"Eu realmente sei se isso é verdade?\" A urgência e a emoção são as principais armas da desinformação — elas nos fazem agir antes de pensar.",
    dicas: [
      "Você sentiu raiva, medo ou surpresa ao ler? Atenção: emoções fortes reduzem o senso crítico.",
      "O conteúdo pede para você compartilhar rápido? Isso é um sinal de alerta.",
      "Respire fundo antes de repassar qualquer coisa.",
    ],
  },
  {
    letra: "I",
    nome: "Investigue a fonte",
    ingles: "Investigate the source",
    icone: Search,
    cor: "from-amber-500 to-yellow-500",
    corTexto: "text-amber-700 dark:text-amber-400",
    corFundo: "bg-amber-50 dark:bg-amber-900/20",
    corBorda: "border-amber-200 dark:border-amber-800",
    descricao:
      "Quem está dizendo isso? Antes de ler o conteúdo em si, pesquise rapidamente a fonte. Um site, perfil ou canal com histórico ruim não muda só porque uma notícia parece verdadeira.",
    dicas: [
      "Pesquise o nome do site ou da pessoa em um buscador.",
      "Verifique há quanto tempo a conta existe e quantos seguidores ela tem.",
      "Procure por \"[nome da fonte] confiável\" ou \"[nome da fonte] fake news\".",
    ],
  },
  {
    letra: "F",
    nome: "Busque cobertura",
    ingles: "Find better coverage",
    icone: Globe,
    cor: "from-indigo-500 to-blue-500",
    corTexto: "text-indigo-700 dark:text-indigo-400",
    corFundo: "bg-indigo-50 dark:bg-indigo-900/20",
    corBorda: "border-indigo-200 dark:border-indigo-800",
    descricao:
      "Outros veículos confiáveis estão noticiando a mesma coisa? Se uma informação importante for verdadeira, ela aparecerá em mais de um lugar. Se só um site ou perfil está falando, desconfie.",
    dicas: [
      "Pesquise o assunto no Google, Bing ou DuckDuckGo.",
      "Veja se agências como Reuters, AP ou Agência Brasil cobriram.",
      "Falta de cobertura em outros lugares é um sinal de alerta.",
    ],
  },
  {
    letra: "T",
    nome: "Trace o conteúdo",
    ingles: "Trace claims, quotes and media",
    icone: GitBranch,
    cor: "from-emerald-500 to-teal-500",
    corTexto: "text-emerald-700 dark:text-emerald-400",
    corFundo: "bg-emerald-50 dark:bg-emerald-900/20",
    corBorda: "border-emerald-200 dark:border-emerald-800",
    descricao:
      "Rastreie a origem da informação até a fonte primária. Fotos, vídeos e citações são frequentemente retirados de contexto ou alterados. Encontre de onde veio o conteúdo original.",
    dicas: [
      "Use a pesquisa de imagem reversa do Google para verificar fotos.",
      "Para vídeos, procure o título no YouTube com filtro de data mais antiga.",
      "Leia a citação completa, não só o trecho que circulou.",
    ],
  },
];

export default function PaginaMetodoSift() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Cabeçalho */}
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          Técnica de fact-checking
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Método SIFT
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          Quatro perguntas simples que qualquer pessoa pode fazer antes de
          compartilhar uma informação. Criado por Mike Caulfield e recomendado
          por pesquisadores de todo o mundo para combater a desinformação.
        </p>
      </div>

      {/* Sigla em destaque */}
      <div className="mb-10 flex justify-center gap-3">
        {["S", "I", "F", "T"].map((letra, i) => {
          const cores = [
            "from-rose-500 to-orange-500",
            "from-amber-500 to-yellow-500",
            "from-indigo-500 to-blue-500",
            "from-emerald-500 to-teal-500",
          ];
          return (
            <div
              key={letra}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cores[i]} text-2xl font-black text-white shadow-md`}
            >
              {letra}
            </div>
          );
        })}
      </div>

      {/* Passos */}
      <div className="space-y-6">
        {PASSOS.map((passo, index) => {
          const Icone = passo.icone;
          return (
            <div
              key={passo.letra}
              className={`rounded-3xl border ${passo.corBorda} ${passo.corFundo} p-6`}
            >
              <div className="flex items-start gap-4">
                {/* Número + ícone */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${passo.cor} shadow-md`}
                >
                  <Icone className="h-6 w-6 text-white" strokeWidth={2} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`text-2xl font-black ${passo.corTexto}`}
                    >
                      {passo.letra}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      — {passo.nome}
                    </h2>
                    <span className="text-sm text-slate-400 dark:text-slate-500 italic">
                      ({passo.ingles})
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {passo.descricao}
                  </p>

                  {/* Dicas práticas */}
                  <ul className="mt-4 space-y-1.5">
                    {passo.dicas.map((dica, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span
                          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full bg-gradient-to-br ${passo.cor} text-center text-[10px] font-bold leading-4 text-white`}
                        >
                          {i + 1}
                        </span>
                        {dica}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé informativo */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
          Por que o SIFT funciona?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          O método foi criado pelo pesquisador Mike Caulfield e é ensinado em
          centenas de escolas nos Estados Unidos, Canadá e Europa. Ele é
          simples o suficiente para ser aplicado em segundos, mas poderoso o
          suficiente para bloquear a maioria das desinformações que circulam
          nas redes sociais. Estudos mostram que pessoas treinadas no SIFT
          identificam notícias falsas com muito mais precisão do que quem
          confia apenas no "bom senso".
        </p>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Fonte: Mike Caulfield —{" "}
          <em>SIFT (The Four Moves)</em>, Hapgood, 2019.
        </p>
      </div>
    </main>
  );
}
