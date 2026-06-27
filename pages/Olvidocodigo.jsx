import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import AlertModal from '../componentes/ModalAlert';
import { verificarCodigoOTP } from '../services/api';

export default function BodyOlvido({ activarCarga, desactivarCarga }) {
  const navigation = useNavigation();
  
  const HomePress = () => {
    navigation.navigate("MainTabs");
  };

  const ClavePress = () => {
    navigation.navigate("Olvidoclave");
  };

  const [segundos, setSegundos] = useState(120);

  // Estados para el Modal Alert
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [bloqueadoPorIntentos, setBloqueadoPorIntentos] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      digito1: '', digito2: '', digito3: '', digito4: '', digito5: '', digito6: ''
    }
  });

  const inputsRef = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null)
  ];

  useEffect(() => {
    if (segundos > 0) {
      const timer = setTimeout(() => setSegundos(segundos - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [segundos]);

  const manejarCambioTexto = (texto, index) => {
    const textoLimpio = texto.replace(/[^0-9]/g, '');
    setValue(`digito${index + 1}`, textoLimpio);

    if (textoLimpio.length >= 1 && index < 5) {
      inputsRef[index + 1].current.focus();
    }
  };

  const manejarBorrado = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      const valorActual = watch(`digito${index + 1}`);
      if (!valorActual || valorActual === '') {
        inputsRef[index - 1].current.focus();
      }
    }
  };

  // FUNCIÓN DE ENVÍO Y VALIDACIÓN COMPLETA
  const manejarVerificacion = async (datos) => {
    activarCarga(); // Loader
    const codigoCompleto = `${datos.digito1}${datos.digito2}${datos.digito3}${datos.digito4}${datos.digito5}${datos.digito6}`;
    const result = await verificarCodigoOTP(codigoCompleto);

    desactivarCarga(); // loader

    if (result.success && result.codigo === 1) {
      ClavePress(); 
      return;
    }

    //  1 Excedió los 3 intentos (Código -2 desde PHP)
    if (result.codigo === -2) {
      setModalMessage(result.mensaje);
      setModalSuccess(false);
      setBloqueadoPorIntentos(true); 
      setModalVisible(true);
      await AsyncStorage.removeItem('jwt_token');
      return;
    }

    //  2: Error común de código incorrecto (1 o 2 intentos)
    setModalMessage(result.mensaje);
    setModalSuccess(false);
    setModalVisible(true);
  };

  // Función encargada de manejar el cierre del modal de forma inteligente
  const manejarCierreModal = () => {
    setModalVisible(false);
    if (bloqueadoPorIntentos) {
      HomePress(); 
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.contenedorFormulario}
    >
      {/* Sección Superior: Botón Atrás */}
      <View style={styles.bloqueSuperior}>
        <TouchableOpacity style={styles.botonRegresar} onPress={HomePress}>
          <View style={styles.iconoFlecha}>
            <View style={[styles.lineaFlecha, styles.lineaSuperior]} />
            <View style={[styles.lineaFlecha, styles.lineaInferior]} />
            <View style={styles.lineaCuerpo} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Sección Central */}
      <View style={styles.bloqueCentral}>
        <Text style={styles.tituloPrincipal}>Ingresa tu Codigo de Verificación</Text>
        <Text style={styles.descripcionCorta}>
          Hemos enviado un código de verificación a tu correo electrónico. Te recomendamos revisar también la bandeja de spam o los correos no deseados en caso de que no lo encuentres.
        </Text>

        {/* Fila de los 6 Inputs */}
        <View style={styles.contenedorOtpGlobal}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <View key={index} style={styles.cuadroInputWrapper}>
              <Controller
                control={control}
                name={`digito${index + 1}`}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <TextInput
                    ref={inputsRef[index]}
                    style={[
                      styles.inputOtp,
                      errors[`digito${index + 1}`] && styles.inputOtpError,
                      value !== '' && styles.inputOtpLeno
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus={true}
                    textAlign="center"
                    value={value}
                    onChangeText={(texto) => manejarCambioTexto(texto, index)}
                    onKeyPress={(e) => manejarBorrado(e, index)}
                  />
                )}
              />

              <AlertModal
                visible={modalVisible}
                onClose={manejarCierreModal}
                message={modalMessage}
                success={modalSuccess}
              />
            </View>
          ))}
        </View>

        {/* Temporizador de Reenvío */}
        <View style={styles.contenedorReenvio}>
          {segundos > 0 ? (
            <Text style={styles.textoReenvio}>
              Reenviar código en <Text style={styles.tiempoDestacado}>{segundos} Segundos</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setSegundos(120)}>
              <Text style={styles.enlaceReenvio}>Reenviar Código</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botón de Verificar */}
        <TouchableOpacity 
          style={styles.botonEnviar} 
          onPress={handleSubmit(manejarVerificacion)}
        >
          <Text style={styles.textoBoton}>Verificar</Text>
        </TouchableOpacity>
      </View>

      {/* Bloque vacío inferior para mantener simetría en el flex-space-between */}
      <View style={styles.bloqueInferior} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorFormulario: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
    backgroundColor: '#FFF1F2', // Fondo rosa muy clarito característico
  },
  bloqueSuperior: {
    paddingTop: 20,
    alignItems: 'flex-start',
  },
  botonRegresar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
  },
  iconoFlecha: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineaFlecha: {
    position: 'absolute',
    width: 10,
    height: 2.5,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    left: 3,
  },
  lineaSuperior: { transform: [{ rotate: '-45deg' }], top: 6 },
  lineaInferior: { transform: [{ rotate: '45deg' }], bottom: 6 },
  lineaCuerpo: { position: 'absolute', width: 13, height: 2.5, backgroundColor: '#1A1A1A', borderRadius: 2, left: 4 },
  
  bloqueCentral: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -20,
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  descripcionCorta: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 35,
  },

  // Estilos de la cuadrícula OTP de 6 elementos
  contenedorOtpGlobal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  cuadroInputWrapper: {
    flex: 1,
    marginHorizontal: 4, // Espaciado perfecto para que entren los 6 en cualquier pantalla
  },
  inputOtp: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 70,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputOtpLeno: {
    borderColor: '#098a29', // Se pinta de rosa cuando tiene contenido
    borderWidth: 2,
  },
  inputOtpError: {
    borderColor: '#FF3B30', // Borde rojo si falta completar
  },

  contenedorReenvio: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop:18,
  },
  textoReenvio: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tiempoDestacado: {
    color: '#D81B60',
    fontWeight: 'bold',
  },
  enlaceReenvio: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D81B60',
    textDecorationLine: 'underline',
  },

  botonEnviar: {
    width: '100%',
    backgroundColor: '#D81B60',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bloqueInferior: {
    height: 40,
  },
});