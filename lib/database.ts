import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { QuotePayload } from "@/types/quote";

const databasePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "deep-digital.sqlite");
let database: Database.Database | undefined;

function getDatabase() {
  if (!database) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product TEXT NOT NULL,
        color TEXT NOT NULL,
        size TEXT NOT NULL,
        technique TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }
  return database;
}

export function saveQuote(quote: QuotePayload) {
  const statement = getDatabase().prepare(`
    INSERT INTO quotes (product, color, size, technique, created_at)
    VALUES (@product, @color, @size, @technique, @createdAt)
  `);
  const result = statement.run({ ...quote, createdAt: new Date().toISOString() });
  return Number(result.lastInsertRowid);
}
