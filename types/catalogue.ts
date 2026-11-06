export type PrintTechnique = "DTF Premium" | "Sérigraphie" | "Broderie" | "Impression Numérique";

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
};

export type Product = {
  id: string;
  name: string;
  weight: string;
  label: string;
  description: string;
  technique: string;
  price: number;
  colors: string[];
  image?: string;
  images?: ProductImage[];
  kind: "tshirt" | "hoodie" | "tote" | "polo" | "cap" | "sweatshirt" | "boxer" | "coussin" | "magazine" | "puzzle";
};
