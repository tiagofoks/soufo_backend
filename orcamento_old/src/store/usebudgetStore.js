import { create } from "zustand";

export const useBudgetStore = create((set) => ({
  items: [],
  prices: {
    day: 0,
    night: 0,
    perKm: 0,
  },

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateItem: (id, changes) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...changes } : i)),
    })),

  updatePrices: (newPrices) =>
    set((state) => ({
      prices: { ...state.prices, ...newPrices },
    })),
}));