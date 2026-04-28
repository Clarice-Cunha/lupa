"""
Portal comunitário de boatos — armazenamento e lógica de negócio.

Boatos reportados pela comunidade são salvos em boatos.json.
Em produção, este módulo seria substituído por um banco de dados.
"""

import json
import uuid
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional

from pydantic import BaseModel, Field


_ARQUIVO = Path(__file__).parent / "boatos.json"


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


class BoatoEntrada(BaseModel):
    """Campos preenchidos pelo usuário ao reportar um boato."""
    categoria: Categoria
    localidade: str = Field(..., max_length=200)
    descricao: str = Field(..., max_length=1000)
    contato: Optional[str] = Field(None, max_length=200)


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


def listar_boatos(categoria: Categoria | None = None) -> list[Boato]:
    """Retorna todos os boatos, do mais recente ao mais antigo."""
    dados = _carregar()
    if categoria:
        dados = [b for b in dados if b.get("categoria") == categoria.value]
    dados.sort(key=lambda b: b.get("criado_em", ""), reverse=True)
    return [Boato(**b) for b in dados]


class BoatoAtualizacao(BaseModel):
    """Campos que o moderador pode alterar em um boato existente."""
    status: Optional[Status] = None
    checagem: Optional[str] = Field(None, max_length=2000)
    fontes: Optional[list[str]] = None


def atualizar_boato(id: str, atualizacao: BoatoAtualizacao) -> Boato:
    """Atualiza status, checagem ou fontes de um boato. Lança ValueError se não encontrado."""
    dados = _carregar()
    for i, boato in enumerate(dados):
        if boato.get("id") == id:
            if atualizacao.status is not None:
                dados[i]["status"] = atualizacao.status.value
            if atualizacao.checagem is not None:
                dados[i]["checagem"] = atualizacao.checagem.strip() or None
            if atualizacao.fontes is not None:
                dados[i]["fontes"] = atualizacao.fontes
            dados[i]["atualizado_em"] = _agora()
            _salvar(dados)
            return Boato(**dados[i])
    raise ValueError(f"Boato '{id}' não encontrado.")


def criar_boato(entrada: BoatoEntrada) -> Boato:
    """Cria e persiste um novo boato no arquivo JSON."""
    agora = _agora()
    boato = Boato(
        id=str(uuid.uuid4()),
        categoria=entrada.categoria,
        localidade=entrada.localidade.strip(),
        descricao=entrada.descricao.strip(),
        contato=entrada.contato.strip() if entrada.contato else None,
        criado_em=agora,
        atualizado_em=agora,
    )
    dados = _carregar()
    dados.append(boato.model_dump())
    _salvar(dados)
    return boato
