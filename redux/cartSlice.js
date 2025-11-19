import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Si el producto no tiene ID, generar uno
      if (!item.id) {
        item.id = Math.random().toString(36).substr(2, 9);
      }

      const existing = state.items.find(p => p.id === item.id);

      if (existing) {
        existing.cantidad = (existing.cantidad || 1) + 1;
      } else {
        state.items.push({
          ...item,
          cantidad: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
