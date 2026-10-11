import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import AlertModal from './ModalAlert';

export default function AddCantidadModal({ visible, onClose, producto, onAgregar }) {
  const dispatch = useDispatch();
  const [cantidad, setCantidad] = useState(1);
  const cartItems = useSelector((state) => state.cart.items);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  if (!producto) return null;

  const { id, nombre, precioMayor, precioDetal, cantidadMayor, stockDisponible, foto } = producto;

  const confirmarAgregarCarrito = () => {
    const stock = Number(stockDisponible);
    const idCarrito = id ?? nombre + "_" + precioMayor;
    
   if (Number.isFinite(stock)) {
      const enCarrito = cartItems.find((p) => p.id === idCarrito);
      const cantidadActualEnCarrito = enCarrito ? (enCarrito.cantidad || 0) : 0;
      
      if (cantidadActualEnCarrito + cantidad > stock) {
        const mensajeStock = `Solo hay ${stock} unidad(es) disponible(s).`;
        
        setModalMessage(mensajeStock);
        setModalSuccess(false);
        setModalVisible(true);
        return;
      }
    }
    dispatch(addToCart({
      id: idCarrito,
      nombre,
      precioMayor,
      precioDetal,
      cantidad_mayor: cantidadMayor,
      stock_disponible: stockDisponible,
      foto,
      cantidad,
    }));

    if (onAgregar) {
      onAgregar(cantidad);
      console.log(cantidad);
    }

    setCantidad(1); 
    onClose(); 
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeIconModal} 
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Indica la cantidad</Text>
          <Text style={styles.modalProductName} numberOfLines={2}>{nombre}</Text>

          {/* CONTADOR  RESTAR  CANTIDAD  SUMAR */}
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={styles.counterBtn} 
              onPress={() => setCantidad(prev => (prev > 1 ? prev - 1 : 1))}
            >
              <Ionicons name="remove" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.counterText}>{cantidad}</Text>

            <TouchableOpacity 
              style={styles.counterBtn} 
              onPress={() => setCantidad(prev => prev + 1)}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* BOTÓN DE AÑADIR */}
          <TouchableOpacity 
            style={styles.modalConfirmBtn} 
            onPress={confirmarAgregarCarrito}
            activeOpacity={0.8}
          >
            <Text style={styles.modalConfirmText}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        success={modalSuccess}
      />

    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeIconModal: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 6,
  },
  modalProductName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  counterBtn: {
    padding: 8,
    backgroundColor: '#D81B60',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  counterText: {
    marginHorizontal: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  modalConfirmBtn: {
    backgroundColor: '#D81B60',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});