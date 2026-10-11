import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PedidoFinalizado({ route, navigation }) {
  const pedido = route.params?.pedido ?? {};
  const user = useSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();

  const datosPedido = {
    idPedido: pedido.idPedido ?? 'N/A',
    fecha: pedido.fecha ?? '',
    metodoPago: pedido.metodoPago ?? 'Pago Móvil',
    total: pedido.total ?? '0.00',
    nombre: user?.nombre ?? '',
    apellido: user?.apellido ?? '',
  };

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      <ScrollView 
        contentContainerStyle={[
          styles.contenidoScroll, 
          { paddingTop: Math.max(insets.top, 20) + 20, paddingBottom: Math.max(insets.bottom, 20) + 100 }
        ]} 
        showsVerticalScrollIndicator={true}
      >
        
        {/* ESTADO DEL PEDIDO */}
        <View style={styles.tarjetaEstado}>
          <View style={styles.circuloCheck}>
            <View style={styles.checkIcono}>
              <View style={[styles.lineaCheck, styles.checkCorto]} />
              <View style={[styles.lineaCheck, styles.checkLargo]} />
            </View>
          </View>
          
          <Text style={styles.tituloEstado} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            ¡Pedido Realizado!
          </Text>
          <Text style={styles.subtituloEstado} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Su pedido está en estado: verificar pago
          </Text>
        </View>

        {/* DETALLES DEL CLIENTE */}
        <View style={styles.tarjetaInfo}>
          <Text style={styles.tituloSeccion} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Datos del Cliente
          </Text>
          
          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Nombre</Text>
            <Text style={styles.valor} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.nombre}</Text>
          </View>
          
          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Apellido</Text>
            <Text style={styles.valor} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.apellido}</Text>
          </View>
        </View>

        {/* DETALLES DEL PEDIDO */}
        <View style={styles.tarjetaInfo}>
          <Text style={styles.tituloSeccion} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Detalles del Pedido
          </Text>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Fecha</Text>
            <Text style={styles.valor} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.fecha}</Text>
          </View>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta} allowFontScaling={true} maxFontSizeMultiplier={1.3}>ID del Pedido</Text>
            <Text style={styles.valorDestacado} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.idPedido}</Text>
          </View>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Método de Pago</Text>
            <Text style={styles.valor} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.metodoPago}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={[styles.filaInfo, { marginTop: 8 }]}>
            <Text style={styles.etiquetaTotal} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Total a Pagar</Text>
            <Text style={styles.valorTotal} allowFontScaling={true} maxFontSizeMultiplier={1.3}>{datosPedido.total}$</Text>
          </View>
        </View>

      </ScrollView>

      {/* Botón Inferior Fijo adaptado a la barra de navegación o gestos de Android */}
      <View style={[styles.contenedorFijoInferior, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <TouchableOpacity
          style={styles.botonEntendido}
          onPress={() => {
            navigation.popToTop(); 
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonEntendido} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
            Entendido
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  contenidoScroll: {
    paddingHorizontal: 16,
  },
  tarjetaEstado: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  circuloCheck: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcono: {
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -3,
  },
  lineaCheck: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkCorto: {
    width: 11,
    height: 4,
    transform: [{ rotate: '45deg' }],
    left: 4,
    top: 12,
  },
  checkLargo: {
    width: 22,
    height: 4,
    transform: [{ rotate: '-45deg' }],
    right: 2,
    top: 9,
  },
  tituloEstado: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtituloEstado: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '500',
  },
  tarjetaInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tituloSeccion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 12,
  },
  filaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  etiqueta: {
    fontSize: 14,
    color: '#8E8E93',
    flexShrink: 1,
  },
  valor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flexShrink: 1,
    textAlign: 'right',
  },
  valorDestacado: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flexShrink: 1,
    textAlign: 'right',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 10,
  },
  etiquetaTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  valorTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
    flexShrink: 1,
    textAlign: 'right',
  },
  contenedorFijoInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  botonEntendido: {
    backgroundColor: '#D81B60',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonEntendido: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});