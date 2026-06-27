import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./route/MainNavigator";
import Loader from './componentes/Loader';

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeAuth } from './redux/authSlice';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    store.dispatch(initializeAuth());

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