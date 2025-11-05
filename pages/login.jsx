import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// --- Componente de la pantalla de Login ---
import AlertModal from '../componentes/ModalAlert'; // ajusta la ruta si es necesario

const Login = () => {
  const navigation = useNavigation();
  // Estado para controlar la visibilidad de la contraseña
   const [isClaveVisible, setClaveVisible] = useState(false);

const [modalVisible2, setModalVisible2] = useState(false);
const [cedulaRecuperar, setCedulaRecuperar] = useState('');

const RegistrarPress = () => {
          navigation.navigate("registrarcliente");
};
    
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

 const onSubmit = data => {
  const { cedula, clave } = data;

  if (cedula === '10200300' && clave === 'love1234') {
    setModalMessage('Verificación exitosa. ¡Bienvenido!');
    setModalSuccess(true);
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Admin');
    }, 2000);

  } else {
    setModalMessage('Cédula y/o contraseña incorrecta.');
    setModalSuccess(false);
    setModalVisible(true);
  }
};

const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [modalSuccess, setModalSuccess] = useState(false);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
      source={require('../assets/portada.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

            {/* Contenedor del logo y nombre de la marca */}
             <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Image
                    source={require('../assets/logo2.png')} // Asegúrate de que la imagen exista en esta ruta
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

        <View style={styles.formContainer}>
                <Text style={styles.title}>Bienvenido</Text>

                {/* Input Cédula */}
                <View
                  style={[
                    styles.inputWrapper,
                    errors.cedula
                      ? { borderColor: 'red' }
                      : control._formValues?.cedula
                      ? { borderColor: 'green' }
                      : {},
                  ]}
                >
                  <Ionicons name="person" size={20} color="#EE82EE" style={styles.inputIcon} />
                  <Controller
                    control={control}
                      name="cedula"
                      rules={{
                        required: 'La cédula es obligatoria',
                        pattern: {
                          value: /^\d{7,8}$/,
                          message: 'Debe tener entre 7 y 8 dígitos numéricos',
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="Cédula"
                          placeholderTextColor="#8A8A8A"
                          style={styles.textInput}
                          keyboardType="numeric"
                          onBlur={onBlur}
                          onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            onChange(numericText);
                          }}
                          value={value}
                      />
                    )}
                  />
                </View>
                {errors.cedula && (
                  <Text style={styles.errorText}>{errors.cedula.message}</Text>
                )}

                {/* Input Contraseña */}
                <View
                  style={[
                    styles.inputWrapper,
                    errors.clave
                      ? { borderColor: 'red' }
                      : control._formValues?.clave
                      ? { borderColor: 'green' }
                      : {},
                  ]}
                >
                  <Ionicons name="lock-closed" size={20} color="#EE82EE" style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="clave"
                    rules={{
                      required: 'La contraseña es obligatoria',
                      pattern: {
                        value: /^.{8,16}$/,
                        message: 'Debe tener entre 8 y 16 caracteres',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Contraseña"
                        placeholderTextColor="#8A8A8A"
                        style={styles.textInput}
                        secureTextEntry={!isClaveVisible}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity onPress={() => setClaveVisible(!isClaveVisible)}>
                    <Ionicons
                      name={isClaveVisible ? 'eye-off' : 'eye'}
                      size={20}
                      color="#EE82EE"
                    />
                  </TouchableOpacity>
                </View>
                {errors.clave && (
                  <Text style={styles.errorText}>{errors.clave.message}</Text>
                )}

                {/* Botón Ingresar */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.loginButtonText}>INGRESAR</Text>
                </TouchableOpacity>

                {/* Footer opcional */}
                <View style={styles.footerLinksContainer}>
                  <TouchableOpacity onPress={() => setModalVisible2(true)}>
                    <Text style={styles.footerLink}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity   onPress={RegistrarPress}>
                  <Text style={styles.registerLink}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </ScrollView>

          <Modal
            visible={modalVisible2}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible2(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Recuperar contraseña</Text>

                <TextInput
                  placeholder="Cédula"
                  placeholderTextColor="#8A8A8A"
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={cedulaRecuperar}
                  onChangeText={(text) => setCedulaRecuperar(text.replace(/[^0-9]/g, ''))}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                    onPress={() => setModalVisible2(false)}
                  >
                    <Text style={styles.modalButtonText}>Cerrar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#4e73df' }]}
                    onPress={() => {
                      console.log('Enviar cédula:', cedulaRecuperar);
                      setModalVisible2(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </KeyboardAvoidingView>
      </ImageBackground>

      <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

// --- Estilos de la pantalla ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
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
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginLeft: 20,
},
backText: {
  marginLeft: 8,
  fontSize: 16,
  color: '#FFFFFF',
  fontWeight: '500',
},
errorText: {
  color: 'red',
  fontSize: 12,
  marginBottom: 8,
  marginLeft: 10,
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
  loginButton: {
    backgroundColor: '#EE82EE',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#EE82EE",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: '#fff',
  width: '85%',
  borderRadius: 12,
  padding: 20,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
  textAlign: 'center',
},
modalInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  fontSize: 14,
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
modalButton: {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  marginHorizontal: 5,
  alignItems: 'center',
},
modalButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},

});

export default Login;

