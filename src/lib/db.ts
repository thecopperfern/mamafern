import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'analytics.db');
const db = new Database(dbPath);

db.exec(`
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

export default db;
