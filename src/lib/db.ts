import path from 'path';

/**
 * Lazy-initialized SQLite database for analytics.
 *
 * `better-sqlite3` is a native C++ addon. The compiled `.node` binary is
 * platform-specific (Windows ≠ Linux). If the binary doesn't match the host
 * or the module is missing, we gracefully return `null` so the rest of the
 * app still starts.  Analytics API routes check for `null` and return 503.
 */

type BetterSqlite3Database = import('better-sqlite3').Database;

let _db: BetterSqlite3Database | null = null;
let _initAttempted = false;

function getDb(): BetterSqlite3Database | null {
  if (_initAttempted) return _db;
  _initAttempted = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    const dbPath = path.join(process.cwd(), 'analytics.db');
    _db = new Database(dbPath) as BetterSqlite3Database;

    _db!.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        page_url TEXT,
        referrer TEXT,
        device_type TEXT,
        user_agent TEXT,
        scroll_depth INTEGER,
        time_on_page INTEGER,
        product_id TEXT,
        cart_value REAL,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_shop_timestamp ON events(shop_id, timestamp);
      CREATE INDEX IF NOT EXISTS idx_session ON events(session_id);
      CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type);
    `);

    console.log('✅ Analytics database initialized at', dbPath);
  } catch (err) {
    console.warn(
      '⚠️  Analytics database unavailable (better-sqlite3 native module failed to load).',
      'Analytics endpoints will return 503. The rest of the site is unaffected.',
      err instanceof Error ? err.message : err
    );
    _db = null;
  }

  return _db;
}

export default getDb;
