import React, { useState } from 'react';
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
import {productos} from '../informacion/productos';
import {promoBanners} from '../informacion/banners';

const { width } = Dimensions.get('window');

const BodyHome = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  const handleCardPress = (producto) => {
    setProductoActivo(producto);
    setModalVisible(true);
  };
  // --- RENDERIZADO DE ITEMS ---
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
      <View style={styles.cardsContainer}>
        {productos.map((prod, idx) => (
          <Cards
            key={idx}
            foto={prod.foto}
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
        );
};

const styles = StyleSheet.create({
scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
  },  
 // Banners
  bannerList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  bannerCard: {
    width: width * 0.8,
    height: 150,
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    marginRight: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
  },
  bannerImage: {
    width: '45%',
    height: '100%',
  },
  bannerTextContainer: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
  },
  bannerTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14
  },
  bannerDiscount: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 32,
      marginVertical: 5,
  },
  bannerTagline: {
      color: 'white',
      fontSize: 12
  },
   text: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});


export default BodyHome;