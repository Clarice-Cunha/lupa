"""
Analisador de texto via IA (Google Gemini).

Recebe um texto colado pelo usuário (de WhatsApp, Instagram, etc.) e
identifica sinais de desinformação de forma educacional — sem afirmar
que o conteúdo é verdadeiro ou falso, apenas apontando o que o leitor
deve considerar antes de compartilhar.

Se o Gemini não estiver configurado, aplica uma análise heurística
simples por palavras-chave como fallback.
"""

from __future__ import annotations

import json
import os
import re

import requests

from analyzer import PALAVRAS_CLICKBAIT, Justificativa, ResultadoAnalise
from web_search import buscar_na_web, resumir_para_prompt


MODELO = "gemini-2.5-flash"
URL_GEMINI = f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent"
TIMEOUT_SEGUNDOS = 45
MAX_CARACTERES = 8_000  # evita gastar tokens excessivos em textos muito longos

# ── Prompt enviado ao Gemini ────────────────────────────────────────────────────
# O formato {{}} é necessário porque usamos .format() para inserir o texto.
PROMPT_ANALISE = """\
Você é um especialista em letramento midiático e combate à desinformação, \
trabalhando de forma EDUCACIONAL. Analise o texto a seguir e identifique \
sinais de desinformação.

Seja neutro: não afirme que o texto é verdadeiro ou falso — apenas aponte \
os sinais que o leitor deve considerar. Use linguagem simples, acessível a \
estudantes do ensino médio.

Responda APENAS com o objeto JSON abaixo, sem texto ou comentários adicionais.

Critérios a avaliar (use EXATAMENTE estes nomes de "criterio"):
1. "Linguagem sensacionalista" — há palavras como "chocante", "urgente", \
"bombástico", "você não vai acreditar", "revelado", "nunca antes visto"?
2. "Fontes e atribuições" — o texto cita fontes concretas (nome, instituição, \
documento) ou usa atribuições vagas como "especialistas dizem", "segundo fontes"?
3. "Apelo emocional" — o texto tenta gerar medo, raiva ou urgência de forma \
desproporcional aos fatos apresentados?
4. "Afirmações verificáveis" — o texto traz dados concretos (datas, nomes, \
locais, números) que podem ser checados em outras fontes?
5. "Consistência interna" — o texto é coerente, sem contradições ou saltos \
lógicos que dificultem a compreensão?
6. "Objetividade da linguagem" — o tom é informativo e equilibrado, sem \
adjetivos carregados que forcem uma conclusão?

Formato de resposta (JSON puro, sem markdown):
{{
  "pontuacao": <inteiro de 0 a 100, onde 0=muito suspeito e 100=muito confiável>,
  "resumo": "<2 a 3 frases neutras descrevendo o conteúdo do texto>",
  "justificativas": [
    {{
      "criterio": "<nome exato do critério>",
      "resultado": "<o que você encontrou no texto — seja específico>",
      "impacto": <inteiro de -20 a +15>,
      "camada": "conteudo"
    }}
  ],
  "dicas": [
    "<dica 1 concreta para quem recebeu este tipo de conteúdo>",
    "<dica 2>",
    "<dica 3>"
  ]
}}

Regras de impacto: negativo quando o critério reduz a confiabilidade; \
positivo quando reforça; zero quando é neutro. A pontuação deve ser coerente \
com a soma dos impactos a partir de 50.

Texto a analisar:
\"\"\"
{texto}
\"\"\"
"""


# ── Helpers de classificação (duplicam a lógica de _montar_resultado) ──────────

def _classificar(pontuacao: int) -> str:
    if pontuacao <= 30:
        return "Suspeito"
    if pontuacao <= 70:
        return "Requer Atenção"
    return "Confiável"


def _cor(pontuacao: int) -> str:
    if pontuacao <= 30:
        return "#B71C1C"
    if pontuacao <= 70:
        return "#FFC107"
    return "#4CAF50"


# ── Chamada ao Gemini ───────────────────────────────────────────────────────────

