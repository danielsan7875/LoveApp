import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  View
} from 'react-native';

import Cards from '../componentes/Cards';
import Banner from '../componentes/Banner';
import ModalProducto from '../componentes/Modal';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { promoBanners } from '../informacion/banners';

const { width } = Dimensions.get('window');

const BodyHome = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [remoteProductos, setRemoteProductos] = useState([]);

  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };

  const isLogged = useSelector(state => state.auth.isLogged);

  // Función limpia para cargar los productos desde la API con Axios
  const loadRemote = async () => {
    try {
      const data = await api.fetchProductos('mas_vendidos'); 
      if (data && data.respuesta === 1 && Array.isArray(data.productos)) {
        setRemoteProductos(data.productos);
      } else {
        setRemoteProductos([]);
      }
    } catch (e) {
      console.warn('Fetch error en Home', e.message || e);
      setRemoteProductos([]);
    }
  };

  useEffect(() => {
    loadRemote();
    
    api.debugServerHeaders()
      .then(r => console.log('debugServerHeaders Home', r))
      .catch(console.error);
  }, [isLogged]);

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
    <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
      {/* --- BANNERS PROMOCIONALES --- */}
      <FlatList
        data={promoBanners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerList}
      />

      <View>
        <Text style={styles.text}>Productos mas vendidos</Text>
      </View>
      
      {/* --- LISTADO DE PRODUCTOS REMOTOS --- */}
      <View style={styles.cardsContainer}>
        {remoteProductos.map((prod) => (
          <Cards
            key={prod.id_producto}
            id={prod.id_producto}
            foto={prod.imagenes} 
            nombre={prod.nombre}
            precioMayor={prod.precio_mayor} 
            precioDetal={prod.precio_detal}
            onPress={() => handleCardPress(prod)}
          />
        ))}
      </View>

      {/* --- MODAL CON EL CARRUSEL CORREGIDO --- */}
      <ModalProducto
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        producto={productoActivo}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default BodyHome;