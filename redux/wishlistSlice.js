import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchWishlistRemota, 
  agregarAWishlistRemota, 
  eliminarDeWishlistRemota, 
  vaciarWishlistRemota 
} from "../services/api";


export const obtenerWishlistRemotaThunk = createAsyncThunk(
  "wishlist/fetch",
  async (cedula, { rejectWithValue }) => {
    try {
      return await fetchWishlistRemota(cedula);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const agregarWishlistThunk = createAsyncThunk(
  "wishlist/add",
  async ({ cedula, producto }, { rejectWithValue, dispatch }) => {
    try {
      const response = await agregarAWishlistRemota(cedula, producto.id);
      if (response.status === 'success' || response.status === 'exists') {
        dispatch(obtenerWishlistRemotaThunk(cedula));
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarWishlistThunk = createAsyncThunk(
  "wishlist/remove",
  async ({ idLista, cedula }, { rejectWithValue, dispatch }) => {
    try {
      const response = await eliminarDeWishlistRemota(idLista);
      if (response.status === 'success') {
        dispatch(obtenerWishlistRemotaThunk(cedula));
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerWishlistRemotaThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(obtenerWishlistRemotaThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload.map(item => ({
          id_lista: item.id_lista,
          id: parseInt(item.id_producto),
          nombre: item.nombre,
          precioDetal: item.precio_detal,
          precioMayor: item.precio_mayor,
          foto: Array.isArray(item.imagenes)
            ? item.imagenes
            : item.imagen
              ? [{ url_imagen: item.imagen }]
              : [],
          imagenes: Array.isArray(item.imagenes)
            ? item.imagenes
            : item.imagen
              ? [{ url_imagen: item.imagen }]
              : [],
        }));
      })
      .addCase(obtenerWishlistRemotaThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;