import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PedidoCard({ pedido, onVerDetalle }) {

  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case 'Rechazado':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'Verificar pago':
        return { bg: '#FFF7ED', text: '#B45309' };
      case 'Pago Verificado':
        return { bg: '#E6F4EA', text: '#166534' };
      case 'Pendiente envio':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'En camino':
        return { bg: '#E3F2FD', text: '#0B5FFF' };
      case 'Entregado':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  const estadoEstilo = getEstadoEstilo(pedido.estado);

  return (
    <View style={styles.card}>
      {/*  Encabezado */}
      <View style={styles.headerRow}>
        <View style={styles.iconTextRow}>
          <Ionicons name="receipt-outline" size={18} color="#EE82EE" style={styles.iconMargin} />
          <Text style={styles.orderId}>Pedido #{pedido.id}</Text>
        </View>
        <View style={styles.iconTextRow}>
          <Ionicons name="calendar-outline" size={16} color="#EE82EE" style={styles.iconMargin} />
          <Text style={styles.dateText}>{pedido.fecha}</Text>
        </View>
      </View>

      {/* datos */}
      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <View style={[styles.badge, { backgroundColor: estadoEstilo.bg }]}>
            <Text style={[styles.badgeText, { color: estadoEstilo.text }]}>{pedido.estado}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Método entrega:</Text>
          <Text style={styles.value}>{pedido.metodoEntrega}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Método de Pago:</Text>
          <Text style={styles.value}>{pedido.metodoPago}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ref. de pago:</Text>
          <Text style={styles.value}>{pedido.referenciaPago || 'N/A'}</Text>
        </View>

        <View style={styles.infoRowDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.totalLabel}>Monto Total:</Text>
          <Text style={styles.totalValue}>$ {pedido.montoTotal?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* Boton de acción */}
      <TouchableOpacity style={styles.detailButton} onPress={() => onVerDetalle(pedido)}>
        <Text style={styles.detailButtonText}>Más detalles</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EE82EE',
  },
  infoBlock: {
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailButton: {
    backgroundColor: '#D81B60',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
});