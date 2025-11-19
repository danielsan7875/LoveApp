
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginForm from "../screens/login"; // Ajusta la ruta si es diferente
import BodyCarrito from "../screens/carrito";
import BodyRegistro from "../screens/RegistroCliente";



import AdminNavigator from "./AdminNavigator";

import BodyPerfil from "../screens/Admin/AdminPerfil";
import BodyAyuda from "../screens/Admin/AdminAyuda";
import BodyNotificacion from "../screens/Admin/AdminNotificacion";



const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginForm}  options={{ headerShown: true, title: 'Iniciar Sessión / Regístrate'  }} />
      <Stack.Screen name="Carrito" component={BodyCarrito} options={{ headerShown: true, title: 'Carrito de compra'  }}/>
      <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
      
        <Stack.Screen name="ayuda" component={BodyAyuda} options={{ headerShown: true, title: 'Ayuda'  }}/>
          <Stack.Screen name="notificaciones" component={BodyNotificacion} options={{ headerShown: true, title: 'Notificaciones'  }}/>
            <Stack.Screen name="perfil" component={BodyPerfil} options={{ headerShown: true, title: 'Perfil'  }}/>
            <Stack.Screen name="registrarcliente" component={BodyRegistro} options={{ headerShown: true, title: 'Registro de Nuevo Cliente'  }}/>

    </Stack.Navigator>
  );
}
