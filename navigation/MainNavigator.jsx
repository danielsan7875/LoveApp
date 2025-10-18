
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginForm from "../route/login"; // Ajusta la ruta si es diferente
import BodyCarrito from "../route/carrito";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginForm}  options={{ headerShown: true }} />
      <Stack.Screen name="Carrito" component={BodyCarrito} options={{ headerShown: true }}/>
    </Stack.Navigator>
  );
}
