# Evolução do Protótipo LUPA

> Diário de bordo do desenvolvimento. Atualizado a cada nova etapa concluída.
> **Última atualização:** Agosto de 2026

---

## Como usar este documento

A cada nova funcionalidade, página ou melhoria significativa, adicione uma entrada seguindo o formato:

```
### ✅ Marco N — Título
**Data:** Mês de Ano
**Status:** Concluído | Em andamento

**O que foi feito:** descrição acessível para qualquer público.

**Detalhe técnico:** informações para quem é desenvolvedor.
```

---

## Marcos de Desenvolvimento

### ✅ Marco 0 — A origem: da ideia ao primeiro protótipo
**Data:** Março de 2026
**Status:** Concluído

**O que foi feito:** Tudo começou quando o Colégio Contemporâneo divulgou o HackaNAV 2026 — uma competição nacional de inovação tecnológica para estudantes do 8º e 9º anos, promovida pelo programa Nave a Vela. O tema daquele ano era "Soluções para o Combate à Desinformação Digital". A equipe viu nessa proposta uma oportunidade real: a desinformação afeta toda a família, não só os jovens, e as ferramentas de checagem existentes são difíceis de usar. Nasceu a ideia do LUPA.

O primeiro passo foi escrever um PRD — um "Documento de Requisitos do Produto", que funciona como o roteiro de um filme antes das filmagens: lista tudo que o site precisaria ter, como funcionaria, para quem seria e quais seriam seus limites. Para escrever o PRD com qualidade, a equipe contou com o apoio de diferentes inteligências artificiais, mas todas as decisões foram da equipe. Com o roteiro em mãos, surgiu a primeira versão visual do LUPA criada na plataforma Lovable — uma versão simplificada para testar se a ideia funcionava. Com o PRD refinado, a equipe migrou para o Claude Code, dando início à versão que está no ar hoje.

**Detalhe técnico:** HackaNAV 2026 — Escola Complexo Educacional Contemporâneo, programa Nave a Vela. Microtemas cobertos: Verificação de Fatos e Fontes + Letramento Digital e Educação Midiática + Detecção de Manipulação Audiovisual. PRD elaborado com apoio de múltiplos modelos de linguagem. Protótipo inicial (baixa fidelidade) no Lovable. Versão atual (alta fidelidade) desenvolvida com Claude Code (Anthropic).

---

### ✅ Marco 1 — Estrutura inicial do projeto
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Com a ideia validada no protótipo inicial e o roteiro definido, chegou a hora de construir a versão completa. O primeiro passo foi escolher as ferramentas que dariam vida ao LUPA: uma parte que roda nos bastidores — processando análises sem que o usuário veja — e outra parte que é a interface visual na tela. É como construir uma casa: antes de erguer as paredes, é preciso fazer a planta e preparar o terreno.

**Detalhe técnico:** Servidor (backend) em Python 3.11+ com FastAPI. Interface visual (frontend) em Next.js 16 com TypeScript e TailwindCSS v4. Hospedagem no Render (servidor) e Vercel (site).

---

### ✅ Marco 2 — Análise de links de sites
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** A primeira função criada: o usuário cola o endereço de um site — chamado de URL, a sequência de letras que começa com 'https://' — e o LUPA examina uma série de sinais automáticos. O site usa conexão segura? O domínio é antigo ou foi criado recentemente? O texto usa linguagem sensacionalista? Cada sinal contribui para a pontuação final de 0 a 100.

**Detalhe técnico:** Módulo `analyzer.py` integrado ao Firecrawl (raspagem de páginas) e ao Gemini (inteligência artificial do Google para análise de texto). Respostas guardadas em memória por 24 horas para economizar chamadas à API.

---

### ✅ Marco 3 — Análise de vídeos do YouTube
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Com um link do YouTube, o LUPA vai além da página — ele acessa informações do próprio vídeo: título, descrição, nome do canal, data de publicação e estatísticas como número de visualizações. Esses dados ajudam a entender o contexto: quem publicou, quando, e como o conteúdo foi recebido pelo público.

**Detalhe técnico:** Integração com a YouTube Data API v3. O LUPA detecta automaticamente quando o link enviado é do YouTube e usa o módulo `youtube_analyzer.py` para processá-lo.

---

### ✅ Marco 4 — Envio e análise de vídeos
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** 'Upload' é a palavra em inglês para 'enviar um arquivo do seu computador para um site'. O LUPA passou a aceitar arquivos de vídeo diretamente — útil para analisar vídeos recebidos pelo WhatsApp ou baixados de outras fontes. O arquivo é analisado e apagado imediatamente após o processamento: nada fica guardado no servidor.

