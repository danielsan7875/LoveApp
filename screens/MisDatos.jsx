import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


/*Pages - body*/
import BodyMisDatos from '../pages/MisDatos';
import Loader from '../componentes/Loader'

const MisDatos = () => {
  const [cargando, setCargando] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.container}>

          {/* --- BODY--- */}
        <BodyMisDatos
          activarCarga={()=>setCargando(true)}
          desactivarCarga={()=>setCargando(false)} 
        />
        
        {/* -----  LOADER  ----- */}
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

export default MisDatos;

