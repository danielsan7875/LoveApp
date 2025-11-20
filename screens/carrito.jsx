import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";

export default function Carrito() {
  const dispatch = useDispatch();
  const carrito = useSelector(state => state.cart.items);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>

      <FlatList
        data={carrito}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : String(index)
        }
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
      />
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
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 12,
    padding: 10,
    elevation: 4,
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
  },
  price: {
    color: '#555',
  },
  removeBtn: {
    backgroundColor: '#D81B60',
    padding: 6,
    borderRadius: 6,
  },
  removeTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
