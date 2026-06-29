import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';

import BtnAcion from '../componentes/BtnAcion'; 

const ContactCards = () => {
  return (

    <View style={styles.container}>

        <Image
        source={require('../assets/cont.png')}
        style={styles.image}
        resizeMode="contain"
      />
        <Text style={styles.justifiedText}>
        Si necesitas asesoría, soporte técnico o tienes alguna duda, estos son nuestros canales oficiales de contacto. Estamos aquí para ayudarte.
        </Text>

      <BtnAcion
          text="Ir a Instagram"
          icon="logo-instagram"
          backgroundColor="#E1306C"
          onPress={() => Linking.openURL("https://www.instagram.com/lovemakeupyk/")}
      /> 
      <BtnAcion
          text="Ir a WhatsApp"
          icon="logo-whatsapp"
          backgroundColor="#25D366"
          onPress={() => Linking.openURL("https://wa.me/584245115414")}
      /> 
      <BtnAcion
          text="ir a Facebook"
          icon="logo-facebook"
          backgroundColor="#1877F2"
          onPress={() => Linking.openURL("https://www.facebook.com/lovemakeupyk/")}
      /> 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
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
  marginBottom: 20,
},
 image: {
    width: 500,
    height: 100,
    marginBottom: 10,
     alignSelf: 'center',
  },

});

export default ContactCards;
