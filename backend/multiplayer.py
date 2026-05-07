"""
Jogo multiplayer do LUPA — estilo Kahoot.

Salas ficam em memória do servidor (sem banco de dados). Cada sala
expira após TEMPO_EXPIRACAO_HORAS horas sem atividade.

Fluxo:
  1. Anfitrião cria sala  →  POST /multiplayer/criar
  2. Jogadores entram      →  POST /multiplayer/sala/{codigo}/entrar
  3. Anfitrião inicia      →  POST /multiplayer/sala/{codigo}/iniciar
  4. Jogadores respondem   →  POST /multiplayer/sala/{codigo}/responder
  5. Anfitrião avança      →  POST /multiplayer/sala/{codigo}/avancar
  6. Todos fazem polling   →  GET  /multiplayer/sala/{codigo}

Máquina de estados da sala:
  aguardando → rodada → feedback → rodada → ... → encerrada
"""

import json
import random
import string
import time
import uuid
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


# ── Configurações ──────────────────────────────────────────────────────────────
TEMPO_EXPIRACAO_HORAS = 4
TOTAL_RODADAS = 4
TEMPO_RODADA_SEGUNDOS = 60

PONTOS_POR_ACERTO = 10
DESCONTO_ERRO = 5
BONUS_VELOCIDADE_MAX = 20


# ── Carregamento dos textos ────────────────────────────────────────────────────
def _carregar_textos() -> list[dict]:
    # Em desenvolvimento usa o textos.json do frontend (mesmo repositório).
    # Em produção no Render, coloque uma cópia em backend/textos.json.
    candidatos = [
        Path(__file__).parent / "textos.json",
        Path(__file__).parent.parent / "frontend" / "lib" / "jogo" / "textos.json",
    ]
    for caminho in candidatos:
        if caminho.exists():
            with open(caminho, encoding="utf-8") as f:
                return json.load(f)
    raise RuntimeError(
        "textos.json não encontrado. "
        "Coloque uma cópia em backend/textos.json para produção."
    )


_TODOS_OS_TEXTOS = _carregar_textos()


def _selecionar_textos(quantidade: int = TOTAL_RODADAS) -> list[dict]:
    """Escolhe textos variados: tenta pegar ao menos 1 de cada nível."""
    por_nivel: dict[str, list[dict]] = {"facil": [], "medio": [], "dificil": []}
    for texto in _TODOS_OS_TEXTOS:
        por_nivel[texto["nivel"]].append(texto)

    selecionados: list[dict] = []
    for lista in por_nivel.values():
        if lista:
            selecionados.append(random.choice(lista))

    ids_ja_selecionados = {t["id"] for t in selecionados}
    restantes = [t for t in _TODOS_OS_TEXTOS if t["id"] not in ids_ja_selecionados]
    random.shuffle(restantes)
    selecionados += restantes

    random.shuffle(selecionados)
    return selecionados[:quantidade]


# ── Modelos internos (não saem pela API) ───────────────────────────────────────
EstadoSala = Literal["aguardando", "rodada", "feedback", "encerrada"]


class Jogador:
    def __init__(self, nome: str, avatar: str = "🔍") -> None:
        self.id = str(uuid.uuid4())
        self.nome = nome
        self.avatar = avatar
        self.pontos = 0
        # chave = índice da rodada, valor = lista de IDs de indícios marcados
        self.respostas: dict[int, list[str]] = {}
        # pontos ganhos em cada rodada separadamente
        self.pontos_por_rodada: dict[int, int] = {}


class Sala:
    def __init__(self, nome_anfitriao: str, anfitriao_participa: bool = False, nome_sala: str | None = None, anfitriao_avatar: str = "🔍") -> None:
        self.codigo = _gerar_codigo()
        self.textos = _selecionar_textos()
        self.estado: EstadoSala = "aguardando"
        self.rodada_atual = 0
        self.rodada_inicio: float | None = None
        self.criado_em = time.time()
        self.ultima_atividade = time.time()
        self.nome_sala = nome_sala
        self.anfitriao_participa = anfitriao_participa
        anfitriao = Jogador(nome_anfitriao, anfitriao_avatar)
        self.anfitriao_id = anfitriao.id
        # Anfitrião só entra na lista de jogadores se for participar
        self.jogadores: dict[str, Jogador] = {anfitriao.id: anfitriao} if anfitriao_participa else {}


# ── Armazenamento em memória ───────────────────────────────────────────────────
_SALAS: dict[str, Sala] = {}


