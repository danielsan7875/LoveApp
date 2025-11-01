import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const MisPedido = () => {
  // Datos de ejemplo para pedidos
  const pedidos = [
    {
      id: '001',
      tipo: 'Tienda',
      fecha: '2023-05-15',
      estado: 'Entregado',
      telefono: '0412-1234567',
      metodoEntrega: 'Envío a domicilio',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: '002',
      tipo: 'Web',
      fecha: '2023-05-10',
      estado: 'Pendiente',
      telefono: '0412-9876543',
      metodoEntrega: 'Retiro en tienda',
      metodoPago: 'Transferencia bancaria'
    },
    {
      id: '003',
      tipo: 'Reserva',
      fecha: '2023-05-05',
      estado: 'En camino',
      telefono: '0412-4567890',
      metodoEntrega: 'Envío a domicilio',
      metodoPago: 'Pago móvil'
    }
  ];

  // Función para obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Entregado': return styles.badgeEntregado;
      case 'Pendiente': return styles.badgePendiente;
      case 'En camino': return styles.badgeEnCamino;
      default: return styles.badgeDefault;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={styles.container}>
          
          
          {/* --- BODY--- */}
          <Text style={styles.logoText}>Mis Pedidos</Text>
          
          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.tipoColumn]}>Tipo</Text>
                <Text style={[styles.tableHeaderText, styles.fechaColumn]}>Fecha</Text>
                <Text style={[styles.tableHeaderText, styles.estadoColumn]}>Estado</Text>
                <Text style={[styles.tableHeaderText, styles.telefonoColumn]}>Teléfono</Text>
                <Text style={[styles.tableHeaderText, styles.entregaColumn]}>Método Entrega</Text>
                <Text style={[styles.tableHeaderText, styles.pagoColumn]}>Método Pago</Text>
                <Text style={[styles.tableHeaderText, styles.accionColumn]}>Acción</Text>
              </View>
              
              {pedidos.map((pedido) => (
                <View key={pedido.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tipoColumn]}>{pedido.tipo}</Text>
                  <Text style={[styles.tableCell, styles.fechaColumn]}>{pedido.fecha}</Text>
                  <Text style={[styles.tableCell, styles.estadoColumn]}>
                    <Text style={[styles.badge, getBadgeClass(pedido.estado)]}>
                      {pedido.estado}
                    </Text>
                  </Text>
                  <Text style={[styles.tableCell, styles.telefonoColumn]}>{pedido.telefono}</Text>
                  <Text style={[styles.tableCell, styles.entregaColumn]}>{pedido.metodoEntrega}</Text>
                  <Text style={[styles.tableCell, styles.pagoColumn]}>{pedido.metodoPago}</Text>
                  <View style={[styles.tableCell, styles.accionColumn]}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
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
  logoText: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#D81B60', // Rosa oscuro
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
  },
  tableContainer: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D81B60',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 12,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    textAlign: 'center',
    color: '#333333',
  },
  tipoColumn: {
    width: '10%',
  },
  fechaColumn: {
    width: '15%',
  },
  estadoColumn: {
    width: '15%',
  },
  telefonoColumn: {
    width: '15%',
  },
  entregaColumn: {
    width: '20%',
  },
  pagoColumn: {
    width: '15%',
  },
  accionColumn: {
    width: '10%',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeEntregado: {
    backgroundColor: '#4CAF50',
  },
  badgePendiente: {
    backgroundColor: '#FF9800',
  },
  badgeEnCamino: {
    backgroundColor: '#2196F3',
  },
  badgeDefault: {
    backgroundColor: '#9E9E9E',
  },
  actionButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MisPedido;