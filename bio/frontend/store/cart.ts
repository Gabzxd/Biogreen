// frontend/store/cart.ts
import { create } from "zustand";

type Item = { productId: string; name: string; priceCents: number; quantity: number };

export const useCart = create<{
  items: Item[];
  add: (i: Item) => void;
  remove: (productId: string) => void;
  clear: () => void;
}>((set) => ({
  items: [],
  add: (i) => set((s) => {
    const exists = s.items.find((x) => x.productId === i.productId);
    return {
      items: exists
        ? s.items.map((x) =>
            x.productId === i.productId ? { ...x, quantity: x.quantity + i.quantity } : x
          )
        : [...s.items, i],
    };
  }),
  remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
  clear: () => set({ items: [] }),
}));