def _gerar_codigo() -> str:
    chars = string.ascii_uppercase + string.digits
    while True:
        codigo = "".join(random.choices(chars, k=6))
        if codigo not in _SALAS:
            return codigo


def _limpar_salas_expiradas() -> None:
    limite = time.time() - TEMPO_EXPIRACAO_HORAS * 3600
    for codigo in [c for c, s in _SALAS.items() if s.ultima_atividade < limite]:
        _SALAS.pop(codigo, None)


def _obter_sala(codigo: str) -> Sala:
    sala = _SALAS.get(codigo.upper())
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada.")
    sala.ultima_atividade = time.time()
    return sala


# ── Modelos Pydantic (contratos da API) ───────────────────────────────────────
class PedidoCriar(BaseModel):
    nome_anfitriao: str
    anfitriao_participa: bool = False
    nome_sala: str | None = None
    anfitriao_avatar: str = "🔍"


class PedidoEntrar(BaseModel):
    nome: str
    avatar: str = "🔍"


class PedidoIniciar(BaseModel):
    anfitriao_id: str


class PedidoResponder(BaseModel):
    jogador_id: str
    indicios: list[str]


class PedidoAvancar(BaseModel):
    anfitriao_id: str


class JogadorPublico(BaseModel):
    id: str
    nome: str
    avatar: str = "🔍"
    pontos: int
    respondeu: bool
    pontos_esta_rodada: int | None = None


class TextoPublico(BaseModel):
    id: str
    titulo: str
    corpo: str
    # Indícios corretos só são revelados durante o feedback
    indicios_corretos: list[str] | None = None
    explicacao: str | None = None


class SalaPublica(BaseModel):
    codigo: str
    estado: EstadoSala
    rodada_atual: int
    total_rodadas: int
    anfitriao_id: str
    anfitriao_participa: bool
    nome_sala: str | None = None
    jogadores: list[JogadorPublico]
    texto_atual: TextoPublico | None = None
    rodada_inicio: float | None = None
    minha_resposta: list[str] | None = None


# ── Serialização ───────────────────────────────────────────────────────────────
def _sala_para_publico(sala: Sala, jogador_id: str | None = None) -> SalaPublica:
    revelar_gabarito = sala.estado in ("feedback", "encerrada")

    texto_atual: TextoPublico | None = None
    if sala.estado in ("rodada", "feedback"):
        raw = sala.textos[sala.rodada_atual]
        # explicacoes é um dict {indicio_id: texto}; juntamos em string única para o cliente
        explicacao_str: str | None = None
        if revelar_gabarito and raw.get("explicacoes"):
            explicacao_str = " | ".join(raw["explicacoes"].values())
        texto_atual = TextoPublico(
            id=raw["id"],
            titulo=raw["titulo"],
            corpo=raw["conteudo"],
            indicios_corretos=raw["indicios_corretos"] if revelar_gabarito else None,
            explicacao=explicacao_str,
        )

    minha_resposta: list[str] | None = None
    if jogador_id and jogador_id in sala.jogadores:
        minha_resposta = sala.jogadores[jogador_id].respostas.get(sala.rodada_atual)

    jogadores_lista = sorted(
        sala.jogadores.values(), key=lambda j: -j.pontos
    )

    return SalaPublica(
        codigo=sala.codigo,
        estado=sala.estado,
        rodada_atual=sala.rodada_atual,
        total_rodadas=len(sala.textos),
        anfitriao_id=sala.anfitriao_id,
        anfitriao_participa=sala.anfitriao_participa,
        nome_sala=sala.nome_sala,
        jogadores=[
            JogadorPublico(
                id=j.id,
                nome=j.nome,
                avatar=j.avatar,
                pontos=j.pontos,
                respondeu=sala.rodada_atual in j.respostas,
                pontos_esta_rodada=j.pontos_por_rodada.get(sala.rodada_atual),
            )
            for j in jogadores_lista
        ],
        texto_atual=texto_atual,
        rodada_inicio=sala.rodada_inicio,
        minha_resposta=minha_resposta,
    )


# ── Pontuação ──────────────────────────────────────────────────────────────────
def _calcular_pontos(
    indicios_corretos: list[str],
    resposta_jogador: list[str],
    tempo_resposta_segundos: float,
) -> int:
    if not indicios_corretos:
        # Texto limpo: acerto = não marcar nada
        if not resposta_jogador:
            pontos_base = PONTOS_POR_ACERTO
        else:
            pontos_base = -DESCONTO_ERRO * len(resposta_jogador)
    else:
        acertos = sum(1 for i in resposta_jogador if i in indicios_corretos)
        erros = sum(1 for i in resposta_jogador if i not in indicios_corretos)
        pontos_base = acertos * PONTOS_POR_ACERTO - erros * DESCONTO_ERRO

    # Bônus de velocidade só vale se o jogador pontuou positivamente
    if pontos_base > 0:
        frac = max(0.0, min(1.0, 1.0 - tempo_resposta_segundos / TEMPO_RODADA_SEGUNDOS))
        pontos_base += round(frac * BONUS_VELOCIDADE_MAX)

    return max(pontos_base, 0)


