import React from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, Image, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BtnAcion from '../componentes/BtnAcion'; 

const { width } = Dimensions.get('window');

const UbicacionContacto = () => {
  const openGoogleMaps = () => {
    const latitude = 10.066843467538288;
    const longitude = -69.32081153623936;
    const label = 'Nuestra ubicación';
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${label}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        
        <View style={styles.bannerContainer}>
          <Image
            source={require('../assets/contacto.webp')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Conéctate con Nosotros</Text>
            <Text style={styles.bannerSubtitle}>Encuéntranos o escríbenos, estamos para servirte</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={22} color="#D81B60" />
            </View>
            <Text style={styles.sectionTitle}>Nuestra Tienda Física</Text>
          </View>

          <Text style={styles.addressText} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            Av. 20 con calles 29 y 30, CC Barquisimeto Plaza, Estado Lara, Venezuela. ¡Ven y visítanos!
          </Text>

         
          <BtnAcion
            text="Ver en Google Maps"
            icon="location-sharp"
            backgroundColor="#4285F4"
            onPress={openGoogleMaps}
            styleCustom={{ marginTop: 8 }}
          /> 
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubbles" size={22} color="#D81B60" />
            </View>
            <Text style={styles.sectionTitle}>Canales Oficiales</Text>
          </View>

          <Text style={styles.supportText} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
            ¿Tienes dudas, necesitas soporte técnico o asesoría con nuestros productos de belleza? Contáctanos de forma directa:
          </Text>

          <View style={styles.buttonsGroup}>
            <BtnAcion
                text="Escríbenos a WhatsApp"
                icon="logo-whatsapp"
                backgroundColor="#25D366"
                onPress={() => Linking.openURL("https://wa.me/584245115414")}
                styleCustom={{ marginBottom: 0, marginTop: 4 }}
            /> 
            <BtnAcion
                text="Síguenos en Instagram"
                icon="logo-instagram"
                backgroundColor="#E1306C"
                onPress={() => Linking.openURL("https://www.instagram.com/lovemakeupyk/")}
                styleCustom={{ marginBottom: 0, marginTop: 4 }}
            /> 
            <BtnAcion
                text="Visítanos en Facebook"
                icon="logo-facebook"
                backgroundColor="#1877F2"
                onPress={() => Linking.openURL("https://www.facebook.com/lovemakeupyk/")}
                styleCustom={{ marginBottom: 0, marginTop: 4 }}
            /> 
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, 
    backgroundColor: '#FFF1F2',
  },
  container: {
    padding: 16,
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  
  bannerContainer: {
    width: '100%',
    maxWidth: 450,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#FCE7F3',
    fontSize: 13,
    textAlign: 'center',
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    maxWidth: 450,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: { ios: 0.08, android: 0.1 }[Platform?.OS || 'ios'],
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D81B60', 
  },
  
  addressText: {
    fontSize: 14.5,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  supportText: {
    fontSize: 14.5,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 14,
  },
  mapIllustration: {
    width: '100%',
    maxWidth: 220,
    height: 160,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonsGroup: {
    gap: 8,
    width: '100%',
  },
});

export default UbicacionContacto;