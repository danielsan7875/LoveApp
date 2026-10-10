import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  View,
  RefreshControl
} from 'react-native';

import Cards from '../componentes/Cards';
import Banner from '../componentes/Banner';
import ModalProducto from '../componentes/Modal';
import BrandSlider from '../componentes/seccionmarca.jsx';

import api from '../services/api';

import {
  promoBanners,
  misMarcas,
  banners
} from '../informacion/banners';

import BannerPublicidad from '../componentes/BannerPublicidad';

const { width } = Dimensions.get('window');

const BodyHome = ({ onAgregar }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [remoteProductos, setRemoteProductos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };

  // Cargar productos desde la API
  const loadRemote = async () => {
    try {
      const data = await api.fetchProductos('mas_vendidos');
      if (
        data &&
        data.respuesta === 1 &&
        Array.isArray(data.productos)
      ) {
        setRemoteProductos(data.productos);
        setLoadError(null);
      } else {
        setRemoteProductos([]);
        setLoadError('No se pudieron cargar los productos.');
      }
    } catch (e) {
      console.warn(
        'Fetch error en Home:',
        e.message || e
      );
      setLoadError('No se pudieron actualizar los productos.');
    }
  };

  useEffect(() => {
    loadRemote();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadRemote();
    } finally {
      setRefreshing(false);
    }
  };

  // --- RENDERIZADO DE BANNERS ---

  const renderBanner = ({ item }) => (
    <Banner
      title={item.title}
      discount={item.discount}
      tagline={item.tagline}
      image={item.image}
    />
  );

  return (

    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >

      {/* BANNER PUBLICITARIO */}

      <BannerPublicidad
        imagenes={banners}
      />

      {loadError && <Text style={styles.errorText}>{loadError}</Text>}

      {/* TITULO */}

      <View>
        <Text style={styles.text}>
          Productos más vendidos
        </Text>
      </View>

      {/* PRODUCTOS */}

      <View style={styles.cardsContainer}>

        {remoteProductos.map((prod) => (

          <Cards
            key={prod.id_producto}
            id={prod.id_producto}
            foto={prod.imagenes}
            nombre={prod.nombre}
            nombre_marca={prod.nombre_marca}
            precioMayor={prod.precio_mayor}
            precioDetal={prod.precio_detal}
            cantidadMayor={prod.cantidad_mayor}
            onPress={() => handleCardPress(prod)}
            onAgregar={onAgregar}
          />

        ))}

      </View>

      {/* MARCAS */}

      <BrandSlider
        brands={misMarcas}
        title="Lo Mejor de Nuestro Catálogo"
      />

      {/* MODAL */}

      <ModalProducto
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        producto={productoActivo}
      />

      {/* BANNERS */}

      <FlatList
        data={promoBanners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerList}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  scrollViewContent: {
    paddingBottom: 80,
  },

  bannerList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 4,
    color: '#333',
  },
  errorText: {
    marginHorizontal: 16,
    marginTop: 12,
    color: '#B00020',
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

});

export default BodyHome;