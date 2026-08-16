---
title: "Como ler o código do LUPA"
subtitle: "Guia de leitura do código-fonte — HackaNAV 2026, Etapa Regional"
date: "Agosto de 2026"
lang: pt-BR
---

# Para que serve este documento

Este guia acompanha os arquivos de código-fonte enviados na pasta do projeto. Ele
existe para que a leitura do código não dependa de saber programar: cada seção explica
**o que aquele arquivo faz**, **por que ele existe** e **onde conferir** cada afirmação
feita no vídeo e na apresentação.

O LUPA é um site que analisa links, textos, vídeos e imagens e devolve uma pontuação de
confiabilidade de 0 a 100, sempre acompanhada das justificativas que produziram aquela
nota. O projeto tem duas metades: o **backend**, que faz as análises sem que ninguém
veja, e o **frontend**, que é a tela com que a pessoa interage.

Repositório completo: consultar o arquivo `link-repositorio-github.txt`, na mesma pasta.

---

# A ideia central: a nota começa em 50

Antes de olhar qualquer arquivo, vale entender a decisão que organiza o sistema inteiro.

Uma análise **não começa em zero nem em cem**. Ela começa em 50 — a constante
`PONTUACAO_INICIAL`, definida no início do arquivo `analyzer.py`. A partir daí, cada
verificação soma ou subtrai pontos, e cada alteração gera uma frase de justificativa que
aparece para o usuário.

Isso foi uma escolha da equipe, não um detalhe técnico. Começar em 50 significa que o
LUPA **parte da dúvida**: nenhum site é considerado confiável ou suspeito antes de ser
examinado. É a tradução em código do princípio do projeto — o LUPA não afirma verdade
absoluta, ele apoia a checagem.

Alguns dos pesos aplicados, todos visíveis no código:

| Verificação | Impacto na nota |
|---|---|
| Site usa conexão segura (HTTPS) | +10 / −10 |
| Domínio com 5 anos ou mais | +15 |
| Domínio com menos de 1 ano | −15 |
| Domínio não existe | −40 |
| Título com palavra de caça-clique | −20 |
| Mais de metade do título em maiúsculas | −10 |
| Tem página "sobre" ou "contato" | +10 / −5 |
| Cita três ou mais fontes externas | +10 |

---

# Backend — a parte que analisa

Escrito em **Python 3.11** com **FastAPI**, uma ferramenta que transforma funções Python
em endereços que o site pode consultar pela internet. Hospedado no Render.

## `analyzer.py` — o coração do projeto

É o arquivo mais importante e o maior. Recebe um endereço de site e devolve a nota com
as justificativas.

A função principal chama-se `analisar_url()`. Abaixo dela ficam as verificações
individuais, e todas começam com `_verificar_`: `_verificar_https()`,
`_verificar_idade_dominio()`, `_verificar_clickbait()`,
`_verificar_excesso_maiusculas()`, `_verificar_paginas_institucionais()`,
`_verificar_referencias()`, `_verificar_sensacionalismo_corpo()`. Cada uma é curta e faz
uma única pergunta — foi escrito assim de propósito, para que qualquer pessoa consiga ler
uma verificação isolada sem entender o resto.

**Onde olhar:** o comentário logo acima da consulta ao banco de checagens explica, em
português, por que páginas iniciais de portais são ignoradas. É o registro da correção do
erro narrado na apresentação.

## `fact_check.py` — a consulta às agências de checagem

Pergunta ao Google Fact Check Tools se o conteúdo já foi desmentido por alguma agência da
rede IFCN. Três funções importam:

- `buscar_checagens()` faz a consulta;
- `avaliar_impacto()` decide quanto aquilo pesa na nota (−30 pontos para uma checagem
  negativa);
- `filtrar_relevantes()` descarta checagens que não têm relação real com o conteúdo.

A terceira função **não existia no início do projeto**. Ela foi criada em 01/05/2026 para
corrigir o falso positivo que estava punindo portais de notícia legítimos. É o arquivo a
consultar para verificar a história contada na apresentação ao vivo.

## Os outros analisadores

