const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function readImagePaths(filePath) {
  const source = fs.readFileSync(path.join(root, filePath), "utf8");
  return [...source.matchAll(/src:\s*"([^"]+)"/g)].map((match) => match[1]);
}

test("the Realisations slideshow contains at least ten existing public images", () => {
  const images = readImagePaths("components/realisations.tsx");

  assert.ok(images.length >= 10, `Expected at least 10 images, received ${images.length}`);
  for (const image of images) {
    assert.ok(
      fs.existsSync(path.join(root, "public", image.replace(/^\/+/, ""))),
      `Missing Realisations image: ${image}`,
    );
  }
});

test("the T-shirt slideshow contains multiple existing public model images", () => {
  const images = readImagePaths("data/catalogue.ts");

  assert.ok(images.length >= 3, `Expected at least 3 T-shirt images, received ${images.length}`);
  for (const image of images) {
    assert.ok(
      fs.existsSync(path.join(root, "public", image.replace(/^\/+/, ""))),
      `Missing T-shirt model image: ${image}`,
    );
  }
});
