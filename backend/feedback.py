"""
Módulo de feedback dos usuários — armazena registros de dificuldade
reportados pelo widget flutuante presente em todas as páginas do LUPA.

Os dados são persistidos no Supabase (PostgreSQL), substituindo o
arquivo feedbacks.json que era apagado a cada reinício do Render.
"""

import uuid
from datetime import datetime, timezone

from pydantic import BaseModel, Field

from db import get_db


class FeedbackEntrada(BaseModel):
    pagina: str = Field(..., max_length=500)
    texto: str = Field("", max_length=300)


class Feedback(BaseModel):
    id: str
    pagina: str
    texto: str
    criado_em: str


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def criar_feedback(entrada: FeedbackEntrada) -> Feedback:
    dados = {
        "id": str(uuid.uuid4()),
        "pagina": entrada.pagina,
        "texto": entrada.texto,
        "criado_em": _agora(),
    }
    resultado = get_db().table("feedbacks").insert(dados).execute()
    return Feedback(**resultado.data[0])


def listar_feedbacks() -> list[Feedback]:
    resultado = (
        get_db()
        .table("feedbacks")
        .select("*")
        .order("criado_em", desc=True)
        .execute()
    )
    return [Feedback(**d) for d in resultado.data]
