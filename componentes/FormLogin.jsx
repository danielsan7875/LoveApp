import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

  
const FormLogin = () => {
      // Estado para controlar la visibilidad de la contraseña
      const [isClaveVisible, setClaveVisible] = useState(false);
  return (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Iniciar Sesión</Text>

              {/* Input para la Cédula */}
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color="#EE82EE" style={styles.inputIcon} />
                <TextInput
                  placeholder="Cedula:"
                  placeholderTextColor="#8A8A8A"
                  style={styles.textInput}
                  keyboardType="numeric"
                />
              </View>

              {/* Input para la Contraseña */}
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color="#EE82EE" style={styles.inputIcon} />
                <TextInput
                  placeholder="Constraseña"
                  placeholderTextColor="#8A8A8A"
                  style={styles.textInput}
                  secureTextEntry={!isClaveVisible}
                />
                <TouchableOpacity onPress={() => setClaveVisible(!isClaveVisible)}>
                  <Ionicons
                    name={isClaveVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="#EE82EE"
                  />
                </TouchableOpacity>
              </View>

              {/* Botón de Ingresar */}
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>INGRESAR</Text>
              </TouchableOpacity>

              {/* Enlaces inferiores */}
              <View style={styles.footerLinksContainer}>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>¿Olvidaste tu constraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.footerLink, styles.registerLink]}>Registrarse +</Text>
                </TouchableOpacity>
              </View>
            </View>
  );
};
      

const styles = StyleSheet.create({
 formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
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
});


export default FormLogin;