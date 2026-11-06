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

test("includes the selected magazine page count and matching price in the WhatsApp order", () => {
  const magazine = {
    ...product,
    id: "magazine",
    name: "Magazine",
    kind: "magazine",
    price: 18000,
    colors: [],
    magazineOptions: [
      { pages: 10, price: 18000 },
      { pages: 16, price: 25000 },
      { pages: 32, price: 38000 },
    ],
  };
  for (const option of magazine.magazineOptions) {
    const message = buildProductOrderWhatsAppMessage(
      magazine,
      "https://deep-digital.example",
      magazine.image,
      magazine.name,
      { pages: option.pages },
    );

    assert.match(message, new RegExp(`Format choisi : ${option.pages} pages`));
    assert.match(message, new RegExp(`Prix indicatif : ${option.price.toLocaleString("fr-FR").replace(/\s/g, "[\\s\\u202f]")} F CFA`));
    assert.doesNotMatch(message, /Couleurs disponibles/);
    assert.doesNotMatch(message, /Taille souhaitée/);
  }
});

test("does not invent size, color, or print selections for products without those options", () => {
  const tote = {
    ...product,
    id: "tote",
    name: "Sacs en toile",
    kind: "tote",
    technique: "DTF ou Impression Numérique",
  };

  const message = buildProductOrderWhatsAppMessage(tote, "https://deep-digital.example");

  assert.doesNotMatch(message, /Taille choisie|Taille souhaitée|Couleur choisie|Mode d'impression choisi/);
  assert.match(message, /Technique recommandée : DTF ou Impression Numérique/);
});
