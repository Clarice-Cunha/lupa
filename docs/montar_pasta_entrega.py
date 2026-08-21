"""Monta a pasta de entrega da Etapa Regional, pronta para subir ao Drive.

Dois públicos, dois arquivos — e essa separação é o motivo deste script existir:

  - O LEIA-ME.txt de cada subpasta sobe para o Drive e é lido por quem avalia.
    Ele descreve o que está ali, e nada além disso: sem pontuação, sem menção
    a critérios de avaliação, sem lista do que ainda falta.
  - O CHECKLIST fica FORA do repositório e é da equipe. É nele que ficam as
    pendências e as conferências antes do envio.

O LEIA-ME é montado a partir dos arquivos que de fato existem na pasta depois
da cópia. Isso não é detalhe de implementação: é o que impede o texto de
prometer um arquivo que não está lá ou de anunciar o que falta. Um documento
que só consegue descrever a realidade não tem como vazar bastidor.

A pasta é criada fora do repositório, para não virar parte do código. Rodar de
novo é seguro: os arquivos são sobrescritos e os que você acrescentou à mão
são preservados.

Uso (a partir da raiz do projeto):
    python docs/montar_pasta_entrega.py
"""

import shutil
import textwrap
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "docs"
PASTA_MAE = Path.home() / "OneDrive" / "Ernesto"
DESTINO = PASTA_MAE / "LUPA — HackaNAV 2026 — Etapa Regional"

# Fica ao lado da pasta de entrega, não dentro dela — e fora do repositório,
# que é público desde 16/08/2026.
CHECKLIST = PASTA_MAE / "CHECKLIST — entrega HackaNAV 2026.txt"

REPOSITORIO = "https://github.com/Clarice-Cunha/lupa"

LARGURA = 66  # largura do texto dos LEIA-ME, confortável no Bloco de Notas