# ── Router ─────────────────────────────────────────────────────────────────────
router = APIRouter(prefix="/multiplayer", tags=["multiplayer"])


@router.post("/criar")
def criar_sala(pedido: PedidoCriar) -> dict:
    """Cria uma nova sala e devolve o código e o ID do anfitrião."""
    _limpar_salas_expiradas()
    nome = pedido.nome_anfitriao.strip()[:30]
    if not nome:
        raise HTTPException(status_code=400, detail="Nome do anfitrião não pode ser vazio.")
    nome_sala = pedido.nome_sala.strip()[:40] if pedido.nome_sala else None
    sala = Sala(nome, pedido.anfitriao_participa, nome_sala, pedido.anfitriao_avatar)
    _SALAS[sala.codigo] = sala
    return {
        "codigo": sala.codigo,
        "anfitriao_id": sala.anfitriao_id,
        "sala": _sala_para_publico(sala, sala.anfitriao_id),
    }


@router.post("/sala/{codigo}/entrar")
def entrar_sala(codigo: str, pedido: PedidoEntrar) -> dict:
    """Entra em uma sala existente. Só é possível antes do jogo começar."""
    sala = _obter_sala(codigo)
    if sala.estado != "aguardando":
        raise HTTPException(status_code=409, detail="O jogo já começou.")
    if len(sala.jogadores) >= 30:
        raise HTTPException(status_code=409, detail="Sala cheia (máximo 30 jogadores).")
    nome = pedido.nome.strip()[:20]
    if not nome:
        raise HTTPException(status_code=400, detail="Nome não pode ser vazio.")
    jogador = Jogador(nome, pedido.avatar)
    sala.jogadores[jogador.id] = jogador
    return {
        "jogador_id": jogador.id,
        "sala": _sala_para_publico(sala, jogador.id),
    }


@router.get("/sala/{codigo}")
def estado_sala(codigo: str, jogador_id: str | None = None) -> SalaPublica:
    """Retorna o estado atual da sala. Usado pelo frontend em polling."""
    sala = _obter_sala(codigo)
    return _sala_para_publico(sala, jogador_id)


@router.post("/sala/{codigo}/iniciar")
def iniciar_jogo(codigo: str, pedido: PedidoIniciar) -> SalaPublica:
    """Anfitrião inicia o jogo. Transição: aguardando → rodada."""
    sala = _obter_sala(codigo)
    if pedido.anfitriao_id != sala.anfitriao_id:
        raise HTTPException(status_code=403, detail="Apenas o anfitrião pode iniciar o jogo.")
    if sala.estado != "aguardando":
        raise HTTPException(status_code=409, detail="O jogo já foi iniciado.")
    sala.estado = "rodada"
    sala.rodada_atual = 0
    sala.rodada_inicio = time.time()
    return _sala_para_publico(sala, pedido.anfitriao_id)


@router.post("/sala/{codigo}/responder")
def responder(codigo: str, pedido: PedidoResponder) -> SalaPublica:
    """Jogador envia sua resposta. Quando todos respondem, auto-avança para feedback."""
    sala = _obter_sala(codigo)
    if sala.estado != "rodada":
        raise HTTPException(status_code=409, detail="Não há rodada aberta.")
    jogador = sala.jogadores.get(pedido.jogador_id)
    if not jogador:
        raise HTTPException(status_code=404, detail="Jogador não encontrado nesta sala.")
    if sala.rodada_atual in jogador.respostas:
        raise HTTPException(status_code=409, detail="Você já respondeu esta rodada.")

    jogador.respostas[sala.rodada_atual] = pedido.indicios

    texto = sala.textos[sala.rodada_atual]
    tempo = time.time() - (sala.rodada_inicio or time.time())
    pts = _calcular_pontos(texto["indicios_corretos"], pedido.indicios, tempo)
    jogador.pontos_por_rodada[sala.rodada_atual] = pts
    jogador.pontos += pts

    # Auto-avança para feedback quando todos os jogadores responderam
    todos_responderam = all(sala.rodada_atual in j.respostas for j in sala.jogadores.values())
    if todos_responderam:
        sala.estado = "feedback"

    return _sala_para_publico(sala, pedido.jogador_id)


