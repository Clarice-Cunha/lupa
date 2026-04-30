"""
Servidor web do LUPA (API em FastAPI).

Como rodar:
    venv/Scripts/python -m uvicorn main:app --reload

Depois abra no navegador:
    http://localhost:8000/docs  (documentação interativa)
"""

import os
import tempfile
import time

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# Carrega variáveis do arquivo .env ANTES de importar módulos que as usam.
load_dotenv()

from analyzer import ResultadoAnalise, analisar_url  # noqa: E402
from youtube import eh_url_youtube  # noqa: E402
from youtube_analyzer import analisar_youtube  # noqa: E402
from upload_analyzer import (  # noqa: E402
    ErroUpload,
    TAMANHO_MAXIMO_BYTES,
    analisar_upload,
    validar_arquivo,
)
from multiplayer import router as multiplayer_router  # noqa: E402
from image_analyzer import analisar_imagem  # noqa: E402
from text_analyzer import analisar_texto  # noqa: E402
from boatos import Boato, BoatoAtualizacao, BoatoEntrada, Categoria, atualizar_boato, criar_boato, listar_boatos  # noqa: E402
from parceria import Parceria, ParceiraEntrada, criar_parceria, listar_parcerias  # noqa: E402
from feedback import Feedback, FeedbackEntrada, criar_feedback, listar_feedbacks  # noqa: E402


# ============================================================
# Criação da aplicação
# ============================================================

# Limitador de requisições por IP. Protege o backend (e a cota do Gemini)
# contra abuso — um mesmo IP só pode pedir N análises por hora.
# PRD §9 pede proteção mínima antes da publicação pública.
limitador = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="LUPA API",
    description="Análise de confiabilidade de conteúdos digitais.",
    version="0.1.0",
)
app.state.limiter = limitador
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Cache em memória para análises de URL.
# Chave: URL normalizada. Valor: (timestamp_segundos, ResultadoAnalise).
# Evita reprocessar a mesma URL em curto intervalo e economiza chamadas
# à API do Gemini/YouTube. Em produção usaríamos Redis; para o MVP,
# um dicionário na memória do processo já resolve.
_CACHE_URL: dict[str, tuple[float, ResultadoAnalise]] = {}
CACHE_TTL_SEGUNDOS = 24 * 60 * 60  # 24 horas


def _cache_get(url: str) -> ResultadoAnalise | None:
    item = _CACHE_URL.get(url)
    if not item:
        return None
    ts, resultado = item
    if time.time() - ts > CACHE_TTL_SEGUNDOS:
        _CACHE_URL.pop(url, None)
        return None
    return resultado


def _cache_set(url: str, resultado: ResultadoAnalise) -> None:
    _CACHE_URL[url] = (time.time(), resultado)

