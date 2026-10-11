import React from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, Image, ScrollView } from 'react-native';

import BtnAcion from '../componentes/BtnAcion'; 

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

const ContactCards = () => {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/contacto.webp')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text 
          style={styles.justifiedText} 
          allowFontScaling={true} 
          maxFontSizeMultiplier={1.4}
        >
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
            text="Ir a Facebook"
            icon="logo-facebook"
            backgroundColor="#1877F2"
            onPress={() => Linking.openURL("https://www.facebook.com/lovemakeupyk/")}
            styleCustom={{ marginBottom: 0, marginTop: 4 }}
        /> 
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 70, 
  },
  container: {
    padding: 16,
    gap: 15,
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    width: BANNER_WIDTH,
    maxWidth: 450,
    height: 165, 
  },
  justifiedText: {
    textAlign: 'justify',
    fontSize: 15,
    color: '#000000ff',
    marginBottom: 5,
    lineHeight: 22,
    width: '100%',
    maxWidth: 450,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
});

export default ContactCards;