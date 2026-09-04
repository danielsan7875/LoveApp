import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TituloGrande({ 
  title, 
  description, 
  titleColor = '#D81B60', 
  descriptionColor = '#8E8E93' 
}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.tituloPrincipal, { color: titleColor }]}>
        {title}
      </Text>
      
      {description && (
        <Text style={[styles.descripcionCorta, { color: descriptionColor }]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  descripcionCorta: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
});