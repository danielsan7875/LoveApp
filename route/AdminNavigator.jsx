import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminOpciones from "./OpcAdminNavigator";
import AdminHome from '../screens/Admin/AdminHome';
import AdminProductos from '../screens/Admin/AdminProductos';
import AdminVenta from '../screens/Admin/AdminVenta';
import AdminPedidos from '../screens/Admin/AdminPedidosWeb';

import NavAdmin from '../componentes/NavAdmin'; // tu barra personalizada para admin

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <NavAdmin {...props} />}>
      <Tab.Screen
        name="Inicio"
        component={AdminHome}
        options={{ headerShown: false, title: 'Panel | LoveMakeup C.A' }}
      />
      <Tab.Screen
        name="Productos"
        component={AdminProductos}
        options={{ headerShown: false, title: 'Usuarios | LoveMakeup C.A' }}
      />
      <Tab.Screen
        name="Venta"
        component={AdminVenta}
        options={{ headerShown: false, title: 'Inventario | LoveMakeup C.A' }}
      />
      <Tab.Screen
        name="PedidosWeb"
        component={AdminPedidos}
        options={{ headerShown: false, title: 'Pedidos | LoveMakeup C.A' }}
      />
      <Tab.Screen
        name="Más Opciones"
        component={AdminOpciones}
        options={{ headerShown: false, title: 'Mas Opciones'  }}/>
     
    </Tab.Navigator>
  );
}