def _chamar_gemini(texto: str, contexto_web: str = "") -> dict | None:
    """Envia o texto ao Gemini e devolve o dicionário JSON, ou None em caso de erro."""
    chave = os.getenv("GEMINI_API_KEY")
    if not chave or chave.strip() in ("", "sua_chave_aqui", "COLE_SUA_CHAVE_AQUI"):
        return None

    texto_com_contexto = texto[:MAX_CARACTERES]
    if contexto_web:
        texto_com_contexto = f"{contexto_web}\n\n---\n\n{texto_com_contexto}"
    prompt = PROMPT_ANALISE.format(texto=texto_com_contexto)
    corpo = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,      # baixo = mais previsível e consistente
            "maxOutputTokens": 1500,
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
        texto_resposta = (
            dados.get("candidates", [{}])[0]
                 .get("content", {})
                 .get("parts", [{}])[0]
                 .get("text", "")
                 .strip()
        )
        # Remove blocos de código markdown que o Gemini às vezes insere
        texto_resposta = re.sub(r"^```(?:json)?\s*", "", texto_resposta)
        texto_resposta = re.sub(r"\s*```$", "", texto_resposta).strip()
        return json.loads(texto_resposta)
    except Exception:
        return None


# ── Análise heurística (fallback sem Gemini) ────────────────────────────────────

def _analisar_heuristicamente(texto: str) -> tuple[list[Justificativa], int]:
    """
    Análise simples por palavras-chave.
    Usada quando o Gemini não está disponível (sem chave de API).
    """
    justificativas: list[Justificativa] = []
    pontuacao = 50
    texto_lower = texto.lower()

    # Critério 1: palavras sensacionalistas
    encontradas = [p for p in PALAVRAS_CLICKBAIT if p in texto_lower]
    if encontradas:
        justificativas.append(Justificativa(
            criterio="Linguagem sensacionalista",
            resultado=(
                f"Encontrada(s) {len(encontradas)} expressão(ões) associada(s) a "
                f"clickbait: '{encontradas[0]}'" + (f" e mais {len(encontradas)-1}." if len(encontradas) > 1 else ".")
            ),
            impacto=-15,
            camada="conteudo",
        ))
        pontuacao -= 15
    else:
        justificativas.append(Justificativa(
            criterio="Linguagem sensacionalista",
            resultado="Nenhuma expressão tipicamente sensacionalista identificada.",
            impacto=0,
            camada="conteudo",
        ))

    # Critério 2: atribuições vagas
    vagas = ["especialistas dizem", "especialistas afirmam", "segundo fontes",
             "fontes afirmam", "pesquisas mostram", "estudos comprovam",
             "a ciência diz", "todos sabem que"]
    atribuicao_vaga = next((v for v in vagas if v in texto_lower), None)
    if atribuicao_vaga:
        justificativas.append(Justificativa(
            criterio="Fontes e atribuições",
            resultado=f"O texto usa atribuição vaga ('{atribuicao_vaga}') sem citar nome ou instituição concreta.",
            impacto=-10,
            camada="conteudo",
        ))
        pontuacao -= 10
    else:
        justificativas.append(Justificativa(
            criterio="Fontes e atribuições",
            resultado="Não foram detectadas atribuições claramente vagas.",
            impacto=0,
            camada="conteudo",
        ))

    # Critério 3: excesso de exclamações
    palavras = texto.split()
    if len(palavras) >= 20:
        qtd_exc = texto.count("!")
        if qtd_exc / len(palavras) > 0.02:
            justificativas.append(Justificativa(
                criterio="Apelo emocional",
                resultado=f"Uso elevado de pontos de exclamação ({qtd_exc}) sugere tom alarmista.",
                impacto=-10,
                camada="conteudo",
            ))
            pontuacao -= 10
        else:
            justificativas.append(Justificativa(
                criterio="Apelo emocional",
                resultado="Uso moderado de pontuação emocional.",
                impacto=0,
                camada="conteudo",
            ))

    # Aviso sobre limitação
    justificativas.append(Justificativa(
        criterio="Análise por IA indisponível",
        resultado=(
            "A análise semântica completa requer a chave GEMINI_API_KEY. "
            "Os critérios acima foram verificados por busca de palavras-chave."
        ),
        impacto=0,
        camada="geral",
    ))

    return justificativas, max(0, min(100, pontuacao))


# ── Função principal ────────────────────────────────────────────────────────────

