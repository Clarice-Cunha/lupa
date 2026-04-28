"""
Geração de resumo de conteúdo via Google Gemini.

Se a variável de ambiente GEMINI_API_KEY não estiver configurada,
a função devolve None — o sistema continua funcionando sem resumo.

Para obter uma chave gratuita:
    https://aistudio.google.com/apikey
"""

from __future__ import annotations

import os

import requests

# ---- Configuração ----
MODELO = "gemini-2.5-flash"
URL_GEMINI = f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent"

# Limite do texto enviado (caracteres). Texto muito grande gasta mais tokens
# e raramente melhora a qualidade do resumo.
MAX_CARACTERES = 10_000

# Quanto tempo esperar a resposta da API antes de desistir
TIMEOUT_SEGUNDOS = 30

PROMPT_MODELO = """\
Você é um assistente que descreve, de forma neutra, o conteúdo principal de páginas web.

Tarefa: leia o texto abaixo (extraído de uma página) e escreva um resumo
em português, com 2 a 3 frases, apenas descrevendo o conteúdo.
Não julgue credibilidade, não dê opinião, não use adjetivos fortes.
Se o texto for muito curto, confuso ou irrelevante, responda somente:
"Não foi possível gerar resumo a partir desta página."

Texto da página:
\"\"\"
{texto}
\"\"\"
"""


def gerar_resumo(texto: str) -> str | None:
    """Gera um resumo curto do texto via Gemini.

    Retorna None se:
    - a chave GEMINI_API_KEY não estiver configurada, ou
    - a API falhar por qualquer motivo, ou
    - o texto for muito curto para valer a pena.
    """
    chave = os.getenv("GEMINI_API_KEY")
    if not chave or chave.strip() in ("", "sua_chave_aqui", "COLE_SUA_CHAVE_AQUI"):
        return None

    # Texto muito curto não rende resumo útil
    if len(texto) < 200:
        return None

    # Cortar o texto para não estourar o limite do modelo
    texto_cortado = texto[:MAX_CARACTERES]
    prompt = PROMPT_MODELO.format(texto=texto_cortado)

    corpo = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,   # baixo = mais determinístico, menos "criativo"
            "maxOutputTokens": 400,
            # gemini-2.5-flash gasta tokens "pensando" antes de responder;
            # desativamos esse modo para que o limite seja só do texto final.
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    try:
        resposta = requests.post(
            URL_GEMINI,
            params={"key": chave},
            json=corpo,
            timeout=TIMEOUT_SEGUNDOS,
        )
        resposta.raise_for_status()
        dados = resposta.json()
        # Estrutura padrão do Gemini: candidates[0].content.parts[0].text
        texto_resumo = (
            dados.get("candidates", [{}])[0]
                 .get("content", {})
                 .get("parts", [{}])[0]
                 .get("text", "")
                 .strip()
        )
        return texto_resumo or None
    except (requests.RequestException, ValueError, KeyError, IndexError):
        # Qualquer erro na API/rede/parsing: silencia e devolve None.
        # Não queremos quebrar a análise inteira por causa do resumo.
        return None
