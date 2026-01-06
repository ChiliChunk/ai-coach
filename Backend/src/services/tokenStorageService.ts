import Database from 'better-sqlite3';
import path from 'path';

interface UserTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenStorageService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'data', 'tokens.db');
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_tokens (
        userId TEXT PRIMARY KEY,
        accessToken TEXT NOT NULL,
        refreshToken TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);
  }

  set(userId: string, tokens: UserTokens): void {
    const stmt = this.db.prepare(`
      INSERT INTO user_tokens (userId, accessToken, refreshToken, expiresAt, updatedAt)
      VALUES (?, ?, ?, ?, strftime('%s', 'now'))
      ON CONFLICT(userId) DO UPDATE SET
        accessToken = excluded.accessToken,
        refreshToken = excluded.refreshToken,
        expiresAt = excluded.expiresAt,
        updatedAt = strftime('%s', 'now')
    `);

    stmt.run(userId, tokens.accessToken, tokens.refreshToken, tokens.expiresAt);
  }

  get(userId: string): UserTokens | null {
    const stmt = this.db.prepare(`
      SELECT accessToken, refreshToken, expiresAt
      FROM user_tokens
      WHERE userId = ?
    `);

    const row = stmt.get(userId) as UserTokens | undefined;
    return row || null;
  }

  delete(userId: string): boolean {
    const stmt = this.db.prepare('DELETE FROM user_tokens WHERE userId = ?');
    const result = stmt.run(userId);
    return result.changes > 0;
  }

  has(userId: string): boolean {
    const stmt = this.db.prepare('SELECT 1 FROM user_tokens WHERE userId = ? LIMIT 1');
    return stmt.get(userId) !== undefined;
  }

  close(): void {
    this.db.close();
  }
}

export default new TokenStorageService();
