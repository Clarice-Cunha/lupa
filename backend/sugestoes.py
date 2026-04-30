"""
Portal de colaboração — sugestões e melhorias enviadas pelos usuários.

Armazenado em sugestoes.json. O campo email é salvo internamente
mas nunca retornado na listagem pública (proteção de privacidade).
"""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from pydantic import BaseModel, Field


_ARQUIVO = Path(__file__).parent / "sugestoes.json"


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


def _carregar() -> list[dict]:
    if not _ARQUIVO.exists():
        return []
    try:
        return json.loads(_ARQUIVO.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _salvar(dados: list[dict]) -> None:
    _ARQUIVO.write_text(
        json.dumps(dados, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def listar_sugestoes_publicas() -> list[SugestaoPublica]:
    """Retorna sugestões sem o email, da mais recente para a mais antiga."""
    dados = _carregar()
    dados.sort(key=lambda s: s.get("criado_em", ""), reverse=True)
    return [
        SugestaoPublica(
            id=s["id"],
            nome=s["nome"],
            mensagem=s["mensagem"],
            resposta=s.get("resposta"),
            criado_em=s["criado_em"],
            respondido_em=s.get("respondido_em"),
        )
        for s in dados
    ]


def listar_sugestoes_internas() -> list[SugestaoInterno]:
    """Retorna sugestões completas (com email) para o painel de moderação."""
    dados = _carregar()
    dados.sort(key=lambda s: s.get("criado_em", ""), reverse=True)
    return [SugestaoInterno(**s) for s in dados]


def criar_sugestao(entrada: SugestaoEntrada) -> SugestaoPublica:
    """Persiste uma nova sugestão e retorna a versão pública."""
    agora = _agora()
    registro = {
        "id": str(uuid.uuid4()),
        "nome": entrada.nome.strip(),
        "email": entrada.email.strip() if entrada.email else None,
        "mensagem": entrada.mensagem.strip(),
        "resposta": None,
        "criado_em": agora,
        "respondido_em": None,
    }
    dados = _carregar()
    dados.append(registro)
    _salvar(dados)
    return SugestaoPublica(
        id=registro["id"],
        nome=registro["nome"],
        mensagem=registro["mensagem"],
        resposta=None,
        criado_em=agora,
        respondido_em=None,
    )


def responder_sugestao(id: str, resposta: str) -> SugestaoInterno:
    """Adiciona ou atualiza a resposta pública de uma sugestão."""
    dados = _carregar()
    for i, sugestao in enumerate(dados):
        if sugestao.get("id") == id:
            dados[i]["resposta"] = resposta.strip()
            dados[i]["respondido_em"] = _agora()
            _salvar(dados)
            return SugestaoInterno(**dados[i])
    raise ValueError(f"Sugestão '{id}' não encontrada.")
