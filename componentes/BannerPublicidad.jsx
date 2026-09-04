import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export default function BannerPublicidad({ imagenes = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  //  EFECTO PARA EL CAMBIO AUTOMÁTICO (Cada 4 segundos)
  useEffect(() => {
    if (imagenes.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= imagenes.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 4000); // 4000ms = 4 segundos

    return () => clearInterval(interval);
  }, [activeIndex, imagenes.length]);

  // DETECTAR QUÉ BANNER ESTÁ VIENDO EL USUARIO MANUALMENTE
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    if (index !== activeIndex && index >= 0 && index < imagenes.length) {
      setActiveIndex(index);
    }
  };

  if (imagenes.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* EL DESLIZADOR DE IMÁGENES */}
      <FlatList
        ref={flatListRef}
        data={imagenes}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Hace el efecto de "imán" para que encaje por pantalla
        snapToInterval={BANNER_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const imageSource = typeof item === 'string' ? { uri: item } : item;
          return (
            <View style={styles.imageWrapper}>
              <Image source={imageSource} style={styles.image} />
            </View>
          );
        }}
      />

      {/* 3. LOS PUNTOS INDICADORES DINÁMICOS */}
      <View style={styles.dotsContainer}>
        {imagenes.map((_, index) => {
          const isSelected = index === activeIndex;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isSelected ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
  },
  imageWrapper: {
    width: BANNER_WIDTH,
    height: 160, 
    paddingHorizontal: 6, 
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#EE82EE', 
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#000000',
  },
});