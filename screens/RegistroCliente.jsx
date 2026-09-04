import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


/*Pages - body*/
import BodyRegistro from '../pages/RegistroCliente';
import Loader from '../componentes/Loader';

const Cliente = () => {
  const [cargando, setCargando] = useState(false);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.container}>


          {/* --- BODY--- */}
          <BodyRegistro
            activarCarga={() => setCargando(true)} 
            desactivarCarga={() => setCargando(false)} 
          />

          <Loader
              visible={cargando} 
              texto="Registrando ..."
          />
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

export default Cliente;