# ---------------------------------------------------------------------------
# Descrição de cada arquivo, na ordem em que deve aparecer no LEIA-ME.
# Esses textos são lidos por quem avalia: descrevem o arquivo, sem adjetivo
# sobre o próprio trabalho e sem referência a critérios de pontuação.
# ---------------------------------------------------------------------------
DESCRICOES: dict[str, str] = {
    # 01
    "COMO_LER_O_CODIGO.pdf": (
        "Guia de leitura do código em linguagem para quem não programa. "
        "Explica o que cada arquivo faz e onde conferir cada afirmação feita "
        "no vídeo e na apresentação. É por onde começar."
    ),
    "CODIGO_BACKEND.pdf": (
        "Os dez módulos de análise, escritos em Python, com sumário e "
        "destaque de sintaxe."
    ),
    "CODIGO_FRONTEND.pdf": (
        "A estrutura das páginas do site e três arquivos representativos "
        "da interface."
    ),
    "link-repositorio-github.txt": (
        "Endereço do repositório, com o histórico completo de alterações e "
        "os arquivos originais, executáveis."
    ),
    # 04
    "DIARIO_DE_BORDO.pdf": (
        "Quarenta e dois marcos datados do desenvolvimento. Cada um traz "
        "uma descrição em linguagem comum e uma nota técnica."
    ),
    "FLUXOGRAMAS.pdf": (
        "Seis fluxogramas, um por página: o caminho de uma análise, as "
        "cinco camadas de verificação, a evolução do protótipo e o método "
        "de seleção das fontes."
    ),
    "P1-lovable-tela-inicial.png": (
        "Etapa P1 — a primeira tela do protótipo, feita no Lovable em "
        "março de 2026."
    ),
    "P2-01-analisador.png": "Etapa P2 — a tela de análise de links.",
    "P2-02-jogos.png": "Etapa P2 — os jogos educativos.",
    "P2-03-modo-professor.png": "Etapa P2 — o modo professor, com salas ao vivo.",
    "P2-04-pesquisa-e-dados.png": "Etapa P2 — a página de pesquisa e referências.",
    "P2-05-evolucao.png": "Etapa P2 — a linha do tempo do projeto.",
    "P2-06-biblioteca.png": "Etapa P2 — a biblioteca de conteúdo educativo.",
    "P2-07-Análise.png": (
        "Etapa P2 — o resultado de uma análise real, com a pontuação e as "
        "justificativas que a produziram."
    ),
    "P2-08-Referências.png": "Etapa P2 — a lista de referências do projeto.",
    "P2-09-Colaborações.png": "Etapa P2 — o canal aberto para contribuições.",
    "Foto 2 - Rascunhos do desenvolvimento do LUPA.JPG": (
        "Rascunhos feitos à mão durante o desenvolvimento."
    ),
    "Foto 4 - Equipe CB.jpeg": "Os três integrantes da equipe.",
    "P2-07-resultado-de-analise.png": (
        "Etapa P2 — o resultado de uma análise real, com a pontuação e as "
        "justificativas que a produziram."
    ),
    "PRD-original.pdf": (
        "O documento de requisitos escrito antes da primeira linha de "
        "código, em abril de 2026."
    ),
    # 05
    "REFERENCIAS_ABNT.pdf": (
        "Quinze fontes em seis formatos, segundo a ABNT NBR 6023. Cada uma "
        "traz uma nota indicando em que parte do LUPA foi usada."
    ),
    # 06
    "FICHA_TECNICA.pdf": (
        "Quem fez o quê, que inteligência artificial o LUPA usa, que "
        "serviços externos são consultados, de onde vem o conteúdo "
        "educativo, como os dados são tratados, os termos de uso e os "
        "limites assumidos pelo projeto."
    ),
    "DOCUMENTO_TECNICO.pdf": (
        "A documentação técnica: arquitetura, decisões de projeto e "
        "funcionamento de cada componente."
    ),
    # 07
    "APRESENTACAO_REGIONAL_LUPA.pptx": (
        "Os slides da apresentação ao vivo, no modelo oficial do evento."
    ),
    "APRESENTACAO_REGIONAL_LUPA.pdf": (
        "Os mesmos slides em PDF, para leitura sem PowerPoint."
    ),
    "ANEXO_II_CONTEUDO.pdf": (
        "O conteúdo de cada campo do Anexo II, em texto corrido."
    ),
    # 02 e 03 — nomes propostos; arquivos com outros nomes entram assim mesmo
    "video-oficial-etapa-escolar.mp4": (
        "O vídeo de apresentação do projeto, o mesmo enviado na Etapa Escolar."
    ),
    "demonstracao-analise-de-link.mp4": (
        "Gravação de tela de uma análise completa: o link colado, a espera, "
        "a pontuação e as justificativas."
    ),
    "demonstracao-modo-professor.mp4": (
        "Gravação da criação de uma sala e da participação de um aluno "
        "pelo celular."
    ),
    "legendas-das-fotos.pdf": (
        "Quem aparece em cada foto, em que data e o que estava fazendo."
    ),
    "Foto 1 - Criança jogando no LUPA.jpeg": (
        "Uma criança de fora da equipe usando os jogos do LUPA por conta "
        "própria, em agosto de 2026."
    ),
}

