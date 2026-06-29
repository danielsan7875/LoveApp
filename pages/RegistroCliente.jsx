import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import AlertModal from '../componentes/ModalAlert'; 
import Input from '../componentes/Inputvalidacion'; 
import BtnAcion from '../componentes/BtnAcion'; 
import { registerUser } from '../services/api';


export default function Registro({activarCarga, desactivarCarga}) {
 const navigation = useNavigation();
  
 // control del for
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: 'onTouched',
  });

  // Observamos la contraseña para poder validarla en la confirmación ---------------
  const clave = watch('clave');

  // MODAL ALERT
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  
  // ENVIO DE FORMULARIO --------------------
  const onSubmit = async (data) => {
    activarCarga();
    const result = await registerUser(data);
    desactivarCarga(); 

    if (result.success) {
      setModalMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      setModalSuccess(true);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login'); 
      }, 2000);
    } else {
      setModalMessage(result.mensaje || "Error en el registro");
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  // Funciones limpiar datos en tiempo de escritura --------
  const limpiarCedula = (text) => text.replace(/[^0-9]/g, '');
  
  const formatearTelefono = (text) => {
    let clear = text.replace(/[^0-9-]/g, '').replace(/-/g, '');
    if (clear.length > 4) {
      clear = `${clear.slice(0, 4)}-${clear.slice(4, 11)}`;
    }
    return clear;
  };

  return (
    <ImageBackground
      source={require('../assets/02.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 6 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.card}>
            <Text style={styles.title}>Registro</Text>

            {/* Campo Cédula */}
            <Input
              name="cedula"
              placeholder="Cédula (Ej: 12333444)"
              icon="card"
              control={control}
              keyboardType="numeric"
              isSubmitted={isSubmitted}
              onChangeTextModifier={limpiarCedula}
              rules={{
                required: 'La cédula es requerida',
                pattern: {
                  value: /^\d{7,8}$/,
                  message: 'La cédula debe tener entre 7 y 8 dígitos numéricos',
                }
              }}
            />

            {/* Campo Nombre */}
            <Input
              name="nombre"
              placeholder="Nombre (Ej: Jose)"
              icon="person"
              control={control}
              isSubmitted={isSubmitted}
              rules={{
                required: 'El nombre es requerido',
                minLength: { value: 3, message: 'El nombre debe tener mínimo 3 caracteres' },
                maxLength: { value: 30, message: 'El nombre no puede superar los 30 caracteres' },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: 'Solo se permiten letras',
                }
              }}
            />

            {/* Campo Apellido */}
            <Input
              name="apellido"
              placeholder="Apellido (Ej: Perez)"
              icon="person-outline"
              control={control}
              isSubmitted={isSubmitted}
              rules={{
                required: 'El apellido es requerido',
                minLength: { value: 3, message: 'El apellido debe tener mínimo 3 caracteres' },
                maxLength: { value: 30, message: 'El apellido no puede superar los 30 caracteres' },
                pattern: {
                  value:  /^[A-Za-z]+$/,
                  message: 'Solo se permiten letras',
                }
              }}
            />

            {/* Campo Teléfono */}
            <Input
              name="telefono"
              placeholder="Teléfono (Ej: 0412-1234567)"
              icon="call"
              control={control}
              keyboardType="phone-pad"
              maxLength={12}
              isSubmitted={isSubmitted}
              onChangeTextModifier={formatearTelefono}
              rules={{
                required: 'El teléfono es requerido',
                pattern: {
                  value: /^(0414|0424|0416|0426|0412|0422)-\d{7}$/,
                  message: 'El formato debe ser válido (Ej: 0412-1234567)',
                }
              }}
            />

            {/* Campo Correo */}
            <Input
              name="correo"
              placeholder="Correo electrónico"
              icon="mail"
              control={control}
              keyboardType="email-address"
              isSubmitted={isSubmitted}
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'El formato de correo no es válido',
                }
              }}
            />

            {/* Campo Contraseña */}
            <Input
              name="clave"
              placeholder="Contraseña"
              icon="lock-closed"
              control={control}
              secureTextEntry={true}
              isSubmitted={isSubmitted}
              rules={{
                required: 'La contraseña es requerida',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 16, message: 'Máximo 16 caracteres' },
              }}
            />

            {/* Campo Confirmar Contraseña */}
            <Input
              name="confirmarClave"
              placeholder="Confirmar contraseña"
              icon="lock-open"
              control={control}
              secureTextEntry={true}
              isSubmitted={isSubmitted}
              rules={{
                required: 'Debe confirmar su contraseña',
                validate: (value) => value === clave || 'Las contraseñas no coinciden',
              }}
            />

            {/* Botón de Envió utilizando tu nuevo diseño de componente */}
            <BtnAcion
              text="REGISTRARSE"
              icon="person-add-outline"
              backgroundColor="#EE82EE"
              onPress={handleSubmit(onSubmit)}
            /> 
          
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
    justifyContent: 'center',
    paddingVertical: 30,      
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
});