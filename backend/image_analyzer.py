"""Análise de imagens: metadados EXIF + análise visual via Gemini.

Usa a biblioteca Pillow para extrair informações técnicas embutidas
na imagem: data de criação, câmera, software de edição e coordenadas GPS.
Se a chave GEMINI_API_KEY estiver configurada, também envia a imagem ao
Gemini para análise visual do conteúdo — detectando sinais de montagem,
contexto enganoso e confrontando a suspeita descrita pelo usuário.
"""

import base64
import io
import os
import re

import requests
from dataclasses import dataclass, field
from typing import Optional

from PIL import Image, ImageChops, ImageEnhance
from PIL.ExifTags import GPSTAGS, TAGS


_MODELO_GEMINI = "gemini-2.5-flash"
_URL_GEMINI = f"https://generativelanguage.googleapis.com/v1beta/models/{_MODELO_GEMINI}:generateContent"
_TIPOS_MIME = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".webp": "image/webp",
    ".gif": "image/gif",  ".bmp": "image/bmp",
    ".tiff": "image/tiff", ".tif": "image/tiff",
}


@dataclass
class AlertaImagem:
    nivel: str  # "info", "aviso" ou "alerta"
    mensagem: str


@dataclass
class LinkBuscaReversa:
    nome: str
    url: str
    descricao: str


@dataclass
class ResultadoImagem:
    nome_arquivo: str
    formato: str
    largura: int
    altura: int
    tem_exif: bool
    data_criacao: Optional[str]
    fabricante_camera: Optional[str]
    modelo_camera: Optional[str]
    software: Optional[str]
    tem_gps: bool
    latitude: Optional[float]
    longitude: Optional[float]
    alertas: list[AlertaImagem] = field(default_factory=list)
    links_busca_reversa: list[LinkBuscaReversa] = field(default_factory=list)
    analise_visual: Optional[str] = None  # texto gerado pelo Gemini


# Softwares que indicam que a imagem foi editada após o clique original.
_SOFTWARES_EDICAO = [
    "adobe photoshop",
    "gimp",
    "lightroom",
    "affinity photo",
    "capture one",
    "darktable",
    "rawtherapee",
    "canva",
    "pixelmator",
    "paint.net",
]

# Links fixos — não dependem do conteúdo da imagem.
_LINKS_BUSCA_REVERSA = [
    LinkBuscaReversa(
        nome="Google Lens",
        url="https://lens.google.com/",
        descricao="Envie a imagem ao Google Lens para descobrir onde ela aparece na web.",
    ),
    LinkBuscaReversa(
        nome="TinEye",
        url="https://tineye.com/",
        descricao="Especializado em rastrear a origem e os usos de uma imagem.",
    ),
    LinkBuscaReversa(
        nome="Yandex Imagens",
        url="https://yandex.com/images/",
        descricao="Busca reversa russa — às vezes encontra imagens que o Google não localiza.",
    ),
]


def _analisar_com_gemini(caminho: str, contexto: str = "") -> Optional[str]:
    """Envia a imagem ao Gemini para análise visual do conteúdo.

    Se `contexto` for fornecido, o Gemini confronta a suspeita do usuário
    com o que observa na imagem. Retorna None se a chave não estiver
    configurada ou se a chamada falhar.
    """
    chave = os.getenv("GEMINI_API_KEY", "").strip()
    if not chave or chave in ("sua_chave_aqui", "COLE_SUA_CHAVE_AQUI"):
        return None

    extensao = os.path.splitext(caminho)[1].lower()
    mime = _TIPOS_MIME.get(extensao, "image/jpeg")

    with open(caminho, "rb") as f:
        imagem_b64 = base64.b64encode(f.read()).decode("utf-8")

    if contexto.strip():
        prompt = (
            f'Você é especialista em verificação de imagens e combate à desinformação. '
            f'O usuário reportou a seguinte suspeita: "{contexto.strip()}"\n\n'
            "Analise a imagem e: (1) confronte diretamente a suspeita com o que você "
            "observa — confirme ou descarte com base em evidências visuais concretas; "
            "(2) aponte outros sinais de manipulação digital, montagem, recorte suspeito "
            "ou uso fora de contexto que você identificou; (3) use linguagem simples, "
            "acessível a estudantes do ensino médio; (4) seja neutro — aponte indícios, "
            "não afirme certezas absolutas. Responda em até 5 parágrafos curtos."
        )
    else:
        prompt = (
            "Você é especialista em verificação de imagens e combate à desinformação. "
            "Analise esta imagem e: (1) descreva o que você observa; "
            "(2) aponte sinais de manipulação digital, montagem ou recorte suspeito; "
            "(3) identifique elementos que possam indicar uso fora de contexto — como "
            "legenda falsa ou reaproveitamento de imagem antiga; (4) use linguagem "
            "simples, acessível a estudantes do ensino médio; (5) aponte indícios, "
            "não afirme certezas absolutas. Responda em até 5 parágrafos curtos."
        )

    corpo = {
        "contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": mime, "data": imagem_b64}},
        ]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1200,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    try:
        resposta = requests.post(
            _URL_GEMINI,
            params={"key": chave},
            json=corpo,
            timeout=60,
        )
        resposta.raise_for_status()
        dados = resposta.json()
        texto = (
            dados.get("candidates", [{}])[0]
                 .get("content", {})
                 .get("parts", [{}])[0]
                 .get("text", "")
                 .strip()
        )
        # Remove blocos de código markdown que o Gemini às vezes insere
        texto = re.sub(r"^```(?:\w+)?\s*", "", texto)
        texto = re.sub(r"\s*```$", "", texto).strip()
        return texto or None
    except Exception:
        return None


