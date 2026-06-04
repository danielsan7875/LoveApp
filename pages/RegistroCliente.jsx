import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

export default function Registro() {
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

  const onSubmit = (data) => {
    console.log('Datos válidos:', data);
  };

  return (
    <ImageBackground
      source={require('../assets/02.jpg')}
      style={styles.background}
      resizeMode="cover"
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
                    placeholder="Cédula"
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
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: 'Solo se permiten letras y espacios',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nombre"
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
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: 'Solo se permiten letras y espacios',
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Apellido"
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
                    secureTextEntry
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
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
                    secureTextEntry
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            {errors.confirmarClave && <Text style={styles.errorText}>{errors.confirmarClave.message}</Text>}
          </View>

          {/* Botón Registrar */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.registerButtonText}>REGISTRARSE</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Corregido de 20 a 1 para comportamiento correcto de scroll
    justifyContent: 'center',
    padding: 20,
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