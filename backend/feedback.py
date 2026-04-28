"""
Módulo de feedback dos usuários — armazena registros de dificuldade
reportados pelo widget flutuante presente em todas as páginas do LUPA.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path

from pydantic import BaseModel, Field

ARQUIVO_FEEDBACKS = Path(__file__).parent / "feedbacks.json"


def _carregar() -> list[dict]:
    if not ARQUIVO_FEEDBACKS.exists():
        return []
    try:
        return json.loads(ARQUIVO_FEEDBACKS.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _salvar(dados: list[dict]) -> None:
    ARQUIVO_FEEDBACKS.write_text(
        json.dumps(dados, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


class FeedbackEntrada(BaseModel):
    pagina: str = Field(..., max_length=500, description="Caminho da página onde o feedback foi dado")
    texto: str = Field("", max_length=300, description="Texto livre do usuário (opcional)")


class Feedback(BaseModel):
    id: str
    pagina: str
    texto: str
    criado_em: str


def criar_feedback(entrada: FeedbackEntrada) -> Feedback:
    dados = _carregar()
    novo = Feedback(
        id=str(uuid.uuid4()),
        pagina=entrada.pagina,
        texto=entrada.texto,
        criado_em=datetime.utcnow().isoformat(),
    )
    dados.append(novo.model_dump())
    _salvar(dados)
    return novo


def listar_feedbacks() -> list[Feedback]:
    dados = _carregar()
    return [Feedback(**d) for d in reversed(dados)]
