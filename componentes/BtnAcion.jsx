import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Cambiado a Ionicons

const BtnAcion = ({ 
  text, 
  icon, 
  onPress, 
  backgroundColor = '#D81B60', 
  color = '#ffffff',          
  styleCustom 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: backgroundColor }, styleCustom]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Si pasas un icono por prop, lo renderiza al lado del texto */}
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={color} 
          style={styles.icon} 
        />
      )}
      
      <Text style={[styles.buttonText, { color: color }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',       // Para que el icono y el texto estén alineados de lado
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 8,             // Separa el icono del texto
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default BtnAcion;