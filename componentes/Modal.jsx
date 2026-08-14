import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import { addToCart } from "../redux/cartSlice";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ModalProducto({ visible, onClose, producto }) {
    const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('description');
  const [activeIndex, setActiveIndex] = useState(0); // Estado para controlar el punto activo

  if (!producto) return null;

  const imagenesRemotas = Array.isArray(producto.imagenes)
    ? producto.imagenes
    : Array.isArray(producto.foto)
      ? producto.foto
      : [];

  // Función para calcular qué foto se está mostrando actualmente
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

    const agregarCarrito = () => {
      dispatch(addToCart({
        id: producto.id_producto ?? producto.id,
        nombre: producto.nombre,
        precioMayor: producto.precio_mayor,
        precioDetal: producto.precio_detal,
        cantidad_mayor: producto.cantidad_mayor,
        foto: producto.imagenes || producto.foto || [],
      }));
    };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        
        {/* ENCABEZADO SUPERIOR */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* CONTENIDO DESLIZABLE */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* SECCIÓN DEL CARRUSEL Y PUNTOS */}
          <View style={styles.carouselWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll} // Detecta el movimiento
              scrollEventThrottle={16} 
            >
              {imagenesRemotas.length > 0 ? (
                imagenesRemotas.map((img, index) => {
                  const uri = typeof img === 'string' ? img : img?.url_imagen || img?.imagen;
                  return (
                    <Image key={index} source={{ uri }} style={styles.productImage} />
                  );
                })
              ) : (
                <Image source={require('../assets/b6.png')} style={styles.productImage} />
              )}
            </ScrollView>

            {imagenesRemotas.length > 1 && (
              <View style={styles.paginationContainer}>
                {imagenesRemotas.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeIndex === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* CONTENEDOR BLANCO DE INFORMACIÓN */}
          <View style={styles.infoContainer}>
            
            <View style={styles.metaRow}>
              <View style={styles.titleCol}>
                <Text style={styles.brandText}>{producto.nombre_marca || 'Sin marca'}</Text>
                <Text style={styles.nameText}>{producto.nombre || ''}</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.priceDetalText}>${producto.precio_detal || '0.00'}</Text>
                <Text style={styles.priceLabel}>Precio Detal</Text>
              </View>
            </View>

            {/* PESTAÑAS */}
            <View style={styles.tabsRow}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'description' && styles.activeTab]} 
                onPress={() => setActiveTab('description')}
              >
                <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>Descripción</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'precios' && styles.activeTab]} 
                onPress={() => setActiveTab('precios')}
              >
                <Text style={[styles.tabText, activeTab === 'precios' && styles.activeTabText]}>Precios Mayor</Text>
              </TouchableOpacity>
            </View>

            {/* CONTENIDO DE PESTAÑAS */}
            <View style={styles.tabPanel}>
              {activeTab === 'description' ? (
                <View>
                  {producto.nombre_categoria && (
                    <View style={styles.categoriaBadge}>
                      <Ionicons name="pricetag-outline" size={14} color="#EE82EE" style={{ marginRight: 5 }} />
                      <Text style={styles.categoriaText}>{producto.nombre_categoria}</Text>
                    </View>
                  )}
                  
                  <Text style={styles.descriptionText}>
                    {producto.descripcion || producto.descripcion_corta || 'Sin descripción disponible.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.mayorBox}>
                  <Text style={styles.mayorText}>Precio Mayor: <Text style={styles.boldText}>${producto.precio_mayor || '0'}</Text></Text>
                  <Text style={styles.mayorText}>Mínimo requerido: <Text style={styles.boldText}>{producto.cantidad_mayor || 0} unidades</Text></Text>
                  <Text style={styles.stockText}>Disponibles en Stock: {producto.stock_disponible ?? 0} und.</Text>
                </View>
              )}
            </View>

          </View>
        </ScrollView>

        {/* BARRA INFERIOR DE ACCIONES */}
        <View style={styles.bottomActions}>
          

          <TouchableOpacity style={styles.buyNowBtn}  onPress={agregarCarrito}>
            <Text style={styles.buyNowTxt}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  headerRow: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  categoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start', 
    marginBottom: 12, 
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  categoriaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EE82EE',
    textTransform: 'capitalize',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  carouselWrapper: {
    width: screenWidth,
    height: screenHeight * 0.44, 
    backgroundColor: '#F9F9FB',
    marginTop: 20,
    alignItems: 'center',
  },
  productImage: {
    width: screenWidth,
    height: screenHeight * 0.38,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20, 
    backgroundColor: '#EE82EE', 
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 30,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  brandText: {
    fontSize: 14,
    color: '#A9A9A9',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceDetalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EE82EE',
  },
  priceLabel: {
    fontSize: 11,
    color: '#A9A9A9',
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 15,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 25,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#EE82EE',
  },
  tabText: {
    fontSize: 15,
    color: '#A9A9A9',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#EE82EE',
    fontWeight: 'bold',
  },
  tabPanel: {
    minHeight: 100,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#7F7F7F',
  },
  mayorBox: {
    backgroundColor: '#FAF5FF',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  mayorText: {
    fontSize: 15,
    color: '#4A4A4A',
    marginBottom: 6,
  },
  stockText: {
    fontSize: 13,
    color: 'green',
    fontWeight: '600',
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  addToCartBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EE82EE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addToCartTxt: {
    color: '#EE82EE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowBtn: {
    flex: 1.2,
    height: 52,
    backgroundColor: '#EE82EE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EE82EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buyNowTxt: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});