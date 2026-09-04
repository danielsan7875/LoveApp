import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  intentosFallidosLogin: 0,
  tiempoDesbloqueo: null, 
};

const seguridadSlice = createSlice({
  name: 'seguridad',
  initialState,
  reducers: {
    registrarIntentoFallidoLogin: (state) => {
      state.intentosFallidosLogin += 1;
      
      // Si llega a 5 intentos fallidos, calculamos los 2 minutos de bloqueo
      if (state.intentosFallidosLogin >= 5) {
        const dosMinutosEnMs = 2 * 60 * 1000;
        state.tiempoDesbloqueo = Date.now() + dosMinutosEnMs;
      }
    },
    resetearIntentosLogin: (state) => {
      state.intentosFallidosLogin = 0;
      state.tiempoDesbloqueo = null;
    },
  },
});

export const { registrarIntentoFallidoLogin, resetearIntentosLogin } = seguridadSlice.actions;
export default seguridadSlice.reducer;