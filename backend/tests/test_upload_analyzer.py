"""Testes das funções puras do upload_analyzer.

Testamos apenas validar_arquivo(), que é determinística e não depende
de rede nem de arquivos reais em disco.
"""

import pytest

from upload_analyzer import (
    EXTENSOES_ACEITAS,
    TAMANHO_MAXIMO_BYTES,
    TAMANHO_MINIMO_BYTES,
    ErroUpload,
    validar_arquivo,
)

TAMANHO_VALIDO = 1 * 1024 * 1024  # 1 MB — dentro dos limites


# ============================================================
# Formatos aceitos e recusados
# ============================================================

class TestFormatoArquivo:
    def test_mp4_e_aceito(self):
        validar_arquivo("video.mp4", TAMANHO_VALIDO)  # não deve levantar

    def test_mov_e_aceito(self):
        validar_arquivo("video.mov", TAMANHO_VALIDO)

    def test_avi_e_aceito(self):
        validar_arquivo("video.avi", TAMANHO_VALIDO)

    def test_mkv_e_aceito(self):
        validar_arquivo("video.mkv", TAMANHO_VALIDO)

    def test_webm_e_aceito(self):
        validar_arquivo("video.webm", TAMANHO_VALIDO)

    def test_extensao_em_maiuscula_e_aceita(self):
        # Nomes como "VIDEO.MP4" (câmeras às vezes geram assim) devem funcionar
        validar_arquivo("VIDEO.MP4", TAMANHO_VALIDO)

    def test_pdf_e_recusado(self):
        with pytest.raises(ErroUpload, match="Formato não suportado"):
            validar_arquivo("documento.pdf", TAMANHO_VALIDO)

    def test_jpg_e_recusado(self):
        with pytest.raises(ErroUpload, match="Formato não suportado"):
            validar_arquivo("foto.jpg", TAMANHO_VALIDO)

    def test_arquivo_sem_extensao_e_recusado(self):
        with pytest.raises(ErroUpload, match="Formato não suportado"):
            validar_arquivo("arquivo", TAMANHO_VALIDO)

    def test_todas_extensoes_aceitas_passam(self):
        for ext in EXTENSOES_ACEITAS:
            validar_arquivo(f"arquivo{ext}", TAMANHO_VALIDO)  # não deve levantar


# ============================================================
# Limites de tamanho
# ============================================================

class TestTamanhoArquivo:
    def test_arquivo_no_limite_maximo_e_aceito(self):
        validar_arquivo("video.mp4", TAMANHO_MAXIMO_BYTES)

    def test_arquivo_acima_do_limite_e_recusado(self):
        with pytest.raises(ErroUpload, match="maior que o limite"):
            validar_arquivo("video.mp4", TAMANHO_MAXIMO_BYTES + 1)

    def test_arquivo_no_limite_minimo_e_aceito(self):
        validar_arquivo("video.mp4", TAMANHO_MINIMO_BYTES)

    def test_arquivo_abaixo_do_minimo_e_recusado(self):
        with pytest.raises(ErroUpload, match="muito pequeno"):
            validar_arquivo("video.mp4", TAMANHO_MINIMO_BYTES - 1)

    def test_arquivo_de_1_byte_e_recusado(self):
        with pytest.raises(ErroUpload):
            validar_arquivo("video.mp4", 1)
