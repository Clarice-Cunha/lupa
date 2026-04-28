"""Análise de metadados EXIF de imagens.

Usa a biblioteca Pillow para extrair informações técnicas embutidas
na imagem: data de criação, câmera, software de edição e coordenadas GPS.
Esses dados ajudam a identificar imagens manipuladas ou sem origem clara.
"""

from dataclasses import dataclass, field
from typing import Optional

from PIL import Image
from PIL.ExifTags import GPSTAGS, TAGS


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


def analisar_imagem(caminho_arquivo: str, nome_original: str) -> ResultadoImagem:
    """Abre a imagem, extrai metadados EXIF e produz alertas pedagógicos."""
    with Image.open(caminho_arquivo) as img:
        formato = img.format or "Desconhecido"
        largura, altura = img.size

        # Pillow expõe _getexif() apenas para JPEG; para outros formatos pode
        # não existir ou retornar None.
        exif_bruto = img._getexif() if hasattr(img, "_getexif") else None  # type: ignore[attr-defined]

    if not exif_bruto:
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
            alertas=[
                AlertaImagem(
                    nivel="aviso",
                    mensagem=(
                        "Esta imagem não contém metadados EXIF. Isso pode indicar que "
                        "foi tirada com um dispositivo que não grava metadados, que passou "
                        "por ferramentas de edição que os removeram, ou que é uma captura "
                        "de tela. A ausência de metadados dificulta verificar a origem."
                    ),
                )
            ],
            links_busca_reversa=_LINKS_BUSCA_REVERSA,
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
    )
