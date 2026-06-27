import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Pages - body*/
import BodyOlvido from '../pages/Olvido';
import Loader from '../componentes/Loader';

const Olvido = () => {
  const [cargando, setCargando] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>

          {/* Pasamos las funciones limpias para alterar el estado */}
          <BodyOlvido 
            activarCarga={() => setCargando(true)} 
            desactivarCarga={() => setCargando(false)} 
          />

          {/* El nuevo Loader se mantiene siempre declarado, él sabe cuándo mostrarse */}
          <Loader
            visible={cargando} 
            texto="Verificando Informacion..."
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

export default Olvido;

