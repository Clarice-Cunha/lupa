"""
Verificação de histórico de domínios no Internet Archive (Wayback Machine).

O Wayback Machine arquiva páginas da web desde 1996. Consultar o histórico
de um domínio permite estimar sua antiguidade de forma independente do WHOIS
— útil quando o registro WHOIS está oculto (domínios privados) ou foi
atualizado após transferência de proprietário.

API pública, gratuita, sem chave necessária.
Documentação: https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md
"""

from datetime import datetime
from urllib.parse import urlparse

import requests


def verificar_wayback(url: str) -> tuple[int, str]:
    """Consulta o histórico do domínio no Wayback Machine.

    Retorna (impacto, texto_resultado).
    - impacto: pontos a somar/subtrair da pontuação
    - texto_resultado: frase legível para o usuário ("" se erro/skip)
    """
    try:
        hostname = urlparse(url).hostname or ""
        if not hostname:
            return 0, ""

        # CDX API: busca a captura mais antiga do domínio
        # matchType=host inclui todas as URLs sob o domínio
        # limit=1 + sort padrão (timestamp asc) = primeira captura
        resp = requests.get(
            "https://web.archive.org/cdx/search/cdx",
            params={
                "url": hostname,
                "output": "json",
                "limit": "1",
                "fl": "timestamp",
                "matchType": "host",
            },
            timeout=7,
        )

        if resp.status_code != 200:
            return 0, ""

        data = resp.json()
        # CDX retorna lista de listas; primeira linha é cabeçalho, demais são registros
        if len(data) < 2:
            return -5, (
                "Este domínio não possui histórico no Internet Archive (Wayback Machine) "
                "— pode ser muito recente ou nunca ter sido indexado."
            )

        timestamp = data[1][0]  # formato: YYYYMMDDHHMMSS
        year = int(timestamp[:4])
        month = int(timestamp[4:6])

        first_seen = datetime(year, month, 1)
        years = (datetime.now() - first_seen).days / 365

        if years >= 5:
            return 5, (
                f"Domínio presente no Wayback Machine desde {month:02d}/{year} "
                f"({int(years)} anos de histórico)."
            )
        if years >= 1:
            return 0, (
                f"Domínio registrado no Wayback Machine desde {month:02d}/{year} "
                f"({int(years)} ano(s) de histórico)."
            )

        meses = max(1, int(years * 12))
        return -3, (
            f"Domínio com apenas {meses} mês(es) de histórico no Wayback Machine "
            f"(primeiro registro: {month:02d}/{year})."
        )

    except Exception:
        return 0, ""
