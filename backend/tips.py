"""
Geração de dicas personalizadas e fontes sugeridas.

Conforme o PRD §9, cada análise deve oferecer, além da pontuação,
um componente educacional: dicas ligadas aos sinais concretamente
detectados e sugestões de onde procurar fontes mais confiáveis.

Este módulo recebe a lista de `Justificativa` já produzida pelos
analisadores e escolhe, com base nos critérios negativos, quais
dicas e quais fontes são mais relevantes naquele caso.
"""

from __future__ import annotations

from analyzer import Justificativa


# ============================================================
# Catálogo de dicas (genéricas, mas ligadas a critérios concretos)
# ============================================================
#
# Cada chave é um "critério" usado nas justificativas. O valor é uma
# dica curta e acionável, escrita em linguagem simples.

DICAS_POR_CRITERIO: dict[str, str] = {
    "Uso de HTTPS": (
        "Sites sem HTTPS (aquele cadeado na barra do navegador) são "
        "mais arriscados. Evite fornecer dados pessoais em páginas assim."
    ),
    "Idade do domínio": (
        "Domínios muito novos (menos de 1 ano) merecem cautela — "
        "são comuns em sites criados às pressas para espalhar boatos."
    ),
    "Acesso à página": (
        "Se a página não abre ou o endereço não existe, desconfie. "
        "Boatos costumam circular como prints sem link verificável."
    ),
    "Indícios de clickbait": (
        "Títulos com 'chocante', 'você não vai acreditar' e similares "
        "são feitos para gerar cliques, não para informar. Leia o texto "
        "inteiro antes de formar opinião."
    ),
    "Uso de maiúsculas no título": (
        "TÍTULOS TOTALMENTE EM CAIXA ALTA soam como gritaria — é um "
        "truque para parecer mais urgente do que o conteúdo realmente é."
    ),
    "Informações institucionais": (
        "Fontes sérias mostram quem são: página 'Sobre', endereço, "
        "CNPJ, nomes de jornalistas. A ausência disso é um sinal de alerta."
    ),
    "Referências externas": (
        "Jornalismo sério cita fontes (estudos, documentos, outros veículos). "
        "Quando a matéria não aponta de onde tirou a informação, desconfie."
    ),
    "Sensacionalismo no texto": (
        "Textos que abusam de palavras como 'escândalo', 'absurdo', "
        "'bombástico' estão tentando gerar emoção, não explicar os fatos."
    ),
    "Excesso de pontos de exclamação": (
        "Muitos '!' seguidos indicam tom emocional, não informativo. "
        "Compare com a mesma notícia em veículos tradicionais."
    ),
    "Palavras em CAIXA ALTA no texto": (
        "Escrever em MAIÚSCULAS no corpo do texto equivale a gritar. "
        "Fontes confiáveis raramente precisam disso para chamar atenção."
    ),
    # YouTube
    "Idade do canal": (
        "Canais muito novos ou recém-criados merecem cautela, "
        "especialmente se já publicam conteúdo polêmico."
    ),
    "Inscritos no canal": (
        "Poucos inscritos não tornam o canal suspeito por si só, "
        "mas combine esse dado com o histórico e o tom do conteúdo."
    ),
    "Histórico de postagens": (
        "Canais com poucos vídeos e que aparecem de repente com "
        "conteúdo viral costumam ser oportunistas, não fontes estáveis."
    ),
    "Clickbait no título": (
        "Títulos sensacionalistas no YouTube existem para maximizar "
        "cliques. O vídeo real muitas vezes diz algo bem mais modesto."
    ),
    "Tamanho da descrição": (
        "Vídeos jornalísticos costumam trazer descrição com fontes, "
        "links e contexto. Descrições vazias são um sinal fraco de cuidado editorial."
    ),
    # Upload
    "Data de criação do arquivo": (
        "Vídeos sem data nos metadados podem ter sido editados ou "
        "reencodados para apagar a origem. Pergunte sempre: de onde veio este arquivo?"
    ),
    "Contexto informado pelo usuário": (
        "Quem envia um vídeo precisa saber de onde ele veio. Se você "
        "recebeu num grupo de WhatsApp sem fonte, essa é a primeira "
        "pergunta a fazer antes de compartilhar."
    ),
}

# Dicas "universais" — entram sempre que há pouco sinal negativo
# para sugerir (conteúdo neutro ou positivo). Manter o resultado
# sempre educacional, mesmo quando a pontuação é alta.
DICAS_UNIVERSAIS = [
    (
        "Mesmo em fontes confiáveis, checar uma segunda fonte sobre "
        "o mesmo fato é um hábito que vale ouro."
    ),
    (
        "Pontuação alta no LUPA não é garantia de verdade — é só "
        "um indício de que os sinais básicos estão em ordem."
    ),
]

LIMITE_DICAS = 3


def gerar_dicas_personalizadas(
    justificativas: list[Justificativa],
) -> list[str]:
    """Devolve até 3 dicas escolhidas a partir dos critérios negativos.

    Preferimos critérios que TIRARAM pontos — são os pontos fracos
    concretos da página. Se não houver pontos fracos suficientes,
    completamos com dicas universais.
    """
    dicas: list[str] = []
    ja_incluidas: set[str] = set()

    # 1) Primeiro, critérios que geraram penalidade
    for j in justificativas:
        if j.impacto < 0:
            dica = DICAS_POR_CRITERIO.get(j.criterio)
            if dica and dica not in ja_incluidas:
                dicas.append(dica)
                ja_incluidas.add(dica)
        if len(dicas) >= LIMITE_DICAS:
            return dicas

    # 2) Completa com dicas universais
    for dica in DICAS_UNIVERSAIS:
        if dica not in ja_incluidas:
            dicas.append(dica)
            ja_incluidas.add(dica)
        if len(dicas) >= LIMITE_DICAS:
            break

    return dicas


# ============================================================
# Fontes sugeridas por tema
# ============================================================
#
# Quando o usuário analisa algo suspeito, é útil apontar PARA ONDE
# ele pode ir em seguida. Aqui oferecemos uma pequena seleção de
# agências de checagem e veículos com padrão editorial conhecido.
# Esta lista espelha a página "Fontes Confiáveis" do frontend.

FONTES_GERAIS: list[dict] = [
    {
        "nome": "Aos Fatos",
        "url": "https://www.aosfatos.org",
        "descricao": "Checagem de declarações políticas e boatos virais.",
    },
    {
        "nome": "Agência Lupa",
        "url": "https://lupa.uol.com.br",
        "descricao": "Primeira agência de fact-checking do Brasil.",
    },
    {
        "nome": "Projeto Comprova",
        "url": "https://projetocomprova.com.br",
        "descricao": "Coalizão de veículos que checa informações em eleições.",
    },
    {
        "nome": "Boatos.org",
        "url": "https://www.boatos.org",
        "descricao": "Banco de boatos e correntes de WhatsApp desmentidos.",
    },
]


def sugerir_fontes(pontuacao: int) -> list[dict]:
    """Sugere fontes de checagem — mais sugestões quando a pontuação é baixa.

    A ideia: se a análise foi bem, basta lembrar 2 fontes. Se foi mal,
    oferecemos um leque maior para que o usuário compare.
    """
    if pontuacao <= 30:
        return FONTES_GERAIS[:4]
    if pontuacao <= 70:
        return FONTES_GERAIS[:3]
    return FONTES_GERAIS[:2]
