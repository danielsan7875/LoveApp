import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Banner({ title, discount, tagline, image }) {
  // Soporta tanto require (local) como uri (remota)
  const imageSource = typeof image === 'string' ? { uri: image } : image;
  return (
    <View style={styles.bannerCard}>
      <Image source={imageSource} style={styles.bannerImage} resizeMode="contain" />
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>{title}</Text>
        <Text style={styles.bannerDiscount}>
          <Text style={{ fontSize: 16 }}>HASTA</Text> {discount}
        </Text>
        <Text style={styles.bannerTagline}>{tagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    width: width * 0.8,
    height: 150,
    backgroundColor: '#FF69B4',
    borderRadius: 15,
    marginRight: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
  },
  bannerImage: {
    width: '45%',
    height: '100%',
  },
  bannerTextContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerDiscount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    marginVertical: 5,
  },
  bannerTagline: {
    color: 'white',
    fontSize: 12,
  },
});
