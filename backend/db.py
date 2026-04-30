"""
Cliente único do Supabase para todos os módulos do LUPA.

As variáveis SUPABASE_URL e SUPABASE_KEY devem estar definidas
no .env (local) ou nas variáveis de ambiente do Render (produção).
Use sempre a chave 'service_role' — ela nunca é exposta ao usuário
pois fica apenas no servidor (Render).
"""

import os
from supabase import create_client, Client

_client: Client | None = None


def get_db() -> Client:
    """Retorna o cliente Supabase, criando-o na primeira chamada."""
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL", "")
        key = os.environ.get("SUPABASE_KEY", "")
        if not url or not key:
            raise RuntimeError(
                "Variáveis SUPABASE_URL e SUPABASE_KEY não definidas. "
                "Adicione-as ao .env (local) ou às variáveis de ambiente do Render."
            )
        _client = create_client(url, key)
    return _client
