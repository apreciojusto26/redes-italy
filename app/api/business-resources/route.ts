import { NextResponse } from "next/server";
import { getTurso } from "@/lib/turso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await getTurso();
    const result = await database.execute("SELECT name, platform, group_name, url, favorite, updated_at FROM credentials WHERE url <> '' ORDER BY name COLLATE NOCASE");
    return NextResponse.json({ resources: result.rows.map((row) => ({ name: String(row.name), platform: String(row.platform), groupName: String(row.group_name), url: String(row.url), favorite: Number(row.favorite) === 1, updatedAt: String(row.updated_at) })) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los enlaces de tus cuentas." }, { status: 503 });
  }
}
