// Server-only database access via the Netlify Database library (@netlify/database).
// NEVER import this from client code.
//
// `getDatabase()` reads the connection string from NETLIFY_DATABASE_URL, which is
// set automatically:
//   - in production, once a database is provisioned with `netlify db init`
//   - locally, by `netlify dev` (it boots a real local Postgres, no Docker needed)
//
// Values interpolated into the `sql` tagged template are automatically parameterized.
import { getDatabase, type DatabaseConnection } from '@netlify/database'

export interface Todo {
  id: string
  user_id: string
  title: string
  completed: boolean
  created_at: string
}

type Sql = DatabaseConnection['sql']

let schemaReady: Promise<void> | null = null

/**
 * Lazily create the `todos` table on first use. This keeps the template working
 * without depending on the interactive migration tooling — it is safe to run on
 * every cold start because of `IF NOT EXISTS`.
 */
function ensureSchema(sql: Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS todos (
          id text PRIMARY KEY,
          user_id text NOT NULL,
          title text NOT NULL,
          completed boolean NOT NULL DEFAULT false,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos (user_id)`
    })().catch((err) => {
      // Reset so a later request can retry if this failed (e.g. DB not ready yet).
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}

/** Returns the `sql` query function with the schema guaranteed to exist. */
export async function getDb(): Promise<Sql> {
  const db = getDatabase()
  await ensureSchema(db.sql)
  return db.sql
}
