import React, { useState, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCantidad, sincronizarStock } from "../redux/cartSlice";
import { fetchProductos } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Carrito() {
  const dispatch = useDispatch();
  const carrito = useSelector(state => state.cart.items);
  const carritoRef = useRef(carrito);
  carritoRef.current = carrito; 
  const [actualizandoStock, setActualizandoStock] = useState(false);

 
  useFocusEffect(
    useCallback(() => {
      let activo = true;

      const cargarStock = async () => {
        setActualizandoStock(true);
        try {
          const res = await fetchProductos('activos');
          if (!activo || res?.respuesta !== 1) return;
          const productos = Array.isArray(res?.productos) ? res.productos : [];
          if (productos.length === 0) return;

          // Detectar productos cuya cantidad debe ajustarse (para avisar al usuario)
          const ajustados = [];
          carritoRef.current.forEach((item) => {
            const prod = productos.find(
              (p) => String(p?.id_producto ?? p?.id) === String(item.id)
            );
            const stock = Number(prod?.stock_disponible);
            if (Number.isFinite(stock) && (item.cantidad || 1) > stock) {
              ajustados.push(
                stock < 1
                  ? `${item.nombre} (agotado, se quitó del carrito)`
                  : `${item.nombre} (quedan ${stock})`
              );
            }
          });

          dispatch(sincronizarStock(productos));

          if (ajustados.length > 0) {
            Alert.alert(
              'Stock actualizado',
              'La cantidad de algunos productos fue ajustada según el stock disponible:\n' +
                ajustados.join('\n')
            );
          }
        } catch (e) {
        } finally {
          if (activo) setActualizandoStock(false);
        }
      };

      cargarStock();

      return () => {
        activo = false;
      };
    }, [dispatch])
  );

  // Aumenta la cantidad validando contra el stock disponible
  const aumentarCantidad = (item) => {
    const stock = Number(item.stock_disponible);
    if (Number.isFinite(stock) && item.cantidad + 1 > stock) {
      Alert.alert(
        'Stock insuficiente',
        `Solo hay ${stock} unidad(es) disponible(s) de "${item.nombre}".`
      );
      return;
    }
    dispatch(updateCantidad({ id: item.id, delta: 1 }));
  };

  // Disminuye la cantidad (mínimo 1; para eliminar el producto está el botón X)
  const disminuirCantidad = (item) => {
    if ((item.cantidad || 1) <= 1) return;
    dispatch(updateCantidad({ id: item.id, delta: -1 }));
  };

  const total = carrito.reduce((acc, item) => {
    const precio = item.cantidad >= (item.cantidad_mayor || 0)
      ? parseFloat(item.precioMayor)
      : parseFloat(item.precioDetal);
    return acc + (item.cantidad * (isNaN(precio) ? 0 : precio));
  }, 0);
  const navigation = useNavigation();
  const DireccionPress = () => {
    navigation.navigate("Metodoenvio", { total });
  };

  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>

      <FlatList
        data={carrito}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : String(index)
        }
        contentContainerStyle={styles.listContent} // Espaciado interno para que el último item no choque con el botón
        renderItem={({ item }) => {
          const stock = Number(item.stock_disponible);
          const limiteStock = Number.isFinite(stock);
          const sinStockParaMas = limiteStock && item.cantidad >= stock;

          // Mismo criterio de precio que el total (precio mayor a partir de cantidad_mayor)
          const precioUnit = item.cantidad >= (item.cantidad_mayor || 0)
            ? parseFloat(item.precioMayor)
            : parseFloat(item.precioDetal);
          const precioValido = isNaN(precioUnit) ? 0 : precioUnit;

          return (
            <View style={styles.item}>
              <Image
                source={
                  Array.isArray(item.foto) && item.foto.length > 0
                    ? { uri: item.foto[0]?.url_imagen || item.foto[0]?.imagen || (typeof item.foto[0] === 'string' ? item.foto[0] : undefined) }
                    : require('../assets/b6.png')
                }
                style={styles.img}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.price}>
                  {item.cantidad} x {precioValido.toFixed(2)}$ = {(item.cantidad * precioValido).toFixed(2)}$
                </Text>

                {/* Control de cantidad - / + con verificación de stock */}
                <View style={styles.cantidadRow}>
                  <TouchableOpacity
                    style={[styles.cantBtn, item.cantidad <= 1 && styles.cantBtnDisabled]}
                    onPress={() => disminuirCantidad(item)}
                    disabled={item.cantidad <= 1}
                  >
                    <Text style={styles.cantBtnTxt}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.cantTxt}>{item.cantidad}</Text>

                  <TouchableOpacity
                    style={[styles.cantBtn, sinStockParaMas && styles.cantBtnDisabled]}
                    onPress={() => aumentarCantidad(item)}
                    disabled={sinStockParaMas}
                  >
                    <Text style={styles.cantBtnTxt}>+</Text>
                  </TouchableOpacity>

                  {limiteStock && (
                    <Text
                      style={[
                        styles.stockTxt,
                        sinStockParaMas && styles.stockTxtLimite,
                      ]}
                      numberOfLines={1}
                    >
                      {sinStockParaMas ? `Máx. ${stock} und.` : `Stock: ${stock} und.`}
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => dispatch(removeFromCart(item.id))}
              >
                <Text style={styles.removeTxt}>X</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        // Si el carrito está vacío, muestra un mensaje amigable
        ListEmptyComponent={
          <Text style={styles.emptyTxt}>Tu carrito está vacío</Text>
        }
        ListHeaderComponent={
          actualizandoStock ? (
            <Text style={styles.syncTxt}>Actualizando stock…</Text>
          ) : null
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
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20, 
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 10,
    elevation: 3, 
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

  cantidadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cantBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cantBtnDisabled: {
    backgroundColor: '#f3b8cd', // rosado apagado cuando no se puede usar
  },
  cantBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 20,
  },
  cantTxt: {
    minWidth: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  stockTxt: {
    marginLeft: 8,
    fontSize: 11,
    color: '#888',
    flexShrink: 1,
  },
  stockTxtLimite: {
    color: '#c0392b',
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
  syncTxt: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
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