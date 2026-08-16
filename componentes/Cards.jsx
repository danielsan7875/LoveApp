import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { agregarWishlistThunk, eliminarWishlistThunk } from "../redux/wishlistSlice"; 
import { addToCart } from "../redux/cartSlice";
import { Ionicons } from '@expo/vector-icons';
import TasaOficial from '../informacion/dolar';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 20; // Ajuste perfecto para diseño en cuadrícula de 2 columnas

export default function Cards({ id, id_lista, foto, nombre, nombre_marca, precioMayor, precioDetal, cantidadMayor, onPress, onAgregar }) {
  const dispatch = useDispatch();
  
const { user, isLogged } = useSelector((state) => {
  const datosAuth = state.auth;

  if (datosAuth.user?.codigo || datosAuth.user?.autorizado === true) {
    return { user: null, isLogged: false };
  }

  return { user: datosAuth.user, isLogged: datosAuth.isLogged };
});

const cedula = user?.cedula;

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const itemEnLista = wishlistItems.find(item => item.id === id);
  const isFav = !!itemEnLista;

  const tasaCambio = TasaOficial() || 600;

// Aseguramos que el precio detal sea un número válido
const precioNumerico = parseFloat(precioDetal) * tasaCambio;

// Aplicamos el formato de para punto y coma
const precioBs = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(precioNumerico);

  const agregarCarrito = () => {
    dispatch(addToCart({
      id: id ?? nombre + "_" + precioMayor,
      nombre,
      precioMayor,
      precioDetal,
      cantidad_mayor: cantidadMayor,
      foto,
    }));

    if (onAgregar) onAgregar();
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
      if (primerFoto?.url_imagen) return { uri: primerFoto.url_imagen };
      if (primerFoto?.imagen) return { uri: primerFoto.imagen };
      if (typeof primerFoto === 'string') return { uri: primerFoto };
    }

    if (foto && typeof foto === 'object' && !Array.isArray(foto)) {
      const url = foto.url_imagen || foto.imagen;
      if (url) return { uri: url };
    }

    return require('../assets/b6.png'); 
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      
      {/* IMAGEN */}
      <View style={styles.imageContainer}>
        <Image source={obtenerImagenRemota()} style={styles.image} />
        <TouchableOpacity onPress={toggleWishlist} style={styles.favIconContainer}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={20}
            color={isFav ? "#EE82EE" : "#666"}
          />
        </TouchableOpacity>
      </View>
      
      {/* CONTENEDOR DE TEXTOS CON ALINEACIÓN IZQUIERDA */}
      <View style={styles.infoContainer}>
        {/* MARCA */}
        <Text style={styles.marca} numberOfLines={1}>
          {nombre_marca || 'Sin marca'}
        </Text>

        {/* NOMBRE */}
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>

        {/* PRECIO DETAL $ | Bs */}
        <View style={styles.precioRow}>
          <Text style={styles.precioDolar}>Ref {precioDetal}</Text>
          <Text style={styles.separador}>|</Text>
          <Text style={styles.precioBs}> {precioBs} Bs</Text>
        </View>
      </View>

      {/* 5. BOTÓN AGREGAR */}
      <TouchableOpacity style={styles.button} onPress={agregarCarrito} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 4 }} />
        <Text style={styles.btnText}>Agregar</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 8,
    width: cardWidth,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
    justifyContent: 'space-between', // Mantiene el botón siempre abajo de forma simétrica
  },

  imageContainer: {
    width: '100%',
    height: 135,
    backgroundColor: '#F9F9FB', // Fondo sutil idéntico a la UI que elegiste
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain', // Cambiado a 'contain' para que los cosméticos luzcan enteros y perfectos
  },

  favIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  infoContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },

  marca: {
    fontSize: 11,
    color: '#A9A9A9',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2F2F2F',
    marginBottom: 6,
  },

  precioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  precioDolar: {
    color: '#EE82EE', // Tu tono fucsia/lila del modal
    fontWeight: 'bold',
    fontSize: 15,
  },

  separador: {
    marginHorizontal: 5,
    color: '#000000',
    fontSize: 13,
  },

  precioBs: {
    color: '#2F2F2F',
    fontSize: 13,
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#D81B60', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    borderTopLeftRadius: 0, // Plano arriba para fusionarse con el cuerpo
    borderTopRightRadius: 0,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});