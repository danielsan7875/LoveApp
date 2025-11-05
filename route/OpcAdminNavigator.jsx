import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminOpciones from '../screens/Admin/AdminOpciones';
import AdminReporte from '../screens/Admin/AdminReporte';
import AdminCompra from '../screens/Admin/AdminCompra';
import AdminReserva from '../screens/Admin/AdminReserva';
import AdminProveedor from '../screens/Admin/AdminProveedor';
import AdminCategoria from '../screens/Admin/AdminCategoria';
import AdminClientes from '../screens/Admin/AdminClientes';
import AdminMetodopago from '../screens/Admin/AdminMetodopago';
import AdminMetodoEntrega from '../screens/Admin/AdminMetodoEntrega';
import AdminBitacora from '../screens/Admin/AdminBitacora';
import AdminUsuarios from '../screens/Admin/AdminUsuarios';
import AdminTipoUuario from '../screens/Admin/AdminTipoUuario';



const Stack = createNativeStackNavigator();

export default function OpcionesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminOpciones"
        component={AdminOpciones}
        options={{ headerShown: false, title: 'Más Opciones' }}
      />

      <Stack.Screen
        name="Reporte"
        component={AdminReporte}
        options={{ headerShown: true, title: 'Reportes' }}
      />

      <Stack.Screen
        name="Compra"
        component={AdminCompra}
        options={{ headerShown: true, title: 'Compra' }}
      />

      <Stack.Screen
        name="Reserva"
        component={AdminReserva}
        options={{ headerShown: true, title: 'Reserva' }}
      />

      <Stack.Screen
        name="Proveedor"
        component={AdminProveedor}
        options={{ headerShown: true, title: 'Gestionar Proveedores' }}
      />

      <Stack.Screen
        name="Categoria"
        component={AdminCategoria}
        options={{ headerShown: true, title: 'Gestionar Categoria' }}
      />

      <Stack.Screen
        name="Clientes"
        component={AdminClientes}
        options={{ headerShown: true, title: 'Clientes' }}
      />

      <Stack.Screen
        name="MetodoPago"
        component={AdminMetodopago}
        options={{ headerShown: true, title: 'Gestionar Metodo Pago' }}
      />

      <Stack.Screen
        name="MetodoEntrega"
        component={AdminMetodoEntrega}
        options={{ headerShown: true, title: 'Gestionar Metodo Entrega' }}
      />

      <Stack.Screen
        name="Bitacora"
        component={AdminBitacora}
        options={{ headerShown: true, title: 'Bitacora' }}
      />

      <Stack.Screen
        name="Usuarios"
        component={AdminUsuarios}
        options={{ headerShown: true, title: 'Gestionar Usuario' }}
      />

      <Stack.Screen
        name="TipoUsuario"
        component={AdminTipoUuario}
        options={{ headerShown: true, title: 'Gestionar Tipo Usuario' }}
      />

      
    </Stack.Navigator>
  );
}
