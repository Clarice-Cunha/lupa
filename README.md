# 🔍 LUPA — Leitor de URLs, Plataformas e Audiovisuais

Site educacional para avaliar a confiabilidade de conteúdos digitais.

O LUPA recebe um link de site, um vídeo do YouTube ou um arquivo de vídeo, e retorna uma **pontuação de confiabilidade** (0-100) com uma **explicação clara** dos critérios usados. O objetivo é apoiar o pensamento crítico — não afirmar verdade absoluta.

**Público-alvo:** estudantes, professores, famílias e comunidade escolar.

---

## Status do projeto

🚧 Em desenvolvimento — Fase 0 (preparação do ambiente).

Veja [`plan.md`](plan.md) para o plano completo de desenvolvimento.

---

## Tecnologias

- **Backend:** Python 3.11+ · FastAPI
- **Frontend:** Next.js · TailwindCSS
- **Controle de versão:** Git

---

## Estrutura do projeto

```
LUPA/
├── backend/        # API em Python (FastAPI)
├── frontend/       # Interface em Next.js
├── docs/           # Documentação (PRD, diagramas)
├── plan.md         # Plano de desenvolvimento em 7 fases
├── CLAUDE.md       # Instruções para o Claude Code
├── .env.example    # Modelo das variáveis de ambiente
└── .gitignore      # Arquivos ignorados pelo Git
```

---

## Como rodar localmente

> ⚠️ As instruções completas serão adicionadas conforme o projeto avançar. Por enquanto, apenas a preparação inicial está pronta.

### Pré-requisitos

- Python 3.11 ou superior
- Node.js 18 ou superior
- Git

### Configuração inicial

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd LUPA

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e preencha suas chaves de API
```

### Backend (em breve)

```bash
cd backend
# Instruções virão na Fase 1
```

### Frontend (em breve)

```bash
cd frontend
# Instruções virão na Fase 2
```

---

## Princípios do projeto

1. **Foco educacional** — sempre explicar o *porquê* da pontuação.
2. **Transparência total** — todos os critérios são públicos e compreensíveis.
3. **Privacidade** — nenhum dado do usuário é armazenado.
4. **Linguagem neutra** — sem julgamentos morais.
5. **Sem verdade absoluta** — o LUPA é apoio à checagem, não um juiz.

---

## Licença

A definir.
