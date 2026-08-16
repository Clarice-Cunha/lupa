"""Gera a lista de referências em ABNT a partir da página /pesquisa do site.

Mesma ideia do gerar_diario_bordo.py: a página é a fonte de verdade e o PDF é
gerado a partir dela. Assim as três cópias exigidas na Etapa Regional — o site,
o PDF da pasta do Drive e o Anexo II — não podem divergir.

Uso (a partir da raiz do projeto):
    python docs/gerar_referencias.py
"""

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "frontend" / "app" / "pesquisa" / "page.tsx"
DESTINO = RAIZ / "docs" / "REFERENCIAS_ABNT.md"

# Ordem em que os tipos aparecem no documento
ORDEM_TIPOS = [
    "Artigo científico",
    "Relatório institucional",
    "Manual técnico",
    "E-book",
    "Vídeo",
    "Material educativo",
]

STRING = r'"((?:[^"\\]|\\.)*)"'


def limpar(texto: str) -> str:
    """Desfaz os escapes do JavaScript.

    Não remove espaços das pontas de propósito: a página já traz o
    espaçamento correto entre as três partes da referência, e apagá-lo
    grudaria palavras umas nas outras na hora de remontar a citação.
    """
    return texto.replace('\\"', '"').replace("\\\\", "\\")


def extrair_campo(bloco: str, campo: str) -> str:
    achado = re.search(rf"{campo}:\s*{STRING}", bloco)
    return limpar(achado.group(1)) if achado else ""


def extrair_referencias(codigo: str) -> tuple[list[dict], str]:
    """Devolve a lista de referências e a data de acesso declarada na página."""
    data_acesso = extrair_campo(codigo, "const DATA_ACESSO")
    if not data_acesso:
        achado = re.search(rf"DATA_ACESSO\s*=\s*{STRING}", codigo)
        data_acesso = limpar(achado.group(1)) if achado else "(data não encontrada)"

    inicio = codigo.index("const REFERENCIAS: Referencia[] = [")
    fim = codigo.index("\n];", inicio)
    bloco = codigo[inicio:fim]

    referencias: list[dict] = []
    for parte in re.split(r"\n  \{\n", bloco)[1:]:
        tipo = extrair_campo(parte, "tipo")
        if not tipo:
            continue
        referencias.append(
            {
                "tipo": tipo.strip(),
                # As três partes da citação mantêm o espaçamento da origem
                "antes": extrair_campo(parte, "antes"),
                "destaque": extrair_campo(parte, "destaque"),
                "depois": extrair_campo(parte, "depois"),
                "url": extrair_campo(parte, "url").strip(),
                "nota": extrair_campo(parte, "nota").strip(),
                "conferir": "conferirLink: true" in parte,
            }
        )
    return referencias, data_acesso


def montar_citacao(ref: dict, data_acesso: str) -> str:
    """Monta a referência no formato ABNT NBR 6023.

    O elemento em negrito muda conforme o tipo de obra: em artigo de periódico
    destaca-se o nome da revista; em livro ou relatório, o título da obra.
    """
    citacao = f"{ref['antes']}**{ref['destaque']}**{ref['depois']}"
    # Junta espaços repetidos e limpa as pontas, já que o espaçamento
    # interno veio pronto da página
    citacao = re.sub(r"\s+", " ", citacao).strip()
    # A URL entre < > vira um link de verdade no PDF — e só assim o LaTeX
    # consegue quebrá-la no fim da linha em vez de estourar a margem
    return f"{citacao} Disponível em: <{ref['url']}>. Acesso em: {data_acesso}."


def gerar_markdown() -> str:
    codigo = ORIGEM.read_text(encoding="utf-8")
    referencias, data_acesso = extrair_referencias(codigo)

    por_tipo: dict[str, list[dict]] = {}
    for ref in referencias:
        por_tipo.setdefault(ref["tipo"], []).append(ref)

    tipos = [t for t in ORDEM_TIPOS if t in por_tipo]
    tipos += [t for t in por_tipo if t not in ORDEM_TIPOS]

    linhas = [
        "---\n",
        'title: "Referências bibliográficas do LUPA"\n',
        'subtitle: "Fundamentação teórica do projeto — HackaNAV 2026, Etapa Regional"\n',
        f'date: "Acesso em {data_acesso}"\n',
        "lang: pt-BR\n",
        "---\n\n",
        f"São **{len(referencias)} fontes** distribuídas em **{len(tipos)} formatos "
        "diferentes**. Cada uma vem acompanhada de uma nota indicando a que parte "
        "concreta do LUPA ela deu origem — porque uma referência só entrou na lista "
        "se sustentasse alguma decisão real do projeto.\n\n",
        "Formatação segundo a ABNT NBR 6023. O elemento em negrito varia conforme o "
        "tipo de obra: em artigo de periódico destaca-se o nome da revista; em livro, "
        "relatório ou manual, destaca-se o título.\n\n",
        "| Formato | Quantidade |\n|---|---|\n",
    ]
    for tipo in tipos:
        linhas.append(f"| {tipo} | {len(por_tipo[tipo])} |\n")
    linhas.append(f"| **Total** | **{len(referencias)}** |\n\n---\n")

    for tipo in tipos:
        linhas.append(f"\n## {tipo}\n")
        for ref in por_tipo[tipo]:
            linhas.append(f"\n{montar_citacao(ref, data_acesso)}\n")
            linhas.append(f"\n> **Como foi usada:** {ref['nota']}\n")
            if ref["conferir"]:
                # Sem emoji: a fonte usada no PDF não tem o desenho e ele
                # sairia como um quadrado vazio
                linhas.append(
                    "\n> **A conferir:** confirmar este link antes da entrega.\n"
                )
            linhas.append("\n")

    pendentes = sum(1 for r in referencias if r["conferir"])
    print(f"Referencias extraidas: {len(referencias)} em {len(tipos)} formatos")
    print(f"Links marcados para conferencia: {pendentes}")
    return "".join(linhas)


if __name__ == "__main__":
    DESTINO.write_text(gerar_markdown(), encoding="utf-8")
    print(f"Gerado: {DESTINO.relative_to(RAIZ)}")
