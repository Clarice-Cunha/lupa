"""
Mensagens de contato enviadas pelos usuários ao time LUPA.

Qualquer visitante pode preencher o formulário em /contato.
O moderador visualiza e marca as mensagens como lidas no painel de moderação.
O email e telefone nunca são expostos publicamente.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field

from db import get_db


class ContatoEntrada(BaseModel):
    """Campos enviados pelo usuário no formulário de contato."""

    nome: str = Field(..., min_length=2, max_length=200)
    email: str = Field(..., max_length=300)
    telefone: Optional[str] = Field(None, max_length=30)
    mensagem: str = Field(..., min_length=10, max_length=3000)


class ContatoAtualizacao(BaseModel):
    """Campos que o moderador pode alterar."""

    lido: bool


class Contato(BaseModel):
    """Representação completa de uma mensagem de contato."""

    id: str
    nome: str
    email: str
    telefone: Optional[str] = None
    mensagem: str
    lido: bool
    criado_em: str


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def criar_contato(entrada: ContatoEntrada) -> Contato:
    """Persiste uma nova mensagem de contato no banco de dados."""
    dados = {
        "id": str(uuid.uuid4()),
        "nome": entrada.nome.strip(),
        "email": entrada.email.strip(),
        "telefone": entrada.telefone.strip() if entrada.telefone else None,
        "mensagem": entrada.mensagem.strip(),
        "lido": False,
        "criado_em": _agora(),
    }
    resultado = get_db().table("contatos").insert(dados).execute()
    return Contato(**resultado.data[0])


def listar_contatos() -> list[Contato]:
    """Retorna todas as mensagens de contato, da mais recente para a mais antiga."""
    resultado = (
        get_db()
        .table("contatos")
        .select("*")
        .order("criado_em", desc=True)
        .execute()
    )
    return [Contato(**r) for r in resultado.data]


def atualizar_contato(id: str, dados: ContatoAtualizacao) -> Contato:
    """Atualiza o status de leitura de uma mensagem de contato."""
    resultado = (
        get_db()
        .table("contatos")
        .update({"lido": dados.lido})
        .eq("id", id)
        .execute()
    )
    if not resultado.data:
        raise ValueError(f"Contato '{id}' não encontrado.")
    return Contato(**resultado.data[0])
