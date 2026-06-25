import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { obtenerWishlistRemotaThunk } from "../redux/wishlistSlice"; 
import Cards from "../componentes/Cards";
import ModalProducto from "../componentes/Modal";

const MisDeseos = () => {
  const dispatch = useDispatch();
  
  const { items: wishlist, status } = useSelector((state) => state.wishlist);
  const { user, isLogged } = useSelector((state) => state.auth);
  const cedula = user?.cedula;
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  useEffect(() => {
    if (isLogged && cedula) {
      dispatch(obtenerWishlistRemotaThunk(cedula));
    }
  }, [dispatch, isLogged, cedula]);

  const handleCardPress = (item) => {
    setProductoActivo({ ...item, imagenes: item.foto || item.imagenes || [] });
    setModalVisible(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.logoText}>Lista de Deseos</Text>

          {status === 'loading' && wishlist.length === 0 ? (
            <ActivityIndicator size="large" color="#D81B60" style={{ marginTop: 20 }} />
          ) : !isLogged ? (
            <Text style={styles.emptyText}>Inicia sesión para ver tus deseos guardados.</Text>
          ) : wishlist.length === 0 ? (
            <Text style={styles.emptyText}>No tienes productos en tu lista de deseos</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {wishlist.map(item => (
                <Cards
                  key={item.id}
                  id={item.id}
                  id_lista={item.id_lista}
                  nombre={item.nombre}
                  precioMayor={item.precioMayor}
                  precioDetal={item.precioDetal}
                  foto={item.foto}
                  onPress={() => handleCardPress(item)}
                />
              ))}
            </View>
          )}

          <ModalProducto
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            producto={productoActivo}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
 logoText: {
      fontSize:40,
      fontWeight: 'bold',
      color: '#D81B60', 
      marginBottom: 20,
      textAlign: 'center',
  },
  emptyText: {
  textAlign: 'center',
  marginTop: 40,
  fontSize: 16,
  color: '#555',
},
});

export default MisDeseos;

