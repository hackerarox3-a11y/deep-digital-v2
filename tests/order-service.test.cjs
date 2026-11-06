const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../services/order-service.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = {
  exports: {},
  URL,
  require: (specifier) => {
    assert.equal(specifier, "@/constants/site");
    return { site: { whatsappNumber: "2250141451620" } };
  },
};
vm.runInNewContext(compiled, context, { filename: "order-service.js" });
const { buildProductOrderWhatsAppMessage, buildProductOrderWhatsAppUrl } = context.exports;

const product = {
  id: "hoodie",
  name: "Hoodies",
  weight: "400 g/m²",
  label: "Ultra-Lourd",
  description: "Sweat premium",
  technique: "Broderie ou DTF",
  price: 17000,
  colors: ["Noir Onyx", "Rouge Deep"],
  image: "/hoodie.png",
  kind: "hoodie",
};

test("builds a WhatsApp order request containing the chosen product's details and image", () => {
  const url = new URL(buildProductOrderWhatsAppUrl(product, "https://deep-digital.example"));
  const message = url.searchParams.get("text");

  assert.equal(url.origin + url.pathname, "https://wa.me/2250141451620");
  assert.match(message, /Article : Hoodies/);
  assert.match(message, /Modèle sélectionné : Hoodies/);
  assert.match(message, /Image exacte du modèle : https:\/\/deep-digital\.example\/hoodie\.png/);
  assert.match(message, /17[\s\u202f]000 F CFA HT/);
  assert.match(message, /Technique recommandée : Broderie ou DTF/);
  assert.match(message, /Noir Onyx, Rouge Deep/);
  assert.match(message, /finaliser ma commande/);
});

test("keeps the image URL absolute when ordering from a nested product image path", () => {
  const url = new URL(buildProductOrderWhatsAppUrl({ ...product, image: "/df/hoodie.jpg" }, "https://shop.example/path/"));
  const message = url.searchParams.get("text");

  assert.match(message, /Image exacte du modèle : https:\/\/shop\.example\/df\/hoodie\.jpg/);
});

test("sends the selected T-shirt image and variant label instead of the default image", () => {
  const message = buildProductOrderWhatsAppMessage(
    { ...product, id: "tshirt", name: "T-Shirts", image: "/tshirt.png" },
    "https://deep-digital.example",
    "/mockups/tshirt-back.png",
    "Modèle vue arrière",
  );

  assert.match(message, /Modèle sélectionné : Modèle vue arrière/);
  assert.match(message, /Image exacte du modèle : https:\/\/deep-digital\.example\/mockups\/tshirt-back\.png/);
  assert.doesNotMatch(message, /Image exacte du modèle : https:\/\/deep-digital\.example\/tshirt\.png/);
});

test("includes the chosen standard size and color in the WhatsApp order", () => {
  const url = new URL(buildProductOrderWhatsAppUrl(
    { ...product, id: "hoodie", name: "Hoodies", colors: ["Noir", "Blanc"] },
    "https://deep-digital.example",
    product.image,
    product.name,
    { size: "XL", color: "Blanc" },
  ));
  const message = url.searchParams.get("text");

  assert.match(message, /Taille choisie : XL/);
  assert.match(message, /Couleur choisie : Blanc/);
  assert.match(message, /Technique recommandée : Broderie ou DTF/);
  assert.doesNotMatch(message, /Taille souhaitée : à préciser/);
});

test("includes the selected print method instead of only the product recommendation", () => {
  const message = buildProductOrderWhatsAppMessage(
    product,
    "https://deep-digital.example",
    product.image,
    product.name,
    { size: "M", color: "Noir", printMethod: "DTF" },
  );

  assert.match(message, /Mode d'impression choisi : DTF/);
  assert.doesNotMatch(message, /Technique recommandée : Broderie ou DTF/);
});
