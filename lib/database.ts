import initSqlJs, { type Database as SqlJsDatabase } from "sql.js/dist/sql-asm.js";
import fs from "node:fs";
import path from "node:path";
import type { QuotePayload } from "@/types/quote";

const databasePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "deep-digital.sqlite");
let database: SqlJsDatabase | undefined;
let writeQueue = Promise.resolve();

async function getDatabase() {
  if (!database) {
    const SQL = await initSqlJs();
    const source = fs.existsSync(databasePath) ? fs.readFileSync(databasePath) : undefined;
    database = new SQL.Database(source);
    database.run(`
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
  const task = writeQueue.then(async () => {
    const current = await getDatabase();
    const statement = current.prepare(`
      INSERT INTO quotes (product, color, size, technique, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    statement.run([quote.product, quote.color, quote.size, quote.technique, new Date().toISOString()]);
    statement.free();
    const id = Number(current.exec("SELECT last_insert_rowid() AS id")[0].values[0][0]);
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.writeFileSync(databasePath, Buffer.from(current.export()));
    return id;
  });
  writeQueue = task.then(() => undefined, () => undefined);
  return task;
}
