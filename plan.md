# Plano de Desenvolvimento — Projeto LUPA

> **O que é este documento?**
> Este é o "mapa" do projeto. Ele descreve, passo a passo, como vamos construir o LUPA — desde a primeira linha de código até a versão publicada na internet. Foi escrito de forma didática, explicando os porquês das decisões.

---

## 1. Resumo do que vamos construir

O **LUPA** é um site que recebe um link (de um site, vídeo do YouTube ou arquivo de vídeo) e devolve uma "nota de confiabilidade" de 0 a 100, junto com uma explicação do motivo da nota. Não é um juiz da verdade — é um apoio educativo para o usuário pensar criticamente antes de acreditar ou compartilhar.

---

## 2. Decisões de tecnologia (o "material de construção")

O PRD sugeriu React + Node.js, mas vou recomendar ajustes pensando no seu perfil (iniciante, aprendendo Python):

| Camada | Sugestão | Por quê |
|---|---|---|
| **Backend** (cérebro) | **Python + FastAPI** | Você já está aprendendo Python. FastAPI é moderno, simples e tem documentação automática. O ecossistema de Inteligência Artificial em Python é o melhor do mundo (HuggingFace, Whisper, etc.) |
| **Frontend** (cara bonita) | **Next.js + TailwindCSS** | Next.js é uma "versão facilitada" do React, com roteamento pronto. Tailwind deixa o CSS muito mais rápido de escrever |
| **Armazenamento** | Arquivos JSON locais (no MVP) | Não precisamos de banco de dados ainda. Mais simples = menos erros |
| **Hospedagem** | Vercel (frontend) + Render (backend) | Ambos têm plano gratuito e aceitam nossas tecnologias |
| **Controle de versão** | Git + GitHub | Obrigatório em qualquer projeto sério. É o "Ctrl+Z infinito" do código |

> **Jargão explicado:**
> - **Frontend**: tudo o que o usuário vê (botões, cores, formulários).
> - **Backend**: o que acontece "nos bastidores" (processar um link, chamar APIs, calcular a nota).
> - **API**: um serviço de outro lugar que a gente chama para fazer um trabalho (ex: o YouTube tem uma API que nos dá informações sobre vídeos).
> - **MVP**: "Mínimo Produto Viável" — a primeira versão funcional, mais simples possível.

---

## 3. Fases do projeto (do simples ao completo)

A regra é: **uma coisa de cada vez**. Não tente fazer tudo junto — é a receita mais comum para travar e desanimar.

### Fase 0 — Preparação do ambiente (1 dia)
Montar o "estúdio" antes de começar a pintar.

- [ ] Instalar Python 3.11+ (você provavelmente já tem)
- [ ] Instalar Node.js (necessário para o Next.js)
- [ ] Instalar Git e criar conta no GitHub
- [ ] Criar a estrutura de pastas do projeto:
  ```
  LUPA/
  ├── backend/     (código Python)
  ├── frontend/    (código Next.js)
  └── docs/        (documentação)
  ```
- [ ] Criar um arquivo `.env.example` listando quais chaves de API serão necessárias
- [ ] Fazer o primeiro commit ("inicialização do projeto")

### Fase 1 — Backend mínimo: análise de URL de site (3-5 dias)
O objetivo aqui é simples: dado um link de site, devolver uma nota.

- [ ] Criar endpoint `POST /analisar-url` em FastAPI
- [ ] Integrar com Firecrawl.dev para extrair o texto da página
- [ ] Implementar verificações simples:
  - Idade do domínio (via biblioteca `python-whois`)
  - Presença de HTTPS (SSL)
  - Palavras-chave de clickbait em listas pré-definidas
  - Detecção de excesso de maiúsculas no título
- [ ] Calcular pontuação 0-100 com pesos simples (ex: HTTPS vale 10 pontos, clickbait tira 20)
- [ ] Devolver JSON com pontuação + justificativas
- [ ] Testar com uns 10 sites diferentes (confiáveis e suspeitos)

> **Boa prática:** Nessa fase, faça funcionar primeiro, depois melhore. Não se preocupe com interface bonita, só com a lógica.

### Fase 2 — Frontend mínimo: tela de entrada e resultado (3-4 dias)
Agora a "cara" do projeto.

- [ ] Criar projeto Next.js
- [ ] Página inicial (`/`) com um campo de URL e um botão "Analisar"
- [ ] Página de resultado (`/resultado`) mostrando nota, cor (vermelho/amarelo/verde) e justificativas
- [ ] Tela de carregamento entre as duas (feedback visual)
- [ ] Estilização com Tailwind seguindo as cores do PRD:
  - Suspeito: `#B71C1C` (vermelho)
  - Requer Atenção: `#FFC107` (amarelo)
  - Confiável: `#4CAF50` (verde)
- [ ] Conectar frontend ao backend (chamar `/analisar-url`)
- [ ] Layout responsivo (funcionar em celular)

