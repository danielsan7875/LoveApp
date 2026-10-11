import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearCart } from '../redux/cartSlice';
import { registrarPedido } from '../services/api';
import Select from '../componentes/Select';
import Input from '../componentes/Inputvalidacion';
import TasaOficial from '../informacion/dolar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const TAMANO_MAXIMO_MB = 5;
const TAMANO_MAXIMO_BYTES = TAMANO_MAXIMO_MB * 1024 * 1024;

const BANCOS_ORIGEN = [
  '0102-Banco De Venezuela',
  '0156-100% Banco ',
  '0172-Bancamiga Banco Universal,C.A',
  '0114-Bancaribe',
  '0171-Banco Activo',
  '0166-Banco Agricola De Venezuela',
  '0128-Bancon Caroni',
  '0163-Banco Del Tesoro',
  '0175-Banco Digital De Los Trabajadores, Banco Universal',
  '0115-Banco Exterior',
  '0151-Banco Fondo Comun',
  '0173-Banco Internacional De Desarrollo',
  '0105-Banco Mercantil',
  '0191-Banco Nacional De Credito',
  '0138-Banco Plaza',
  '0137-Banco Sofitasa',
  '0104-Banco Venezolano De Credito',
  '0168-Bancrecer',
  '0134-Banesco',
  '0177-Banfanb',
  '0146-Bangente',
  '0174-Banplus',
  '0108-BBVA Provincial',
  '0157-Delsur Banco Universal',
  '0601-Instituto Municipal De Credito Popular',
  '0178-N58 Banco Digital Banco Microfinanciero S.A',
  '0169-R4 Banco Microfinanciero C.A.',
];

const BANCOS_DESTINO = [
  '0102-Banco De Venezuela',
  '0105-Banco Mercantil',
];

