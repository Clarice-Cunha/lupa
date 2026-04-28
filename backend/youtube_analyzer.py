"""
Análise de vídeos do YouTube.

Recebe uma URL do YouTube e devolve um ResultadoAnalise no mesmo
formato do analisador de sites — assim o frontend não precisa saber
se analisou um site ou um vídeo, só pinta a tela.

Critérios:
  Camada da Fonte (canal):
    - Idade do canal
    - Número de inscritos
    - Quantidade total de vídeos publicados
  Camada do Conteúdo (vídeo):
    - Clickbait no título
    - CAIXA ALTA no título
    - Sensacionalismo nas legendas (se houver)
    - Excesso de exclamações nas legendas
    - Tamanho da descrição
"""

from __future__ import annotations

from datetime import datetime, timezone

# Reaproveitamos os helpers já testados do analisador de sites.
# Eles começam com "_" (privados), mas como são do MESMO projeto, é ok
# importar. Em projetos maiores, o ideal seria extrair para um módulo
# "text_checks.py" compartilhado.
from analyzer import (
    PONTUACAO_INICIAL,
    Justificativa,
    ResultadoAnalise,
    _montar_resultado,
    _verificar_clickbait,
    _verificar_excesso_maiusculas,
    _verificar_sensacionalismo_corpo,
    _verificar_excesso_exclamacoes,
)
from youtube import (
    DadosVideoYoutube,
    ErroYoutubeAPI,
    buscar_metadados,
    extrair_id_video,
    pegar_legendas,
)
from summary import gerar_resumo


# ============================================================
# Pesos específicos do YouTube
# ============================================================

# Idade do canal (em anos completos)
CANAL_ANTIGO_ANOS = 5        # +15 se o canal tem 5+ anos
CANAL_MEDIO_ANOS = 2         # +10 se tem entre 2 e 5 anos
                             # -15 se tem menos que 2 anos
# Inscritos
INSCRITOS_ALTOS = 100_000    # +10 acima disso
INSCRITOS_BAIXOS = 1_000     # -5 abaixo disso

# Quantidade de vídeos publicados (consistência de canal)
VIDEOS_SUFICIENTES = 50      # +5 se o canal tem 50+ vídeos


# ============================================================
# Função principal
# ============================================================

