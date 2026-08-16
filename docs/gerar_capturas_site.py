"""Captura as telas da versão atual do site (o protótipo P2 da entrega).

O avaliador pediu imagens das etapas P1 e P2. A P1 é a captura da primeira
tela feita no Lovable, que a equipe já tem. Estas são as da versão atual.

São capturas de tela, não da página inteira: a P1 é uma tela só, e a
comparação fica mais honesta se os dois lados forem enquadrados do mesmo jeito.

Uso (a partir da raiz do projeto):
    python docs/gerar_capturas_site.py
"""

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from servidor_local import CSS_LIMPEZA, COOKIE_ACESSO, servidor_local  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "docs" / "imagens" / "site"

LARGURA, ALTURA = 1440, 900

# rota -> nome do arquivo
TELAS = {
    "/": "P2-01-analisador.png",
    "/jogos": "P2-02-jogos.png",
    "/professor": "P2-03-modo-professor.png",
    "/pesquisa": "P2-04-pesquisa-e-dados.png",
    "/evolucao": "P2-05-evolucao.png",
    "/biblioteca": "P2-06-biblioteca.png",
}


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)

    with servidor_local() as endereco, sync_playwright() as p:
        navegador = p.chromium.launch(channel="chrome")
        contexto = navegador.new_context(
            viewport={"width": LARGURA, "height": ALTURA},
            device_scale_factor=2,  # dobro da resolução, para não borrar
        )
        contexto.add_cookies(COOKIE_ACESSO)
        pagina = contexto.new_page()

        print(f"Capturando {len(TELAS)} telas em {LARGURA}x{ALTURA}...")
        for rota, arquivo in TELAS.items():
            pagina.goto(f"{endereco}{rota}", wait_until="networkidle")
            if "/acesso" in pagina.url:
                raise SystemExit("Caiu na tela de senha — o cookie não foi aceito.")
            # As seções entram com animação; esperar evita capturar no meio dela
            pagina.wait_for_timeout(1200)
            pagina.add_style_tag(content=CSS_LIMPEZA)
            destino = SAIDA / arquivo
            pagina.screenshot(path=str(destino))
            print(f"  {arquivo}: {destino.stat().st_size / 1024:,.0f} KB")

        navegador.close()

    print(f"\nGerado em: {SAIDA.relative_to(RAIZ)}")
    print("\nFalta capturar a mao:")
    print("  - a tela de resultado de uma analise real, com a nota e as")
    print("    justificativas. Depende do servidor de analise no ar, e uma")
    print("    analise de verdade vale mais do que uma simulada.")


if __name__ == "__main__":
    main()
