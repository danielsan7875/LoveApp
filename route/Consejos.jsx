import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


/*Pages - body*/



const Ubicacion = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>

         



          {/* --- BODY--- */}
          <Text style={styles.logoText}>consejo</Text>
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

export default Ubicacion;

