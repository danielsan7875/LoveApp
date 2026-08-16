import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import HearBarra from '../componentes/hear.jsx';
import LoginBarra from '../componentes/loginbarra.jsx';
import PopAlert from '../componentes/PopAlert.jsx';
/*Pages - body*/
import BodyHome from '../pages/home.jsx';


const Inicio = () => {
  const [alerta, setAlerta] = useState({ visible: false, texto: '' });

  const mostrarAlerta = (texto = "Agregado") => {
    setAlerta({ visible: true, texto });
    setTimeout(() => {
      setAlerta({ visible: false, texto: '' });
    }, 2000);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        
        <View style={styles.container}>

          {alerta.visible && (
            <View style={styles.alertContainer}>
              <PopAlert 
              text="Agregado al carrito" 
              iconName="cart" 
              color="#ffffff" 
              bgColor="#D81B60" 
            />
            </View>
          )}

          {/* --- CABECERA --- */}
          <HearBarra />
          {/* --- BARRA DE BÚSQUEDA Y LOGIN --- */}
          <LoginBarra />

          {/* --- BANNERS PROMOCIONALES Y PRODUCTOS --- */}
          <BodyHome onAgregar={() => mostrarAlerta("Agregado al carrito")} />
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
    backgroundColor: '#FFF1F2',
    position: 'relative', 
  },
  alertContainer: {
    position: 'absolute',
    top: 10, 
    alignSelf: 'center',
    zIndex: 99999, 
    elevation: 10,
  },
});
export default Inicio;