# Permitir que o frontend (outro endereço/porta) chame esta API.
# FRONTEND_URL pode ser definida como variável de ambiente no Render/Vercel.
# Em desenvolvimento, aceitamos localhost para facilitar testes.
_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
_origens_permitidas = [
    _frontend_url,
    # Desenvolvimento local
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    # Produção — URL do Vercel (inclui aliases de deploy)
    "https://lupa-clarice-cunha-s-projects.vercel.app",
    "https://lupa-clarice-cunha-s-projects-git-main-clarice-cunha-s-projects.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(multiplayer_router)


# ============================================================
# Modelos de entrada e saída (contratos da API)
# ============================================================

class PedidoAnalise(BaseModel):
    """O que o usuário envia."""
    url: str = Field(..., description="URL do site a ser analisado",
                     examples=["https://www.bbc.com"])


class PedidoTexto(BaseModel):
    texto: str = Field(..., description="Texto a ser analisado")
    origem: str = Field("", description="Origem do texto (ex: WhatsApp, Instagram)")


class JustificativaResposta(BaseModel):
    criterio: str
    resultado: str
    impacto: int
    # Camada PRD §9: "fonte", "conteudo" ou "geral".
    camada: str = "geral"


class FonteSugerida(BaseModel):
    nome: str
    url: str
    descricao: str


class FonteWeb(BaseModel):
    titulo: str
    url: str
    descricao: str


class AlertaImagemResposta(BaseModel):
    nivel: str
    mensagem: str


class LinkBuscaReversaResposta(BaseModel):
    nome: str
    url: str
    descricao: str


class RespostaImagem(BaseModel):
    """Resultado da análise de metadados EXIF de uma imagem."""
    nome_arquivo: str
    formato: str
    largura: int
    altura: int
    tem_exif: bool
    data_criacao: str | None
    fabricante_camera: str | None
    modelo_camera: str | None
    software: str | None
    tem_gps: bool
    latitude: float | None
    longitude: float | None
    alertas: list[AlertaImagemResposta]
    links_busca_reversa: list[LinkBuscaReversaResposta]


class RespostaAnalise(BaseModel):
    """O que a API devolve."""
    url: str
    pontuacao: int
    classificacao: str
    cor: str
    titulo_pagina: str | None
    resumo: str | None
    justificativas: list[JustificativaResposta]
    dicas_personalizadas: list[str] = []
    fontes_sugeridas: list[FonteSugerida] = []
    fontes_web: list[FonteWeb] = []


# ============================================================
# Endpoints
# ============================================================

@app.get("/")
def raiz() -> dict:
    """Mensagem de boas-vindas — confirma que o servidor está no ar."""
    return {
        "mensagem": "LUPA API no ar!",
        "documentacao": "/docs",
    }


@app.post("/analisar-url", response_model=RespostaAnalise)
@limitador.limit("20/hour")
def endpoint_analisar_url(request: Request, pedido: PedidoAnalise) -> RespostaAnalise:
    """Recebe uma URL e devolve a análise completa.

    Limite: 20 análises por IP por hora. Resposta cacheada por 24h
    para reduzir chamadas a APIs externas.
    """
    if not pedido.url.strip():
        raise HTTPException(status_code=400, detail="A URL não pode estar vazia.")

    url_normalizada = pedido.url.strip().lower()
    resultado = _cache_get(url_normalizada)
    if resultado is None:
        try:
            # Mesmo endpoint para sites e YouTube — detectamos automaticamente.
            if eh_url_youtube(pedido.url):
                resultado = analisar_youtube(pedido.url)
            else:
                resultado = analisar_url(pedido.url)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro inesperado ao analisar a URL: {type(e).__name__}",
            ) from e
        _cache_set(url_normalizada, resultado)

    return _converter_resposta(resultado)


@app.post("/analisar-upload", response_model=RespostaAnalise)
@limitador.limit("10/hour")
async def endpoint_analisar_upload(
    request: Request,
    arquivo: UploadFile = File(..., description="Vídeo a ser analisado"),
    contexto: str = Form("", description="Texto opcional sobre a origem do vídeo"),
) -> RespostaAnalise:
    """Recebe um arquivo de vídeo e devolve a análise.

    O arquivo é salvo em um diretório temporário, analisado e APAGADO
    em seguida — nada fica armazenado no servidor. Isso atende ao
    princípio de "Isolamento de Análises" do PRD.
    """
    nome_original = arquivo.filename or "arquivo_sem_nome"

    # Salva em arquivo temporário (delete=False para podermos controlar
    # o ciclo de vida — apagamos manualmente no finally).
    sufixo = os.path.splitext(nome_original)[1] or ".bin"
    temporario = tempfile.NamedTemporaryFile(delete=False, suffix=sufixo)
    caminho = temporario.name
    try:
        # Lemos em blocos para não estourar memória em vídeos grandes,
        # e ao mesmo tempo controlamos o limite de tamanho.
        total_bytes = 0
        tamanho_max = TAMANHO_MAXIMO_BYTES
        while bloco := await arquivo.read(1024 * 1024):  # 1 MB por vez
            total_bytes += len(bloco)
            if total_bytes > tamanho_max:
                raise HTTPException(
                    status_code=413,
                    detail=f"Arquivo maior que o limite de {tamanho_max // (1024*1024)} MB.",
                )
            temporario.write(bloco)
        temporario.close()

        try:
            validar_arquivo(nome_original, total_bytes)
        except ErroUpload as erro:
            raise HTTPException(status_code=400, detail=str(erro)) from erro

        try:
            resultado = analisar_upload(
                caminho_arquivo=caminho,
                nome_original=nome_original,
                contexto_usuario=contexto,
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro inesperado ao analisar o arquivo: {type(e).__name__}",
            ) from e

        return _converter_resposta(resultado)
    finally:
        # Sempre apaga o arquivo temporário — mesmo se der erro acima.
        try:
            temporario.close()
        except Exception:
            pass
        if os.path.exists(caminho):
            os.remove(caminho)


