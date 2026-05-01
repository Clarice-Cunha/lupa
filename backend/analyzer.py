"""
Analisador de URLs do LUPA.

Este módulo é o "cérebro" da análise: recebe uma URL, executa
várias checagens e devolve uma pontuação de confiabilidade (0-100)
com as justificativas de cada critério.
"""

from __future__ import annotations

import os
import re
import socket
from dataclasses import dataclass, field
from datetime import datetime, timezone
from urllib.parse import urlparse

import requests
import whois
from bs4 import BeautifulSoup


# ============================================================
# Configurações (pesos e listas)
# ============================================================

# Pontuação de partida — subtrai/soma de acordo com cada critério
PONTUACAO_INICIAL = 50

# Palavras comuns em clickbait (títulos sensacionalistas).
# Em produção, essa lista viria de um arquivo externo atualizado.
PALAVRAS_CLICKBAIT = [
    "você não vai acreditar",
    "chocante",
    "bombástico",
    "urgente",
    "absurdo",
    "revelado",
    "escândalo",
    "segredo",
    "inacreditável",
    "nunca visto",
    "isso vai mudar",
    "veja o que aconteceu",
]

# Tempo máximo de espera por uma página web (segundos)
TIMEOUT_REQUISICAO = 15


# ============================================================
# Estrutura do resultado
# ============================================================

@dataclass
class Justificativa:
    """Uma linha do relatório: o que foi verificado e o impacto na nota."""
    criterio: str
    resultado: str
    impacto: int  # pode ser positivo (+) ou negativo (-)
    # Camada conforme PRD §9: "fonte" (quem publicou), "conteudo" (o que diz),
    # "geral" (mecânica da análise — pontuação base, limitações, etc.)
    camada: str = "geral"


@dataclass
class ResultadoAnalise:
    """O pacote completo devolvido ao usuário."""
    url: str
    pontuacao: int
    classificacao: str        # "Confiável" | "Requer Atenção" | "Suspeito"
    cor: str                  # cor hexadecimal para o frontend
    titulo_pagina: str | None
    resumo: str | None        # resumo gerado por IA (pode vir vazio)
    justificativas: list[Justificativa] = field(default_factory=list)
    # Dicas de checagem personalizadas, escolhidas com base nos pontos fracos
    # detectados (PRD §9: camada educacional).
    dicas_personalizadas: list[str] = field(default_factory=list)
    # Fontes confiáveis sugeridas para cruzar a informação.
    # Cada item: {"nome": str, "url": str, "descricao": str}
    fontes_sugeridas: list[dict] = field(default_factory=list)
    # Artigos encontrados na web durante a análise de texto (Tavily).
    # Cada item: {"titulo": str, "url": str, "descricao": str}
    fontes_web: list[dict] = field(default_factory=list)


# ============================================================
# Função principal
# ============================================================

def _dominio_existe(url: str) -> bool:
    """Verifica via DNS se o domínio da URL pode ser resolvido.

    Usa socket diretamente — é mais rápido e confiável do que
    interpretar mensagens de exceção do requests.
    """
    hostname = urlparse(url).hostname or ""
    timeout_anterior = socket.getdefaulttimeout()
    socket.setdefaulttimeout(5)
    try:
        socket.getaddrinfo(hostname, 80)
        return True
    except (socket.gaierror, OSError):
        return False
    finally:
        socket.setdefaulttimeout(timeout_anterior)


