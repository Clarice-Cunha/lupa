/**
 * Página "Evolução do Protótipo" — linha do tempo do desenvolvimento do LUPA.
 * Escrita em linguagem acessível para qualquer público, com notas técnicas
 * opcionais para quem quiser se aprofundar.
 */

import {
  Rocket,
  Trophy,
  Layers,
  Globe,
  Video,
  Upload,
  FileText,
  FileImage,
  Monitor,
  Gamepad2,
  GraduationCap,
  BookMarked,
  Code2,
  Headphones,
  Users,
  ShieldCheck,
  ShieldAlert,
  BarChart2,
  Telescope,
  CheckCircle2,
  Clock,
  Swords,
  Brain,
  MessageSquare,
  Database,
  Sparkles,
  Mic,
  Scale,
  Bot,
  LayoutDashboard,
  Award,
  MapPin,
  Cpu,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Status = "concluido" | "em-andamento";

type Marco = {
  id: number;
  data: string;
  titulo: string;
  descricao: string;
  notaTecnica: string | null;
  status: Status;
  icone: LucideIcon;
  corFundo: string;
  corIcone: string;
};

const MARCOS: Marco[] = [
  {
    id: 0,
    data: "Março de 2026",
    titulo: "A origem: da ideia ao primeiro protótipo",
    descricao:
      "Tudo começou quando o Colégio Contemporâneo divulgou o HackaNAV 2026 — uma competição nacional de inovação tecnológica para estudantes do 8º e 9º anos, promovida pelo programa Nave a Vela. O tema daquele ano era 'Soluções para o Combate à Desinformação Digital'. A equipe viu nessa proposta uma oportunidade real: a desinformação afeta toda a família, não só os jovens, e as ferramentas de checagem existentes são difíceis de usar. Nasceu a ideia do LUPA. O primeiro passo foi escrever um PRD — um 'Documento de Requisitos do Produto', que funciona como o roteiro de um filme antes das filmagens: lista tudo que o site precisaria ter, como funcionaria, para quem seria e quais seriam seus limites. Para escrever o PRD com qualidade, a equipe contou com o apoio de diferentes inteligências artificiais, mas todas as decisões foram da equipe. Com o roteiro em mãos, surgiu a primeira versão visual do LUPA: uma tela inicial criada na plataforma Lovable, uma ferramenta que transforma descrições em telas de forma quase automática. Era o protótipo inicial — uma versão simplificada para testar se a ideia funcionava. Com o PRD refinado, a equipe migrou para o Claude Code, uma ferramenta de inteligência artificial especializada em ajudar a escrever código mais completo, dando início à versão que você está vendo agora.",
    notaTecnica:
      "HackaNAV 2026 — Escola Complexo Educacional Contemporâneo, programa Nave a Vela. Microtemas cobertos: Verificação de Fatos e Fontes + Letramento Digital e Educação Midiática + Detecção de Manipulação Audiovisual. PRD (Product Requirements Document) elaborado com apoio de múltiplos modelos de linguagem. Protótipo inicial (baixa fidelidade) desenvolvido no Lovable — plataforma de geração de interfaces com IA. Versão atual (alta fidelidade) desenvolvida com suporte do Claude Code (Anthropic).",
    status: "concluido",
    icone: Trophy,
    corFundo: "bg-yellow-100",
    corIcone: "text-yellow-600",
  },
  {
    id: 1,
    data: "Abril de 2026",
    titulo: "Estrutura inicial do projeto",
    descricao:
      "Com a ideia validada no protótipo inicial e o roteiro definido, chegou a hora de construir a versão completa. O primeiro passo foi escolher as ferramentas que dariam vida ao LUPA: uma parte que roda nos bastidores — processando análises sem que o usuário veja — e outra parte que é a interface visual na tela. É como construir uma casa: antes de erguer as paredes, é preciso fazer a planta e preparar o terreno.",
    notaTecnica:
      "Servidor (backend) em Python 3.11+ com FastAPI — um conjunto de ferramentas que facilita criar serviços web em Python. Interface visual (frontend) em Next.js 16 com TypeScript e TailwindCSS v4. Hospedagem no Render (servidor) e Vercel (site).",
    status: "concluido",
    icone: Layers,
    corFundo: "bg-indigo-100",
    corIcone: "text-indigo-600",
  },
  {
    id: 2,
    data: "Abril de 2026",
    titulo: "Análise de links de sites",
    descricao:
      "A primeira função criada: o usuário cola o endereço de um site — chamado de URL, a sequência de letras que começa com 'https://' — e o LUPA examina uma série de sinais automáticos. O site usa conexão segura? O domínio é antigo ou foi criado recentemente? O texto usa linguagem sensacionalista? Cada sinal contribui para a pontuação final de 0 a 100.",
    notaTecnica:
      "Módulo analyzer.py integrado ao Firecrawl (serviço que lê o conteúdo de páginas web) e ao Gemini (inteligência artificial do Google para análise de texto). Respostas guardadas em memória por 24 horas para economizar chamadas à API e responder mais rápido.",
    status: "concluido",
    icone: Globe,
    corFundo: "bg-sky-100",
    corIcone: "text-sky-600",
  },
  {
    id: 3,
    data: "Abril de 2026",
    titulo: "Análise de vídeos do YouTube",
    descricao:
      "Com um link do YouTube, o LUPA vai além da página — ele acessa informações do próprio vídeo: título, descrição, nome do canal, data de publicação e estatísticas como número de visualizações. Esses dados ajudam a entender o contexto: quem publicou, quando, e como o conteúdo foi recebido pelo público.",
    notaTecnica:
      "Integração com a YouTube Data API v3 — um serviço oficial do Google que fornece dados dos vídeos em formato estruturado. O LUPA detecta automaticamente quando o link enviado é do YouTube e usa um módulo diferente (youtube_analyzer.py) para processá-lo.",
    status: "concluido",
    icone: Video,
    corFundo: "bg-red-100",
    corIcone: "text-red-600",
  },
  {
    id: 4,
    data: "Abril de 2026",
    titulo: "Envio e análise de vídeos",
    descricao:
      "'Upload' é a palavra em inglês para 'enviar um arquivo do seu computador para um site'. O LUPA passou a aceitar arquivos de vídeo diretamente — útil para analisar vídeos recebidos pelo WhatsApp ou baixados de outras fontes. O arquivo é analisado e apagado imediatamente após o processamento: nada fica guardado no servidor, preservando a privacidade de quem envia.",
    notaTecnica:
      "Endpoint /analisar-upload com suporte a MP4, MOV, AVI, MKV e WEBM (até 100 MB). Arquivos salvos temporariamente na memória do servidor e deletados automaticamente após a análise, mesmo em caso de erro — garantindo isolamento total.",
    status: "concluido",
    icone: Upload,
    corFundo: "bg-orange-100",
    corIcone: "text-orange-600",
  },
  {
    id: 5,
    data: "Abril de 2026",
    titulo: "Análise de textos copiados",
    descricao:
      "Às vezes a desinformação chega como texto puro — uma mensagem de WhatsApp, um e-mail em cadeia, um post copiado. O LUPA aprendeu a analisar texto diretamente: o usuário cola o conteúdo suspeito na caixa de texto e recebe uma avaliação baseada em padrões de linguagem identificados por inteligência artificial, sem precisar de nenhum link.",
    notaTecnica:
      "Módulo text_analyzer.py com análise semântica via Gemini. Aceita textos de até 20.000 caracteres. Campo opcional 'origem' permite informar se o texto veio do WhatsApp, Instagram, e-mail, etc., para contextualizar a análise.",
    status: "concluido",
    icone: FileText,
    corFundo: "bg-teal-100",
    corIcone: "text-teal-600",
  },
  {
    id: 6,
    data: "Abril de 2026",
    titulo: "Análise de fotografias e imagens",
    descricao:
      "Toda fotografia digital carrega informações invisíveis embutidas no arquivo — chamadas de metadados. Esses dados ocultos podem revelar quando a foto foi tirada, com qual câmera ou celular, qual programa foi usado para editá-la, e até a localização geográfica onde foi capturada. O LUPA lê essas informações e apresenta alertas que ajudam a entender o contexto da imagem — por exemplo, se uma foto dita 'recente' na verdade tem anos.",
    notaTecnica:
      "Módulo image_analyzer.py usando a biblioteca Pillow para extração de EXIF (Exchangeable Image File Format — padrão internacional de metadados de imagem). Suporte a JPG, PNG, WEBP, GIF, BMP e TIFF (até 20 MB). Inclui links automáticos para busca reversa no Google Lens e TinEye.",
    status: "concluido",
    icone: FileImage,
    corFundo: "bg-pink-100",
    corIcone: "text-pink-600",
  },
  {
    id: 7,
    data: "Abril de 2026",
    titulo: "Interface visual do site",
    descricao:
      "Com as análises funcionando nos bastidores, chegou a hora de construir o rosto do LUPA: a tela principal com abas para cada tipo de análise, animações suaves, cores que indicam o nível de risco (verde para confiável, amarelo para atenção, vermelho para suspeito) e as justificativas detalhadas de cada pontuação. O objetivo foi criar algo que qualquer pessoa — criança, adulto ou idoso — conseguisse usar sem precisar de manual.",
    notaTecnica:
      "Componentes React com TypeScript, tema claro/escuro automático, design responsivo (funciona em celular e computador). Comunicação com o servidor feita via chamadas REST — um padrão de troca de dados pela internet.",
    status: "concluido",
    icone: Monitor,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 8,
    data: "Abril de 2026",
    titulo: "Jogos e modo para grupos",
    descricao:
      "Aprender a identificar desinformação pode ser divertido. O LUPA ganhou uma área de jogos com atividades interativas. O modo para grupos — chamado de 'multiplayer', palavra em inglês para 'vários jogadores' — permite que uma turma inteira jogue ao mesmo tempo: o professor cria uma sala com um código, os alunos entram pelos seus celulares, e todos participam juntos, como um quiz em tempo real.",
    notaTecnica:
      "Backend com WebSockets — tecnologia que mantém uma conexão contínua entre o servidor e o navegador, permitindo troca de mensagens instantâneas. Frontend com rotas /jogos e /jogos/multiplayer, gerenciamento de salas por código de 6 dígitos.",
    status: "concluido",
    icone: Gamepad2,
    corFundo: "bg-emerald-100",
    corIcone: "text-emerald-600",
  },
  {
    id: 9,
    data: "Abril de 2026",
    titulo: "Biblioteca Virtual",
    descricao:
      "Uma curadoria de livros, sites, vídeos e artigos sobre desinformação e pensamento crítico, organizada por faixa etária: crianças (6–10), pré-adolescentes (11–14), adolescentes (15–17), adultos (18–59) e idosos (60+). Cada indicação foi escolhida pensando em quem vai ler — os livros para crianças são escritos para crianças, não guias para adultos ensinarem crianças. Os links levam diretamente para o recurso.",
    notaTecnica:
      "Página estática em Next.js com dados definidos diretamente no código, sem banco de dados. Estrutura de tipos TypeScript (Recurso, FaixaEtaria) garante consistência. Campo urlAudio opcional prepara a estrutura para futura integração de resumos em áudio.",
    status: "concluido",
    icone: GraduationCap,
    corFundo: "bg-green-100",
    corIcone: "text-green-600",
  },
  {
    id: 10,
    data: "Abril de 2026",
    titulo: "Páginas educacionais de apoio",
    descricao:
      "O LUPA não é só uma ferramenta de análise — é um ambiente de aprendizado. Foram criadas páginas com: Glossário (explicação de termos como 'câmara de eco' e 'deepfake'), Dicas de Checagem (guia passo a passo para verificar informações), Legislação (as leis brasileiras sobre desinformação), Histórico (registro das suas análises, guardado apenas no seu aparelho) e Sobre o LUPA (a filosofia e os princípios do projeto).",
    notaTecnica:
      "Páginas estáticas geradas pelo Next.js. O histórico usa localStorage — uma área de memória do navegador que fica no próprio aparelho do usuário. Nenhum dado é enviado ao servidor, garantindo privacidade total.",
    status: "concluido",
    icone: BookMarked,
    corFundo: "bg-amber-100",
    corIcone: "text-amber-600",
  },
  {
    id: 11,
    data: "Abril de 2026",
    titulo: "Abertura para desenvolvedores",
    descricao:
      "O LUPA abriu suas análises para quem sabe programar. Por meio de uma interface técnica chamada API — sigla para 'Interface de Programação de Aplicativos' — outras pessoas podem integrar o LUPA em seus próprios projetos: um aplicativo escolar, um site de checagem, uma pesquisa acadêmica. A documentação explica como fazer isso com exemplos práticos em três linguagens de programação: Python, JavaScript e curl.",
    notaTecnica:
      "Documentação pública em /api com exemplos em Python, JavaScript e curl. Endpoints disponíveis: /analisar-url, /analisar-upload e /analisar-imagem. Proteção de rate limit (limite de uso): 20 requisições por IP por hora para evitar abuso.",
    status: "concluido",
    icone: Code2,
    corFundo: "bg-slate-200",
    corIcone: "text-slate-600",
  },
  {
    id: 12,
    data: "Abril de 2026",
    titulo: "Resumos em áudio com inteligência artificial",
    descricao:
      "Usando o NotebookLM — uma ferramenta gratuita do Google que usa inteligência artificial para criar resumos e podcasts a partir de textos — o LUPA está adicionando resumos em áudio aos livros da Biblioteca Virtual. O objetivo é tornar o conteúdo mais acessível para quem prefere ouvir a ler, incluindo idosos com dificuldade visual e crianças que ainda estão aprendendo.",
    notaTecnica:
      "Arquivos de áudio .m4a hospedados em /public/audios (pasta pública do Next.js, acessível diretamente pelo navegador). Campo urlAudio no tipo Recurso da Biblioteca. Player nativo HTML5 exibido abaixo do card quando o arquivo está disponível.",
    status: "em-andamento",
    icone: Headphones,
    corFundo: "bg-rose-100",
    corIcone: "text-rose-600",
  },
  {
    id: 13,
    data: "Abril de 2026",
    titulo: "Portal Comunitário de Boatos",
    descricao:
      "O LUPA ganhou uma seção dedicada à comunidade: qualquer pessoa pode reportar um boato que está circulando no seu bairro, escola ou condomínio. O relato vai para a equipe LUPA, que o direciona à autoridade responsável — diretor da escola, ouvidoria da prefeitura ou síndico. Se a resposta for de interesse coletivo, ela é publicada no próprio site para que toda a comunidade possa consultar. Assim o LUPA deixa de ser apenas uma ferramenta de análise e passa a ser também um registro público de desinformação hiperlocal.",
    notaTecnica:
      "Backend: endpoints GET /boatos (listagem com filtro por categoria) e POST /boatos (envio com rate limit de 10/hora por IP). Frontend: página /comunidade com formulário de envio, abas de filtro e cartões de resultado com badges de status coloridos. Dados persistidos em banco de dados PostgreSQL via Supabase.",
    status: "concluido",
    icone: Users,
    corFundo: "bg-cyan-100",
    corIcone: "text-cyan-600",
  },
  {
    id: 14,
    data: "Abril de 2026",
    titulo: "Painel de Moderação",
    descricao:
      "Para que a equipe LUPA possa gerenciar os boatos sem precisar editar arquivos manualmente, foi criado um painel de administração acessível em uma URL reservada do site. Depois de digitar a chave de acesso, a equipe vê todos os boatos reportados, pode alterar o status de cada um (pendente, em apuração, verificado como falso, etc.) e publicar o texto da checagem — que passa a aparecer automaticamente na página pública da comunidade.",
    notaTecnica:
      "Endpoint PATCH /boatos/{id} protegido pelo cabeçalho HTTP 'X-Moderacao-Chave', configurável via variável de ambiente MODERACAO_CHAVE. Página /moderacao com tela de login por senha e formulários de edição por cartão, sem dependência de banco de dados externo.",
    status: "concluido",
    icone: ShieldCheck,
    corFundo: "bg-indigo-100",
    corIcone: "text-indigo-600",
  },
  {
    id: 15,
    data: "Abril de 2026",
    titulo: "Pesquisa e Dados",
    descricao:
      "O LUPA ganhou uma página dedicada ao embasamento científico do projeto: dados sobre a velocidade de propagação de desinformação, um comparativo entre as principais ferramentas de checagem disponíveis no Brasil e no mundo, os diferenciais que motivaram as escolhas do projeto e as referências acadêmicas que sustentam o enfoque educacional. O objetivo é mostrar que o LUPA não foi construído no vácuo — ele dialoga com pesquisas reais e com soluções que já existem.",
    notaTecnica:
      "Página estática /pesquisa com quatro seções: dados quantitativos (Vosoughi et al. 2018; OMS 2020), comparativo de seis ferramentas (Agência Lupa, Aos Fatos, Boatos.org, Google Fact Check, InVID/WeVerify, LUPA) em seis critérios, lista de seis diferenciais e cinco referências bibliográficas completas.",
    status: "concluido",
    icone: BarChart2,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 16,
    data: "Abril de 2026",
    titulo: "Para onde o LUPA vai",
    descricao:
      "Um protótipo não é um produto acabado — é um começo. Esta seção descreve os próximos passos planejados (novos jogos, áudio para toda a Biblioteca, testes com a comunidade e parcerias com escolas), a visão de longo prazo (aplicativo móvel, extensão de navegador, código aberto, colaboração com agências profissionais) e formas concretas de qualquer pessoa contribuir com o projeto. A transparência sobre o que ainda falta é parte do compromisso com a construção aberta e colaborativa do LUPA.",
    notaTecnica:
      "Página estática /futuro com cinco seções: resumo do estado atual, quatro próximos passos de curto prazo, seis itens de visão de longo prazo, quatro formas de participação comunitária e uma seção sobre o processo de desenvolvimento aberto com IA.",
    status: "concluido",
    icone: Telescope,
    corFundo: "bg-teal-100",
    corIcone: "text-teal-600",
  },
  {
    id: 17,
    data: "Abril de 2026",
    titulo: "Agente LUPA — Jogo de Aventura 2D",
    descricao:
      "Um terceiro modo de jogo entrou para a área de atividades: o Agente LUPA, uma aventura no estilo plataforma 2D. O jogador controla uma lupa que percorre uma cidade digital noturna e é perseguida por inimigos que representam tipos de desinformação — bots espalhadores, manchetes falsas e correntes virais. Quando um inimigo alcança o jogador, uma pergunta educativa aparece na tela: responder certo derrota o inimigo; errar custa uma vida. São 3 inimigos por fase, sorteados ao acaso a cada nova partida.",
    notaTecnica:
      "Motor gráfico Phaser 3.90 integrado ao Next.js via importação dinâmica com ssr: false. O Phaser gerencia física, animação e controles; o React exibe overlays (pergunta, feedback, game over, vitória) por cima do canvas. Comunicação entre as duas camadas via ref de callbacks, evitando re-renders desnecessários. Banco com 5 perguntas por mundo; 3 são embaralhadas e sorteadas a cada partida.",
    status: "concluido",
    icone: Swords,
    corFundo: "bg-amber-100",
    corIcone: "text-amber-600",
  },
  {
    id: 18,
    data: "Abril de 2026",
    titulo: "Conteúdo pedagógico ampliado",
    descricao:
      "O LUPA ganhou quatro novos blocos de conteúdo educativo, pensados especialmente para o público jovem. Na página de Dicas de Checagem foram adicionadas duas novas seções: um guia para identificar bots e perfis falsos nas redes sociais — usando a analogia do NPC (personagem de videogame que segue roteiros rígidos) para explicar como contas automatizadas se comportam — e um guia visual de sinais de deepfake em vídeos e imagens, ensinando o leitor a reconhecer piscadas irregulares, bocas fora de sincronia e dedos distorcidos. Na página de Jogos, foi adicionada uma seção com três jogos externos criados por universidades, baseados na teoria da inoculação psicológica: a ideia de que aprender as táticas da desinformação por dentro protege contra elas na vida real — como uma vacina. Na página de Fontes Confiáveis, foi incluída uma explicação detalhada sobre como as agências brasileiras de checagem trabalham: o sistema de etiquetas do Aos Fatos, o chatbot Fátima, o Radar de monitoramento em tempo real, a metodologia colaborativa do Projeto Comprova e o histórico da Agência Lupa.",
    notaTecnica:
      "Dicas de Checagem: dois novos componentes CartaoSinal com dados SINAIS_BOT (6 itens) e SINAIS_DEEPFAKE (6 itens). Jogos: array JOGOS_EXTERNOS com links para Bad News Game (Cambridge), Go Viral! (Cambridge) e Factitious (AU Game Studio). Fontes Confiáveis: array METODOLOGIAS com descrição estruturada de Aos Fatos, Agência Lupa e Projeto Comprova.",
    status: "concluido",
    icone: Brain,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 19,
    data: "Abril de 2026",
    titulo: "Portal de Colaboração com a Comunidade",
    descricao:
      "O LUPA ganhou um canal direto de comunicação com o público: o Portal de Colaboração. Diferente do Portal Comunitário de Boatos — voltado para reportar rumores sobre fatos concretos —, este espaço é aberto a sugestões de melhoria, relatos de dificuldade e propostas de novas funcionalidades. Qualquer pessoa pode enviar uma mensagem (com e-mail opcional). As sugestões ficam visíveis a todos — sem expor o e-mail — e a equipe LUPA pode responder publicamente a cada uma. A aba de moderação está integrada à própria página, acessível apenas com a chave de acesso da equipe.",
    notaTecnica:
      "Backend: módulo sugestoes.py com endpoints GET /sugestoes (listagem pública — exclui o campo e-mail), POST /sugestoes (envio com rate limit de 5/hora por IP) e PATCH /sugestoes/{id}/responder (resposta da equipe, protegido pelo cabeçalho X-Moderacao-Chave). Frontend: página /colaboracao com formulário de envio, lista de sugestões ordenada por data e aba de moderação integrada.",
    status: "concluido",
    icone: MessageSquare,
    corFundo: "bg-lime-100",
    corIcone: "text-lime-600",
  },
  {
    id: 20,
    data: "Abril de 2026",
    titulo: "Persistência permanente de dados com Supabase",

    descricao:
      "Um problema silencioso foi descoberto: os dados enviados pelos usuários — boatos, sugestões, feedbacks e parcerias — desapareciam toda vez que o servidor reiniciava. Isso acontecia porque o serviço de hospedagem gratuito usa um armazenamento temporário: arquivos gravados no servidor são apagados automaticamente a cada reinício, que pode ocorrer a cada poucas horas. A solução foi migrar todo o armazenamento para o Supabase, um banco de dados gratuito na nuvem que guarda os dados de forma permanente — independente de quantas vezes o servidor reiniciar. A partir dessa mudança, nenhuma colaboração da comunidade se perde mais.",
    notaTecnica:
      "Migração de quatro módulos (boatos.py, sugestoes.py, feedback.py, parceria.py) de arquivos JSON locais para PostgreSQL via Supabase. Criado módulo db.py com cliente HTTP próprio contra a API REST do Supabase (PostgREST), substituindo a biblioteca supabase-py — incompatível com o novo formato de chaves sb_secret_ lançado em 2025. Interface de chamadas encadeadas (_Cliente → _Tabela → _Query → _Resultado) mantém a sintaxe dos módulos existentes inalterada.",
    status: "concluido",
    icone: Database,
    corFundo: "bg-sky-100",
    corIcone: "text-sky-600",
  },
  {
    id: 21,
    data: "Maio de 2026",
    titulo: "Análise visual de imagens com IA e detecção forense de manipulação",
    descricao:
      "A análise de imagens ganhou duas melhorias importantes. A primeira: o Gemini — a inteligência artificial do Google — passou a examinar visualmente o conteúdo da imagem, não apenas seus dados técnicos. O usuário pode descrever o que o deixa desconfiado — por exemplo, 'acho que essa foto foi tirada em outro país' — e a IA confronta diretamente essa suspeita com o que observa na imagem. A segunda melhoria é a análise ELA — sigla em inglês para 'Análise de Nível de Erro' —, uma técnica forense usada por investigadores de imagem. Quando uma foto é editada e salva novamente, as regiões modificadas ficam com uma 'impressão digital' de compressão diferente do restante. A ELA lê essas diferenças pixel a pixel e emite alertas quando encontra padrões suspeitos. O LUPA também passou a aceitar até 3 imagens por análise, com limite de 10 MB cada.",
    notaTecnica:
      "image_analyzer.py: _analisar_com_gemini() envia a imagem em base64 ao gemini-2.5-flash com prompt adaptativo (confronto direto quando campo 'contexto' preenchido). _analisar_ela() re-salva a imagem em buffer de memória com JPEG quality=95, calcula ImageChops.difference() pixel a pixel, amplifica 10× via ImageEnhance.Brightness — índice médio > 15/255 → alerta; > 6/255 → aviso. Frontend: FormularioImagem reescrito para array File[] com validação prévia de tipo e tamanho, análise paralela via Promise.all.",
    status: "concluido",
    icone: Sparkles,
    corFundo: "bg-fuchsia-100",
    corIcone: "text-fuchsia-600",
  },
  {
    id: 22,
    data: "Maio de 2026",
    titulo: "Análise do conteúdo falado em vídeos do YouTube",
    descricao:
      "Analisar o título e a descrição de um vídeo diz muito, mas o que importa de verdade é o que a pessoa fala. O LUPA passou a usar as legendas automáticas geradas pelo YouTube para ler a transcrição completa do vídeo e enviá-la à inteligência artificial. O Gemini examina o conteúdo falado em busca de cinco pontos: um resumo do que foi dito, afirmações sem fonte ou com dados distorcidos, técnicas de manipulação emocional como alarmismo e apelo ao medo, linguagem sensacionalista, e orientações sobre como verificar as afirmações principais. Esse resultado aparece na área de resumo do cartão, que antes exibia apenas uma descrição neutra. Quando o vídeo não tem legenda disponível, o LUPA usa a descrição como alternativa.",
    notaTecnica:
      "youtube_analyzer.py: função _analisar_transcript_gemini(transcript, titulo) envia até 10.000 caracteres da transcrição ao gemini-2.5-flash com prompt estruturado em 5 critérios de desinformação. Substitui gerar_resumo() quando transcrição disponível; fallback mantido para vídeos sem legendas. Sem mudanças no frontend ou nos endpoints — resultado aparece no campo 'resumo' já existente.",
    status: "concluido",
    icone: Mic,
    corFundo: "bg-purple-100",
    corIcone: "text-purple-600",
  },
  {
    id: 23,
    data: "Maio de 2026",
    titulo: "Verificação cruzada com banco global de checagens e campo de suspeita",
    descricao:
      "O LUPA passou a cruzar o conteúdo analisado com um banco de dados de organizações profissionais de verificação de fatos de todo o mundo — chamado de IFCN, sigla em inglês para 'Rede Internacional de Verificação de Fatos'. Se uma afirmação semelhante já foi checada por agências como Aos Fatos, Agência Lupa ou parceiros internacionais, o resultado aparece com a classificação original ('falso', 'distorcido', 'enganoso', etc.) e o link para a checagem completa. Um filtro inteligente garante que só apareçam checagens realmente relacionadas ao conteúdo — evitando erros por simples coincidência de palavras. Em paralelo, os formulários de análise de texto e vídeo ganharam um campo opcional onde o usuário descreve a própria suspeita. Em vez de uma análise genérica, a IA confronta diretamente aquela dúvida específica com o conteúdo analisado — o mesmo mecanismo que já existia para imagens.",
    notaTecnica:
      "Módulo fact_check.py com busca via Google Fact Check Tools API. filtrar_relevantes() usa intersecção de palavras ≥ 5 caracteres normalizadas com unicodedata.NFD — mínimo de 2 palavras em comum para considerar relevante. Checagem pulada para homepages (path vazio após urlparse). Campo 'suspeita' adicionado a PedidoTexto em main.py, propagado ao text_analyzer.py e inserido no prompt do Gemini quando preenchido.",
    status: "concluido",
    icone: Scale,
    corFundo: "bg-blue-100",
    corIcone: "text-blue-600",
  },
  {
    id: 41,
    data: "Maio de 2026",
    titulo: "O falso positivo do banco de checagens — um erro e o que ele ensinou",
    descricao:
      "Este marco não registra uma funcionalidade nova. Registra um erro que a equipe cometeu, descobriu e corrigiu. Ao testar o LUPA com sites conhecidos, a capitã da equipe percebeu algo estranho: portais de notícia grandes e legítimos, como globo.com e uol.com, estavam recebendo notas baixas. A causa apareceu na investigação: ao analisar a página inicial de um portal, o LUPA pesquisava no banco de checagens pelo nome do portal — e recebia de volta checagens que apenas mencionavam aquele nome, muitas vezes desmentindo boatos que usavam o nome do jornal indevidamente. O LUPA lia isso como 'esse site foi desmentido' e punia justamente quem tinha sido vítima da desinformação. A primeira reação foi de frustração, porque a consulta às agências de checagem era o recurso mais interessante do analisador, e a equipe chegou a considerar abandoná-la. Houve inclusive a sugestão de remover essa análise do sistema, mas a equipe discordou e preferiu procurar uma saída que preservasse o recurso. O professor orientador apoiou a busca. A solução veio em duas partes, no mesmo dia: o LUPA deixou de consultar o banco de checagens para páginas iniciais de portais, passando a fazê-lo apenas para páginas internas — onde existe um conteúdo específico a ser checado; e foi criado um filtro de relevância, que descarta checagens sem relação real com o conteúdo analisado. Oito dias depois veio o desdobramento menos óbvio: a equipe percebeu que o erro não estava só no código, estava no raciocínio. O LUPA tinha tratado um sinal de alerta como se fosse uma prova — que é exatamente o erro que a desinformação explora nas pessoas. Foi por isso que uma análise com nota 100 passou a exibir um aviso lembrando que nota máxima não significa certeza absoluta. O projeto passou a aplicar em si mesmo o que ensina.",
    notaTecnica:
      "Módulo fact_check.py. A função avaliar_impacto() aplicava −30 pontos a uma checagem negativa, sobre uma pontuação que começa em 50 (PONTUACAO_INICIAL, em analyzer.py) — o suficiente para levar um portal legítimo à faixa 'Suspeito'. Correções nos commits 8f8af76 e 23f109d, ambos de 01/05/2026: o primeiro restringe a consulta a páginas internas (path vazio após urlparse indica homepage); o segundo acrescenta filtrar_relevantes(), que exige interseção mínima de duas palavras com 5+ caracteres entre a checagem e o conteúdo. O aviso de nota máxima veio no commit ccfe7a7, de 09/05/2026. O comentário que explica a decisão está preservado em analyzer.py, junto ao trecho da consulta.",
    status: "concluido",
    icone: ShieldAlert,
    corFundo: "bg-amber-100",
    corIcone: "text-amber-600",
  },
  {
    id: 24,
    data: "Maio de 2026",
    titulo: "Modo Professor — Painel de turmas",
    descricao:
      "Professores agora podem criar uma 'turma digital' no LUPA e acompanhar em tempo real as análises feitas pelos alunos. O fluxo é simples: o professor acessa /professor/turma, informa seu nome e o nome da turma, e recebe dois códigos — um público (para compartilhar com os alunos) e uma chave privada (para acessar o painel depois). Na página inicial, os alunos podem digitar o código da turma antes de fazer qualquer análise; ao concluir, o resultado é automaticamente registrado. O painel do professor mostra o total de análises, a pontuação média da turma, a distribuição entre 'suspeito', 'requer atenção' e 'confiável', e a tabela completa com cada análise, tipo (URL, texto, vídeo), data e resumo. O botão de impressão permite salvar o relatório em PDF diretamente pelo navegador.",
    notaTecnica:
      "Novo módulo backend/turma.py com funções criar_turma(), registrar_analise() e obter_painel(). Três endpoints em main.py: POST /turmas, POST /turmas/{codigo}/analises (rate-limit 60/h), GET /turmas/{codigo}/painel (autenticado por X-Turma-Chave). Duas tabelas no Supabase: turmas e analises_turma. No frontend, campo CampoCodigoTurma persiste entre abas na página principal; análises de URL, texto e vídeo chamam registrarAnaliseTurma() em fire-and-forget após resultado bem-sucedido.",
    status: "concluido",
    icone: LayoutDashboard,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 25,
    data: "Maio de 2026",
    titulo: "Calculador de Probabilidade de Bot",
    descricao:
      "A página de Dicas de Checagem ganhou uma ferramenta interativa: o Calculador de Probabilidade de Bot. O usuário observa um perfil suspeito nas redes sociais e marca os sinais que identifica — foto de perfil gerada por IA, nome com números aleatórios, posts em horários de madrugada, conteúdo repetitivo sobre o mesmo tema, ausência de interações reais, entre outros. A partir de 5 respostas, o calculador exibe o resultado: 'Provável humano', 'Suspeito', 'Alta suspeita' ou 'Muito provável bot', com uma barra de risco visual e uma orientação sobre o que fazer com o conteúdo daquela conta.",
    notaTecnica:
      "Componente cliente calculador-bot.tsx com 10 perguntas binárias (Sim/Não). Pontuação = número de 'Sim'. Classificação em 4 níveis: 0–2 humano, 3–4 suspeito, 5–7 alto, 8–10 bot. Resultado exibido progressivamente a partir de 5 respostas respondidas.",
    status: "concluido",
    icone: Bot,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 26,
    data: "Maio de 2026",
    titulo: "Detecção de deepfake e imagens geradas por IA",
    descricao:
      "A análise de imagens ganhou duas novas camadas de verificação. A primeira é a análise GHOST (sigla em inglês para 'Espectro de Compressão JPEG'): a ferramenta re-salva a imagem em seis qualidades diferentes e mede a variação de compressão por região. Em uma imagem intacta, todos os pedaços 'concordam' com uma mesma qualidade de origem. Em uma imagem montada a partir de partes de fontes diferentes — como um rosto colado em outra foto — cada região tem seu próprio histórico de compressão, o que gera uma variação anormalmente alta. A segunda melhoria está na análise da inteligência artificial: o Gemini agora recebe instruções específicas para procurar sinais clássicos de geração artificial, como textura de pele irreal, bordas borradas ao redor do rosto, dedos com formato impossível, reflexos de olho inconsistentes com o ambiente e textos ilegíveis ao fundo — características que denunciam imagens criadas por modelos como Midjourney, DALL-E ou deepfake.",
    notaTecnica:
      "Nova função _analisar_ghost() em image_analyzer.py: salva o JPEG em qualidades [55, 65, 75, 85, 90, 95] e usa ImageStat.Stat para obter média e desvio padrão do mapa de diferenças em cada qualidade. Alerta disparado quando std_min > 22 e media_min > 6 na melhor qualidade. Prompt do Gemini expandido com lista explícita de artefatos de IA/deepfake. Usa apenas Pillow (ImageStat já incluso) — sem dependências novas.",
    status: "concluido",
    icone: ShieldCheck,
    corFundo: "bg-rose-100",
    corIcone: "text-rose-600",
  },
  {
    id: 27,
    data: "Maio de 2026",
    titulo: "Painel de estatísticas do Detetive LUPA",
    descricao:
      "O jogo Detetive LUPA ganhou uma camada analítica: após três rodadas completas, aparece uma seção com barras de progresso mostrando em quais tipos de indício — linguagem sensacionalista, ausência de fonte, apelo emocional, entre outros — o jogador acertou ou errou com mais frequência. O objetivo é ajudar cada pessoa a identificar seus pontos cegos: os tipos de desinformação que ainda passam despercebidos com mais facilidade.",
    notaTecnica:
      "Componente React com leitura do localStorage: histórico de respostas agrupado por tipo de indício. Barras de progresso calculadas no cliente, sem envio de dados ao servidor. A seção só é exibida a partir da 3ª rodada concluída, para que haja dados suficientes para análise.",
    status: "concluido",
    icone: BarChart2,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 28,
    data: "Maio de 2026",
    titulo: "Certificado de conclusão do Detetive LUPA",
    descricao:
      "Ao conquistar o distintivo 'Detetive LUPA' — prêmio que aparece quando o jogador conclui o jogo com alto desempenho —, um diploma visual é exibido na tela com nome, data e número de acertos. O certificado pode ser salvo como imagem com um clique no botão de download. É uma forma de tornar o aprendizado concreto e compartilhável — especialmente útil em contexto de sala de aula.",
    notaTecnica:
      "Modal com diploma gerado via HTML/CSS e exportado como PNG usando a biblioteca html-to-image. O nome do jogador é lido do localStorage. O download usa URL.createObjectURL() com um elemento <a> criado dinamicamente e acionado por código — sem dependência de servidor.",
    status: "concluido",
    icone: Award,
    corFundo: "bg-yellow-100",
    corIcone: "text-yellow-600",
  },
  {
    id: 29,
    data: "Maio de 2026",
    titulo: "Busca de turmas por nome no painel de moderação",
    descricao:
      "A equipe LUPA ganhou uma ferramenta prática: na área de moderação, uma aba 'Turmas' permite recuperar o código de uma turma a partir do nome do professor ou da turma. Antes, se um professor perdia o código, não havia como recuperá-lo sem acesso direto ao banco de dados. Agora a própria equipe LUPA pode fazer essa busca de forma rápida e segura, sem expor dados de outras turmas.",
    notaTecnica:
      "Endpoint GET /turmas/buscar?q={termo} no backend, protegido pelo cabeçalho X-Moderacao-Chave. Busca por substring (ILIKE) nos campos nome_professor e nome_turma no Supabase. Frontend: nova aba na página /moderacao com campo de busca e listagem dos resultados com nome, código e data de criação.",
    status: "concluido",
    icone: LayoutDashboard,
    corFundo: "bg-slate-100",
    corIcone: "text-slate-600",
  },
  {
    id: 30,
    data: "Maio de 2026",
    titulo: "Agente LUPA — Mundo 2: Fontes e Evidências",
    descricao:
      "O jogo de aventura ganhou seu segundo mundo. Depois de derrotar os vilões de fake news no Mundo 1, o jogador entra em um ambiente de laboratório de pesquisa — com tons de verde e arquivos ao fundo — e enfrenta três novos tipos de inimigo: o Conflito de Interesse (💰), que ensina a identificar quando uma fonte tem interesses escondidos por trás da informação; a Citação Fora de Contexto (✂️), que mostra como frases reais podem ser distorcidas ao serem retiradas do contexto; e a Correlação Falsa (📊), que explica a diferença entre coincidência estatística e causa real. As vidas conquistadas no Mundo 1 são preservadas ao avançar.",
    notaTecnica:
      "Banco PERGUNTAS_MUNDO2 com 10 perguntas (3–4 por tipo de inimigo). mundoAtual como estado React (1 | 2) passado por closure ao Phaser. avancarMundo() preserva vidasInicialRef.current para que a nova cena inicie com as vidas acumuladas. Fundo renderizado por desenharFundoM2(): grade verde sutil + silhuetas de arquivos com divisórias e abas coloridas.",
    status: "concluido",
    icone: Swords,
    corFundo: "bg-emerald-100",
    corIcone: "text-emerald-600",
  },
  {
    id: 31,
    data: "Maio de 2026",
    titulo: "Mapa georreferenciado no Portal Comunitário de Boatos",
    descricao:
      "O Portal Comunitário ganhou uma dimensão geográfica: ao reportar um boato, o usuário pode indicar o local exato onde a informação circula clicando em um mapa interativo. Todos os boatos com localização são exibidos em um mapa de visão geral com marcadores coloridos por status (pendente, em apuração, verificado como falso). Isso permite visualizar padrões geográficos — bairros ou regiões onde determinados tipos de boato se concentram — informação valiosa para entender como a desinformação se espalha localmente.",
    notaTecnica:
      "Componente MapaBoatos.tsx usando Leaflet.js com importação dinâmica (ssr: false) para evitar erros de server-side rendering. Campos lat e lng adicionados à tabela boatos no Supabase. Dois modos de operação: seletor (formulário de envio, com marcador arrastável) e exibição (mapa geral com todos os boatos georreferenciados agrupados por status).",
    status: "concluido",
    icone: MapPin,
    corFundo: "bg-cyan-100",
    corIcone: "text-cyan-600",
  },
  {
    id: 32,
    data: "Maio de 2026",
    titulo: "Agente LUPA — Mundo 3: Manipulação de Imagem",
    descricao:
      "O terceiro mundo leva o jogador a um estúdio fotográfico escuro com tons âmbar, onde três tipos de vilão ensinam sobre as formas mais comuns de enganar com imagens: a Imagem Editada por IA (🖼️), que explica como identificar fotos geradas ou manipuladas artificialmente usando ferramentas como pesquisa reversa e análise forense; o Contexto Falso (📍), que mostra como imagens reais são usadas com datas, locais ou situações erradas; e a Legenda Falsa (📝), que ensina a verificar se a descrição de uma foto condiz com o que ela realmente mostra. Molduras fotográficas antigas compõem o cenário de fundo.",
    notaTecnica:
      "Banco PERGUNTAS_MUNDO3 com 10 perguntas (4 edicao, 3 contexto, 3 legenda). Fundo em desenharFundoM3(): paleta 0x1a0800 (âmbar profundo) com molduras fotográficas desenhadas via Graphics primitives — bordas âmbar, interior escuro e faixas horizontais simulando linhas de edição. mundoAtual expandido para 1 | 2 | 3; avancarMundo() atualizado com ramo M2→M3.",
    status: "concluido",
    icone: Swords,
    corFundo: "bg-orange-100",
    corIcone: "text-orange-600",
  },
  {
    id: 33,
    data: "Maio de 2026",
    titulo: "Agente LUPA — Mundo 4: Deepfake e Vídeo",
    descricao:
      "No quarto mundo, com fundo violeta e monitores de vigilância piscando ao fundo, o jogador enfrenta os vilões do universo audiovisual: o Rosto Sintético (🎭), que ensina a identificar deepfakes por piscadas artificiais, lábios dessincronizados e ausência de micromovimentos naturais; o Vídeo Fora de Contexto (📹), que mostra como filmagens reais são reaproveitadas com datas e locais falsos; e o Clone de Voz (🎙️), que alerta sobre a tecnologia de clonagem de voz por inteligência artificial e como proteger familiares de golpes que imitam vozes conhecidas.",
    notaTecnica:
      "Banco PERGUNTAS_MUNDO4 com 10 perguntas (4 deepfake, 3 videoctx, 3 clonevoz). Fundo em desenharFundoM4(): paleta 0x0d0416 (violeta profundo) com monitores de vigilância — corpo escuro, borda violeta, interior com scanlines e indicadores de gravação vermelhos no canto superior. mundoAtual expandido para 1 | 2 | 3 | 4.",
    status: "concluido",
    icone: Swords,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 34,
    data: "Maio de 2026",
    titulo: "Agente LUPA — Mundo 5: Chefe Final (Campanha Coordenada)",
    descricao:
      "O Agente LUPA está completo. O quinto e último mundo — uma sala de operações em vermelho escuro com racks de servidores, LEDs piscando e uma rede de nós conectados visível ao fundo — reúne o tema mais complexo: operações de desinformação em escala industrial. Três vilões finais ensinam sobre Redes de Bots (🕸️), que fabricam trending topics e amplificam conteúdo falso de forma automatizada; Narrativas Coordenadas (🎯), que simulam múltiplas fontes independentes publicando a mesma história falsa para criar aparência de consenso; e Astroturfing (🌿), que cria movimentos de aparência popular financiados por interesses ocultos. Ao completar o Mundo 5, uma tela especial celebra o jogador por ter dominado todos os cinco temas.",
    notaTecnica:
      "Banco PERGUNTAS_MUNDO5 com 10 perguntas (4 botnet, 3 narrativa, 3 astroturf). Fundo em desenharFundoM5(): paleta 0x0f0000 (vermelho profundo) com racks de servidores — slots escuros e LEDs verdes alternados —, mais uma rede de 10 nós conectados por 13 arestas desenhada via Graphics. PainelVitoria do Mundo 5 exibe tela especial de conclusão com 🏆 em vez de botão de avanço. mundoAtual: 1 | 2 | 3 | 4 | 5.",
    status: "concluido",
    icone: Swords,
    corFundo: "bg-rose-100",
    corIcone: "text-rose-600",
  },
  {
    id: 35,
    data: "Maio de 2026",
    titulo: "Mini-jogo: Detetive da Engenharia Social",
    descricao:
      "O LUPA ganhou seu primeiro mini-jogo independente voltado à segurança digital. O jogador lê seis cenários do cotidiano — uma ligação de um 'técnico de TI', um e-mail alertando sobre uma 'conta em risco', uma inspeção surpresa de 'fiscais' — e precisa identificar qual tática de manipulação está sendo usada em cada situação. São seis táticas mapeadas: pretexting (criar um pretexto falso para extrair informações), urgência fabricada (pressionar para uma decisão rápida), apelo à autoridade (se passar por uma figura de poder), quid pro quo (oferecer algo em troca de dados), baiting (usar uma isca física ou digital) e rapport (construir confiança artificial ao longo do tempo). Cada cenário exibe uma explicação detalhada ao final, ensinando a reconhecer o mecanismo de manipulação mesmo quando ele aparece disfarçado em situações aparentemente normais.",
    notaTecnica:
      "Três arquivos criados: cenarios.ts (dados — TaticaId, Tatica, Cenario), JogoEngenhariaSocial.tsx (componente 'use client'), page.tsx (rota /jogos/engenharia-social). Seis táticas tipadas em TaticaId; seis cenários em CENARIOS[]. Fases: intro (lista das 6 táticas com ícone e descrição curta) → jogando (barra de progresso, card de contexto, 4 botões de opção, revelação com explicação) → fim (medalha em 4 níveis ≥5/≥4/≥3/<3, tabela de resultados com tática correta por cenário). Paleta teal/cyan.",
    status: "concluido",
    icone: Brain,
    corFundo: "bg-teal-100",
    corIcone: "text-teal-600",
  },
  {
    id: 36,
    data: "Maio de 2026",
    titulo: "Mini-jogo: Verdadeiro ou Suspeito?",
    descricao:
      "O segundo mini-jogo independente treina o olhar crítico sobre manchetes virais. O jogador analisa 8 afirmações — algumas verdadeiras (como dados oficiais do IBGE e da OMS), outras fabricadas ou distorcidas (como promessas milagrosas e dados fora de contexto) — e realiza dois passos para cada uma: primeiro classifica como Verdadeiro ou Suspeito, depois identifica o principal indício que justifica a classificação, entre sete opções: autoridade vaga, linguagem sensacionalista, teoria conspiratória, promessa milagrosa, dado fora de contexto, ausência de fonte e fonte verificável. Cada passo vale 10 pontos (máximo de 160). A tela final exibe uma tabela com o resultado de cada afirmação usando os códigos ✓✓, ✓✗, ✗✓ e ✗✗ — permitindo ao jogador identificar em qual etapa erra mais.",
    notaTecnica:
      "Três arquivos criados: afirmacoes.ts (dados — Classificacao, IndicadorId, Indicador, Afirmacao), JogoVerdadeiroOuSuspeito.tsx (componente 'use client'), page.tsx (rota /jogos/verdadeiro-ou-suspeito). Sete IndicadorId; oito Afirmacao[] (4 verdadeiro, 4 suspeito). Três fases com sub-estado etapa: 'classificar' | 'indicar' | 'revelar'. ResultadoRodada acumula classCorreta e indCorreto por rodada. Medalhas em 4 níveis (≥87,5% / ≥68,75% / ≥50% / abaixo). Paleta violet/purple.",
    status: "concluido",
    icone: Scale,
    corFundo: "bg-violet-100",
    corIcone: "text-violet-600",
  },
  {
    id: 37,
    data: "Maio de 2026",
    titulo: "Mini-jogo: Caça ao Phishing",
    descricao:
      "O terceiro mini-jogo independente do LUPA ensina a identificar mensagens de phishing — golpes digitais disfarçados de comunicações legítimas de bancos, empresas ou órgãos públicos para roubar dados pessoais. O jogador analisa cinco mensagens falsas (e-mails, WhatsApp e SMS) e deve clicar nas partes suspeitas de cada uma: o domínio incorreto no link, o tom de urgência fabricado, a saudação genérica sem nome do destinatário, os erros de ortografia propositais. A pontuação reflete quantas armadilhas foram identificadas, e uma explicação ao final revela os elementos que denunciam cada golpe — transformando o exercício em uma aula prática de segurança digital.",
    notaTecnica:
      "Três arquivos: mensagens.ts (TipoMensagem, ElementoSuspeito, Mensagem), JogoPhishing.tsx ('use client') e page.tsx (/jogos/phishing). Cinco mensagens com tipo email | whatsapp | sms e array ElementoSuspeito[] com posição no texto, descrição e pontuação. Interface com seleção interativa de partes do texto e revelação visual dos elementos suspeitos ao final de cada mensagem. Paleta laranja/vermelho.",
    status: "concluido",
    icone: ShieldAlert,
    corFundo: "bg-orange-100",
    corIcone: "text-orange-600",
  },
  {
    id: 38,
    data: "Maio de 2026",
    titulo: "Verificação de malware e histórico de domínios",
    descricao:
      "A análise de URLs ganhou duas novas camadas de segurança. A primeira é a integração com o VirusTotal: ao receber um link, o LUPA agora o submete simultaneamente a mais de 70 motores antivírus e ferramentas de detecção de phishing. Se algum deles marcar o endereço como malicioso, o resultado aparece no relatório com o número de alertas e o tipo de ameaça detectada. A segunda é a integração com o Wayback Machine — o arquivo histórico da internet mantido pelo Internet Archive há mais de 25 anos. Domínios criados há poucos meses são um sinal clássico de site fraudulento; mudanças radicais de conteúdo entre capturas também. O LUPA agora consulta esse histórico automaticamente para identificar esses padrões.",
    notaTecnica:
      "Dois novos módulos no backend. virustotal.py: submete a URL à VirusTotal API v3, processa last_analysis_stats e retorna contagem de positivos, total de mecanismos consultados e link para o relatório completo. wayback.py: consulta a CDX API do Internet Archive para obter data da primeira e última captura, total de snapshots e URL do snapshot mais recente. Ambos integrados ao analyzer.py como verificações na análise de URL.",
    status: "concluido",
    icone: ShieldCheck,
    corFundo: "bg-sky-100",
    corIcone: "text-sky-600",
  },
  {
    id: 39,
    data: "Maio de 2026",
    titulo: "Transparência técnica — Página /tecnico",
    descricao:
      "Uma nova página trouxe transparência total sobre como o LUPA funciona por dentro: a arquitetura completa do sistema representada em um diagrama visual, a stack tecnológica detalhada por camada (Python e FastAPI no servidor, Next.js e Tailwind na interface, Supabase para dados), o passo a passo do fluxo de uma análise desde o clique do usuário até o retorno da pontuação, os seis módulos do backend com suas responsabilidades, as APIs externas consultadas e os critérios que guiaram as decisões de design. O objetivo é duplo: demonstrar o letramento tecnológico da equipe e permitir que qualquer estudante ou professor entenda o projeto em profundidade.",
    notaTecnica:
      "Página estática /tecnico (server component, sem 'use client'). Seis seções: diagrama de arquitetura (Usuário → Vercel → Render → Supabase + APIs externas), tabela da stack por camada, fluxo de análise em 6 etapas numeradas, grade 2×3 com os módulos do backend, tabela de APIs externas com badge 'Chave?' e 5 cartões de decisões técnicas em formato pergunta/resposta.",
    status: "concluido",
    icone: Cpu,
    corFundo: "bg-slate-100",
    corIcone: "text-slate-600",
  },
  {
    id: 40,
    data: "Maio de 2026",
    titulo: "Validação com usuários reais — Página /validacao",
    descricao:
      "Para colher evidências concretas de que o LUPA é útil fora do ambiente de desenvolvimento, foi criada uma página dedicada à validação com usuários. Qualquer pessoa que tenha testado o site pode responder a três perguntas objetivas — aprendeu algo novo, conseguiu identificar um sinal de alerta, recomendaria a ferramenta — e avaliar a facilidade de uso numa escala de 1 a 5. Os resultados são exibidos publicamente na mesma página, com barras de percentual calculadas sobre todas as respostas recebidas. Os depoimentos em texto passam por moderação antes de aparecer — a revisão é feita diretamente na aba 'Avaliações' do painel de moderação já existente em /moderacao.",
    notaTecnica:
      "Módulo backend validacao.py com quatro funções: criar_validacao() (POST, rate-limit 10/h), listar_validacoes() (GET, protegido), aprovar_validacao() (PATCH, protegido) e obter_resultados() (GET público). Estatísticas calculadas sobre todos os registros; depoimentos exibidos apenas quando aprovado=true. Tabela validacoes no Supabase. Frontend: server component page.tsx + client component ValidacaoCliente.tsx (padrão dois arquivos para exportar metadata em server component). Aba 'Avaliações' adicionada ao painel /moderacao com CartaoAvaliacao e atualização otimista da lista.",
    status: "concluido",
    icone: ClipboardList,
    corFundo: "bg-emerald-100",
    corIcone: "text-emerald-600",
  },
];

export const metadata = {
  title: "Evolução do Protótipo — LUPA",
  description:
    "Acompanhe o passo a passo da construção do LUPA — explicado em linguagem simples para qualquer pessoa.",
};

export default function PaginaEvolucao() {
  return (
    <main className="flex-1 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">

        {/* Cabeçalho */}
        <header className="mb-12 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-lg shadow-indigo-200">
            <Rocket className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Evolução do Protótipo
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            O LUPA é construído passo a passo, de forma aberta e educativa.
            Aqui você acompanha cada etapa do desenvolvimento — explicada em
            linguagem simples para qualquer pessoa.
          </p>
        </header>

        {/* Legenda */}
        <div
          className="animate-fade-in-up mb-10 flex flex-wrap justify-center gap-5 text-sm"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-slate-600">Concluído</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-slate-600">Em andamento</span>
          </div>
        </div>

        {/* Linha do tempo */}
        <div className="relative">
          {/* Linha vertical decorativa */}
          <div
            className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-200"
            aria-hidden="true"
          />

          <ol className="space-y-8">
            {MARCOS.map((marco, i) => {
              const Icone = marco.icone;
              const concluido = marco.status === "concluido";
              return (
                <li
                  key={marco.id}
                  className="animate-fade-in-up relative pl-16"
                  style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                >
                  {/* Ícone na linha */}
                  <div
                    className={`absolute left-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white shadow-md ${marco.corFundo}`}
                    aria-hidden="true"
                  >
                    <Icone className={`h-5 w-5 ${marco.corIcone}`} />
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-md shadow-slate-100/60 backdrop-blur-sm">
                    {/* Cabeçalho do card */}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-400">
                        {marco.data}
                      </span>
                      {concluido ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          Concluído
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-100">
                          <Clock className="h-3 w-3" />
                          Em andamento
                        </span>
                      )}
                    </div>

                    {/* Título e descrição */}
                    <h2 className="mb-2 text-base font-bold text-slate-900">
                      {marco.titulo}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600 text-justify">
                      {marco.descricao}
                    </p>

                    {/* Nota técnica colapsável */}
                    {marco.notaTecnica && (
                      <details className="mt-3 group">
                        <summary className="cursor-pointer list-none text-xs font-medium text-indigo-600 hover:text-indigo-800 transition select-none flex items-center gap-1">
                          <span className="group-open:hidden">▶ Ver detalhe técnico</span>
                          <span className="hidden group-open:inline">▼ Fechar detalhe técnico</span>
                        </summary>
                        <p className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500">
                          {marco.notaTecnica}
                        </p>
                      </details>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p
          className="animate-fade-in-up mt-12 text-center text-sm text-slate-400"
          style={{ animationDelay: `${0.15 + MARCOS.length * 0.05}s` }}
        >
          O LUPA está em desenvolvimento contínuo.
          Esta página é atualizada a cada nova etapa concluída.
        </p>
      </div>
    </main>
  );
}
