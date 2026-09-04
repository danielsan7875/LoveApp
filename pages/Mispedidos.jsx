import React, { useState, useEffect } from 'react';
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
import { fetchPedidos } from '../services/api';

import PedidoCard from '../componentes/PedidoCard';
import PedidoDetalleModal from '../componentes/PedidoDetalleModal';

export default function BodyMisPedido() {
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  // ESTADOS PARA CONTROLAR EL MODAL Y EL PEDIDO SELECCIONADO
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPedidos();
        if (!mounted) return;
        setPedidos(data);
      } catch (e) {
        console.warn('Error cargando pedidos:', e);
        if (mounted) setError('No se pudieron cargar los pedidos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
          {loading && <Text>Cargando pedidos...</Text>}
          {error && <Text>{error}</Text>}
          {!loading && !error && pedidos.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No tienes pedidos aún.</Text>
            </View>
          )}
          {!loading && pedidos.map((pedido) => (
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
  },
  emptyStateContainer: {
    flex: 1,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});