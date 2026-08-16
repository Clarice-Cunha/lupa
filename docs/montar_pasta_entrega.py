"""Monta a pasta de entrega da Etapa Regional, pronta para subir ao Drive.

Cria a estrutura de subpastas, copia para dentro dela tudo que já está pronto e
escreve um LEIA-ME.txt em cada uma dizendo o que tem e o que ainda falta.

A pasta é criada FORA do repositório, para não virar parte do código. Rodar de
novo é seguro: os arquivos são sobrescritos, então basta repetir o comando
depois de regerar os PDFs.

Uso (a partir da raiz do projeto):
    python docs/montar_pasta_entrega.py
"""

import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "docs"
DESTINO = Path.home() / "OneDrive" / "Ernesto" / "LUPA — HackaNAV 2026 — Etapa Regional"

REPOSITORIO = "https://github.com/Clarice-Cunha/lupa"

# subpasta -> (o que copiar de docs/, texto do LEIA-ME)
ESTRUTURA: dict[str, tuple[list[str], str]] = {
    "01-CODIGO-FONTE": (
        ["COMO_LER_O_CODIGO.pdf"],
        """JÁ ESTÁ AQUI
  COMO_LER_O_CODIGO.pdf ...... guia de leitura do código, em linguagem
                               para quem não programa
  link-repositorio-github.txt  endereço do repositório

AINDA FALTA
  [ ] backend-modulos-principais.pdf
      Imprimir em PDF os arquivos analyzer.py, fact_check.py,
      youtube_analyzer.py, image_analyzer.py e text_analyzer.py.
      O regulamento exige converter para PDF o que não é PDF, DOCX,
      TXT, JPG ou PNG — arquivo .py solto pode não abrir para o jurado.

  [ ] frontend-estrutura.pdf
      Árvore de páginas do Next.js e um componente comentado.

ATENÇÃO — O REPOSITÓRIO ESTÁ PRIVADO
  Hoje o link do GitHub não abre para quem está de fora. É o mesmo
  tipo de problema da senha do site na fase passada.
  Duas saídas: tornar o repositório público (não há nenhuma chave de
  API no histórico, isso foi conferido) ou tirar o link daqui e
  deixar só os PDFs do código.
""",
    ),
    "02-VIDEOS": (
        [],
        """AINDA FALTA (nada aqui ainda)
  [ ] video-oficial-etapa-escolar.mp4
      O mesmo vídeo enviado na fase anterior. Baixar do Portal Nave a
      Vela. Ele será exibido durante a live e é a base dos 50 pontos
      de correspondência: tudo que aparece nele precisa ter arquivo
      correspondente nesta pasta.

  [ ] demonstracao-analise-de-link.mp4
      Gravação de tela de 60 a 90 segundos: colar um link, esperar a
      análise, mostrar a nota e as justificativas. Sem edição.

  [ ] demonstracao-modo-professor.mp4
      Criar sala, entrar pelo celular, responder. É a funcionalidade
      mais difícil de acreditar sem ver.
""",
    ),
    "03-FOTOS-DO-PROCESSO": (
        [],
        """AINDA FALTA (nada aqui ainda)
  [ ] A foto da criança jogando o Agente LUPA
      É a peça mais valiosa desta pasta. O indicador "envolveu alguém
      da sociedade fora da escola" tirou 60 de 100 — a pior nota do
      relatório. Uma foto de alguém usando o LUPA por conta própria
      vale mais que qualquer parágrafo.

  [ ] Fotos da equipe desenvolvendo
  [ ] Foto da apresentação na feira da escola, se alguém tirou

  [ ] legendas-das-fotos.pdf
      Uma linha por foto: quem aparece, idade, data e o que estava
      fazendo. Foto sem legenda não comprova nada.

  [ ] Autorização de imagem de quem não é da equipe
      O termo do Anexo I cobre os três integrantes. Quem aparece nas
      fotos sem ser da equipe, ainda mais sendo menor de idade,
      precisa de autorização dos responsáveis.

DICA DE NOME DE ARQUIVO
  Use data no nome: 02-crianca-jogando-lupa-08-2026.jpg
  É o que permite ao jurado casar a foto com o marco correspondente
  no diário de bordo — exatamente o que os 50 pontos medem.
""",
    ),
    "04-EVOLUCAO-DO-PROTOTIPO": (
        ["DIARIO_DE_BORDO.pdf", "FLUXOGRAMAS.pdf"],
        """JÁ ESTÁ AQUI
  DIARIO_DE_BORDO.pdf ........ 42 marcos datados, cada um com uma
                               versão para leigos e uma nota técnica.
                               Inclui o marco do falso positivo do
                               IFCN, que é a história contada na live.
  FLUXOGRAMAS.pdf ............ 6 fluxogramas, um por página

AINDA FALTA
  [ ] P1-lovable-tela-inicial.png
      A captura do primeiro protótipo. A equipe já tem esse arquivo.

  [ ] P2-versao-atual-*.png
      Quatro ou cinco telas do site de hoje: analisador, resultado com
      nota, jogos, modo professor. Enquadramento parecido com o da P1,
      para a comparação ficar óbvia.

  [ ] PRD-original.pdf
      O documento de requisitos escrito antes de qualquer código.
      Comprova que houve planejamento, não improviso.

VALE 25 PONTOS
  "Há evidências de que a solução evoluiu desde a ideia inicial até o
  protótipo." O diário de bordo com 42 marcos é o arquivo mais forte
  da pasta inteira para esse critério.
""",
    ),
    "05-REFERENCIAS": (
        ["REFERENCIAS_ABNT.pdf"],
        """JÁ ESTÁ AQUI
  REFERENCIAS_ABNT.pdf ....... 15 fontes em 6 formatos diferentes,
                               em ABNT NBR 6023, com todos os links
                               conferidos em 16/08/2026

NADA FALTA AQUI

VALE 50 PONTOS, EM DOIS CRITÉRIOS
  25 pts - "As referências realmente ajudam a explicar o problema ou
           embasar a solução." Cada uma traz a nota "Como foi usada",
           ligando a fonte a uma parte concreta do LUPA. A maioria das
           equipes entrega lista; vocês entregam vínculo.

  25 pts - "A equipe buscou informações em diferentes formatos."
           São 6: artigo científico, relatório institucional, manual
           técnico, e-book, vídeo e material educativo. Isso está
           escrito logo na primeira página do PDF, para o jurado não
           precisar procurar.

O MESMO CONTEÚDO VAI EM TRÊS LUGARES
  Este PDF, o Anexo II e o slide de referências. Os três são gerados
  a partir da página /pesquisa do site, então não podem divergir.
""",
    ),
    "06-DOCUMENTOS": (
        ["DOCUMENTO_TECNICO.pdf", "guia_tecnico_LUPA.docx"],
        """JÁ ESTÁ AQUI
  DOCUMENTO_TECNICO.pdf ...... documentação técnica do projeto
  guia_tecnico_LUPA.docx ..... guia técnico

AINDA FALTA
  [ ] ficha-tecnica.pdf
      Imprimir a página /ficha-tecnica do site em PDF. Traz os papéis
      de cada integrante, que IA o LUPA usa, os serviços externos
      consultados, a política de dados e os limites assumidos.
      Foi pedido nominal de um dos avaliadores na fase anterior.
""",
    ),
    "07-APRESENTACAO": (
        ["APRESENTACAO_REGIONAL_LUPA.pptx", "ANEXO_II_CONTEUDO.pdf"],
        """JÁ ESTÁ AQUI
  APRESENTACAO_REGIONAL_LUPA.pptx  montada no template oficial
  ANEXO_II_CONTEUDO.pdf ........... o texto de cada campo do Anexo II,
                                    pronto para copiar

AINDA FALTA
  [ ] Inserir o vídeo da etapa anterior no slide 6
      Pelo menu Inserir > Vídeo, colando a URL do YouTube ou do Drive.
      Isso não dá para fazer por script.

  [ ] Conferir o nome do terceiro integrante
      O Portal registra Miguel Cavalcanti Filgueira; a apresentação
      está com Pedro Moreno de Lima Bessa, que é quem vai falar na
      live. Resolver com o professor Hector antes do envio.

SOBRE O ANEXO II
  O ANEXO_II_CONTEUDO.pdf não é o Anexo II. O Anexo II é preenchido
  no template oficial do regulamento e enviado em PDF pelo Portal.
  Este arquivo é só o texto pronto, para não haver retrabalho.
""",
    ),
}

