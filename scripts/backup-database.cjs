const fs = require("node:fs");
const path = require("node:path");

const databasePath = path.resolve(
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "deep-digital.sqlite"),
);
const backupDirectory = path.resolve(
  process.env.DATABASE_BACKUP_DIR ?? path.join(path.dirname(databasePath), "backups"),
);
const backupPrefix = "deep-digital-";
const retentionCount = 14;

function createBackup() {
  if (!fs.existsSync(databasePath)) {
    throw new Error(`Database file not found: ${databasePath}`);
  }

  fs.mkdirSync(backupDirectory, { recursive: true, mode: 0o700 });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDirectory, `${backupPrefix}${timestamp}.sqlite`);
  const temporaryPath = `${backupPath}.${process.pid}.tmp`;

  try {
    fs.copyFileSync(databasePath, temporaryPath, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(temporaryPath, 0o600);
    fs.renameSync(temporaryPath, backupPath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }

  const backups = fs.readdirSync(backupDirectory)
    .filter((name) => name.startsWith(backupPrefix) && name.endsWith(".sqlite"))
    .sort()
    .reverse();

  for (const oldBackup of backups.slice(retentionCount)) {
    fs.unlinkSync(path.join(backupDirectory, oldBackup));
  }

  console.log(`Database backup created: ${backupPath}`);
}

try {
  createBackup();
} catch (error) {
  console.error("Database backup failed:", error);
  process.exitCode = 1;
}
