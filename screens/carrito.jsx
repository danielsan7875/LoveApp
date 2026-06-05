import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";
import { useNavigation } from '@react-navigation/native';


export default function Carrito() {
  const dispatch = useDispatch();
  const carrito = useSelector(state => state.cart.items);

  const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precioMayor), 0);
  const navigation = useNavigation();
  const DireccionPress = () => {
    navigation.navigate("Metodoenvio");
  };

  return (
    <View style={styles.container}>
      

      <FlatList
        data={carrito}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : String(index)
        }
        contentContainerStyle={styles.listContent} // Espaciado interno para que el último item no choque con el botón
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={item.foto[0]} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.price}>
                {item.cantidad} x {item.precioMayor}$ = {(item.cantidad * item.precioMayor).toFixed(2)}$
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => dispatch(removeFromCart(item.id))}
            >
              <Text style={styles.removeTxt}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        // Si el carrito está vacío, muestra un mensaje amigable
        ListEmptyComponent={
          <Text style={styles.emptyTxt}>Tu carrito está vacío</Text>
        }
      />

      {/* Contenedor del Botón inferior fijo */}
      {carrito.length > 0 && (
        <View style={styles.footerContainer}>
          {/* Fila opcional de Total (combina perfecto antes de continuar) */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>{total.toFixed(2)}$</Text>
          </View>

          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={DireccionPress}
          >
            <Text style={styles.checkoutButtonText}>Continuar con la compra</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1F2",
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20, // Espacio al final de la lista
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 10,
    elevation: 3, // Un poco más suave que 4 para que se integre mejor
    alignItems: 'center',
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  price: {
    color: '#666',
    marginTop: 4,
  },
  removeBtn: {
    backgroundColor: '#D81B60',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyTxt: {
    textAlign: 'center',
    color: '#6d6d6d',
    marginTop: 40,
    fontSize: 30,
  },
  // Nuevos estilos para el área del botón de Checkout
  footerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Sombra sutil para separar el botón del fondo del carrito
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#068a4c',
  },
  checkoutButton: {
    backgroundColor: '#fd6aa0', // Tu rosado característico
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});