def analisar_url(url: str) -> ResultadoAnalise:
    """Ponto de entrada: recebe uma URL e devolve o resultado da análise."""
    url = _normalizar_url(url)

    # --- Verificação de DNS: o domínio existe? ---
    # Fazemos isso ANTES de qualquer outro critério.
    # Se o domínio não existe, não há nada a analisar — pontuação zero.
    if not _dominio_existe(url):
        from tips import sugerir_fontes
        return ResultadoAnalise(
            url=url,
            pontuacao=0,
            classificacao="Suspeito",
            cor="#B71C1C",
            titulo_pagina=None,
            resumo=None,
            justificativas=[
                Justificativa(
                    criterio="Domínio inexistente",
                    resultado=(
                        "Este endereço não existe na internet. "
                        "Verifique se digitou a URL corretamente — "
                        "links com erros ou inventados são comuns em golpes e correntes falsas."
                    ),
                    impacto=0,
                    camada="fonte",
                )
            ],
            dicas_personalizadas=[
                "Confira se copiou o link completo, sem espaços ou caracteres extras.",
                "Links inválidos costumam circular em golpes (phishing). Nunca forneça dados pessoais a partir deles.",
            ],
            fontes_sugeridas=sugerir_fontes(0),
        )

    justificativas: list[Justificativa] = []
    pontuacao = PONTUACAO_INICIAL

    # --- Base: toda análise começa com 50 pontos ---
    # Registrar isso explicitamente para o usuário conseguir refazer a conta.
    justificativas.append(Justificativa(
        criterio="Pontuação inicial",
        resultado="Toda análise começa com uma pontuação base de 50 pontos.",
        impacto=PONTUACAO_INICIAL,
        camada="geral",
    ))

    # --- Checagem 1: HTTPS ---
    impacto = _verificar_https(url)
    justificativas.append(Justificativa(
        criterio="Uso de HTTPS",
        resultado="O site usa conexão segura (HTTPS)." if impacto > 0
                  else "O site NÃO usa HTTPS — conexão não criptografada.",
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Checagem 2: Idade do domínio ---
    idade_anos, impacto = _verificar_idade_dominio(url)
    if idade_anos is None:
        texto = "Não foi possível determinar a idade do domínio."
    else:
        texto = f"Domínio existe há aproximadamente {idade_anos} ano(s)."
    justificativas.append(Justificativa(
        criterio="Idade do domínio",
        resultado=texto,
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Buscar o HTML da página (necessário para as próximas checagens) ---
    html, erro, penalidade_acesso, tipo_erro = _baixar_pagina(url)

    if tipo_erro == "dns":
        # O domínio simplesmente não existe — a URL é inválida.
        # Ignoramos tudo que foi calculado até aqui (HTTPS, idade) e
        # retornamos pontuação zero com uma mensagem direta.
        from tips import sugerir_fontes
        return ResultadoAnalise(
            url=url,
            pontuacao=0,
            classificacao="Suspeito",
            cor="#B71C1C",
            titulo_pagina=None,
            resumo=None,
            justificativas=[
                Justificativa(
                    criterio="Domínio inexistente",
                    resultado=(
                        "Este endereço não existe na internet. "
                        "Verifique se digitou a URL corretamente — "
                        "links com erros ou inventados são comuns em golpes e correntes falsas."
                    ),
                    impacto=0,
                    camada="fonte",
                )
            ],
            dicas_personalizadas=[
                "Confira se copiou o link completo, sem espaços ou caracteres extras no início ou no final.",
                "Links inexistentes costumam circular em golpes (phishing). Nunca forneça dados pessoais a partir deles.",
            ],
            fontes_sugeridas=sugerir_fontes(0),
        )

    if erro:
        # O domínio existe, mas o site está fora do ar ou inacessível.
        # Mantemos o que foi analisado (HTTPS, idade do domínio) e
        # adicionamos um aviso claro sobre a limitação da análise.
        justificativas.append(Justificativa(
            criterio="Site inacessível",
            resultado=(
                f"O domínio existe, mas o site está fora do ar ou inacessível ({erro}). "
                "Só foi possível verificar o domínio — o conteúdo da página não pôde ser analisado."
            ),
            impacto=penalidade_acesso,
            camada="fonte",
        ))
        pontuacao += penalidade_acesso
        return _montar_resultado(url, pontuacao, None, justificativas)

    sopa = BeautifulSoup(html, "lxml")
    titulo = _extrair_titulo(sopa)

    # --- Checagem 3: Clickbait no título ---
    impacto, palavra_encontrada = _verificar_clickbait(titulo)
    if impacto < 0:
        texto = f'Título contém termo associado a clickbait: "{palavra_encontrada}".'
    else:
        texto = "Título não contém termos típicos de clickbait."
    justificativas.append(Justificativa(
        criterio="Indícios de clickbait",
        resultado=texto,
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Checagem 4: Excesso de maiúsculas no título ---
    impacto, proporcao = _verificar_excesso_maiusculas(titulo)
    if impacto < 0:
        texto = f"Título tem {proporcao:.0%} de letras maiúsculas (tom alarmista)."
    else:
        texto = "Uso equilibrado de maiúsculas no título."
    justificativas.append(Justificativa(
        criterio="Uso de maiúsculas no título",
        resultado=texto,
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Checagem 5: Presença de página "Sobre" / "Contato" ---
    impacto = _verificar_paginas_institucionais(sopa, url)
    justificativas.append(Justificativa(
        criterio="Informações institucionais",
        resultado="Foram encontrados links para 'Sobre' ou 'Contato'." if impacto > 0
                  else "Não foram encontrados links claros para 'Sobre' ou 'Contato'.",
        impacto=impacto,
        camada="fonte",
    ))
    pontuacao += impacto

    # --- Checagem 6: Links externos / referências ---
    impacto, qtd_links_externos = _verificar_referencias(sopa, url)
    justificativas.append(Justificativa(
        criterio="Referências externas",
        resultado=(f"A página cita {qtd_links_externos} fontes externas."
                   if impacto > 0
                   else "A página não cita fontes externas."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Extrair texto do corpo da página (usado nas próximas checagens) ---
    texto_corpo = _extrair_texto_corpo(sopa)

    # --- Checagem 7: Palavras sensacionalistas no corpo do texto ---
    impacto, qtd_sensacionais = _verificar_sensacionalismo_corpo(texto_corpo)
    justificativas.append(Justificativa(
        criterio="Sensacionalismo no texto",
        resultado=(f"Encontradas {qtd_sensacionais} expressões sensacionalistas no corpo."
                   if impacto < 0
                   else "Poucas ou nenhuma expressão sensacionalista no corpo."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Checagem 8: Excesso de pontos de exclamação ---
    impacto, proporcao_exclamacoes = _verificar_excesso_exclamacoes(texto_corpo)
    justificativas.append(Justificativa(
        criterio="Excesso de pontos de exclamação",
        resultado=(f"Uso muito elevado de '!' ({proporcao_exclamacoes:.1%} do texto)."
                   if impacto < 0
                   else "Uso equilibrado de pontos de exclamação."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Checagem 9: Palavras escritas em CAIXA ALTA no corpo ---
    impacto, proporcao_caps = _verificar_caixa_alta_no_corpo(texto_corpo)
    justificativas.append(Justificativa(
        criterio="Palavras em CAIXA ALTA no texto",
        resultado=(f"{proporcao_caps:.1%} das palavras estão em maiúsculas (tom de 'grito')."
                   if impacto < 0
                   else "Proporção normal de palavras em maiúsculas."),
        impacto=impacto,
        camada="conteudo",
    ))
    pontuacao += impacto

    # --- Checagem 10: Fact-checks de agências certificadas (IFCN) ---
    # Só executa se a chave GOOGLE_FACT_CHECK_API_KEY estiver configurada.
    # Cruza o título (ou domínio) com o banco global de checagens da IFCN.
    if os.getenv("GOOGLE_FACT_CHECK_API_KEY", "").strip():
        from fact_check import avaliar_impacto, buscar_checagens
        consulta_fc = titulo or urlparse(url).netloc
        checagens = buscar_checagens(consulta_fc)
        impacto_fc, texto_fc = avaliar_impacto(checagens)
        justificativas.append(Justificativa(
            criterio="Checagem em banco de dados IFCN",
            resultado=texto_fc,
            impacto=impacto_fc,
            camada="fonte",
        ))
        pontuacao += impacto_fc

    # --- Resumo do conteúdo (via IA, se a chave estiver configurada) ---
    from summary import gerar_resumo
    resumo = gerar_resumo(texto_corpo)

    return _montar_resultado(url, pontuacao, titulo, justificativas, resumo)


# ============================================================
# Funções auxiliares (uma checagem cada)
# ============================================================

def _normalizar_url(url: str) -> str:
    """Garante que a URL começa com http:// ou https://."""
    url = url.strip()
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "https://" + url
    return url


def _verificar_https(url: str) -> int:
    return 10 if url.lower().startswith("https://") else -10


def _verificar_idade_dominio(url: str) -> tuple[int | None, int]:
    """Consulta o WHOIS do domínio. Retorna (idade_em_anos, impacto)."""
    dominio = urlparse(url).netloc
    try:
        info = whois.whois(dominio)
        data_criacao = info.creation_date
        # WHOIS às vezes devolve lista — pegamos a primeira data válida
        if isinstance(data_criacao, list):
            data_criacao = data_criacao[0]
        if not isinstance(data_criacao, datetime):
            return None, 0
        # Normaliza timezone para evitar erro de comparação
        if data_criacao.tzinfo is None:
            data_criacao = data_criacao.replace(tzinfo=timezone.utc)
        idade = datetime.now(timezone.utc) - data_criacao
        anos = idade.days // 365
    except Exception:
        return None, 0

    if anos >= 5:
        return anos, 15
    if anos >= 2:
        return anos, 10
    if anos < 1:
        return anos, -15
    return anos, 0


def _baixar_pagina(url: str) -> tuple[str | None, str | None, int, str]:
    """Baixa o HTML da URL.

    Retorna (html, erro_msg, penalidade, tipo_erro).
    - Sucesso:           (html, None, 0, "")
    - Domínio inexiste:  (None, msg, -40, "dns")
    - Timeout:           (None, msg, -15, "timeout")
    - Erro HTTP:         (None, msg, -15, "http")
    - Outros:            (None, msg, -25, "conexao")

    Separar o tipo_erro do texto da mensagem permite que analisar_url
    tome decisões diferentes para cada situação.
    """
    try:
        cabecalhos = {
            "User-Agent": "Mozilla/5.0 (LUPA-bot/0.1; educacional)"
        }
        resposta = requests.get(url, headers=cabecalhos, timeout=TIMEOUT_REQUISICAO)
        resposta.raise_for_status()
        return resposta.text, None, 0, ""
    except requests.Timeout:
        return None, "a página demorou demais para responder (timeout)", -15, "timeout"
    except requests.HTTPError as e:
        return None, f"o servidor retornou erro HTTP {e.response.status_code}", -15, "http"
    except requests.ConnectionError as e:
        msg = str(e).lower()
        sinais_dns = (
            "getaddrinfo",
            "name or service not known",
            "nodename nor servname",
            "name resolution",
            "no address associated",
        )
        if any(s in msg for s in sinais_dns):
            return None, "domínio não encontrado", -40, "dns"
        return None, "não foi possível conectar ao servidor", -25, "conexao"
    except requests.RequestException as e:
        return None, f"falha de rede ({type(e).__name__})", -20, "conexao"


def _extrair_titulo(sopa: BeautifulSoup) -> str | None:
    elemento = sopa.find("title")
    if elemento and elemento.string:
        return elemento.string.strip()
    return None


def _verificar_clickbait(titulo: str | None) -> tuple[int, str | None]:
    if not titulo:
        return 0, None
    titulo_minusculo = titulo.lower()
    for palavra in PALAVRAS_CLICKBAIT:
        if palavra in titulo_minusculo:
            return -20, palavra
    return 0, None


def _verificar_excesso_maiusculas(titulo: str | None) -> tuple[int, float]:
    if not titulo:
        return 0, 0.0
    letras = [c for c in titulo if c.isalpha()]
    if len(letras) < 5:
        return 0, 0.0
    maiusculas = sum(1 for c in letras if c.isupper())
    proporcao = maiusculas / len(letras)
    if proporcao > 0.5:
        return -10, proporcao
    return 0, proporcao


def _verificar_paginas_institucionais(sopa: BeautifulSoup, url_base: str) -> int:
    """Procura links contendo 'sobre', 'contato', 'quem somos', etc."""
    termos = ["sobre", "contato", "quem somos", "about", "contact"]
    for link in sopa.find_all("a", href=True):
        texto = link.get_text(strip=True).lower()
        href = link["href"].lower()
        if any(t in texto or t in href for t in termos):
            return 10
    return -5


def _verificar_referencias(sopa: BeautifulSoup, url_base: str) -> tuple[int, int]:
    """Conta links que saem para domínios diferentes (referências externas)."""
    dominio_base = urlparse(url_base).netloc
    externos = 0
    for link in sopa.find_all("a", href=True):
        href = link["href"]
        if href.startswith("http"):
            dominio_link = urlparse(href).netloc
            if dominio_link and dominio_link != dominio_base:
                externos += 1
    if externos >= 3:
        return 10, externos
    return 0, externos


def _extrair_texto_corpo(sopa: BeautifulSoup) -> str:
    """Extrai apenas o texto visível da página, sem scripts e sem CSS."""
    # Remover tags que não representam conteúdo textual real
    for tag in sopa(["script", "style", "noscript"]):
        tag.decompose()
    texto = sopa.get_text(separator=" ")
    # Compactar espaços em branco
    return re.sub(r"\s+", " ", texto).strip()


def _verificar_sensacionalismo_corpo(texto: str) -> tuple[int, int]:
    """Conta quantas expressões da lista de clickbait aparecem no corpo."""
    if not texto:
        return 0, 0
    texto_minusculo = texto.lower()
    total = sum(texto_minusculo.count(p) for p in PALAVRAS_CLICKBAIT)
    if total >= 3:
        return -15, total
    return 0, total


def _verificar_excesso_exclamacoes(texto: str) -> tuple[int, float]:
    """Penaliza se houver muitos '!' em relação ao número de palavras."""
    palavras = texto.split()
    if len(palavras) < 50:
        return 0, 0.0  # textos muito curtos não dão boa amostra
    qtd_exclamacoes = texto.count("!")
    proporcao = qtd_exclamacoes / len(palavras)
    if proporcao > 0.02:  # mais de 2% das palavras com "!" é muito
        return -10, proporcao
    return 0, proporcao


def _verificar_caixa_alta_no_corpo(texto: str) -> tuple[int, float]:
    """Penaliza se muitas palavras (4+ letras) estão em CAIXA ALTA."""
    palavras = [p for p in texto.split() if len(p) >= 4 and p.isalpha()]
    if len(palavras) < 50:
        return 0, 0.0
    qtd_caps = sum(1 for p in palavras if p.isupper())
    proporcao = qtd_caps / len(palavras)
    if proporcao > 0.02:
        return -10, proporcao
    return 0, proporcao


def _montar_resultado(
    url: str,
    pontuacao_bruta: int,
    titulo: str | None,
    justificativas: list[Justificativa],
    resumo: str | None = None,
) -> ResultadoAnalise:
    """Aplica os limites (0-100) e decide a classificação + cor."""
    pontuacao = max(0, min(100, pontuacao_bruta))
    if pontuacao <= 30:
        classificacao, cor = "Suspeito", "#B71C1C"
    elif pontuacao <= 70:
        classificacao, cor = "Requer Atenção", "#FFC107"
    else:
        classificacao, cor = "Confiável", "#4CAF50"
    # Importação local evita import circular (tips.py importa daqui).
    from tips import gerar_dicas_personalizadas, sugerir_fontes
    return ResultadoAnalise(
        url=url,
        pontuacao=pontuacao,
        classificacao=classificacao,
        cor=cor,
        titulo_pagina=titulo,
        resumo=resumo,
        justificativas=justificativas,
        dicas_personalizadas=gerar_dicas_personalizadas(justificativas),
        fontes_sugeridas=sugerir_fontes(pontuacao),
    )
