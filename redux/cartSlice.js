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
      const stock = Number(item.stock_disponible);
      const hayLimite = Number.isFinite(stock);

      if (existing) {
        const nueva = (existing.cantidad || 1) + 1;
        // Verificación de stock: no permitir superar las unidades disponibles
        if (hayLimite && nueva > stock) {
          return;
        }
        existing.cantidad = nueva;
        if (hayLimite) {
          existing.stock_disponible = stock;
        }
      } else {
        // Si el producto no tiene stock, no se agrega
        if (hayLimite && stock < 1) {
          return;
        }
        state.items.push({
          ...item,
          cantidad: 1,
        });
      }
    },

    // Aumenta (delta: 1) o disminuye (delta: -1) la cantidad de un producto del carrito.
    // La verificación de stock también se aplica aquí como red de seguridad.
    updateCantidad: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.items.find((p) => p.id === id);
      if (!item) return;

      const stock = Number(item.stock_disponible);
      const nueva = (item.cantidad || 1) + delta;

      // No bajar de 1 (para eliminar el producto está el botón X)
      if (nueva < 1) return;
      // No subir por encima del stock disponible
      if (delta > 0 && Number.isFinite(stock) && nueva > stock) return;

      item.cantidad = nueva;
    },

    // Sincroniza el stock real (desde la API) con los productos del carrito:
    // actualiza stock_disponible y ajusta la cantidad si esta supera el stock.
    sincronizarStock: (state, action) => {
      const productos = Array.isArray(action.payload) ? action.payload : [];

      state.items.forEach((item) => {
        const prod = productos.find(
          (p) => String(p?.id_producto ?? p?.id) === String(item.id)
        );
        if (!prod) return;

        const stock = Number(prod.stock_disponible);
        if (!Number.isFinite(stock)) return;

        item.stock_disponible = stock;

        if (stock < 1) {
          // Producto agotado: se quita del carrito
          item.cantidad = 0;
        } else if (item.cantidad > stock) {
          item.cantidad = stock;
        }
      });

      // Eliminar los productos que quedaron agotados
      state.items = state.items.filter((p) => p.cantidad !== 0);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCantidad, sincronizarStock, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
