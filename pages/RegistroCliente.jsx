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
import { Ionicons } from '@expo/vector-icons';

export default function Registro() {
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    clave: '',
    confirmarClave: '',
  });

  const ValidarChange = (field, value) => {
    setForm({ ...form, [field]: value });
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
            <TextInput
              placeholder="Cédula"
              keyboardType="numeric"
              style={styles.textInput}
              value={form.cedula}
              onChangeText={(text) => ValidarChange('cedula', text.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Campo Nombre */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Nombre"
              style={styles.textInput}
              value={form.nombre}
              onChangeText={(text) => ValidarChange('nombre', text)}
            />
          </View>

          {/* Campo Apellido */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Apellido"
              style={styles.textInput}
              value={form.apellido}
              onChangeText={(text) => ValidarChange('apellido', text)}
            />
          </View>

          {/* Campo Teléfono */}
          <View style={styles.inputWrapper}>
            <Ionicons name="call" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Teléfono"
              keyboardType="phone-pad"
              style={styles.textInput}
              value={form.telefono}
              onChangeText={(text) => ValidarChange('telefono', text.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Campo Correo */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Correo electrónico"
              keyboardType="email-address"
              style={styles.textInput}
              value={form.correo}
              onChangeText={(text) => ValidarChange('correo', text)}
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              style={styles.textInput}
              value={form.clave}
              onChangeText={(text) => ValidarChange('clave', text)}
            />
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-open" size={20} color="#EE82EE" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirmar contraseña"
              secureTextEntry
              style={styles.textInput}
              value={form.confirmarClave}
              onChangeText={(text) => ValidarChange('confirmarClave', text)}
            />
          </View>

          {/* Botón Registrar */}
          <TouchableOpacity style={styles.registerButton}>
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
});
