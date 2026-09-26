import "server-only";

import { createClient, type Client } from "@libsql/client";

let database: Client | undefined;
let schemaPromise: Promise<void> | undefined;

export class TursoConfigurationError extends Error {
  constructor() {
    super("Turso no está configurado");
    this.name = "TursoConfigurationError";
  }
}

function getClient(): Client {
  if (database) return database;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) throw new TursoConfigurationError();

  database = createClient({ url, authToken });
  return database;
}

export async function getTurso(): Promise<Client> {
  const client = getClient();

  schemaPromise ??= client
    .execute(`
      CREATE TABLE IF NOT EXISTS publication_checks (
        date_key TEXT NOT NULL,
        platform_id TEXT NOT NULL,
        publication_id TEXT NOT NULL,
        checked INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (date_key, platform_id, publication_id)
      )
    `)
    .then(() => undefined);

  await schemaPromise;
  return client;
}
