"""Exporta fluxogramas individuais como PNG, para uso na apresentação.

Os desenhos são SVG dentro de docs/fluxogramas_fonte.html e dependem do bloco
<style> daquele arquivo para saber cor, fonte e espessura de traço. Por isso a
extração leva o estilo junto — um SVG solto sairia sem formatação.

A captura é feita pelo Chrome em modo headless, no dobro do tamanho, para a
imagem não ficar borrada quando projetada.

Uso (a partir da raiz do projeto):
    python docs/gerar_imagens_fluxogramas.py
"""

import re
import subprocess
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "docs" / "fluxogramas_fonte.html"
PASTA_SAIDA = RAIZ / "docs" / "imagens"

NAVEGADORES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
]

# título da seção  ->  nome do arquivo
DESEJADOS = {
    "O falso positivo do banco de checagens": "falso-positivo.png",
    "O que acontece quando alguém cola um link": "cinco-camadas.png",
    "A jornada dos protótipos": "jornada-prototipos.png",
}

ESCALA = 2  # dobro do tamanho, para não borrar na projeção


def localizar_navegador() -> Path:
    for caminho in NAVEGADORES:
        if caminho.exists():
            return caminho
    raise SystemExit("Nenhum navegador encontrado. Instale o Chrome ou o Edge.")


def extrair_estilo(html: str) -> str:
    inicio = html.index("<style>")
    fim = html.index("</style>") + len("</style>")
    return html[inicio:fim]


def extrair_svg(html: str, titulo: str) -> str:
    marcador = f"<h2>{titulo}</h2>"
    if marcador not in html:
        raise KeyError(f"secao {titulo!r} nao encontrada")
    pos = html.index(marcador)
    inicio = html.index("<svg", pos)
    fim = html.index("</svg>", inicio) + len("</svg>")
    return html[inicio:fim]


def dimensoes(svg: str) -> tuple[int, int]:
    achado = re.search(r'viewBox="0 0 (\d+) (\d+)"', svg)
    if not achado:
        raise ValueError("viewBox nao encontrado no svg")
    return int(achado.group(1)), int(achado.group(2))


def montar_pagina(estilo: str, svg: str, largura: int, altura: int) -> str:
    # data-theme="light" derruba a media query de tema escuro do arquivo-fonte;
    # o min-width do estilo original precisa ser anulado para o svg respeitar
    # exatamente o tamanho pedido.
    return f"""<!doctype html>
<html lang="pt-BR" data-theme="light"><head><meta charset="utf-8">
{estilo}
<style>
  html, body {{ margin: 0; padding: 0; background: #ffffff; }}
  svg {{
    display: block;
    width: {largura}px !important;
    height: {altura}px !important;
    min-width: 0 !important;
    max-width: none !important;
  }}
</style>
</head><body>{svg}</body></html>"""


def main() -> None:
    navegador = localizar_navegador()
    html = ORIGEM.read_text(encoding="utf-8")
    estilo = extrair_estilo(html)
    PASTA_SAIDA.mkdir(exist_ok=True)

    for titulo, arquivo in DESEJADOS.items():
        svg = extrair_svg(html, titulo)
        vb_largura, vb_altura = dimensoes(svg)
        largura, altura = vb_largura * ESCALA, vb_altura * ESCALA
        destino = PASTA_SAIDA / arquivo

        with tempfile.TemporaryDirectory() as pasta:
            pagina = Path(pasta) / "captura.html"
            pagina.write_text(
                montar_pagina(estilo, svg, largura, altura), encoding="utf-8"
            )
            subprocess.run(
                [
                    str(navegador),
                    "--headless",
                    "--disable-gpu",
                    "--hide-scrollbars",
                    "--default-background-color=ffffff",
                    f"--window-size={largura},{altura}",
                    f"--screenshot={destino}",
                    pagina.as_uri(),
                ],
                check=True,
                capture_output=True,
            )

        tamanho = destino.stat().st_size / 1024
        print(f"  {arquivo}: {largura}x{altura} px ({tamanho:,.0f} KB)")

    print(f"Gerado em: {PASTA_SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
