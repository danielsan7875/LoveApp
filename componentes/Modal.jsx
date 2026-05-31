import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

export default function ModalProducto({ visible, onClose, producto }) {
  const screenWidth = Dimensions.get('window').width * 0.75; // Tamaño para el carrusel

  if (!producto) return null;

  const imagenesRemotas = Array.isArray(producto.imagenes) ? producto.imagenes : [];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>

          {/* CARRUSEL DE IMÁGENES CORREGIDO */}
          <View style={{ width: screenWidth, height: 180, marginBottom: 12 }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {imagenesRemotas.length > 0 ? (
                imagenesRemotas.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.url_imagen }}
                    style={{
                      width: screenWidth, // Cada imagen mide exactamente lo mismo que el carrusel
                      height: 180,
                      borderRadius: 12,
                      resizeMode: 'cover',
                    }}
                  />
                ))
              ) : (
                // Imagen de respaldo única si no hay fotos
                <Image
                  source={require('../assets/img/b6.png')}
                  style={{
                    width: screenWidth,
                    height: 180,
                    borderRadius: 12,
                    resizeMode: 'cover',
                  }}
                />
              )}
            </ScrollView>
          </View>

          <Text style={styles.nombre}>{producto.nombre || ''}</Text>
          <Text style={styles.marca}>Marca: <Text style={styles.marcaValue}>{producto.nombre_marca || 'Sin marca'}</Text></Text>
          <Text style={styles.descripcion}>{producto.descripcion || producto.descripcion_corta || 'Sin descripción'}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.info}>Stock: <Text style={styles.infoValue}>{producto.stock_disponible ?? 0}</Text></Text>
            <Text style={styles.info}>Mayor: <Text style={styles.infoValue}>{producto.precio_mayor || '0'}$</Text> <Text style={styles.infoMin}>(min: {producto.cantidad_mayor || 0})</Text></Text>
            <Text style={styles.info}>Detal: <Text style={styles.infoValue}>{producto.precio_detal || '0'}$</Text></Text>
          </View>
          
          <TouchableOpacity onPress={onClose} style={styles.cerrarBtn} activeOpacity={0.85}>
            <Text style={styles.cerrarTxt}>Cerrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "#f8bbd0",
    backgroundColor: "#fce4ec",
  },

  nombre: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 6,
    color: "#d81b60",
    textAlign: "center",
  },

  marca: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    color: "#ad1457",
  },

  marcaValue: {
    fontWeight: "normal",
    color: "#333",
  },

  descripcion: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    color: "#444",
  },

  infoBox: {
    backgroundColor: "#fce4ec",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },

  info: {
    fontSize: 15,
    marginBottom: 2,
    color: "#6d4c41",
  },

  infoValue: {
    fontWeight: "bold",
    color: "#388e3c",
  },

  infoMin: {
    color: "#1976d2",
    fontSize: 13,
  },

  agregarBtn: {
    marginTop: 10,
    backgroundColor: "#d81b60",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },

  cerrarBtn: {
    marginTop: 10,
    backgroundColor: "#777",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },

  cerrarTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 1,
  },
});
