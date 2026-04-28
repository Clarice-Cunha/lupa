"""
Módulo de parcerias com escolas — armazena solicitações de professores
que querem usar o LUPA de forma estruturada em sala de aula.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field

ARQUIVO_PARCERIAS = Path(__file__).parent / "parcerias.json"

NivelEnsino = Literal["4-5", "6-7", "8-9", "em"]


def _carregar() -> list[dict]:
    if not ARQUIVO_PARCERIAS.exists():
        return []
    try:
        return json.loads(ARQUIVO_PARCERIAS.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _salvar(dados: list[dict]) -> None:
    ARQUIVO_PARCERIAS.write_text(
        json.dumps(dados, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


class ParceiraEntrada(BaseModel):
    nome: str = Field(..., min_length=2, max_length=150, description="Nome completo do professor(a)")
    escola: str = Field(..., min_length=2, max_length=200, description="Nome da escola ou instituição")
    cidade_estado: str = Field(..., min_length=2, max_length=100, description="Cidade e estado (ex: Natal/RN)")
    email: str = Field(..., min_length=5, max_length=200, description="E-mail para contato")
    niveis: list[NivelEnsino] = Field(..., min_length=1, description="Séries/níveis que leciona")
    como_usar: str = Field("", max_length=1000, description="Como pretende usar o LUPA em aula")


class Parceria(BaseModel):
    id: str
    nome: str
    escola: str
    cidade_estado: str
    email: str
    niveis: list[str]
    como_usar: str
    criado_em: str


def criar_parceria(entrada: ParceiraEntrada) -> Parceria:
    dados = _carregar()
    nova = Parceria(
        id=str(uuid.uuid4()),
        nome=entrada.nome,
        escola=entrada.escola,
        cidade_estado=entrada.cidade_estado,
        email=entrada.email,
        niveis=list(entrada.niveis),
        como_usar=entrada.como_usar,
        criado_em=datetime.utcnow().isoformat(),
    )
    dados.append(nova.model_dump())
    _salvar(dados)
    return nova


def listar_parcerias() -> list[Parceria]:
    dados = _carregar()
    return [Parceria(**d) for d in reversed(dados)]
