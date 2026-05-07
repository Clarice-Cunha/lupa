"""
Portal comunitário de boatos — armazenamento e lógica de negócio.

Os dados são persistidos no Supabase (PostgreSQL), substituindo o
arquivo boatos.json que era apagado a cada reinício do Render.
"""

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from db import get_db


class Categoria(str, Enum):
    cidade = "cidade"
    escola = "escola"
    condominio = "condominio"


class Status(str, Enum):
    pendente = "pendente"
    em_apuracao = "em_apuracao"
    verificado_verdadeiro = "verificado_verdadeiro"
    verificado_falso = "verificado_falso"
    inconclusivo = "inconclusivo"


class Boato(BaseModel):
    id: str
    categoria: Categoria
    localidade: str
    descricao: str
    contato: Optional[str] = None
    status: Status = Status.pendente
    checagem: Optional[str] = None
    fontes: list[str] = []
    criado_em: str
    atualizado_em: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class BoatoEntrada(BaseModel):
    categoria: Categoria
    localidade: str = Field(..., max_length=200)
    descricao: str = Field(..., max_length=1000)
    contato: Optional[str] = Field(None, max_length=200)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class BoatoAtualizacao(BaseModel):
    status: Optional[Status] = None
    checagem: Optional[str] = Field(None, max_length=2000)
    fontes: Optional[list[str]] = None


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def listar_boatos(categoria: Categoria | None = None) -> list[Boato]:
    query = get_db().table("boatos").select("*").order("criado_em", desc=True)
    if categoria:
        query = query.eq("categoria", categoria.value)
    resultado = query.execute()
    return [Boato(**r) for r in resultado.data]


def criar_boato(entrada: BoatoEntrada) -> Boato:
    agora = _agora()
    dados = {
        "id": str(uuid.uuid4()),
        "categoria": entrada.categoria.value,
        "localidade": entrada.localidade.strip(),
        "descricao": entrada.descricao.strip(),
        "contato": entrada.contato.strip() if entrada.contato else None,
        "status": Status.pendente.value,
        "checagem": None,
        "fontes": [],
        "criado_em": agora,
        "atualizado_em": agora,
        "latitude": entrada.latitude,
        "longitude": entrada.longitude,
    }
    resultado = get_db().table("boatos").insert(dados).execute()
    return Boato(**resultado.data[0])


def atualizar_boato(id: str, atualizacao: BoatoAtualizacao) -> Boato:
    campos: dict = {}
    if atualizacao.status is not None:
        campos["status"] = atualizacao.status.value
    if atualizacao.checagem is not None:
        campos["checagem"] = atualizacao.checagem.strip() or None
    if atualizacao.fontes is not None:
        campos["fontes"] = atualizacao.fontes
    campos["atualizado_em"] = _agora()

    resultado = get_db().table("boatos").update(campos).eq("id", id).execute()
    if not resultado.data:
        raise ValueError(f"Boato '{id}' não encontrado.")
    return Boato(**resultado.data[0])
