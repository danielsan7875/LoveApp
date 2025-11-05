import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import HearBarraAdmin from '../../componentes/HearAdmin'; 

/*Pages - body*/
import BodyOpciones from '../../pages/OpcionesAdmin';


const AdminHome  = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          <HearBarraAdmin />
         
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
    title: {
    fontSize: 20,
    color: '#000000ff',
    fontWeight: 'bold',
  },
});
export default AdminHome;




