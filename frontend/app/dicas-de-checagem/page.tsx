/**
 * Página "Dicas de Checagem" — conteúdo estático educacional.
 * Lista práticas de verificação de informação, inspiradas em
 * Poynter.org, Aos Fatos e MediaWise.
 */

import {
  BookOpen,
  Search,
  Clock,
  LinkIcon,
  ImageIcon,
  Users,
  Brain,
  MessageSquare,
  Bot,
  Video,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Dica = {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  exemplo: string;
};

const DICAS: Dica[] = [
  {
    icone: Search,
    titulo: "1. Quem publicou?",
    descricao:
      "Antes de ler o conteúdo, veja quem é a fonte. Procure a página 'Sobre' ou 'Quem somos'. Fontes que escondem quem são geralmente não merecem confiança.",
    exemplo:
      "Um site sem endereço, sem responsável e sem CNPJ deve acender um alerta.",
  },
  {
    icone: BookOpen,
    titulo: "2. Leia além do título",
    descricao:
      "Muitos títulos são feitos para gerar clique, não para informar. Leia a matéria inteira antes de formar opinião ou compartilhar.",
    exemplo:
      "Títulos com 'VOCÊ NÃO VAI ACREDITAR' ou 'BOMBÁSTICO' quase sempre exageram o conteúdo real.",
  },
  {
    icone: Clock,
    titulo: "3. Veja a data",
    descricao:
      "Uma informação pode estar correta mas desatualizada, ou ser reciclada de anos atrás como se fosse nova. Procure sempre a data de publicação.",
    exemplo:
      "Matérias sem data, ou que reaparecem em momentos de crise, frequentemente são usadas fora de contexto.",
  },
  {
    icone: LinkIcon,
    titulo: "4. Investigue a fonte original",
    descricao:
      "Se a matéria cita 'um estudo' ou 'especialistas', procure o link ou nome. Fontes sérias apontam para o material original; fontes duvidosas usam frases vagas.",
    exemplo:
      "'Segundo pesquisa da Universidade X, Y% das pessoas...' — se não há link pro estudo, desconfie.",
  },
  {
    icone: ImageIcon,
    titulo: "5. Faça busca reversa de imagens",
    descricao:
      "Imagens e vídeos podem ser reaproveitados em contextos diferentes. O Google Imagens e o TinEye permitem descobrir onde uma foto apareceu pela primeira vez.",
    exemplo:
      "Uma foto de enchente divulgada como atual pode ser de um desastre de dez anos atrás, em outro país.",
  },
  {
    icone: Users,
    titulo: "6. Compare com outras fontes",
    descricao:
      "Se uma notícia importante é verdade, mais de um veículo sério deve estar cobrindo. Se só um site obscuro fala sobre, reforça a necessidade de cautela.",
    exemplo:
      "Busque o mesmo fato em dois ou três veículos tradicionais antes de acreditar ou compartilhar.",
  },
  {
    icone: Brain,
    titulo: "7. Cuidado com seus próprios vieses",
    descricao:
      "A gente tende a acreditar em coisas que confirmam o que já pensa. Quando uma notícia parece 'boa demais' para o seu lado, é justamente a hora de checar com mais rigor.",
    exemplo:
      "Antes de compartilhar algo que confirma sua opinião, pergunte: 'eu checaria com o mesmo cuidado se fosse o oposto?'",
  },
  {
    icone: MessageSquare,
    titulo: "8. Na dúvida, não compartilhe",
    descricao:
      "Compartilhar dá alcance. Se você não tem certeza, deixar de encaminhar a mensagem já é uma forma de combater a desinformação.",
    exemplo:
      "'Não sei se é verdade' + compartilhar = espalhar a dúvida como fato.",
  },
];

type Sinal = {
  titulo: string;
  descricao: string;
  alerta: string;
};

const SINAIS_BOT: Sinal[] = [
  {
    titulo: "Conta criada recentemente",
    descricao:
      "Perfis falsos costumam ser criados às vésperas de eventos importantes (eleições, crises, polêmicas). Verifique a data de criação da conta nas configurações do perfil.",
    alerta: "Conta com meses de existência e já com milhares de postagens é suspeita.",
  },
  {
    titulo: "Foto de perfil perfeita demais",
    descricao:
      "IAs geram rostos humanos convincentes, mas com detalhes estranhos: fundo desfocado artificialmente, assimetria facial sutil, orelhas ou cabelos distorcidos.",
    alerta: "Faça busca reversa da foto no Google Imagens para ver se aparece em outros perfis.",
  },
  {
    titulo: "Comportamento sobre-humano",
    descricao:
      "Um humano real dorme, trabalha e descansa. Bots postam em qualquer horário — madrugada, fins de semana, feriados — e em volume impossível para uma pessoa.",
    alerta: "Mais de 50 postagens por dia é um sinal forte de automação.",
  },
  {
    titulo: "Só fala de um único tema",
    descricao:
      "Perfis reais têm vida: falam de futebol, clima, família, trabalho. Bots focam num único tema político ou ideológico, repetindo as mesmas narrativas sem desviar.",
    alerta: "Role o histórico: se todas as postagens são sobre o mesmo assunto, desconfie.",
  },
  {
    titulo: "Interações sem contexto",
    descricao:
      "Bots respondem com frases genéricas ('Que verdade!', 'Exatamente isso!') que servem para qualquer post. Nunca debatem detalhes nem fazem perguntas específicas.",
    alerta: "Respostas sem relação com o conteúdo original indicam automação.",
  },
  {
    titulo: "Sem vida pessoal real",
    descricao:
      "Perfis reais têm fotos de viagens, aniversários, amigos, opiniões variadas. Bots não têm histórico de vida — apenas repostagens e propagandas.",
    alerta: "Ausência total de fotos pessoais ou contexto de vida real é um alerta.",
  },
];

const SINAIS_DEEPFAKE: Sinal[] = [
  {
    titulo: "Piscadas irregulares",
    descricao:
      "Humanos piscam em ritmo natural. Vídeos deepfake frequentemente mostram piscadas ausentes, muito rápidas ou em momentos estranhos — a IA tem dificuldade com esse detalhe.",
    alerta: "Assista de novo em câmera lenta focando apenas nos olhos.",
  },
  {
    titulo: "Boca fora de sincronia",
    descricao:
      "O áudio e o movimento dos lábios não se encaixam perfeitamente. Em deepfakes de áudio clonado, há pequenos atrasos ou movimentos que não combinam com os sons produzidos.",
    alerta: "Desligue o som e foque só na boca: ela 'combina' com o que você ouve?",
  },
  {
    titulo: "Bordas do rosto borradas",
    descricao:
      "A transição entre o rosto sobreposto e o fundo ou o pescoço da pessoa original pode apresentar borrões, halo de luz ou flickering (piscadas de pixel) ao redor da cabeça.",
    alerta: "Zoom nas bordas do rosto em frames pausados revela inconsistências.",
  },
  {
    titulo: "Dedos e mãos distorcidos",
    descricao:
      "IAs geradoras de imagem ainda erram muito na quantidade e formato dos dedos. Mãos com 6 dedos, dedos fundidos ou com comprimentos impossíveis são um sinal clássico.",
    alerta: "Conte os dedos sempre que aparecerem mãos em imagens suspeitas.",
  },
  {
    titulo: "Textos ilegíveis no fundo",
    descricao:
      "Placas, cartazes, camisetas e textos ao fundo de imagens geradas por IA costumam ter letras embaralhadas, palavras sem sentido ou caracteres inexistentes.",
    alerta: "Amplie o fundo da imagem: há textos? Eles fazem sentido?",
  },
  {
    titulo: "Iluminação inconsistente",
    descricao:
      "Sombras no rosto que não correspondem à fonte de luz da cena, ou olhos com reflexos que não batem com o ambiente, indicam que o rosto foi inserido em outro vídeo.",
    alerta: "Observe de onde vem a luz na cena e compare com as sombras no rosto.",
  },
];

export default function DicasDeChecagem() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <BookOpen className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Dicas de Checagem
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Oito hábitos simples que transformam qualquer pessoa em um
            checador mais atento.
          </p>
        </header>

        {/* Grade de dicas */}
        <div className="grid gap-4 sm:grid-cols-2">
          {DICAS.map((dica, i) => (
            <CartaoDica key={dica.titulo} dica={dica} ordem={i} />
          ))}
        </div>

        {/* Seção: Bots e perfis falsos */}
        <section className="animate-fade-in-up mt-12" style={{ animationDelay: "0.5s" }}>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <Bot className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Como identificar bots e perfis falsos
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Bots são contas automatizadas usadas para espalhar desinformação em larga escala.
                Assim como um NPC de videogame segue roteiros rígidos e nunca improvisa,
                perfis falsos têm padrões reconhecíveis — se você souber o que procurar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SINAIS_BOT.map((sinal, i) => (
              <CartaoSinal
                key={sinal.titulo}
                sinal={sinal}
                ordem={i}
                corIcone="text-violet-600"
                corFundo="bg-violet-100"
              />
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            <strong>Dica prática:</strong> nenhum sinal isolado confirma que é um bot. Quanto mais
            sinais você identificar na mesma conta, maior a suspeita. Na dúvida, não interaja com o
            conteúdo e não o compartilhe.
          </div>
        </section>

        {/* Seção: Deepfakes */}
        <section className="animate-fade-in-up mt-12" style={{ animationDelay: "0.6s" }}>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100">
              <Video className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Sinais de deepfake em vídeos e imagens
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Deepfakes são vídeos ou imagens manipulados por inteligência artificial para trocar
                rostos, vozes ou ações de pessoas reais. A tecnologia evolui rápido, mas ainda
                deixa pistas visuais que você pode aprender a reconhecer.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SINAIS_DEEPFAKE.map((sinal, i) => (
              <CartaoSinal
                key={sinal.titulo}
                sinal={sinal}
                ordem={i}
                corIcone="text-rose-600"
                corFundo="bg-rose-100"
              />
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <strong>Como verificar:</strong> faça uma busca pelo trecho de vídeo no YouTube ou Google
            para ver se aparece em outros contextos. Agências como{" "}
            <strong>Aos Fatos</strong> e <strong>AFP Checamos</strong> investigam deepfakes
            regularmente.
          </div>
        </section>

        {/* Chamada final */}
        <div
          className="animate-fade-in-up mt-10 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-rose-50 p-6 text-center shadow-lg shadow-indigo-100/40"
          style={{ animationDelay: "0.8s" }}
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Quer praticar agora?
          </h2>
          <p className="mt-2 text-slate-600">
            Cole um link na página inicial e veja o LUPA aplicar várias
            dessas dicas automaticamente.
          </p>
        </div>
      </div>
    </main>
  );
}

function CartaoSinal({
  sinal,
  ordem,
  corIcone,
  corFundo,
}: {
  sinal: Sinal;
  ordem: number;
  corIcone: string;
  corFundo: string;
}) {
  return (
    <div
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-lg shadow-indigo-100/30 backdrop-blur-sm transition hover:shadow-xl"
      style={{ animationDelay: `${ordem * 0.05}s` }}
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${corFundo}`}>
        <CheckCircle2 className={`h-5 w-5 ${corIcone}`} />
      </div>
      <h3 className="mb-2 text-base font-semibold text-slate-900">{sinal.titulo}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{sinal.descricao}</p>
      <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        {sinal.alerta}
      </p>
    </div>
  );
}

function CartaoDica({ dica, ordem }: { dica: Dica; ordem: number }) {
  const Icone = dica.icone;
  return (
    <div
      className="animate-fade-in-up rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-lg shadow-indigo-100/30 backdrop-blur-sm transition hover:shadow-xl hover:shadow-indigo-100/50"
      style={{ animationDelay: `${ordem * 0.05}s` }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
        <Icone className="h-5 w-5 text-indigo-600" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-slate-900">
        {dica.titulo}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {dica.descricao}
      </p>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs italic text-slate-500">
        💡 {dica.exemplo}
      </p>
    </div>
  );
}
