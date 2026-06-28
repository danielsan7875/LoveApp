import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { agregarWishlistThunk, eliminarWishlistThunk } from "../redux/wishlistSlice"; // <-- Ajusta ruta
import { addToCart } from "../redux/cartSlice";
import { Ionicons } from '@expo/vector-icons';

export default function Cards({ id, id_lista, foto, nombre, precioMayor, precioDetal, onPress }) {
  const dispatch = useDispatch();
  
  const { user, isLogged } = useSelector((state) => state.auth);

  const cedula = user?.cedula; 

  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const itemEnLista = wishlistItems.find(item => item.id === id);
  const isFav = !!itemEnLista;

  const agregarCarrito = () => {
    dispatch(addToCart({
      id: id ?? nombre + "_" + precioMayor,
      nombre,
      precioMayor,
      precioDetal,
      foto,
    }));
  };

  const toggleWishlist = () => {
    if (!isLogged || !cedula) {
      Alert.alert("Atención", "Debes iniciar sesión para guardar productos favoritos.");
      return;
    }

    if (isFav) {
      dispatch(eliminarWishlistThunk({ idLista: itemEnLista.id_lista, cedula }));
    } else {
      dispatch(agregarWishlistThunk({ 
        cedula, 
        producto: { id, nombre, precioMayor, precioDetal, foto } 
      }));
    }
  };

  const obtenerImagenRemota = () => {
    if (Array.isArray(foto) && foto.length > 0) {
      const primerFoto = foto[0];
      if (primerFoto?.url_imagen) {
        return { uri: primerFoto.url_imagen };
      }
      if (primerFoto?.imagen) {
        return { uri: primerFoto.imagen };
      }
      if (typeof primerFoto === 'string') {
        return { uri: primerFoto };
      }
    }

    if (foto && typeof foto === 'object' && !Array.isArray(foto)) {
      const url = foto.url_imagen || foto.imagen;
      if (url) {
        return { uri: url };
      }
    }

    return require('../assets/b6.png'); 
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={obtenerImagenRemota()} style={styles.image} />
        <TouchableOpacity onPress={toggleWishlist} style={styles.favIconContainer}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            color={isFav ? "#D81B60" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.nombre}>{nombre}</Text>
      <View style={styles.preciocontainer}>
        <Text style={styles.precioMayor}>M: {precioMayor}$</Text>
        <Text style={styles.precioDetal}>D: {precioDetal}$</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  favIconContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },

  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#d81b60',
    textAlign: 'center',
    marginTop: 4,
  },

  preciocontainer: {
    marginVertical: 6,
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
