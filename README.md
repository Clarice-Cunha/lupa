# 🔍 LUPA — Leitor de URLs, Plataformas e Audiovisuais

Site educacional para avaliar a confiabilidade de conteúdos digitais.

O LUPA recebe um link de site, um vídeo do YouTube, uma imagem, um arquivo de vídeo ou um texto colado, e retorna uma **pontuação de confiabilidade** (0-100) com uma **explicação clara** dos critérios usados. O objetivo é apoiar o pensamento crítico — não afirmar verdade absoluta.

**Público-alvo:** estudantes, professores, famílias e comunidade escolar.

- **Site:** https://lupa-clarice-cunha-s-projects.vercel.app
- **API:** https://lupa-api.onrender.com

---

## Status do projeto

✅ **Em produção e funcionando.** Desenvolvido para o HackaNAV 2026 (Programa Nave a Vela), tema *Soluções contra a Desinformação Digital*.

O histórico completo de desenvolvimento, funcionalidade por funcionalidade, está registrado na página `/evolucao` do site. O plano original está em [`plan.md`](plan.md).

---

## O que o LUPA faz

**Análise de conteúdo**
- Links de sites, vídeos do YouTube, imagens, arquivos de vídeo e textos colados
- Pontuação de 0 a 100 sempre acompanhada das justificativas que a geraram
- Detecção de indícios de deepfake e de imagens geradas por IA (análise ELA e GHOST)
- Checagem cruzada com o banco global da rede IFCN, VirusTotal e Wayback Machine

**Aprendizagem**
- Jogos educativos (Agente LUPA, Detetive, Caça ao Phishing, Engenharia Social e outros)
- Biblioteca virtual, glossário, método SIFT e conteúdo sobre prebunking
- Portal Comunitário com boatos regionais e mapa georreferenciado

**Para professores**
- Modo Professor com turmas, código de acesso e painel de acompanhamento

---

## Estrutura do projeto

```
LUPA/
├── backend/        # API em Python (FastAPI)
├── frontend/       # Interface em Next.js
├── docs/           # Documentação, apresentações e materiais de divulgação
├── plan.md         # Plano de desenvolvimento em fases
├── CLAUDE.md       # Instruções do projeto
├── render.yaml     # Configuração de deploy do backend
├── .env.example    # Modelo das variáveis de ambiente
└── .gitignore      # Arquivos ignorados pelo Git
```

---

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Backend | Python 3.11 · FastAPI · Uvicorn · Pydantic · BeautifulSoup · Pillow · Hachoir |
| Frontend | TypeScript · Next.js · React · Tailwind CSS · Leaflet · Phaser |
| Armazenamento | Supabase |
| Hospedagem | Render (backend) · Vercel (frontend) |

**Serviços externos consultados:** Google Gemini, Google Fact Check Tools (rede IFCN), VirusTotal, Internet Archive (Wayback Machine), Firecrawl, YouTube Data API e Tavily.

---

## Como rodar localmente

### Pré-requisitos

- Python 3.11 ou superior
- Node.js 18 ou superior
- Git

### 1. Clonar e configurar as variáveis

```bash
git clone <url-do-repositorio>
cd LUPA
cp .env.example .env
# Edite o .env e preencha as chaves de API que você tiver
```

O LUPA funciona mesmo sem todas as chaves: cada serviço externo é opcional e, quando a chave não está configurada, aquela camada de análise simplesmente não roda.

### 2. Backend

```bash
cd backend
python -m venv venv
venv/Scripts/pip install -r requirements.txt     # Windows
# source venv/bin/activate && pip install -r requirements.txt   # Mac/Linux

venv/Scripts/python -m uvicorn main:app --reload
```

A API sobe em http://localhost:8000.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O site sobe em http://localhost:3000.

### Testes

```bash
cd backend
venv/Scripts/python -m pytest
```

---

## Nota sobre o histórico do repositório

Os commits até **28/04/2026** aparecem sob o nome de autor `Karin`. Isso acontece porque o Git de um dos computadores usados no início do projeto estava configurado com a conta de Karina Pinto (mãe da Clarice), e não com a conta da própria Clarice. A partir de **29/04/2026** o Git foi reconfigurado e todos os commits seguintes aparecem como `Clarice-Cunha`.

A autoria do projeto é da equipe. Registramos isso aqui por transparência — educação midiática também é dar o crédito correto a quem produz.

---

## Equipe

Estudantes do 8º ano do Complexo Educacional Contemporâneo — Unidade Lagoa Nova, Natal/RN.

| Integrante | Papel |
|---|---|
| Clarice Cunha Pinto | Capitã da equipe e desenvolvimento |
| Benjamim de Almeida das Chagas | Pesquisa científica e validação de dados |
| Pedro Moreno de Lima Bessa | Design instrucional |

**Professor orientador:** Hector Gabriel Ribeiro Liberalino

A ficha técnica completa — com créditos de tecnologias, serviços de terceiros e curadoria do conteúdo educativo — está na página `/ficha-tecnica` do site.

---

## Princípios do projeto

1. **Foco educacional** — sempre explicar o *porquê* da pontuação.
2. **Transparência total** — todos os critérios são públicos e compreensíveis.
3. **Privacidade** — sem login e sem histórico pessoal. Só é guardado o que a pessoa envia de propósito (boatos, sugestões, avaliações, contato) e as análises feitas com código de turma no Modo Professor.
4. **Linguagem neutra** — sem julgamentos morais.
5. **Sem verdade absoluta** — o LUPA é apoio à checagem, não um juiz.

---

## Licença

Os direitos autorais do projeto pertencem aos estudantes autores, conforme o regulamento do HackaNAV 2026. Uso educacional livre, mediante citação da fonte.
