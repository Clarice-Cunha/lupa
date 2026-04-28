"""Testes das funções puras do módulo youtube.

Testamos apenas o que é determinístico e não faz chamadas de rede:
detecção de URL, extração de ID, conversão de data e conversão de inteiros.
As partes que chamam a YouTube Data API ficam para testes de integração.
"""

from datetime import datetime, timezone

from youtube import (
    _int_ou_none,
    _parse_data_iso,
    eh_url_youtube,
    extrair_id_video,
)

# ID de vídeo real usado nos exemplos de URL abaixo
ID_VALIDO = "dQw4w9WgXcQ"


# ============================================================
# Detecção de URL do YouTube
# ============================================================

class TestEhUrlYoutube:
    def test_youtube_com_watch(self):
        assert eh_url_youtube(f"https://www.youtube.com/watch?v={ID_VALIDO}") is True

    def test_youtu_be_curto(self):
        assert eh_url_youtube(f"https://youtu.be/{ID_VALIDO}") is True

    def test_youtube_shorts(self):
        assert eh_url_youtube(f"https://www.youtube.com/shorts/{ID_VALIDO}") is True

    def test_m_youtube_mobile(self):
        assert eh_url_youtube(f"https://m.youtube.com/watch?v={ID_VALIDO}") is True

    def test_site_comum_nao_e_youtube(self):
        assert eh_url_youtube("https://www.bbc.com/noticia") is False

    def test_url_vazia_nao_e_youtube(self):
        assert eh_url_youtube("") is False

    def test_url_sem_esquema_nao_e_youtube(self):
        assert eh_url_youtube("youtube.com/watch?v=abc") is False


# ============================================================
# Extração de ID de vídeo
# ============================================================

class TestExtrairIdVideo:
    def test_formato_watch(self):
        url = f"https://www.youtube.com/watch?v={ID_VALIDO}"
        assert extrair_id_video(url) == ID_VALIDO

    def test_formato_curto_youtu_be(self):
        url = f"https://youtu.be/{ID_VALIDO}"
        assert extrair_id_video(url) == ID_VALIDO

    def test_formato_shorts(self):
        url = f"https://www.youtube.com/shorts/{ID_VALIDO}"
        assert extrair_id_video(url) == ID_VALIDO

    def test_formato_embed(self):
        url = f"https://www.youtube.com/embed/{ID_VALIDO}"
        assert extrair_id_video(url) == ID_VALIDO

    def test_url_sem_id_retorna_none(self):
        assert extrair_id_video("https://www.youtube.com/channel/UC123") is None

    def test_url_de_outro_site_retorna_none(self):
        assert extrair_id_video("https://www.bbc.com") is None

    def test_id_curto_demais_retorna_none(self):
        # IDs do YouTube têm exatamente 11 caracteres
        assert extrair_id_video("https://youtu.be/curto") is None


# ============================================================
# Conversão de data ISO 8601
# ============================================================

class TestParseDataIso:
    def test_data_valida_com_z(self):
        dt = _parse_data_iso("2020-03-15T12:00:00Z")
        assert dt.year == 2020
        assert dt.month == 3
        assert dt.day == 15
        assert dt.tzinfo == timezone.utc

    def test_data_valida_com_offset(self):
        dt = _parse_data_iso("2021-06-01T00:00:00+00:00")
        assert dt.year == 2021

    def test_texto_vazio_retorna_data_atual(self):
        antes = datetime.now(tz=timezone.utc)
        dt = _parse_data_iso("")
        depois = datetime.now(tz=timezone.utc)
        assert antes <= dt <= depois

    def test_texto_invalido_retorna_data_atual(self):
        dt = _parse_data_iso("isso-nao-e-uma-data")
        assert isinstance(dt, datetime)


# ============================================================
# Conversão de inteiro tolerante
# ============================================================

class TestIntOuNone:
    def test_string_numerica(self):
        assert _int_ou_none("42") == 42

    def test_inteiro_direto(self):
        assert _int_ou_none(100) == 100

    def test_none_retorna_none(self):
        assert _int_ou_none(None) is None

    def test_string_vazia_retorna_none(self):
        assert _int_ou_none("") is None

    def test_texto_nao_numerico_retorna_none(self):
        assert _int_ou_none("abc") is None
