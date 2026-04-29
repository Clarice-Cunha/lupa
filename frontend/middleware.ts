import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso à página e API de acesso sem verificação
  if (pathname.startsWith("/acesso") || pathname.startsWith("/api/acesso")) {
    return NextResponse.next();
  }

  const autenticado = request.cookies.get("lupa_acesso")?.value === "ok";

  if (!autenticado) {
    const url = request.nextUrl.clone();
    url.pathname = "/acesso";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica o middleware em todas as rotas exceto arquivos estáticos
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
