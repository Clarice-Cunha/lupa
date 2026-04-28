"""Testes dos endpoints da API (main.py).

Usamos o TestClient do FastAPI, que simula requisições HTTP sem precisar
subir um servidor real. Testamos apenas os casos que não dependem de APIs
externas (Gemini, YouTube, etc.) — erros de validação e resposta de raiz.

Para os casos que chamariam APIs externas, usamos unittest.mock.patch
para "fingir" a resposta, testando só o comportamento do endpoint em si.
"""

from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app

cliente = TestClient(app, raise_server_exceptions=False)


# ============================================================
# Endpoint raiz GET /
# ============================================================

class TestRaiz:
    def test_servidor_no_ar(self):
        resposta = cliente.get("/")
        assert resposta.status_code == 200

    def test_resposta_tem_mensagem(self):
        dados = cliente.get("/").json()
        assert "mensagem" in dados

    def test_resposta_tem_link_para_docs(self):
        dados = cliente.get("/").json()
        assert "documentacao" in dados


# ============================================================
# Endpoint POST /analisar-url — validação de entrada
# ============================================================

class TestAnalisarUrlValidacao:
    def test_url_vazia_retorna_400(self):
        resposta = cliente.post("/analisar-url", json={"url": ""})
        assert resposta.status_code == 400

    def test_url_apenas_espacos_retorna_400(self):
        resposta = cliente.post("/analisar-url", json={"url": "   "})
        assert resposta.status_code == 400

    def test_corpo_sem_campo_url_retorna_422(self):
        # 422 = Unprocessable Entity — FastAPI rejeita a estrutura do JSON
        resposta = cliente.post("/analisar-url", json={})
        assert resposta.status_code == 422

    def test_url_valida_chama_o_analisador(self):
        # Simula o retorno do analisador para não fazer chamadas reais
        resultado_falso = MagicMock()
        resultado_falso.url = "https://exemplo.com"
        resultado_falso.pontuacao = 75
        resultado_falso.classificacao = "Confiável"
        resultado_falso.cor = "#4CAF50"
        resultado_falso.titulo_pagina = "Exemplo"
        resultado_falso.resumo = None
        resultado_falso.justificativas = []
        resultado_falso.dicas_personalizadas = []
        resultado_falso.fontes_sugeridas = []
        resultado_falso.fontes_web = []

        with patch("main.analisar_url", return_value=resultado_falso):
            resposta = cliente.post("/analisar-url", json={"url": "https://exemplo.com"})

        assert resposta.status_code == 200
        dados = resposta.json()
        assert dados["pontuacao"] == 75
        assert dados["classificacao"] == "Confiável"


# ============================================================
# Endpoint POST /analisar-texto — validação de entrada
# ============================================================

class TestAnalisarTextoValidacao:
    def test_texto_vazio_retorna_400(self):
        resposta = cliente.post("/analisar-texto", json={"texto": "", "origem": ""})
        assert resposta.status_code == 400

    def test_texto_apenas_espacos_retorna_400(self):
        resposta = cliente.post("/analisar-texto", json={"texto": "   ", "origem": ""})
        assert resposta.status_code == 400

    def test_texto_muito_longo_retorna_400(self):
        texto_gigante = "a" * 20_001
        resposta = cliente.post("/analisar-texto", json={"texto": texto_gigante, "origem": ""})
        assert resposta.status_code == 400

    def test_texto_no_limite_maximo_e_aceito(self):
        resultado_falso = MagicMock()
        resultado_falso.url = "texto-colado"
        resultado_falso.pontuacao = 50
        resultado_falso.classificacao = "Requer Atenção"
        resultado_falso.cor = "#FFC107"
        resultado_falso.titulo_pagina = None
        resultado_falso.resumo = None
        resultado_falso.justificativas = []
        resultado_falso.dicas_personalizadas = []
        resultado_falso.fontes_sugeridas = []
        resultado_falso.fontes_web = []

        texto_no_limite = "a" * 20_000
        with patch("main.analisar_texto", return_value=resultado_falso):
            resposta = cliente.post(
                "/analisar-texto",
                json={"texto": texto_no_limite, "origem": "WhatsApp"},
            )
        assert resposta.status_code == 200

    def test_corpo_sem_campo_texto_retorna_422(self):
        resposta = cliente.post("/analisar-texto", json={"origem": "WhatsApp"})
        assert resposta.status_code == 422


# ============================================================
# Endpoint POST /analisar-imagem — validação de formato
# ============================================================

class TestAnalisarImagemValidacao:
    def test_formato_invalido_retorna_400(self):
        arquivo_falso = BytesIO(b"conteudo qualquer")
        resposta = cliente.post(
            "/analisar-imagem",
            files={"arquivo": ("documento.pdf", arquivo_falso, "application/pdf")},
        )
        assert resposta.status_code == 400

    def test_formato_jpg_e_aceito_pela_validacao(self):
        # Cria um JPEG mínimo válido para o Pillow conseguir abrir
        from PIL import Image
        img = Image.new("RGB", (10, 10), color=(255, 0, 0))
        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        buffer.seek(0)

        resposta = cliente.post(
            "/analisar-imagem",
            files={"arquivo": ("foto.jpg", buffer, "image/jpeg")},
        )
        # Formato aceito — mesmo sem EXIF deve retornar 200
        assert resposta.status_code == 200

    def test_formato_png_e_aceito_pela_validacao(self):
        from PIL import Image
        img = Image.new("RGB", (5, 5), color=(0, 255, 0))
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        resposta = cliente.post(
            "/analisar-imagem",
            files={"arquivo": ("imagem.png", buffer, "image/png")},
        )
        assert resposta.status_code == 200


# ============================================================
# Endpoint POST /analisar-upload — validação de formato
# ============================================================

class TestAnalisarUploadValidacao:
    def test_formato_invalido_retorna_400(self):
        arquivo_falso = BytesIO(b"conteudo qualquer")
        resposta = cliente.post(
            "/analisar-upload",
            files={"arquivo": ("foto.jpg", arquivo_falso, "image/jpeg")},
            data={"contexto": ""},
        )
        assert resposta.status_code == 400

    def test_arquivo_muito_pequeno_retorna_400(self):
        arquivo_minusculo = BytesIO(b"x" * 100)  # 100 bytes — abaixo do mínimo
        resposta = cliente.post(
            "/analisar-upload",
            files={"arquivo": ("video.mp4", arquivo_minusculo, "video/mp4")},
            data={"contexto": ""},
        )
        assert resposta.status_code == 400
