import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Select from '../componentes/Select';
import Input from '../componentes/Inputvalidacion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchDeliveries } from '../services/api';

const empresasNacionales = [
  { label: 'MRW', value: 2 },
  { label: 'ZOOM', value: 3 },
];

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

const patronAgencia = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#\-_()\/]{10,100}$/;
const patronDireccion = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#\-_()\/]{10,150}$/;
const patronCodigoSucursal = /^[0-9]{5,7}$/;

export default function MetodoEntrega() {
   const navigation = useNavigation();
   const route = useRoute();
   const total = route.params?.total ?? 0;
   const insets = useSafeAreaInsets();

   const {
      control,
      handleSubmit,
      formState: { isSubmitted },
   } = useForm({
      mode: 'onTouched',
      shouldUnregister: true,
   });

    const onContinuar = (data) => {
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
        if (!empresaEnvio) {
          Alert.alert('Campo requerido', 'Selecciona la empresa de encomienda.');
          return;
        }
        entrega = {
          id_metodoentrega: empresaEnvio,
          direccion_envio: (data.direccionAgencia || '').trim(),
          sucursal_envio: data.codigoSucursal || '',
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
        const dirLimpia = (data.direccionExacta || '').trim();
        entrega = {
          id_metodoentrega: 1,
          direccion_envio: `Zona: ${zona}, Parroquia: ${parroquia}, Sector: ${sector}, Dirección: ${dirLimpia}`,
          sucursal_envio: '',
          id_delivery: idDelivery,
          zona,
          parroquia,
          sector,
          direccion: dirLimpia,
        };
      }

      navigation.navigate("Metodopago", { total, entrega });
    };

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [empresaEnvio, setEmpresaEnvio] = useState(null);
  const [idDelivery, setIdDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [cargandoDelivery, setCargandoDelivery] = useState(false);
  const [errorDelivery, setErrorDelivery] = useState(null);
  const [zona, setZona] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [sector, setSector] = useState('');

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

  const metodos = [
    { id: 'tienda', titulo: 'Retiro en tienda física', descripcion: 'Recoge directamente en nuestro local' },
    { id: 'nacional', titulo: 'Envíos Nacionales', descripcion: 'Envío por agencias de encomienda' },
    { id: 'delivery', titulo: 'Servicio Delivery', descripcion: 'Entrega directa hasta tu ubicación' },
  ];

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.contenidoScroll, 
            { paddingBottom: Math.max(insets.bottom, 20) + 110 }
          ]} 
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitulo} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Selecciona una opción
          </Text>

          {metodos.map((metodo) => {
            const estaSeleccionado = metodoSeleccionado === metodo.id;
            return (
              <TouchableOpacity
                key={metodo.id}
                style={[styles.tarjetaMetodo, estaSeleccionado && styles.tarjetaSeleccionada]}
                activeOpacity={0.8}
                onPress={() => setMetodoSeleccionado(metodo.id)}
              >
                <View style={[styles.circuloIcono, estaSeleccionado && styles.circuloIconoActivo]}>
                  <Text style={styles.textoIcono}>
                    {metodo.id === 'tienda' ? 'T' : metodo.id === 'nacional' ? 'N' : 'D'}
                  </Text>
                </View>

                <View style={styles.infoMetodo}>
                  <Text style={styles.tituloMetodo} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    {metodo.titulo}
                  </Text>
                  <Text style={styles.descripcionMetodo} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    {metodo.descripcion}
                  </Text>
                </View>

                <View style={[styles.radioExterior, estaSeleccionado && styles.radioExteriorActivo]}>
                  {estaSeleccionado && <View style={styles.radioInterior} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {metodoSeleccionado === 'nacional' && (
            <View style={styles.formularioContenedor}>
              <Text style={styles.tituloFormulario} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                Detalles del Envío Nacional
              </Text>
              
              <Select
                label="Empresa de encomienda"
                opciones={empresasNacionales}
                value={empresaEnvio}
                onSelect={setEmpresaEnvio}
                placeholder="Selecciona MRW o ZOOM"
              />

              <Input
                name="codigoSucursal"
                label="Código de la Sucursal"
                placeholder="Ej. 2140"
                icon="hash-outline"
                control={control}
                isSubmitted={isSubmitted}
                keyboardType="number-pad"
                maxLength={7}
                onChangeTextModifier={(t) => t.replace(/\D/g, '')}
                rules={{
                  required: 'El código de sucursal es obligatorio',
                  pattern: {
                    value: patronCodigoSucursal,
                    message: 'Debe tener entre 5 y 7 dígitos',
                  },
                }}
              />

              <Input
                name="direccionAgencia"
                label="Nombre / Dirección de la Agencia"
                placeholder="Ej. MRW Sucursal Barquisimeto Centro"
                icon="location-outline"
                control={control}
                isSubmitted={isSubmitted}
                maxLength={100}
                rules={{
                  required: 'La dirección de la agencia es obligatoria',
                  pattern: {
                    value: patronAgencia,
                    message: 'Entre 10 y 100 caracteres (letras, números y . , # - / ( ))',
                  },
                }}
              />
            </View>
          )}

          {metodoSeleccionado === 'delivery' && (
            <View style={styles.formularioContenedor}>
              <Text style={styles.tituloFormulario} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                Detalles del Delivery
              </Text>

              {cargandoDelivery && (
                <View style={styles.filaCarga}>
                  <ActivityIndicator size="small" color="#D81B60" />
                  <Text style={styles.textoCarga} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    Cargando deliveries disponibles...
                  </Text>
                </View>
              )}

              {errorDelivery && !cargandoDelivery && (
                <View style={styles.filaCarga}>
                  <Text style={styles.textoError} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
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

              <Input
                name="direccionExacta"
                label="Dirección Exacta (Casa, Punto de referencia)"
                placeholder="Ej. Av. Lara con Av. Los Leones, edif. X, piso 2, apto 2B"
                icon="home-outline"
                control={control}
                isSubmitted={isSubmitted}
                maxLength={150}
                rules={{
                  required: 'La dirección exacta es obligatoria',
                  pattern: {
                    value: patronDireccion,
                    message: 'Entre 10 y 150 caracteres (letras, números y . , # - / ( ))',
                  },
                }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botón Inferior Fijo adaptado al borde seguro y botones/gestos de Android */}
      <View style={[styles.contenedorFijoInferior, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <TouchableOpacity
          style={[styles.botonContinuar, !metodoSeleccionado && styles.botonDeshabilitado]}
          disabled={!metodoSeleccionado}
          onPress={handleSubmit(onContinuar)}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonContinuar} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1F2",
  },
  keyboardContainer: {
    flex: 1,
  },
  contenidoScroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
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
    borderColor: '#D81B60',
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
    backgroundColor: '#FCE4EC',
  },
  textoIcono: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D81B60',
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
  filaCarga: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap',
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
  botonContinuar: {
    backgroundColor: '#D81B60',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#E0A6BC',
  },
  textoBotonContinuar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});