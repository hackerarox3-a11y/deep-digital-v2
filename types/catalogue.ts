export type PrintTechnique = "DTF" | "Sérigraphie" | "Broderie" | "Impression numérique";

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
};

export type MagazineOption = {
  pages: number;
  price: number;
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
  magazineOptions?: MagazineOption[];
  kind: "tshirt" | "hoodie" | "tote" | "polo" | "cap" | "sweatshirt" | "boxer" | "coussin" | "magazine" | "puzzle";
};
