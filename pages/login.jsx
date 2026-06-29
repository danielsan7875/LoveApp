import React, { useState } from 'react';
import {
  StyleSheet, Text, View,ImageBackground,KeyboardAvoidingView,Platform,ScrollView,TextInput,
  TouchableOpacity,Modal,Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


import AlertModal from '../componentes/ModalAlert'; 
import BtnAcion from '../componentes/BtnAcion'; 
import Input from '../componentes/Inputvalidacion';
import { loginUser, getToken } from '../services/api';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/authSlice';

const Login = ({activarCarga , desactivarCarga}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const RegistrarPress = () => {
    navigation.navigate("registrarcliente");
  };

  const OlvidoPress = () => {
    navigation.navigate("Olvido");
  };
  
  // Control for
    const {
      control,
      handleSubmit,
      watch,
      formState: { errors, isSubmitted },
    } = useForm({
      mode: 'onTouched',
    });

    const limpiarCedula = (text) => text.replace(/[^0-9]/g, '');

  // FORMULARIO
  const onSubmit = async data => {
    const { cedula, clave } = data;

    activarCarga(); 

    try {
      const result = await loginUser(cedula, clave, 'V');

      desactivarCarga(); 

      if (result.success) {
        setModalMessage(`Verificación exitosa. ¡Bienvenido, ${result.user?.nombre || ''}!`);
        setModalSuccess(true);
        setModalVisible(true);

        // Obtener el token guardado y sincronizar el estado global inmediatamente
        try {
          const token = await getToken();
          if (token) dispatch(setToken(token));
          // Si la API nos devolvió datos de usuario, también los almacenamos
          if (result.user) dispatch(setUser(result.user));
        } catch (e) {
          console.warn('Error syncing token to redux after login', e);
        }

        setTimeout(() => {
          setModalVisible(false);
          navigation.replace('MainTabs');
        }, 2000);

      } else {
        setModalMessage(result.mensaje);
        setModalSuccess(false);
        setModalVisible(true);
      }

    } catch (error) {
      desactivarCarga(); 
      console.error("Error en el proceso de login:", error);
      
      setModalMessage("Ocurrió un error inesperado al conectar con el servidor.");
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  return (
      <SafeAreaView style={styles.container}>
         {/* imagen de fondo */}
        <ImageBackground
          source={require('../assets/portada.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
           {/* para el TECLADO */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 3, justifyContent: 'space-between' }}>

              {/* Contenedor del logo y nombre de la marca */}
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Image
                    source={require('../assets/logo2.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.title}>Bienvenido</Text>

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

                {/* Botón Ingresar */}
                <BtnAcion 
                  text="INGRESAR" 
                  icon="log-out" 
                  backgroundColor="#EE82EE" 
                  color="#ffffff"       
                  onPress={handleSubmit(onSubmit)} 
                />

                {/* Footer */}
                <View style={styles.footerLinksContainer}>
                  <TouchableOpacity onPress={OlvidoPress}>
                    <Text style={styles.footerLink}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={RegistrarPress}>
                    <Text style={styles.registerLink}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

          </KeyboardAvoidingView>
        </ImageBackground>
        
         {/* ALERTA  */}
        <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
      </SafeAreaView>
  );
};

// --- Estilos de la pantalla intactos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 2,
    justifyContent: 'space-between', 
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 20,
  },
  logoBackground: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 18,
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 30,
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  footerLink: {
    fontSize: 14,
    color: '#000000ff',
  },
  registerLink: {
    color: '#EE82EE',
    fontWeight: '600',
    fontSize: 16,
  },
  
});

export default Login;