"""Gera o PDF dos fluxogramas a partir de docs/fluxogramas_fonte.html.

O arquivo-fonte é a página que a equipe usa para estudar a evolução do projeto.
Ela contém dois tipos de conteúdo que NÃO devem chegar à banca avaliadora:

  1. os blocos "Como usar", que são orientações internas para a equipe;
  2. o fluxograma "Como a ideia foi escolhida", que é um modelo em branco.

Este script remove os dois, força o tema claro (um PDF impresso com fundo
escuro gasta tinta e fica ilegível) e converte para PDF usando o Chrome em
modo headless — ou seja, o navegador roda sem abrir janela, só para imprimir.

Uso (a partir da raiz do projeto):
    python docs/gerar_fluxogramas.py
"""

import re
import subprocess
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "docs" / "fluxogramas_fonte.html"
DESTINO = RAIZ / "docs" / "FLUXOGRAMAS.pdf"

NAVEGADORES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
]

# Título do fluxograma que é apenas um modelo em branco, sem conteúdo real.
SECAO_EM_BRANCO = "Como a ideia foi escolhida"

## A altura máxima do desenho é o que garante um fluxograma por página:
## A4 deitado tem 210 mm de altura, menos 24 mm de margens e o espaço do
## título, do texto de abertura e da legenda.
CSS_IMPRESSAO = """
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { background: #fff !important; font-size: 12px; }
  section {
    break-before: page; page-break-before: always;
    break-inside: avoid; page-break-inside: avoid;
  }
  section:first-of-type { break-before: auto; page-break-before: auto; }
  figure { break-inside: avoid; page-break-inside: avoid; margin: 0; }
  .scroller { overflow: visible !important; }
  svg {
    max-width: 100% !important;
    max-height: 118mm !important;
    width: auto !important;
    height: auto !important;
  }
  h2 { margin-bottom: 4px; }
  .lead { font-size: 12px; margin-bottom: 6px; }
  figcaption { font-size: 10px; }
</style>
"""


def localizar_navegador() -> Path:
    for caminho in NAVEGADORES:
        if caminho.exists():
            return caminho
    raise SystemExit("Nenhum navegador encontrado. Instale o Chrome ou o Edge.")


def remover_blocos_uso(html: str) -> str:
    """Remove todos os blocos <div class="uso">…</div> (orientações internas)."""
    return re.sub(
        r'\n\s*<div class="uso">.*?</div>', "", html, flags=re.DOTALL
    )


def remover_secao_em_branco(html: str) -> str:
    """Remove a seção cujo fluxograma é apenas um modelo a preencher."""
    marcador = f"<h2>{SECAO_EM_BRANCO}</h2>"
    if marcador not in html:
        print(f"  aviso: secao '{SECAO_EM_BRANCO}' nao encontrada")
        return html
    posicao = html.index(marcador)
    inicio = html.rindex("<section>", 0, posicao)
    fim = html.index("<section>", posicao)
    return html[:inicio] + html[fim:]


def montar_html_para_impressao() -> str:
    html = ORIGEM.read_text(encoding="utf-8")
    html = remover_blocos_uso(html)
    html = remover_secao_em_branco(html)
    restantes = html.count("<h2>")
    print(f"Fluxogramas incluidos no PDF: {restantes}")

    # data-theme="light" vence a media query de tema escuro do arquivo-fonte
    return (
        '<!doctype html><html lang="pt-BR" data-theme="light"><head>'
        '<meta charset="utf-8">'
        f"{CSS_IMPRESSAO}</head><body>{html}</body></html>"
    )


if __name__ == "__main__":
    navegador = localizar_navegador()
    with tempfile.TemporaryDirectory() as pasta:
        temporario = Path(pasta) / "fluxogramas_impressao.html"
        temporario.write_text(montar_html_para_impressao(), encoding="utf-8")

        subprocess.run(
            [
                str(navegador),
                "--headless",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--print-to-pdf={DESTINO}",
                temporario.as_uri(),
            ],
            check=True,
            capture_output=True,
        )

    tamanho = DESTINO.stat().st_size / 1024
    print(f"Gerado: {DESTINO.relative_to(RAIZ)} ({tamanho:,.0f} KB)")
