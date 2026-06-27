
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginForm from "../screens/login"; // Ajusta la ruta si es diferente
import BodyCarrito from "../screens/carrito";
import BodyRegistro from "../screens/RegistroCliente";
import BodyOlvido from "../screens/Olvido";
import BodyOlvidocodigo from "../screens/Olvidocodigo";
import BodyOlvidoclave from "../screens/Olvidoclave";
import BodyMetodoenvio from "../screens/Metodoenvio";
import BodyMetodopago from "../screens/Metodopago";
import BodyConfirmar from "../screens/Confimarpedido";


const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginForm}  options={{ headerShown: true, title: 'Iniciar Sessión / Regístrate'  }} />
      <Stack.Screen name="Carrito" component={BodyCarrito} options={{ headerShown: true, title: 'Carrito de compra'  }}/>
     
            <Stack.Screen name="registrarcliente" component={BodyRegistro} options={{ headerShown: true, title: 'Registro de Nuevo Cliente'  }}/>
            <Stack.Screen name="Olvido" component={BodyOlvido} options={{ headerShown: false, title: 'Olvido de Contraseña'  }}/>
            <Stack.Screen name="Olvidocodigo" component={BodyOlvidocodigo} options={{ headerShown: false, title: 'Codigo de verificacion'  }}/>
            <Stack.Screen name="Olvidoclave" component={BodyOlvidoclave} options={{ headerShown: false, title: 'contraseña nueva'  }}/>
            <Stack.Screen name="Metodoenvio" component={BodyMetodoenvio} options={{ headerShown: true, title: 'Metodo de Entrega'  }}/>
            <Stack.Screen name="Metodopago" component={BodyMetodopago} options={{ headerShown: true, title: 'Metodo de Pago'  }}/>
            <Stack.Screen name="Confirmarpedido" component={BodyConfirmar} options={{ headerShown: false, title: 'Metodo de Pago'  }}/>

    </Stack.Navigator>
  );
}