# ---------------------------------------------------------------------------
# subpasta -> (arquivos a copiar de docs/, resumo para o LEIA-ME, pendências)
#
# O resumo é lido por quem avalia. As pendências são da equipe e vão para o
# CHECKLIST, fora da pasta.
# ---------------------------------------------------------------------------
ESTRUTURA: dict[str, tuple[list[str], str, str]] = {
    "01-CODIGO-FONTE": (
        ["COMO_LER_O_CODIGO.pdf", "CODIGO_BACKEND.pdf", "CODIGO_FRONTEND.pdf"],
        "O código-fonte do LUPA, convertido para PDF conforme o regulamento, "
        "acompanhado de um guia que permite acompanhar a leitura sem saber "
        "programar. O repositório traz os arquivos originais.",
        "",
    ),
    "02-VIDEOS": (
        [],
        "O vídeo de apresentação do projeto e as gravações de tela que "
        "mostram o LUPA em funcionamento.",
        """[ ] video-oficial-etapa-escolar.mp4
    Baixar do Portal Nave a Vela. É o mesmo vídeo da fase anterior e
    será exibido durante a live: tudo que aparece nele precisa ter
    arquivo correspondente na pasta.

[ ] demonstracao-analise-de-link.mp4
    Gravação de tela de 60 a 90 segundos, sem edição: colar o link,
    esperar a análise, mostrar a nota e as justificativas.

[ ] demonstracao-modo-professor.mp4
    Criar sala, entrar pelo celular, responder. É a funcionalidade
    mais difícil de acreditar sem ver.""",
    ),
    "03-FOTOS-DO-PROCESSO": (
        [],
        "Registros do desenvolvimento e do uso do LUPA por pessoas de fora "
        "da equipe.",
        """[ ] Fotos da equipe desenvolvendo o projeto
[ ] Foto da apresentação na feira da escola, se alguém tirou

[ ] legendas-das-fotos.pdf
    Uma linha por foto: quem aparece, idade, data e o que fazia. Foto
    sem legenda não comprova nada, e é a legenda que liga a imagem ao
    marco correspondente do diário de bordo.

[ ] Autorização de imagem de quem não é da equipe
    O termo do Anexo I cobre os três integrantes. Quem aparece nas
    fotos sem ser da equipe, ainda mais sendo menor de idade, precisa
    de autorização dos responsáveis.""",
    ),
    "04-EVOLUCAO-DO-PROTOTIPO": (
        [
            "DIARIO_DE_BORDO.pdf",
            "FLUXOGRAMAS.pdf",
            "imagens/site/P2-01-analisador.png",
            "imagens/site/P2-02-jogos.png",
            "imagens/site/P2-03-modo-professor.png",
            "imagens/site/P2-04-pesquisa-e-dados.png",
            "imagens/site/P2-05-evolucao.png",
            "imagens/site/P2-06-biblioteca.png",
            # Ainda não está em docs/. Enquanto não estiver, o script avisa no
            # fim da execução — é o lembrete de que falta buscar o arquivo.
            "PRD-original.pdf",
        ],
        "O caminho do projeto desde o primeiro protótipo até o site atual: o "
        "diário datado, os fluxogramas do funcionamento e as capturas de tela "
        "das duas etapas, P1 e P2.",
        """[ ] P2-07-resultado-de-analise.png
    A tela de resultado de uma análise real, com a nota e as
    justificativas. Precisa ser capturada à mão, com o servidor de
    análise no ar — é a tela que prova que o protótipo funciona.

[ ] PRD-original.pdf
    O documento de requisitos escrito antes de qualquer código, de
    07/04/2026. Não está neste computador — pedir à Clarice ou buscar
    no Drive da equipe. Salvar em docs/PRD-original.pdf e rodar o
    script de novo; a cópia é automática.""",
    ),
    "05-REFERENCIAS": (
        ["REFERENCIAS_ABNT.pdf"],
        "As fontes que fundamentaram o projeto, em ABNT NBR 6023, com a "
        "indicação de como cada uma foi usada.",
        """O mesmo conteúdo aparece em três lugares: este PDF, o Anexo II e o
slide de referências. Os três são gerados a partir da página /pesquisa
do site, então não podem divergir. Se mudar um, regere os outros.""",
    ),
    "06-DOCUMENTOS": (
        ["FICHA_TECNICA.pdf", "DOCUMENTO_TECNICO.pdf"],
        "A documentação do projeto: quem fez o quê, que tecnologias são "
        "usadas, como os dados são tratados e que limites o LUPA assume.",
        """A ficha técnica responde a um pedido nominal de um avaliador da fase
anterior: quem fez o quê, que IA é usada e de onde vem o conteúdo
educativo.

NÃO colocar aqui o guia_tecnico_LUPA.docx nem o guia de combate à
desinformação. Os dois são material de estudo da equipe e trazem
respostas prontas para perguntas da avaliação — entregá-los seria
mostrar o roteiro antes da pergunta.""",
    ),
    "07-APRESENTACAO": (
        [
            "APRESENTACAO_REGIONAL_LUPA.pptx",
            "APRESENTACAO_REGIONAL_LUPA.pdf",
            "ANEXO_II_CONTEUDO.pdf",
        ],
        "Os slides da apresentação ao vivo e o conteúdo do Anexo II.",
        """[ ] Inserir o vídeo da etapa anterior no slide 6
    Pelo menu Inserir > Vídeo, colando a URL. Não dá para fazer por
    script.

[ ] Conferir o nome dos integrantes com o professor Hector antes do
    envio, para que a apresentação e o Portal digam a mesma coisa.

O ANEXO_II_CONTEUDO.pdf não é o Anexo II. O Anexo II é preenchido no
template oficial do regulamento e enviado em PDF pelo Portal. Este
arquivo é só o texto pronto, para não haver retrabalho.""",
    ),
}

