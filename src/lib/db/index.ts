import fs from 'fs';
import path from 'path';

// Define unified DB interface compatible with Cloudflare D1 and Better-SQLite3
export interface DatabaseClient {
  all<T = any>(query: string, params?: any[]): Promise<T[]>;
  get<T = any>(query: string, params?: any[]): Promise<T | null>;
  run(query: string, params?: any[]): Promise<{ success: boolean; changes?: number; lastInsertRowid?: number | bigint }>;
  exec(query: string): Promise<void>;
}

let localDbInstance: any = null;

function getLocalDatabase(): DatabaseClient {
  if (!localDbInstance) {
    const Database = require('better-sqlite3');
    const isVercel = Boolean(process.env.VERCEL);
    const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'mkm_properties.db');
    if (isVercel && !fs.existsSync(dbPath)) {
      const sourceDb = path.join(process.cwd(), 'data', 'mkm_properties.db');
      if (fs.existsSync(sourceDb)) {
        try {
          fs.copyFileSync(sourceDb, dbPath);
        } catch (e: any) {
          console.warn('[DB] Could not copy source db to /tmp:', e.message);
        }
      }
    }
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    localDbInstance = db;

    // Run all migration sql files automatically in order
    const migrationsDir = path.join(process.cwd(), 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      for (const file of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        try {
          db.exec(sql);
        } catch (e: any) {
          console.error(`[DB Migration] Error in ${file}:`, e.message);
        }
      }
    }

    // Safely add any new columns to Enquiry table if missing
    try {
      const columns = db.prepare("PRAGMA table_info(Enquiry)").all() as { name: string }[];
      const colNames = columns.map(c => c.name);
      if (!colNames.includes('whatsapp')) {
        db.exec("ALTER TABLE Enquiry ADD COLUMN whatsapp TEXT;");
      }
      if (!colNames.includes('preferredTime')) {
        db.exec("ALTER TABLE Enquiry ADD COLUMN preferredTime TEXT;");
      }
      if (!colNames.includes('hearAboutUs')) {
        db.exec("ALTER TABLE Enquiry ADD COLUMN hearAboutUs TEXT;");
      }
      if (!colNames.includes('additionalRequirements')) {
        db.exec("ALTER TABLE Enquiry ADD COLUMN additionalRequirements TEXT;");
      }
      if (!colNames.includes('approvedUserId')) {
        db.exec("ALTER TABLE Enquiry ADD COLUMN approvedUserId TEXT;");
      }

      const projectCols = (db.prepare("PRAGMA table_info(Project)").all() as { name: string }[]).map(c => c.name);
      if (!projectCols.includes('priceBrochureUrl')) {
        db.exec("ALTER TABLE Project ADD COLUMN priceBrochureUrl TEXT;");
      }
    } catch (colErr: any) {
      console.warn('[DB Migration] Column update notice:', colErr.message);
    }
  }

  return {
    async all<T = any>(query: string, params: any[] = []): Promise<T[]> {
      const stmt = localDbInstance.prepare(query);
      return stmt.all(...params) as T[];
    },
    async get<T = any>(query: string, params: any[] = []): Promise<T | null> {
      const stmt = localDbInstance.prepare(query);
      const res = stmt.get(...params);
      return (res ?? null) as T | null;
    },
    async run(query: string, params: any[] = []): Promise<{ success: boolean; changes?: number; lastInsertRowid?: number | bigint }> {
      const stmt = localDbInstance.prepare(query);
      const res = stmt.run(...params);
      return { success: true, changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    },
    async exec(query: string): Promise<void> {
      localDbInstance.exec(query);
    }
  };
}

export function getDatabase(): DatabaseClient {
  // Check if running on Cloudflare Workers with D1 binding
  // OpenNext exposes env bindings on process.env or global context
  const d1 = (globalThis as any).DB || (process.env as any).DB;
  if (d1 && typeof d1.prepare === 'function') {
    return {
      async all<T = any>(query: string, params: any[] = []): Promise<T[]> {
        const stmt = d1.prepare(query).bind(...params);
        const { results } = await stmt.all();
        return results as T[];
      },
      async get<T = any>(query: string, params: any[] = []): Promise<T | null> {
        const stmt = d1.prepare(query).bind(...params);
        const res = await stmt.first();
        return (res ?? null) as T | null;
      },
      async run(query: string, params: any[] = []): Promise<{ success: boolean; changes?: number; lastInsertRowid?: number | bigint }> {
        const stmt = d1.prepare(query).bind(...params);
        const res = await stmt.run();
        return { success: res.success, changes: res.meta?.changes, lastInsertRowid: res.meta?.last_row_id };
      },
      async exec(query: string): Promise<void> {
        await d1.exec(query);
      }
    };
  }

  // Fallback to local SQLite via better-sqlite3
  return getLocalDatabase();
}
