"""Testes das funções puras do analyzer.

Testamos apenas o que é determinístico e não depende de rede:
HTTPS, clickbait, maiúsculas, exclamações, normalização de URL e
classificação final. As partes que fazem WHOIS/HTTP ficam para testes
de integração (outra fase).
"""

from analyzer import (
    _montar_resultado,
    _normalizar_url,
    _verificar_caixa_alta_no_corpo,
    _verificar_clickbait,
    _verificar_excesso_exclamacoes,
    _verificar_excesso_maiusculas,
    _verificar_https,
    _verificar_sensacionalismo_corpo,
)


# ============================================================
# Normalização de URL
# ============================================================

class TestNormalizarUrl:
    def test_adiciona_https_quando_falta_esquema(self):
        assert _normalizar_url("exemplo.com") == "https://exemplo.com"

    def test_mantem_https_existente(self):
        assert _normalizar_url("https://exemplo.com") == "https://exemplo.com"

    def test_mantem_http_existente(self):
        assert _normalizar_url("http://exemplo.com") == "http://exemplo.com"

    def test_remove_espacos_extras(self):
        assert _normalizar_url("  exemplo.com  ") == "https://exemplo.com"


# ============================================================
# HTTPS
# ============================================================

class TestVerificarHttps:
    def test_https_soma_pontos(self):
        assert _verificar_https("https://exemplo.com") == 10

    def test_http_tira_pontos(self):
        assert _verificar_https("http://exemplo.com") == -10


# ============================================================
# Clickbait no título
# ============================================================

class TestVerificarClickbait:
    def test_titulo_vazio_nao_pontua(self):
        assert _verificar_clickbait(None) == (0, None)
        assert _verificar_clickbait("") == (0, None)

    def test_titulo_limpo_nao_pontua(self):
        impacto, _ = _verificar_clickbait("Economia cresce 2% no trimestre")
        assert impacto == 0

    def test_detecta_palavra_clickbait(self):
        impacto, palavra = _verificar_clickbait("CHOCANTE: o que aconteceu")
        assert impacto == -20
        assert palavra == "chocante"

    def test_e_case_insensitive(self):
        # "ChoCante" em qualquer caixa deve ser detectado
        impacto, _ = _verificar_clickbait("Notícia ChoCante de hoje")
        assert impacto == -20


# ============================================================
# Excesso de maiúsculas no título
# ============================================================

class TestExcessoMaiusculas:
    def test_titulo_curto_nao_penaliza(self):
        impacto, _ = _verificar_excesso_maiusculas("OI")
        assert impacto == 0

    def test_titulo_equilibrado_nao_penaliza(self):
        impacto, _ = _verificar_excesso_maiusculas("Noticia do dia de hoje")
        assert impacto == 0

    def test_titulo_quase_todo_maiusculo_penaliza(self):
        impacto, proporcao = _verificar_excesso_maiusculas("ISSO E UM ABSURDO AGORA")
        assert impacto == -10
        assert proporcao > 0.5


# ============================================================
# Exclamações no corpo
# ============================================================

class TestExcessoExclamacoes:
    def test_texto_curto_nao_penaliza(self):
        impacto, _ = _verificar_excesso_exclamacoes("texto muito curto!")
        assert impacto == 0

    def test_texto_longo_sem_exclamacoes(self):
        texto = " ".join(["palavra"] * 100)
        impacto, _ = _verificar_excesso_exclamacoes(texto)
        assert impacto == 0

    def test_texto_longo_com_muitas_exclamacoes(self):
        # 100 palavras, 10 "!" → 10% — muito acima dos 2%
        texto = " ".join(["palavra!"] * 10 + ["palavra"] * 90)
        impacto, proporcao = _verificar_excesso_exclamacoes(texto)
        assert impacto == -10
        assert proporcao > 0.02


# ============================================================
# Caixa alta no corpo
# ============================================================

class TestCaixaAlta:
    def test_texto_curto_nao_penaliza(self):
        impacto, _ = _verificar_caixa_alta_no_corpo("TEXTO CURTO")
        assert impacto == 0

    def test_texto_normal_nao_penaliza(self):
        texto = " ".join(["palavra"] * 100)
        impacto, _ = _verificar_caixa_alta_no_corpo(texto)
        assert impacto == 0

    def test_muitas_palavras_em_caps_penaliza(self):
        # 100 palavras de 4+ letras, 10 em caps → 10%, acima dos 2%
        texto = " ".join(["PALAVRA"] * 10 + ["palavra"] * 90)
        impacto, _ = _verificar_caixa_alta_no_corpo(texto)
        assert impacto == -10


# ============================================================
# Sensacionalismo no corpo
# ============================================================

class TestSensacionalismoCorpo:
    def test_texto_vazio(self):
        assert _verificar_sensacionalismo_corpo("") == (0, 0)

    def test_poucas_ocorrencias_nao_penalizam(self):
        impacto, qtd = _verificar_sensacionalismo_corpo("isso é chocante, mas só isso")
        assert impacto == 0
        assert qtd == 1

    def test_muitas_ocorrencias_penalizam(self):
        texto = "chocante bombástico urgente escândalo"
        impacto, qtd = _verificar_sensacionalismo_corpo(texto)
        assert impacto == -15
        assert qtd >= 3


# ============================================================
# Classificação final (faixas de cor do PRD)
# ============================================================

class TestMontarResultado:
    def test_abaixo_de_30_e_suspeito(self):
        r = _montar_resultado("https://x.com", 20, "t", [])
        assert r.classificacao == "Suspeito"
        assert r.cor == "#B71C1C"

    def test_entre_31_e_70_requer_atencao(self):
        r = _montar_resultado("https://x.com", 50, "t", [])
        assert r.classificacao == "Requer Atenção"
        assert r.cor == "#FFC107"

    def test_acima_de_70_e_confiavel(self):
        r = _montar_resultado("https://x.com", 85, "t", [])
        assert r.classificacao == "Confiável"
        assert r.cor == "#4CAF50"

    def test_limites_ficam_entre_0_e_100(self):
        # Pontuação bruta negativa é cortada em 0
        r = _montar_resultado("https://x.com", -30, "t", [])
        assert r.pontuacao == 0
        # Pontuação bruta acima de 100 é cortada em 100
        r = _montar_resultado("https://x.com", 200, "t", [])
        assert r.pontuacao == 100
