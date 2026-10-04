import { NextRequest, NextResponse } from "next/server";
import { getTurso } from "@/lib/turso";
import { businessGuides } from "@/config/businesses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await getTurso();
    const result = await database.execute("SELECT id, business_id, title, url FROM business_tutorials ORDER BY created_at, id");
    return NextResponse.json({ tutorials: result.rows.map((row) => ({ id: String(row.id), businessId: String(row.business_id), title: String(row.title), url: String(row.url) })) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los tutoriales. Puedes seguir leyendo las guías." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let body: { businessId?: unknown; title?: unknown; url?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Datos no válidos." }, { status: 400 }); }
  if (typeof body.businessId !== "string" || !businessGuides.some((guide) => guide.id === body.businessId) || typeof body.title !== "string" || !body.title.trim() || body.title.length > 160 || typeof body.url !== "string" || body.url.length > 2048) {
    return NextResponse.json({ error: "Escribe un título y un enlace válidos." }, { status: 400 });
  }
  let url: URL;
  try { url = new URL(body.url); } catch { return NextResponse.json({ error: "El enlace debe empezar por https://." }, { status: 400 }); }
  if (url.protocol !== "https:" || url.username || url.password) return NextResponse.json({ error: "Utiliza un enlace seguro que empiece por https://." }, { status: 400 });
  try {
    const database = await getTurso();
    const tutorial = { id: crypto.randomUUID(), businessId: body.businessId, title: body.title.trim(), url: url.toString() };
    await database.execute({ sql: "INSERT INTO business_tutorials (id, business_id, title, url) VALUES (?, ?, ?, ?)", args: [tutorial.id, tutorial.businessId, tutorial.title, tutorial.url] });
    return NextResponse.json({ tutorial }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el vídeo. Inténtalo de nuevo." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  let body: { id?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Datos no válidos." }, { status: 400 }); }
  if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) {
    return NextResponse.json({ error: "El vídeo indicado no es válido." }, { status: 400 });
  }
  try {
    const database = await getTurso();
    const result = await database.execute({ sql: "DELETE FROM business_tutorials WHERE id = ?", args: [body.id] });
    if (result.rowsAffected === 0) return NextResponse.json({ error: "Este vídeo ya no existe. Actualiza la página." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar el vídeo. Inténtalo de nuevo." }, { status: 503 });
  }
}
