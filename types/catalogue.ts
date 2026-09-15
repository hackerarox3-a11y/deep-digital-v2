export type PrintTechnique = "DTF Premium" | "Sérigraphie" | "Broderie" | "Impression Numérique";

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
  kind: "tshirt" | "hoodie" | "tote" | "polo" | "cap" | "sweatshirt" | "boxer" | "coussin" | "magazine" | "puzzle";
};
