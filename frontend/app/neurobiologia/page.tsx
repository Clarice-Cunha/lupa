import { Zap, Shield, AlertTriangle, Lightbulb } from "lucide-react";

const ARMADILHAS = [
  {
    titulo: "Linguagem emocional",
    exemplo: "\"CHOCANTE: você não vai acreditar no que fizeram!\"",
    explicacao:
      "Palavras que geram raiva, medo ou surpresa disparam o acelerador antes que o freio consiga agir.",
  },
  {
    titulo: "Urgência falsa",
    exemplo: "\"Compartilhe antes que deletem essa verdade!\"",
    explicacao:
      "Cria pressão para agir rápido — exatamente o estado em que o freio funciona pior.",
  },
  {
    titulo: "Identidade de grupo",
    exemplo: "\"Só quem realmente se importa vai compartilhar isso.\"",
    explicacao:
      "Aciona o instinto de pertencimento. O acelerador quer proteger o grupo antes de verificar os fatos.",
  },
  {
    titulo: "Imagens impactantes",
    exemplo: "Fotos de acidentes, violência ou situações extremas.",
    explicacao:
      "Imagens fortes ativam o sistema emocional em milissegundos — muito antes da análise racional começar.",
  },
];

const DICAS = [
  {
    numero: "1",
    titulo: "Reconheça o acelerador",
    texto:
      "Sentiu raiva, medo, choque ou euforia? Isso é o acelerador funcionando. Use esse sentimento como sinal de alerta, não como motivo para compartilhar.",
  },
  {
    numero: "2",
    titulo: "Dê tempo ao freio",
    texto:
      "Espere alguns segundos antes de agir. O córtex pré-frontal precisa de tempo para processar — ele é mais lento, mas muito mais preciso.",
  },
  {
    numero: "3",
    titulo: "Use o Método SIFT",
    texto:
      "Pare → Investigue → Busque cobertura → Trace a origem. Os 4 passos do SIFT foram criados exatamente para dar tempo ao freio agir.",
  },
  {
    numero: "4",
    titulo: "Saiba que isso é normal",
    texto:
      "Não é fraqueza ser afetado por conteúdo emocional. É biologia. Conhecer o mecanismo já é metade da solução.",
  },
];

export default function PaginaNeurobiologia() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Cabeçalho */}
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Neurociência e desinformação
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Acelerador e Freio
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          Por que o cérebro adolescente é mais vulnerável à desinformação —
          e o que fazer a respeito.
        </p>
      </div>

      {/* Analogia do carro */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50 p-6 dark:border-slate-700 dark:from-slate-800/60 dark:to-indigo-900/20">
        <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          O cérebro como um carro
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Acelerador */}
          <div className="flex-1 rounded-2xl bg-rose-50 border border-rose-200 p-5 text-center dark:bg-rose-900/20 dark:border-rose-800">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-md">
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-rose-700 dark:text-rose-400">
              🔴 Acelerador
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-500">
              Sistema Límbico
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Centro das <strong>emoções</strong>. Reage em milissegundos.
              Totalmente desenvolvido na adolescência.
            </p>
          </div>

          {/* VS */}
          <div className="text-2xl font-black text-slate-400">VS</div>

          {/* Freio */}
          <div className="flex-1 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center dark:bg-emerald-900/20 dark:border-emerald-800">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
              <Shield className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-bold text-emerald-700 dark:text-emerald-400">
              🟢 Freio
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-500 dark:text-emerald-500">
              Córtex Pré-frontal
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Centro da <strong>razão</strong>. Analisa, planeja e questiona.
              Só termina de se desenvolver aos 25 anos.
            </p>
          </div>
        </div>
      </div>

      {/* Explicação principal */}
      <div className="mb-8 space-y-4 text-slate-700 dark:text-slate-300">
        <p className="text-base leading-relaxed">
          Imagine seu cérebro como um carro. O{" "}
          <strong className="text-rose-600 dark:text-rose-400">
            sistema límbico
          </strong>{" "}
          é o acelerador: reage rápido, movido a emoções como raiva, medo,
          surpresa e alegria. O{" "}
          <strong className="text-emerald-600 dark:text-emerald-400">
            córtex pré-frontal
          </strong>{" "}
          é o freio: analisa a situação, verifica os fatos e toma decisões
          racionais.
        </p>
        <p className="text-base leading-relaxed">
          O problema? <strong>Na adolescência, o acelerador já é adulto — mas o freio ainda está em construção.</strong> O córtex
          pré-frontal é a última parte do cérebro a amadurecer, processo que
          só termina por volta dos 25 anos. Isso não é defeito: é a forma
          como o cérebro humano evoluiu. Mas cria uma janela de
          vulnerabilidade.
        </p>
        <p className="text-base leading-relaxed">
          Criadores de desinformação sabem disso — mesmo que intuitivamente.
          Eles constroem conteúdo para <strong>disparar o acelerador</strong>{" "}
          antes que o freio consiga agir.
        </p>
      </div>

      {/* Armadilhas comuns */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Como a desinformação explora isso
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ARMADILHAS.map((armadilha) => (
            <div
              key={armadilha.titulo}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
            >
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                {armadilha.titulo}
              </p>
              <p className="mt-1 text-xs italic text-amber-600 dark:text-amber-400">
                {armadilha.exemplo}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {armadilha.explicacao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* O que fazer */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Como usar esse conhecimento a seu favor
          </h2>
        </div>
        <div className="space-y-3">
          {DICAS.map((dica) => (
            <div
              key={dica.numero}
              className="flex items-start gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-black text-white shadow">
                {dica.numero}
              </span>
              <div>
                <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                  {dica.titulo}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {dica.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé científico */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
          Base científica
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          O desenvolvimento tardio do córtex pré-frontal em adolescentes é um
          dos achados mais sólidos da neurociência moderna. Pesquisadores como
          Sarah-Jayne Blakemore (University College London) e B.J. Casey
          (Cornell) demonstraram que a maturação pré-frontal continua até
          meados da segunda década de vida, criando um desbalanço temporário
          entre os sistemas emocionais e os de controle executivo. Esse
          desbalanço tem sido associado a maior impulsividade, busca por
          recompensa social e susceptibilidade a influências do grupo — fatores
          que afetam diretamente como adolescentes avaliam e compartilham
          informações nas redes sociais.
        </p>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Referências: Blakemore, S.J. (2012). <em>Imaging brain development</em>, NeuroImage. Casey, B.J. et al. (2008).{" "}
          <em>The adolescent brain</em>, Developmental Review.
        </p>
      </div>
    </main>
  );
}
