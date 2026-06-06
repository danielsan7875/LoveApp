import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  ScrollView, ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AlertModal from '../componentes/ModalAlert'; 
import { registerUser } from '../services/api';


export default function Registro() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: 'onTouched', // Valida cuando el usuario interactúa con el campo
  });

  // Observamos el valor de la clave para compararla con la confirmación
  const clave = watch('clave');

// 1. Estados para el Modal de Alerta (Igual que en tu Login)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  // 2. Estado para el botón (saber si está cargando)
  const [loading, setLoading] = useState(false);

  // 3. Estados para los ojitos de la contraseña
  const [ocultarClave, setOcultarClave] = useState(true);
  const [ocultarConfirmarClave, setOcultarConfirmarClave] = useState(true);


const onSubmit = async (data) => {
    setLoading(true); // Desactivamos el botón y ponemos el circulito de carga

    // Llamamos a la función de la Parte 1
    const result = await registerUser(data);

    setLoading(false); // Reactivamos el botón

    if (result.success) {
      // Configuramos el modal para éxito
      setModalMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      setModalSuccess(true);
      setModalVisible(true);

      // Esperamos 2 segundos y lo mandamos al Login
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login'); 
      }, 2000);
    } else {
      // Configuramos el modal para error
      setModalMessage(result.mensaje);
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/02.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
    
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Registro</Text>

          {/* Campo Cédula */}
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              isSubmitted && errors.cedula ? styles.inputError :
              isSubmitted && !errors.cedula ? styles.inputValid : null
            ]}>
              <Ionicons name="card" size={20} color="#EE82EE" style={styles.inputIcon} />
              <Controller
                control={control}
                name="cedula"
                rules={{
                  required: 'La cédula es requerida',
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: 'La cédula debe tener entre 7 y 8 dígitos numéricos',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Cédula (Ej: 12333444)"
                    keyboardType="numeric"
                    style={styles.textInput}
                    value={value}
                    // Filtrar solo números al escribir de manera limpia
                    onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  />
                )}
              />
            </View>
            {errors.cedula && <Text style={styles.errorText}>{errors.cedula.message}</Text>}
          </View>

          {/* Campo Nombre */}
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              isSubmitted && errors.nombre ? styles.inputError :
              isSubmitted && !errors.nombre ? styles.inputValid : null
            ]}>
              <Ionicons name="person" size={20} color="#EE82EE" style={styles.inputIcon} />
              <Controller
                control={control}
                name="nombre"
                rules={{
                required: 'El nombre es requerido',
                
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener mínimo 3 caracteres',
                },
                maxLength: {
                  value: 30,
                  message: 'El nombre no puede superar los 30 caracteres',
                },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Solo se permiten letras y espacios',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nombre (Ej: Jose)"
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}
          </View>

          {/* Campo Apellido */}
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              isSubmitted && errors.apellido ? styles.inputError :
              isSubmitted && !errors.apellido ? styles.inputValid : null
            ]}>
              <Ionicons name="person-outline" size={20} color="#EE82EE" style={styles.inputIcon} />
              <Controller
                control={control}
                name="apellido"
                rules={{
                  required: 'El apellido es requerido',
                  minLength: {
                  value: 3,
                  message: 'El apellido debe tener mínimo 3 caracteres',
                },
                maxLength: {
                  value: 30,
                  message: 'El apellido no puede superar los 30 caracteres',
                },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Solo se permiten letras entre',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Apellido (Ej: z)"
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.apellido && <Text style={styles.errorText}>{errors.apellido.message}</Text>}
          </View>

         {/* Campo Teléfono */}
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              isSubmitted && errors.telefono ? styles.inputError :
              isSubmitted && !errors.telefono ? styles.inputValid : null
            ]}>
              <Ionicons name="call" size={20} color="#EE82EE" style={styles.inputIcon} />
              <Controller
                control={control}
                name="telefono"
                rules={{
                  required: 'El teléfono es requerido',
                  pattern: {
                    // Valida que empiece por 0414, 0426 o 0412, luego un guion, y luego exactamente 7 números
                    value: /^(0414|0424|0416|0426|0412|0422)-\d{7}$/,
                    message: 'El formato debe ser válido (Ej: 0412-1234567)',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Teléfono (Ej: 0412-1234567)"
                    keyboardType="phone-pad"
                    style={styles.textInput}
                    maxLength={12} // Evita que el usuario escriba más de la cuenta (4 dígitos + 1 guion + 7 dígitos)
                    value={value}
                    onChangeText={(text) => {
                      // Removemos todo lo que no sea un número o el guion que ya pusimos
                      let cleaned = text.replace(/[^0-9-]/g, '');
                      
                      // Si el usuario borra el guion manualmente, eliminamos los guiones para reformatear
                      cleaned = cleaned.replace(/-/g, '');

                      // Si ya escribió más de 4 dígitos, le encajamos el guion automáticamente
                      if (cleaned.length > 4) {
                        cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
                      }
                      // Guardamos el estado formateado
                      onChange(cleaned);
                    }}
                  />
                )}
              />
            </View>
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}
          </View>

          {/* Campo Correo */}
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              isSubmitted && errors.correo ? styles.inputError :
              isSubmitted && !errors.correo ? styles.inputValid : null
            ]}>
              <Ionicons name="mail" size={20} color="#EE82EE" style={styles.inputIcon} />
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.correo && <Text style={styles.errorText}>{errors.correo.message}</Text>}
          </View>
        {/* Campo Contraseña */}
        <View style={styles.fieldContainer}>
          <View style={[
            styles.inputWrapper,
            isSubmitted && errors.clave ? styles.inputError :
            isSubmitted && !errors.clave ? styles.inputValid : null
          ]}>
            <Ionicons name="lock-closed" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="clave"
              rules={{
                required: 'La contraseña es requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 16, message: 'Máximo 16 caracteres' },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry={ocultarClave} // Controla si se ve o se oculta
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {/* Botón del Ojito */}
            <TouchableOpacity onPress={() => setOcultarClave(!ocultarClave)}>
              <Ionicons 
                name={ocultarClave ? "eye-off" : "eye"} 
                size={22} 
                color="#A9A9A9" 
              />
            </TouchableOpacity>
          </View>
          {errors.clave && <Text style={styles.errorText}>{errors.clave.message}</Text>}
        </View>

        {/* Campo Confirmar Contraseña */}
        <View style={styles.fieldContainer}>
          <View style={[
            styles.inputWrapper,
            isSubmitted && errors.confirmarClave ? styles.inputError :
            isSubmitted && !errors.confirmarClave ? styles.inputValid : null
          ]}>
            <Ionicons name="lock-open" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="confirmarClave"
              rules={{
                required: 'Debe confirmar su contraseña',
                validate: (value) => value === clave || 'Las contraseñas no coinciden',
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirmar contraseña"
                  secureTextEntry={ocultarConfirmarClave} // Controla si se ve o se oculta
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {/* Botón del Ojito */}
            <TouchableOpacity onPress={() => setOcultarConfirmarClave(!ocultarConfirmarClave)}>
              <Ionicons 
                name={ocultarConfirmarClave ? "eye-off" : "eye"} 
                size={22} 
                color="#A9A9A9" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmarClave && <Text style={styles.errorText}>{errors.confirmarClave.message}</Text>}
        </View>

          {/* Botón Registrar */}
         <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>REGISTRARSE</Text>
            )}
          </TouchableOpacity>
               <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, 
    justifyContent: 'center', // Mantiene la tarjeta centrada si hay espacio
    paddingVertical: 30,      // Un poco más de espacio arriba y abajo
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 15, // Engloba el input y su mensaje de error
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#050404',
  },
  registerButton: {
    backgroundColor: '#EE82EE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  inputValid: {
    borderColor: 'green',
    borderWidth: 1.5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});