"""
Servidor web do LUPA (API em FastAPI).

Como rodar:
    venv/Scripts/python -m uvicorn main:app --reload

Depois abra no navegador:
    http://localhost:8000/docs  (documentação interativa)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analyzer import analisar_url


# ============================================================
# Criação da aplicação
# ============================================================

app = FastAPI(
    title="LUPA API",
    description="Análise de confiabilidade de conteúdos digitais.",
    version="0.1.0",
)

# Permitir que o frontend (outro endereço/porta) chame esta API.
# Em produção, trocar "*" pela URL real do frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Modelos de entrada e saída (contratos da API)
# ============================================================

class PedidoAnalise(BaseModel):
    """O que o usuário envia."""
    url: str = Field(..., description="URL do site a ser analisado",
                     examples=["https://www.bbc.com"])


class JustificativaResposta(BaseModel):
    criterio: str
    resultado: str
    impacto: int


class RespostaAnalise(BaseModel):
    """O que a API devolve."""
    url: str
    pontuacao: int
    classificacao: str
    cor: str
    titulo_pagina: str | None
    justificativas: list[JustificativaResposta]


# ============================================================
# Endpoints
# ============================================================

@app.get("/")
def raiz() -> dict:
    """Mensagem de boas-vindas — confirma que o servidor está no ar."""
    return {
        "mensagem": "LUPA API no ar!",
        "documentacao": "/docs",
    }


@app.post("/analisar-url", response_model=RespostaAnalise)
def endpoint_analisar_url(pedido: PedidoAnalise) -> RespostaAnalise:
    """Recebe uma URL e devolve a análise completa."""
    if not pedido.url.strip():
        raise HTTPException(status_code=400, detail="A URL não pode estar vazia.")

    try:
        resultado = analisar_url(pedido.url)
    except Exception as e:
        # Captura qualquer erro inesperado e devolve uma mensagem amigável
        raise HTTPException(
            status_code=500,
            detail=f"Erro inesperado ao analisar a URL: {type(e).__name__}",
        ) from e

    return RespostaAnalise(
        url=resultado.url,
        pontuacao=resultado.pontuacao,
        classificacao=resultado.classificacao,
        cor=resultado.cor,
        titulo_pagina=resultado.titulo_pagina,
        justificativas=[
            JustificativaResposta(
                criterio=j.criterio,
                resultado=j.resultado,
                impacto=j.impacto,
            )
            for j in resultado.justificativas
        ],
    )
