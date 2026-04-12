"""
Analisador de URLs do LUPA.

Este módulo é o "cérebro" da análise: recebe uma URL, executa
várias checagens e devolve uma pontuação de confiabilidade (0-100)
com as justificativas de cada critério.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from urllib.parse import urlparse

import requests
import whois
from bs4 import BeautifulSoup


# ============================================================
# Configurações (pesos e listas)
# ============================================================

# Pontuação de partida — subtrai/soma de acordo com cada critério
PONTUACAO_INICIAL = 50

# Palavras comuns em clickbait (títulos sensacionalistas).
# Em produção, essa lista viria de um arquivo externo atualizado.
PALAVRAS_CLICKBAIT = [
    "você não vai acreditar",
    "chocante",
    "bombástico",
    "urgente",
    "absurdo",
    "revelado",
    "escândalo",
    "segredo",
    "inacreditável",
    "nunca visto",
    "isso vai mudar",
    "veja o que aconteceu",
]

# Tempo máximo de espera por uma página web (segundos)
TIMEOUT_REQUISICAO = 15


# ============================================================
# Estrutura do resultado
# ============================================================

@dataclass
class Justificativa:
    """Uma linha do relatório: o que foi verificado e o impacto na nota."""
    criterio: str
    resultado: str
    impacto: int  # pode ser positivo (+) ou negativo (-)


@dataclass
class ResultadoAnalise:
    """O pacote completo devolvido ao usuário."""
    url: str
    pontuacao: int
    classificacao: str        # "Confiável" | "Requer Atenção" | "Suspeito"
    cor: str                  # cor hexadecimal para o frontend
    titulo_pagina: str | None
    justificativas: list[Justificativa] = field(default_factory=list)


# ============================================================
# Função principal
# ============================================================

def analisar_url(url: str) -> ResultadoAnalise:
    """Ponto de entrada: recebe uma URL e devolve o resultado da análise."""
    url = _normalizar_url(url)
    justificativas: list[Justificativa] = []
    pontuacao = PONTUACAO_INICIAL

    # --- Checagem 1: HTTPS ---
    impacto = _verificar_https(url)
    justificativas.append(Justificativa(
        criterio="Uso de HTTPS",
        resultado="O site usa conexão segura (HTTPS)." if impacto > 0
                  else "O site NÃO usa HTTPS — conexão não criptografada.",
        impacto=impacto,
    ))
    pontuacao += impacto

    # --- Checagem 2: Idade do domínio ---
    idade_anos, impacto = _verificar_idade_dominio(url)
    if idade_anos is None:
        texto = "Não foi possível determinar a idade do domínio."
    else:
        texto = f"Domínio existe há aproximadamente {idade_anos} ano(s)."
    justificativas.append(Justificativa(
        criterio="Idade do domínio",
        resultado=texto,
        impacto=impacto,
    ))
    pontuacao += impacto

    # --- Buscar o HTML da página (necessário para as próximas checagens) ---
    html, erro = _baixar_pagina(url)
    if erro:
        # Se não conseguimos baixar a página, devolvemos um resultado parcial
        justificativas.append(Justificativa(
            criterio="Acesso à página",
            resultado=f"Não foi possível acessar a página: {erro}",
            impacto=-10,
        ))
        pontuacao -= 10
        return _montar_resultado(url, pontuacao, None, justificativas)

    sopa = BeautifulSoup(html, "lxml")
    titulo = _extrair_titulo(sopa)

    # --- Checagem 3: Clickbait no título ---
    impacto, palavra_encontrada = _verificar_clickbait(titulo)
    if impacto < 0:
        texto = f'Título contém termo associado a clickbait: "{palavra_encontrada}".'
    else:
        texto = "Título não contém termos típicos de clickbait."
    justificativas.append(Justificativa(
        criterio="Indícios de clickbait",
        resultado=texto,
        impacto=impacto,
    ))
    pontuacao += impacto

    # --- Checagem 4: Excesso de maiúsculas no título ---
    impacto, proporcao = _verificar_excesso_maiusculas(titulo)
    if impacto < 0:
        texto = f"Título tem {proporcao:.0%} de letras maiúsculas (tom alarmista)."
    else:
        texto = "Uso equilibrado de maiúsculas no título."
    justificativas.append(Justificativa(
        criterio="Uso de maiúsculas no título",
        resultado=texto,
        impacto=impacto,
    ))
    pontuacao += impacto

    # --- Checagem 5: Presença de página "Sobre" / "Contato" ---
    impacto = _verificar_paginas_institucionais(sopa, url)
    justificativas.append(Justificativa(
        criterio="Informações institucionais",
        resultado="Foram encontrados links para 'Sobre' ou 'Contato'." if impacto > 0
                  else "Não foram encontrados links claros para 'Sobre' ou 'Contato'.",
        impacto=impacto,
    ))
    pontuacao += impacto

    # --- Checagem 6: Links externos / referências ---
    impacto, qtd_links_externos = _verificar_referencias(sopa, url)
    justificativas.append(Justificativa(
        criterio="Referências externas",
        resultado=(f"A página cita {qtd_links_externos} fontes externas."
                   if impacto > 0
                   else "A página não cita fontes externas."),
        impacto=impacto,
    ))
    pontuacao += impacto

    return _montar_resultado(url, pontuacao, titulo, justificativas)


# ============================================================
# Funções auxiliares (uma checagem cada)
# ============================================================

def _normalizar_url(url: str) -> str:
    """Garante que a URL começa com http:// ou https://."""
    url = url.strip()
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "https://" + url
    return url


