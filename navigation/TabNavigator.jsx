import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BodyHome from "./home";
import BodyProducto from "./producto";
import BodyUbicacion from "./ubicacion";
import BodyContacto from "./contacto";
import BodyOpciones from "./opciones";

import NavBarra from "../componentes/nav";
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <NavBarra {...props} />}>
      <Tab.Screen name="Inicio" component={BodyHome} options={{ headerShown: false }} />
      <Tab.Screen name="Producto" component={BodyProducto} options={{ headerShown: false }} />
      <Tab.Screen name="Ubicacion" component={BodyUbicacion} options={{ headerShown: false }} />
      <Tab.Screen name="Contacto" component={BodyContacto} options={{ headerShown: false }} />
      <Tab.Screen name="Más Opciones" component={BodyOpciones} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
