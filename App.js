import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./route/MainNavigator";
import Loader from './componentes/Loader';

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeAuth } from './redux/authSlice';
import { obtenerWishlistRemotaThunk } from './redux/wishlistSlice';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

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