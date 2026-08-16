"""Exporta a página /ficha-tecnica do site como PDF.

Por que precisa de um navegador: a ficha é uma página React, montada na hora.
Não dá para extrair o conteúdo lendo o arquivo-fonte como fazemos com o diário
e as referências, porque ali o texto está espalhado em JSX, não em uma lista
de dados.

O site é protegido por senha (frontend/middleware.ts). Este script sobe o
servidor de desenvolvimento com uma senha temporária e entrega o cookie
correspondente ao navegador, em vez de mexer no middleware.

Requisitos: playwright instalado e o Chrome no computador.

Uso (a partir da raiz do projeto):
    python docs/gerar_ficha_tecnica_pdf.py
"""

import socket
import subprocess
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
FRONTEND = RAIZ / "frontend"
DESTINO = RAIZ / "docs" / "FICHA_TECNICA.pdf"

PORTA = 3210  # porta alta, para não conflitar com um dev server já aberto
SENHA = "pdf-temporario"
ENDERECO = f"http://localhost:{PORTA}"
ESPERA_MAXIMA = 180  # segundos; a primeira compilação do Next.js é lenta


def porta_respondendo(porta: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", porta)) == 0


def esperar_servidor(processo: subprocess.Popen) -> None:
    inicio = time.time()
    while time.time() - inicio < ESPERA_MAXIMA:
        if processo.poll() is not None:
            raise SystemExit("O servidor de desenvolvimento encerrou sozinho.")
        if porta_respondendo(PORTA):
            return
        time.sleep(1)
    raise SystemExit(f"O servidor não respondeu em {ESPERA_MAXIMA}s.")


def gerar_pdf() -> None:
    with sync_playwright() as p:
        navegador = p.chromium.launch(channel="chrome")
        contexto = navegador.new_context()
        # O middleware compara este cookie com a variável ACESSO_SENHA
        contexto.add_cookies(
            [{"name": "lupa_acesso", "value": SENHA, "url": ENDERECO}]
        )
        pagina = contexto.new_page()
        pagina.goto(f"{ENDERECO}/ficha-tecnica", wait_until="networkidle")

        if "/acesso" in pagina.url:
            raise SystemExit("Caiu na tela de senha — o cookie não foi aceito.")

        # As seções entram com animação; esperar evita capturar no meio dela
        pagina.wait_for_timeout(1500)

        # Duas limpezas antes de imprimir:
        # 1. o servidor de desenvolvimento desenha indicadores próprios, que
        #    não existem no site publicado;
        # 2. o widget de feedback é um botão flutuante — útil na tela, sem
        #    sentido numa página impressa.
        pagina.add_style_tag(
            content="""
            nextjs-portal,
            [data-nextjs-toast],
            #__next-build-watcher,
            [data-nextjs-dev-tools-button] { display: none !important; }
            .fixed.bottom-5.right-5 { display: none !important; }
            """
        )
        pagina.emulate_media(media="screen")  # mantém as cores do site
        pagina.pdf(
            path=str(DESTINO),
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "10mm", "right": "10mm"},
        )
        navegador.close()


def main() -> None:
    if porta_respondendo(PORTA):
        raise SystemExit(f"A porta {PORTA} já está ocupada. Feche o processo e repita.")

    print(f"Subindo o servidor de desenvolvimento na porta {PORTA}...")
    processo = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(PORTA)],
        cwd=str(FRONTEND),
        env={**__import__("os").environ, "ACESSO_SENHA": SENHA},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        shell=True,
    )
    try:
        esperar_servidor(processo)
        print("Servidor no ar. Gerando o PDF...")
        gerar_pdf()
    finally:
        processo.terminate()
        try:
            processo.wait(timeout=15)
        except subprocess.TimeoutExpired:
            processo.kill()
        # O npm no Windows deixa o node filho vivo; encerrar pela porta garante
        subprocess.run(
            f'for /f "tokens=5" %a in (\'netstat -ano ^| findstr :{PORTA}\') '
            f"do taskkill /f /pid %a",
            shell=True,
            capture_output=True,
        )

    tamanho = DESTINO.stat().st_size / 1024
    print(f"Gerado: {DESTINO.relative_to(RAIZ)} ({tamanho:,.0f} KB)")


if __name__ == "__main__":
    main()
