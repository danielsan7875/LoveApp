import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
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
import PopAlert from '../componentes/PopAlert.jsx';


const Producto = ({ route }) => {
  const { query } = route?.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 16;
  const productosScrollRef = useRef(null);

  const [misCategorias, setMisCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const normalizarTexto = (valor) =>
    String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();


  // -- Alerta Pop para avisar al carrito
  const [alerta, setAlerta] = useState(false);
  const mostrarAlerta = () => {
    setAlerta(true);
    setTimeout(() => setAlerta(false), 2000);
  }
  // -- Alerta Pop


  const cargarProductosRemotos = useCallback(async () => {
    try {
      const data = await api.fetchProductos('activos');

      if (data && data.respuesta === 1 && Array.isArray(data.productos)) {
        setTodosLosProductos(data.productos);
        setResultados(data.productos);
        return true;
      }

      setTodosLosProductos([]);
      setResultados([]);
      return false;
    } catch (error) {
      console.warn(
        "Error cargando productos remotos:",
        error.response?.data || error.message
      );
      return false;
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  const cargarCategoriasRemotas = useCallback(async () => {
    try {
      const data = await api.fetchCategorias();
      if (data && data.respuesta === 1 && Array.isArray(data.categorias)) {
        setMisCategorias(data.categorias);
        return true;
      }
      return false;
    } catch (error) {
      console.warn("Error cargando categorías remotas:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    cargarProductosRemotos();
    cargarCategoriasRemotas();
  }, [cargarProductosRemotos, cargarCategoriasRemotas]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
      const results = await Promise.all([
        cargarProductosRemotos(),
        cargarCategoriasRemotas(),
      ]);
      if (results.some((success) => !success)) {
        setLoadError('No se pudieron actualizar todos los datos del catálogo.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const textoBusqueda = normalizarTexto(query);
    const filtrados = todosLosProductos.filter((producto) => {
      const coincideBusqueda = !textoBusqueda ||
        normalizarTexto(producto.nombre).includes(textoBusqueda);
      const coincideCategoria = !selectedCategory ||
        String(producto.id_categoria) === String(selectedCategory.id_categoria);

      return coincideBusqueda && coincideCategoria;
    });

    setResultados(filtrados);
    setPaginaActual(1);
    requestAnimationFrame(() => {
      productosScrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, [query, todosLosProductos, selectedCategory]);

  const totalPaginas = Math.ceil(resultados.length / productosPorPagina);
  const productosVisibles = resultados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };

  const CategoriaPress = (categoria) => {
    const mismaCategoria = categoria.id_categoria === selectedCategory?.id_categoria;

    if (mismaCategoria) {
      setSelectedCategory(null);
      return;
    }

    setSelectedCategory(categoria);
  };

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
    requestAnimationFrame(() => {
      productosScrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          <HearBarra />
          <LoginBarra />

          {alerta && (
            <View style={styles.alertContainer}>
              <PopAlert
                text="Agregado al carrito"
                iconName="cart"
                color="#ffffff"
                bgColor="#D81B60"
              />
            </View>
          )}

          <Categoria
            categories={misCategorias}
            onSelectCategory={CategoriaPress}
            selectedCategory={selectedCategory}
          />

          <ScrollView
            ref={productosScrollRef}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            <View style={styles.cardsContainer}>

              {loadError && <Text style={styles.errorText}>{loadError}</Text>}

              {cargandoProductos ? (
                <ActivityIndicator size="large" color="#D81B60" style={{ marginTop: 20 }} />
              ) : resultados.length > 0 ? (
                productosVisibles.map((prod) => (
                  <Cards
                    key={prod.id_producto}
                    id={prod.id_producto}
                    nombre_marca={prod.nombre_marca}
                    foto={prod.imagenes}
                    nombre={prod.nombre}
                    precioMayor={prod.precio_mayor}
                    precioDetal={prod.precio_detal}
                    cantidadMayor={prod.cantidad_mayor}
                    onPress={() => handleCardPress(prod)}
                    onAgregar={mostrarAlerta}
                  />
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 150, fontSize: 20, color: '#000000' }}>
                  No se encontraron productos
                </Text>
              )}

            </View>

            {totalPaginas > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, paginaActual === 1 && styles.disabledButton]}
                  onPress={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                >
                  <Text style={styles.paginationButtonText}>Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>
                  Página {paginaActual} de {totalPaginas}
                </Text>
                <TouchableOpacity
                  style={[styles.paginationButton, paginaActual === totalPaginas && styles.disabledButton]}
                  onPress={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                >
                  <Text style={styles.paginationButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            )}

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
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  paginationButton: {
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#D81B60',
  },
  disabledButton: {
    opacity: 0.4,
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paginationText: {
    color: '#333333',
    fontWeight: '600',
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
  errorText: {
    width: '100%',
    marginTop: 12,
    textAlign: 'center',
    color: '#B00020',
  },
  alertContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 9999,
    elevation: 5,
  },
});

export default Producto;