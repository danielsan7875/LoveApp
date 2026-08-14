import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { registrarPedido } from '../services/api';
import Select from '../componentes/Select';
import TasaOficial from '../informacion/dolar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

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

   const total = route.params?.total ?? 0;
   const entrega = route.params?.entrega ?? {};

   const carrito = useSelector(state => state.cart.items);
   const user = useSelector(state => state.auth.user);
   const cedula = user?.cedula;

   const [loading, setLoading] = useState(false);

   const handleConfirmar = async () => {
     if (!bancoOrigen || !referencia || !bancoDestino) return;
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
       referencia_bancaria: referencia,
       telefono_emisor: telefonoEmisor,
       banco_destino: bancoDestino,
       banco: bancoOrigen,
       monto: totalBs,
       monto_usd: total,
       imagen: comprobante ? `data:${comprobante.type};base64,${comprobante.base64}` : null,

       id_metodoentrega: entrega.id_metodoentrega,
       direccion_envio: entrega.direccion_envio || '',
       sucursal_envio: entrega.sucursal_envio || '',
       id_delivery: entrega.id_delivery ?? null,

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


  // Datos fijos del Pago Móvil del negocio
  const datosPagoMovil = {
    banco: "Mercantil (0105)",
    cedula: "11787299",
    telefono: "04265541364"
  };

  // Estados del Formulario de reporte de pago
  const [bancoOrigen, setBancoOrigen] = useState('');
  const [bancoDestino, setBancoDestino] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefonoEmisor, setTelefonoEmisor] = useState('');
  const [comprobante, setComprobante] = useState(null);

  // Tasa de dólar automática desde la API
  const tasaCambio = TasaOficial();
  const montoBsCalculado = tasaCambio ? (total * parseFloat(tasaCambio)).toFixed(2) : '0.00';

