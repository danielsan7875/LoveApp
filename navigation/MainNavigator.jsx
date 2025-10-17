
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginForm from "./login"; // Ajusta la ruta si es diferente
import BodyCarrito from "./carrito";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Carrito" component={BodyCarrito} />
    </Stack.Navigator>
  );
}
