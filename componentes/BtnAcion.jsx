import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BtnAccion = ({ icon, color = '#333', onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name={icon} size={20} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 4,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    elevation: 2,
  },
});

export default BtnAccion;
