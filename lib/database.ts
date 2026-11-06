import initSqlJs, { type Database as SqlJsDatabase } from "sql.js/dist/sql-asm.js";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { QuotePayload } from "@/types/quote";

const databasePath = path.resolve(
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "deep-digital.sqlite"),
);
let database: SqlJsDatabase | undefined;
let writeQueue = Promise.resolve();

async function getDatabase() {
  if (!database) {
    if (process.env.NODE_ENV === "production"
      && (!process.env.DATABASE_PATH || !path.isAbsolute(process.env.DATABASE_PATH))) {
      throw new Error("Set DATABASE_PATH to an absolute, persistent file path in production.");
    }

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
    try {
      statement.run([quote.product, quote.color, quote.size, quote.technique, new Date().toISOString()]);
    } finally {
      statement.free();
    }
    const id = Number(current.exec("SELECT last_insert_rowid() AS id")[0].values[0][0]);
    const directory = path.dirname(databasePath);
    const temporaryPath = `${databasePath}.${process.pid}.${randomUUID()}.tmp`;
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    try {
      fs.writeFileSync(temporaryPath, Buffer.from(current.export()), { mode: 0o600 });
      fs.chmodSync(temporaryPath, 0o600);
      fs.renameSync(temporaryPath, databasePath);
    } finally {
      if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    }
    return id;
  });
  writeQueue = task.then(() => undefined, () => undefined);
  return task;
}
