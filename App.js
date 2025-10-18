import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./navigation/MainNavigator";
import Loader from './componentes/Loader';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
  return (
    <SafeAreaProvider>
      {isLoading ? (
        <Loader onFinish={() => setIsLoading(false)} />
      ) : (
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
};

export default App;