import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BtnRegresar({ onPress }) {
  return (
    <View style={styles.bloqueSuperior}>
      <TouchableOpacity 
        style={styles.botonRegresar} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bloqueSuperior: {
    paddingTop: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 2,
    width: '100%',
  },
  botonRegresar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});