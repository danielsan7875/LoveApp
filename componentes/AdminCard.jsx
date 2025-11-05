import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AdminCard = ({ icon, title, value, color = '#4e73df' }) => {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <MaterialIcons name={icon} size={32} color="#fff" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 card: {
  width: '48%',
  marginVertical: 8,
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 4,
},
  title: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
      alignItems: 'center',
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
      alignItems: 'center',
  },
});

export default AdminCard;
