import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

/* Componentes */
import HearBarra from '../componentes/hear.jsx';
import LoginBarra from '../componentes/loginbarra.jsx';
import Cards from '../componentes/Cards.jsx';
import ModalProducto from '../componentes/Modal';
import Categoria from '../componentes/categoriafiltro.jsx';
import api from '../services/api';



const Producto = ({ route }) => {
  const { query } = route?.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [resultados, setResultados] = useState([]);

  const isLogged = useSelector((state) => state.auth.isLogged);

  useEffect(() => {
    const cargarProductosRemotos = async () => {
      try {
        const data = await api.fetchProductos('activos'); 
        if (data && data.respuesta === 1 && Array.isArray(data.productos)) {
          setTodosLosProductos(data.productos);
          setResultados(data.productos); 
        } else {
          setTodosLosProductos([]);
          setResultados([]);
        }
      } catch (error) {
        console.warn("Error cargando productos remotos en la pantalla de listado:", error);
        setTodosLosProductos([]);
        setResultados([]);
      }
    };

    cargarProductosRemotos();
  }, [isLogged]);

  
  useEffect(() => {
    if (!query) {
      setResultados(todosLosProductos);
      return;
    }

    const filtrados = todosLosProductos.filter((p) =>
      p.nombre && p.nombre.toLowerCase().includes(query.toLowerCase())
    );

    setResultados(filtrados);
  }, [query, todosLosProductos]);

  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };


  useEffect(() => {
    const cargarCategoriasRemotas = async () => {
      try {
        const data = await api.fetchCategorias();
        if (data && data.respuesta === 1 && Array.isArray(data.categorias)) {
          setMisCategorias(data.categorias);
        }
      } catch (error) {
        console.warn("Error cargando categorías remotas:", error);
      }
    };

    cargarCategoriasRemotas();
  }, []);

  const [misCategorias, setMisCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const CategoriaPress = (categorianombre) => {
  const mismaCategoria = categorianombre === selectedCategory;

  if (mismaCategoria) {
    setSelectedCategory(null);
    setResultados(todosLosProductos);
    return;
  }

  setSelectedCategory(categorianombre);

  const filtrados = todosLosProductos.filter((producto) =>
    producto.nombre_categoria?.toLowerCase() === categorianombre.toLowerCase()
  );

  setResultados(filtrados);
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          <HearBarra />
          <LoginBarra />

          

          <Categoria 
              categories={misCategorias} 
              onSelectCategory={CategoriaPress} 
              selectedCategory={selectedCategory}
            />

          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>

              {resultados.length > 0 ? (
                resultados.map((prod) => (
                  <Cards
                    key={prod.id_producto} 
                    id={prod.id_producto}
                    foto={prod.imagenes} 
                    nombre={prod.nombre}
                    precioMayor={prod.precio_mayor} 
                    precioDetal={prod.precio_detal}
                    onPress={() => handleCardPress(prod)}
                  />
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 150, fontSize: 20, color: '#000000' }}>
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
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#D81B60', // Rosa oscuro
  },
});

export default Producto;