import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import HearBarra from '../../componentes/HearAdmin'; // si estás en /screens/admin/gestion/AdminHome.jsx



const AdminHome  = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          <HearBarra />
         

  <Text style={styles.title}>Bienvenido al Panel Administrativo</Text>
         <Text style={styles.title}>Producto</Text>
        </View>

    
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
    title: {
    fontSize: 20,
    color: '#000000ff',
    fontWeight: 'bold',
  },
});
export default AdminHome;




