import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

export default function Registro() {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          <View style={styles.inputWrapper}>
            <Ionicons name="card" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="cedula"
              rules={{
                required: true,
                pattern: /^\d{7,8}$/
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Cédula"
                  keyboardType="numeric"
                 style={[
                    styles.textInput,
                    submitted && errors.cedula ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]{7,9}$/g, ''))}
                />
              )}
            />
          </View>

          {/* Campo Nombre */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="nombre"
              rules={{
                required: true,
                pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nombre"
                   style={[
                    styles.textInput,
                    submitted && errors.nombre ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Campo Apellido */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="apellido"
              rules={{
                required: true,
                pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Apellido"
                 style={[
                    styles.textInput,
                    submitted && errors.apellido ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Campo Teléfono */}
          <View style={styles.inputWrapper}>
            <Ionicons name="call" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="telefono"
              rules={{
                required: true,
                pattern: /^[0-9]{11}$/,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Teléfono"
                  keyboardType="phone-pad"
                  style={[
                    styles.textInput,
                    submitted && errors.telefono ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                />
              )}
            />
          </View>

          {/* Campo Correo */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="correo"
              rules={{
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                    style={[
                    styles.textInput,
                    submitted && errors.correo ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="clave"
              rules={{
                required: true,
                minLength: 8,
                maxLength: 16,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry
                      style={[
                    styles.textInput,
                    submitted && errors.clave ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-open" size={20} color="#EE82EE" style={styles.inputIcon} />
            <Controller
              control={control}
              name="confirmarClave"
              rules={{
                required: true,
                minLength: 8,
                maxLength: 16,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirmar contraseña"
                  secureTextEntry
                    style={[
                    styles.textInput,
                    submitted && errors.confirmarClave ? styles.inputError :
                    submitted ? styles.inputValid : null
                  ]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Botón Registrar */}
         <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              setSubmitted(true);
              handleSubmit(onSubmit)();
            }}
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
    flexGrow: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#050404ff',
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
    borderWidth: 1,
},
inputValid: {
    borderColor: 'green',
    borderWidth: 1,
},

});
