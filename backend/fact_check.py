"""
Integração com a Google Fact Check Tools API.

Permite cruzar textos e títulos com o banco global de checagens de
agências certificadas pela IFCN (como Agência Lupa e Aos Fatos).

Requer: variável de ambiente GOOGLE_FACT_CHECK_API_KEY
Documentação: https://developers.google.com/fact-check/tools/api

Se a chave não estiver configurada, todas as funções retornam valores
neutros — o restante do sistema continua funcionando normalmente.
"""

from __future__ import annotations

import os
import requests
from dataclasses import dataclass


_ENDPOINT = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
_TIMEOUT = 10

# Palavras que indicam avaliação negativa nas agências brasileiras
_AVALIACOES_NEGATIVAS = [
    "falso", "fake", "enganoso", "incorreto",
    "distorcido", "exagerado", "impreciso",
    "não é bem assim", "sem contexto", "desinformação",
    "manipulado", "descontextualizado",
]

# Palavras que indicam avaliação positiva
_AVALIACOES_POSITIVAS = [
    "verdadeiro", "correto", "preciso", "confirmado", "real",
]


@dataclass
class ResultadoChecagem:
    afirmacao: str      # texto da afirmação verificada pela agência
    avaliacao: str      # ex: "Falso", "Enganoso", "Verdadeiro"
    agencia: str        # ex: "Agência Lupa", "Aos Fatos"
    url_checagem: str   # link para a matéria de checagem completa


def buscar_checagens(consulta: str, max_resultados: int = 3) -> list[ResultadoChecagem]:
    """Busca fact-checks relacionados à consulta no banco global da IFCN.

    Retorna lista vazia se a chave não estiver configurada ou em caso de erro.
    A consulta é truncada em 200 caracteres para manter a busca objetiva.
    """
    chave = os.getenv("GOOGLE_FACT_CHECK_API_KEY", "").strip()
    if not chave:
        return []

    try:
        resposta = requests.get(
            _ENDPOINT,
            params={
                "query": consulta[:200],
                "key": chave,
                "languageCode": "pt",
                "pageSize": max_resultados,
            },
            timeout=_TIMEOUT,
        )
        resposta.raise_for_status()
        dados = resposta.json()

        resultados: list[ResultadoChecagem] = []
        for claim in dados.get("claims", []):
            reviews = claim.get("claimReview", [])
            if not reviews:
                continue
            review = reviews[0]
            resultados.append(ResultadoChecagem(
                afirmacao=claim.get("text", ""),
                avaliacao=review.get("textualRating", ""),
                agencia=review.get("publisher", {}).get("name", ""),
                url_checagem=review.get("url", ""),
            ))
        return resultados
    except Exception:
        return []


def avaliar_impacto(checagens: list[ResultadoChecagem]) -> tuple[int, str]:
    """Calcula o impacto na pontuação com base nas avaliações encontradas.

    Retorna (impacto, texto_justificativa).
    - Avaliação negativa (falso, enganoso…) → -30
    - Avaliação positiva (verdadeiro, correto…) → +10
    - Avaliação neutra ou não reconhecida → 0
    - Sem resultados → 0 com mensagem informativa
    """
    if not checagens:
        return 0, (
            "Nenhuma checagem encontrada no banco global da IFCN para este conteúdo. "
            "Isso não significa que é confiável — apenas que ainda não foi formalmente verificado."
        )

    negativas = [
        c for c in checagens
        if any(n in c.avaliacao.lower() for n in _AVALIACOES_NEGATIVAS)
    ]
    positivas = [
        c for c in checagens
        if any(p in c.avaliacao.lower() for p in _AVALIACOES_POSITIVAS)
    ]

    if negativas:
        c = negativas[0]
        agencia = c.agencia or "uma agência de fact-checking certificada"
        return -30, (
            f"Este conteúdo foi verificado por {agencia} "
            f"e classificado como \"{c.avaliacao}\". "
            f"Checagem completa: {c.url_checagem}"
        )

    if positivas:
        c = positivas[0]
        agencia = c.agencia or "uma agência de fact-checking certificada"
        return 10, (
            f"Este conteúdo foi verificado por {agencia} "
            f"e classificado como \"{c.avaliacao}\". "
            f"Checagem completa: {c.url_checagem}"
        )

    # Checagem encontrada, mas com classificação neutra ou não reconhecida
    c = checagens[0]
    agencia = c.agencia or "uma agência de fact-checking"
    return 0, (
        f"Este conteúdo foi analisado por {agencia} "
        f"com a classificação \"{c.avaliacao}\". "
        f"Consulte a checagem: {c.url_checagem}"
    )


def resumir_para_prompt(checagens: list[ResultadoChecagem]) -> str:
    """Formata as checagens como bloco de texto para incluir no prompt do Gemini.

    Retorna string vazia se não houver checagens.
    """
    if not checagens:
        return ""

    linhas = ["=== Checagens de agências certificadas (IFCN) ==="]
    for c in checagens:
        linhas.append(
            f"- Afirmação: \"{c.afirmacao[:150]}\" | "
            f"Avaliação: {c.avaliacao} | "
            f"Agência: {c.agencia}"
        )
    return "\n".join(linhas)
