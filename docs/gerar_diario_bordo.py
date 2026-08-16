"""Gera o diário de bordo em Markdown a partir da página /evolucao do site.

Por que este script existe: durante muito tempo o projeto teve dois registros
de evolução em paralelo — o arquivo docs/evolucao.md e a página do site. O do
site foi sendo atualizado e o markdown ficou para trás. Em vez de manter os
dois na mão, o markdown passa a ser gerado a partir da página, que é a fonte
de verdade.

Uso (a partir da raiz do projeto):
    python docs/gerar_diario_bordo.py

Depois, para gerar o PDF:
    powershell -ExecutionPolicy Bypass -File docs/gerar_pdfs.ps1
"""

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "frontend" / "app" / "evolucao" / "page.tsx"
DESTINO = RAIZ / "docs" / "DIARIO_DE_BORDO.md"

CABECALHO = """---
title: "Diário de Bordo do LUPA"
subtitle: "Evolução do protótipo, marco a marco — HackaNAV 2026"
date: "Agosto de 2026"
lang: pt-BR
---

> Registro do desenvolvimento do LUPA, do primeiro protótipo até a versão atual.
> Cada marco traz uma descrição em linguagem acessível e, quando existe, uma nota
> técnica para quem quiser se aprofundar.
>
> Gerado automaticamente a partir da página `/evolucao` do site.

"""

# Captura uma string entre aspas duplas, respeitando barras invertidas de escape.
STRING = r'"((?:[^"\\]|\\.)*)"'


def extrair_bloco_dos_marcos(codigo: str) -> str:
    """Isola o trecho do arquivo que contém a lista de marcos."""
    inicio = codigo.index("const MARCOS: Marco[] = [")
    fim = codigo.index("\n];", inicio)
    return codigo[inicio:fim]


def limpar(texto: str) -> str:
    """Desfaz os escapes do JavaScript e normaliza aspas para leitura em PDF."""
    texto = texto.replace('\\"', '"').replace("\\\\", "\\").replace("\\n", " ")
    # Aspas simples usadas como citação viram aspas tipográficas
    texto = re.sub(r"'([^']{2,60})'", r"“\1”", texto)
    return texto.strip()


def extrair_campo(bloco: str, campo: str) -> str | None:
    """Lê um campo do objeto do marco. Devolve None se for null ou não existir."""
    padrao = rf"{campo}:\s*(?:{STRING}|null)"
    achado = re.search(padrao, bloco)
    if not achado or achado.group(1) is None:
        return None
    return limpar(achado.group(1))


def gerar_markdown() -> str:
    codigo = ORIGEM.read_text(encoding="utf-8")
    bloco_marcos = extrair_bloco_dos_marcos(codigo)

    # Cada marco é um objeto do array — usamos a abertura de chaves para separá-los
    partes = re.split(r"\n  \{\n", bloco_marcos)[1:]

    linhas: list[str] = [CABECALHO, "---\n"]
    total = 0

    for parte in partes:
        titulo = extrair_campo(parte, "titulo")
        if not titulo:
            continue
        total += 1
        data = extrair_campo(parte, "data") or "Data não informada"
        descricao = extrair_campo(parte, "descricao") or ""
        nota = extrair_campo(parte, "notaTecnica")
        em_andamento = 'status: "em-andamento"' in parte
        situacao = "Em andamento" if em_andamento else "Concluído"

        linhas.append(f"\n## {total}. {titulo}\n")
        linhas.append(f"**Data:** {data}  \n**Status:** {situacao}\n")
        linhas.append(f"\n{descricao}\n")
        if nota:
            linhas.append(f"\n**Detalhe técnico:** {nota}\n")
        linhas.append("\n---\n")

    linhas.append(f"\n*Total de marcos registrados: {total}.*\n")
    print(f"Marcos extraidos: {total}")
    return "".join(linhas)


if __name__ == "__main__":
    DESTINO.write_text(gerar_markdown(), encoding="utf-8")
    print(f"Gerado: {DESTINO.relative_to(RAIZ)}")
