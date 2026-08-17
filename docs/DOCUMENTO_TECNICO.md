# Documento Técnico — Projeto LUPA

> **Leitor de URLs, Plataformas e Audiovisuais**
> Versão do documento: 1.0 — 09 de maio de 2026
> Autoria: Equipe LUPA
> Edital de referência: HackaNAV 2026

---

## Sumário

1. [Resumo executivo](#1-resumo-executivo)
2. [Contexto e fundamentação](#2-contexto-e-fundamentação)
3. [Objetivos e escopo](#3-objetivos-e-escopo)
4. [Arquitetura geral](#4-arquitetura-geral)
5. [Stack tecnológica](#5-stack-tecnológica)
6. [Estrutura do repositório](#6-estrutura-do-repositório)
7. [Backend — FastAPI](#7-backend--fastapi)
8. [Frontend — Next.js](#8-frontend--nextjs)
9. [Fluxo passo a passo de uma análise](#9-fluxo-passo-a-passo-de-uma-análise)
10. [Sistema de pontuação 0–100](#10-sistema-de-pontuação-0100)
11. [Integrações externas](#11-integrações-externas)
12. [Banco de dados — Supabase](#12-banco-de-dados--supabase)
13. [Camada educacional e viés colaborativo](#13-camada-educacional-e-viés-colaborativo)
14. [Segurança e privacidade](#14-segurança-e-privacidade)
15. [Hospedagem e deploy](#15-hospedagem-e-deploy)
16. [Decisões de design](#16-decisões-de-design)
17. [Limitações conhecidas](#17-limitações-conhecidas)
18. [Roteiro de evolução](#18-roteiro-de-evolução)
19. [Como rodar localmente](#19-como-rodar-localmente)
20. [Mapeamento aos critérios do edital HackaNAV](#20-mapeamento-aos-critérios-do-edital-hackanav)
21. [Referências](#21-referências)

---

## 1. Resumo executivo

**LUPA** é uma plataforma web educativa de combate à desinformação, desenvolvida para a Feira Tecnológica HackaNAV 2026. O sistema recebe um conteúdo digital — uma URL de site, um vídeo do YouTube, uma imagem ou um texto colado — e devolve uma **pontuação de confiabilidade de 0 a 100** acompanhada de justificativas detalhadas, classificadas em três faixas:

| Faixa | Classificação | Cor |
|---|---|---|
| 0–30 | Suspeito | `#B71C1C` (vermelho) |
| 31–70 | Requer Atenção | `#FFC107` (amarelo) |
| 71–100 | Confiável | `#4CAF50` (verde) |

O LUPA não é um juiz da verdade. É uma **ferramenta de apoio à checagem** que ensina o usuário a olhar para um conteúdo digital com mais cuidado. A pontuação vem sempre acompanhada das razões que a geraram, e a interface reforça em vários pontos que **nota máxima não significa confiabilidade absoluta**.

O sistema combina dez analisadores próprios (HTTPS, idade do domínio, clickbait, sensacionalismo, etc.) com seis APIs externas especializadas (Gemini, VirusTotal, Google Fact Check Tools, Wayback Machine, Firecrawl e YouTube Data API). Inclui ainda uma camada educacional ampla — Agente LUPA com cinco mundos temáticos, três mini-jogos autônomos, biblioteca virtual com mais de 20 recursos, modo professor com gestão de turmas, portal comunitário georreferenciado para reportar boatos locais, e um portal de validação onde a sociedade pode avaliar a ferramenta.

O LUPA foi elaborado **em estrita aderência aos cinco critérios do edital HackaNAV** (Pensamento Complexo, Curiosidade Artístico-Científica, Intenção Criativa, Construção Colaborativa e Letramento Tecnológico). Cada decisão de produto, do conjunto de páginas à estrutura dos jogos, foi pensada para evidenciar pelo menos um desses critérios — o mapeamento completo está no capítulo 20.

---

## 2. Contexto e fundamentação

### 2.1 O problema da desinformação no Brasil

Pesquisa do **DataSenado (2023)** mostra que **72% dos brasileiros estão muito preocupados** com a quantidade de notícias falsas circulando nas redes sociais. Estudo da revista **Science (Vosoughi, Roy & Aral, 2018)** demonstrou que notícias falsas no Twitter alcançam 1.500 pessoas **6 vezes mais rápido** do que notícias verdadeiras — e que a difusão é majoritariamente humana, não automatizada.

A desinformação tem custos concretos:
- **Saúde pública**: campanhas anti-vacina derivadas de boatos prolongaram a pandemia de COVID-19.
- **Eleições**: episódios em 2018, 2022 e 2024 foram marcados por ondas coordenadas de conteúdo falso.
- **Segurança comunitária**: linchamentos motivados por boatos de WhatsApp em cidades pequenas, inclusive no Rio Grande do Norte.

### 2.2 Lacuna educacional

Apesar da gravidade do problema, **letramento midiático ainda é raro nos currículos da educação básica brasileira**. Os professores que se interessam pelo tema costumam não ter material pronto: precisam montar atividades do zero, traduzir referências internacionais e improvisar. O LUPA endereça essa lacuna oferecendo:

- Uma ferramenta gratuita e em português que professores podem levar para a sala de aula sem cadastro nem fricção.
- Conteúdo pedagógico estruturado (Agente LUPA, mini-jogos, biblioteca, dicas) que dispensa preparação prévia.
- Modo Professor com gestão de turmas, código de acesso para alunos e painel de desempenho.

### 2.3 Princípios pedagógicos

O design do LUPA segue três princípios consolidados na literatura sobre combate à desinformação:

1. **Prebunking (inoculação psicológica)** — antes de o usuário encontrar uma fake news, expô-lo às *técnicas* usadas para fabricar desinformação. A página `/neurobiologia` e o mundo Manipulação de Imagem do Agente LUPA aplicam esse princípio.
2. **Letramento midiático ativo** — em vez de só dar a resposta, ensinar o método. O sistema sempre devolve a pontuação **junto** com as justificativas, e tem o método SIFT (`/metodo-sift`) explicado passo a passo.
3. **Linguagem neutra** — o LUPA evita termos com julgamento moral ("fake", "mentira"). Usa "suspeito", "requer atenção" e "confiável" para preservar a autonomia crítica do usuário.

---

## 3. Objetivos e escopo

### 3.1 O que o LUPA faz

- Analisa **URLs de sites** com 12 verificações combinadas, devolvendo pontuação 0–100, justificativas, dicas personalizadas e fontes confiáveis sugeridas.
- Analisa **vídeos do YouTube** extraindo metadados do canal e a transcrição do vídeo, e enviando o conteúdo para análise por IA.
- Analisa **vídeos enviados pelo usuário** (até 100 MB) com extração de metadados e transcrição.
- Analisa **imagens** com leitura de EXIF, detecção de adulteração via ELA (Error Level Analysis), detecção de imagens geradas por IA via GHOST e interpretação semântica via Gemini.
- Analisa **textos colados** (mensagens de WhatsApp, posts, etc.) com análise semântica do Gemini e busca de fontes complementares na web.
- **Educa** com Agente LUPA (5 mundos), 3 mini-jogos autônomos, biblioteca virtual, dicas de checagem, fontes confiáveis, glossário, página sobre neurobiologia da desinformação e método SIFT.
- **Conecta** a comunidade com portal de boatos locais com mapa georreferenciado, portal de colaboração com sugestões e respostas públicas, e modo professor com gestão de turmas.
- **Coleta** validação de usuários reais com formulário público e moderação interna dos depoimentos.

### 3.2 O que o LUPA NÃO faz

- **Não afirma verdade absoluta**. Toda pontuação é apresentada como ponto de partida para checagem humana.
- **Não armazena dados pessoais**. Não há login obrigatório, e os arquivos enviados (vídeos, imagens) são apagados imediatamente após a análise.
- **Não substitui agências de checagem profissionais** como Aos Fatos, Agência Lupa ou AFP Checamos — o LUPA aponta para essas agências quando relevante.
- **Não funciona como filtro automático ou bloqueio**. Cada usuário decide o que fazer com a informação devolvida.

---

## 4. Arquitetura geral

O LUPA segue uma arquitetura cliente-servidor com separação clara entre apresentação, processamento e dados, e dependência controlada de APIs externas.

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENTE                                                        │
│  Navegador do usuário (desktop, tablet, celular)                │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND — Next.js 14 + TypeScript + Tailwind                  │
│  Hospedagem: Vercel (CDN global)                                │
│  Responsabilidades:                                             │
│   • Renderizar páginas (37 rotas)                               │
│   • Receber input do usuário                                    │
│   • Chamar a API do backend                                     │
│   • Apresentar resultados com cores/ícones/animações            │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS — JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND — Python 3.11 + FastAPI                                │
│  Hospedagem: Render                                             │
│  Responsabilidades:                                             │
│   • Validar entrada (Pydantic)                                  │
│   • Orquestrar 12 verificações de análise                       │
│   • Consultar APIs externas                                     │
│   • Persistir dados que precisam durar                          │
│   • Devolver pontuação + justificativas                         │
└────────┬───────────────────────────────────────────┬────────────┘
         │                                           │
         ▼                                           ▼
┌──────────────────┐                ┌──────────────────────────────┐
│  PERSISTÊNCIA    │                │  APIs EXTERNAS               │
│  Supabase        │                │  • Gemini (Google AI)        │
│  PostgreSQL      │                │  • Firecrawl                 │
│                  │                │  • VirusTotal                │
│  10 tabelas:     │                │  • YouTube Data API v3       │
│  boatos          │                │  • Google Fact Check Tools   │
│  sugestoes       │                │  • Wayback Machine (CDX)     │
│  feedbacks       │                │  • Tavily (busca web)        │
│  validacoes      │                │                              │
│  parcerias       │                └──────────────────────────────┘
│  turmas          │
│  alunos          │
│  analises_aluno  │
│  salas (jogos)   │
│  jogadores       │
└──────────────────┘
```

**Pontos-chave da arquitetura:**

- **Stateless por análise**: o backend não guarda contexto entre requisições. Cada análise é independente.
- **Cache em memória de 24 h**: análises de URL idênticas reutilizam o resultado, economizando chamadas pagas a APIs.
- **Tolerância a falhas**: se uma API externa estiver fora do ar ou sem chave configurada, o módulo correspondente é silenciosamente pulado e a análise continua.
- **CORS restrito**: o backend só aceita chamadas dos domínios da Vercel e do localhost de desenvolvimento.
- **Rate limiting**: cada IP é limitado a um número fixo de requisições por hora por endpoint, protegendo a cota das APIs pagas.

---

## 5. Stack tecnológica

### 5.1 Frontend

| Tecnologia | Versão | Papel | Justificativa |
|---|---|---|---|
| Next.js | 14 | Framework React com SSR/SSG, roteamento por pastas | Renderização rápida, SEO nativo, deploy direto no Vercel |
| TypeScript | 5.x | Tipagem estática sobre JavaScript | Reduz bugs em runtime e documenta contratos |
| Tailwind CSS | 3.x | Estilização por classes utilitárias | Sem arquivos CSS separados; dark mode nativo |
| Lucide React | recente | Biblioteca de ícones SVG | Ícones consistentes em toda a interface |

### 5.2 Backend

| Tecnologia | Versão | Papel | Justificativa |
|---|---|---|---|
| Python | 3.11+ | Linguagem principal | Ecossistema rico para IA, NLP e processamento de mídia |
| FastAPI | 0.115 | Framework web | Documentação OpenAPI automática, validação Pydantic, async |
| Uvicorn | 0.32 | Servidor ASGI | Suporta async/await; usado pela FastAPI |
| Pydantic | 2.9 | Validação e serialização de dados | Define contratos claros entre frontend e backend |
| Requests | 2.32 | Cliente HTTP síncrono | Chamar APIs externas e baixar páginas |
| BeautifulSoup4 + lxml | 4.12 / 5.3 | Parsing de HTML | Extrair título, links, texto de páginas |
| python-whois | 0.9 | Consulta WHOIS | Idade do domínio |
| Pillow | 10.4 | Leitura de EXIF e processamento de imagem | Análise de fotos |
| hachoir | 3.3 | Metadados de vídeo | Análise de uploads |
| youtube-transcript-api | 1.2 | Transcrição de vídeos | Texto para análise por IA |
| python-dotenv | 1.0 | Carregar .env | Gerenciar segredos |
| slowapi | 0.1.9 | Rate limiting por IP | Proteger contra abuso |
| python-multipart | 0.0.26 | Upload via formulário | Receber arquivos no FastAPI |
| pytest + httpx | 8.3 / 0.28 | Framework de testes | Testes automatizados do backend |

### 5.3 Banco de dados

| Tecnologia | Papel |
|---|---|
| Supabase | PostgreSQL gerenciado em nuvem com REST API automática, painel visual e autenticação embutida (não usada no MVP) |
| PostgreSQL | Banco relacional para boatos, turmas, feedbacks, parcerias e avaliações |

### 5.4 Hospedagem e CI/CD

| Plataforma | Função |
|---|---|
| Vercel | Hospedagem do frontend; CDN global; deploy automático a cada push na branch `main` |
| Render | Hospedagem do backend Python; variáveis de ambiente seguras; reinício automático em falha |
| GitHub | Controle de versão centralizado; aciona simultaneamente Vercel e Render via webhook |

---

## 6. Estrutura do repositório

```
LUPA/
├── backend/                    Código Python (FastAPI)
│   ├── main.py                 Entrada da API: rotas, CORS, rate limit, cache
│   ├── analyzer.py             Orquestrador das 12 verificações de URL
│   ├── text_analyzer.py        Análise de textos via Gemini + busca web
│   ├── image_analyzer.py       EXIF + ELA + GHOST + Gemini visual
│   ├── youtube_analyzer.py     Metadados de canal + transcrição + Gemini
│   ├── youtube.py              Detecção e parsing de URLs do YouTube
│   ├── upload_analyzer.py      Vídeos enviados pelo usuário (até 100 MB)
│   ├── fact_check.py           Google Fact Check Tools API (banco IFCN)
│   ├── virustotal.py           Verificação de phishing/malware (70+ engines)
│   ├── wayback.py              Histórico de domínio no Internet Archive
│   ├── summary.py              Resumo automático de páginas via Gemini
│   ├── tips.py                 Dicas de checagem personalizadas
│   ├── web_search.py           Busca de fontes complementares (Tavily)
│   ├── boatos.py               CRUD do portal comunitário (Supabase)
│   ├── sugestoes.py            CRUD do portal de colaboração
│   ├── feedback.py             Coleta de feedback do usuário
│   ├── parceria.py             Solicitações de parceria escolar
│   ├── validacao.py            Avaliações públicas de usuários
│   ├── turma.py                Modo Professor: turmas, alunos, painel
│   ├── multiplayer.py          Salas de jogos cooperativos em tempo real
│   ├── seed_boatos.py          Script de carga inicial de boatos do RN
│   ├── db.py                   Cliente HTTP do Supabase
│   ├── tests/                  Testes pytest (analyzer, tips)
│   ├── requirements.txt        Dependências Python
│   └── .env                    Segredos locais (NÃO commitado)
│
├── frontend/                   Código Next.js
│   └── app/                    App Router do Next.js (cada pasta é uma rota)
│       ├── page.tsx            Home — entrada principal de análise
│       ├── tecnico/            Documentação técnica visual
│       ├── validacao/          Avaliação pelos usuários
│       ├── pesquisa/           Estatísticas e dados sobre desinformação
│       ├── neurobiologia/      Como o cérebro reage à desinformação
│       ├── metodo-sift/        Stop, Investigate, Find, Trace
│       ├── glossario/          Termos técnicos do tema
│       ├── dicas-de-checagem/  8 dicas + bots + deepfake + calculador
│       ├── fontes-confiaveis/  Lista curada de agências e veículos
│       ├── biblioteca/         20+ livros e artigos por faixa etária
│       ├── comunidade/         Portal de boatos do RN com mapa
│       ├── colaboracao/        Sugestões da comunidade
│       ├── moderacao/          Painel administrativo (protegido)
│       ├── professor/          Modo Professor: criar/acessar turma
│       ├── jogos/              Hub de jogos
│       │   ├── aventura/       Agente LUPA — mundo 1 (Fake News)
│       │   ├── phishing/       Caça ao Phishing
│       │   ├── engenharia-social/  Detetive da Engenharia Social
│       │   ├── verdadeiro-ou-suspeito/  Mini-jogo de cards
│       │   └── multiplayer/    Salas multiplayer em tempo real
│       ├── jogo/               Mundos do Agente LUPA (1 a 5)
│       ├── sobre/              Sobre o projeto (transparência do algoritmo)
│       ├── equipe/             Quem fez o LUPA
│       ├── futuro/             Visão de longo prazo
│       ├── evolucao/           Linha do tempo do desenvolvimento
│       ├── api/                Documentação da API aberta
│       ├── historico/          Histórico de análises (local)
│       ├── legislacao/         Leis brasileiras sobre desinformação
│       └── acesso/             Proteção por senha (etapa de testes)
│
├── docs/
│   ├── PRD.pdf                 Requisitos do produto (07/04/2026)
│   └── DOCUMENTO_TECNICO.md    Este arquivo
│
├── plan.md                     Plano de desenvolvimento por fases
└── CLAUDE.md                   Instruções permanentes para o assistente IA
```

---

## 7. Backend — FastAPI

### 7.1 Inicialização da aplicação

`main.py` é o arquivo de entrada. Ele:

1. Carrega variáveis de ambiente do `.env` antes de qualquer outro import (necessário porque módulos como `analyzer.py` checam variáveis no momento do import).
2. Cria a aplicação FastAPI com título, descrição e versão.
3. Configura **CORS** (Cross-Origin Resource Sharing) restrito aos domínios da Vercel e do localhost.
4. Inicializa o **rate limiter** (slowapi) com chave por IP.
5. Inclui o roteador `multiplayer_router` (módulo separado para salas de jogo).
6. Define o **cache em memória** com TTL de 24 horas para análises de URL.

### 7.2 Modelos Pydantic (contratos da API)

Todos os endpoints usam modelos Pydantic para validação. Os principais:

- **`PedidoAnalise`** — entrada do POST `/analisar-url`. Campo: `url` (str).
- **`PedidoTexto`** — entrada do POST `/analisar-texto`. Campos: `texto`, `origem`, `suspeita`.
- **`RespostaAnalise`** — saída padrão para análises de URL/texto/vídeo. Inclui pontuação, classificação, cor, justificativas, dicas e fontes.
- **`RespostaImagem`** — saída específica de imagens (EXIF + alertas + análise visual).
- **`JustificativaResposta`** — uma linha do relatório: critério, resultado, impacto, camada (`fonte`/`conteudo`/`geral`).

### 7.3 Endpoints implementados

| Método | Rota | Limite | Função |
|---|---|---|---|
| `GET` | `/` | — | Mensagem de boas-vindas |
| `GET` | `/docs` | — | Documentação Swagger automática (FastAPI) |
| `POST` | `/analisar-url` | 20/h | Analisa URL de site ou YouTube |
| `POST` | `/analisar-upload` | 10/h | Analisa vídeo enviado pelo usuário |
| `POST` | `/analisar-texto` | 20/h | Analisa texto colado |
| `POST` | `/analisar-imagem` | 20/h | Analisa imagem enviada |
| `GET` | `/boatos` | — | Lista boatos do portal comunitário |
| `POST` | `/boatos` | 10/h | Reporta novo boato |
| `PATCH` | `/boatos/{id}` | — | Modera boato (requer chave) |
| `GET` | `/sugestoes` | — | Lista sugestões públicas |
| `GET` | `/sugestoes/interno` | — | Lista sugestões com email (requer chave) |
| `POST` | `/sugestoes` | 5/h | Envia nova sugestão |
| `PATCH` | `/sugestoes/{id}` | — | Publica resposta da equipe (requer chave) |
| `POST` | `/feedback` | 20/h | Registra feedback de dificuldade |
| `GET` | `/feedbacks` | — | Lista feedbacks (uso interno) |
| `POST` | `/parcerias` | 5/h | Solicita parceria escolar |
| `GET` | `/parcerias` | — | Lista solicitações de parceria |
| `POST` | `/validacoes` | 10/h | Registra avaliação de usuário |
| `GET` | `/validacoes` | — | Lista avaliações (requer chave) |
| `PATCH` | `/validacoes/{id}` | — | Aprova/rejeita depoimento (requer chave) |
| `GET` | `/validacoes/resultados` | — | Estatísticas agregadas e depoimentos aprovados |
| `POST` | `/turmas` | 10/h | Cria turma (Modo Professor) |
| `POST` | `/turmas/{codigo}/analises` | 60/h | Registra análise de aluno |
| `GET` | `/turmas/{codigo}/painel` | — | Painel da turma (requer chave) |
| `GET` | `/turmas/buscar` | — | Busca turmas (requer chave moderação) |
| `WS` | `/ws/sala/{codigo}` | — | WebSocket para sala multiplayer |

**Proteção por chave**: endpoints de moderação exigem o cabeçalho HTTP `X-Moderacao-Chave` com valor configurado em `MODERACAO_CHAVE`. Endpoints de turma exigem `X-Turma-Chave` (gerada por turma).

### 7.4 Módulos analisadores (resumo)

| Módulo | Responsabilidade |
|---|---|
| `analyzer.py` | Orquestrador. Executa 12 verificações em sequência, acumula justificativas, compõe pontuação final. |
| `text_analyzer.py` | Análise semântica de texto via Gemini com prompt estruturado. Confronta a "suspeita do usuário" com o conteúdo. Busca fontes complementares. |
| `image_analyzer.py` | Pipeline em 3 etapas: (1) EXIF para data/câmera/GPS; (2) ELA multi-qualidade para detectar adulterações; (3) Gemini visual com prompt expandido para deepfake/IA. |
| `youtube_analyzer.py` | Obtém metadados do canal e a transcrição do vídeo via API do YouTube; envia ao Gemini para análise textual. |
| `upload_analyzer.py` | Valida formato e tamanho do arquivo; extrai metadados via hachoir; transcreve áudio (Whisper local ou API); aplica análise textual. |
| `fact_check.py` | Consulta a Google Fact Check Tools API. Filtra resultados por relevância, pondera o veredito de cada agência IFCN e devolve impacto + texto. |
| `virustotal.py` | Submete a URL ao VirusTotal e lê o veredito de 70+ mecanismos antivírus. Penaliza URLs com qualquer flag de phishing/malware. |
| `wayback.py` | Consulta a API CDX do Internet Archive para estimar há quanto tempo o domínio aparece arquivado. Útil quando o WHOIS está oculto. |
| `summary.py` | Pede ao Gemini um resumo de até 3 frases da página, neutro e descritivo. |
| `tips.py` | Gera dicas de checagem **personalizadas** com base nas justificativas com impacto negativo. |
| `web_search.py` | Busca artigos relacionados via Tavily quando a análise é de texto colado, para sugerir fontes externas. |

---

## 8. Frontend — Next.js

### 8.1 Padrão arquitetural

O frontend usa o **App Router** do Next.js 14: cada pasta dentro de `frontend/app/` é uma rota acessível via URL. Páginas estáticas (sem interação dinâmica) são **Server Components** por padrão — renderizadas no servidor e servidas como HTML pronto, com excelente performance e SEO. Páginas interativas (resultado de análise, formulários, jogos) são marcadas com `"use client"`.

### 8.2 Mapa de páginas

| Categoria | Rota | Função |
|---|---|---|
| **Análise** | `/` | Home: campo de URL, paste de texto, upload de imagem/vídeo |
| **Educação** | `/dicas-de-checagem` | 8 dicas + sinais de bots + deepfake + calculador |
| | `/metodo-sift` | Stop, Investigate, Find, Trace |
| | `/neurobiologia` | Como o cérebro reage à desinformação (prebunking) |
| | `/glossario` | Termos técnicos explicados |
| | `/fontes-confiaveis` | Agências e veículos curados |
| | `/biblioteca` | 20+ livros/artigos por faixa etária |
| | `/legislacao` | Leis brasileiras relevantes |
| **Jogos** | `/jogos` | Hub central de jogos |
| | `/jogos/aventura` ou `/jogo` | Agente LUPA (5 mundos) |
| | `/jogos/phishing` | Caça ao Phishing |
| | `/jogos/engenharia-social` | Detetive da Engenharia Social |
| | `/jogos/verdadeiro-ou-suspeito` | Cards de afirmações |
| | `/jogos/multiplayer` | Salas em tempo real (WebSocket) |
| **Comunidade** | `/comunidade` | Portal de boatos do RN com mapa |
| | `/colaboracao` | Sugestões + respostas da equipe |
| **Educadores** | `/professor` | Criar/acessar turma |
| | `/professor/turma` | Painel de desempenho da turma |
| **Validação** | `/validacao` | Formulário de avaliação pública |
| | `/moderacao` | Painel administrativo (chave) |
| **Transparência** | `/sobre` | Princípios e algoritmo |
| | `/tecnico` | Arquitetura visual |
| | `/equipe` | Quem fez |
| | `/evolucao` | Linha do tempo do projeto |
| | `/futuro` | Visão de longo prazo |
| | `/api` | Documentação da API aberta |
| | `/historico` | Histórico local (localStorage) |

### 8.3 Padrões de UI

- **Modo claro/escuro nativo** — todas as páginas têm classes `dark:` do Tailwind.
- **Animações**: `animate-fade-in-up` em cards (entrada), `hover:-translate-y-0.5` (elevação ao passar o mouse).
- **Cores semânticas das pontuações**: verde (`emerald`), amarelo (`amber`), vermelho (`red`), todas com tons claros/escuros.
- **Layout responsivo**: container `max-w-3xl` ou `max-w-4xl`, `grid-cols-1 sm:grid-cols-2` em listas.
- **Acessibilidade**: contraste WCAG AA, navegação por teclado, ícones decorativos com `aria-hidden`.

---

## 9. Fluxo passo a passo de uma análise

Exemplo concreto: o usuário cola `https://exemplo.com/noticia-suspeita` no campo da home e clica em **Analisar**.

### Etapa 1 — Submissão (frontend)

`frontend/app/page.tsx` envia uma requisição:

```http
POST https://lupa-backend.onrender.com/analisar-url
Content-Type: application/json

{ "url": "https://exemplo.com/noticia-suspeita" }
```

### Etapa 2 — Validação e cache (backend)

`main.py:endpoint_analisar_url`:

1. Valida o JSON contra `PedidoAnalise` (Pydantic).
2. Aplica rate limit: o IP só pode pedir 20 análises por hora.
3. Normaliza a URL para minúsculas e consulta o cache em memória.
4. Se houve análise nas últimas 24 h, devolve direto.
5. Se a URL é do YouTube, encaminha para `analisar_youtube`. Senão, chama `analisar_url`.

### Etapa 3 — Análise (analyzer.py)

`analyzer.py:analisar_url` executa sequencialmente:

1. **Verificação de DNS** — se o domínio não existe, devolve "Indisponível" e encerra.
2. **Inicia com 50 pontos** de base (registrado na lista de justificativas).
3. **HTTPS** (+10 / −10).
4. **Idade do domínio** via WHOIS (+15 se ≥5 anos, +10 se ≥2, −15 se <1).
5. **Download da página** via Firecrawl (preferencial) ou requests (fallback).
6. **Clickbait no título** (−20 se encontrar palavras como "bombástico", "chocante").
7. **Maiúsculas no título** (−10 se >50% das letras forem maiúsculas).
8. **Páginas institucionais** (+10 se houver "Sobre"/"Contato", −5 se não).
9. **Referências externas** (+10 se ≥3 links saem para outros domínios).
10. **Sensacionalismo no corpo** (−15 se ≥3 ocorrências).
11. **Excesso de exclamações** (−10 se >2% das palavras).
12. **CAIXA ALTA no corpo** (−10 se >2% das palavras).
13. **Banco IFCN (Google Fact Check)** — só para páginas internas, não home.
14. **VirusTotal** — penaliza se a URL aparece em listas de phishing/malware.
15. **Wayback Machine** — verifica há quanto tempo o domínio é arquivado.
16. **Resumo automático** via Gemini (`summary.py`).

### Etapa 4 — Composição da pontuação

`_montar_resultado` aplica `max(0, min(100, pontuacao))` e classifica:

- 0–30 → `"Suspeito"` cor `#B71C1C`
- 31–70 → `"Requer Atenção"` cor `#FFC107`
- 71–100 → `"Confiável"` cor `#4CAF50`

Em seguida, `tips.py` gera dicas personalizadas com base nas justificativas negativas, e `sugerir_fontes` adiciona fontes confiáveis adequadas à faixa.

### Etapa 5 — Resposta

O backend devolve um JSON com pontuação, classificação, cor, título da página, resumo, lista de justificativas (cada uma com critério, resultado, impacto e camada `fonte`/`conteudo`/`geral`), dicas e fontes.

### Etapa 6 — Apresentação

O frontend renderiza:

- O **número grande** com a pontuação, com a cor da classificação.
- Se a pontuação for exatamente **100**, exibe disclaimer reforçando que nota máxima não significa confiabilidade absoluta.
- A **lista de justificativas** agrupada por camada, com o impacto numérico.
- **Dicas personalizadas** de checagem.
- **Fontes confiáveis** sugeridas para cruzar a informação.

---

## 10. Sistema de pontuação 0–100

### 10.1 Filosofia

A pontuação não é uma decisão de uma IA caixa-preta. É uma **soma transparente de impactos** que o usuário pode reproduzir mentalmente. Cada checagem contribui com um valor positivo ou negativo, e o resultado é o ponto de partida (50) somado aos impactos, limitado a 0–100.

### 10.2 Tabela de pesos (URL)

| Critério | Faixa de impacto | Camada |
|---|---|---|
| Pontuação inicial | +50 | geral |
| HTTPS | +10 / −10 | fonte |
| Idade do domínio | +15 / +10 / 0 / −15 | fonte |
| Clickbait no título | −20 ou 0 | conteúdo |
| Maiúsculas no título | −10 ou 0 | conteúdo |
| Páginas institucionais | +10 ou −5 | fonte |
| Referências externas | +10 ou 0 | conteúdo |
| Sensacionalismo no corpo | −15 ou 0 | conteúdo |
| Excesso de exclamações | −10 ou 0 | conteúdo |
| Caixa alta no corpo | −10 ou 0 | conteúdo |
| Fact Check (IFCN) | −30 a +20 | fonte |
| VirusTotal | −40 a 0 | fonte |
| Wayback Machine | −10 a +10 | fonte |

### 10.3 Camadas

Cada justificativa tem uma **camada** (conforme PRD §9):

- **Fonte** — quem publicou (HTTPS, idade, instituição, segurança).
- **Conteúdo** — o que está escrito (clickbait, sensacionalismo, referências).
- **Geral** — mecânica (pontuação base, limitações).

A separação por camadas permite que o usuário entenda **se o problema é o emissor ou a mensagem** — distinção pedagógica importante, pois um veículo confiável pode publicar uma matéria fraca, e um veículo desconhecido pode publicar uma matéria sólida.

---

## 11. Integrações externas

| API | Função | Chave? | Custo no MVP |
|---|---|---|---|
| **Gemini (Google AI Studio)** | Análise textual, visual (imagens) e de transcrição. Modelo `gemini-2.0-flash`. | Sim | Tier gratuito generoso |
| **Firecrawl** | Renderização de páginas com JavaScript (sites em React/Vue) e bypass de anti-bot leve. | Sim | Tier gratuito 500 req/mês |
| **YouTube Data API v3** | Metadados de canal e vídeo (data de criação, descrição, padrão de publicação). | Sim | 10.000 unidades/dia gratuitas |
| **Google Fact Check Tools** | Banco IFCN (International Fact-Checking Network) com checagens de 100+ agências. | Sim | Gratuito |
| **VirusTotal** | Reputação de URL em 70+ mecanismos antivírus e anti-phishing. | Sim | 4 req/min, 500/dia gratuitas |
| **Wayback Machine (CDX API)** | Histórico de captura do domínio no Internet Archive. | Não | Gratuito |
| **Tavily** (busca web) | Busca de artigos relacionados ao texto colado. | Sim | 1.000 req/mês gratuitas |
| **Supabase REST** | Leitura/escrita do banco de dados. | Sim | 500 MB grátis |

**Estratégia de tolerância a falhas**: cada chamada externa é precedida de `os.getenv(CHAVE)`. Se a chave não estiver configurada, o módulo é silenciosamente pulado. Se a API responder com erro, o módulo retorna impacto 0 e segue. Isso garante que **o LUPA nunca quebra por causa de uma API externa**.

---

## 12. Banco de dados — Supabase

O Supabase oferece PostgreSQL gerenciado com REST API automática. O cliente em `backend/db.py` usa apenas a biblioteca `requests` (sem `supabase-py`) para evitar incompatibilidades com o novo formato de chaves.

### 12.1 Tabelas

| Tabela | Função | Campos principais |
|---|---|---|
| `boatos` | Boatos reportados pela comunidade | `id`, `titulo`, `descricao`, `categoria` (cidade/escola/condominio), `local`, `latitude`, `longitude`, `status`, `checagem`, `criado_em` |
| `sugestoes` | Sugestões e relatos da comunidade | `id`, `nome`, `email`, `mensagem`, `tipo`, `resposta`, `respondido_em`, `criado_em` |
| `feedbacks` | Cliques no widget de dificuldade | `id`, `pagina`, `mensagem`, `criado_em` |
| `parcerias` | Solicitações de parceria escolar | `id`, `nome_professor`, `email`, `escola`, `cidade`, `mensagem`, `criado_em` |
| `validacoes` | Avaliações de usuários sobre o LUPA | `id`, `nome`, `idade`, `nota`, `depoimento`, `aprovado`, `criado_em` |
| `turmas` | Turmas criadas por professores | `id`, `codigo` (público), `chave` (privada hash), `nome_turma`, `nome_professor`, `escola`, `criado_em` |
| `analises_aluno` | Análises feitas por alunos vinculadas a turma | `id`, `turma_id`, `nome_aluno`, `tipo`, `pontuacao`, `criado_em` |
| `salas` | Salas multiplayer de jogo | `codigo`, `nome_jogo`, `estado`, `criado_em` |
| `jogadores` | Participantes em salas | `id`, `sala_codigo`, `nome`, `pontuacao`, `criado_em` |

### 12.2 Acesso

Todos os endpoints administrativos exigem o cabeçalho **`X-Moderacao-Chave`** com o valor de `MODERACAO_CHAVE` do `.env`. Endpoints de turma usam **`X-Turma-Chave`** (chave única gerada por turma, mostrada apenas uma vez ao professor — não recuperável).

### 12.3 Política de dados

- **Sem login obrigatório**: endereços IP não são vinculados a usuários.
- **Boatos**: o nome do reportador é opcional.
- **Validações**: o depoimento só aparece publicamente após aprovação manual em `/moderacao`.
- **Feedbacks** e **sugestões**: armazenam apenas o que o usuário escolheu enviar.

---

## 13. Camada educacional e viés colaborativo

O LUPA não é apenas um analisador — é um **ambiente educacional completo** sobre desinformação. Esta seção descreve a camada pedagógica e como a colaboração da comunidade é estrutural ao projeto.

### 13.1 Agente LUPA (gamificação principal)

Aventura completa em **5 mundos temáticos**, com vidas, fases, vilão acelerador e perguntas em rodízio:

1. **Mundo 1 — Fake News**: identificação de manchetes e narrativas falsas.
2. **Mundo 2 — Fontes e Evidências**: avaliação da credibilidade de quem publica.
3. **Mundo 3 — Manipulação de Imagem**: ELA, edição, descontextualização.
4. **Mundo 4 — Deepfake e Vídeo**: artefatos visuais de IA.
5. **Mundo 5 — Chefe Final (Campanha Coordenada)**: padrões de propagação coordenada.

Mecânicas: 3 perguntas por sessão, barra de vidas única persistida em `localStorage`, vilão que acelera a cada acerto, rodízio de perguntas para evitar memorização.

### 13.2 Mini-jogos autônomos

| Jogo | Mecânica |
|---|---|
| **Caça ao Phishing** | 5 mensagens falsas (e-mail, WhatsApp, SMS) com armadilhas para identificar. |
| **Detetive da Engenharia Social** | 6 cenários, 6 táticas (urgência, autoridade, prova social, etc.). |
| **Verdadeiro ou Suspeito?** | 8 afirmações em 2 etapas: classificar e justificar. |

Cada um tem pontuação própria, feedback educativo ao final, e visa um aspecto específico do letramento midiático.

### 13.3 Modo Multiplayer

Salas cooperativas em tempo real via WebSocket (`/jogos/multiplayer`). Permite que professores criem partidas para a turma toda jogar simultaneamente, com ranking ao final.

### 13.4 Conteúdo informativo

- **`/dicas-de-checagem`** — 8 práticas, com sinais de bots, sinais de deepfake e calculador de probabilidade de bot (10 perguntas, 4 níveis de risco).
- **`/metodo-sift`** — Stop, Investigate the source, Find better coverage, Trace claims.
- **`/neurobiologia`** — viéses cognitivos, prebunking, inoculação psicológica.
- **`/glossario`** — termos técnicos explicados em linguagem simples.
- **`/fontes-confiaveis`** — lista curada de agências (Aos Fatos, Agência Lupa, AFP Checamos, etc.).
- **`/biblioteca`** — 20+ livros/artigos categorizados por faixa etária, com áudios `.m4a` gerados via NotebookLM em curso.
- **`/legislacao`** — Lei das Fake News (PL 2630), Marco Civil, leis correlatas.

### 13.5 Modo Professor

Criação de turma (gera código público + chave privada), distribuição do código aos alunos, painel com histórico de análises feitas por aluno e desempenho agregado da turma. Acesso ao painel exige a chave privada — só o professor que criou a turma pode ver.

### 13.6 Viés colaborativo — a comunidade é parte da arquitetura

O LUPA foi construído para **receber e devolver conteúdo da comunidade**, não apenas para servir conteúdo unidirecional. Quatro camadas:

1. **Portal Comunitário (`/comunidade`)** — qualquer pessoa pode reportar um boato circulando no bairro, escola ou condomínio. Os boatos aparecem em um **mapa georreferenciado** do RN, permitindo que se observe **como a desinformação se concentra geograficamente**. A equipe modera e adiciona checagens. Hoje o sistema já contém boatos reais do Rio Grande do Norte.

2. **Portal de Colaboração (`/colaboracao`)** — sugestões, críticas, ideias de funcionalidade ou denúncias. A equipe responde publicamente, e a resposta fica visível na página. É um canal de **transparência ativa**: o usuário vê o que a equipe acolheu, descartou e por quê.

3. **Validação Pública (`/validacao`)** — formulário aberto para qualquer pessoa avaliar o LUPA. Exibe estatísticas agregadas (média de notas, distribuição) e depoimentos aprovados. A meta antes da Feira HackaNAV é coletar 5–10 avaliações de usuários reais (familiares, vizinhos, professores).

4. **Feedback contextual** — em vários pontos do site há um widget de feedback "tive dificuldade aqui" que registra a página onde o usuário travou. Isso alimenta uma lista interna de pontos de fricção.

A arquitetura faz da **construção colaborativa um princípio operacional**: o LUPA não é completo sem a participação dos usuários, e a participação está integrada à mecânica do produto, não relegada a um e-mail de contato escondido no rodapé.

### 13.7 Aderência ao edital HackaNAV

O LUPA foi **deliberadamente projetado a partir dos cinco critérios do edital HackaNAV** (400 pontos cada, total 2.000 pts):

- **Pensamento Complexo** — análise multidimensional combinando 12 verificações em camadas (fonte/conteúdo/geral).
- **Curiosidade Artístico-Científica** — narrativa do Agente LUPA, identidade visual cuidada, conteúdo técnico aprofundado em `/neurobiologia` e `/tecnico`.
- **Intenção Criativa** — gamificação inovadora (5 mundos + 3 mini-jogos + multiplayer), calculador de bot, prebunking aplicado.
- **Construção Colaborativa** — Portal Comunitário com mapa, Portal de Colaboração com respostas públicas, Validação aberta, Modo Professor para escolas, código aberto futuro.
- **Letramento Tecnológico** — uso de IA generativa (Gemini), 6 APIs externas, transparência total do algoritmo em `/sobre` e `/tecnico`, documentação interativa do backend (Swagger em `/docs`).

O capítulo 20 traz o mapeamento detalhado de **cada componente do LUPA aos critérios do edital**.

---

## 14. Segurança e privacidade

### 14.1 Princípios

- **Nenhum login obrigatório**. Não há cadastro, autenticação OAuth nem cookies de sessão.
- **Sem rastreamento publicitário**. Nenhum script de Google Analytics, Meta Pixel ou similar.
- **Isolamento por análise**. Cada análise é um evento independente; não há histórico vinculado ao usuário.
- **Dados em trânsito**. Toda comunicação é via HTTPS, com certificado gerenciado pela Vercel/Render.

### 14.2 Tratamento de uploads

Arquivos enviados (vídeos até 100 MB, imagens até 10 MB) são salvos em diretório temporário (`tempfile.NamedTemporaryFile`), processados e **apagados imediatamente** no bloco `finally`, mesmo em caso de erro. O backend nunca persiste o conteúdo do arquivo.

### 14.3 Rate limiting

Todos os endpoints sensíveis usam `slowapi.limit("N/hour")` com chave por IP. Limites configurados: 20/h para análises principais, 10/h para uploads e boatos, 5/h para sugestões e parcerias.

### 14.4 Proteção do painel de moderação

`/moderacao` exige uma senha (`MODERACAO_CHAVE`) enviada como cabeçalho HTTP nas requisições administrativas. A senha é validada server-side. A página em si exige autenticação por senha simples antes mesmo de carregar dados.

### 14.5 Variáveis de ambiente

Todas as chaves de API e segredos ficam em arquivos `.env` (locais) ou nas variáveis de ambiente das plataformas Vercel/Render. O `.env` está no `.gitignore` e nunca é commitado. O arquivo `.env.example` lista as chaves esperadas.

| Variável | Função |
|---|---|
| `GEMINI_API_KEY` | Análise por IA |
| `FIRECRAWL_API_KEY` | Extração de páginas |
| `YOUTUBE_API_KEY` | Metadados YouTube |
| `GOOGLE_FACT_CHECK_API_KEY` | Banco IFCN |
| `VIRUSTOTAL_API_KEY` | Reputação de URL |
| `TAVILY_API_KEY` | Busca web |
| `SUPABASE_URL` | Endpoint do banco |
| `SUPABASE_KEY` | Chave do banco |
| `MODERACAO_CHAVE` | Senha do painel |
| `FRONTEND_URL` | URL autorizada no CORS |

### 14.6 LGPD

O LUPA processa apenas dados que o usuário **escolheu enviar**: o conteúdo da análise (URL, texto, mídia), o feedback (opcional), a sugestão (opcional), a avaliação (opcional). Não há coleta passiva. Os campos de e-mail em sugestões/parcerias são marcados como opcionais e usados apenas para resposta direta.

---

## 15. Hospedagem e deploy

### 15.1 Frontend — Vercel

- Conectado ao repositório GitHub.
- Cada push na branch `main` dispara automaticamente:
  1. `npm install`
  2. `npm run build` (build de produção do Next.js)
  3. Deploy na CDN global da Vercel
- HTTPS automático com certificado gerenciado.
- Preview deployments para branches de feature (URL única por push).
- Variáveis de ambiente configuráveis no painel (separadas por ambiente).

### 15.2 Backend — Render

- Conectado ao mesmo repositório GitHub, pasta `backend/`.
- Comando de start: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- Cada push na `main` dispara:
  1. `pip install -r requirements.txt`
  2. Reinício do processo
- Variáveis de ambiente configuradas no painel do Render.
- Reinício automático em caso de crash.
- Logs persistidos por 7 dias no plano gratuito.

### 15.3 Banco — Supabase

- Painel visual em `https://app.supabase.com`.
- API REST automática gerada a partir do schema do banco.
- Backup diário automático no plano free.
- 500 MB de armazenamento gratuito.

### 15.4 Branch protection (opcional, pós-Feira)

Recomendação: ativar **branch protection** na `main` após a Feira para exigir PR (Pull Request) com revisão antes de deploy em produção.

---

## 16. Decisões de design

### 16.1 Por que Python no backend, e não Node.js?

O PRD original sugeriu React + Node.js. A decisão foi trocar Node.js por **Python + FastAPI** porque:
- A equipe estava aprendendo Python, e usar a linguagem que se está estudando reduz fricção.
- O ecossistema Python para IA, NLP e processamento de mídia é o mais maduro (HuggingFace, Whisper, Pillow, hachoir).
- FastAPI gera documentação OpenAPI automática (`/docs`) — ideal para um projeto educacional que busca transparência.

### 16.2 Por que Next.js e não Create React App?

Next.js oferece roteamento por pastas (não precisa configurar `react-router`), Server Components (renderização no servidor para SEO), e integração trivial com Vercel. Create React App foi descontinuado pelo time do React em 2023.

### 16.3 Por que Tailwind CSS?

- Estilização inline via classes utilitárias acelera o desenvolvimento.
- Não há arquivos CSS separados que ficam órfãos quando o componente é removido.
- Modo escuro nativo via `dark:` prefix.
- Bundle final é otimizado (PurgeCSS remove classes não usadas).

### 16.4 Por que Supabase em vez de JSON local?

O MVP usava JSON local. Quando surgiu a necessidade de persistência multi-usuário (Portal Comunitário, Modo Professor, Validação), a escolha foi **Supabase** por:
- PostgreSQL real, não SQLite.
- Painel visual para inspecionar dados em apresentações.
- API REST gerada automaticamente (sem precisar escrever SQL para CRUD básico).
- Row Level Security disponível quando necessário.

### 16.5 Por que separar Vercel e Render em vez de um deploy único?

- Vercel é otimizado para Next.js (CDN, SSR, builds em segundos).
- Render suporta processos Python de longa duração com WebSocket.
- Cada plataforma usa o que faz melhor.
- O custo combinado é zero no plano gratuito.

### 16.6 Por que Gemini em vez de OpenAI?

- Tier gratuito generoso para protótipos educacionais.
- API multimodal nativa (texto + imagem) sem precisar de modelos separados.
- Performance comparável ao GPT-4 em tarefas de análise estruturada.
- Acessível diretamente do Brasil sem dependência de provedores intermediários.

### 16.7 Por que cache em memória e não Redis?

Em produção real usaríamos Redis. Para um MVP em servidor único do Render, um dicionário Python na memória do processo basta. Quando o processo reinicia, o cache se perde — aceitável para análises não-críticas.

### 16.8 Por que rate limiting por IP e não por sessão?

Sem login, IP é a única chave disponível. Em redes corporativas/escolares com NAT, isso pode penalizar usuários legítimos. Para mitigar, limites são generosos (20/h é difícil de atingir em uso normal) e os endpoints educacionais não têm limit nenhum.

---

## 17. Limitações conhecidas

| Limitação | Impacto | Mitigação atual |
|---|---|---|
| Análise de URL é heurística, não semântica | Alguns sites confiáveis recebem nota baixa por critérios formais | Justificativas explícitas para o usuário re-julgar |
| Gemini pode alucinar em análises de texto | Risco de afirmações infundadas no resumo | Prompt estruturado com restrições; resumo é separado da pontuação |
| WHOIS oculto em alguns TLDs (.io, .app) | Idade do domínio fica indeterminada | Wayback Machine cobre essa lacuna |
| Firecrawl tem limite gratuito | Pode falhar em volume alto | Fallback para `requests` direto |
| VirusTotal: 4 req/min | Pode atrasar análises em sequência rápida | Cache de 24h reduz pressão |
| Sem persistência de histórico do usuário | Usuário não vê análises antigas se trocar de dispositivo | `localStorage` armazena local; intencional pela LGPD |
| Mapas só do Rio Grande do Norte | Boatos de outros estados não aparecem georreferenciados | Expansão prevista para v2 |
| Validação ainda em curso | Poucos depoimentos aprovados | Fase de campo agendada para maio/2026 |
| Whisper local exige GPU/CPU forte | Análise de upload pode ser lenta | Considerar API hospedada em produção |
| Modelos de IA podem ter viés linguístico | Conteúdo em português pode ser tratado como menos confiável que em inglês | Prompt explícito em português; calibragem manual |

---

## 18. Roteiro de evolução

### 18.1 Antes da Feira HackaNAV (até 20/05/2026)

1. **Vídeo de demonstração** de 3 minutos percorrendo o site completo.
2. **Ensaio da apresentação** com base nos 5 critérios HackaNAV (400 pts cada).
3. **Validação com 5–10 usuários reais** (familiares, vizinhos, professores) via `/validacao`.

### 18.2 Pós-Feira (curto prazo)

4. Áudios `.m4a` (NotebookLM) para os 17 livros restantes da biblioteca.
5. Tela de seleção de mundos do Agente LUPA (com bloqueios/desbloqueios).
6. Recorde por mundo salvo em `localStorage`.
7. Mais mini-jogos: Caça ao Clickbait, Verificador de Fontes, Linha do Tempo, Propagação Viral, Editor Responsável.

### 18.3 Longo prazo (v2.0)

8. Login e senha para portal do professor (com hash + recuperação por e-mail).
9. Aplicativo móvel Android e iOS.
10. Extensão de navegador (Chrome/Firefox).
11. Código aberto no GitHub.
12. Integração formal com Agência Lupa e Aos Fatos no Portal Comunitário.
13. Podcast LUPA Conversa.
14. Expansão para o espanhol (Latam).

---

## 19. Como rodar localmente

### 19.1 Pré-requisitos

- **Python 3.11+** (`python --version`)
- **Node.js 18+** (`node --version`)
- **Git** (`git --version`)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Chaves de API: Gemini, Firecrawl, YouTube, VirusTotal, Google Fact Check (todas com tier gratuito)

### 19.2 Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/lupa.git
cd lupa
```

### 19.3 Backend

```bash
cd backend
python -m venv venv

# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# Copiar e preencher .env
cp .env.example .env
# Editar .env e preencher GEMINI_API_KEY, SUPABASE_URL, etc.

# Rodar
uvicorn main:app --reload
```

Servidor disponível em `http://localhost:8000`. Documentação interativa em `http://localhost:8000/docs`.

### 19.4 Frontend

Em outro terminal:

```bash
cd frontend
npm install

# Configurar variáveis (.env.local)
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

Frontend disponível em `http://localhost:3000`.

### 19.5 Testes

```bash
cd backend
venv/Scripts/python -m pytest      # Windows
source venv/bin/activate && pytest # macOS/Linux
```

---

## 20. Mapeamento aos critérios do edital HackaNAV

O LUPA foi elaborado **a partir dos 5 critérios do edital HackaNAV 2026** (400 pontos cada, total 2.000 pts). Cada componente do site evidencia um ou mais critérios, conforme tabela abaixo.

### 20.1 Pensamento Complexo (400 pts)

> Capacidade de articular múltiplas dimensões de um problema e construir soluções multifatoriais.

| Componente | Como evidencia |
|---|---|
| Análise de URL com 12 verificações combinadas | Nenhum critério isolado decide a nota — o sistema é multifatorial por design |
| Camadas de justificativa (fonte / conteúdo / geral) | Distingue se o problema é o emissor ou a mensagem |
| `/pesquisa` com estatísticas e papers | Apresenta o problema da desinformação em múltiplas dimensões |
| `/legislacao` | Articula a dimensão jurídica |
| `/neurobiologia` | Articula a dimensão cognitiva (vieses, prebunking) |
| Mundo 5 do Agente LUPA (Campanha Coordenada) | Ensina o conceito sistêmico de campanhas, não atos isolados |

### 20.2 Curiosidade Artístico-Científica (400 pts)

> Capacidade de despertar interesse e investigação por meio de linguagens artísticas e científicas.

| Componente | Como evidencia |
|---|---|
| Identidade visual com gradientes, ícones Lucide, animações | Estética convidativa que evita o "papelão acadêmico" |
| Agente LUPA — narrativa com vilão, mundos, vidas | Engajamento via storytelling de jogo |
| `/neurobiologia` | Aborda neurociência aplicada de forma acessível |
| `/tecnico` | Documenta a engenharia da plataforma com diagramas e tabelas |
| Calculador de probabilidade de bot | Ferramenta interativa que vira pesquisa em tempo real |
| Deepfake demo no Mundo 4 | Mostra a arte da imagem gerada por IA enquanto ensina a detectá-la |

### 20.3 Intenção Criativa (400 pts)

> Originalidade da proposta e ousadia das escolhas de design.

| Componente | Como evidencia |
|---|---|
| Pontuação 0–100 com justificativas explícitas | Formato pouco usual em ferramentas de checagem (que costumam só dar veredito) |
| Disclaimer dinâmico em pontuação 100 | Transparência radical que se contrapõe ao impulso de "vencer o LUPA" |
| Gamificação em 5 mundos + 3 mini-jogos + multiplayer | Combinação rara em ferramentas educacionais sobre desinformação |
| Mapa georreferenciado de boatos | Reframing geográfico de um problema usualmente tratado como online-only |
| Modo Professor integrado | Decisão de produto: educação não é cliente externo, é usuário primário |
| Prebunking aplicado na neurobiologia | Aplicação prática de pesquisa recente |

### 20.4 Construção Colaborativa (400 pts)

> Envolvimento da comunidade no desenvolvimento e na operação contínua.

| Componente | Como evidencia |
|---|---|
| **Portal Comunitário (`/comunidade`)** | Cidadãos reportam boatos do próprio bairro; mapa concentra a inteligência coletiva |
| **Portal de Colaboração (`/colaboracao`)** | Sugestões e respostas públicas — a equipe trabalha em aberto |
| **Validação Pública (`/validacao`)** | Avaliação aberta de qualquer pessoa, com depoimentos moderados |
| **Modo Professor + Multiplayer** | Sala de aula vira nó da rede, não apenas consumidora |
| Solicitação de parcerias (`/parcerias` interno) | Caminho institucional para escolas formalizarem o uso |
| Plano de código aberto (futuro) | Convite explícito para desenvolvedores externos contribuírem |
| Rodapé com canais sempre visíveis | Colaboração não fica escondida em página de contato |

### 20.5 Letramento Tecnológico (400 pts)

> Apropriação consciente e ética das tecnologias contemporâneas.

| Componente | Como evidencia |
|---|---|
| Uso de IA generativa (Gemini) com transparência | `/sobre` e `/tecnico` explicam quando e como a IA é usada |
| 6 APIs externas integradas | Combina serviços especializados em vez de reinventar |
| Documentação interativa em `/docs` (Swagger) | Qualquer pessoa pode inspecionar o backend |
| `/api` — documentação aberta da API | Convite ao reúso |
| Página `/tecnico` com arquitetura visual | Educação técnica embutida no produto |
| Análise de imagens com ELA + GHOST + Gemini | Ferramentas de forensics de mídia digital aplicadas |
| Análise de texto + busca web complementar | Combinação ética de IA generativa com fontes verificáveis |
| Política explícita de privacidade e LGPD | Apropriação ética da tecnologia |
| Stack moderna documentada | Escolhas justificadas, não cult-following |

---

## 21. Referências

### 21.1 Documentos do projeto

- `docs/PRD.pdf` — Documento de Requisitos do Produto (07/04/2026)
- `plan.md` — Plano de desenvolvimento por fases
- `CLAUDE.md` — Instruções permanentes para o assistente IA
- Edital **HackaNAV 2026** — critérios de avaliação

### 21.2 Pesquisa científica

- Vosoughi, S., Roy, D., Aral, S. (2018). *The spread of true and false news online*. Science, 359(6380), 1146–1151. [DOI: 10.1126/science.aap9559](https://doi.org/10.1126/science.aap9559)
- DataSenado (2023). *Redes Sociais e Notícias Falsas*. Disponível em: [www12.senado.leg.br/institucional/datasenado](https://www12.senado.leg.br/institucional/datasenado/materias/pesquisas/redes-sociais-e-noticias-falsas)
- Roozenbeek, J., van der Linden, S. (2019). *The fake news game: actively inoculating against the risk of misinformation*. Journal of Risk Research.

### 21.3 Agências e iniciativas

- [Agência Lupa](https://lupa.uol.com.br)
- [Aos Fatos](https://www.aosfatos.org)
- [AFP Checamos](https://checamos.afp.com)
- [International Fact-Checking Network (IFCN)](https://ifcncodeofprinciples.poynter.org)
- [Poynter — MediaWise](https://www.poynter.org/mediawise/)

### 21.4 Documentação técnica das tecnologias

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google AI Studio (Gemini)](https://ai.google.dev)
- [Firecrawl Docs](https://docs.firecrawl.dev)
- [VirusTotal API](https://docs.virustotal.com/reference)
- [Google Fact Check Tools](https://developers.google.com/fact-check/tools/api)
- [Wayback Machine CDX API](https://archive.org/help/wayback_api.php)

---

*Fim do documento — versão 1.0 — 09 de maio de 2026*