def _analisar_ela(caminho: str) -> "AlertaImagem | None":
    """Análise de Nível de Erro (ELA) para detectar manipulação em JPEG.

    Re-salva a imagem com qualidade 95 e mede a diferença pixel a pixel.
    Regiões editadas e re-salvas tendem a ter padrões de compressão
    inconsistentes — esse desequilíbrio é o que ELA detecta.
    Só é relevante para JPEG; outros formatos retornam None.
    """
    try:
        with Image.open(caminho) as img:
            if img.format not in ("JPEG", "MPO"):
                return None
            original = img.convert("RGB")

        buffer = io.BytesIO()
        original.save(buffer, format="JPEG", quality=95)
        buffer.seek(0)

        with Image.open(buffer) as resalva:
            resalva_rgb = resalva.convert("RGB")

        # Diferença pixel a pixel em escala de cinza, amplificada 10×
        diferenca = ImageChops.difference(original, resalva_rgb).convert("L")
        amplificada = ImageEnhance.Brightness(diferenca).enhance(10)

        pixels = list(amplificada.getdata())
        media = sum(pixels) / len(pixels)

        if media > 15:
            return AlertaImagem(
                nivel="alerta",
                mensagem=(
                    f"Análise de Nível de Erro (ELA): índice {media:.1f}/255. "
                    "Padrões de compressão inconsistentes foram detectados, o que pode "
                    "indicar que partes da imagem foram editadas digitalmente. "
                    "Use as ferramentas de busca reversa abaixo para verificar a origem."
                ),
            )
        if media > 6:
            return AlertaImagem(
                nivel="aviso",
                mensagem=(
                    f"Análise de Nível de Erro (ELA): índice {media:.1f}/255. "
                    "Há variações de compressão que podem indicar algum nível de edição. "
                    "Imagens recomprimidas por redes sociais também podem apresentar "
                    "esse padrão — verifique a origem antes de concluir."
                ),
            )
        return None
    except Exception:
        return None


def _graus_para_decimal(graus: tuple, ref: str) -> float:
    """Converte coordenadas GPS (graus, minutos, segundos) para decimal."""
    d, m, s = graus
    decimal = float(d) + float(m) / 60 + float(s) / 3600
    if ref in ("S", "W"):
        decimal = -decimal
    return decimal


def _extrair_gps(exif: dict) -> tuple[Optional[float], Optional[float]]:
    """Extrai latitude e longitude do bloco GPSInfo do EXIF."""
    gps_bruto = exif.get("GPSInfo")
    if not gps_bruto:
        return None, None

    gps: dict = {}
    for chave, valor in gps_bruto.items():
        nome = GPSTAGS.get(chave, chave)
        gps[nome] = valor

    try:
        lat = _graus_para_decimal(gps["GPSLatitude"], gps.get("GPSLatitudeRef", "N"))
        lon = _graus_para_decimal(gps["GPSLongitude"], gps.get("GPSLongitudeRef", "E"))
        return lat, lon
    except (KeyError, TypeError, ZeroDivisionError):
        return None, None


