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



const Producto = ({ route }) => {
  const { query } = route?.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  const [resultados, setResultados] = useState(productos2);
  React.useEffect(() => {
    if (!query) {
      setResultados(productos2);
      return;
    }

    const filtrados = productos2.filter((p) =>
      p.nombre.toLowerCase().includes(query.toLowerCase())
    );

    setResultados(filtrados);
  }, [query]);


  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          <HearBarra />
          <LoginBarra />

          <Text style={styles.logoText}>
            {query ? `Resultados: ${query}` : "Productos"}
          </Text>

          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>

              {resultados.length > 0 ? (
                resultados.map((prod) => (
                  <Cards
                    key={prod.id}
                    foto={prod.fotos}
                    nombre={prod.nombre}
                    precioMayor={prod.precioMayor}
                    precioDetal={prod.precioDetal}
                    onPress={() => handleCardPress(prod)}
                  />
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
                  No se encontraron productos
                </Text>
              )}

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

