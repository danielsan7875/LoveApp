import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Opciones from '../route/opciones';
import MisDeseos from '../route/MisDeseos';
import MisPedido from '../route/MisPedido';
import Consejos from '../route/Consejos';
import MisDatos from '../route/MisDatos';
import Seguridad from '../route/Seguridad';

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
    </Stack.Navigator>
  );
}