def analisar_texto(texto: str, origem: str = "") -> ResultadoAnalise:
    """Analisa um texto em busca de indícios de desinformação.

    Args:
        texto: O texto colado pelo usuário.
        origem: De onde o texto vem (ex: 'WhatsApp', 'Instagram'). Opcional.

    Returns:
        ResultadoAnalise com pontuação, justificativas e dicas educacionais.
    """
    texto = texto.strip()
    rotulo = f"[Texto — {origem}]" if origem else "[Texto colado]"

    if len(texto) < 30:
        from tips import sugerir_fontes
        return ResultadoAnalise(
            url=rotulo,
            pontuacao=50,
            classificacao="Requer Atenção",
            cor="#FFC107",
            titulo_pagina="Análise de texto",
            resumo=None,
            justificativas=[Justificativa(
                criterio="Texto insuficiente",
                resultado="O texto é muito curto para uma análise significativa. Cole um trecho maior.",
                impacto=0,
                camada="geral",
            )],
            dicas_personalizadas=[
                "Cole o texto completo, incluindo o contexto em que ele foi compartilhado.",
            ],
            fontes_sugeridas=sugerir_fontes(50),
        )

    # Busca na web por notícias relacionadas ao texto para enriquecer a análise.
    # Usamos as primeiras 200 letras como consulta — suficiente para capturar o tema.
    fontes_web = buscar_na_web(texto[:200])
    contexto_web = resumir_para_prompt(fontes_web)

    # Fact-check: cruza o texto com o banco global de checagens da IFCN.
    # Se GOOGLE_FACT_CHECK_API_KEY não estiver configurada, retorna lista vazia.
    from fact_check import (
        avaliar_impacto as fc_avaliar_impacto,
        buscar_checagens as fc_buscar,
        resumir_para_prompt as fc_resumir,
    )
    checagens_fc = fc_buscar(texto[:200])
    contexto_fc = fc_resumir(checagens_fc)

    # Combina contexto web + fact-checks para enviar ao Gemini.
    # O Gemini recebe as checagens da IFCN como evidência adicional.
    contexto_completo = (
        (contexto_fc + "\n\n" + contexto_web).strip()
        if contexto_fc
        else contexto_web
    )

    resultado_ia = _chamar_gemini(texto, contexto_completo)

    from tips import sugerir_fontes

    # Converte resultados da web para o formato de exibição (sem "conteudo" interno)
    fontes_web_exibicao = [
        {"titulo": r["titulo"], "url": r["url"], "descricao": r["descricao"]}
        for r in fontes_web
    ]

    # Prepara a justificativa de fact-check (só exibe se a chave estiver configurada)
    justificativa_fc = None
    impacto_fc = 0
    if os.getenv("GOOGLE_FACT_CHECK_API_KEY", "").strip():
        impacto_fc, texto_fc = fc_avaliar_impacto(checagens_fc)
        justificativa_fc = Justificativa(
            criterio="Checagem em banco de dados IFCN",
            resultado=texto_fc,
            impacto=impacto_fc,
            camada="fonte",
        )

    if resultado_ia:
        pontuacao = max(0, min(100, int(resultado_ia.get("pontuacao", 50))))
        justificativas = [
            Justificativa(
                criterio=j.get("criterio", "—"),
                resultado=j.get("resultado", "—"),
                impacto=int(j.get("impacto", 0)),
                camada=j.get("camada", "conteudo"),
            )
            for j in resultado_ia.get("justificativas", [])
        ]
        if justificativa_fc:
            justificativas.append(justificativa_fc)
            pontuacao = max(0, min(100, pontuacao + impacto_fc))
        return ResultadoAnalise(
            url=rotulo,
            pontuacao=pontuacao,
            classificacao=_classificar(pontuacao),
            cor=_cor(pontuacao),
            titulo_pagina=f"Análise de texto{' — ' + origem if origem else ''}",
            resumo=resultado_ia.get("resumo"),
            justificativas=justificativas,
            dicas_personalizadas=resultado_ia.get("dicas", [])[:3],
            fontes_sugeridas=sugerir_fontes(pontuacao),
            fontes_web=fontes_web_exibicao,
        )

    # Fallback heurístico quando o Gemini não está disponível
    justificativas, pontuacao = _analisar_heuristicamente(texto)
    if justificativa_fc:
        justificativas.append(justificativa_fc)
        pontuacao = max(0, min(100, pontuacao + impacto_fc))
    return ResultadoAnalise(
        url=rotulo,
        pontuacao=pontuacao,
        classificacao=_classificar(pontuacao),
        cor=_cor(pontuacao),
        titulo_pagina=f"Análise de texto{' — ' + origem if origem else ''}",
        resumo=None,
        justificativas=justificativas,
        dicas_personalizadas=[],
        fontes_sugeridas=sugerir_fontes(pontuacao),
        fontes_web=fontes_web_exibicao,
    )