RESUMO_RAIZ = """PASTA DE ENTREGA — HackaNAV 2026, Etapa Regional
Equipe CB · Complexo Educacional Contemporâneo Lagoa Nova · Natal/RN
Projeto Ecossistema LUPA — Leitor de URLs, Plataformas e Audiovisuais

================================================================
COMO ESTA PASTA ESTÁ ORGANIZADA

  01-CODIGO-FONTE ............ como o LUPA foi construído
  02-VIDEOS .................. o vídeo do projeto e as demonstrações
  03-FOTOS-DO-PROCESSO ....... registros de quem fez e de quem usou
  04-EVOLUCAO-DO-PROTOTIPO ... o caminho da ideia até o site atual
  05-REFERENCIAS ............. a fundamentação teórica, em ABNT
  06-DOCUMENTOS .............. documentação técnica e ficha técnica
  07-APRESENTACAO ............ os slides da live e o Anexo II

Cada subpasta tem um LEIA-ME.txt descrevendo os arquivos que estão
nela.

================================================================
O LUPA é um site que analisa links, textos, vídeos e imagens e devolve
uma pontuação de confiabilidade de 0 a 100, sempre acompanhada das
justificativas que produziram aquela nota. O projeto não afirma
verdade absoluta: ele é apoio à checagem e ao pensamento crítico.

Endereço do site: https://lupa-clarice-cunha-s-projects.vercel.app
"""

CONFERENCIAS_FINAIS = """[ ] A pasta abre em janela anônima, sem estar logado no Google
[ ] A pasta foi compartilhada com projetos@naveavela.com.br
[ ] O vídeo foi inserido no slide 6 da apresentação
[ ] O Anexo II foi preenchido e salvo em PDF
[ ] Quem envia é a capitã, pelo Portal Nave a Vela

O regulamento pede DUAS configurações de permissão, não uma:
visualização para "qualquer pessoa com o link" E compartilhamento
direto com projetos@naveavela.com.br. Fazer só a primeira é o engano
mais comum.

Prazo de envio: 17 a 20 de agosto de 2026
Lives de apresentação: 24 a 28 de agosto de 2026

================================================================
JÁ RESOLVIDO EM 16/08/2026 — não precisa refazer

  [x] Repositório do GitHub tornado público
  [x] Senha de acesso ao site removida (o site abre para qualquer um)
  [x] Chave do painel de moderação trocada no Render. A antiga estava
      escrita no código e virou pública junto com o repositório.
  [x] Formulário do painel passou a conferir a senha no servidor.
      Antes ele só verificava se o campo não estava vazio.
"""


def ordenar(nomes: list[str]) -> list[str]:
    """Ordena pela sequência de DESCRICOES; o que não está lá vai para o fim.

    Assim o LEIA-ME abre pelo arquivo por onde se deve começar, e não pela
    ordem alfabética, que colocaria o guia de leitura no meio da lista.
    """
    ordem = list(DESCRICOES)
    conhecidos = [n for n in ordem if n in nomes]
    outros = sorted(n for n in nomes if n not in DESCRICOES)
    return conhecidos + outros


