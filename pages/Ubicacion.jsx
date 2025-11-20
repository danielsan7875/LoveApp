import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';

const LocationCard = () => {
  const openGoogleMaps = () => {
    const latitude = 10.066843467538288; // Coordenadas de ejemplo (puedes cambiarlas)
    const longitude = -69.32081153623936;
    const label = 'Nuestra ubicación';
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${label}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📍 Nos ubicamos en:</Text>
        <Text style={styles.address}>
         Tienda física ubicada en la av 20 con calles 29 y 30 CC Barquisimeto plaza, Estado Lara, Venezuela. Ven y visítanos
        </Text>
        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <Text style={styles.buttonText}>Ver en Google Maps</Text>
        </TouchableOpacity>
      </View>
      
        <Image
             source={require('../assets/ubi.png')}
              style={styles.image}
                resizeMode="contain"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
   image: {
    marginTop:20,
    width: 300,
    height: 300,
    marginBottom: 10,
     alignSelf: 'center',
  },
});

export default LocationCard;

