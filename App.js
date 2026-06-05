import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./route/MainNavigator";
import Loader from './componentes/Loader';

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initializeAuth } from './redux/authSlice';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Initialize auth state from AsyncStorage on app start
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {isLoading ? (
          <Loader onFinish={() => setIsLoading(false)} />
        ) : (
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        )}
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
