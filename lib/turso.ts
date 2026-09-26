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
    .batch([
      `CREATE TABLE IF NOT EXISTS publication_checks (
          date_key TEXT NOT NULL,
          platform_id TEXT NOT NULL,
          publication_id TEXT NOT NULL,
          checked INTEGER NOT NULL DEFAULT 1,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (date_key, platform_id, publication_id)
        )`,
      `CREATE TABLE IF NOT EXISTS vault_settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          salt TEXT NOT NULL,
          verifier_ciphertext TEXT NOT NULL,
          verifier_iv TEXT NOT NULL,
          kdf_iterations INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
      `CREATE TABLE IF NOT EXISTS credentials (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          platform TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT '',
          url TEXT NOT NULL DEFAULT '',
          login_method TEXT NOT NULL,
          email TEXT NOT NULL DEFAULT '',
          username TEXT NOT NULL DEFAULT '',
          encrypted_password TEXT,
          password_iv TEXT,
          login_credential_id TEXT,
          email_credential_id TEXT,
          access_instructions TEXT NOT NULL DEFAULT '',
          notes TEXT NOT NULL DEFAULT '',
          favorite INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (login_credential_id) REFERENCES credentials(id),
          FOREIGN KEY (email_credential_id) REFERENCES credentials(id)
        )`,
      "CREATE INDEX IF NOT EXISTS credentials_name_idx ON credentials(name)",
      "CREATE INDEX IF NOT EXISTS credentials_login_relation_idx ON credentials(login_credential_id)",
      "CREATE INDEX IF NOT EXISTS credentials_email_relation_idx ON credentials(email_credential_id)",
    ], "write")
    .then(() => undefined);

  await schemaPromise;
  return client;
}