**Detalhe técnico:** Endpoint `/analisar-upload` com suporte a MP4, MOV, AVI, MKV e WEBM (até 100 MB). Arquivos salvos em diretório temporário do sistema operacional e deletados no bloco `finally` para garantir isolamento.

---

### ✅ Marco 5 — Análise de textos copiados
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Às vezes a desinformação chega como texto puro — uma mensagem de WhatsApp, um e-mail em cadeia, um post copiado. O LUPA aprendeu a analisar texto diretamente: o usuário cola o conteúdo suspeito na caixa de texto e recebe uma avaliação baseada em padrões de linguagem identificados por inteligência artificial.

**Detalhe técnico:** Módulo `text_analyzer.py` com análise semântica via Gemini. Aceita textos de até 20.000 caracteres. Campo opcional `origem` permite informar se o texto veio do WhatsApp, Instagram, e-mail etc.

---

### ✅ Marco 6 — Análise de fotografias e imagens
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Toda fotografia digital carrega informações invisíveis embutidas no arquivo — chamadas de metadados. Esses dados ocultos podem revelar quando a foto foi tirada, com qual câmera ou celular, qual programa foi usado para editá-la, e até a localização geográfica. O LUPA lê essas informações e apresenta alertas pedagógicos.

**Detalhe técnico:** Módulo `image_analyzer.py` usando a biblioteca Pillow para extração de EXIF (Exchangeable Image File Format). Suporte a JPG, PNG, WEBP, GIF, BMP e TIFF (até 20 MB). Links automáticos para busca reversa no Google Lens e TinEye.

---

### ✅ Marco 7 — Interface visual do site
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Com as análises funcionando nos bastidores, chegou a hora de construir o rosto do LUPA: a tela principal com abas para cada tipo de análise, animações suaves, cores que indicam o nível de risco (verde, amarelo, vermelho) e as justificativas detalhadas de cada pontuação.

**Detalhe técnico:** Componentes React com TypeScript, tema claro/escuro, design responsivo. Comunicação com o servidor via chamadas REST.

---

### ✅ Marco 8 — Jogos e modo para grupos
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Aprender a identificar desinformação pode ser divertido. O LUPA ganhou uma área de jogos com atividades interativas. O modo para grupos permite que uma turma inteira jogue ao mesmo tempo: o professor cria uma sala com um código, os alunos entram pelos celulares, e todos participam juntos como em um quiz em tempo real.

**Detalhe técnico:** Backend com WebSockets para comunicação em tempo real. Frontend com rotas `/jogos` e `/jogos/multiplayer`, gerenciamento de salas por código de 6 dígitos.

---

### ✅ Marco 9 — Biblioteca Virtual
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Uma curadoria de livros, sites, vídeos e artigos sobre desinformação e pensamento crítico, organizada por faixa etária: crianças (6–10), pré-adolescentes (11–14), adolescentes (15–17), adultos (18–59) e idosos (60+). Cada indicação foi escolhida pensando em quem vai ler.

**Detalhe técnico:** Página estática em Next.js com dados definidos no código. Campo `urlAudio` opcional prepara a estrutura para integração de resumos em áudio.

---

### ✅ Marco 10 — Páginas educacionais de apoio
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Foram criadas páginas com Glossário, Dicas de Checagem, Legislação, Histórico (registro local das análises) e Sobre o LUPA.

**Detalhe técnico:** Páginas estáticas no Next.js. Histórico usa `localStorage` do navegador — nenhum dado enviado ao servidor.

---

### ✅ Marco 11 — Abertura para desenvolvedores (API pública)
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** O LUPA abriu suas análises para quem sabe programar por meio de uma API — Interface de Programação de Aplicativos. Qualquer pessoa pode integrar as análises do LUPA em seus próprios projetos. A documentação inclui exemplos em Python, JavaScript e curl.

**Detalhe técnico:** Documentação pública em `/api`. Endpoints disponíveis: `/analisar-url`, `/analisar-upload` e `/analisar-imagem`. Rate limit de 20 requisições por IP por hora.

---

### 🔄 Marco 12 — Resumos em áudio com inteligência artificial
**Data:** Abril de 2026
**Status:** Em andamento

**O que foi feito:** Usando o NotebookLM — ferramenta gratuita do Google — o LUPA está adicionando resumos em áudio aos livros da Biblioteca Virtual para tornar o conteúdo mais acessível a quem prefere ouvir a ler.

**Detalhe técnico:** Arquivos `.m4a` em `/public/audios`. Campo `urlAudio` no tipo `Recurso`. Player nativo HTML5 exibido abaixo do card quando o arquivo está disponível.

---

### ✅ Marco 13 — Agente LUPA: jogo de aventura 2D
**Data:** Abril de 2026
**Status:** Concluído

