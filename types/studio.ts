import type { Product } from "@/types/catalogue";

export type StudioState = {
  product: Product;
  side: "front" | "back";
  color: string;
  fabric: string;
  size: string;
  technique: string;
  zoom: number;
  rotation: number;
  showGrid: boolean;
  layers: StudioLayer[];
};

export type StudioLayer = { id: string; name: string; type: "text" | "image"; content: string; x: number; y: number; scale: number; rotation: number; color?: string; font?: string; visible: boolean };
export type StudioTool = "garment" | "color" | "compose" | "type" | "photos" | "price";
export type CartItem = { state: StudioState; quantity: number };
