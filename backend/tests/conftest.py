"""Configuração do pytest.

Adiciona a pasta `backend/` ao caminho de importação, para que os testes
possam fazer `from analyzer import ...` sem precisar instalar o projeto.
"""

import sys
from pathlib import Path

RAIZ_BACKEND = Path(__file__).resolve().parent.parent
if str(RAIZ_BACKEND) not in sys.path:
    sys.path.insert(0, str(RAIZ_BACKEND))
