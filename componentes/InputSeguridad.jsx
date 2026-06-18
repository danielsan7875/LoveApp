import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const InputSeguridad = ({ label, iconName, value, onChangeText, isSecure = false }) => {
  const [secureText, setSecureText] = useState(isSecure);

  return (
     <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name={iconName} size={24} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureText}
            placeholder="Ingresa tu clave aquí"
            placeholderTextColor="#ccc"
          />
          {isSecure && (
            <TouchableOpacity onPress={() => setSecureText((prev) => !prev)}>
              <Ionicons
                name={secureText ? 'eye-off' : 'eye'}
                size={22}
                color="#E91E63"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
  );
};


const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },

});

export default InputSeguridad;