**O que foi feito:** Um terceiro modo de jogo foi lançado: o Agente LUPA, uma aventura no estilo plataforma 2D. O jogador controla uma lupa que percorre uma cidade digital noturna e é perseguida por inimigos que representam tipos de desinformação — bots espalhadores, manchetes falsas e correntes virais. Quando um inimigo alcança o jogador, aparece uma pergunta educativa: responder certo derrota o inimigo; responder errado custa uma vida. São 3 inimigos por fase e 3 vidas disponíveis. O jogo é construído de forma que, ao "jogar novamente", as perguntas são sorteadas em ordem diferente a cada partida.

**Detalhe técnico:** Motor gráfico Phaser 3.90 rodando dentro de um `<div>` gerenciado pelo Next.js. O Phaser cuida de física, animação e controles; o React cuida dos overlays (pergunta, feedback, game over, vitória). Comunicação entre os dois usando `ref` de callbacks — evita re-renders desnecessários. Importação dinâmica com `ssr: false` para não executar o Phaser no servidor. Banco com 5 perguntas por mundo; 3 são sorteadas aleatoriamente a cada partida.

---

### ✅ Marco 14 — O falso positivo do banco de checagens
**Data:** Maio de 2026
**Status:** Concluído

**O que foi feito:** Este marco não registra uma funcionalidade nova. Registra um erro
que a equipe cometeu, descobriu e corrigiu — e que mudou a forma como o LUPA passou a
tratar suas próprias conclusões.

Desde o Marco 2, o LUPA consultava o banco de checagens do IFCN (a rede internacional de
agências de checagem de fatos) para saber se o conteúdo analisado já tinha sido
desmentido por algum verificador profissional. Quando encontrava uma checagem negativa,
descontava 30 pontos da nota. Parecia o sinal mais confiável de todos: não era o LUPA
julgando, era uma agência especializada.

Ao testar o sistema com sites conhecidos, a capitã da equipe percebeu algo estranho:
portais de notícia grandes e legítimos, como globo.com e uol.com, estavam recebendo
notas baixas. Levou o caso aos outros integrantes. A causa apareceu na investigação: ao
analisar a **página inicial** de um portal, o LUPA pesquisava no banco de checagens pelo
nome do portal — e recebia de volta checagens que apenas *mencionavam* aquele portal,
muitas vezes desmentindo boatos que usavam o nome dele indevidamente. O LUPA lia isso
como "esse site foi desmentido" e punia justamente quem tinha sido vítima da
desinformação.

A primeira reação foi de frustração. A consulta ao IFCN era o recurso mais interessante
do analisador, e a equipe chegou a considerar abandoná-la. O pai da capitã, que
acompanhava os testes, sugeriu remover essa análise do escopo do sistema. A equipe
discordou: preferiu procurar uma solução que preservasse o recurso. O professor
orientador apoiou a busca e disse que, se não desse certo, não haveria problema, porque
o site já estava bom.

A solução veio em duas partes, no mesmo dia. Primeiro, o LUPA deixou de consultar o banco
de checagens para páginas iniciais de portais, passando a fazê-lo apenas para páginas
internas — onde existe um conteúdo específico a ser checado. Depois, foi criado um filtro
de relevância: uma checagem só passa a valer se o texto dela tiver pelo menos duas
palavras de cinco ou mais letras em comum com o conteúdo analisado. Sem isso, é
descartada.

Oito dias depois veio o desdobramento menos óbvio. A equipe percebeu que o erro não
estava só no código — estava no raciocínio. O LUPA tinha tratado um **sinal de alerta**
como se fosse uma **prova**, que é exatamente o erro que a desinformação explora nas
pessoas. Isso levou a uma mudança que não tem relação técnica com o problema original:
quando uma análise resulta em nota 100, o LUPA passou a exibir um aviso lembrando que
nota máxima não significa certeza absoluta. O projeto passou a aplicar em si mesmo o que
ensina.

**Detalhe técnico:** Módulo `fact_check.py`. A função `avaliar_impacto()` aplicava −30
pontos a uma checagem negativa, sobre uma pontuação que começa em 50
(`PONTUACAO_INICIAL`, em `analyzer.py`) — o suficiente para levar um portal legítimo à
faixa "Suspeito". Correções nos commits `8f8af76` e `23f109d`, ambos de 01/05/2026: o
primeiro restringe a consulta a páginas internas; o segundo acrescenta a função
`filtrar_relevantes()`, que exige interseção mínima de duas palavras com 5+ caracteres
entre a checagem e o conteúdo. O aviso de nota máxima veio no commit `ccfe7a7`, de
09/05/2026. O comentário que explica a decisão está preservado em `analyzer.py`, junto ao
trecho da consulta.

---

*Próxima entrada a adicionar aqui quando um novo marco for concluído.*
