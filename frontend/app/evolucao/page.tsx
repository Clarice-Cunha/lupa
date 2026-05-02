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
