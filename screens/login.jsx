import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/


/*Pages - body*/
import BodyLogin from '../pages/login.jsx';
import Loader from '../componentes/Loader';


const Inicio = () => {
  const [cargando, setCargando] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          
       
          <BodyLogin
            activarCarga={() => setCargando(true)} 
            desactivarCarga={() => setCargando(false)} 
          />

           <Loader
              visible={cargando} 
              texto="Ingresando ..."
            />
        </View>
        {/* --- BARRA DE NAVEGACIÓN INFERIOR --- */}

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
export default Inicio;




