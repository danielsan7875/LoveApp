import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

export default function CustomInput({ 
  control, 
  name, 
  rules = {}, 
  placeholder, 
  icon, 
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  onChangeTextModifier, // Por si necesitamos limpiar texto antes de guardar (ej: cédula o teléfono)
  isSubmitted
}) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const tieneError = !!error;
        const esValido = isSubmitted && !error;

        return (
          <View style={styles.fieldContainer}>
            <View style={[
              styles.inputWrapper,
              tieneError ? styles.inputError : esValido ? styles.inputValid : null
            ]}>
              
              {icon && (
                <Ionicons 
                  name={icon} 
                  size={20} 
                  color={tieneError ? 'red' : '#EE82EE'} 
                  style={styles.inputIcon} 
                />
              )}

              <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor="#A9A9A9"
                onBlur={onBlur}
                onChangeText={(text) => {
                  // Si hay una función modificadora (ej: remover letras), la aplica antes del onChange
                  const textProcesado = onChangeTextModifier ? onChangeTextModifier(text) : text;
                  onChange(textProcesado);
                }}
                value={value}
                secureTextEntry={isPasswordHidden}
                keyboardType={keyboardType}
                maxLength={maxLength}
              />

              {/* Si es un campo de contraseña, dibuja automáticamente el ojito */}
              {secureTextEntry && (
                <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                  <Ionicons 
                    name={isPasswordHidden ? "eye" : "eye-off"} 
                    size={22} 
                    color={tieneError ? 'red' : '#464646'} 
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Mensaje de error abajo */}
            {tieneError && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#EE82EE',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#050404',
    height: '100%',
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