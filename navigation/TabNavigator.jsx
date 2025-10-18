import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OpcionesNavigator from "./OpcNavigator";
import BodyHome from "../route/home";
import BodyProducto from "../route/producto";
import BodyUbicacion from "../route/ubicacion";
import BodyContacto from "../route/contacto";

import NavBarra from "../componentes/nav";
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <NavBarra {...props} />}>
      <Tab.Screen name="Inicio" component={BodyHome} options={{ headerShown: false, title: 'Inicio | LoveMakeup C.A'  }} />
      <Tab.Screen name="Producto" component={BodyProducto} options={{ headerShown: false, title: 'Producto | LoveMakeup C.A'  }} />
      <Tab.Screen name="Ubicacion" component={BodyUbicacion} options={{ headerShown: false, title: 'Ubicacion | LoveMakeup C.A '  }} />
      <Tab.Screen name="Contacto" component={BodyContacto} options={{ headerShown: false, title: 'Contacto | LoveMakeup C.A'  }} />
     <Tab.Screen name="Más Opciones" component={OpcionesNavigator} options={{ headerShown: false, title: 'Mas Opciones'  }}/>
    </Tab.Navigator>
  );
}
