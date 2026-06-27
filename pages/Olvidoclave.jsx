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
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AlertModal from '../componentes/ModalAlert'; 
import { actualizarClave } from '../services/api';

export default function BodyOlvido({ activarCarga, desactivarCarga }) {
  const navigation = useNavigation();
 const HomePress = () => {
    navigation.navigate("MainTabs");
  };

  const LoginPress = () => {
    navigation.navigate("Login"); // Te lleva directo a iniciar sesión con tu nueva clave
  };

  // Estados para mostrar/ocultar contraseñas
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Estados del Modal Alert
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitted } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmarPassword: ''
    }
  });

  const passwordActual = watch('password');
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,16}$/;

  // CONTROLADOR DE ACTUALIZACIÓN CON MODAL Y LOADER
  const manejarRestablecimiento = async (datos) => {
    activarCarga(); // loader encendido

    const result = await actualizarClave(datos.password);
  
    desactivarCarga();
    if (result.success && result.codigo === 1) {
      setModalMessage(result.mensaje || "Contraseña restablecida correctamente.");
      setModalSuccess(true);
      setModalVisible(true);
    } else {
      setModalMessage(result.mensaje || "Hubo un problema al procesar la solicitud.");
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  const manejarCierreModal = () => {
    setModalVisible(false);
    if (modalSuccess) {
      LoginPress(); // Si el modal fue un éxito, lo mandamos a loguearse
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
        <Text style={styles.tituloPrincipal}>Restablecer contraseña</Text>
        <Text style={styles.descripcionCorta}>
          Ingresa tu nueva contraseña. Asegúrate de cumplir con todos los parámetros de seguridad requeridos.
        </Text>

        {/* --- CAMPO 1: NUEVA CONTRASEÑA --- */}
        <View style={styles.contenedorInputGeneral}>
          <View style={[
            styles.inputWrapper,
            isSubmitted && errors.password ? styles.inputError :
            isSubmitted && !errors.password ? styles.inputValid : null
          ]}>
            <Ionicons 
              name="lock-closed" 
              size={20} 
              color={
                isSubmitted && errors.password ? '#FF3B30' : 
                isSubmitted && !errors.password ? '#4CD964' : '#D81B60'
              } 
              style={styles.inputIcon} 
            />
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es requerida',
                pattern: {
                  value: regexPassword,
                  message: 'Debe tener entre 8 y 16 caracteres, incluir mayúscula, minúscula, número y un carácter especial (ej: @, $, !, %, *, ?)'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nueva Contraseña"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!mostrarPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {/* Ícono interactivo del ojo */}
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
              <Ionicons 
                name={mostrarPassword ? "eye-off" : "eye"} 
                size={22} 
                color="#A0A0A0" 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>

        {/* --- CAMPO 2: CONFIRMAR CONTRASEÑA --- */}
        <View style={styles.contenedorInputGeneral}>
          <View style={[
            styles.inputWrapper,
            isSubmitted && errors.confirmarPassword ? styles.inputError :
            isSubmitted && !errors.confirmarPassword ? styles.inputValid : null
          ]}>
            <Ionicons 
              name="lock-closed" 
              size={20} 
              color={
                isSubmitted && errors.confirmarPassword ? '#FF3B30' : 
                isSubmitted && !errors.confirmarPassword ? '#4CD964' : '#D81B60'
              } 
              style={styles.inputIcon} 
            />
            <Controller
              control={control}
              name="confirmarPassword"
              rules={{
                required: 'Es necesario confirmar la contraseña',
                validate: valor => valor === passwordActual || 'Las contraseñas no coinciden'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirmar Contraseña"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!mostrarConfirmar}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {/* Ícono interactivo del ojo */}
            <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
              <Ionicons 
                name={mostrarConfirmar ? "eye-off" : "eye"} 
                size={22} 
                color="#A0A0A0" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmarPassword && <Text style={styles.errorText}>{errors.confirmarPassword.message}</Text>}
        </View>

        {/* Botón Restablecer Contraseña */}
        <TouchableOpacity 
          style={styles.botonEnviar} 
          onPress={handleSubmit(manejarRestablecimiento)}
        >
          <Text style={styles.textoBoton}>Actualizar contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Margen inferior estructural */}
      <View style={styles.bloqueInferior} />
      <AlertModal
        visible={modalVisible}
        onClose={manejarCierreModal}
        message={modalMessage}
        success={modalSuccess}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorFormulario: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
    backgroundColor: '#FFF1F2', // Mantiene la identidad de marca de tu app
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
    marginBottom: 32,
  },
  contenedorInputGeneral: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
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
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputValid: {
    borderColor: '#4CD964',
    backgroundColor: '#F5FBF6',
  },
  errorText: {
    color: '#FF3B30',
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
    marginTop: 15,
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