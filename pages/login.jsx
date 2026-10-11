import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, Platform, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, setUser } from '../redux/authSlice';
import { obtenerWishlistRemotaThunk } from '../redux/wishlistSlice';
import { registrarIntentoFallidoLogin, resetearIntentosLogin } from '../redux/seguridadSlice';

import AlertModal from '../componentes/ModalAlert'; 
import BtnAcion from '../componentes/BtnAcion'; 
import Input from '../componentes/Inputvalidacion';
import SelectorFormulario from '../componentes/Selectformulario'; 
import { loginUser, getToken } from '../services/api';

const Login = ({ activarCarga, desactivarCarga }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const intentosFallidos = useSelector((state) => state.seguridad.intentosFallidosLogin);
  const tiempoDesbloqueo = useSelector((state) => state.seguridad.tiempoDesbloqueo);

  const RegistrarPress = () => {
    navigation.navigate("registrarcliente");
  };

  const OlvidoPress = () => {
    navigation.navigate("Olvido");
  };
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: 'onTouched',
  });

  const limpiarCedula = (text) => text.replace(/[^0-9]/g, '');

  const onSubmit = async data => {
    const { cedula, clave, tipoDoc } = data;

    if (tiempoDesbloqueo && Date.now() < tiempoDesbloqueo) {
      const milisegundosRestantes = tiempoDesbloqueo - Date.now();
      const segundosRestantes = Math.ceil(milisegundosRestantes / 1000);
      
      setModalMessage(`Por seguridad, tu acceso está limitado por los próximos ${segundosRestantes} segundos.`);
      setModalSuccess(false);
      setModalVisible(true);
      return;
    }

    activarCarga();

    try {
      const result = await loginUser(cedula, clave, tipoDoc);
      desactivarCarga();

      if (result.success) {
        dispatch(resetearIntentosLogin());

        setModalMessage(`Verificación exitosa. ¡Bienvenido, ${result.user?.nombre || ''}!`);
        setModalSuccess(true);
        setModalVisible(true);

        try {
          const token = await getToken();
          if (token) dispatch(setToken(token));
          if (result.user) {
            dispatch(setUser(result.user));
            if (
              token &&
              result.user.cedula &&
              !result.user.codigo &&
              result.user.autorizado !== true
            ) {
              dispatch(obtenerWishlistRemotaThunk(result.user.cedula));
            }
          }
        } catch (e) {
          console.warn('Error syncing token to redux after login', e);
        }

        reset();
        setTimeout(() => {
          setModalVisible(false);
          navigation.replace('MainTabs');
        }, 2000);

      } else {
        dispatch(registrarIntentoFallidoLogin());

        if (5 - (intentosFallidos + 1) <= 0) {
          setModalMessage(`${result.mensaje}\n\nHas alcanzado el máximo de intentos permitidos. El acceso se ha bloqueado por 2 minutos.`);
        } else {
          setModalMessage(result.mensaje);
        }

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
    
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={require('../assets/portada.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
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

            {/* Contenedor blanco con padding inferior dinámico basado en la barra de navegación/gestos del dispositivo */}
            <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom, 24) + 15 }]}>
              <Text style={styles.title} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                Bienvenido/a
              </Text>

              {/* Campo Cedula */}
              <Text style={styles.labelGlobal} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                Documento de Identidad
              </Text>
              <View style={styles.filaDocumento}>
                <SelectorFormulario
                  name="tipoDoc"
                  control={control}
                  defaultValue="V"
                  opciones={[
                   { label: 'Venezolano (V)', value: 'V' },
                   { label: 'Extranjero (E)', value: 'E' },
                   { label: 'Juridico (J)', value: 'J' }
                  ]}
                  ancho="25%"
                  marginRight="3%"
                  style={{ marginTop: -15 }}
                />

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

              {/* Botón Ingresar */}
              <BtnAcion 
                text="INGRESAR" 
                icon="log-out" 
                backgroundColor="#EE82EE" 
                color="#ffffff"       
                onPress={handleSubmit(onSubmit)} 
              />

              {/* ALERTA */}
              <AlertModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
                success={modalSuccess}
              />

              {/* Footer */}
              <View style={styles.footerLinksContainer}>
                <TouchableOpacity onPress={OlvidoPress} style={styles.footerTouchable}>
                  <Text style={styles.footerLink} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={RegistrarPress} style={styles.footerTouchable}>
                  <Text style={styles.registerLink} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                    Registrarse +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco para que combine con el formulario al llegar al borde inferior
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
    minHeight: 160, 
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoBackground: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 24,
    paddingTop: 35,
    // El padding inferior ahora es dinámico gracias a insets.bottom, garantizando cubrir hasta el final sin estorbar los gestos/botones
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  footerTouchable: {
    flexShrink: 1,
  },
  footerLink: {
    fontSize: 13,
    color: '#000000',
  },
  registerLink: {
    color: '#EE82EE',
    fontWeight: '600',
    fontSize: 14,
  },
  labelGlobal: {
    fontSize: 13,
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
    marginBottom: 5,
  },
  contenedorCedula: {
    flex: 1,
    justifyContent: 'center', 
  },
});

export default Login;