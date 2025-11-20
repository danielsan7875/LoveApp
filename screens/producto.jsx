import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/*Componenetes*/
import HearBarra from '../componentes/hear.jsx';
import LoginBarra from '../componentes/loginbarra.jsx';
import Cards from '../componentes/Cards.jsx';
import {productos2} from '../informacion/productos';
import ModalProducto from '../componentes/Modal';

/*Pages - body*/



const Producto = () => {
  const [modalVisible, setModalVisible] = useState(false);
    const [productoActivo, setProductoActivo] = useState(null);
  
    const handleCardPress = (producto) => {
      setProductoActivo(producto);
      setModalVisible(true);
    };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          {/* --- CABECERA --- */}
          <HearBarra />
          {/* --- BARRA DE BÚSQUEDA Y LOGIN --- */}
          <LoginBarra />
          {/* --- BODY--- */}
          <Text style={styles.logoText}>Productos</Text>
           <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
      <View style={styles.cardsContainer}>
        {productos2.map((prod) => (
          <Cards
            key={prod.id}
            foto={prod.fotos}
            nombre={prod.nombre}
            precioMayor={prod.precioMayor}
            precioDetal={prod.precioDetal}
            onPress={() => handleCardPress(prod)}
          />
        ))}
      </View>
      <ModalProducto
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        producto={productoActivo}
      />
                </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
  },  
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
 logoText: {
      fontSize: 40,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#D81B60', // Rosa oscuro
  },
});

export default Producto;