### Fase 3 — Análise de vídeos do YouTube (4-6 dias)
- [ ] Obter chave da YouTube Data API v3 (gratuita)
- [ ] Endpoint `POST /analisar-youtube`
- [ ] Extrair metadados: idade do canal, inscritos, verificação, visualizações
- [ ] Transcrever áudio do vídeo (usar OpenAI Whisper local ou API)
- [ ] Aplicar as mesmas análises textuais da Fase 1 na transcrição
- [ ] No frontend, aceitar também links do YouTube no mesmo campo

### Fase 4 — Upload de vídeos (3-4 dias)
- [ ] Endpoint `POST /analisar-upload` que recebe arquivo
- [ ] Validar formato (MP4, MOV, AVI) e tamanho máximo (ex: 100MB)
- [ ] Extrair metadados do arquivo (biblioteca `ffmpeg-python`)
- [ ] Transcrever áudio com Whisper
- [ ] Aplicar análises
- [ ] Frontend: componente de upload com barra de progresso

### Fase 5 — Páginas educativas (2 dias)
- [ ] Página "Dicas de Checagem" (conteúdo estático, pode ser escrito em Markdown)
- [ ] Página "Fontes Confiáveis" (lista curada com links)
- [ ] Menu de navegação entre as páginas

### Fase 6 — Polimento e acessibilidade (3 dias)
- [ ] Revisar contraste de cores (WCAG AA no mínimo)
- [ ] Adicionar navegação por teclado
- [ ] Mensagens de erro claras ("Link inválido", "Vídeo muito grande", etc.)
- [ ] Exemplos pré-configurados na home ("Experimente com este link")
- [ ] Testes básicos com `pytest` (backend) e verificação manual (frontend)

### Fase 7 — Publicação (1-2 dias)
- [ ] Subir backend no Render
- [ ] Subir frontend na Vercel
- [ ] Configurar variáveis de ambiente (chaves de API)
- [ ] Testar tudo em produção
- [ ] Compartilhar o link!

**Tempo total estimado:** 3 a 6 semanas, trabalhando algumas horas por dia.

---

## 4. Sugestões de melhoria sobre o PRD original

Depois de ler o documento, aqui estão minhas recomendações (pode acatar ou descartar — é sua decisão):

### 4.1 Técnicas
1. **Usar Python no backend em vez de Node.js** — você já está aprendendo Python, e o ecossistema de IA é mais maduro nessa linguagem.
2. **Começar sem banco de dados** — o PRD já sugere isso, mas vale reforçar. Armazenar reputação de domínios em um JSON simples é suficiente no começo.
3. **Cache de resultados por 24h** — se alguém analisar o mesmo site duas vezes no mesmo dia, retornar o resultado armazenado. Economiza chamadas pagas de API e acelera a resposta.
4. **Limite de requisições (rate limiting)** — proteger contra abuso. Ex: no máximo 20 análises por IP por hora. Essencial para não estourar cota paga das APIs.
5. **Monitoramento de custos de API** — criar um painel simples mostrando quantas chamadas foram feitas. APIs de IA cobram por uso.

### 4.2 Produto
6. **Exemplos prontos na home** — botões "Ver exemplo suspeito" e "Ver exemplo confiável" ajudam o usuário a entender o produto sem precisar ter um link em mente.
7. **Modo "Para Professores"** — uma página com sugestões de atividades em sala usando o LUPA (isso combina com o público-alvo do PRD).
8. **Transparência radical na pontuação** — em vez de só mostrar o número, mostrar a "conta": "40 pontos (base) + 10 (HTTPS) − 20 (clickbait) + 15 (domínio antigo) = 45". Ensina o usuário a pensar criticamente.
9. **Feedback do usuário** — após o resultado, perguntar "Esta análise foi útil?" com um joinha / não. Ajuda a melhorar os critérios com o tempo.
10. **Avisos éticos claros** — reforçar em todas as telas que o LUPA **não é um juiz da verdade**, mas uma ferramenta de apoio. Evita mau uso.

### 4.3 Sobre os riscos (adições)
11. **Viés dos modelos de IA** — modelos de HuggingFace podem ter vieses (ex: classificar textos em português como menos confiáveis por serem treinados em inglês). Documentar limitações conhecidas.
12. **LGPD** — mesmo sem login, se o usuário fizer upload de vídeo, estamos processando dados dele. Incluir política de privacidade simples dizendo que os arquivos são apagados após a análise.

---

## 5. Organização do trabalho (boas práticas)

- **Commits pequenos e frequentes**: cada vez que algo funciona, salvar com Git. Mensagem no formato `tipo: descrição` (ex: `feat: adiciona análise de HTTPS`).
- **Branches para cada fase**: trabalhar em `feat/fase-1-backend`, dar merge no `main` quando terminar. Mantém o histórico organizado.
- **README.md**: manter atualizado com instruções de como rodar o projeto. Seu "você do futuro" vai agradecer.
- **Não otimize cedo demais**: código feio que funciona é melhor que código perfeito que não existe. Refatorar depois.
- **Peça ajuda**: quando travar em algo por mais de 30 minutos, pergunte. Não perca o dia todo no mesmo bug.

---

## 6. Próximo passo imediato

Quando você quiser começar, me diga algo como:
> "Vamos começar a Fase 0"

E eu te ajudo a configurar o ambiente passo a passo, explicando cada comando.
