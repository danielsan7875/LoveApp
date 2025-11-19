import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';

const ContactCard = ({ platform, url, backgroundColor }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={() => Linking.openURL(url)}>
    <Text style={styles.text}>{platform}</Text>
  </TouchableOpacity>
);

const ContactCards = () => {
  return (

    <View style={styles.container}>

        <Image
        source={require('../assets/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
        <Text style={styles.justifiedText}>
        Si necesitas asesoría, soporte técnico o tienes alguna duda, estos son nuestros canales oficiales de contacto. Estamos aquí para ayudarte.
        </Text>


      <ContactCard
        platform="Ir a Instagram"
        url="https://www.instagram.com/tu_usuario"
        backgroundColor="#E1306C"
      />
      <ContactCard
        platform="Ir a WhatsApp"
        url="https://wa.me/584123456789"
        backgroundColor="#25D366"
      />
      <ContactCard
        platform="ir a Facebook"
        url="https://www.facebook.com/tu_usuario"
        backgroundColor="#1877F2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
    width: 80,
    height: 80,
    marginBottom: 10,
     alignSelf: 'center',
  },

});

export default ContactCards;
