"""
Busca na web via Tavily API.

Usada durante a análise de texto para encontrar notícias relacionadas
que ajudem o Gemini a contextualizar o conteúdo e identificar
desinformação com mais precisão.
"""

from __future__ import annotations

import os

import requests

TAVILY_URL = "https://api.tavily.com/search"
TIMEOUT_SEGUNDOS = 10
MAX_RESULTADOS = 5


def buscar_na_web(consulta: str) -> list[dict]:
    """Busca notícias relacionadas à consulta via Tavily API.

    Cada item retornado tem: titulo, url, descricao, conteudo.
    Retorna lista vazia se a chave não estiver configurada ou ocorrer erro.
    """
    chave = os.getenv("TAVILY_API_KEY")
    if not chave or chave.strip() in ("", "sua_chave_aqui"):
        return []

    try:
        resposta = requests.post(
            TAVILY_URL,
            headers={"Authorization": f"Bearer {chave}"},
            json={
                "query": consulta,
                "search_depth": "basic",
                "max_results": MAX_RESULTADOS,
                "include_answer": False,
                "include_raw_content": False,
            },
            timeout=TIMEOUT_SEGUNDOS,
        )
        resposta.raise_for_status()
        dados = resposta.json()

        resultados = []
        for item in dados.get("results", []):
            resultados.append({
                "titulo": item.get("title", ""),
                "url": item.get("url", ""),
                "descricao": item.get("content", "")[:200],
                "conteudo": item.get("content", "")[:500],
            })
        return resultados
    except Exception:
        return []


def resumir_para_prompt(resultados: list[dict]) -> str:
    """Formata os resultados da busca para incluir no prompt do Gemini."""
    if not resultados:
        return ""
    linhas = ["Contexto encontrado na web (use para enriquecer a análise):"]
    for i, r in enumerate(resultados, 1):
        linhas.append(f"{i}. {r['titulo']}: {r['conteudo']}")
    return "\n".join(linhas)
