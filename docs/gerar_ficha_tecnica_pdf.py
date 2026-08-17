"""Exporta a página /ficha-tecnica do site como PDF.

Por que precisa de um navegador: a ficha é uma página React, montada na hora.
Não dá para extrair o conteúdo lendo o arquivo-fonte como fazemos com o diário
e as referências, porque ali o texto está espalhado em JSX, não em uma lista
de dados.

Quem sobe o site e resolve a senha é o módulo servidor_local.

Requisitos: playwright instalado e o Chrome no computador.

Uso (a partir da raiz do projeto):
    python docs/gerar_ficha_tecnica_pdf.py
"""

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from servidor_local import CSS_LIMPEZA, servidor_local  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "docs" / "FICHA_TECNICA.pdf"


def main() -> None:
    with servidor_local() as endereco, sync_playwright() as p:
        print("Gerando o PDF...")
        navegador = p.chromium.launch(channel="chrome")
        contexto = navegador.new_context()
        pagina = contexto.new_page()
        pagina.goto(f"{endereco}/ficha-tecnica", wait_until="networkidle")

        # As seções entram com animação; esperar evita capturar no meio dela
        pagina.wait_for_timeout(1500)
        pagina.add_style_tag(content=CSS_LIMPEZA)
        pagina.emulate_media(media="screen")  # mantém as cores do site
        pagina.pdf(
            path=str(DESTINO),
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "10mm", "right": "10mm"},
        )
        navegador.close()

    tamanho = DESTINO.stat().st_size / 1024
    print(f"Gerado: {DESTINO.relative_to(RAIZ)} ({tamanho:,.0f} KB)")


if __name__ == "__main__":
    main()