def analisar_imagem(caminho_arquivo: str, nome_original: str, contexto: str = "") -> ResultadoImagem:
    """Abre a imagem, extrai metadados EXIF e produz alertas pedagógicos.

    Se GEMINI_API_KEY estiver configurada, também realiza análise visual do
    conteúdo, confrontando a suspeita descrita em `contexto` com o que a IA
    observa na imagem.
    """
    with Image.open(caminho_arquivo) as img:
        formato = img.format or "Desconhecido"
        largura, altura = img.size

        # Pillow expõe _getexif() apenas para JPEG; para outros formatos pode
        # não existir ou retornar None.
        exif_bruto = img._getexif() if hasattr(img, "_getexif") else None  # type: ignore[attr-defined]

    if not exif_bruto:
        alertas_sem_exif: list[AlertaImagem] = [
            AlertaImagem(
                nivel="aviso",
                mensagem=(
                    "Esta imagem não contém metadados EXIF. Isso pode indicar que "
                    "foi tirada com um dispositivo que não grava metadados, que passou "
                    "por ferramentas de edição que os removeram, ou que é uma captura "
                    "de tela. A ausência de metadados dificulta verificar a origem."
                ),
            )
        ]
        ela = _analisar_ela(caminho_arquivo)
        if ela:
            alertas_sem_exif.append(ela)
        analise_visual = _analisar_com_gemini(caminho_arquivo, contexto)
        return ResultadoImagem(
            nome_arquivo=nome_original,
            formato=formato,
            largura=largura,
            altura=altura,
            tem_exif=False,
            data_criacao=None,
            fabricante_camera=None,
            modelo_camera=None,
            software=None,
            tem_gps=False,
            latitude=None,
            longitude=None,
            alertas=alertas_sem_exif,
            links_busca_reversa=_LINKS_BUSCA_REVERSA,
            analise_visual=analise_visual,
        )

    # Decodifica as tags numéricas para nomes legíveis.
    exif: dict = {}
    for tag_id, valor in exif_bruto.items():
        tag = TAGS.get(tag_id, tag_id)
        exif[tag] = valor

    data_criacao: Optional[str] = exif.get("DateTimeOriginal") or exif.get("DateTime")
    fabricante: Optional[str] = exif.get("Make")
    modelo: Optional[str] = exif.get("Model")
    software: Optional[str] = exif.get("Software")

    latitude, longitude = _extrair_gps(exif)
    tem_gps = latitude is not None

    alertas: list[AlertaImagem] = []

    # Alerta: software de edição detectado.
    if software:
        for sw in _SOFTWARES_EDICAO:
            if sw in software.lower():
                alertas.append(
                    AlertaImagem(
                        nivel="aviso",
                        mensagem=(
                            f"Os metadados indicam que esta imagem foi processada com "
                            f"'{software.strip()}'. Isso não prova manipulação, mas vale "
                            "verificar a origem antes de compartilhar."
                        ),
                    )
                )
                break

    # Alerta: coordenadas GPS presentes.
    if tem_gps:
        alertas.append(
            AlertaImagem(
                nivel="info",
                mensagem=(
                    "Esta imagem contém coordenadas GPS nos metadados, o que pode revelar "
                    "o local exato onde foi tirada. Se for sua foto pessoal, avalie se "
                    "deseja compartilhá-la com essa informação."
                ),
            )
        )

    # Alerta: câmera não identificada (mas há outros EXIF).
    if not fabricante and not modelo:
        alertas.append(
            AlertaImagem(
                nivel="info",
                mensagem=(
                    "O dispositivo que capturou esta imagem não está identificado nos "
                    "metadados, apesar de existirem outros dados EXIF."
                ),
            )
        )

    ela = _analisar_ela(caminho_arquivo)
    if ela:
        alertas.append(ela)

    analise_visual = _analisar_com_gemini(caminho_arquivo, contexto)

    return ResultadoImagem(
        nome_arquivo=nome_original,
        formato=formato,
        largura=largura,
        altura=altura,
        tem_exif=True,
        data_criacao=data_criacao,
        fabricante_camera=fabricante,
        modelo_camera=modelo,
        software=software,
        tem_gps=tem_gps,
        latitude=latitude,
        longitude=longitude,
        alertas=alertas,
        links_busca_reversa=_LINKS_BUSCA_REVERSA,
        analise_visual=analise_visual,
    )
