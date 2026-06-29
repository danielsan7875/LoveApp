import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeaderTitulo({ title, subtitle, color = '#E91E63' }) {
  return (
    <View style={styles.header}>
      <View style={[styles.borderContainer, { borderLeftColor: color }]}>
        <Text style={[styles.title, { color: color }]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    marginTop:1,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
    paddingLeft: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 14, 
  },
});