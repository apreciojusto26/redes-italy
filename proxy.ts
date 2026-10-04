import { NextRequest, NextResponse } from "next/server";
import { hasSiteSession, SESSION_COOKIE } from "@/lib/site-session";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/api/vault" || path === "/api/site-session") return NextResponse.next();
  try {
    if (await hasSiteSession(request.cookies.get(SESSION_COOKIE)?.value)) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  } catch {
    return NextResponse.json({ error: "No se pudo comprobar el acceso a la web." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ error: "Introduce la contraseña maestra para entrar." }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export const config = { matcher: ["/api/:path*", "/informes/:path*"] };
