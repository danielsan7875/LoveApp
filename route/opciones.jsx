import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import HearBarra from '../componentes/hear.jsx';
import LoginBarra from '../componentes/loginbarra.jsx';

/*Pages - body*/
import BodyOpciones from '../pages/opciones.jsx';


const Opciones = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          <HearBarra />
          {/* --- BARRA DE BÚSQUEDA Y LOGIN --- */}
          <LoginBarra />
          <BodyOpciones />
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
 logoText: {
      fontSize: 60,
      fontWeight: 'bold',
      color: '#D81B60', // Rosa oscuro
  },
});

export default Opciones;

