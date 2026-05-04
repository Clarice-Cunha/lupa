"""
Módulo de turmas — permite que professores criem turmas e
acompanhem as análises feitas por seus alunos.

Fluxo:
1. Professor acessa /professor/turma e cria uma turma.
   Recebe um código curto (público, para os alunos)
   e uma chave de acesso privada (para ver o painel).
2. Alunos informam o código ao fazer análises na página principal.
3. Cada análise é registrada no Supabase vinculada ao código.
4. Professor retorna ao painel com código + chave e vê o histórico.
"""

from __future__ import annotations

import random
import string
import uuid
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, Field

from db import get_db


TipoAnalise = Literal["url", "texto", "imagem", "video"]


def _agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def _gerar_codigo(tamanho: int = 6) -> str:
    """Gera um código curto de letras maiúsculas e dígitos para os alunos."""
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=tamanho))


def _gerar_chave_acesso(tamanho: int = 12) -> str:
    """Gera uma chave mais longa, privada, para o professor acessar o painel."""
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=tamanho))


# ── Modelos ─────────────────────────────────────────────────────────────────────

class TurmaEntrada(BaseModel):
    nome_professor: str = Field(..., min_length=2, max_length=100)
    nome_turma: str = Field(..., min_length=2, max_length=100)


class TurmaCriada(BaseModel):
    """Retornado apenas uma vez, ao criar a turma. Inclui a chave de acesso."""
    codigo: str
    chave_acesso: str
    nome_professor: str
    nome_turma: str
    criado_em: str


class AnaliseEntrada(BaseModel):
    tipo: TipoAnalise
    pontuacao: int = Field(..., ge=0, le=100)
    classificacao: str = Field(..., max_length=50)
    resumo: Optional[str] = Field(None, max_length=600)


class AnaliseRegistrada(BaseModel):
    id: str
    tipo: str
    pontuacao: int
    classificacao: str
    resumo: Optional[str]
    criado_em: str


class PainelTurma(BaseModel):
    """Resposta do painel do professor com todas as análises da turma."""
    nome_professor: str
    nome_turma: str
    codigo: str
    total_analises: int
    media_pontuacao: Optional[float]
    analises: list[AnaliseRegistrada]


class TurmaResumida(BaseModel):
    """Resultado da busca de turmas — sem chave de acesso."""
    codigo: str
    nome_professor: str
    nome_turma: str
    criado_em: str


# ── Funções ──────────────────────────────────────────────────────────────────────

def criar_turma(entrada: TurmaEntrada) -> TurmaCriada:
    """Cria uma turma com código único. Retorna código público + chave privada."""
    db = get_db()

    # Tenta gerar um código único (colisão improvável, mas verificamos por segurança)
    for _ in range(5):
        codigo = _gerar_codigo()
        existente = db.table("turmas").select("codigo").eq("codigo", codigo).execute()
        if not existente.data:
            break

    chave = _gerar_chave_acesso()
    dados = {
        "id": str(uuid.uuid4()),
        "codigo": codigo,
        "chave_acesso": chave,
        "nome_professor": entrada.nome_professor,
        "nome_turma": entrada.nome_turma,
        "criado_em": _agora(),
    }
    resultado = db.table("turmas").insert(dados).execute()
    return TurmaCriada(**resultado.data[0])


def registrar_analise(codigo: str, entrada: AnaliseEntrada) -> AnaliseRegistrada:
    """Registra uma análise feita por um aluno vinculada ao código da turma."""
    db = get_db()

    turma = db.table("turmas").select("id").eq("codigo", codigo.upper()).execute()
    if not turma.data:
        raise ValueError(f"Código de turma '{codigo}' não encontrado.")

    dados = {
        "id": str(uuid.uuid4()),
        "codigo_turma": codigo.upper(),
        "tipo": entrada.tipo,
        "pontuacao": entrada.pontuacao,
        "classificacao": entrada.classificacao,
        "resumo": entrada.resumo,
        "criado_em": _agora(),
    }
    resultado = db.table("analises_turma").insert(dados).execute()
    r = resultado.data[0]
    return AnaliseRegistrada(
        id=r["id"],
        tipo=r["tipo"],
        pontuacao=r["pontuacao"],
        classificacao=r["classificacao"],
        resumo=r.get("resumo"),
        criado_em=r["criado_em"],
    )


def buscar_turmas(nome_professor: str = "", nome_turma: str = "") -> list[TurmaResumida]:
    """Busca turmas por nome do professor e/ou nome da turma.

    Usado pela equipe LUPA para recuperar o código de uma turma
    quando o professor entra em contato.
    Ambos os parâmetros são opcionais — se omitidos, retorna todas as turmas.
    """
    db = get_db()
    query = db.table("turmas").select("codigo, nome_professor, nome_turma, criado_em")
    if nome_professor.strip():
        query = query.ilike("nome_professor", f"%{nome_professor.strip()}%")
    if nome_turma.strip():
        query = query.ilike("nome_turma", f"%{nome_turma.strip()}%")
    resultado = query.order("criado_em", desc=True).execute()
    return [TurmaResumida(**row) for row in resultado.data]


def obter_painel(codigo: str, chave_acesso: str) -> PainelTurma:
    """Retorna o painel da turma. Exige código + chave de acesso corretos."""
    db = get_db()

    turmas = db.table("turmas").select("*").eq("codigo", codigo.upper()).execute()
    if not turmas.data:
        raise ValueError("Código de turma não encontrado.")

    turma = turmas.data[0]
    if turma["chave_acesso"] != chave_acesso:
        raise PermissionError("Chave de acesso incorreta.")

    analises_raw = (
        db.table("analises_turma")
        .select("*")
        .eq("codigo_turma", codigo.upper())
        .order("criado_em", desc=True)
        .execute()
    )

    analises = [
        AnaliseRegistrada(
            id=a["id"],
            tipo=a["tipo"],
            pontuacao=a["pontuacao"],
            classificacao=a["classificacao"],
            resumo=a.get("resumo"),
            criado_em=a["criado_em"],
        )
        for a in analises_raw.data
    ]

    media = (
        round(sum(a.pontuacao for a in analises) / len(analises), 1)
        if analises
        else None
    )

    return PainelTurma(
        nome_professor=turma["nome_professor"],
        nome_turma=turma["nome_turma"],
        codigo=codigo.upper(),
        total_analises=len(analises),
        media_pontuacao=media,
        analises=analises,
    )
