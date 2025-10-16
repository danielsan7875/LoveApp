import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import  NavBarra  from './componentes/nav.jsx';
import HearBarra from './componentes/hear.jsx';
import LoginBarra from './componentes/loginbarra.jsx';
/*Pages - body*/
import BodyHome from './pages/home.jsx';
 

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          <HearBarra />
          {/* --- BARRA DE BÚSQUEDA Y LOGIN --- */}
          <LoginBarra />
          {/* --- BANNERS PROMOCIONALES --- */}
          <BodyHome />
        </View>
        {/* --- BARRA DE NAVEGACIÓN INFERIOR --- */}
        <NavBarra />
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
export default App;




