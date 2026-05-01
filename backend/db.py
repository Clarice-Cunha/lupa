"""
Cliente HTTP para a API REST do Supabase.

Usa a biblioteca requests (já no requirements) em vez do supabase-py,
evitando incompatibilidades com o novo formato de chaves do Supabase
(sb_secret_... / sb_publishable_...).

A interface pública (get_db().table().select/insert/update/eq/order/execute)
é idêntica à do supabase-py, então os outros módulos não precisam mudar.
"""

import os
from typing import Any

import requests as _req


def _url() -> str:
    return os.environ.get("SUPABASE_URL", "").rstrip("/")


def _key() -> str:
    return os.environ.get("SUPABASE_KEY", "")


def _headers() -> dict:
    k = _key()
    return {
        "apikey": k,
        "Authorization": f"Bearer {k}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


class _Resultado:
    def __init__(self, data: list):
        self.data = data


class _Query:
    def __init__(self, tabela: str, metodo: str = "GET", corpo: dict | None = None):
        self._tabela = tabela
        self._metodo = metodo
        self._corpo = corpo
        self._colunas = "*"
        self._filtros: dict = {}
        self._ordem: str | None = None

    def select(self, colunas: str = "*") -> "_Query":
        self._colunas = colunas
        return self

    def order(self, coluna: str, desc: bool = False) -> "_Query":
        self._ordem = f"{coluna}.{'desc' if desc else 'asc'}"
        return self

    def eq(self, coluna: str, valor: Any) -> "_Query":
        self._filtros[coluna] = f"eq.{valor}"
        return self

    def execute(self) -> _Resultado:
        url = f"{_url()}/rest/v1/{self._tabela}"
        params: dict = {}

        if self._metodo == "GET":
            params["select"] = self._colunas
            if self._ordem:
                params["order"] = self._ordem

        for col, val in self._filtros.items():
            params[col] = val

        resp = _req.request(
            self._metodo,
            url,
            headers=_headers(),
            params=params or None,
            json=self._corpo,
        )

        if not resp.ok:
            raise RuntimeError(
                f"Supabase REST error {resp.status_code}: {resp.text}"
            )

        corpo = resp.json() if resp.content else []
        return _Resultado(corpo if isinstance(corpo, list) else [corpo])


class _Tabela:
    def __init__(self, nome: str):
        self._nome = nome

    def select(self, colunas: str = "*") -> _Query:
        return _Query(self._nome, "GET").select(colunas)

    def insert(self, dados: dict) -> _Query:
        return _Query(self._nome, "POST", dados)

    def update(self, dados: dict) -> _Query:
        return _Query(self._nome, "PATCH", dados)


class _Cliente:
    def table(self, nome: str) -> _Tabela:
        return _Tabela(nome)


_singleton: _Cliente | None = None


def get_db() -> _Cliente:
    """Retorna o cliente do Supabase, validando as variáveis de ambiente."""
    global _singleton
    if _singleton is None:
        if not _url() or not _key():
            raise RuntimeError(
                "Variáveis SUPABASE_URL e SUPABASE_KEY não definidas. "
                "Adicione-as ao .env (local) ou às variáveis de ambiente do Render."
            )
        _singleton = _Cliente()
    return _singleton
