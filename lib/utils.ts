import type { CartItem, StudioState } from "@/types/studio";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " F CFA";
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** View settings and editor-only layer IDs do not define a customer's design. */
export function designKey(state: StudioState) {
  return JSON.stringify({
    product: state.product.id,
    color: state.color,
    size: state.size,
    fabric: state.fabric,
    technique: state.technique,
    side: state.side,
    layers: state.layers.map((layer) => ({
      type: layer.type,
      content: layer.content,
      x: layer.x,
      y: layer.y,
      scale: layer.scale,
      rotation: layer.rotation,
      color: layer.color,
      font: layer.font,
      visible: layer.visible,
    })),
  });
}

export function addDesignToCart(items: CartItem[], state: StudioState): CartItem[] {
  const key = designKey(state);
  // Keep separately quoted prices separate too: never silently reuse an old price.
  const index = items.findIndex((item) =>
    item.state.product.price === state.product.price && designKey(item.state) === key,
  );
  if (index === -1) return [...items, { state: structuredClone(state), quantity: 1 }];
  return items.map((item, itemIndex) => itemIndex === index
    ? { ...item, quantity: item.quantity + 1 }
    : item);
}