// Estados sutiles de feedback visual para saber qué se copió
   const [copiadoCedula, setCopiadoCedula] = useState(false);
   const [copiadoTelf, setCopiadoTelf] = useState(false);

   // Funciones para copiar al portapapeles de manera nativa
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
        allowsEditing: Platform.OS === 'web' ? false : true,
        aspect: [4, 3],
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
          } catch (e) {
            // ignore
          }
        } else {
          try {
            const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            base64Data = fileContent;
          } catch (e) {
            // ignore
          }
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
      
      <ScrollView contentContainerStyle={styles.contenidoScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitulo}>Datos de Pago Móvil</Text>


        {/* TARJETA VISUAL  */}

        <View style={styles.tarjetaPago}>
          {/* Círculos decorativos de fondo simulando el patrón de la imagen */}
          <View style={styles.circuloFondo1} />
          <View style={styles.circuloFondo2} />

          {/* Fila Superior */}
          <View style={styles.tarjetaFilaSuperior}>
            <Text style={styles.tarjetaNombreBanco}>{datosPagoMovil.banco}</Text>
            <View style={styles.badgePagoMovil}>
              <Text style={styles.badgeTexto}>PAGO MÓVIL</Text>
            </View>
          </View>

          {/* Fila del Teléfono (Equivalente al número de tarjeta grande) */}
          <View style={styles.tarjetaSeccionDatoPrincipal}>
            <Text style={styles.tarjetaNumeroTelf}>
              {datosPagoMovil.telefono.replace(/(\d{4})(\d{4})(\d{})/, '$1-$3-$4')}
            </Text>
            <TouchableOpacity 
              style={[styles.botonCopiar, copiadoTelf && styles.botonCopiarActivo]}
              onPress={() => copiarAlPortapapeles(datosPagoMovil.telefono, 'telefono')}
            >
              <Text style={styles.textoBotonCopiar}>{copiadoTelf ? '¡Copiado!' : 'Copiar'}</Text>
            </TouchableOpacity>
          </View>

          {/* Fila Inferior (Titular / Cédula) */}
          <View style={styles.tarjetaFilaInferior}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tarjetaEtiqueta}>CÉDULA DE IDENTIDAD</Text>
              <Text style={styles.tarjetaValorDato}>V-{datosPagoMovil.cedula}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.botonCopiarSecundario, copiadoCedula && styles.botonCopiarActivo]}
              onPress={() => copiarAlPortapapeles(datosPagoMovil.cedula, 'cedula')}
            >
              <Text style={styles.textoBotonCopiar}>{copiadoCedula ? '¡Copiado!' : 'Copiar '}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FORMULARIO DE REPORTE DE TRANSFERENCIA */}
        
        <View style={styles.formularioContenedor}>
          <Text style={styles.tituloFormulario}>Reportar Reporte de Pago</Text>

          {/* Banco de Origen */}
          <Select
            label="Banco de Origen (Desde donde envió)"
            opciones={BANCOS_ORIGEN}
            value={bancoOrigen}
            onSelect={setBancoOrigen}
            placeholder="Selecciona tu banco"
          />

          {/* Banco de Destino */}
          <Select
            label="Banco de Destino (Donde recibe el negocio)"
            opciones={BANCOS_DESTINO}
            value={bancoDestino}
            onSelect={setBancoDestino}
            placeholder="Selecciona el banco destino"
          />

          {/* Referencia Bancaria */}
          <Text style={styles.etiquetaInput}>Código de Referencia (Últimos 4 u 8 dígitos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ej. 123456"
            placeholderTextColor="#999"
            value={referencia}
            onChangeText={setReferencia}
          />

          {/* Fila de Teléfono emisor y Monto en Bs automático */}
          <View style={styles.filaInputs}>
            <View style={{ flex: 1.2, marginRight: 8 }}>
              <Text style={styles.etiquetaInput}>Teléfono Emisor</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="0414..."
                placeholderTextColor="#999"
                value={telefonoEmisor}
                onChangeText={setTelefonoEmisor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.etiquetaInput}>Monto en Bs (auto)</Text>
              <View style={styles.inputMontoAuto}>
                <Text style={styles.textoMontoAuto}>
                  {tasaCambio ? `Bs. ${montoBsCalculado}` : 'Cargando...'}
                </Text>
              </View>
            </View>
          </View>

          {/* Botón de Adjuntar Comprobante */}
          <Text style={styles.etiquetaInput}>Comprobante de Operación (Opcional)</Text>

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
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#D81B60" style={{ marginBottom: 4 }} />
              <Text style={styles.textoBotonComprobante}>Subir imagen del comprobante</Text>
              <Text style={styles.textoHintComprobante}>Máximo {TAMANO_MAXIMO_MB}MB · JPG o PNG</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      {/* Botón Inferior Fijo de Procesar */}
      <View style={styles.contenedorFijoInferior}>
        <TouchableOpacity
          style={[
            styles.botonProcesar,
            (!bancoOrigen || !referencia || !bancoDestino) && styles.botonDeshabilitado
          ]}
          disabled={!bancoOrigen || !referencia || !bancoDestino || loading}
          onPress={handleConfirmar}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotonProcesar}>Registrar Pago y Finalizar</Text>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  
  // ESTILOS DE LA CARD DE PAGO MÓVIL
  tarjetaPago: {
    width: '100%',
    height: 200,
    backgroundColor: '#3F51B5', // Azul premium de base, dándole contraste tecnológico
    borderRadius: 20,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden', // Evita que los círculos decorativos se salgan de la tarjeta
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
  },
  tarjetaNombreBanco: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  },
  tarjetaNumeroTelf: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  tarjetaFilaInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'bottom',
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
    fontSize: 21,
    fontWeight: 'bold',
  },
  botonCopiar: {
    backgroundColor: '#D81B60', // Tu rosado característico para resaltar la acción
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  botonCopiarSecundario: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  botonCopiarActivo: {
    backgroundColor: '#4CD964', // Cambia a verde exitoso al pulsar
  },
  textoBotonCopiar: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // FORMULARIO Y ENTRADAS
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
  filaInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputMontoAuto: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
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
    borderStyle: 'dashed', // Efecto punteado moderno para adjuntar
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
  },

  // Sección Inferior Fija
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
  botonProcesar: {
    backgroundColor: '#D81B60',
    paddingVertical: 16,
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

  // COMPROBANTE PREVIEW
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
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
  textoHintComprobante: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
});