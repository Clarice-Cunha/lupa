"""
Verificação de URLs na base de dados do VirusTotal.

O VirusTotal agrega resultados de 70+ mecanismos de segurança (antivírus,
ferramentas anti-phishing, detectores de malware). Se uma URL já foi
analisada por algum desses mecanismos, o resultado fica armazenado e pode
ser consultado gratuitamente.

Requer a variável de ambiente VIRUSTOTAL_API_KEY.
Chave gratuita: https://www.virustotal.com/gui/join-us
Limite do plano gratuito: 4 consultas por minuto.
"""

import base64
import os

import requests


def verificar_virustotal(url: str) -> tuple[int, str]:
    """Consulta a URL no VirusTotal e retorna (impacto, texto_resultado).

    - impacto: pontos a somar/subtrair da pontuação (0 se indisponível)
    - texto_resultado: frase legível para exibir ao usuário ("" se skip)
    """
    api_key = os.getenv("VIRUSTOTAL_API_KEY", "").strip()
    if not api_key:
        return 0, ""

    try:
        # O VirusTotal identifica cada URL por um ID = base64url(url) sem padding
        url_id = base64.urlsafe_b64encode(url.encode()).decode().rstrip("=")

        resp = requests.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers={"x-apikey": api_key},
            timeout=8,
        )

        if resp.status_code == 404:
            # URL nunca foi analisada antes — neutro, sem penalidade
            return 0, (
                "URL não encontrada no banco de dados do VirusTotal "
                "(ainda não analisada por mecanismos de segurança)."
            )

        if resp.status_code == 429:
            # Limite de requisições atingido — ignora silenciosamente
            return 0, ""

        if resp.status_code != 200:
            return 0, ""

        data = resp.json()
        stats = data["data"]["attributes"]["last_analysis_stats"]
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        harmless = stats.get("harmless", 0)
        total = malicious + suspicious + harmless + stats.get("undetected", 0)

        if malicious >= 5:
            return -30, (
                f"URL identificada como maliciosa por {malicious} de {total} "
                f"mecanismos de segurança no VirusTotal. Risco elevado de phishing ou malware."
            )
        if malicious >= 2:
            return -20, (
                f"{malicious} mecanismo(s) de segurança flagraram esta URL como "
                f"ameaça no VirusTotal (de {total} verificados)."
            )
        if malicious == 1:
            return -10, (
                f"Um mecanismo de segurança flagrou esta URL no VirusTotal. "
                f"Verifique com atenção ({total} mecanismos consultados)."
            )
        if suspicious >= 3:
            return -10, (
                f"{suspicious} mecanismo(s) marcaram esta URL como suspeita no VirusTotal."
            )
        if harmless > 0:
            return 5, (
                f"URL verificada por {total} mecanismos de segurança no VirusTotal "
                f"— nenhum identificou ameaças."
            )
        return 0, f"VirusTotal consultado: sem alertas detectados ({total} mecanismos)."

    except Exception:
        return 0, ""
