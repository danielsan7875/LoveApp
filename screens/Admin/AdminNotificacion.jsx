import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
 


const AdminReporte  = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          
         

       <Text style={styles.title}>
        NOTIFICACIONES
       </Text>
         
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
    fontSize: 50,
    color: '#1f1f1fff',
    fontWeight: 'bold',
    padding:20,
  },
});
export default AdminReporte;




