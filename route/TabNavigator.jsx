import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux"; 
import OpcionesNavigator from "./OpcNavigator";
import BodyHome from "../screens/home";
import BodyProducto from "../screens/producto";
import BodyUbicacion from "../screens/ubicacion";
import BodyContacto from "../screens/contacto";

import NavBarra from "../componentes/nav";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const isLogged = useSelector((state) => state.auth.isLogged);

  return (
    <Tab.Navigator 
      tabBar={(props) => <NavBarra {...props} />}
      backBehavior="initialRoute"
    >
      <Tab.Screen name="Inicio" component={BodyHome} options={{ headerShown: false, title: 'Inicio | LoveMakeup C.A' }} />
      <Tab.Screen name="Producto" component={BodyProducto} options={{ headerShown: false, title: 'Producto | LoveMakeup C.A' }} />
      <Tab.Screen name="Ubicacion" component={BodyUbicacion} options={{ headerShown: false, title: 'Ubicacion | LoveMakeup C.A ' }} />
      <Tab.Screen name="Contacto" component={BodyContacto} options={{ headerShown: false, title: 'Contacto | LoveMakeup C.A' }} />
      {isLogged && (
        <Tab.Screen name="Más Opciones" component={OpcionesNavigator} options={{ headerShown: false, title: 'Mas Opciones' }}/>
      )}
    </Tab.Navigator>
  );
}