@router.post("/sala/{codigo}/avancar")
def avancar(codigo: str, pedido: PedidoAvancar) -> SalaPublica:
    """Anfitrião avança da fase de feedback para a próxima rodada ou encerramento.

    As rodadas encerram automaticamente quando todos os jogadores respondem.
    """
    sala = _obter_sala(codigo)
    if pedido.anfitriao_id != sala.anfitriao_id:
        raise HTTPException(status_code=403, detail="Apenas o anfitrião pode avançar.")

    if sala.estado == "feedback":
        proxima = sala.rodada_atual + 1
        if proxima >= len(sala.textos):
            sala.estado = "encerrada"
        else:
            sala.rodada_atual = proxima
            sala.estado = "rodada"
            sala.rodada_inicio = time.time()

    else:
        raise HTTPException(
            status_code=409,
            detail=f"Não é possível avançar no estado '{sala.estado}'.",
        )

    return _sala_para_publico(sala, pedido.anfitriao_id)


# ── Modelos do relatório ───────────────────────────────────────────────────────
class EstatisticaIndicio(BaseModel):
    id: str
    total_possiveis: int
    total_acertos: int
    taxa_acerto: float


class EstatisticaTexto(BaseModel):
    titulo: str
    indicios_corretos: list[str]
    taxa_acerto_turma: float


class RelatorioSala(BaseModel):
    codigo: str
    total_jogadores: int
    ranking: list[JogadorPublico]
    por_indicio: list[EstatisticaIndicio]
    por_texto: list[EstatisticaTexto]


@router.get("/sala/{codigo}/relatorio")
def relatorio(codigo: str) -> RelatorioSala:
    """Relatório pedagógico — disponível após o jogo encerrar.

    Mostra quais indícios a turma mais errou e o desempenho por texto,
    ajudando o professor a identificar pontos para aprofundar em aula.
    """
    sala = _obter_sala(codigo)
    if sala.estado != "encerrada":
        raise HTTPException(
            status_code=409,
            detail="O relatório só está disponível após o jogo encerrar.",
        )

    jogadores = list(sala.jogadores.values())
    ranking = sorted(jogadores, key=lambda j: -j.pontos)

    # Estatísticas por indício
    contagem: dict[str, dict[str, int]] = {}

    for rodada_idx, texto in enumerate(sala.textos):
        indicios_corretos: list[str] = texto["indicios_corretos"]

        for indicio in indicios_corretos:
            if indicio not in contagem:
                contagem[indicio] = {"possiveis": 0, "acertos": 0}
            contagem[indicio]["possiveis"] += len(jogadores)
            for jogador in jogadores:
                if indicio in jogador.respostas.get(rodada_idx, []):
                    contagem[indicio]["acertos"] += 1

    por_indicio = sorted(
        [
            EstatisticaIndicio(
                id=id_,
                total_possiveis=v["possiveis"],
                total_acertos=v["acertos"],
                taxa_acerto=v["acertos"] / v["possiveis"] if v["possiveis"] else 0,
            )
            for id_, v in contagem.items()
        ],
        key=lambda e: e.taxa_acerto,
    )

    # Estatísticas por texto
    por_texto: list[EstatisticaTexto] = []
    for rodada_idx, texto in enumerate(sala.textos):
        indicios_corretos = texto["indicios_corretos"]
        taxas: list[float] = []
        for jogador in jogadores:
            resposta = jogador.respostas.get(rodada_idx, [])
            if not indicios_corretos:
                taxas.append(1.0 if not resposta else 0.0)
            else:
                acertos = sum(1 for i in resposta if i in indicios_corretos)
                erros = sum(1 for i in resposta if i not in indicios_corretos)
                taxas.append(max(0.0, (acertos - erros) / len(indicios_corretos)))
        por_texto.append(EstatisticaTexto(
            titulo=texto["titulo"],
            indicios_corretos=indicios_corretos,
            taxa_acerto_turma=round(sum(taxas) / len(taxas) if taxas else 0.0, 2),
        ))

    return RelatorioSala(
        codigo=sala.codigo,
        total_jogadores=len(jogadores),
        ranking=[
            JogadorPublico(id=j.id, nome=j.nome, pontos=j.pontos,
                           respondeu=True, pontos_esta_rodada=None)
            for j in ranking
        ],
        por_indicio=por_indicio,
        por_texto=por_texto,
    )
