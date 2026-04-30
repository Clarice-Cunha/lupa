"""
Portal de colaboração — sugestões e melhorias enviadas pelos usuários.

Os dados são persistidos no Supabase (PostgreSQL), substituindo o
arquivo sugestoes.json que era apagado a cada reinício do Render.
O campo email é salvo internamente mas nunca retornado publicamente.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field

from db import get_db


class SugestaoPublica(BaseModel):
    """Dados visíveis ao público — sem email."""
    id: str
    nome: str
    mensagem: str
    resposta: Optional[str] = None
    criado_em: str
    respondido_em: Optional[str] = None


class SugestaoInterno(BaseModel):
    """Dados completos para o painel de moderação — inclui email."""
    id: str
    nome: str
    email: Optional[str] = None
    mensagem: str
    resposta: Optional[str] = None
    criado_em: str
    respondido_em: Optional[str] = None


class SugestaoEntrada(BaseModel):
    """Campos enviados pelo usuário no formulário."""
    nome: str = Field(..., max_length=200)
    email: Optional[str] = Field(None, max_length=300)
    mensagem: str = Field(..., max_length=2000)


class SugestaoRespostaEntrada(BaseModel):
    """Resposta que o moderador publica."""
    resposta: str = Field(..., min_length=1, max_length=2000)


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def listar_sugestoes_publicas() -> list[SugestaoPublica]:
    """Retorna sugestões sem o email, da mais recente para a mais antiga."""
    resultado = (
        get_db()
        .table("sugestoes")
        .select("id,nome,mensagem,resposta,criado_em,respondido_em")
        .order("criado_em", desc=True)
        .execute()
    )
    return [SugestaoPublica(**r) for r in resultado.data]


def listar_sugestoes_internas() -> list[SugestaoInterno]:
    """Retorna sugestões completas (com email) para o painel de moderação."""
    resultado = (
        get_db()
        .table("sugestoes")
        .select("*")
        .order("criado_em", desc=True)
        .execute()
    )
    return [SugestaoInterno(**r) for r in resultado.data]


def criar_sugestao(entrada: SugestaoEntrada) -> SugestaoPublica:
    """Persiste uma nova sugestão e retorna a versão pública."""
    agora = _agora()
    dados = {
        "id": str(uuid.uuid4()),
        "nome": entrada.nome.strip(),
        "email": entrada.email.strip() if entrada.email else None,
        "mensagem": entrada.mensagem.strip(),
        "resposta": None,
        "criado_em": agora,
        "respondido_em": None,
    }
    resultado = get_db().table("sugestoes").insert(dados).execute()
    r = resultado.data[0]
    return SugestaoPublica(
        id=r["id"],
        nome=r["nome"],
        mensagem=r["mensagem"],
        resposta=None,
        criado_em=r["criado_em"],
        respondido_em=None,
    )


def responder_sugestao(id: str, resposta: str) -> SugestaoInterno:
    """Adiciona ou atualiza a resposta pública de uma sugestão."""
    dados = {"resposta": resposta.strip(), "respondido_em": _agora()}
    resultado = get_db().table("sugestoes").update(dados).eq("id", id).execute()
    if not resultado.data:
        raise ValueError(f"Sugestão '{id}' não encontrada.")
    return SugestaoInterno(**resultado.data[0])
