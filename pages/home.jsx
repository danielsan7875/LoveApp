import React from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- DATOS DE MUESTRA ---
const promoBanners = [
  {
    id: '1',
    title: 'EXCLUSIVO PRIMERA COMPRA',
    discount: '15%',
    tagline: 'SOLO DELIVERY',
    image: 'https://placehold.co/400x200/FFC0CB/333333?text=Producto+1',
  },
  {
    id: '2',
    title: 'EXCLUSIVO PRIMERA COMPRA',
    discount: '15%',
    tagline: 'SOLO DELIVERY',
    image: 'https://placehold.co/400x200/FFB6C1/333333?text=Producto+2',
  },
  {
    id: '3',
    title: 'OFERTAS DE LA SEMANA',
    discount: '20%',
    tagline: 'EN SELECCIONADOS',
    image: 'https://placehold.co/400x200/FF69B4/FFFFFF?text=Producto+3',
  },
];

const categories = [
  {
    id: '1',
    title: 'Hasta 20% Dcto. en Dulces y Snacks',
    discount: '20%',
    image: 'https://placehold.co/200x200/FFC0CB/333333?text=Snacks',
  },
  {
    id: '2',
    title: 'Cesta de Bienestar Genven a men...',
    discount: null,
    image: 'https://placehold.co/200x200/FFB6C1/333333?text=Bienestar',
  },
  {
    id: '3',
    title: 'Hasta 25% Dcto. Cuidado del Cabello',
    discount: '25%',
    image: 'https://placehold.co/200x200/FF69B4/FFFFFF?text=Cabello',
  },
  {
    id: '4',
    title: 'Hasta 30% Dcto. Cuidado Facial',
    discount: '30%',
    image: 'https://placehold.co/200x200/DB7093/FFFFFF?text=Facial',
  },
];

const BodyHome = () => {
  // --- RENDERIZADO DE ITEMS ---
  const renderBanner = ({ item }) => (
    <View style={styles.bannerCard}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="contain" />
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerDiscount}>
          <Text style={{ fontSize: 16 }}>HASTA</Text> {item.discount}
        </Text>
        <Text style={styles.bannerTagline}>{item.tagline}</Text>
      </View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Hasta {item.discount}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.arrowButton}>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="contain" />
    </View>
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
        
                    {/* --- GRID DE CATEGORÍAS --- */}
                    <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false} // Desactivamos el scroll de esta lista interna
                    columnWrapperStyle={styles.row}
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
  // Category Grid
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  discountBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#F9A825',
    fontWeight: 'bold',
    fontSize: 11,
  },
  arrowButton: {},
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    minHeight: 35,
  },
  categoryImage: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    marginTop: 10,
  }
});


export default BodyHome;