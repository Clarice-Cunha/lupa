"""
Módulo de parcerias com escolas — armazena solicitações de professores
que querem usar o LUPA de forma estruturada em sala de aula.

Os dados são persistidos no Supabase (PostgreSQL), substituindo o
arquivo parcerias.json que era apagado a cada reinício do Render.
"""

import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from db import get_db


NivelEnsino = Literal["4-5", "6-7", "8-9", "em"]


class ParceiraEntrada(BaseModel):
    nome: str = Field(..., min_length=2, max_length=150)
    escola: str = Field(..., min_length=2, max_length=200)
    cidade_estado: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    niveis: list[NivelEnsino] = Field(..., min_length=1)
    como_usar: str = Field("", max_length=1000)


class Parceria(BaseModel):
    id: str
    nome: str
    escola: str
    cidade_estado: str
    email: str
    niveis: list[str]
    como_usar: str
    criado_em: str


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def criar_parceria(entrada: ParceiraEntrada) -> Parceria:
    dados = {
        "id": str(uuid.uuid4()),
        "nome": entrada.nome,
        "escola": entrada.escola,
        "cidade_estado": entrada.cidade_estado,
        "email": entrada.email,
        "niveis": list(entrada.niveis),
        "como_usar": entrada.como_usar,
        "criado_em": _agora(),
    }
    resultado = get_db().table("parcerias").insert(dados).execute()
    return Parceria(**resultado.data[0])


def listar_parcerias() -> list[Parceria]:
    resultado = (
        get_db()
        .table("parcerias")
        .select("*")
        .order("criado_em", desc=True)
        .execute()
    )
    return [Parceria(**d) for d in resultado.data]
