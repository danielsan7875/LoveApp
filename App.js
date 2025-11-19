import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./route/MainNavigator";
import Loader from './componentes/Loader';

import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

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
