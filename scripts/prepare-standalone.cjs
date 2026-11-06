const fs = require("node:fs");
const path = require("node:path");

const standaloneDirectory = path.join(process.cwd(), ".next", "standalone");
const staticDirectory = path.join(process.cwd(), ".next", "static");
const standaloneStaticDirectory = path.join(standaloneDirectory, ".next", "static");
const publicDirectory = path.join(process.cwd(), "public");
const standalonePublicDirectory = path.join(standaloneDirectory, "public");

if (!fs.existsSync(path.join(standaloneDirectory, "server.js"))) {
  throw new Error("Next.js standalone output not found. Run `next build` first.");
}

fs.mkdirSync(path.dirname(standaloneStaticDirectory), { recursive: true });
fs.cpSync(staticDirectory, standaloneStaticDirectory, { recursive: true, force: true });
fs.cpSync(publicDirectory, standalonePublicDirectory, { recursive: true, force: true });

console.log("Standalone public and static assets are ready.");