@app.post("/analisar-texto", response_model=RespostaAnalise)
@limitador.limit("20/hour")
def endpoint_analisar_texto(request: Request, pedido: PedidoTexto) -> RespostaAnalise:
    """Analisa um texto colado pelo usuário em busca de indícios de desinformação.

    Usa o Gemini para análise semântica. Limite: 20 por IP por hora.
    """
    if not pedido.texto.strip():
        raise HTTPException(status_code=400, detail="O texto não pode estar vazio.")
    if len(pedido.texto) > 20_000:
        raise HTTPException(status_code=400, detail="Texto muito longo. Envie no máximo 20.000 caracteres.")

    try:
        resultado = analisar_texto(pedido.texto, pedido.origem)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro inesperado ao analisar o texto: {type(e).__name__}",
        ) from e

    return _converter_resposta(resultado)


@app.post("/analisar-imagem", response_model=RespostaImagem)
@limitador.limit("20/hour")
async def endpoint_analisar_imagem(
    request: Request,
    arquivo: UploadFile = File(..., description="Imagem a ser analisada"),
) -> RespostaImagem:
    """Recebe uma imagem e devolve seus metadados EXIF com alertas pedagógicos.

    O arquivo é apagado após a análise — nada fica armazenado. Limite: 20/hora por IP.
    """
    nome_original = arquivo.filename or "imagem"
    sufixo = os.path.splitext(nome_original)[1].lower() or ".jpg"

    formatos_aceitos = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"}
    if sufixo not in formatos_aceitos:
        raise HTTPException(
            status_code=400,
            detail="Formato não suportado. Use JPG, PNG, WEBP, GIF, BMP ou TIFF.",
        )

    temporario = tempfile.NamedTemporaryFile(delete=False, suffix=sufixo)
    caminho = temporario.name
    try:
        total_bytes = 0
        limite_bytes = 20 * 1024 * 1024  # 20 MB
        while bloco := await arquivo.read(1024 * 1024):
            total_bytes += len(bloco)
            if total_bytes > limite_bytes:
                raise HTTPException(
                    status_code=413,
                    detail="Imagem maior que o limite de 20 MB.",
                )
            temporario.write(bloco)
        temporario.close()

        try:
            resultado = analisar_imagem(caminho, nome_original)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao processar a imagem: {type(e).__name__}",
            ) from e

        return RespostaImagem(
            nome_arquivo=resultado.nome_arquivo,
            formato=resultado.formato,
            largura=resultado.largura,
            altura=resultado.altura,
            tem_exif=resultado.tem_exif,
            data_criacao=resultado.data_criacao,
            fabricante_camera=resultado.fabricante_camera,
            modelo_camera=resultado.modelo_camera,
            software=resultado.software,
            tem_gps=resultado.tem_gps,
            latitude=resultado.latitude,
            longitude=resultado.longitude,
            alertas=[
                AlertaImagemResposta(nivel=a.nivel, mensagem=a.mensagem)
                for a in resultado.alertas
            ],
            links_busca_reversa=[
                LinkBuscaReversaResposta(nome=lk.nome, url=lk.url, descricao=lk.descricao)
                for lk in resultado.links_busca_reversa
            ],
        )
    finally:
        try:
            temporario.close()
        except Exception:
            pass
        if os.path.exists(caminho):
            os.remove(caminho)


