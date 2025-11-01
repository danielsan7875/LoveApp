import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Opciones from '../screens/opciones';
import MisDeseos from '../screens/MisDeseos';
import MisPedido from '../screens/MisPedido';
import Consejos from '../screens/Consejos';
import MisDatos from '../screens/MisDatos';
import Seguridad from '../screens/Seguridad';
import Cerrar from '../screens/home';

const Stack = createNativeStackNavigator();

export default function OpcionesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OpcionesHome"
        component={Opciones}
        options={{ headerShown: false,  title: 'Mas Opciones'  }}
      />
      <Stack.Screen
        name="MisDeseos"
        component={MisDeseos}
        options={{ headerShown: true, title: 'Mis Lista de Deseos' }}
      />
      <Stack.Screen
        name="MisPedido"
        component={MisPedido}
        options={{ headerShown: true, title: 'Mis Pedidos' }}
      />
       <Stack.Screen
        name="Consejos"
        component={Consejos}
        options={{  headerShown: true, title: 'Consejos' }}
      />
      <Stack.Screen
        name="MisDatos"
        component={MisDatos}
        options={{ headerShown: true, title: 'Mis Datos' }}
      />
      <Stack.Screen
        name="Seguridad"
        component={Seguridad}
        options={{ headerShown: true, title: 'Seguridad' }}
      />
       <Stack.Screen
        name="cerrar"
        component={Cerrar}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}
