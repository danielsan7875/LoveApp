import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  Text,
  Platform
} from 'react-native';
import HeaderTitulo from '../componentes/Headertitulo'; 

import PedidoCard from '../componentes/PedidoCard';
import PedidoDetalleModal from '../componentes/PedidoDetalleModal';

export default function BodyMisPedido() {
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  // ESTADOS PARA CONTROLAR EL MODAL Y EL PEDIDO SELECCIONADO
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  //  DATOS AMPLIADOS CON ESQUEMA DE PRODUCTOS PARA EL TICKET/RECIBO
  const pedidos = [
    {
      id: '001',
      tipo: 'Tienda',
      fecha: '2026-05-15',
      estado: 'Entregado',
      metodoEntrega: 'Delivery',
      metodoPago: 'Pago Movil',
      referenciaPago: '#654954',
      montoTotal: 45.00,
      productos: [
        { nombre: 'Paleta de Sombras Ultra Matte', cantidad: 1, precio: 25.00 },
        { nombre: 'Labial Líquid Matte Long-Lasting', cantidad: 2, precio: 10.00 }
      ]
    },
    {
      id: '002',
      tipo: 'Web',
      fecha: '2026-05-10',
      estado: 'Pendiente',
      metodoEntrega: 'Retiro en tienda',
      metodoPago: 'Pago Movil',
      referenciaPago: '#468756',
      montoTotal: 18.50,
      productos: [
        { nombre: 'Base de Maquillaje Cobertura Total', cantidad: 1, precio: 18.50 }
      ]
    },
    {
      id: '003',
      tipo: 'Reserva',
      fecha: '2026-05-05',
      estado: 'En camino',
      metodoEntrega: 'Envío por nacionales',
      metodoPago: 'Pago móvil',
      referenciaPago: '#9966314',
      montoTotal: 34.00,
      productos: [
        { nombre: 'Máscara de Pestañas Efecto pestañas postizas', cantidad: 2, precio: 12.00 },
        { nombre: 'Fijador de Maquillaje en Spray 100ml', cantidad: 1, precio: 10.00 }
      ]
    }
  ];

  // 3. MANEJADOR PARA ABRIR EL DETALLE
  const handleVerDetalle = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  };

  // 4. MANEJADOR PARA CERRAR EL DETALLE
  const handleCerrarModal = () => {
    setModalVisible(false);
    setPedidoSeleccionado(null);
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER DE LA PANTALLA */}
      <HeaderTitulo 
        title="Mis Pedidos" 
        subtitle="Revisa el estado y detalle de todas tus compras" 
      />
    
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {pedidos.map((pedido) => (
            <PedidoCard 
              key={pedido.id} 
              pedido={pedido} 
              onVerDetalle={handleVerDetalle} // prop
            />
          ))}
        </View>
      </ScrollView>

      {/* MODAL GLOBAL DE DETALLES */}
      <PedidoDetalleModal 
        visible={modalVisible}
        pedido={pedidoSeleccionado}
        onClose={handleCerrarModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 80, 
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  }
});