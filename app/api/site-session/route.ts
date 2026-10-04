import { NextRequest, NextResponse } from "next/server";
import { createSiteSession, deleteSiteSession, hasSiteSession, renewSiteSession, SESSION_COOKIE, SESSION_SECONDS, verifyMasterPassword } from "@/lib/site-session";
import { getTurso } from "@/lib/turso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const attempts = new Map<string, { count: number; expires: number }>();
const options = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS };
const noStore = { "Cache-Control": "no-store" };

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    return source.host === request.headers.get("host") && (source.protocol === "http:" || source.protocol === "https:");
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  for (const [ip, attempt] of attempts) if (attempt.expires <= now) attempts.delete(ip);
  const attempt = attempts.get(address) ?? { count: 0, expires: now + 15 * 60 * 1000 };
  if (attempt.count >= 10) return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos antes de volver a entrar." }, { status: 429, headers: noStore });
  let body: { password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Datos no válidos." }, { status: 400 }); }
  if (typeof body.password !== "string" || !body.password || body.password.length > 1024) return NextResponse.json({ error: "Escribe la contraseña maestra." }, { status: 400 });
  attempt.count += 1;
  attempts.set(address, attempt);
  try {
    const database = await getTurso();
    const result = await database.execute("SELECT salt, verifier_ciphertext, verifier_iv, kdf_iterations FROM vault_settings WHERE id = 1");
    const row = result.rows[0];
    if (!row || !await verifyMasterPassword(body.password, { salt: String(row.salt), verifierCiphertext: String(row.verifier_ciphertext), verifierIv: String(row.verifier_iv), kdfIterations: Number(row.kdf_iterations) })) {
      return NextResponse.json({ error: "La contraseña maestra no es correcta." }, { status: 401, headers: noStore });
    }
    const token = await createSiteSession();
    await deleteSiteSession(request.cookies.get(SESSION_COOKIE)?.value);
    attempts.delete(address);
    const response = NextResponse.json({ ok: true }, { headers: noStore });
    response.cookies.set(SESSION_COOKIE, token, options);
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo abrir la web. Inténtalo de nuevo." }, { status: 503, headers: noStore });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!await hasSiteSession(token)) return NextResponse.json({ error: "Vuelve a introducir la contraseña maestra." }, { status: 401, headers: noStore });
    await renewSiteSession(token!);
    const response = NextResponse.json({ ok: true }, { headers: noStore });
    response.cookies.set(SESSION_COOKIE, token!, options);
    return response;
  } catch { return NextResponse.json({ error: "No se pudo comprobar la sesión." }, { status: 503, headers: noStore }); }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  try {
    await deleteSiteSession(request.cookies.get(SESSION_COOKIE)?.value);
    const response = NextResponse.json({ ok: true }, { headers: noStore });
    response.cookies.set(SESSION_COOKIE, "", { ...options, maxAge: 0 });
    return response;
  } catch { return NextResponse.json({ error: "No se pudo cerrar la sesión." }, { status: 503, headers: noStore }); }
}
