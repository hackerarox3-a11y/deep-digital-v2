const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Execute the production helper without installing a test framework or resolving
// Next.js aliases. Its imports are type-only and disappear on transpilation.
const source = fs.readFileSync(path.join(__dirname, "../lib/utils.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {}, structuredClone };
vm.runInNewContext(compiled, context, { filename: "utils.js" });
const { addDesignToCart } = context.exports;

function design(text = "LOGO A") {
  return {
    product: { id: "tshirt", name: "T-Shirts", weight: "240 g/m²", label: "Premium", description: "Coton", technique: "DTF", price: 16000, colors: ["Noir Onyx"], kind: "tshirt" },
    side: "front", color: "Noir Onyx", fabric: "Coton bio 240g", size: "M", technique: "DTF Premium",
    zoom: 1, rotation: 0, showGrid: false,
    layers: [{ id: "text-1", name: "Texte", type: "text", content: text, x: 50, y: 50, scale: 1, rotation: 0, color: "#fff", font: "Arial", visible: true }],
  };
}

test("regression: the previous criterion confuses different text designs", () => {
  const first = design("LOGO A");
  const second = design("LOGO B");
  const oldMatch = first.product.id === second.product.id && first.color === second.color && first.size === second.size && first.technique === second.technique;
  assert.equal(oldMatch, true, "the old match would increment the first design instead of storing the second");
  const cart = addDesignToCart(addDesignToCart([], first), second);
  assert.equal(cart.length, 2);
  assert.equal(cart[0].state.layers[0].content, "LOGO A");
  assert.equal(cart[1].state.layers[0].content, "LOGO B");
  assert.equal(cart[0].quantity, 1);
  assert.equal(cart[1].quantity, 1);
});

test("identical designs increment quantity without mutating the previous cart", () => {
  const original = addDesignToCart([], design());
  const updated = addDesignToCart(original, design());
  assert.equal(updated.length, 1);
  assert.equal(updated[0].quantity, 2);
  assert.equal(original[0].quantity, 1);
});

test("zoom, preview rotation, grid, layer IDs and names do not split a design", () => {
  const second = design();
  Object.assign(second, { zoom: 1.3, rotation: 45, showGrid: true });
  Object.assign(second.layers[0], { id: "another-id", name: "Renamed" });
  assert.equal(addDesignToCart(addDesignToCart([], design()), second)[0].quantity, 2);
});

for (const [name, change] of Object.entries({
  color: (s) => { s.color = "Blanc Optique"; },
  fabric: (s) => { s.fabric = "Autre tissu"; },
  size: (s) => { s.size = "L"; },
  technique: (s) => { s.technique = "Broderie"; },
  side: (s) => { s.side = "back"; },
  position: (s) => { s.layers[0].x = 60; },
  scale: (s) => { s.layers[0].scale = 1.5; },
  rotation: (s) => { s.layers[0].rotation = 30; },
  font: (s) => { s.layers[0].font = "Georgia"; },
  textColor: (s) => { s.layers[0].color = "#000"; },
  visibility: (s) => { s.layers[0].visible = false; },
  price: (s) => { s.product.price = 19000; },
  layerOrder: (s) => { s.layers.reverse(); },
})) {
  test(`different ${name} stays separate`, () => {
    const first = design();
    first.layers.push({ ...first.layers[0], id: "text-2", content: "SECOND" });
    const second = structuredClone(first);
    change(second);
    assert.equal(addDesignToCart(addDesignToCart([], first), second).length, 2);
  });
}

test("different uploaded images stay separate", () => {
  const first = design();
  Object.assign(first.layers[0], { type: "image", content: "data:image/png;base64,AAAA" });
  const second = structuredClone(first);
  second.layers[0].content = "data:image/png;base64,BBBB";
  assert.equal(addDesignToCart(addDesignToCart([], first), second).length, 2);
});

test("new entries snapshot the design independently of the editor", () => {
  const state = design();
  const cart = addDesignToCart([], state);
  state.layers[0].content = "EDITED";
  state.product.price = 1;
  assert.equal(cart[0].state.layers[0].content, "LOGO A");
  assert.equal(cart[0].state.product.price, 16000);
});
