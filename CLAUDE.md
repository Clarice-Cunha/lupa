# CLAUDE.md — Instruções permanentes para o Projeto LUPA

> Este arquivo é carregado automaticamente pelo Claude Code sempre que ele trabalha neste projeto. Ele contém as regras e o contexto que devem ser seguidos em toda interação.

---

## Sobre o usuário

- **Perfil**: iniciante em programação. Está aprendendo **Python** (tem notebooks de estruturas de decisão, listas e strings na pasta pai).
- **Idioma**: toda a comunicação deve ser em **português**.
- **Estilo de explicação**: didático, sem jargões técnicos sem explicação. Sempre que usar um termo técnico (API, endpoint, framework, etc.), explicar em linguagem simples na primeira vez.
- **A cada etapa executada**, explicar o que está sendo feito e o porquê.
- **Sempre comentar boas práticas de desenvolvimento** quando relevante.

## Sobre o projeto

**LUPA — Leitor de URLs, Plataformas e Audiovisuais**

Site educacional que analisa links (sites, YouTube, uploads de vídeo) e retorna uma pontuação de confiabilidade (0-100) com justificativas. Foco em combate à desinformação para estudantes, professores e famílias.

**Princípio central**: o LUPA **não afirma verdade absoluta** — é apoio à checagem e ao pensamento crítico.

O PRD (documento de referência original, datado de 07/04/2026) **não está neste
repositório** — ele fica com a equipe, no Drive do projeto.
O plano de desenvolvimento está em `plan.md`.

## Stack definida

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.11+ com FastAPI |
| Frontend | Next.js com TailwindCSS |
| Armazenamento | JSON local no MVP (sem banco de dados) |
| Hospedagem | Render (backend) + Vercel (frontend) |
| Controle de versão | Git + GitHub |

**APIs externas previstas:** Firecrawl.dev, YouTube Data API v3, HuggingFace, OpenAI Whisper.

## Estrutura de pastas

```
LUPA/
├── backend/        # código Python (FastAPI)
├── frontend/       # código Next.js
├── docs/           # documentação (incluindo PRD original)
├── plan.md         # plano de desenvolvimento por fases
└── CLAUDE.md       # este arquivo
```

## Convenções de código

### Python (backend)
- Seguir **PEP 8** (estilo padrão do Python).
- Nomes em inglês para variáveis e funções; comentários e mensagens ao usuário em português.
- Usar `type hints` sempre (`def calcular_nota(url: str) -> int:`). Ajuda o iniciante a entender o que cada função espera.
- Funções pequenas e com nomes claros. Prefira `verificar_https(url)` a `check(u)`.

### JavaScript/TypeScript (frontend)
- Usar **TypeScript** desde o início (evita muitos bugs).
- Componentes em PascalCase (`ResultadoAnalise.tsx`).
- Textos da interface em português.

### Git
- Commits em português no formato `tipo: descrição`.
- Tipos comuns: `feat` (nova funcionalidade), `fix` (correção), `docs` (documentação), `refactor` (melhoria sem mudar comportamento), `style` (formatação).
- Exemplo: `feat: adiciona verificação de HTTPS na análise de URL`

## Regras de negócio essenciais (do PRD)

1. **Faixas de pontuação fixas**:
   - 0-30: Suspeito (cor `#B71C1C`)
   - 31-70: Requer Atenção (cor `#FFC107`)
   - 71-100: Confiável (cor `#4CAF50`)
2. **Isolamento de análises**: nenhuma análise guarda dados do usuário. Sem login, sem histórico.
3. **Explicabilidade obrigatória**: toda pontuação deve vir acompanhada das justificativas que a geraram.
4. **Linguagem neutra**: evitar termos com julgamento moral ("fake", "mentira"). Usar "suspeito", "requer atenção".
5. **Foco educacional**: explicar o *porquê* da nota, não só o veredito.

## Como trabalhar com o usuário

- Antes de executar algo não-trivial, **explicar o plano em poucas linhas** e pedir confirmação.
- Ao criar código, mostrar o arquivo gerado e **explicar as partes principais** em seguida.
- Ao instalar pacotes ou rodar comandos, **explicar o que cada comando faz** antes de executar.
- Quando errar ou precisar corrigir algo, **explicar o motivo do erro** para o usuário aprender.
- Nunca assumir que o usuário sabe o que é um conceito técnico — na dúvida, explicar.

## O que NÃO fazer

- Não usar jargão sem explicar.
- Não criar arquivos desnecessários (a menos que pedido).
- Não sugerir otimizações prematuras — primeiro fazer funcionar.
- Não adicionar funcionalidades que não estão no plano da fase atual.
- Não responder em inglês.
