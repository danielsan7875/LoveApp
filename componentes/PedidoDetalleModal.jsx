import React from 'react';
import { StyleSheet, View, Text, Modal, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PedidoDetalleModal({ visible, pedido, onClose }) {
  if (!pedido) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* CABECERA  */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Pedido</Text>
          <View style={{ width: 24 }} /> 
        </View>

        {/* CONTENIDO DEL RECIBO */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Estructura  recibo */}
          <View style={styles.receiptContainer}>
            <Text style={styles.receiptTitle}>LOVE MAKEUP C.A</Text>
            <Text style={styles.receiptSubtitle}>¡Gracias por tu compra!</Text>
            
            <View style={styles.dashedDivider} />

            {/* datos principales */}
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Nro. Pedido:</Text>
              <Text style={styles.metaValue}>#{pedido.id}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Fecha:</Text>
              <Text style={styles.metaValue}>{pedido.fecha}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Estado:</Text>
              <Text style={[styles.metaValue, { color: '#EE82EE', fontWeight: 'bold' }]}>{pedido.estado}</Text>
            </View>

            {/* INFORMACIÓN ADICIONAL */}
            {pedido.nombre_cliente && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Cliente:</Text>
                <Text style={styles.metaValue}>{pedido.nombre_cliente} {pedido.apellido_cliente || ''}</Text>
              </View>
            )}
            {pedido.telefono && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Teléfono:</Text>
                <Text style={styles.metaValue}>{pedido.telefono}</Text>
              </View>
            )}
            {pedido.correo_cliente && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Correo:</Text>
                <Text style={styles.metaValue}>{pedido.correo_cliente}</Text>
              </View>
            )}

            {pedido.direccion && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Dirección:</Text>
                <Text style={styles.metaValue}>{pedido.direccion}</Text>
              </View>
            )}
            {pedido.sucursal && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Sucursal:</Text>
                <Text style={styles.metaValue}>{pedido.sucursal}</Text>
              </View>
            )}

            {pedido.metodoEntrega && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Entrega:</Text>
                <Text style={styles.metaValue}>{pedido.metodoEntrega}</Text>
              </View>
            )}
            {pedido.metodoPago && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Pago:</Text>
                <Text style={styles.metaValue}>{pedido.metodoPago}</Text>
              </View>
            )}
            {pedido.referenciaPago && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Ref. / Tracking:</Text>
                <Text style={styles.metaValue}>{pedido.referenciaPago}</Text>
              </View>
            )}

            <View style={styles.dashedDivider} />

            {/* LISTADO DE PRODUCTOS */}
            <Text style={styles.sectionTitle}>Productos</Text>
            
            {pedido.productos && pedido.productos.length > 0 ? (
              pedido.productos.map((prod, idx) => (
                <View key={idx} style={styles.productRow}>
                  <View style={styles.productInfoCol}>
                    <Text style={styles.productName}>{prod.nombre}</Text>
                    <Text style={styles.productQty}>Cant: {prod.cantidad} x $ {prod.precio?.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.productSubtotal}>
                    $ {(prod.cantidad * prod.precio).toFixed(2)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noProductsText}>No hay información de artículos disponible.</Text>
            )}

            <View style={styles.dashedDivider} />

            {/* RESUMEN MONETARIO */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL PAGADO</Text>
              <Text style={styles.totalPrice}>$ {pedido.montoTotal?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
        </ScrollView>

        {/* BOTÓN GRANDE INFERIOR PARA CERRAR */}
        <View style={styles.bottomActionContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Entendido / Cerrar</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EE82EE',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EE82EE',
    textAlign: 'center',
    letterSpacing: 2,
  },
  receiptSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  dashedDivider: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  productQty: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  productSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  noProductsText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  bottomActionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeButton: {
    backgroundColor: '#EE82EE',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});