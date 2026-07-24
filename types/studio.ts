import type { Product } from "@/types/catalogue";

export type StudioSide = "front" | "back";
export type StudioTool = "garment" | "color" | "type" | "photos" | "price";

export type StudioLayer = {
  id: string;
  name: string;
  type: "text" | "image";
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
  font?: string;
  visible: boolean;
};

export type StudioState = {
  product: Product;
  side: StudioSide;
  color: string;
  fabric: string;
  size: string;
  technique: string;
  zoom: number;
  rotation: number;
  showGrid: boolean;
  layers: StudioLayer[];
};
