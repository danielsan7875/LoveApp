import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Dimensions, Linking, Image } from 'react-native';

import BtnAcion from '../componentes/BtnAcion'; 

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

const ContactCards = () => {
  return (

    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
        source={require('../assets/contacto.webp')}
        style={styles.image}
        resizeMode="contain"
        />
       </View>
        <Text style={styles.justifiedText}>
        Si necesitas asesoría, soporte técnico o tienes alguna duda, estos son nuestros canales oficiales de contacto. Estamos aquí para ayudarte.
        </Text>

      <BtnAcion
          text="Ir a Instagram"
          icon="logo-instagram"
          backgroundColor="#E1306C"
          onPress={() => Linking.openURL("https://www.instagram.com/lovemakeupyk/")}
          styleCustom={{ marginBottom: 0, marginTop: 4 }}
      /> 
      <BtnAcion
          text="Ir a WhatsApp"
          icon="logo-whatsapp"
          backgroundColor="#25D366"
          onPress={() => Linking.openURL("https://wa.me/584245115414")}
          styleCustom={{ marginBottom: 0, marginTop: 4 }}
      /> 
      <BtnAcion
          text="ir a Facebook"
          icon="logo-facebook"
          backgroundColor="#1877F2"
          onPress={() => Linking.openURL("https://www.facebook.com/lovemakeupyk/")}
          styleCustom={{ marginBottom: 0, marginTop: 4 }}
      /> 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  imageWrapper: {
    width: BANNER_WIDTH,
    height: 160, 
    paddingHorizontal: 6, 
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
 justifiedText: {
  textAlign: 'justify',
  fontSize: 21,
  color: '#000000ff',
  marginBottom: 10,
},
 image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },

});

export default ContactCards;
