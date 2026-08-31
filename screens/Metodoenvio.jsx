import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Select from '../componentes/Select';
import { fetchDeliveries } from '../services/api';

const empresasNacionales = [
  { label: 'MRW', value: 2 },
  { label: 'ZOOM', value: 3 },
];

// Mismas listas en cascada que la web (assets/js/Pedidoentrega.js)
const parroquiasPorZona = {
  norte: ['El Cuji', 'Tamaca'],
  sur: ['Juan de Villegas', 'Union'],
  este: ['Santa Rosa', 'Cabudare'],
  oeste: ['Concepcion'],
  centro: ['Catedral'],
};

const sectoresPorParroquia = {
  'Catedral': ['Centro', 'Urbanizacion Santa Elena', 'Barrios La Cruz', 'Colinas del Viento'],
  'Concepcion': ['La Playa', 'El Manzano', 'Urbanizacion El Obelisco', 'Barrio Bolivar'],
  'El Cuji': ['Altos de El Cuji', 'La Pastora', 'El Cuji Centro', 'Barrio El Caribe'],
  'Juan de Villegas': ['La Carucieña', 'La Paz', 'Urbanizacion Sucre', 'Barrio El Tostao'],
  'Santa Rosa': ['Santa Rosa Centro', 'El Cercado', 'Urbanizacion El Ujano', 'Barrio El Garabatal'],
  'Tamaca': ['Tamaca Centro', 'El Trompillo', 'Barrio El Jebe', 'Urbanizacion El Sisal'],
  'Union': ['Barrio Union', 'San Jacinto', 'Urbanización El Pedregal', 'Barrio El Carmen'],
  'Cabudare': ['La Piedad Norte', 'La Mora', 'El Trigal', 'Valle Hondo', 'Tarabana', 'Agua Viva', 'El Recreo', 'La Estancia', 'Las Mercedes', 'Los Pinos', 'La Mata', 'San Rafael'],
};

const zonasDelivery = [
  { label: 'Norte', value: 'norte' },
  { label: 'Sur', value: 'sur' },
  { label: 'Este', value: 'este' },
  { label: 'Oeste', value: 'oeste' },
  { label: 'Centro', value: 'centro' },
];

// Misma regla que la web: letras (con acentos), números y puntuación de direcciones reales
const regexDireccion = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#\-_()\/]{10,150}$/;

