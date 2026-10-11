import React from 'react';
import { View, Text, StyleSheet, Linking, Image, Dimensions } from 'react-native';
import BtnAcion from '../componentes/BtnAcion'; 

const { width } = Dimensions.get('window');

const LocationCard = () => {
  const openGoogleMaps = () => {
    const latitude = 10.066843467538288;
    const longitude = -69.32081153623936;
    const label = 'Nuestra ubicación';
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${label}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
         Nos ubicamos en:
        </Text>
        <Text style={styles.address} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
          Tienda física ubicada en la av 20 con calles 29 y 30 CC Barquisimeto plaza, Estado Lara, Venezuela. Ven y visítanos
        </Text>
       
        <BtnAcion
          text="Ver en Google Map"
          icon="location-sharp"
          backgroundColor="#4285F4"
          onPress={openGoogleMaps}
        /> 
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
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 450, 
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
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'justify',
    lineHeight: 22,
  },
  image: {
    marginTop: 20,
    width: '100%',
    maxWidth: 280, 
    height: width > 400 ? 280 : 220, 
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default LocationCard;