import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

import AlertModal from '../componentes/ModalAlert'; 
import { solicitarCodigoRecuperacion } from '../services/api';

export default function BodyOlvido({activarCarga, desactivarCarga}) {
  const [correo, setCorreo] = useState('');
  const navigation = useNavigation();

  const HomePress = () => {
    navigation.navigate("MainTabs");
  };
  const LoginPress = () => {
    navigation.navigate("Login");
  };
  const CodigoPress = () => {
    navigation.navigate("Olvidocodigo");
  };
    
 const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitted } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      correo: ''
    }
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);


const manejarEnvioCodigo = async (datos) => {
  activarCarga(); // Loader encendido

  try {
    console.log('Enviando código a:', datos.correo);
    const result = await solicitarCodigoRecuperacion(datos.correo);
    
    desactivarCarga(); // Loader apagado

    if (result.success && result.codigo === 1) {
      CodigoPress(); 
      return;
    }

    // Muestras el resultado negativo de tu API
    setModalMessage(result.mensaje || "Ocurrió un error inesperado");
    setModalSuccess(false);
    setModalVisible(true);

  } catch (error) {
    desactivarCarga(); // 3. También lo apagas si el servidor o la red fallan abruptamente
    
    setModalMessage("Error de conexión");
    setModalSuccess(false);
    setModalVisible(true);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.contenedorFormulario}
    >
      {/* Sección Superior: Botón de regresar */}
      <View style={styles.bloqueSuperior}>
        <TouchableOpacity style={styles.botonRegresar} onPress={HomePress}>
          {/* Flecha hacia atrás construida con CSS nativo */}
          <View style={styles.iconoFlecha}>
            <View style={[styles.lineaFlecha, styles.lineaSuperior]} />
            <View style={[styles.lineaFlecha, styles.lineaInferior]} />
            <View style={styles.lineaCuerpo} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Sección Central: Textos e Inputs */}
     <View style={styles.bloqueCentral}>
        <Text style={styles.tituloPrincipal}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.descripcionCorta}>
          Ingresa tu correo electrónico registrado abajo para enviarte un código de recuperación de cuenta.
        </Text>

        {/* --- ESTRUCTURA SOLICITADA --- */}
        <View style={styles.contenedorInputGeneral}>
          <View style={[
            styles.inputWrapper,
            isSubmitted && errors.correo ? styles.inputError :
            isSubmitted && !errors.correo ? styles.inputValid : null
          ]}>
            {/* El color del icono cambia dinámicamente si se envió y hay error (rojo) o acierto (verde), sino usa tu rosa */}
            <Ionicons 
              name="mail" 
              size={20} 
              color={
                isSubmitted && errors.correo ? '#FF3B30' : 
                isSubmitted && !errors.correo ? '#4CD964' : '#D81B60'
              } 
              style={styles.inputIcon} 
            />
            <Controller
              control={control}
              name="correo"
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'El formato de correo no es válido (ej: usuario@correo.com)',
                }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Correo electrónico"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          {/* Mensaje de error abajo en rojo */}
          {errors.correo && <Text style={styles.errorText}>{errors.correo.message}</Text>}
        </View>

        {/* Botón Principal */}
        <TouchableOpacity 
          style={styles.botonEnviar} 
          onPress={handleSubmit(manejarEnvioCodigo)}
        >
          <Text style={styles.textoBoton}>Enviar Código</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Inferior: Enlace de regreso al Login */}
      <View style={styles.bloqueInferior}>
        <Text style={styles.textoNormal}>Volver a </Text>
        <TouchableOpacity onPress={LoginPress}>
          <Text style={styles.textoEnlace}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorFormulario: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
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
    marginTop: -40,
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
    marginBottom: 32,
  },

  // ========================================================= 
  // ESTILOS DE LA ESTRUCTURA DEL INPUT ENVOLVENTE
  // ========================================================= 
  contenedorInputGeneral: {
    width: '100%',
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0', // Gris suave neutro de base
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#333333',
  },
  // Estados de validación aplicados en los bordes
  inputError: {
    borderColor: '#FF3B30', // Borde Rojo
    backgroundColor: '#FFF5F5',
  },
  inputValid: {
    borderColor: '#4CD964', // Borde Verde
    backgroundColor: '#F5FBF6',
  },
  errorText: {
    color: '#FF3B30', // Texto de error en Rojo
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    paddingHorizontal: 4,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  textoNormal: {
    fontSize: 14,
    color: '#8E8E93',
  },
  textoEnlace: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D81B60',
    textDecorationLine: 'underline',
  },
});