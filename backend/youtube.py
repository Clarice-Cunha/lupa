"""
Integração com o YouTube.

Este módulo cuida de:
1. Detectar se uma URL é do YouTube e extrair o ID do vídeo.
2. Buscar metadados do vídeo e do canal via YouTube Data API v3.

A YouTube Data API é gratuita (com cota diária) e retorna informações
públicas que o próprio YouTube exibe: título do vídeo, data de publicação,
visualizações, idade do canal, número de inscritos, selo de verificação etc.

Documentação: https://developers.google.com/youtube/v3
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from urllib.parse import parse_qs, urlparse

import requests
from youtube_transcript_api import YouTubeTranscriptApi

URL_API_YOUTUBE = "https://www.googleapis.com/youtube/v3"
TIMEOUT_SEGUNDOS = 15

# Idiomas preferidos ao buscar legendas — tentamos nesta ordem.
# Se o vídeo tiver PT, usamos; senão caímos pro inglês.
IDIOMAS_LEGENDAS_PREFERIDOS = ["pt-BR", "pt", "en-US", "en"]


# ============================================================
# Detecção de URL e extração do ID
# ============================================================

# Domínios que identificam uma URL como sendo do YouTube
DOMINIOS_YOUTUBE = (
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "www.youtu.be",
)

# Padrão de um ID de vídeo do YouTube: 11 caracteres alfanuméricos/-/_
PADRAO_ID_VIDEO = re.compile(r"^[A-Za-z0-9_-]{11}$")


def eh_url_youtube(url: str) -> bool:
    """Retorna True se a URL pertencer ao YouTube."""
    try:
        dominio = urlparse(url).netloc.lower()
    except ValueError:
        return False
    return dominio in DOMINIOS_YOUTUBE


def extrair_id_video(url: str) -> str | None:
    """Extrai o ID de 11 caracteres do vídeo de uma URL do YouTube.

    Reconhece os formatos mais comuns:
        https://www.youtube.com/watch?v=ID
        https://youtu.be/ID
        https://www.youtube.com/shorts/ID
        https://www.youtube.com/embed/ID
        https://www.youtube.com/v/ID

    Devolve None se não conseguir identificar o ID.
    """
    try:
        partes = urlparse(url)
    except ValueError:
        return None

    dominio = partes.netloc.lower()
    caminho = partes.path

    # Formato curto: youtu.be/ID
    if dominio in ("youtu.be", "www.youtu.be"):
        candidato = caminho.lstrip("/").split("/")[0]
        return candidato if PADRAO_ID_VIDEO.match(candidato) else None

    # Formato padrão: youtube.com/watch?v=ID
    if caminho == "/watch":
        qs = parse_qs(partes.query)
        candidatos = qs.get("v", [])
        if candidatos and PADRAO_ID_VIDEO.match(candidatos[0]):
            return candidatos[0]

    # Formatos /shorts/ID, /embed/ID, /v/ID
    match = re.match(r"^/(shorts|embed|v)/([A-Za-z0-9_-]{11})", caminho)
    if match:
        return match.group(2)

    return None


# ============================================================
# Busca de metadados na YouTube Data API
# ============================================================

@dataclass
class DadosVideoYoutube:
    """Conjunto de metadados retornados pela API do YouTube.

    Campos que começam com `canal_` vêm de uma segunda chamada à API
    (ao endpoint `/channels`).
    """
    id_video: str
    titulo: str
    descricao: str
    data_publicacao: datetime
    visualizacoes: int
    curtidas: int | None          # pode vir None (o autor pode esconder)
    comentarios: int | None
    duracao_iso: str              # ex: "PT5M30S" (formato ISO 8601)
    id_canal: str
    canal_nome: str
    canal_data_criacao: datetime
    canal_inscritos: int | None   # pode vir None se o canal esconde
    canal_verificado: bool        # True se o canal tem selo oficial
    canal_total_videos: int


class ErroYoutubeAPI(Exception):
    """Erro ao consultar a YouTube Data API."""


def _api_key() -> str | None:
    """Devolve a chave da YouTube API, ou None se não estiver configurada."""
    chave = os.getenv("YOUTUBE_API_KEY")
    if not chave or chave.strip() in ("", "COLE_SUA_CHAVE_DO_YOUTUBE_AQUI", "sua_chave_aqui"):
        return None
    return chave


def buscar_metadados(id_video: str) -> DadosVideoYoutube:
    """Busca metadados do vídeo e do canal via YouTube Data API.

    Faz DUAS chamadas:
    1. /videos  — informações do vídeo em si
    2. /channels — informações do canal que publicou o vídeo

    Levanta ErroYoutubeAPI em qualquer falha (chave ausente, vídeo não
    encontrado, erro de rede).
    """
    chave = _api_key()
    if not chave:
        raise ErroYoutubeAPI("Chave YOUTUBE_API_KEY não configurada no .env")

    # ---- Chamada 1: dados do vídeo ----
    resposta = requests.get(
        f"{URL_API_YOUTUBE}/videos",
        params={
            "id": id_video,
            "part": "snippet,statistics,contentDetails",
            "key": chave,
        },
        timeout=TIMEOUT_SEGUNDOS,
    )
    if resposta.status_code != 200:
        raise ErroYoutubeAPI(
            f"API do YouTube devolveu HTTP {resposta.status_code}"
        )

    dados = resposta.json()
    itens = dados.get("items", [])
    if not itens:
        raise ErroYoutubeAPI("Vídeo não encontrado ou indisponível")

    video = itens[0]
    snippet = video.get("snippet", {})
    stats = video.get("statistics", {})
    content = video.get("contentDetails", {})
    id_canal = snippet.get("channelId", "")

    # ---- Chamada 2: dados do canal ----
    resp_canal = requests.get(
        f"{URL_API_YOUTUBE}/channels",
        params={
            "id": id_canal,
            "part": "snippet,statistics,status",
            "key": chave,
        },
        timeout=TIMEOUT_SEGUNDOS,
    )
    if resp_canal.status_code != 200:
        raise ErroYoutubeAPI(
            f"API (canais) devolveu HTTP {resp_canal.status_code}"
        )

    canal_itens = resp_canal.json().get("items", [])
    if not canal_itens:
        raise ErroYoutubeAPI("Canal do vídeo não encontrado")

    canal = canal_itens[0]
    canal_snippet = canal.get("snippet", {})
    canal_stats = canal.get("statistics", {})
    canal_status = canal.get("status", {})

    return DadosVideoYoutube(
        id_video=id_video,
        titulo=snippet.get("title", ""),
        descricao=snippet.get("description", ""),
        data_publicacao=_parse_data_iso(snippet.get("publishedAt", "")),
        visualizacoes=int(stats.get("viewCount", 0)),
        curtidas=_int_ou_none(stats.get("likeCount")),
        comentarios=_int_ou_none(stats.get("commentCount")),
        duracao_iso=content.get("duration", ""),
        id_canal=id_canal,
        canal_nome=canal_snippet.get("title", ""),
        canal_data_criacao=_parse_data_iso(canal_snippet.get("publishedAt", "")),
        canal_inscritos=(
            None if canal_stats.get("hiddenSubscriberCount", False)
            else _int_ou_none(canal_stats.get("subscriberCount"))
        ),
        # O selo de verificação não vem direto; é indicado por
        # `longUploadsStatus = "allowed"` + `status.isLinked` + presença
        # em `status.privacyStatus`. Na API pública, a forma mais segura
        # é olhar se o canal tem o campo customUrl começando sem "@".
        # Como o YouTube não expõe o selo de forma oficial na API pública,
        # usamos uma heurística fraca: canal com >100k inscritos + URL
        # personalizada normalmente tem o selo. Marcamos como False por
        # padrão e podemos melhorar depois.
        canal_verificado=False,
        canal_total_videos=int(canal_stats.get("videoCount", 0)),
    )


# ============================================================
# Legendas (transcript)
# ============================================================

def pegar_legendas(id_video: str) -> str | None:
    """Devolve o texto corrido das legendas do vídeo, ou None se não houver.

    Tenta os idiomas em `IDIOMAS_LEGENDAS_PREFERIDOS`. O primeiro que o
    vídeo tiver é usado — não importa se é feito à mão ou gerado pelo
    YouTube automaticamente.

    Não lança exceção: se qualquer coisa der errado (vídeo sem legendas,
    restrição regional, erro de rede), devolve None e seguimos a análise
    sem o texto.
    """
    try:
        api = YouTubeTranscriptApi()
        dados = api.fetch(id_video, languages=IDIOMAS_LEGENDAS_PREFERIDOS)
        partes = [s.text for s in dados.snippets if s.text]
        texto = " ".join(partes)
        return " ".join(texto.split()) or None
    except Exception:
        return None


# ============================================================
# Utilitários internos
# ============================================================

def _parse_data_iso(texto: str) -> datetime:
    """Converte data ISO 8601 ('2024-01-15T10:00:00Z') para datetime.

    Se não conseguir interpretar, devolve a data atual (fallback seguro).
    """
    if not texto:
        return datetime.now(tz=timezone.utc)
    try:
        # Remove o 'Z' final (UTC) que datetime.fromisoformat não aceitava
        # em versões antigas do Python
        texto_limpo = texto.replace("Z", "+00:00")
        return datetime.fromisoformat(texto_limpo)
    except ValueError:
        return datetime.now(tz=timezone.utc)


def _int_ou_none(valor) -> int | None:
    """Converte para int, devolvendo None se o valor estiver ausente."""
    if valor is None:
        return None
    try:
        return int(valor)
    except (TypeError, ValueError):
        return None
