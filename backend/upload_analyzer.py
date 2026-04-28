"""
Análise de vídeos enviados pelo usuário (upload).

Nesta primeira versão NÃO fazemos transcrição de áudio — por isso a
análise fica limitada a metadados do arquivo + contexto fornecido pelo
usuário. É honesto avisar isso no resultado para não dar falsa impressão
de avaliação profunda.

Metadados úteis que o hachoir consegue extrair de MP4/MOV/AVI:
    - Duração
    - Data/hora de criação
    - Software de edição (às vezes presente)
    - Codec, resolução, etc.
"""

from __future__ import annotations

from datetime import datetime, timezone

from hachoir.metadata import extractMetadata
from hachoir.parser import createParser

from analyzer import (
    PONTUACAO_INICIAL,
    Justificativa,
    ResultadoAnalise,
    _montar_resultado,
)


# Extensões aceitas (em minúsculas, com ponto)
EXTENSOES_ACEITAS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}

# Tamanho máximo de arquivo (100 MB)
TAMANHO_MAXIMO_BYTES = 100 * 1024 * 1024

# Tamanho mínimo razoável (10 KB) — abaixo disso provavelmente é lixo
TAMANHO_MINIMO_BYTES = 10 * 1024


class ErroUpload(Exception):
    """Problema com o arquivo enviado (formato, tamanho, etc.)."""


# ============================================================
# Validação
# ============================================================

def validar_arquivo(nome_arquivo: str, tamanho_bytes: int) -> None:
    """Levanta ErroUpload se o arquivo não atender aos requisitos."""
    nome_minusculo = nome_arquivo.lower()
    if not any(nome_minusculo.endswith(ext) for ext in EXTENSOES_ACEITAS):
        raise ErroUpload(
            f"Formato não suportado. Use: {', '.join(sorted(EXTENSOES_ACEITAS))}"
        )
    if tamanho_bytes > TAMANHO_MAXIMO_BYTES:
        mb = TAMANHO_MAXIMO_BYTES // (1024 * 1024)
        raise ErroUpload(f"Arquivo maior que o limite de {mb} MB.")
    if tamanho_bytes < TAMANHO_MINIMO_BYTES:
        raise ErroUpload("Arquivo muito pequeno para ser um vídeo válido.")


# ============================================================
# Função principal
# ============================================================

def analisar_upload(
    caminho_arquivo: str,
    nome_original: str,
    contexto_usuario: str | None = None,
) -> ResultadoAnalise:
    """Analisa o arquivo e devolve um ResultadoAnalise.

    `caminho_arquivo` é o caminho no disco (já salvo temporariamente).
    `contexto_usuario` é um texto opcional em que a pessoa explica a origem.
    """
    pontuacao = PONTUACAO_INICIAL
    justificativas: list[Justificativa] = [
        Justificativa(
            criterio="Pontuação inicial",
            resultado="Todo vídeo começa neutro e sobe/desce conforme os sinais.",
            impacto=PONTUACAO_INICIAL,
            camada="geral",
        )
    ]

    # Aviso de limitação: importante para o usuário entender o escopo
    justificativas.append(Justificativa(
        criterio="Análise limitada",
        resultado=(
            "Nesta versão o LUPA ainda não transcreve o áudio do vídeo. "
            "A análise é baseada apenas em metadados do arquivo."
        ),
        impacto=0,
        camada="geral",
    ))

    # --- Metadados do arquivo ---
    metadados = _extrair_metadados(caminho_arquivo)

    # Data de criação
    impacto, texto = _verificar_data_criacao(metadados.get("data_criacao"))
    justificativas.append(Justificativa(
        criterio="Data de criação do arquivo",
        resultado=texto,
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # Software de edição (se presente)
    software = metadados.get("software")
    if software:
        justificativas.append(Justificativa(
            criterio="Software de edição identificado",
            resultado=f"Arquivo marca edição em: {software}.",
            impacto=0,
            camada="fonte",
        ))

    # Duração
    duracao = metadados.get("duracao_segundos")
    if duracao:
        justificativas.append(Justificativa(
            criterio="Duração",
            resultado=f"Vídeo com {_formatar_duracao(duracao)}.",
            impacto=0,
            camada="conteudo",
        ))

    # --- Contexto do usuário ---
    impacto, texto = _verificar_contexto_usuario(contexto_usuario)
    justificativas.append(Justificativa(
        criterio="Contexto informado pelo usuário",
        resultado=texto,
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    titulo = nome_original

    return _montar_resultado(
        url=nome_original,
        pontuacao_bruta=pontuacao,
        titulo=titulo,
        justificativas=justificativas,
        resumo=None,
    )


# ============================================================
# Helpers
# ============================================================

def _extrair_metadados(caminho: str) -> dict:
    """Tenta extrair metadados com hachoir. Devolve dict (pode vir vazio)."""
    resultado: dict = {}
    try:
        parser = createParser(caminho)
        if not parser:
            return resultado
        # `with` garante que o arquivo do parser seja fechado
        with parser:
            meta = extractMetadata(parser)
            if not meta:
                return resultado
            # Hachoir expõe metadados via texto; pegamos alguns conhecidos
            if meta.has("creation_date"):
                resultado["data_criacao"] = meta.get("creation_date")
            if meta.has("producer"):
                resultado["software"] = meta.get("producer")
            elif meta.has("comment"):
                # Alguns editores gravam o software em "comment"
                resultado["software"] = meta.get("comment")
            if meta.has("duration"):
                duracao = meta.get("duration")
                # total_seconds retorna float; arredondamos
                resultado["duracao_segundos"] = int(duracao.total_seconds())
    except Exception:
        # Hachoir pode falhar em alguns arquivos — seguimos sem metadados.
        pass
    return resultado


def _verificar_data_criacao(data) -> tuple[int, str]:
    if not data:
        return -5, (
            "Arquivo sem data de criação nos metadados — "
            "pode indicar que os dados foram removidos."
        )
    if isinstance(data, datetime):
        # datetime naive → assume UTC pra comparar
        if data.tzinfo is None:
            data = data.replace(tzinfo=timezone.utc)
        return 5, f"Criado em {data.strftime('%d/%m/%Y %H:%M')}."
    return 0, f"Data reportada: {data}"


def _verificar_contexto_usuario(contexto: str | None) -> tuple[int, str]:
    if not contexto or len(contexto.strip()) < 20:
        return 0, (
            "Nenhum contexto informado. "
            "Quando você conhece a origem do vídeo, descrevê-la ajuda a análise."
        )
    return 5, "Usuário forneceu contexto sobre a origem do vídeo."


def _formatar_duracao(segundos: int) -> str:
    minutos, seg = divmod(segundos, 60)
    if minutos < 60:
        return f"{minutos} min {seg:02d} s"
    horas, minutos = divmod(minutos, 60)
    return f"{horas} h {minutos:02d} min"
