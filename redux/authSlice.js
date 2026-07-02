import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  decodeJwtPayload,
  mergeUserProfiles,
  loadUserProfile,
  clearUserProfile,
  isSameProfile,
} from '../services/api';

const TOKEN_KEY = 'jwt_token';

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const storedUser = await loadUserProfile();
    let user = storedUser || null;

    if (token) {
      const payload = decodeJwtPayload(token);
      const jwtUser = payload?.data || null;
      const canUseStoredUser = isSameProfile(storedUser, jwtUser);
      user = mergeUserProfiles(jwtUser, canUseStoredUser ? storedUser : null) || user;
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
      clearUserProfile();
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