export default function MetodoEntrega() {

   const navigation = useNavigation();
   const route = useRoute();
   const total = route.params?.total ?? 0;

    const PagoPress = () => {
      if (!metodoSeleccionado) return;

      let entrega = {};

      if (metodoSeleccionado === 'tienda') {
        entrega = {
          id_metodoentrega: 4,
          direccion_envio: 'Retiro en Tienda Fisica',
          sucursal_envio: '',
          id_delivery: null,
        };
      } else if (metodoSeleccionado === 'nacional') {
        if (!empresaEnvio || !codigoSucursal) {
          Alert.alert('Campos requeridos', 'Selecciona la empresa de encomienda e indica el código de sucursal.');
          return;
        }
        entrega = {
          id_metodoentrega: empresaEnvio,
          direccion_envio: direccionNacional,
          sucursal_envio: codigoSucursal,
          id_delivery: null,
        };
      } else if (metodoSeleccionado === 'delivery') {
        if (!idDelivery) {
          Alert.alert('Campo requerido', 'Selecciona un delivery disponible.');
          return;
        }
        if (!zona || !parroquia || !sector) {
          Alert.alert('Campos requeridos', 'Selecciona zona, parroquia y sector.');
          return;
        }
        const dirLimpia = direccionExacta.trim();
        if (!regexDireccion.test(dirLimpia)) {
          Alert.alert('Dirección inválida', 'Debe tener entre 10 y 150 caracteres (letras, números y signos como . , # - / ( )).');
          return;
        }
        entrega = {
          id_metodoentrega: 1,
          // Mismo formato que construye la web (controlador/Pedidoentrega.php)
          direccion_envio: `Zona: ${zona}, Parroquia: ${parroquia}, Sector: ${sector}, Dirección: ${dirLimpia}`,
          sucursal_envio: '',
          id_delivery: idDelivery,
        };
      }

      navigation.navigate("Metodopago", { total, entrega });
    };

  // Estado para capturar la opción seleccionada: 'tienda', 'nacional' o 'delivery'
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // Estados para los formularios dinámicos
  const [empresaEnvio, setEmpresaEnvio] = useState(null); // 2 (MRW) o 3 (ZOOM)
  const [codigoSucursal, setCodigoSucursal] = useState('');
  const [direccionNacional, setDireccionNacional] = useState('');

  const [idDelivery, setIdDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [cargandoDelivery, setCargandoDelivery] = useState(false);
  const [errorDelivery, setErrorDelivery] = useState(null); // null | 'sesion' | 'red'
  const [zona, setZona] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [sector, setSector] = useState('');
  const [direccionExacta, setDireccionExacta] = useState('');

  // Cargar los deliveries activos desde la API (igual que el select de la web)
  const cargarDeliveries = useCallback(async () => {
    setCargandoDelivery(true);
    setErrorDelivery(null);
    try {
      const lista = await fetchDeliveries();
      setDeliveries(lista);
    } catch (e) {
      const status = e?.response?.status;
      setErrorDelivery(status === 401 || status === 403 ? 'sesion' : 'red');
    } finally {
      setCargandoDelivery(false);
    }
  }, []);

  useEffect(() => {
    cargarDeliveries();
  }, [cargarDeliveries]);

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
            
            <Select
              label="Empresa de encomienda"
              opciones={empresasNacionales}
              value={empresaEnvio}
              onSelect={setEmpresaEnvio}
              placeholder="Selecciona MRW o ZOOM"
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

            {cargandoDelivery && (
              <View style={styles.filaCarga}>
                <ActivityIndicator size="small" color="#D81B60" />
                <Text style={styles.textoCarga}>Cargando deliveries disponibles...</Text>
              </View>
            )}

            {errorDelivery && !cargandoDelivery && (
              <View style={styles.filaCarga}>
                <Text style={styles.textoError}>
                  {errorDelivery === 'sesion'
                    ? 'Tu sesión expiró. Cierra sesión y vuelve a iniciar sesión.'
                    : 'No se pudieron cargar los deliveries. Revisa tu conexión.'}
                </Text>
                <TouchableOpacity style={styles.botonReintentar} onPress={cargarDeliveries}>
                  <Text style={styles.textoReintentar}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            {!cargandoDelivery && !errorDelivery && (
              <Select
                label="Servicio de Delivery"
                opciones={deliveries.map((d) => ({ label: `${d.tipo} --- ${d.nombre}`, value: d.id_delivery }))}
                value={idDelivery}
                onSelect={setIdDelivery}
                placeholder="Seleccione repartidor o empresa"
              />
            )}

            <Select
              label="Zona"
              opciones={zonasDelivery}
              value={zona}
              onSelect={(v) => {
                setZona(v);
                setParroquia('');
                setSector('');
              }}
              placeholder="-- Selecciona una zona --"
            />

            <Select
              label="Parroquia"
              opciones={(parroquiasPorZona[zona] || []).map((p) => ({ label: p, value: p }))}
              value={parroquia}
              onSelect={(v) => {
                setParroquia(v);
                setSector('');
              }}
              placeholder="-- Selecciona una parroquia --"
            />

            <Select
              label="Sector / Urbanización"
              opciones={(sectoresPorParroquia[parroquia] || []).map((s) => ({ label: s, value: s }))}
              value={sector}
              onSelect={setSector}
              placeholder="-- Selecciona un sector --"
            />

            <Text style={styles.etiquetaInput}>Dirección Exacta (Casa, Punto de referencia)</Text>
            <TextInput
              style={[styles.input, styles.inputArea]}
              placeholder="Ej. Av. Lara con Av. Los Leones, edif. X, piso 2, apto 2B"
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
  // Estados de carga/error del listado de deliveries
  filaCarga: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  textoCarga: {
    fontSize: 13,
    color: '#666',
  },
  textoError: {
    fontSize: 13,
    color: '#C62828',
    flexShrink: 1,
  },
  botonReintentar: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  textoReintentar: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D81B60',
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