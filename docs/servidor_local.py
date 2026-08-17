"""Sobe o site em modo de desenvolvimento, para scripts que precisam vê-lo pronto.

Até 16/08/2026 este módulo também precisava contornar o portão de senha do
site, injetando um cookie no navegador. O portão foi removido quando o LUPA
abriu ao público, e com ele essa complicação toda.

Usado por gerar_ficha_tecnica_pdf.py e gerar_capturas_site.py.
"""

import socket
import subprocess
import time
from contextlib import contextmanager
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FRONTEND = RAIZ / "frontend"

PORTA = 3210  # porta alta, para não conflitar com um dev server já aberto
ENDERECO = f"http://localhost:{PORTA}"
ESPERA_MAXIMA = 180  # a primeira compilação do Next.js é lenta

# Some da impressão o que só existe no modo de desenvolvimento, mais o botão
# flutuante de feedback — útil na tela, sem sentido numa página capturada.
CSS_LIMPEZA = """
nextjs-portal,
[data-nextjs-toast],
#__next-build-watcher,
[data-nextjs-dev-tools-button] { display: none !important; }
.fixed.bottom-5.right-5 { display: none !important; }
"""


def porta_respondendo(porta: int = PORTA) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", porta)) == 0


def _esperar(processo: subprocess.Popen) -> None:
    inicio = time.time()
    while time.time() - inicio < ESPERA_MAXIMA:
        if processo.poll() is not None:
            raise SystemExit("O servidor de desenvolvimento encerrou sozinho.")
        if porta_respondendo():
            return
        time.sleep(1)
    raise SystemExit(f"O servidor não respondeu em {ESPERA_MAXIMA}s.")


def _encerrar(processo: subprocess.Popen) -> None:
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


@contextmanager
def servidor_local():
    """Sobe o servidor, entrega o endereço e garante o encerramento no fim."""
    if porta_respondendo():
        raise SystemExit(f"A porta {PORTA} já está ocupada. Feche o processo e repita.")

    print(f"Subindo o servidor de desenvolvimento na porta {PORTA}...")
    processo = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(PORTA)],
        cwd=str(FRONTEND),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        shell=True,
    )
    try:
        _esperar(processo)
        print("Servidor no ar.")
        yield ENDERECO
    finally:
        _encerrar(processo)
