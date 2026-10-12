
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./route/MainNavigator";
import Loader from './componentes/Loader';

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeAuth } from './redux/authSlice';
import { obtenerWishlistRemotaThunk } from './redux/wishlistSlice';

// Notificaciones push
import {
  setupNotificationSubscription,
  setNotificationHandler,
} from './services/notifications';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Inicialización original de LoveApp
  useEffect(() => {
    store.dispatch(initializeAuth()).unwrap().then(({ token, user }) => {
      if (token && user?.cedula && !user.codigo && user.autorizado !== true) {
        store.dispatch(obtenerWishlistRemotaThunk(user.cedula));
      }
    }).catch((error) => {
      console.warn('Error inicializando sesión:', error);
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Inicialización independiente de notificaciones
  useEffect(() => {
    let activo = true;
    let limpiarNotificaciones = null;

    try {
      // Configurar cómo se muestran las notificaciones
      setNotificationHandler();

      // Escuchar notificaciones recibidas y pulsadas
      setupNotificationSubscription()
        .then((limpiar) => {
          if (activo) {
            limpiarNotificaciones = limpiar;
          } else {
            limpiar?.();
          }
        })
        .catch((error) => {
          console.warn('Error al iniciar notificaciones:', error);
        });

    } catch (error) {
      console.warn('Error configurando notificaciones:', error);
    }

    return () => {
      activo = false;
      limpiarNotificaciones?.();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>

        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>

        <Loader visible={isLoading} texto="LoveMakeup C.A" />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