LEIA_ME_RAIZ = """PASTA DE ENTREGA — HackaNAV 2026, Etapa Regional
Equipe CB · Complexo Educacional Contemporâneo Lagoa Nova · Natal/RN
Projeto LUPA — Leitor de URLs, Plataformas e Audiovisuais

================================================================
COMO ESTA PASTA ESTÁ ORGANIZADA

  01-CODIGO-FONTE ............ como o LUPA foi construído
  02-VIDEOS .................. o vídeo oficial e as demonstrações
  03-FOTOS-DO-PROCESSO ....... registros de quem fez e de quem usou
  04-EVOLUCAO-DO-PROTOTIPO ... o caminho da ideia até o site atual
  05-REFERENCIAS ............. a fundamentação teórica, em ABNT
  06-DOCUMENTOS .............. documentação técnica e ficha técnica
  07-APRESENTACAO ............ os slides da live e o Anexo II

Cada subpasta tem um LEIA-ME.txt dizendo o que já está lá e o que
ainda falta.

================================================================
ANTES DE ENVIAR — CONFERIR

  [ ] A pasta abre em janela anônima, sem estar logado no Google
  [ ] A pasta foi compartilhada com projetos@naveavela.com.br
  [ ] A senha do site foi liberada
  [ ] O repositório do GitHub está público (ou o link foi removido)
  [ ] O nome do terceiro integrante está correto no Portal
  [ ] O vídeo foi inserido no slide 6 da apresentação
  [ ] O Anexo II foi preenchido e salvo em PDF
  [ ] Quem envia é a capitã, pelo Portal Nave a Vela

O regulamento pede DUAS configurações de permissão, não uma:
visualização para "qualquer pessoa com o link" E compartilhamento
direto com projetos@naveavela.com.br. Fazer só a primeira é o
engano mais comum.

================================================================
Prazo de envio: 17 a 20 de agosto de 2026
Lives de apresentação: 24 a 28 de agosto de 2026
"""


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    (DESTINO / "LEIA-ME.txt").write_text(LEIA_ME_RAIZ, encoding="utf-8-sig")

    copiados = 0
    ausentes: list[str] = []

    for subpasta, (arquivos, leia_me) in ESTRUTURA.items():
        pasta = DESTINO / subpasta
        pasta.mkdir(exist_ok=True)
        pasta_txt = f"{subpasta}\n{'=' * len(subpasta)}\n\n{leia_me}"
        (pasta / "LEIA-ME.txt").write_text(pasta_txt, encoding="utf-8-sig")

        for nome in arquivos:
            origem = DOCS / nome
            if not origem.exists():
                ausentes.append(nome)
                continue
            shutil.copy2(origem, pasta / nome)
            copiados += 1

    # O link do repositório é um arquivo de uma linha só
    (DESTINO / "01-CODIGO-FONTE" / "link-repositorio-github.txt").write_text(
        f"{REPOSITORIO}\n", encoding="utf-8-sig"
    )

    print(f"Pasta montada em:\n  {DESTINO}\n")
    print(f"Arquivos copiados: {copiados}")
    print(f"LEIA-ME escritos: {len(ESTRUTURA) + 1}")
    if ausentes:
        print("\nNao encontrados em docs/ (rode antes gerar_pdfs.ps1):")
        for nome in ausentes:
            print(f"  - {nome}")


if __name__ == "__main__":
    main()