def analisar_youtube(url: str) -> ResultadoAnalise:
    """Executa todas as checagens e devolve o resultado.

    Se a chave do YouTube não estiver configurada, ou o vídeo for
    inacessível, devolve um ResultadoAnalise com pontuação neutra
    e uma justificativa explicando o problema.
    """
    id_video = extrair_id_video(url)
    if not id_video:
        return _resultado_erro(
            url, "Não foi possível identificar o ID do vídeo nesta URL."
        )

    try:
        dados = buscar_metadados(id_video)
    except ErroYoutubeAPI as erro:
        return _resultado_erro(url, str(erro))

    pontuacao = PONTUACAO_INICIAL
    justificativas: list[Justificativa] = [
        Justificativa(
            criterio="Pontuação inicial",
            resultado="Todo vídeo começa neutro e sobe/desce conforme os sinais.",
            impacto=PONTUACAO_INICIAL,
            camada="geral",
        )
    ]

    # --- Canal: idade ---
    impacto, idade_anos = _verificar_idade_canal(dados.canal_data_criacao)
    justificativas.append(Justificativa(
        criterio="Idade do canal",
        resultado=f"Canal criado há {idade_anos} ano(s).",
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Canal: inscritos ---
    impacto, texto = _verificar_inscritos(dados.canal_inscritos)
    justificativas.append(Justificativa(
        criterio="Inscritos no canal",
        resultado=texto,
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Canal: quantidade de vídeos ---
    impacto, qtd = _verificar_quantidade_videos(dados.canal_total_videos)
    justificativas.append(Justificativa(
        criterio="Histórico de postagens",
        resultado=f"Canal possui {qtd} vídeo(s) publicado(s).",
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Vídeo: clickbait no título ---
    impacto, palavra = _verificar_clickbait(dados.titulo)
    justificativas.append(Justificativa(
        criterio="Clickbait no título",
        resultado=(f"Termo sensacionalista encontrado: '{palavra}'."
                   if palavra else "Nenhum termo sensacionalista detectado no título."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Vídeo: CAIXA ALTA no título ---
    impacto, proporcao = _verificar_excesso_maiusculas(dados.titulo)
    justificativas.append(Justificativa(
        criterio="CAIXA ALTA no título",
        resultado=(f"{proporcao:.0%} das letras do título estão em maiúsculas."
                   if impacto < 0 else "Uso normal de maiúsculas no título."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Vídeo: descrição curta ---
    impacto, tamanho = _verificar_descricao(dados.descricao)
    justificativas.append(Justificativa(
        criterio="Tamanho da descrição",
        resultado=(f"Descrição tem {tamanho} caractere(s)."
                   if tamanho < 200
                   else f"Descrição razoável ({tamanho} caracteres)."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Conteúdo: legendas (se disponíveis) ---
    legendas = pegar_legendas(id_video)
    if legendas:
        # Sensacionalismo
        impacto, qtd_sens = _verificar_sensacionalismo_corpo(legendas)
        justificativas.append(Justificativa(
            criterio="Sensacionalismo na fala",
            resultado=(f"Encontradas {qtd_sens} expressões sensacionalistas na transcrição."
                       if impacto < 0
                       else "Poucas ou nenhuma expressão sensacionalista na fala."),
            impacto=impacto,
            camada="conteudo",
        ))
        pontuacao += impacto

        # Excesso de exclamações
        impacto, proporcao = _verificar_excesso_exclamacoes(legendas)
        justificativas.append(Justificativa(
            criterio="Excesso de exclamações",
            resultado=(f"Uso elevado de '!' na transcrição ({proporcao:.1%})."
                       if impacto < 0
                       else "Uso equilibrado de pontos de exclamação."),
            impacto=impacto,
            camada="conteudo",
        ))
        pontuacao += impacto
    else:
        justificativas.append(Justificativa(
            criterio="Transcrição do áudio",
            resultado="Vídeo sem legendas disponíveis — análise textual limitada.",
            impacto=0,
            camada="geral",
        ))

    # --- Resumo do conteúdo por IA (usando legendas, se houver) ---
    texto_para_resumo = legendas or dados.descricao
    resumo = gerar_resumo(texto_para_resumo) if texto_para_resumo else None

    # O título exibido no cartão do resultado:
    titulo_exibicao = f"{dados.titulo} — {dados.canal_nome}"

    return _montar_resultado(
        url=url,
        pontuacao_bruta=pontuacao,
        titulo=titulo_exibicao,
        justificativas=justificativas,
        resumo=resumo,
    )


# ============================================================
# Verificações individuais
# ============================================================

def _verificar_idade_canal(data_criacao: datetime) -> tuple[int, int]:
    """Devolve (impacto, idade_em_anos). Mesmo critério do domínio de site."""
    agora = datetime.now(tz=timezone.utc)
    # Se a data_criacao for naive (sem fuso), consideramos UTC
    if data_criacao.tzinfo is None:
        data_criacao = data_criacao.replace(tzinfo=timezone.utc)
    idade_anos = int((agora - data_criacao).days / 365)
    if idade_anos >= CANAL_ANTIGO_ANOS:
        return 15, idade_anos
    if idade_anos >= CANAL_MEDIO_ANOS:
        return 10, idade_anos
    return -15, idade_anos


def _verificar_inscritos(inscritos: int | None) -> tuple[int, str]:
    if inscritos is None:
        return 0, "O canal oculta a contagem de inscritos."
    if inscritos >= INSCRITOS_ALTOS:
        return 10, f"Canal com {inscritos:,} inscritos.".replace(",", ".")
    if inscritos <= INSCRITOS_BAIXOS:
        return -5, f"Canal pequeno: {inscritos:,} inscritos.".replace(",", ".")
    return 0, f"Canal com {inscritos:,} inscritos.".replace(",", ".")


def _verificar_quantidade_videos(total: int) -> tuple[int, int]:
    if total >= VIDEOS_SUFICIENTES:
        return 5, total
    return 0, total


def _verificar_descricao(descricao: str) -> tuple[int, int]:
    """Descrição muito curta sugere pouco cuidado com o vídeo."""
    tamanho = len(descricao or "")
    if tamanho < 50:
        return -5, tamanho
    return 0, tamanho


# ============================================================
# Caso de erro (ex: chave ausente, vídeo indisponível)
# ============================================================

def _resultado_erro(url: str, motivo: str) -> ResultadoAnalise:
    """Devolve um resultado neutro com uma justificativa de erro."""
    justificativas = [
        Justificativa(
            criterio="Análise do YouTube",
            resultado=motivo,
            impacto=0,
            camada="geral",
        )
    ]
    return _montar_resultado(
        url=url,
        pontuacao_bruta=0,
        titulo=None,
        justificativas=justificativas,
        resumo=None,
    )
