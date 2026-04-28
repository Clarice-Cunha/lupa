"""Testes das regras de geração de dicas e sugestão de fontes."""

from analyzer import Justificativa
from tips import (
    DICAS_POR_CRITERIO,
    DICAS_UNIVERSAIS,
    LIMITE_DICAS,
    gerar_dicas_personalizadas,
    sugerir_fontes,
)


# ============================================================
# Dicas personalizadas
# ============================================================

class TestGerarDicas:
    def test_sem_negativas_usa_dicas_universais(self):
        justificativas = [
            Justificativa("Uso de HTTPS", "ok", 10, "fonte"),
        ]
        dicas = gerar_dicas_personalizadas(justificativas)
        assert len(dicas) > 0
        assert all(d in DICAS_UNIVERSAIS for d in dicas)

    def test_prioriza_criterios_negativos(self):
        justificativas = [
            Justificativa("Uso de HTTPS", "sem https", -10, "fonte"),
            Justificativa("Indícios de clickbait", "chocante", -20, "conteudo"),
        ]
        dicas = gerar_dicas_personalizadas(justificativas)
        assert DICAS_POR_CRITERIO["Uso de HTTPS"] in dicas
        assert DICAS_POR_CRITERIO["Indícios de clickbait"] in dicas

    def test_respeita_limite_maximo(self):
        # Cria muito mais critérios negativos do que o limite
        justificativas = [
            Justificativa(criterio, "x", -10, "conteudo")
            for criterio in list(DICAS_POR_CRITERIO.keys())[:10]
        ]
        dicas = gerar_dicas_personalizadas(justificativas)
        assert len(dicas) == LIMITE_DICAS

    def test_nao_duplica_dicas(self):
        # Dois critérios negativos idênticos não devem repetir a mesma dica
        justificativas = [
            Justificativa("Uso de HTTPS", "x", -10, "fonte"),
            Justificativa("Uso de HTTPS", "x", -10, "fonte"),
        ]
        dicas = gerar_dicas_personalizadas(justificativas)
        assert len(dicas) == len(set(dicas))

    def test_criterio_desconhecido_nao_quebra(self):
        justificativas = [
            Justificativa("Critério inexistente", "x", -10, "geral"),
        ]
        dicas = gerar_dicas_personalizadas(justificativas)
        # Deve cair no fallback das dicas universais
        assert len(dicas) > 0

    def test_lista_vazia_devolve_universais(self):
        dicas = gerar_dicas_personalizadas([])
        assert len(dicas) > 0
        assert all(d in DICAS_UNIVERSAIS for d in dicas)


# ============================================================
# Fontes sugeridas por pontuação
# ============================================================

class TestSugerirFontes:
    def test_pontuacao_baixa_traz_mais_fontes(self):
        fontes = sugerir_fontes(20)
        assert len(fontes) == 4

    def test_pontuacao_media(self):
        fontes = sugerir_fontes(50)
        assert len(fontes) == 3

    def test_pontuacao_alta_traz_menos_fontes(self):
        fontes = sugerir_fontes(90)
        assert len(fontes) == 2

    def test_formato_dos_itens(self):
        for fonte in sugerir_fontes(50):
            assert "nome" in fonte
            assert "url" in fonte
            assert "descricao" in fonte
            assert fonte["url"].startswith("https://")

    def test_limites_das_faixas(self):
        # Limites exatos das faixas do PRD
        assert len(sugerir_fontes(30)) == 4   # ainda "Suspeito"
        assert len(sugerir_fontes(31)) == 3   # já "Requer Atenção"
        assert len(sugerir_fontes(70)) == 3   # ainda "Requer Atenção"
        assert len(sugerir_fontes(71)) == 2   # já "Confiável"
