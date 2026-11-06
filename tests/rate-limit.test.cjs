const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/rate-limit.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context, { filename: "rate-limit.js" });
const { consumeRateLimit } = context.exports;

test("allows the configured number of requests and returns retry time after the limit", () => {
  const now = 1_000_000;
  assert.equal(consumeRateLimit("client-a", 2, 60_000, now).allowed, true);
  assert.equal(consumeRateLimit("client-a", 2, 60_000, now + 1).allowed, true);
  const limited = consumeRateLimit("client-a", 2, 60_000, now + 2);
  assert.equal(limited.allowed, false);
  assert.equal(limited.retryAfterSeconds, 60);
});

test("starts a fresh window after the previous window expires", () => {
  const now = 2_000_000;
  assert.equal(consumeRateLimit("client-b", 1, 1000, now).allowed, true);
  assert.equal(consumeRateLimit("client-b", 1, 1000, now + 999).allowed, false);
  assert.equal(consumeRateLimit("client-b", 1, 1000, now + 1000).allowed, true);
});

test("keeps request counters separate by client key", () => {
  const now = 3_000_000;
  assert.equal(consumeRateLimit("client-c", 1, 1000, now).allowed, true);
  assert.equal(consumeRateLimit("client-d", 1, 1000, now).allowed, true);
});