| Arquivo | O que faz |
|---|---|
| `youtube_analyzer.py` | Lê dados do próprio vídeo do YouTube: canal, data, visualizações |
| `upload_analyzer.py` | Analisa vídeos enviados do computador e **apaga o arquivo em seguida** |
| `image_analyzer.py` | Lê os metadados escondidos de fotos (data, câmera, edição, local) |
| `text_analyzer.py` | Analisa texto colado, como mensagem de WhatsApp |
| `virustotal.py` | Verifica se o endereço já foi denunciado como malicioso |
| `wayback.py` | Consulta o arquivo histórico da internet: desde quando a página existe |
| `web_search.py` | Busca o que outras fontes dizem sobre o mesmo assunto |

## `main.py` — a porta de entrada

Lista todos os endereços que o site pode consultar. Os principais são `/analisar-url`,
`/analisar-texto`, `/analisar-upload` e `/analisar-imagem`. Também contém o limite de
requisições por hora, que impede o uso abusivo do serviço.

## Os arquivos de comunidade

`boatos.py`, `feedback.py`, `sugestoes.py`, `validacao.py`, `turma.py`, `parceria.py` e
`contatos.py` sustentam as áreas colaborativas: o registro de boatos locais, o retorno
dos usuários, as sugestões, a validação interna e o Modo Professor, que permite a uma
turma inteira usar o LUPA ao mesmo tempo.

## `multiplayer.py` — o jogo em tempo real

Faz a sala de jogo funcionar com todos os participantes vendo a mesma pergunta ao mesmo
tempo, usando uma tecnologia chamada WebSocket, que mantém a conexão aberta em vez de
perguntar ao servidor de tempos em tempos.

---

# Frontend — a parte que aparece

Escrito em **Next.js 16** com **TypeScript** e **TailwindCSS**, hospedado na Vercel.
Cada pasta dentro de `frontend/app/` corresponde a um endereço do site: a pasta
`glossario` é a página `/glossario`, e assim por diante.

| Área | Páginas |
|---|---|
| Análise | `/` (analisador), `/historico` |
| Aprender | `/dicas-de-checagem`, `/metodo-sift`, `/neurobiologia` |
| Referências | `/fontes-confiaveis`, `/pesquisa`, `/glossario`, `/biblioteca`, `/legislacao` |
| Jogos | `/jogos`, `/jogo` |
| Comunidade | `/comunidade`, `/colaboracao`, `/futuro`, `/validacao`, `/tecnico` |
| Professor | `/professor` |
| Transparência | `/sobre`, `/equipe`, `/evolucao`, `/ficha-tecnica`, `/api` |

Os componentes reaproveitados em várias páginas ficam em `frontend/app/_components/`.

---

# Três decisões e onde conferi-las no código

**1. Nenhum dado de usuário é guardado.** As análises não são associadas a ninguém, não
há login e não há histórico no servidor. O histórico que aparece no site fica salvo no
próprio navegador da pessoa (`localStorage`), e some se ela limpar os dados. Vídeos
enviados são apagados logo após a análise — a instrução de apagamento está num bloco
`finally`, que em Python executa mesmo se a análise falhar no meio.

**2. Toda nota vem com justificativa.** A classe `Justificativa`, no início de
`analyzer.py`, existe para isso: nenhuma pontuação pode ser alterada sem que uma frase
explicando o motivo seja gerada junto. Não é possível, pela forma como o código foi
escrito, produzir uma nota sem explicação.

**3. Nota 100 vem com aviso.** Desde 09/05/2026, uma análise que resulta em 100 exibe um
lembrete de que nota máxima não é certeza absoluta. Foi consequência direta do erro
narrado na apresentação.

---

# Sobre a autoria do código

Os commits anteriores a 28/04/2026 aparecem sob o nome de autor `Karin`. Isso ocorreu
porque um dos computadores usados no início do desenvolvimento estava configurado com a
conta de Karina Pinto, mãe da capitã da equipe, que não participou do projeto. A
configuração foi corrigida quando o problema foi percebido. O registro está descrito
também no README do repositório.

A equipe usou assistentes de inteligência artificial durante o desenvolvimento, o que
está declarado abertamente na página `/ficha-tecnica` do site. As decisões de produto —
o que o LUPA faz, como pontua, o que recusa fazer — foram todas da equipe, e o Marco 14
do diário de bordo é o exemplo mais claro disso: diante de uma sugestão de remover a
consulta às agências de checagem, a equipe decidiu procurar outra saída.
