import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HeaderTitulo from '../componentes/Headertitulo'; 

/*Pages - body*/
import BodyMispedidos from '../pages/Mispedidos.jsx';
import Loader from '../componentes/Loader';


const MisPedido = () => {
  const [cargando, setCargando] = useState(false);
  return (
  <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        

        {/* --- BODY--- */}
         <BodyMispedidos
          activarCarga={() => setCargando(true)} 
          desactivarCarga={() => setCargando(false)} 
        /> 
        {/*Loader*/}
        <Loader
          visible={cargando} 
          texto="Actualizando..."
        />
        
       
    
      </SafeAreaView>
    </SafeAreaProvider>
     );
};

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#FFF1F2',
     paddingHorizontal: 12,
     paddingVertical: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
});

export default MisPedido;