def _verificar_https(url: str) -> int:
    return 10 if url.lower().startswith("https://") else -10


def _verificar_idade_dominio(url: str) -> tuple[int | None, int]:
    """Consulta o WHOIS do domínio. Retorna (idade_em_anos, impacto)."""
    dominio = urlparse(url).netloc
    try:
        info = whois.whois(dominio)
        data_criacao = info.creation_date
        # WHOIS às vezes devolve lista — pegamos a primeira data válida
        if isinstance(data_criacao, list):
            data_criacao = data_criacao[0]
        if not isinstance(data_criacao, datetime):
            return None, 0
        # Normaliza timezone para evitar erro de comparação
        if data_criacao.tzinfo is None:
            data_criacao = data_criacao.replace(tzinfo=timezone.utc)
        idade = datetime.now(timezone.utc) - data_criacao
        anos = idade.days // 365
    except Exception:
        return None, 0

    if anos >= 5:
        return anos, 15
    if anos >= 2:
        return anos, 10
    if anos < 1:
        return anos, -15
    return anos, 0


def _baixar_pagina(url: str) -> tuple[str | None, str | None]:
    """Baixa o HTML da URL. Retorna (html, erro) — um dos dois é None."""
    try:
        cabecalhos = {
            "User-Agent": "Mozilla/5.0 (LUPA-bot/0.1; educacional)"
        }
        resposta = requests.get(url, headers=cabecalhos, timeout=TIMEOUT_REQUISICAO)
        resposta.raise_for_status()
        return resposta.text, None
    except requests.Timeout:
        return None, "a página demorou demais para responder"
    except requests.HTTPError as e:
        return None, f"o servidor retornou erro {e.response.status_code}"
    except requests.RequestException as e:
        return None, f"falha de conexão ({type(e).__name__})"


def _extrair_titulo(sopa: BeautifulSoup) -> str | None:
    elemento = sopa.find("title")
    if elemento and elemento.string:
        return elemento.string.strip()
    return None


def _verificar_clickbait(titulo: str | None) -> tuple[int, str | None]:
    if not titulo:
        return 0, None
    titulo_minusculo = titulo.lower()
    for palavra in PALAVRAS_CLICKBAIT:
        if palavra in titulo_minusculo:
            return -20, palavra
    return 0, None


def _verificar_excesso_maiusculas(titulo: str | None) -> tuple[int, float]:
    if not titulo:
        return 0, 0.0
    letras = [c for c in titulo if c.isalpha()]
    if len(letras) < 5:
        return 0, 0.0
    maiusculas = sum(1 for c in letras if c.isupper())
    proporcao = maiusculas / len(letras)
    if proporcao > 0.5:
        return -10, proporcao
    return 0, proporcao


def _verificar_paginas_institucionais(sopa: BeautifulSoup, url_base: str) -> int:
    """Procura links contendo 'sobre', 'contato', 'quem somos', etc."""
    termos = ["sobre", "contato", "quem somos", "about", "contact"]
    for link in sopa.find_all("a", href=True):
        texto = link.get_text(strip=True).lower()
        href = link["href"].lower()
        if any(t in texto or t in href for t in termos):
            return 10
    return -5


def _verificar_referencias(sopa: BeautifulSoup, url_base: str) -> tuple[int, int]:
    """Conta links que saem para domínios diferentes (referências externas)."""
    dominio_base = urlparse(url_base).netloc
    externos = 0
    for link in sopa.find_all("a", href=True):
        href = link["href"]
        if href.startswith("http"):
            dominio_link = urlparse(href).netloc
            if dominio_link and dominio_link != dominio_base:
                externos += 1
    if externos >= 3:
        return 10, externos
    return 0, externos


def _montar_resultado(
    url: str,
    pontuacao_bruta: int,
    titulo: str | None,
    justificativas: list[Justificativa],
) -> ResultadoAnalise:
    """Aplica os limites (0-100) e decide a classificação + cor."""
    pontuacao = max(0, min(100, pontuacao_bruta))
    if pontuacao <= 30:
        classificacao, cor = "Suspeito", "#B71C1C"
    elif pontuacao <= 70:
        classificacao, cor = "Requer Atenção", "#FFC107"
    else:
        classificacao, cor = "Confiável", "#4CAF50"
    return ResultadoAnalise(
        url=url,
        pontuacao=pontuacao,
        classificacao=classificacao,
        cor=cor,
        titulo_pagina=titulo,
        justificativas=justificativas,
    )
