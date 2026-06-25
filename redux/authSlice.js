import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt_token';

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    let user = null;
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) b64 += '=';
          let jsonPayload = null;
          if (typeof atob === 'function') {
            const decoded = atob(b64);
            jsonPayload = decodeURIComponent(Array.prototype.map.call(decoded, c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          } else if (typeof Buffer !== 'undefined') {
            jsonPayload = Buffer.from(b64, 'base64').toString('utf8');
          }
          if (jsonPayload) {
            const payload = JSON.parse(jsonPayload);
            user = payload?.data || null;
          }
        }
      } catch (e) {
        console.warn('initializeAuth: failed to parse token payload', e);
      }
    }
    return { token: token || null, user };
  } catch (e) {
    return { token: null, user: null };
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isLogged: false,
    status: 'idle',
    user: null
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload || null;
      state.isLogged = !!action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload || null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.isLogged = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => { state.status = 'loading'; })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.isLogged = !!action.payload?.token;
      })
      .addCase(initializeAuth.rejected, (state) => { state.status = 'idle'; state.token = null; state.isLogged = false; });
  }
});

export const { setToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