@app.get("/boatos", response_model=list[Boato])
def endpoint_listar_boatos(categoria: Categoria | None = None) -> list[Boato]:
    """Lista boatos reportados pela comunidade, do mais recente ao mais antigo.

    Parâmetro opcional `categoria`: filtra por 'cidade', 'escola' ou 'condominio'.
    """
    return listar_boatos(categoria)


@app.post("/boatos", response_model=Boato, status_code=201)
@limitador.limit("10/hour")
def endpoint_criar_boato(request: Request, entrada: BoatoEntrada) -> Boato:
    """Registra um novo boato reportado pela comunidade.

    Limite: 10 por IP por hora, para evitar spam.
    """
    try:
        return criar_boato(entrada)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao salvar o boato.") from e


# Chave de acesso ao painel de moderação.
# Configure MODERACAO_CHAVE no arquivo .env para um valor secreto em produção.
_MODERACAO_CHAVE = os.getenv("MODERACAO_CHAVE", "lupa2026")


@app.patch("/boatos/{id}", response_model=Boato)
def endpoint_atualizar_boato(
    id: str,
    atualizacao: BoatoAtualizacao,
    x_moderacao_chave: str = Header(default=""),
) -> Boato:
    """Atualiza status e checagem de um boato (uso exclusivo da equipe moderadora).

    Requer o cabeçalho HTTP 'X-Moderacao-Chave' com a senha configurada.
    """
    if x_moderacao_chave != _MODERACAO_CHAVE:
        raise HTTPException(status_code=401, detail="Chave de moderação inválida.")
    try:
        return atualizar_boato(id, atualizacao)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao atualizar o boato.") from e


@app.get("/feedbacks", response_model=list[Feedback])
def endpoint_listar_feedbacks() -> list[Feedback]:
    """Lista feedbacks recebidos pelo widget (uso interno da equipe)."""
    return listar_feedbacks()


@app.post("/feedback", response_model=Feedback, status_code=201)
@limitador.limit("20/hour")
def endpoint_criar_feedback(request: Request, entrada: FeedbackEntrada) -> Feedback:
    """Registra um feedback de dificuldade enviado pelo widget da página.

    O texto é opcional — o registro da página já é suficiente para análise.
    Limite: 20 por IP por hora.
    """
    try:
        return criar_feedback(entrada)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao salvar o feedback.") from e


@app.get("/parcerias", response_model=list[Parceria])
def endpoint_listar_parcerias() -> list[Parceria]:
    """Lista todas as solicitações de parceria com escolas (uso interno da equipe)."""
    return listar_parcerias()


@app.post("/parcerias", response_model=Parceria, status_code=201)
@limitador.limit("5/hour")
def endpoint_criar_parceria(request: Request, entrada: ParceiraEntrada) -> Parceria:
    """Registra uma nova solicitação de parceria de um(a) professor(a).

    Limite: 5 por IP por hora, para evitar spam.
    """
    try:
        return criar_parceria(entrada)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao salvar a solicitação.") from e


def _converter_resposta(resultado: ResultadoAnalise) -> RespostaAnalise:
    """Converte o ResultadoAnalise interno para o modelo público da API."""
    return RespostaAnalise(
        url=resultado.url,
        pontuacao=resultado.pontuacao,
        classificacao=resultado.classificacao,
        cor=resultado.cor,
        titulo_pagina=resultado.titulo_pagina,
        resumo=resultado.resumo,
        justificativas=[
            JustificativaResposta(
                criterio=j.criterio,
                resultado=j.resultado,
                impacto=j.impacto,
                camada=j.camada,
            )
            for j in resultado.justificativas
        ],
        dicas_personalizadas=resultado.dicas_personalizadas,
        fontes_sugeridas=[
            FonteSugerida(**f) for f in resultado.fontes_sugeridas
        ],
        fontes_web=[
            FonteWeb(**f) for f in resultado.fontes_web
        ],
    )
