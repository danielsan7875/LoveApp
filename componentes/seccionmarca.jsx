import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function marcaseccion({ brands, title = "Lo Mejor de Nuestro Catálogo" }) {
  return (
    <View style={styles.container}>
      {/* Encabezado con título y flecha azul */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="bag-check" size={24} color="#ff5694" />
      </View>

      {/* Scroll horizontal para las marcas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {brands.map((brand) => (
          <TouchableOpacity key={brand.id} style={styles.brandCard} activeOpacity={0.8}>
            {/* Contenedor circular blanco con borde gris sutil */}
            <View style={styles.imageContainer}>
              <Image 
                source={brand.image} 
                style={styles.image} 
                resizeMode="contain" 
              />
            </View>
            {/* Texto debajo del círculo */}
            <Text style={styles.brandName} numberOfLines={2}>
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a202c', 
  },
  scrollContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  brandCard: {
    alignItems: 'center',
    width: 95, 
    marginRight: 16,
  },
  imageContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5, 
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: '70%',
    height: '70%',
  },
  brandName: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
  },
});