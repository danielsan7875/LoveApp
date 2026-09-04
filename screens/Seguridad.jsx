import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Pages - body*/
import BodySeguridad from '../pages/Seguridad';
import Loader from '../componentes/Loader';


const Seguridad = () => {
  const [cargando, setCargando] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.container}>

        {/* --- BODY--- */}
         <BodySeguridad
          activarCarga={() => setCargando(true)} 
          desactivarCarga={() => setCargando(false)} 
        /> 
        {/*Loader*/}
        <Loader
          visible={cargando} 
          texto="Actualizando..."
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
});

export default Seguridad;

