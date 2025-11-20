import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function Cards({ id, foto, nombre, precioMayor, precioDetal,onPress }) {
  const dispatch = useDispatch();

  const agregarCarrito = () => {
    dispatch(addToCart({
      id: id ?? nombre + "_" + precioMayor, // si no hay id, se crea uno
      nombre,
      precioMayor,
      precioDetal,
      foto,
    }));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={foto[0]} style={styles.image} />
      </View>
      <Text style={styles.nombre}>{nombre}</Text>
       
      <View style={styles.preciocontainer}>
        <Text style={styles.precioMayor}>M:{precioMayor}$</Text>
        <Text style={styles.precioDetal}>D:{precioDetal}$</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={agregarCarrito}>
        <Text style={styles.btnText}>Agregar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 10,
    alignItems: 'center',
    elevation: 7,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8bbd0',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#d81b60',
    textAlign: 'center',
  },
  preciocontainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  precioMayor: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 15,
  },
  precioDetal: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#d81b60',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
