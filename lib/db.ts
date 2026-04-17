import { Pool } from 'pg'

let _pool: Pool | null = null
let _schemaReady = false

export function getDb(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    })
  }
  return _pool
}

/**
 * Creates all tables if they don't exist.
 * Safe to call on every request — skips if already done this process lifetime.
 * This means Railway (or any fresh Postgres) just works with zero manual setup.
 */
export async function ensureSchema(): Promise<void> {
  if (_schemaReady) return
  const db = getDb()
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      phone                 TEXT        NOT NULL UNIQUE,
      clerk_id              TEXT        UNIQUE,
      active                BOOLEAN     NOT NULL DEFAULT true,
      stripe_customer_id    TEXT,
      stripe_subscription_id TEXT,
      plan                  TEXT        NOT NULL DEFAULT 'free',
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      coach_style          TEXT NOT NULL DEFAULT 'direct',
      biggest_distraction  TEXT,
      why                  TEXT
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      frequency_minutes INT         NOT NULL DEFAULT 60,
      start_time        TEXT        NOT NULL DEFAULT '08:00',
      end_time          TEXT        NOT NULL DEFAULT '22:00',
      timezone          TEXT        NOT NULL DEFAULT 'America/New_York',
      active            BOOLEAN     NOT NULL DEFAULT true,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS habits (
      id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name           TEXT        NOT NULL,
      emoji          TEXT        NOT NULL DEFAULT '🎯',
      active         BOOLEAN     NOT NULL DEFAULT true,
      why            TEXT,
      biggest_excuse TEXT,
      stakes         TEXT,
      time_of_day    TEXT        DEFAULT 'anytime',
      coach_style    TEXT        DEFAULT 'direct',
      completed_at   TIMESTAMPTZ,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS completions (
      id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      habit_id     UUID        NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      habit_id     UUID        REFERENCES habits(id) ON DELETE SET NULL,
      message_text TEXT        NOT NULL,
      sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      responded_at TIMESTAMPTZ
    );
  `)
  _schemaReady = true
}
