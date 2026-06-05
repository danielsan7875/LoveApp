import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt_token';

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token || null;
  } catch (e) {
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isLogged: false,
    status: 'idle'
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload || null;
      state.isLogged = !!action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.isLogged = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => { state.status = 'loading'; })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload;
        state.isLogged = !!action.payload;
      })
      .addCase(initializeAuth.rejected, (state) => { state.status = 'idle'; state.token = null; state.isLogged = false; });
  }
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
