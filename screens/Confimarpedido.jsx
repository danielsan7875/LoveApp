import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function PedidoFinalizado({ route, navigation }) {
  // Datos simulados (puedes recibirlos por props o route.params al navegar)
  const datosPedido = {
    idPedido: "SMT53237653",
    fecha: "04 Jun, 2026, 01:30 AM",
    metodoPago: "Pago Móvil",
    total: "95.36",
    nombre: "Daniel",
    apellido: "Sánchez"
  };

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      

      <ScrollView contentContainerStyle={styles.contenidoScroll} showsVerticalScrollIndicator={false}>
        
        {/*  ESTADO DEL PEDIDO */}
        <View style={styles.tarjetaEstado}>
          {/* Icono de Check en Círculo Verde */}
          <View style={styles.circuloCheck}>
            <View style={styles.checkIcono}>
              <View style={[styles.lineaCheck, styles.checkCorto]} />
              <View style={[styles.lineaCheck, styles.checkLargo]} />
            </View>
          </View>
          
          <Text style={styles.tituloEstado}>¡Pedido Realizado!</Text>
          <Text style={styles.subtituloEstado}>Su pedido está en estado: verificar pago</Text>
        </View>

        {/*  DETALLES DEL CLIENTE Y COMPRA */}
        <View style={styles.tarjetaInfo}>
          <Text style={styles.tituloSeccion}>Datos del Cliente</Text>
          
          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta}>Nombre</Text>
            <Text style={styles.valor}>{datosPedido.nombre}</Text>
          </View>
          
          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta}>Apellido</Text>
            <Text style={styles.valor}>{datosPedido.apellido}</Text>
          </View>
        </View>

        <View style={styles.tarjetaInfo}>
          <Text style={styles.tituloSeccion}>Detalles del Pedido</Text>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta}>Fecha</Text>
            <Text style={styles.valor}>{datosPedido.fecha}</Text>
          </View>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta}>ID del Pedido</Text>
            <Text style={styles.valorDestacado}>{datosPedido.idPedido}</Text>
          </View>

          <View style={styles.filaInfo}>
            <Text style={styles.etiqueta}>Método de Pago</Text>
            <Text style={styles.valor}>{datosPedido.metodoPago}</Text>
          </View>

          {/* Divisor sutil antes del total general */}
          <View style={styles.divisor} />

          <View style={[styles.filaInfo, { marginTop: 8 }]}>
            <Text style={styles.etiquetaTotal}>Total a Pagar</Text>
            <Text style={styles.valorTotal}>{datosPedido.total}$</Text>
          </View>
        </View>

      </ScrollView>

      {/* Botón Inferior Fijo */}
      <View style={styles.contenedorFijoInferior}>
        <TouchableOpacity
          style={styles.botonEntendido}
          onPress={() => {
            // Te regresa al inicio de la aplicación o tienda limpio
            console.log("Volver al inicio");
            navigation.popToTop(); 
          }}
        >
          <Text style={styles.textoBotonEntendido}>Entendido</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#FFF1F2', // El mismo fondo rosa claro del carrito
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tituloPantalla: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    flex: 1,
  },
  botonAtras: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flechaIcono: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineaFlecha: {
    position: 'absolute',
    width: 10,
    height: 3,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    left: 3,
  },
  lineaSuperior: {
    transform: [{ rotate: '-45deg' }],
    top: 6,
  },
  lineaInferior: {
    transform: [{ rotate: '45deg' }],
    bottom: 6,
  },
  lineaCuerpo: {
    position: 'absolute',
    width: 14,
    height: 3,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    left: 4,
  },
  contenidoScroll: {
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 100,
  },
  
  // CONTENEDOR DEL CHECK SUPERIOR
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
    backgroundColor: '#4CD964', // Verde de éxito limpio
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
  },
  subtituloEstado: {
    fontSize: 14,
    color: '#7F8C8D', // Gris intermedio para resaltar el estado pendiente
    textAlign: 'center',
    fontWeight: '500',
  },

  // BLOQUES DE INFORMACIÓN RESTRUCTURADOS 
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
  },
  etiqueta: {
    fontSize: 14,
    color: '#8E8E93', // Gris claro idéntico a tu mockup
  },
  valor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  valorDestacado: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
  },
  valorTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60', // Resalta el precio final en rosado
  },

  // Botón Inferior Fijo
  contenedorFijoInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
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
    paddingVertical: 16,
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