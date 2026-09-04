import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


/*Pages - body*/
import BodyOlvido from '../pages/Olvidoclave';
import Loader from '../componentes/Loader';

const Olvidoclave = () => {
  const [cargando, setCargando] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#000000" />
        <View style={styles.container}>

          {/* Pasamos las funciones limpias para alterar el estado */}
          <BodyOlvido 
            activarCarga={() => setCargando(true)} 
            desactivarCarga={() => setCargando(false)} 
          />

          {/* El nuevo Loader se mantiene siempre declarado, él sabe cuándo mostrarse */}
          <Loader
            visible={cargando} 
            texto="Guardando Informacion..."
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
    backgroundColor: '#ffffff', // Un rosado muy claro de fondo
  },
});

export default Olvidoclave;