def bloco_do_arquivo(nome: str) -> str:
    descricao = DESCRICOES.get(nome, "")
    if not descricao:
        return f"  {nome}\n"
    corpo = textwrap.fill(
        descricao, width=LARGURA, initial_indent="      ", subsequent_indent="      "
    )
    return f"  {nome}\n{corpo}\n"


def escrever_leia_me(pasta: Path, subpasta: str, resumo: str) -> None:
    """Escreve o LEIA-ME a partir do que existe na pasta neste momento."""
    presentes = [
        item.name
        for item in pasta.iterdir()
        if item.is_file() and item.name != "LEIA-ME.txt"
    ]

    destino = pasta / "LEIA-ME.txt"
    if not presentes:
        # O resumo descreve o que a pasta deveria conter. Numa pasta vazia
        # isso vira promessa: quem abre o LEIA-ME nao encontra o que ele diz.
        destino.unlink(missing_ok=True)
        print(f"  ATENCAO: {subpasta} esta vazia — LEIA-ME removido")
        return

    partes = [subpasta, "=" * len(subpasta), "", textwrap.fill(resumo, width=LARGURA), ""]
    partes += [bloco_do_arquivo(nome) for nome in ordenar(presentes)]
    destino.write_text("\n".join(partes), encoding="utf-8-sig")


def escrever_checklist() -> None:
    """Junta as pendências num arquivo só, fora da pasta de entrega."""
    partes = [
        "CHECKLIST DA EQUIPE — entrega da Etapa Regional",
        "=" * 47,
        "",
        "Este arquivo é da equipe. Ele fica FORA da pasta de entrega e fora",
        "do repositório, que é público. Nada daqui deve ser copiado para",
        "dentro do Drive.",
        "",
    ]
    for subpasta, (_, _, pendencias) in ESTRUTURA.items():
        if not pendencias:
            continue
        partes += ["=" * 64, subpasta, "", pendencias, ""]
    partes += ["=" * 64, "ANTES DE ENVIAR", "", CONFERENCIAS_FINAIS]

    CHECKLIST.write_text("\n".join(partes), encoding="utf-8-sig")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)

    copiados = 0
    ausentes: list[str] = []

    # 1. Copiar tudo primeiro. O LEIA-ME só pode ser escrito depois, porque
    #    ele descreve o que encontrar na pasta.
    for subpasta, (arquivos, _, _) in ESTRUTURA.items():
        pasta = DESTINO / subpasta
        pasta.mkdir(exist_ok=True)
        for nome in arquivos:
            origem = DOCS / nome
            if not origem.exists():
                ausentes.append(nome)
                continue
            # O nome pode vir com subpasta (imagens/site/...), mas o destino
            # é sempre direto dentro da subpasta da entrega
            shutil.copy2(origem, pasta / origem.name)
            copiados += 1

    (DESTINO / "01-CODIGO-FONTE" / "link-repositorio-github.txt").write_text(
        f"{REPOSITORIO}\n", encoding="utf-8-sig"
    )

    # 2. Agora sim os LEIA-ME, a partir do conteúdo real de cada pasta
    (DESTINO / "LEIA-ME.txt").write_text(RESUMO_RAIZ, encoding="utf-8-sig")
    for subpasta, (_, resumo, _) in ESTRUTURA.items():
        escrever_leia_me(DESTINO / subpasta, subpasta, resumo)

    escrever_checklist()

    print(f"Pasta montada em:\n  {DESTINO}\n")
    print(f"Arquivos copiados: {copiados}")
    print(f"LEIA-ME escritos: {len(ESTRUTURA) + 1}")
    print(f"Checklist da equipe:\n  {CHECKLIST}")
    if ausentes:
        print("\nNao encontrados em docs/ (rode antes gerar_pdfs.ps1):")
        for nome in ausentes:
            print(f"  - {nome}")


if __name__ == "__main__":
    main()
