import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
 
import AlertModal from '../componentes/ModalAlert'; 
import Input from '../componentes/Inputvalidacion'; 
import BtnAcion from '../componentes/BtnAcion';
import SelectorFormulario from '../componentes/Selectformulario'; 
import { registerUser } from '../services/api';


export default function Registro({activarCarga, desactivarCarga}) {
 const navigation = useNavigation();
  
 // control del for
  const {
    control,
    handleSubmit,
    reset,
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
      reset(); 

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

           <Text style={styles.labelGlobal}>Documento de Identidad</Text>
              <View style={styles.filaDocumento}>
                
               {/* Selector Limpio */}
                <SelectorFormulario
                  name="tipoDoc"
                  control={control}
                  defaultValue="V"
                  opciones={[
                    { label: 'Venezolano (V)', value: 'V' },
                    { label: 'Extranjero (E)', value: 'E' }
                  ]}
                  ancho="25%"
                  marginRight="3%"
                  style={{ marginTop: -15 }}
                />

              {/* Campo Cédula Expandido */}
              <View style={styles.contenedorCedula}>
                <Input
                  name="cedula"
                  label="" 
                  placeholder="Ej: 12333444"
                  icon="card"
                  control={control}
                  keyboardType="numeric"
                  isSubmitted={isSubmitted}
                  onChangeTextModifier={limpiarCedula}
                  rules={{
                    required: 'La cédula es requerida',
                    pattern: {
                      value: /^\d{7,8}$/,
                      message: 'Debe tener entre 7 y 8 dígitos numéricos',
                    }
                  }}
                />
              </View>
            </View>

            {/* Campo Nombre */}
            <Input
              name="nombre"
              label="Nombre"  
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
              label="Apellido"  
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
              label="Telefono"  
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
              label="Correo Electrónico"  
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
              label="Contraseña"  
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
              label="Confirmar Contraseña"  
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

            {/* Botón de Envió */}
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
    flexGrow: 5, 
    justifyContent: 'center',
    paddingVertical: 30,      
    paddingHorizontal: 20,
    paddingBottom: 80,
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
  labelGlobal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    paddingHorizontal: 4,
  },
  filaDocumento: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
  },
  contenedorCedula: {
    flex: 1,
    justifyContent: 'center', 
  },
});