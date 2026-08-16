"""Gera os PDFs do código-fonte para a pasta de entrega.

O regulamento pede que arquivos que não sejam PDF, DOCX, TXT, JPG ou PNG
sejam convertidos — um arquivo .py solto pode simplesmente não abrir para o
jurado. Este script junta os módulos em dois PDFs com sumário, numeração e
destaque de sintaxe.

Uso (a partir da raiz do projeto):
    python docs/gerar_codigo_pdf.py
"""

import subprocess
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "docs"

# arquivo -> o que ele faz, em uma linha
BACKEND: dict[str, str] = {
    "analyzer.py": "O coração do projeto: recebe um endereço e devolve a nota "
                   "com as justificativas. A pontuação começa em 50 e cada "
                   "verificação soma ou subtrai.",
    "fact_check.py": "Consulta ao banco de checagens da rede IFCN. Contém a "
                     "função filtrar_relevantes(), criada em 01/05/2026 para "
                     "corrigir o falso positivo em portais de notícia.",
    "text_analyzer.py": "Análise de texto colado — mensagem de WhatsApp, "
                        "e-mail em cadeia, post copiado.",
    "image_analyzer.py": "Leitura dos metadados escondidos em fotos e análise "
                         "forense de manipulação.",
    "youtube_analyzer.py": "Dados do próprio vídeo do YouTube: canal, data, "
                           "visualizações e transcrição.",
    "upload_analyzer.py": "Vídeos enviados do computador. O arquivo é apagado "
                          "logo após a análise.",
    "virustotal.py": "Cruza o endereço com mecanismos antivírus e bases de "
                     "phishing.",
    "wayback.py": "Histórico público da página no Internet Archive.",
    "web_search.py": "Busca na web para complementar a checagem.",
    "main.py": "A porta de entrada: lista todos os endereços que o site pode "
               "consultar e o limite de requisições por hora.",
}

FRONTEND: dict[str, str] = {
    "middleware.ts": "Controle de acesso ao site durante o desenvolvimento.",
    "app/_components/Navegacao.tsx": "O menu do site, com os grupos de páginas "
                                     "e a versão para celular.",
    "app/_components/Rodape.tsx": "O rodapé e seus links.",
}

CABECALHO_TEX = r"""
\usepackage{fvextra}
\DefineVerbatimEnvironment{Highlighting}{Verbatim}{%
  breaklines,breakanywhere,commandchars=\\\{\},fontsize=\scriptsize}
"""


def arvore_do_frontend() -> str:
    """Lista as páginas do site a partir das pastas de rotas do Next.js."""
    base = RAIZ / "frontend" / "app"
    linhas = []
    for pasta in sorted(p for p in base.iterdir() if p.is_dir()):
        if pasta.name.startswith("_"):
            continue
        rota = "/" if pasta.name == "page" else f"/{pasta.name}"
        filhas = sorted(
            f"/{pasta.name}/{sub.name}"
            for sub in pasta.iterdir()
            if sub.is_dir() and not sub.name.startswith("_")
        )
        linhas.append(f"  {rota}")
        linhas.extend(f"    {f}" for f in filhas)
    return "\n".join(linhas)


def montar_markdown(titulo: str, subtitulo: str, intro: str,
                    arquivos: dict[str, str], base: Path,
                    extra: str = "") -> str:
    partes = [
        "---\n",
        f'title: "{titulo}"\n',
        f'subtitle: "{subtitulo}"\n',
        'date: "Agosto de 2026"\n',
        "lang: pt-BR\n",
        "---\n\n",
        f"{intro}\n\n",
    ]
    if extra:
        partes.append(f"{extra}\n\n")
    partes.append("---\n")

    for nome, descricao in arquivos.items():
        caminho = base / nome
        if not caminho.exists():
            print(f"  aviso: {nome} nao encontrado")
            continue
        codigo = caminho.read_text(encoding="utf-8")
        linguagem = "python" if caminho.suffix == ".py" else "typescript"
        partes.append(f"\n# {nome}\n\n{descricao}\n\n")
        partes.append(f"```{linguagem}\n{codigo}\n```\n")

    return "".join(partes)


def converter(markdown: str, nome_pdf: str) -> None:
    with tempfile.TemporaryDirectory() as pasta:
        origem = Path(pasta) / "codigo.md"
        origem.write_text(markdown, encoding="utf-8")
        cabecalho = Path(pasta) / "cabecalho.tex"
        cabecalho.write_text(CABECALHO_TEX, encoding="utf-8")
        tex = DOCS / f"{nome_pdf}.tex"

        subprocess.run(
            [
                "pandoc", str(origem), "-o", str(tex),
                "--standalone", "--toc", "--toc-depth=1",
                "-H", str(cabecalho),
                "-V", "geometry:margin=1.8cm",
                "-V", "documentclass=article",
                "-V", "colorlinks=true",
                "-V", "lang=pt-BR",
            ],
            check=True, capture_output=True,
        )

    for _ in range(2):  # a segunda passagem resolve o sumário
        subprocess.run(
            ["xelatex", "-interaction=nonstopmode", f"{nome_pdf}.tex"],
            cwd=str(DOCS), capture_output=True,
        )

    for sufixo in (".aux", ".log", ".toc", ".out", ".tex"):
        auxiliar = DOCS / f"{nome_pdf}{sufixo}"
        auxiliar.unlink(missing_ok=True)

    pdf = DOCS / f"{nome_pdf}.pdf"
    print(f"  {pdf.name}: {pdf.stat().st_size / 1024:,.0f} KB")


def main() -> None:
    print("Gerando CODIGO_BACKEND.pdf...")
    converter(
        montar_markdown(
            "Código-fonte do LUPA — servidor",
            "Módulos de análise, em Python — HackaNAV 2026, Etapa Regional",
            "Os módulos que fazem as análises do LUPA, escritos em Python 3.11 "
            "com FastAPI. Os comentários no código estão em português: foi uma "
            "decisão da equipe, para que qualquer integrante conseguisse ler o "
            "que os outros escreveram.\n\n"
            "O guia **Como ler o código** explica, em linguagem para quem não "
            "programa, o que cada arquivo faz e onde olhar.",
            BACKEND, RAIZ / "backend",
        ),
        "CODIGO_BACKEND",
    )

    print("Gerando CODIGO_FRONTEND.pdf...")
    converter(
        montar_markdown(
            "Código-fonte do LUPA — interface",
            "Estrutura das páginas e componentes, em TypeScript — HackaNAV 2026",
            "A interface do LUPA é feita em Next.js com TypeScript. Cada pasta "
            "dentro de `app/` corresponde a um endereço do site.\n\n"
            "Este anexo traz a estrutura completa de páginas e três arquivos "
            "representativos. O código completo da interface está no "
            "repositório, cujo endereço acompanha esta pasta.",
            FRONTEND, RAIZ / "frontend",
            extra="## Páginas do site\n\n```\n" + arvore_do_frontend() + "\n```",
        ),
        "CODIGO_FRONTEND",
    )


if __name__ == "__main__":
    main()