export default function MetodoPago() {
   const navigation = useNavigation();
   const route = useRoute();
   const dispatch = useDispatch();
   const insets = useSafeAreaInsets();

   const total = route.params?.total ?? 0;
   const entrega = route.params?.entrega ?? {};

   const carrito = useSelector(state => state.cart.items);
   const user = useSelector(state => state.auth.user);
   const cedula = user?.cedula;

   const [loading, setLoading] = useState(false);

   const {
      control,
      handleSubmit,
      watch,
      formState: { isSubmitted },
   } = useForm({
      mode: 'onTouched',
   });
   const referenciaValor = watch('referencia_bancaria');

   const handleConfirmar = async (data) => {
     if (!bancoOrigen || !bancoDestino) return;
     if (!cedula) {
       Alert.alert('Sesión', 'No hay sesión activa. Inicia sesión de nuevo.');
       return;
     }
     if (carrito.length === 0) {
       Alert.alert('Carrito', 'Tu carrito está vacío.');
       return;
     }

     setLoading(true);

     const ahora = new Date();
     const fecha = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours() % 12 || 12).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')} ${ahora.getHours() >= 12 ? 'PM' : 'AM'}`;

     const totalBs = parseFloat(montoBsCalculado) || 0;

     const datosPedido = {
       tipo: 2,
       fecha,
       estado: 1,
       precio_total_usd: total,
       precio_total_bs: totalBs,
       id_persona: parseInt(String(cedula).replace(/\D/g, ''), 10),

       id_metodopago: 1,
       referencia_bancaria: data.referencia_bancaria,
       telefono_emisor: data.telefono_emisor,
       banco_destino: bancoDestino,
       banco: bancoOrigen,
       monto: totalBs,
       monto_usd: total,
       imagen: comprobante ? `data:${comprobante.type};base64,${comprobante.base64}` : null,

       id_metodoentrega: entrega.id_metodoentrega,
       direccion_envio: entrega.direccion_envio || '',
       sucursal_envio: entrega.sucursal_envio || '',
       id_delivery: entrega.id_delivery ?? null,

       ...(entrega.id_metodoentrega === 1
         ? {
             zona: entrega.zona || '',
             parroquia: entrega.parroquia || '',
             sector: entrega.sector || '',
             direccion: entrega.direccion || '',
           }
         : {}),

       carrito: carrito.map(item => ({
         id: item.id,
         cantidad: item.cantidad,
         cantidad_mayor: item.cantidad_mayor || 0,
         precio_detal: parseFloat(item.precioDetal) || 0,
         precio_mayor: parseFloat(item.precioMayor) || 0,
       })),
     };

     try {
       const resultado = await registrarPedido(datosPedido);

       if (resultado && resultado.success) {
         dispatch(clearCart());
         navigation.replace('Confirmarpedido', {
           pedido: {
             idPedido: resultado.id_pedido,
             total: total.toFixed(2),
             metodoPago: 'Pago Móvil',
             fecha,
           },
         });
       } else {
         Alert.alert('Error', resultado?.message || 'No se pudo registrar el pedido.');
       }
     } catch (e) {
       Alert.alert('Error', 'Error de conexión con el servidor.');
     } finally {
       setLoading(false);
     }
   };

  const datosPagoMovil = {
    banco: "Mercantil (0105)",
    cedula: "11787299",
    telefono: "04265541364"
  };

  const [bancoOrigen, setBancoOrigen] = useState('');
  const [bancoDestino, setBancoDestino] = useState('');
  const [comprobante, setComprobante] = useState(null);

  const tasaCambio = TasaOficial();
  const montoBsCalculado = tasaCambio ? (total * parseFloat(tasaCambio)).toFixed(2) : '0.00';

  const [copiadoCedula, setCopiadoCedula] = useState(false);
  const [copiadoTelf, setCopiadoTelf] = useState(false);

  const copiarAlPortapapeles = (texto, tipo) => {
    if (tipo === 'cedula') {
      setCopiadoCedula(true);
      setTimeout(() => setCopiadoCedula(false), 2000);
    } else {
      setCopiadoTelf(true);
      setTimeout(() => setCopiadoTelf(false), 2000);
    }
  };

  const seleccionarComprobante = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar el comprobante.');
        return;
      }

      const opciones = {
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: Platform.OS === 'web' ? 1 : 0.7,
        base64: true,
      };

      const resultado = await ImagePicker.launchImageLibraryAsync(opciones);

      if (resultado.canceled || !resultado.assets?.length) return;

      const asset = resultado.assets[0];

      if (asset.fileSize && asset.fileSize > TAMANO_MAXIMO_BYTES) {
        Alert.alert(
          'Imagen muy pesada',
          `El comprobante no puede pesar más de ${TAMANO_MAXIMO_MB}MB. Tu imagen pesa ${(asset.fileSize / 1024 / 1024).toFixed(1)}MB.`
        );
        return;
      }

      let base64Data = asset.base64;
      let mimeType = asset.mimeType || 'image/jpeg';

      if (!base64Data && asset.uri) {
        if (asset.uri.startsWith('data:')) {
          const idx = asset.uri.indexOf(',');
          if (idx > 0) base64Data = asset.uri.substring(idx + 1);
          const mimeMatch = asset.uri.match(/^data:(image\/\w+);/);
          if (mimeMatch) mimeType = mimeMatch[1];
        } else if (Platform.OS === 'web') {
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            base64Data = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(',')[1]);
              reader.readAsDataURL(blob);
            });
            if (blob.type) mimeType = blob.type;
          } catch (e) {}
        } else {
          try {
            const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            base64Data = fileContent;
          } catch (e) {}
        }
      }

      if (!base64Data) {
        Alert.alert('Error', 'No se pudo obtener el contenido de la imagen.');
        return;
      }

      setComprobante({
        uri: asset.uri,
        name: asset.fileName || 'comprobante.jpg',
        type: mimeType,
        base64: base64Data,
        size: asset.fileSize,
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const quitarComprobante = () => {
    setComprobante(null);
  };

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.contenidoScroll, 
            { paddingBottom: Math.max(insets.bottom, 20) + 110 }
          ]} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitulo} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Datos de Pago Móvil
          </Text>

          {/* TARJETA VISUAL */}
          <View style={styles.tarjetaPago}>
            <View style={styles.circuloFondo1} />
            <View style={styles.circuloFondo2} />

            <View style={styles.tarjetaFilaSuperior}>
              <Text style={styles.tarjetaNombreBanco} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
                {datosPagoMovil.banco}
              </Text>
              <View style={styles.badgePagoMovil}>
                <Text style={styles.badgeTexto}>PAGO MÓVIL</Text>
              </View>
            </View>

            <View style={styles.tarjetaSeccionDatoPrincipal}>
              <Text style={styles.tarjetaNumeroTelf} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
                {datosPagoMovil.telefono}
              </Text>
              <TouchableOpacity 
                style={[styles.botonCopiar, copiadoTelf && styles.botonCopiarActivo]}
                onPress={() => copiarAlPortapapeles(datosPagoMovil.telefono, 'telefono')}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotonCopiar}>{copiadoTelf ? '¡Copiado!' : 'Copiar'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tarjetaFilaInferior}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.tarjetaEtiqueta}>CÉDULA DE IDENTIDAD</Text>
                <Text style={styles.tarjetaValorDato} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
                  V-{datosPagoMovil.cedula}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.botonCopiarSecundario, copiadoCedula && styles.botonCopiarActivo]}
                onPress={() => copiarAlPortapapeles(datosPagoMovil.cedula, 'cedula')}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotonCopiar}>{copiadoCedula ? '¡Copiado!' : 'Copiar'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORMULARIO DE REPORTE DE TRANSFERENCIA */}
          <View style={styles.formularioContenedor}>
            <Text style={styles.tituloFormulario} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
              Reportar Reporte de Pago
            </Text>

            <Select
              label="Banco de Origen (Desde donde envió)"
              opciones={BANCOS_ORIGEN}
              value={bancoOrigen}
              onSelect={setBancoOrigen}
              placeholder="Selecciona tu banco"
            />

            <Select
              label="Banco de Destino (Donde recibe el negocio)"
              opciones={BANCOS_DESTINO}
              value={bancoDestino}
              onSelect={setBancoDestino}
              placeholder="Selecciona el banco destino"
            />

            <Input
              name="referencia_bancaria"
              label="Código de Referencia (Últimos 4 a 6 dígitos)"
              placeholder="Ej. 123456"
              icon="receipt-outline"
              control={control}
              isSubmitted={isSubmitted}
              keyboardType="number-pad"
              maxLength={6}
              onChangeTextModifier={(t) => t.replace(/[^0-9]/g, '')}
              rules={{
                required: 'El código de referencia es obligatorio',
                pattern: {
                  value: /^[0-9]{4,6}$/,
                  message: 'Solo dígitos, entre 4 y 6',
                },
              }}
            />

            <View style={styles.filaInputs}>
              <View style={{ flex: 1.2, marginRight: 8 }}>
                <Input
                  name="telefono_emisor"
                  label="Teléfono Emisor (11 dígitos)"
                  placeholder="04141234567"
                  icon="call-outline"
                  control={control}
                  isSubmitted={isSubmitted}
                  keyboardType="number-pad"
                  maxLength={11}
                  onChangeTextModifier={(t) => t.replace(/[^0-9]/g, '')}
                  rules={{
                    required: 'El teléfono es obligatorio',
                    pattern: {
                      value: /^04(12|14|16|22|24|26)[0-9]{7}$/,
                      message: 'Teléfono inválido. Debe empezar con 0412, 0414, 0416, 0422, 0424 o 0426',
                    },
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.etiquetaInput} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                  Monto en Bs (auto)
                </Text>
                <View style={styles.inputMontoAuto}>
                  <Text style={styles.textoMontoAuto} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    {tasaCambio ? `Bs. ${montoBsCalculado}` : 'Cargando...'}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.etiquetaInput} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
              Comprobante de Operación (Opcional)
            </Text>

            {comprobante ? (
              <View style={styles.comprobantePreviewContainer}>
                <Image source={{ uri: comprobante.uri }} style={styles.comprobantePreview} resizeMode="cover" />
                <View style={styles.comprobanteInfo}>
                  <Text style={styles.comprobanteNombre} numberOfLines={1}>{comprobante.name}</Text>
                  <Text style={styles.comprobanteTamano}>
                    {comprobante.size ? `${(comprobante.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </Text>
                  <View style={styles.comprobanteAcciones}>
                    <TouchableOpacity
                      style={styles.comprobanteBtnCambiar}
                      onPress={seleccionarComprobante}
                    >
                      <Text style={styles.comprobanteBtnCambiarTxt}>Cambiar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.comprobanteBtnQuitar}
                      onPress={quitarComprobante}
                    >
                      <Ionicons name="trash-outline" size={16} color="#D81B60" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.botonComprobante}
                onPress={seleccionarComprobante}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={28} color="#D81B60" style={{ marginBottom: 4 }} />
                <Text style={styles.textoBotonComprobante} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                  Subir imagen del comprobante
                </Text>
                <Text style={styles.textoHintComprobante} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                  Máximo {TAMANO_MAXIMO_MB}MB · JPG o PNG
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botón Inferior Fijo adaptado al borde seguro y botones/gestos de Android */}
      <View style={[styles.contenedorFijoInferior, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <TouchableOpacity
          style={[
            styles.botonProcesar,
            (!bancoOrigen || !referenciaValor || !bancoDestino) && styles.botonDeshabilitado
          ]}
          disabled={!bancoOrigen || !referenciaValor || !bancoDestino || loading}
          onPress={handleSubmit(handleConfirmar)}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotonProcesar} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
              Registrar Pago y Finalizar
            </Text>
          )}
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
    marginBottom: 15,
  },
  tarjetaPago: {
    width: '100%',
    minHeight: 190,
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 20,
  },
  circuloFondo1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -40,
    right: -40,
  },
  circuloFondo2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    right: 40,
  },
  tarjetaFilaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  tarjetaNombreBanco: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  badgePagoMovil: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tarjetaSeccionDatoPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  tarjetaNumeroTelf: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    flexShrink: 1,
  },
  tarjetaFilaInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
  },
  tarjetaEtiqueta: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  tarjetaValorDato: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonCopiar: {
    backgroundColor: '#D81B60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  botonCopiarSecundario: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  botonCopiarActivo: {
    backgroundColor: '#4CD964',
  },
  textoBotonCopiar: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formularioContenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  filaInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  inputMontoAuto: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  textoMontoAuto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  botonComprobante: {
    borderWidth: 1,
    borderColor: '#D81B60',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    marginTop: 4,
  },
  textoBotonComprobante: {
    color: '#D81B60',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  textoHintComprobante: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
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
  botonProcesar: {
    backgroundColor: '#D81B60',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#E0A6BC',
  },
  textoBotonProcesar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  comprobantePreviewContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#D81B60',
    borderRadius: 10,
    padding: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  comprobantePreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  comprobanteInfo: {
    flex: 1,
  },
  comprobanteNombre: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  comprobanteTamano: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  comprobanteAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comprobanteBtnCambiar: {
    backgroundColor: '#D81B60',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  comprobanteBtnCambiarTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comprobanteBtnQuitar: {
    padding: 6,
  },
});