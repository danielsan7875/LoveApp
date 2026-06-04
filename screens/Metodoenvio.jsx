import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MetodoEntrega() {

   const navigation = useNavigation();
    const PagoPress = () => {
      navigation.navigate("Metodopago");
    };

  // Estado para capturar la opción seleccionada: 'tienda', 'nacional' o 'delivery'
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // Estados para los formularios dinámicos
  const [empresaEnvio, setEmpresaEnvio] = useState(''); // ZOOM o MRW
  const [codigoSucursal, setCodigoSucursal] = useState('');
  const [direccionNacional, setDireccionNacional] = useState('');

  const [deliverySeleccionado, setDeliverySeleccionado] = useState('');
  const [zona, setZona] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [sector, setSector] = useState('');
  const [direccionExacta, setDireccionExacta] = useState('');

  // Lista de métodos disponibles basada en tu imagen
  const metodos = [
    { id: 'tienda', titulo: 'Retiro en tienda física', descripcion: 'Recoge directamente en nuestro local' },
    { id: 'nacional', titulo: 'Envíos Nacionales', descripcion: 'Envío por agencias de encomienda' },
    { id: 'delivery', titulo: 'Servicio Delivery', descripcion: 'Entrega directa hasta tu ubicación' },
  ];

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      {/* Encabezado */}
     
      <ScrollView contentContainerStyle={styles.contenidoScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitulo}>Selecciona una opción</Text>

        {/* Mapeo de las opciones tipo Radio Button */}
        {metodos.map((metodo) => {
          const estaSeleccionado = metodoSeleccionado === metodo.id;
          return (
            <TouchableOpacity
              key={metodo.id}
              style={[styles.tarjetaMetodo, estaSeleccionado && styles.tarjetaSeleccionada]}
              activeOpacity={0.8}
              onPress={() => setMetodoSeleccionado(metodo.id)}
            >
              {/* Círculo del Icono decorativo lateral */}
              <View style={[styles.circuloIcono, estaSeleccionado && styles.circuloIconoActivo]}>
                <Text style={[styles.textoIcono, estaSeleccionado && styles.textoIconoActivo]}>
                  {metodo.id === 'tienda' ? 'T' : metodo.id === 'nacional' ? 'N' : 'D'}
                </Text>
              </View>

              {/* Textos del método */}
              <View style={styles.infoMetodo}>
                <Text style={styles.tituloMetodo}>{metodo.titulo}</Text>
                <Text style={styles.descripcionMetodo}>{metodo.descripcion}</Text>
              </View>

              {/* Radio Button Customizado */}
              <View style={[styles.radioExterior, estaSeleccionado && styles.radioExteriorActivo]}>
                {estaSeleccionado && <View style={styles.radioInterior} />}
              </View>
            </TouchableOpacity>
          );
        })}

    
        {/* FORMULARIO DINÁMICO: ENVÍOS NACIONALES */}
        {metodoSeleccionado === 'nacional' && (
          <View style={styles.formularioContenedor}>
            <Text style={styles.tituloFormulario}>Detalles del Envío Nacional</Text>
            
            <Text style={styles.etiquetaInput}>Empresa de encomienda (ZOOM / MRW)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. ZOOM"
              placeholderTextColor="#999"
              value={empresaEnvio}
              onChangeText={setEmpresaEnvio}
            />

            <Text style={styles.etiquetaInput}>Código de la Sucursal</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. SUC-1045"
              placeholderTextColor="#999"
              value={codigoSucursal}
              onChangeText={setCodigoSucursal}
            />

            <Text style={styles.etiquetaInput}>Dirección de la Agencia</Text>
            <TextInput
              style={[styles.input, styles.inputArea]}
              placeholder="Escribe la dirección de la sucursal de destino..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={direccionNacional}
              onChangeText={setDireccionNacional}
            />
          </View>
        )}


        {/* FORMULARIO DINÁMICO: DELIVERY */}
        {metodoSeleccionado === 'delivery' && (
          <View style={styles.formularioContenedor}>
            <Text style={styles.tituloFormulario}>Detalles del Delivery</Text>
            
            <Text style={styles.etiquetaInput}>Seleccionar Delivery / Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Motorizado Interno, Yummy, etc."
              placeholderTextColor="#999"
              value={deliverySeleccionado}
              onChangeText={setDeliverySeleccionado}
            />

            <View style={styles.filaInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.etiquetaInput}>Zona</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Norte"
                  placeholderTextColor="#999"
                  value={zona}
                  onChangeText={setZona}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.etiquetaInput}>Parroquia</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Tamaca"
                  placeholderTextColor="#999"
                  value={parroquia}
                  onChangeText={setParroquia}
                />
              </View>
            </View>

            <Text style={styles.etiquetaInput}>Sector</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Las Nueva Segovias"
              placeholderTextColor="#999"
              value={sector}
              onChangeText={setSector}
            />

            <Text style={styles.etiquetaInput}>Dirección Exacta (Casa, Punto de referencia)</Text>
            <TextInput
              style={[styles.input, styles.inputArea]}
              placeholder="Indica detalladamente tu ubicación para el repartidor..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={direccionExacta}
              onChangeText={setDireccionExacta}
            />
          </View>
        )}
      </ScrollView>

      {/* Botón Inferior Fijo */}
      <View style={styles.contenedorFijoInferior}>
        <TouchableOpacity
          style={[styles.botonContinuar, !metodoSeleccionado && styles.botonDeshabilitado]}
          disabled={!metodoSeleccionado}
          onPress={PagoPress}
        >
          <Text style={styles.textoBotonContinuar}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Fondo rosado muy claro igual que tu carrito
  },
  encabezado: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    alignItems: 'center',
  },
  tituloPantalla: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D81B60', // Tu rosado característico
  },
  contenidoScroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // Margen extra abajo para evitar que el botón tape el formulario
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  // Estilos de las tarjetas de selección
  tarjetaMetodo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tarjetaSeleccionada: {
    borderColor: '#D81B60', // Resalta con borde rosado al marcarse
  },
  circuloIcono: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  circuloIconoActivo: {
    backgroundColor: '#FCE4EC', // Rosado pastel de fondo para el icono activo
  },
  textoIcono: {
    fontSize: 20,
  },
  textoIconoActivo: {
    opacity: 1,
  },
  infoMetodo: {
    flex: 1,
  },
  tituloMetodo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  descripcionMetodo: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Radio Buttons Estilizados en CSS puro
  radioExterior: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioExteriorActivo: {
    borderColor: '#D81B60',
  },
  radioInterior: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D81B60',
  },
  // Formularios Dinámicos
  formularioContenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    elevation: 3,
  },
  tituloFormulario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 6,
  },
  etiquetaInput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  inputArea: {
    textAlignVertical: 'top', // Alinea el texto arriba en Android
    height: 70,
  },
  filaInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Área del botón inferior fijo
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
  botonContinuar: {
    backgroundColor: '#D81B60',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#E0A6BC', // Tono opaco si no ha seleccionado nada
  },
  textoBotonContinuar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});