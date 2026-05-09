"""
Módulo de validação com usuários reais.

Armazena avaliações enviadas por pessoas que testaram o LUPA e expõe
os resultados agregados (percentuais + depoimentos aprovados) para a
página /validacao do frontend.

Tabela Supabase necessária:
    CREATE TABLE validacoes (
        id UUID PRIMARY KEY,
        nome TEXT NOT NULL DEFAULT 'Anônimo',
        perfil TEXT NOT NULL,
        aprendeu_algo BOOLEAN NOT NULL,
        identificou_sinal BOOLEAN NOT NULL,
        recomendaria BOOLEAN NOT NULL,
        facilidade INTEGER NOT NULL,
        depoimento TEXT NOT NULL DEFAULT '',
        aprovado BOOLEAN NOT NULL DEFAULT FALSE,
        criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
"""

import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from db import get_db


PerfilUsuario = Literal["estudante", "professor", "familiar", "outro"]


class ValidacaoEntrada(BaseModel):
    nome: str = Field("", max_length=100)
    perfil: PerfilUsuario
    aprendeu_algo: bool
    identificou_sinal: bool
    recomendaria: bool
    facilidade: int = Field(..., ge=1, le=5)
    depoimento: str = Field("", max_length=500)


class DepoimentoPublico(BaseModel):
    id: str
    nome: str
    perfil: str
    depoimento: str
    criado_em: str


class ResultadosValidacao(BaseModel):
    total: int
    percentual_aprendeu: float
    percentual_identificou: float
    percentual_recomendaria: float
    media_facilidade: float
    depoimentos: list[DepoimentoPublico]


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def criar_validacao(entrada: ValidacaoEntrada) -> dict:
    dados = {
        "id": str(uuid.uuid4()),
        "nome": entrada.nome.strip() or "Anônimo",
        "perfil": entrada.perfil,
        "aprendeu_algo": entrada.aprendeu_algo,
        "identificou_sinal": entrada.identificou_sinal,
        "recomendaria": entrada.recomendaria,
        "facilidade": entrada.facilidade,
        "depoimento": entrada.depoimento.strip(),
        "aprovado": False,
        "criado_em": _agora(),
    }
    get_db().table("validacoes").insert(dados).execute()
    return dados


def obter_resultados() -> ResultadosValidacao:
    todos = get_db().table("validacoes").select("*").execute().data

    total = len(todos)
    if total == 0:
        return ResultadosValidacao(
            total=0,
            percentual_aprendeu=0.0,
            percentual_identificou=0.0,
            percentual_recomendaria=0.0,
            media_facilidade=0.0,
            depoimentos=[],
        )

    aprendeu = sum(1 for r in todos if r.get("aprendeu_algo"))
    identificou = sum(1 for r in todos if r.get("identificou_sinal"))
    recomendaria = sum(1 for r in todos if r.get("recomendaria"))
    soma_facilidade = sum(r.get("facilidade", 3) for r in todos)

    depoimentos = [
        DepoimentoPublico(
            id=r["id"],
            nome=r.get("nome") or "Anônimo",
            perfil=r.get("perfil", "outro"),
            depoimento=r.get("depoimento", ""),
            criado_em=r.get("criado_em", ""),
        )
        for r in todos
        if r.get("aprovado") and r.get("depoimento", "").strip()
    ]

    return ResultadosValidacao(
        total=total,
        percentual_aprendeu=round(aprendeu / total * 100, 1),
        percentual_identificou=round(identificou / total * 100, 1),
        percentual_recomendaria=round(recomendaria / total * 100, 1),
        media_facilidade=round(soma_facilidade / total, 1),
        depoimentos=depoimentos,
    )
