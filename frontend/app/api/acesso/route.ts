import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { senha } = await request.json();
  const senhaCorreta = process.env.ACESSO_SENHA;

  if (!senhaCorreta) {
    return NextResponse.json({ erro: "Acesso não configurado." }, { status: 500 });
  }

  if (senha !== senhaCorreta) {
    return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set("lupa_acesso", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  });
  return resposta;
}
