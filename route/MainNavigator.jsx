
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginForm from "../screens/login"; // Ajusta la ruta si es diferente
import BodyCarrito from "../screens/carrito";
import AdminNavigator from "./AdminNavigator";


const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginForm}  options={{ headerShown: true, title: 'Iniciar Sessión / Regístrate'  }} />
      <Stack.Screen name="Carrito" component={BodyCarrito} options={{ headerShown: true, title: 'Carrito de compra'  }}/>
      <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
